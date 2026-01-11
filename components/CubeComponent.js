class CubeComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      title: options.title || 'Cube',
      show2D: options.show2D !== false,
      showMoveDisplay: options.showMoveDisplay !== false,
      moves: options.moves || [],
      interval: options.interval || 2000,
      setupAlg: options.setupAlg || '',
      clickable: options.clickable !== false,
      onClick: options.onClick || null,
      mask: options.mask || '',
      stickering: options.stickering || '',
      ...options
    };
    
    this.currentMoveIndex = 0;
    this.animationInterval = null;
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    this.render();
    this.setupEventListeners();
  }
  
  render() {
    const clickableClass = this.options.clickable ? 'clickable' : '';
    
    // Render normal view
    this.container.innerHTML = `
      <div class="cube-component ${clickableClass}">
        <h3>${this.options.title}${this.options.algString ? ` ${this.options.algString}` : ''}</h3>
        ${this.options.showMoveDisplay ? `
          <div class="move-display">
            <span class="move-symbol">${this.options.moves[0] || ''}</span>
          </div>
        ` : ''}
        ${this.options.stickering === 'F2L' ? `
          <div class="controls" style="margin: 6px 0;">
            <button class="variants-button" title="Show FR/BR/BL/FL variants">Variants</button>
          </div>
        ` : ''}
        <div class="cube-container">
          <twisty-player
            class="cube-3d"
            control-panel="none"
            background="none"
            alg=""
            experimental-setup-alg="${this.options.setupAlg}"
            ${this.options.stickering ? `experimental-stickering="${this.options.stickering}"` : ''}
          ></twisty-player>
          ${this.options.show2D ? `
            <twisty-player
              class="cube-2d"
              control-panel="none"
              background="none"
              alg=""
              visualization="2D"
              experimental-setup-alg="${this.options.setupAlg}"
              ${this.options.stickering ? `experimental-stickering="${this.options.stickering}"` : ''}
            ></twisty-player>
          ` : ''}
        </div>
      </div>
    `;
    
    // Store component reference for collapse button
    const cubeComponent = this.container.querySelector('.cube-component');
    if (cubeComponent) {
      cubeComponent.__component = this;
    }
    
    // Get references to the elements
    this.cubeComponent = this.container.querySelector('.cube-component');
    this.moveSymbol = this.container.querySelector('.move-symbol');
    this.cube3D = this.container.querySelector('.cube-3d');
    this.cube2D = this.container.querySelector('.cube-2d');
    this.variantsButton = this.container.querySelector('.variants-button');
    
    // Process algorithm text for syntax highlighting if present
    if (this.options.algString) {
      const titleElement = this.container.querySelector('h3');
      if (titleElement) {
        // Re-process the title element to add move button syntax highlighting
        this.processAlgorithmText(titleElement);
      }
    }
  }
  
  processAlgorithmText(element) {
    // Process algorithm text to convert moves into buttons with trigger grouping
    let originalText = element.textContent;
    let hasChanges = false;
    
    // Color mapping (matching moveButtons.js logic)
    const MOVE_COLORS = {
      normal: '#444',
      prime: '#1565c0',
      double: '#388e3c'
    };
    
    const allMovesRegex = /(?<!\w)([RUFDLBrLufdlbMESxyz]'?2?)(?!\w)/g;
    
    // Helper function to convert a move to a button
    const moveToButton = (move) => {
      let type = 'face';
      let buttonClass = 'move-button';
      let colorType = 'normal';
      
      if (move.includes("'")) {
        buttonClass += ' move-button-prime';
        colorType = 'prime';
        if (move.match(/[RUFDLB]/)) type = 'face-prime';
        else if (move.match(/[rufdlb]/)) type = 'wide-prime';
        else if (move.match(/[MES]/)) type = 'slice-prime';
        else if (move.match(/[xyz]/)) type = 'rotation-prime';
      } else if (move.includes("2")) {
        colorType = 'double';
        if (move.match(/[RUFDLB]/)) type = 'face-double';
        else if (move.match(/[rufdlb]/)) type = 'wide-double';
        else if (move.match(/[MES]/)) type = 'slice-double';
        else if (move.match(/[xyz]/)) type = 'rotation-double';
      } else {
        if (move.match(/[RUFDLB]/)) type = 'face';
        else if (move.match(/[rufdlb]/)) type = 'wide';
        else if (move.match(/[MES]/)) type = 'slice';
        else if (move.match(/[xyz]/)) type = 'rotation';
      }
      
      const color = MOVE_COLORS[colorType];
      const style = color ? ` style="background-color: ${color};"` : '';
      return `<button class="${buttonClass}" data-move="${move}" data-type="${type}"${style}>${move}</button>`;
    };
    
    // Process triggers (parenthesized groups) first
    let text = originalText;
    const processedTriggers = [];
    text = text.replace(/\(([^)]+)\)/g, (match, content) => {
      // Process the moves inside the trigger
      const triggerContent = content.trim();
      const triggerHTML = triggerContent.replace(allMovesRegex, (match, move) => moveToButton(move));
      // Store the original trigger content for the modal
      processedTriggers.push({
        html: `<span class="algorithm-trigger" data-trigger="${triggerContent.replace(/"/g, '&quot;')}">${triggerHTML}</span>`,
        content: triggerContent
      });
      return `__TRIGGER_${processedTriggers.length - 1}__`;
    });
    
    // Replace placeholders with processed triggers
    processedTriggers.forEach((trigger, index) => {
      text = text.replace(`__TRIGGER_${index}__`, trigger.html);
      hasChanges = true;
    });
    
    // Process remaining moves (outside of triggers) - but avoid processing inside trigger spans
    // Split text by trigger spans, process non-trigger parts
    // Updated regex to match trigger spans with data-trigger attribute
    const parts = text.split(/(<span class="algorithm-trigger"[^>]*>.*?<\/span>)/g);
    text = parts.map(part => {
      if (part.trim().startsWith('<span class="algorithm-trigger')) {
        // This is a trigger span, leave it as-is
        return part;
      } else {
        // This is regular text, process moves
        return part.replace(allMovesRegex, (match, move) => {
          hasChanges = true;
          return moveToButton(move);
        });
      }
    }).join('');
    
    if (hasChanges || processedTriggers.length > 0) {
      element.innerHTML = text;
      // Mark as processed to prevent initializeMoveButtons from processing it again
      element.dataset.processed = 'true';
      
      // Add click handlers for triggers
      const triggers = element.querySelectorAll('.algorithm-trigger');
      const componentInstance = this; // Store reference to this
      triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          
          const triggerContent = trigger.dataset.trigger;
          if (triggerContent) {
            // Parse the trigger content into moves
            const moves = triggerContent.trim().split(/\s+/).filter(m => m.length > 0);
            
            // Find the source cube component to get its state
            const cubeComponent = element.closest('.cube-component');
            let sourceCubeState = null;
            if (cubeComponent) {
              const cube3D = cubeComponent.querySelector('.cube-3d');
              if (cube3D) {
                sourceCubeState = {
                  setupAlg: cube3D.getAttribute('experimental-setup-alg') || "x2",
                  currentAlg: cube3D.getAttribute('alg') || "",
                  mask: cube3D.getAttribute('experimental-stickering-mask-orbits') || ""
                };
              }
            }
            
            // Show trigger modal
            componentInstance.showTriggerModal(triggerContent, moves, sourceCubeState);
          }
        });
      });
    }
  }
  
  showTriggerModal(triggerContent, moves, sourceCubeState = null) {
    // Create modal overlay for trigger
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Determine the setup and algorithm to use
    // For triggers, we show the trigger from a solved cube (no setup needed)
    // Just apply the trigger moves directly
    let setupAlg = "";  // Start from solved state
    let currentAlg = moves.join(' ');
    let mask = "";
    
    // For triggers, we don't use sourceCubeState - just show the trigger from solved
    
    // Modal HTML with 2D toggle button
    modalOverlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Trigger: ${triggerContent}</h3>
          <button class="toggle-2d-btn" id="toggle-2d-btn" title="Toggle 2D view">2D</button>
          <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = '';">×</button>
        </div>
        <div class="modal-body">
          <div class="main-move-demo">
            <twisty-player
              class="cube-3d"
              id="trigger-twisty"
              control-panel="none"
              background="none"
              alg="${currentAlg}"
              ${setupAlg ? `experimental-setup-alg="${setupAlg}"` : ''}
              ${mask ? `experimental-stickering-mask-orbits="${mask}"` : ''}
            ></twisty-player>
          </div>
        </div>
      </div>
    `;
    
    // Add to body
    document.body.appendChild(modalOverlay);
    
    // Wait for twisty-player to be ready, then play
    const twisty = modalOverlay.querySelector('#trigger-twisty');
    if (twisty) {
      // Wait a tick for the element to initialize, then play
      setTimeout(() => {
        if (twisty.play) {
          twisty.play();
        }
      }, 100);
    }
    
    // 2D toggle logic
    const toggle2dBtn = modalOverlay.querySelector('#toggle-2d-btn');
    let is2D = false;
    toggle2dBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      is2D = !is2D;
      if (is2D) {
        twisty.setAttribute('visualization', '2D');
      } else {
        twisty.removeAttribute('visualization');
      }
    });
    
    // Add event listeners
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
        document.body.style.overflow = '';
      }
    });
    
    // Add keyboard listener for escape key
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        modalOverlay.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
  }
  
  setupEventListeners() {
    // Get the cube-container element (the small pane around the cube)
    const cubeContainer = this.container.querySelector('.cube-container');
    
    if (cubeContainer) {
      cubeContainer.addEventListener('mouseenter', () => {
        this.startAnimation();
      });
      
      cubeContainer.addEventListener('mouseleave', () => {
        this.stopAnimation();
      });
    }
    
    if (this.options.clickable && this.options.onClick) {
      this.container.addEventListener('click', (e) => {
        e.preventDefault();
        this.options.onClick(this);
      });
    }
    
    // Add click handler for move symbols
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('move-symbol')) {
        e.preventDefault();
        e.stopPropagation();
        const move = e.target.textContent;
        const type = window.getMoveType(move);
        
        // Capture the current state of the 3D cube (or 2D if 3D not available)
        const sourceTwistyPlayer = this.cube3D || this.cube2D;
        const sourceCubeState = sourceTwistyPlayer ? {
          setupAlg: sourceTwistyPlayer.getAttribute('experimental-setup-alg') || "x2",
          currentAlg: sourceTwistyPlayer.getAttribute('alg') || "",
          mask: sourceTwistyPlayer.getAttribute('experimental-stickering-mask-orbits') || "",
          visualization: sourceTwistyPlayer.getAttribute('visualization') || "3D"
        } : null;
        
        window.showMoveDefinitionModal(move, type, sourceCubeState);
      }
    });

    // Variants button for F2L cases
    if (this.variantsButton) {
      this.variantsButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sourceTwistyPlayer = this.cube3D || this.cube2D;
        const sourceCubeState = sourceTwistyPlayer ? {
          setupAlg: sourceTwistyPlayer.getAttribute('experimental-setup-alg') || 'x2',
          currentAlg: sourceTwistyPlayer.getAttribute('alg') || '',
          mask: sourceTwistyPlayer.getAttribute('experimental-stickering-mask-orbits') || '',
          visualization: sourceTwistyPlayer.getAttribute('visualization') || '3D'
        } : null;

        const baseConfig = {
          moves: this.options.moves,
          setupAlg: this.options.setupAlg,
          stickering: this.options.stickering,
          interval: this.options.interval
        };
        if (window.showF2LCaseModal) {
          window.showF2LCaseModal(this.options.title, baseConfig, sourceCubeState);
        }
      });
    }
  }
  

  
  hide() {
    this.container.style.display = 'none';
  }
  
  show() {
    this.container.style.display = 'block';
  }
  
  startAnimation() {
    if (this.isAnimating || this.options.moves.length === 0) return;
    
    this.isAnimating = true;
    
    // Play the full sequence smoothly
    if (this.options.moves.length > 1) {
      const fullAlg = this.options.moves.join(' ');
      
      if (this.cube3D) {
        this.cube3D.setAttribute('alg', fullAlg);
        this.cube3D.play();
      }
      
      if (this.cube2D) {
        this.cube2D.setAttribute('alg', fullAlg);
        this.cube2D.play();
      }
    } else {
      // Single move - use existing logic
      this.playCurrentMove();
      this.advanceMove();
      
      // Then continue with interval
      this.animationInterval = setInterval(() => {
        this.playCurrentMove();
        this.advanceMove();
      }, this.options.interval);
      return;
    }
    
    // For multiple moves, cycle through moves in display
    let currentMoveIndex = 0;
    this.updateMoveDisplay(currentMoveIndex);
    
    // Update display at intervals
    const displayInterval = this.options.interval / this.options.moves.length;
    
    this.animationInterval = setInterval(() => {
      currentMoveIndex = (currentMoveIndex + 1) % this.options.moves.length;
      this.updateMoveDisplay(currentMoveIndex);
    }, displayInterval);
  }
  
  stopAnimation() {
    this.isAnimating = false;
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    
    // Reset to unsolved state
    this.currentMoveIndex = 0;
    if (this.moveSymbol && this.options.moves.length > 0) {
      this.moveSymbol.textContent = this.options.moves[0];
    }
    
    // Reset cubes to setup state (unsolved)
    if (this.cube3D) {
      this.cube3D.setAttribute('alg', '');
      this.cube3D.play();
    }
    
    if (this.cube2D) {
      this.cube2D.setAttribute('alg', '');
      this.cube2D.play();
    }
  }
  
  playCurrentMove() {
    const currentMove = this.options.moves[this.currentMoveIndex];
    if (!currentMove) return;
    
    if (this.moveSymbol) {
      this.moveSymbol.textContent = currentMove;
    }
    
    // Play individual moves
    if (this.cube3D) {
      this.cube3D.setAttribute('alg', currentMove);
      this.cube3D.play();
    }
    
    if (this.cube2D) {
      this.cube2D.setAttribute('alg', currentMove);
      this.cube2D.play();
    }
  }
  
  advanceMove() {
    this.currentMoveIndex = (this.currentMoveIndex + 1) % this.options.moves.length;
  }
  
  updateMoveDisplay(moveIndex) {
    const move = this.options.moves[moveIndex];
    if (move && this.moveSymbol) {
      this.moveSymbol.textContent = move;
    }
  }
  
  // Public method to update moves
  updateMoves(newMoves) {
    this.options.moves = newMoves;
    this.currentMoveIndex = 0;
    if (this.moveSymbol && newMoves.length > 0) {
      this.moveSymbol.textContent = newMoves[0];
    }
  }
  
  // Public method to destroy the component
  destroy() {
    this.stopAnimation();
    this.container.innerHTML = '';
  }
}

// Export for ES6 modules, also make available globally for script tags
if (typeof window !== 'undefined') {
  window.CubeComponent = CubeComponent;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CubeComponent;
} 