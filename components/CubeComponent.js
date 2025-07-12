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
      cumulative: options.cumulative !== false,
      mask: options.mask || '',
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
            alg="${this.options.moves[0] || ''}"
            experimental-setup-alg="${this.options.setupAlg}"
            ${this.options.mask ? `experimental-stickering-mask-orbits="${this.options.mask}"` : ''}
          ></twisty-player>
          ${this.options.show2D ? `
            <twisty-player
              class="cube-2d"
              control-panel="none"
              background="none"
              alg="${this.options.moves[0] || ''}"
              visualization="2D"
              experimental-setup-alg="${this.options.setupAlg}"
              ${this.options.mask ? `experimental-stickering-mask-orbits="${this.options.mask}"` : ''}
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
    this.container.addEventListener('mouseenter', () => {
      this.startAnimation();
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.stopAnimation();
    });
    
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
    
    // Start immediately
    this.playCurrentMove();
    this.advanceMove();
    
    // Then continue with interval
    this.animationInterval = setInterval(() => {
      this.playCurrentMove();
      this.advanceMove();
    }, this.options.interval);
  }
  
  stopAnimation() {
    this.isAnimating = false;
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }
  
  playCurrentMove() {
    const currentMove = this.options.moves[this.currentMoveIndex];
    if (!currentMove) return;
    
    if (this.moveSymbol) {
      this.moveSymbol.textContent = currentMove;
    }
    
    if (this.options.cumulative) {
      // Build up the algorithm progressively
      const movesSoFar = this.options.moves.slice(0, this.currentMoveIndex + 1);
      const cumulativeAlg = movesSoFar.join(' ');
      
      if (this.cube3D) {
        this.cube3D.setAttribute('alg', cumulativeAlg);
        this.cube3D.play();
      }
      
      if (this.cube2D) {
        this.cube2D.setAttribute('alg', cumulativeAlg);
        this.cube2D.play();
      }
    } else {
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
  }
  
  advanceMove() {
    this.currentMoveIndex = (this.currentMoveIndex + 1) % this.options.moves.length;
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