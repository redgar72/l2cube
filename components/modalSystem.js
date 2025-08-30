// Modal system for move definitions and demonstrations
import { getMoveType, getMoveDefinition, captureCubeState, findSourceTwistyPlayer, transformAlgByY, transformMovesByY } from './moveUtils.js';
import { MOVE_COLORS } from './constants.js';

// Function to show modal for move definitions
export function showMoveDefinitionModal(move, type, sourceCubeState = null) {
  console.log('showMoveDefinitionModal called with:', { move, type, sourceCubeState });
  
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  
  // Get move definition based on type
  const moveInfo = getMoveDefinition(move, type);
  
  // Get base move and create all variants
  const baseMove = move.replace(/['2]/g, '');
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");
  
  const moveVariants = [
    { move: baseMove, label: 'Base', active: !isPrime && !isDouble, colorType: 'normal' },
    { move: baseMove + "'", label: 'Prime', active: isPrime, colorType: 'prime' },
    { move: baseMove + "2", label: 'Double', active: isDouble, colorType: 'double' }
  ];
  
  // Determine the setup and algorithm to use
  let setupAlg = "x2";
  let currentAlg = move;
  let mask = "";
  
  if (sourceCubeState) {
    // Use the source cube's state
    setupAlg = sourceCubeState.setupAlg || "x2";
    currentAlg = sourceCubeState.currentAlg || move;
    mask = sourceCubeState.mask || "";
  }
  
  // Modal HTML with both 3D and 2D twisty-players side by side, and a toggle button for 2D in the header
  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin:0;">${move} Move Definition</h3>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="toggle-2d-btn" id="toggle-2d-btn">Hide 2D</button>
          <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = '';">×</button>
        </div>
      </div>
      <div class="modal-body">
        <div class="move-variants-tabs">
          ${moveVariants.map(variant => {
            const color = MOVE_COLORS[variant.colorType];
            const style = color ? ` style=\"background-color: ${color}; color: white;\"` : '';
            return `<button class=\"move-variant-tab${variant.active ? ' active' : ''}\" data-move=\"${variant.move}\"${style}>${variant.label} (${variant.move})</button>`;
          }).join('')}
        </div>
        <div class="move-definition-content side-by-side-cubes">
          <div class="move-cube-demo">
            <twisty-player
              class="cube-3d"
              id="move-def-twisty-3d"
              control-panel="none"
              background="none"
              alg="${currentAlg}"
              experimental-setup-alg="${setupAlg}"
              ${mask ? `experimental-stickering-mask-orbits="${mask}"` : ''}
            ></twisty-player>
          </div>
          <div class="move-cube-demo move-cube-demo-2d">
            <twisty-player
              class="cube-2d"
              id="move-def-twisty-2d"
              visualization="2D"
              control-panel="none"
              background="none"
              alg="${currentAlg}"
              experimental-setup-alg="${setupAlg}"
              ${mask ? `experimental-stickering-mask-orbits="${mask}"` : ''}
            ></twisty-player>
          </div>
          <div class="move-description">
            <h4>${moveInfo.title}</h4>
            <p>${moveInfo.description}</p>
            <div class="move-details">
              <div class="move-detail-item">
                <strong>Direction:</strong> ${moveInfo.direction}
              </div>
              <div class="move-detail-item">
                <strong>Layer:</strong> ${moveInfo.layer}
              </div>
              <div class="move-detail-item">
                <strong>Angle:</strong> ${moveInfo.angle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(modalOverlay);
  
  // 2D toggle logic (show/hide 2D player only)
  const toggle2dBtn = modalOverlay.querySelector('#toggle-2d-btn');
  const twisty2d = modalOverlay.querySelector('#move-def-twisty-2d');
  let is2DVisible = true;
  toggle2dBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    is2DVisible = !is2DVisible;
    if (is2DVisible) {
      twisty2d.style.display = '';
      toggle2dBtn.textContent = 'Hide 2D';
      toggle2dBtn.classList.remove('inactive');
    } else {
      twisty2d.style.display = 'none';
      toggle2dBtn.textContent = 'Show 2D';
      toggle2dBtn.classList.add('inactive');
    }
  });
  
  // Add event listeners
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
      document.body.style.overflow = '';
    }
  });
  
  // Add click handlers for variant tabs
  const variantTabs = modalOverlay.querySelectorAll('.move-variant-tab');
  variantTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const move = tab.dataset.move;
      window.switchMoveVariant(tab, move);
    });
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

// Function to show modal for main move types
export function showMainMoveModal(title, moves, sourceCubeState = null) {
  console.log('showMainMoveModal called', title, moves);
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  
  // Determine the setup and algorithm to use
  let setupAlg = "x2";
  let currentAlg = moves.join(' ');
  let mask = "";
  
  if (sourceCubeState) {
    // Use the source cube's state
    setupAlg = sourceCubeState.setupAlg || "x2";
    currentAlg = sourceCubeState.currentAlg || moves.join(' ');
    mask = sourceCubeState.mask || "";
  }
  
  // Modal HTML with 2D toggle button in the header
  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="toggle-2d-btn" id="toggle-2d-btn" title="Toggle 2D view">2D</button>
        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = '';">×</button>
      </div>
      <div class="modal-body">
        <div class="main-move-demo">
          <twisty-player
            class="cube-3d"
            id="main-move-twisty"
            control-panel="none"
            background="none"
            alg="${currentAlg}"
            experimental-setup-alg="${setupAlg}"
            ${mask ? `experimental-stickering-mask-orbits="${mask}"` : ''}
          ></twisty-player>
        </div>
        <div class="main-move-description">
          <h4>${title}</h4>
          <p>Click on any move notation below to see its definition:</p>
          <div class="move-buttons">
            ${moves.map(move => `<button class="move-button" data-move="${move}" data-type="face">${move}</button>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(modalOverlay);
  
  // Add click handlers for move buttons in this modal
  const moveButtons = modalOverlay.querySelectorAll('.move-button');
  moveButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const move = button.dataset.move;
      const type = button.dataset.type;
      
      // Get the current state from the modal's twisty-player
      const modalTwisty = modalOverlay.querySelector('#main-move-twisty');
      const modalCubeState = modalTwisty ? {
        setupAlg: modalTwisty.getAttribute('experimental-setup-alg') || "x2",
        currentAlg: modalTwisty.getAttribute('alg') || "",
        mask: modalTwisty.getAttribute('experimental-stickering-mask-orbits') || "",
        visualization: modalTwisty.getAttribute('visualization') || "3D"
      } : null;
      
      showMoveDefinitionModal(move, type, modalCubeState);
    });
  });
  
  // 2D toggle logic
  const toggle2dBtn = modalOverlay.querySelector('#toggle-2d-btn');
  const twisty = modalOverlay.querySelector('#main-move-twisty');
  let is2D = false;
  toggle2dBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    is2D = !is2D;
    if (is2D) {
      twisty.setAttribute('show-2d', '');
      twisty.show2D = true;
    } else {
      twisty.removeAttribute('show-2d');
      twisty.show2D = false;
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

// Global function to switch move variants in modals
window.switchMoveVariant = function(button, move) {
  // Update active tab
  const tabs = button.parentElement.querySelectorAll('.move-variant-tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  button.classList.add('active');
  
  // Update cube demo - preserve the current setup and mask
  const cube3d = button.closest('.modal-content').querySelector('.cube-3d');
  const cube2d = button.closest('.modal-content').querySelector('.cube-2d');
  
  if (cube3d) {
    // Get current setup and mask from the cube
    const setupAlg = cube3d.getAttribute('experimental-setup-alg') || "x2";
    const mask = cube3d.getAttribute('experimental-stickering-mask-orbits') || "";
    
    // Apply the new move while preserving setup and mask
    cube3d.setAttribute('alg', move);
    cube3d.setAttribute('experimental-setup-alg', setupAlg);
    if (mask) {
      cube3d.setAttribute('experimental-stickering-mask-orbits', mask);
    }
    cube3d.play();
  }
  
  if (cube2d) {
    // Get current setup and mask from the cube
    const setupAlg = cube2d.getAttribute('experimental-setup-alg') || "x2";
    const mask = cube2d.getAttribute('experimental-stickering-mask-orbits') || "";
    
    // Apply the new move while preserving setup and mask
    cube2d.setAttribute('alg', move);
    cube2d.setAttribute('experimental-setup-alg', setupAlg);
    if (mask) {
      cube2d.setAttribute('experimental-stickering-mask-orbits', mask);
    }
    cube2d.play();
  }
  
  // Update description
  const type = window.getMoveType(move);
  const moveInfo = window.getMoveDefinition(move, type);
  const description = button.closest('.modal-content').querySelector('.move-description');
  
  if (description) {
    description.querySelector('h4').textContent = moveInfo.title;
    description.querySelector('p').textContent = moveInfo.description;
    description.querySelectorAll('.move-detail-item').forEach((item, index) => {
      const details = [moveInfo.direction, moveInfo.layer, moveInfo.angle];
      if (details[index]) {
        item.innerHTML = `<strong>${item.querySelector('strong').textContent}</strong> ${details[index]}`;
      }
    });
  }
}; 

// Modal for F2L case with orientation variants (FR base, plus BR/BL/FL via y-rotations)
export function showF2LCaseModal(caseTitle, baseConfig, sourceCubeState = null) {
  const { moves = [], setupAlg = 'x2', stickering = 'F2L', interval } = baseConfig || {};
  // Determine base state
  const initialSetup = sourceCubeState?.setupAlg || setupAlg || 'x2';
  const initialMask = sourceCubeState?.mask || '';
  const baseAlg = Array.isArray(moves) ? moves.join(' ') : (sourceCubeState?.currentAlg || '');

  // Build variants by y rotations, transforming the setup/moves instead of appending y
  const variants = [
    { key: 'FR', label: 'FR', rotation: null, setup: initialSetup, execAlg: baseAlg, displayAlg: baseAlg },
    { key: 'BR', label: 'BR', rotation: 'y', setup: transformAlgByY(initialSetup, 'y'), execAlg: transformAlgByY(baseAlg, 'y'), displayAlg: transformAlgByY(baseAlg, 'y') },
    { key: 'BL', label: 'BL', rotation: 'y2', setup: transformAlgByY(initialSetup, 'y2'), execAlg: transformAlgByY(baseAlg, 'y2'), displayAlg: transformAlgByY(baseAlg, 'y2') },
    { key: 'FL', label: 'FL', rotation: "y'", setup: transformAlgByY(initialSetup, "y'"), execAlg: transformAlgByY(baseAlg, "y'"), displayAlg: transformAlgByY(baseAlg, "y'") }
  ];

  // Create modal
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">${caseTitle} – Variants</h3>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="toggle-2d-btn" id="toggle-2d-btn">Hide 2D</button>
          <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow='';">×</button>
        </div>
      </div>
      <div class="modal-body">
        <div class="move-variants-tabs">
          ${variants.map((v, i) => `<button class="move-variant-tab${i===0?' active':''}" data-idx="${i}">${v.label}</button>`).join('')}
        </div>
        <div class="move-definition-content side-by-side-cubes">
          <div class="move-cube-demo">
            <twisty-player class="cube-3d" id="f2l-variants-3d" control-panel="none" background="none" alg="${variants[0].execAlg}" experimental-setup-alg="${variants[0].setup}" ${stickering?`experimental-stickering="${stickering}"`:''} ${initialMask?`experimental-stickering-mask-orbits="${initialMask}"`:''}></twisty-player>
          </div>
          <div class="move-cube-demo move-cube-demo-2d">
            <twisty-player class="cube-2d" id="f2l-variants-2d" visualization="2D" control-panel="none" background="none" alg="${variants[0].execAlg}" experimental-setup-alg="${variants[0].setup}" ${stickering?`experimental-stickering="${stickering}"`:''} ${initialMask?`experimental-stickering-mask-orbits="${initialMask}"`:''}></twisty-player>
          </div>
          <div class="move-description">
            <h4>${caseTitle}</h4>
            <p>Use the tabs to view the same case in different slots by y-rotating the cube.</p>
            <div class="move-details"><div class="move-detail-item"><strong>Alg:</strong> <span id="f2l-variant-alg">${variants[0].displayAlg}</span></div></div>
          </div>
        </div>
      </div>
    </div>`;

  document.body.appendChild(modalOverlay);

  const toggle2dBtn = modalOverlay.querySelector('#toggle-2d-btn');
  const cube3d = modalOverlay.querySelector('#f2l-variants-3d');
  const cube2d = modalOverlay.querySelector('#f2l-variants-2d');
  const algSpan = modalOverlay.querySelector('#f2l-variant-alg');
  let is2DVisible = true;
  toggle2dBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    is2DVisible = !is2DVisible;
    if (is2DVisible) {
      cube2d.style.display = '';
      toggle2dBtn.textContent = 'Hide 2D';
      toggle2dBtn.classList.remove('inactive');
    } else {
      cube2d.style.display = 'none';
      toggle2dBtn.textContent = 'Show 2D';
      toggle2dBtn.classList.add('inactive');
    }
  });

  const tabs = modalOverlay.querySelectorAll('.move-variant-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const idx = parseInt(tab.dataset.idx, 10);
      const v = variants[idx];
      // Update cubes preserving stickering/mask
      cube3d.setAttribute('experimental-setup-alg', v.setup);
      cube3d.setAttribute('alg', v.execAlg);
      cube3d.play();
      if (cube2d) {
        cube2d.setAttribute('experimental-setup-alg', v.setup);
        cube2d.setAttribute('alg', v.execAlg);
        cube2d.play();
      }
      if (algSpan) algSpan.textContent = v.displayAlg;
    });
  });

  // Close handlers
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
      document.body.style.overflow = '';
    }
  });
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      modalOverlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);
  document.body.style.overflow = 'hidden';
}