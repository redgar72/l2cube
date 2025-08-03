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
        <h3>${this.options.title}</h3>
        ${this.options.showMoveDisplay ? `
          <div class="move-display">
            <span class="move-symbol">${this.options.moves[0] || ''}</span>
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