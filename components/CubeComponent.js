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
      expandable: options.expandable !== false,
      expandedMoves: options.expandedMoves || [],
      onExpand: options.onExpand || null,
      onCollapse: options.onCollapse || null,
      ...options
    };
    
    this.currentMoveIndex = 0;
    this.animationInterval = null;
    this.isAnimating = false;
    this.isExpanded = false;
    
    this.init();
  }
  
  init() {
    this.render();
    this.setupEventListeners();
  }
  
  render() {
    const clickableClass = this.options.clickable ? 'clickable' : '';
    const expandedClass = this.isExpanded ? 'expanded' : '';
    
    if (this.isExpanded && this.options.expandedMoves.length > 0) {
      // Render expanded view with multiple cubes in the same row
      this.container.innerHTML = `
        <div class="cube-component ${clickableClass} ${expandedClass}">
          <h3>${this.options.title}</h3>
          <div class="expanded-cubes">
            ${this.options.expandedMoves.map((move, index) => `
              <div class="expanded-cube-item">
                <div class="move-display">
                  <span class="move-symbol">${move}</span>
                </div>
                <twisty-player
                  class="cube-3d"
                  control-panel="none"
                  background="none"
                  alg="${move}"
                  experimental-setup-alg="${this.options.setupAlg}"
                ></twisty-player>
              </div>
            `).join('')}
          </div>
          <button class="collapse-btn" onclick="this.closest('.cube-component').__component.collapse()">×</button>
        </div>
      `;
      
      // Add click handler for expanded view to play all moves simultaneously
      const expandedComponent = this.container.querySelector('.cube-component');
      if (expandedComponent) {
        expandedComponent.addEventListener('click', (e) => {
          if (e.target.closest('.collapse-btn')) return; // Don't trigger on collapse button
          this.playAllExpandedMoves();
        });
        
        // Make the expanded cubes non-interactive by preventing their click events
        const expandedCubes = expandedComponent.querySelectorAll('.expanded-cube-item');
        expandedCubes.forEach(cube => {
          cube.style.pointerEvents = 'none';
        });
      }
    } else {
      // Render normal view
      this.container.innerHTML = `
        <div class="cube-component ${clickableClass} ${expandedClass}">
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
            ></twisty-player>
            ${this.options.show2D ? `
              <twisty-player
                class="cube-2d"
                control-panel="none"
                background="none"
                alg="${this.options.moves[0] || ''}"
                visualization="2D"
                experimental-setup-alg="${this.options.setupAlg}"
              ></twisty-player>
            ` : ''}
          </div>
        </div>
      `;
    }
    
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
      if (!this.isExpanded) {
        this.startAnimation();
      }
    });
    
    this.container.addEventListener('mouseleave', () => {
      if (!this.isExpanded) {
        this.stopAnimation();
      }
    });
    
    if (this.options.clickable && this.options.onClick) {
      this.container.addEventListener('click', (e) => {
        e.preventDefault();
        this.options.onClick(this);
      });
    }
    
    if (this.options.expandable && this.options.onExpand) {
      this.container.addEventListener('click', (e) => {
        e.preventDefault();
        this.expand();
      });
    }
  }
  
  expand() {
    if (this.options.onExpand) {
      this.options.onExpand(this);
    }
  }
  
  collapse() {
    this.isExpanded = false;
    this.render();
    this.setupEventListeners();
    if (this.options.onCollapse) {
      this.options.onCollapse(this);
    }
  }
  
  setExpandedMoves(moves) {
    this.options.expandedMoves = moves;
    this.isExpanded = true;
    this.render();
    this.setupEventListeners();
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
    
    if (this.cube3D) {
      this.cube3D.alg = currentMove;
      this.cube3D.play();
    }
    
    if (this.cube2D) {
      this.cube2D.alg = currentMove;
      this.cube2D.play();
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

  playAllExpandedMoves() {
    if (!this.isExpanded || !this.options.expandedMoves.length) return;
    
    const cubes = this.container.querySelectorAll('.expanded-cube-item .cube-3d');
    const moveSymbols = this.container.querySelectorAll('.expanded-cube-item .move-symbol');
    
    cubes.forEach((cube, index) => {
      const move = this.options.expandedMoves[index];
      if (cube && move) {
        cube.alg = move;
        cube.play();
      }
    });
    
    // Update move symbols if needed
    moveSymbols.forEach((symbol, index) => {
      const move = this.options.expandedMoves[index];
      if (symbol && move) {
        symbol.textContent = move;
      }
    });
  }
} 