// Static JavaScript for Rubik's Cube Tutorial
// Uses Twisty CDN directly without bundled dependencies

// Mask enums for different cube views
const CUBE_MASKS = {
  // Show only cross pieces (white edges and centers)
  CROSS_ONLY: "CORNERS:DDDDDDDD,EDGES:----DDDDDDDD,CENTERS:-DDDDD",
  
  // Show only corners (for corner-specific algorithms)
  CORNERS_ONLY: "CORNERS:DDDDDDDD,EDGES:DDDDDDDDDDDD,CENTERS:DDDDDD",
  
  // Show only edges (for edge-specific algorithms)
  EDGES_ONLY: "CORNERS:DDDDDDDD,EDGES:DDDDDDDDDDDD,CENTERS:DDDDDD",
  
  // Show only F2L pieces (corners and edges, hide centers)
  F2L_ONLY: "CORNERS:DDDDDDDD,EDGES:DDDDDDDDDDDD,CENTERS:DDDDDD",
  
  // Show only OLL pieces (top layer)
  OLL_ONLY: "CORNERS:DDDDDDDD,EDGES:DDDDDDDDDDDD,CENTERS:DDDDDD",
  
  // Show only PLL pieces (top layer)
  PLL_ONLY: "CORNERS:DDDDDDDD,EDGES:DDDDDDDDDDDD,CENTERS:DDDDDD",
  
  // No mask (show all pieces)
  NONE: ""
};

// Move type configurations for easier management
const MOVE_CONFIGS = {
  face: {
    moves: ['R', 'U', 'F', 'L', 'D', 'B'],
    containerPrefix: '',
    titleSuffix: ' Move',
    defaultInterval: 3000
  },
  wide: {
    moves: ['r', 'u', 'f', 'l', 'd', 'b'],
    containerPrefix: '-wide',
    titleSuffix: ' Move',
    defaultInterval: 3000
  },
  slice: {
    moves: ['M', 'E', 'S'],
    containerPrefix: '-slice',
    titleSuffix: ' Move',
    defaultInterval: 3000
  },
  rotation: {
    moves: ['x', 'y', 'z'],
    containerPrefix: '-rotation',
    titleSuffix: ' Rotation',
    defaultInterval: 3000
  }
};

// Move definitions data structure
const MOVE_DEFINITIONS = {
  // Face turns
  R: { title: 'Right Face Turn', description: 'Turns the right face of the cube clockwise.', direction: 'Clockwise', layer: 'Right face', angle: '90°' },
  U: { title: 'Up Face Turn', description: 'Turns the upper face of the cube clockwise.', direction: 'Clockwise', layer: 'Upper face', angle: '90°' },
  F: { title: 'Front Face Turn', description: 'Turns the front face of the cube clockwise.', direction: 'Clockwise', layer: 'Front face', angle: '90°' },
  L: { title: 'Left Face Turn', description: 'Turns the left face of the cube clockwise.', direction: 'Clockwise', layer: 'Left face', angle: '90°' },
  D: { title: 'Down Face Turn', description: 'Turns the bottom face of the cube clockwise.', direction: 'Clockwise', layer: 'Bottom face', angle: '90°' },
  B: { title: 'Back Face Turn', description: 'Turns the back face of the cube clockwise.', direction: 'Clockwise', layer: 'Back face', angle: '90°' },
  
  // Wide turns
  r: { title: 'Right Wide Turn', description: 'Turns the right face and the middle layer together.', direction: 'Clockwise', layer: 'Right face + middle layer', angle: '90°' },
  u: { title: 'Up Wide Turn', description: 'Turns the upper face and the middle layer together.', direction: 'Clockwise', layer: 'Upper face + middle layer', angle: '90°' },
  f: { title: 'Front Wide Turn', description: 'Turns the front face and the middle layer together.', direction: 'Clockwise', layer: 'Front face + middle layer', angle: '90°' },
  l: { title: 'Left Wide Turn', description: 'Turns the left face and the middle layer together.', direction: 'Clockwise', layer: 'Left face + middle layer', angle: '90°' },
  d: { title: 'Down Wide Turn', description: 'Turns the bottom face and the middle layer together.', direction: 'Clockwise', layer: 'Bottom face + middle layer', angle: '90°' },
  b: { title: 'Back Wide Turn', description: 'Turns the back face and the middle layer together.', direction: 'Clockwise', layer: 'Back face + middle layer', angle: '90°' },
  
  // Slice turns
  M: { title: 'Middle Slice Turn', description: 'Turns the middle layer between left and right faces.', direction: 'Clockwise', layer: 'Middle slice', angle: '90°' },
  E: { title: 'Equatorial Slice Turn', description: 'Turns the middle layer between up and down faces.', direction: 'Clockwise', layer: 'Equatorial slice', angle: '90°' },
  S: { title: 'Standing Slice Turn', description: 'Turns the middle layer between front and back faces.', direction: 'Clockwise', layer: 'Standing slice', angle: '90°' },
  
  // Rotations
  x: { title: 'X Rotation', description: 'Rotates the entire cube around the X-axis (left-right).', direction: 'Clockwise', layer: 'Entire cube', angle: '90°' },
  y: { title: 'Y Rotation', description: 'Rotates the entire cube around the Y-axis (up-down).', direction: 'Clockwise', layer: 'Entire cube', angle: '90°' },
  z: { title: 'Z Rotation', description: 'Rotates the entire cube around the Z-axis (front-back).', direction: 'Clockwise', layer: 'Entire cube', angle: '90°' }
};

// Helper function to create CubeComponent with default settings
function createCubeComponent(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  const defaultOptions = {
    show2D: false,
    showMoveDisplay: true,
    interval: 3000,
    setupAlg: "x2",
    cumulative: false,
    mask: CUBE_MASKS.NONE
  };
  
  return new CubeComponent(container, { ...defaultOptions, ...options });
}

// Helper function to create multiple CubeComponents from a configuration
function createCubeComponentsFromConfig(configs) {
  return configs.map(config => {
    const { id, ...options } = config;
    return createCubeComponent(id, options);
  }).filter(Boolean);
}

// Helper function to get move type from move string
function getMoveType(move) {
  const baseMove = move.replace(/['2]/g, '');
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");
  
  if (baseMove.match(/[RUFDLB]/)) {
    return isPrime ? 'face-prime' : isDouble ? 'face-double' : 'face';
  } else if (baseMove.match(/[rufdlb]/)) {
    return isPrime ? 'wide-prime' : isDouble ? 'wide-double' : 'wide';
  } else if (baseMove.match(/[MES]/)) {
    return isPrime ? 'slice-prime' : isDouble ? 'slice-double' : 'slice';
  } else if (baseMove.match(/[xyz]/)) {
    return isPrime ? 'rotation-prime' : isDouble ? 'rotation-double' : 'rotation';
  }
  return 'face';
}

// Helper function to get move definition with modifiers
function getMoveDefinition(move, type) {
  const baseMove = move.replace(/['2]/g, '');
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");
  
  let definition = MOVE_DEFINITIONS[baseMove.toUpperCase()] || MOVE_DEFINITIONS[baseMove] || {
    title: `${move} Move`,
    description: `Definition for ${move} move.`,
    direction: 'Unknown',
    layer: 'Unknown',
    angle: 'Unknown'
  };
  
  // Apply modifiers for prime and double moves
  if (isPrime) {
    definition = {
      ...definition,
      title: definition.title.replace('Turn', 'Turn (Prime)'),
      description: definition.description.replace('clockwise', 'counter-clockwise'),
      direction: 'Counter-clockwise'
    };
  } else if (isDouble) {
    definition = {
      ...definition,
      title: definition.title.replace('Turn', 'Turn (Double)'),
      description: definition.description.replace('clockwise', '180 degrees'),
      angle: '180°'
    };
  }
  
  return definition;
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing components...");
  
  // Initialize cube components
  initializeCubeComponents();
  initializeNavigation();
  initializeMoveButtons();
  
  console.log("Initialization complete!");
});

function scrollToSection(sectionClass) {
  const section = document.querySelector(`.${sectionClass}`);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

function initializeNavigation() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navSectionTitles = document.querySelectorAll('.nav-section-title');

  // Toggle sidebar
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // Handle navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.querySelector(`.${targetId}`);
      
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Toggle submenu sections
  navSectionTitles.forEach(title => {
    title.addEventListener('click', () => {
      const submenu = title.nextElementSibling;
      submenu.classList.toggle('expanded');
      title.classList.toggle('expanded');
    });
  });

  // Auto-highlight current section based on scroll position
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.className;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

function initializeCubeComponents() {
  // Welcome section - random moves with both 3D and 2D
  createCubeComponent("welcome-cube-container", {
    title: "3D & 2D View",
    show2D: true,
    showMoveDisplay: true,
    moves: ["R", "U", "F", "L", "D", "B", "R'", "U'", "F'", "L'", "D'", "B'"],
    interval: 1500,
    setupAlg: "x2"
  });

  // Main move type demonstrations - clickable to scroll to breakdown
  const mainMoveConfigs = [
    {
      id: "face-turns-container",
      title: "Face Turns",
      moves: ["R", "U", "F", "L", "D", "B"],
      interval: 2000,
      clickable: true,
      onClick: () => scrollToSection('face-turns-breakdown')
    },
    {
      id: "wide-turns-container", 
      title: "Wide Turns",
      moves: ["r", "u", "f", "l", "d", "b"],
      interval: 2000,
      clickable: true,
      onClick: () => scrollToSection('wide-turns-breakdown')
    },
    {
      id: "slice-turns-container",
      title: "Slice Turns", 
      moves: ["M", "E", "S"],
      interval: 2000,
      clickable: true,
      onClick: () => scrollToSection('slice-turns-breakdown')
    },
    {
      id: "rotations-container",
      title: "Rotations",
      moves: ["x", "y", "z"], 
      interval: 2000,
      clickable: true,
      onClick: () => scrollToSection('rotations-breakdown')
    }
  ];

  createCubeComponentsFromConfig(mainMoveConfigs);

  // Initialize individual move components in breakdown sections
  initializeBreakdownComponents();
  
  // Initialize cross section components
  initializeCrossComponents();
}

function initializeBreakdownComponents() {
  // Face turns breakdown - individual moves
  const faceMoves = [
    { id: 'r-move-container', move: 'R', title: 'R Move' },
    { id: 'u-move-container', move: 'U', title: 'U Move' },
    { id: 'f-move-container', move: 'F', title: 'F Move' },
    { id: 'l-move-container', move: 'L', title: 'L Move' },
    { id: 'd-move-container', move: 'D', title: 'D Move' },
    { id: 'b-move-container', move: 'B', title: 'B Move' }
  ];

  createCubeComponentsFromConfig(faceMoves.map(({ id, move, title }) => ({
    id,
    title,
    moves: [move],
    interval: 3000
  })));

  // Wide turns breakdown - individual moves
  const wideMoves = [
    { id: 'r-wide-container', move: 'r', title: 'r Move' },
    { id: 'u-wide-container', move: 'u', title: 'u Move' },
    { id: 'f-wide-container', move: 'f', title: 'f Move' },
    { id: 'l-wide-container', move: 'l', title: 'l Move' },
    { id: 'd-wide-container', move: 'd', title: 'd Move' },
    { id: 'b-wide-container', move: 'b', title: 'b Move' }
  ];

  createCubeComponentsFromConfig(wideMoves.map(({ id, move, title }) => ({
    id,
    title,
    moves: [move],
    interval: 3000
  })));

  // Slice turns breakdown - individual moves
  const sliceMoves = [
    { id: 'm-slice-container', move: 'M', title: 'M Move' },
    { id: 'e-slice-container', move: 'E', title: 'E Move' },
    { id: 's-slice-container', move: 'S', title: 'S Move' }
  ];

  createCubeComponentsFromConfig(sliceMoves.map(({ id, move, title }) => ({
    id,
    title,
    moves: [move],
    interval: 3000
  })));

  // Rotations breakdown - individual moves
  const rotationMoves = [
    { id: 'x-rotation-container', move: 'x', title: 'x Rotation' },
    { id: 'y-rotation-container', move: 'y', title: 'y Rotation' },
    { id: 'z-rotation-container', move: 'z', title: 'z Rotation' }
  ];

  createCubeComponentsFromConfig(rotationMoves.map(({ id, move, title }) => ({
    id,
    title,
    moves: [move],
    interval: 3000
  })));
} 

// Utility function to convert move notation to clickable buttons
function initializeMoveButtons() {
  // Find all text content that might contain move notation
  const textElements = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, div:not(.cube-component):not(.modal-overlay)');
  
  textElements.forEach(element => {
    // Skip if already processed or has children
    if (element.children.length > 0 || element.dataset.processed) return;
    
    let text = element.textContent;
    let hasChanges = false;
    
    // Create a single regex that matches all move patterns at once
    const allMovesRegex = /(?<!\w)([RUFDLBrLufdlbMESxyz]'?2?)(?!\w)/g;
    
    text = text.replace(allMovesRegex, (match, move) => {
      // Determine the type and styling based on the move
      let type = 'face';
      let buttonClass = 'move-button';
      
      if (move.includes("'")) {
        buttonClass += ' move-button-prime';
        if (move.match(/[RUFDLB]/)) type = 'face-prime';
        else if (move.match(/[rufdlb]/)) type = 'wide-prime';
        else if (move.match(/[MES]/)) type = 'slice-prime';
        else if (move.match(/[xyz]/)) type = 'rotation-prime';
      } else if (move.includes("2")) {
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
      
      hasChanges = true;
      return `<button class="${buttonClass}" data-move="${move}" data-type="${type}">${move}</button>`;
    });
    
    if (hasChanges) {
      element.innerHTML = text;
      element.dataset.processed = 'true'; // Mark as processed
    }
  });
  
  // Add click handlers to move buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('move-button')) {
      const move = e.target.dataset.move;
      const type = e.target.dataset.type;
      showMoveDefinitionModal(move, type);
    }
  });
}

function showMoveDefinitionModal(move, type) {
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
    { move: baseMove, label: 'Base', active: !isPrime && !isDouble },
    { move: baseMove + "'", label: 'Prime', active: isPrime },
    { move: baseMove + "2", label: 'Double', active: isDouble }
  ];
  
  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${move} Move Definition</h3>
        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = '';">×</button>
      </div>
      <div class="modal-body">
        <div class="move-variants-tabs">
          ${moveVariants.map(variant => `
            <button class="move-variant-tab ${variant.active ? 'active' : ''}" 
                    data-move="${variant.move}">
              ${variant.label} (${variant.move})
            </button>
          `).join('')}
        </div>
        <div class="move-definition-content">
          <div class="move-cube-demo">
            <twisty-player
              class="cube-3d"
              control-panel="none"
              background="none"
              alg="${move}"
              experimental-setup-alg="x2"
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

// Make functions globally accessible
window.switchMoveVariant = function(button, move) {
  // Update active tab
  const tabs = button.parentElement.querySelectorAll('.move-variant-tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  button.classList.add('active');
  
  // Update cube demo
  const cube = button.closest('.modal-content').querySelector('.cube-3d');
  if (cube) {
    cube.alg = move;
    cube.play();
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

window.getMoveType = getMoveType;
window.getMoveDefinition = getMoveDefinition;
window.showMoveDefinitionModal = showMoveDefinitionModal;

function initializeCrossComponents() {
  // Cross component configurations
  const crossConfigs = [
    // One move insert cases
    {
      id: 'basic-cross-right',
      title: 'One Move Insert: R',
      moves: ['R'],
      setupAlg: "z2 R'",
      mask: CUBE_MASKS.CROSS_ONLY
    },
    {
      id: 'basic-cross-left',
      title: 'One Move Insert: L\'',
      moves: ['L\''],
      setupAlg: "z2 L",
      mask: CUBE_MASKS.CROSS_ONLY
    },
    {
      id: 'basic-cross-front',
      title: 'One Move Insert: L',
      moves: ['L'],
      setupAlg: "z2 L'",
      mask: CUBE_MASKS.CROSS_ONLY
    },
    {
      id: 'basic-cross-back',
      title: 'One Move Insert: R\'',
      moves: ['R\''],
      setupAlg: "z2 R",
      mask: CUBE_MASKS.CROSS_ONLY
    },
    
    // Daisy method steps
    {
      id: 'daisy-step1',
      title: 'Daisy Pattern',
      moves: ['R', 'U', 'R\'', 'F', 'U', 'F\''],
      interval: 1500,
      setupAlg: 'z',
      cumulative: true,
      mask: CUBE_MASKS.CROSS_ONLY
    },
    {
      id: 'daisy-step2',
      title: 'Convert to Cross',
      moves: ['F2', 'R2', 'B2', 'L2'],
      interval: 2000,
      setupAlg: 'z',
      mask: CUBE_MASKS.CROSS_ONLY
    },
    
    // Cross + 1 cases
    {
      id: 'cross-plus-1-case1',
      title: 'Cross + 1 (UFR)',
      moves: ['R', 'U', 'R\'', 'U', 'R', 'U\'', 'R\''],
      interval: 1000,
      setupAlg: 'z',
      cumulative: true,
      mask: CUBE_MASKS.CROSS_ONLY
    },
    {
      id: 'cross-plus-1-case2',
      title: 'Cross + 1 (UFL)',
      moves: ['L\'', 'U\'', 'L', 'U\'', 'L\'', 'U', 'L'],
      interval: 1000,
      setupAlg: 'z',
      cumulative: true,
      mask: CUBE_MASKS.CROSS_ONLY
    },
    
    // X-Cross example
    {
      id: 'x-cross-example',
      title: 'X-Cross Example',
      moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F', 'U', 'R', 'U\'', 'R\''],
      interval: 800,
      setupAlg: 'z',
      cumulative: true,
      mask: CUBE_MASKS.CROSS_ONLY
    },
    
    // Planning example
    {
      id: 'planning-example',
      title: 'Cross Planning',
      moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'],
      interval: 1200,
      setupAlg: 'z',
      cumulative: true,
      mask: CUBE_MASKS.CROSS_ONLY
    },
    
    // Cross patterns
    {
      id: 'white-cross',
      title: 'White Cross',
      moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'],
      interval: 1500,
      setupAlg: 'z',
      mask: CUBE_MASKS.CROSS_ONLY
    },
    {
      id: 'yellow-cross',
      title: 'Yellow Cross',
      moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'],
      interval: 1500,
      setupAlg: 'z',
      mask: CUBE_MASKS.CROSS_ONLY
    },
    
    // OLL patterns
    {
      id: 'line-pattern',
      title: 'Line Pattern',
      moves: ['F', 'R', 'U', 'R\'', 'U\'', 'F\''],
      interval: 1200,
      setupAlg: 'z',
      mask: CUBE_MASKS.CROSS_ONLY
    },
    {
      id: 'l-pattern',
      title: 'L-Pattern',
      moves: ['F', 'U', 'R', 'U\'', 'R\'', 'F\''],
      interval: 1200,
      setupAlg: 'z',
      mask: CUBE_MASKS.CROSS_ONLY
    },
    {
      id: 'dot-pattern',
      title: 'Dot Pattern',
      moves: ['F', 'R', 'U', 'R\'', 'U\'', 'F\'', 'U2', 'F', 'R', 'U', 'R\'', 'U\'', 'F\''],
      interval: 600,
      setupAlg: 'z',
      mask: CUBE_MASKS.CROSS_ONLY
    },
    
    // Practice scrambles
    {
      id: 'easy-scramble',
      title: 'Easy Cross',
      moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'],
      interval: 1000,
      setupAlg: 'z2',
      cumulative: true,
      mask: CUBE_MASKS.CROSS_ONLY
    },
    {
      id: 'medium-scramble',
      title: 'Medium Cross',
      moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'],
      interval: 1000,
      setupAlg: 'z2',
      cumulative: true,
      mask: CUBE_MASKS.CROSS_ONLY
    },
    {
      id: 'hard-scramble',
      title: 'Hard Cross',
      moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F', 'U', 'R', 'U\'', 'R\''],
      interval: 800,
      setupAlg: 'z2',
      cumulative: true,
      mask: CUBE_MASKS.CROSS_ONLY
    }
  ];

  createCubeComponentsFromConfig(crossConfigs);
} 