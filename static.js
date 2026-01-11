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

// Component configurations organized by section
const COMPONENT_CONFIGS = {
  welcome: {
    sectionClass: 'welcome-section',
    title: 'Welcome!',
    description: 'This is your reference cube in solved state. Try clicking on move notation like R, U\', or F2 to see their definitions!',
    additionalText: 'Basic moves include face turns (R, U\', F2, L, D, B), wide turns (r, u\', f, l, d, b), slice turns (M, E\', S2), and rotations (x, y, z\').',
    containerClass: 'cube-container',
    components: [
      {
        id: "welcome-cube-container",
        title: "3D & 2D View",
        show2D: true,
        showMoveDisplay: true,
        moves: ["R", "U", "F", "L", "D", "B", "R'", "U'", "F'", "L'", "D'", "B'"],
        interval: 1500,
        setupAlg: "x2"
      }
    ]
  },
  
  mainMoves: {
    sectionClass: 'main-moves',
    title: 'Basic Move Types',
    description: 'Click on any move type to see detailed breakdowns.',
    containerClass: 'moves-grid',
    components: [
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
    ]
  },
  
  faceTurnsBreakdown: {
    sectionClass: 'face-turns-breakdown',
    title: 'Face Turns Breakdown',
    description: 'Individual face turn moves',
    containerClass: 'moves-grid',
    components: [
      { id: 'r-move-container', move: 'R', title: 'R Move', moves: ['R'], interval: 3000 },
      { id: 'u-move-container', move: 'U', title: 'U Move', moves: ['U'], interval: 3000 },
      { id: 'f-move-container', move: 'F', title: 'F Move', moves: ['F'], interval: 3000 },
      { id: 'l-move-container', move: 'L', title: 'L Move', moves: ['L'], interval: 3000 },
      { id: 'd-move-container', move: 'D', title: 'D Move', moves: ['D'], interval: 3000 },
      { id: 'b-move-container', move: 'B', title: 'B Move', moves: ['B'], interval: 3000 }
    ]
  },
  
  wideTurnsBreakdown: {
    sectionClass: 'wide-turns-breakdown',
    title: 'Wide Turns Breakdown',
    description: 'Individual wide turn moves',
    containerClass: 'moves-grid',
    components: [
      { id: 'r-wide-container', move: 'r', title: 'r Move', moves: ['r'], interval: 3000 },
      { id: 'u-wide-container', move: 'u', title: 'u Move', moves: ['u'], interval: 3000 },
      { id: 'f-wide-container', move: 'f', title: 'f Move', moves: ['f'], interval: 3000 },
      { id: 'l-wide-container', move: 'l', title: 'l Move', moves: ['l'], interval: 3000 },
      { id: 'd-wide-container', move: 'd', title: 'd Move', moves: ['d'], interval: 3000 },
      { id: 'b-wide-container', move: 'b', title: 'b Move', moves: ['b'], interval: 3000 }
    ]
  },
  
  sliceTurnsBreakdown: {
    sectionClass: 'slice-turns-breakdown',
    title: 'Slice Turns Breakdown',
    description: 'Individual slice turn moves',
    containerClass: 'moves-grid',
    components: [
      { id: 'm-slice-container', move: 'M', title: 'M Move', moves: ['M'], interval: 3000 },
      { id: 'e-slice-container', move: 'E', title: 'E Move', moves: ['E'], interval: 3000 },
      { id: 's-slice-container', move: 'S', title: 'S Move', moves: ['S'], interval: 3000 }
    ]
  },
  
  rotationsBreakdown: {
    sectionClass: 'rotations-breakdown',
    title: 'Rotations Breakdown',
    description: 'Individual rotation moves',
    containerClass: 'moves-grid',
    components: [
      { id: 'x-rotation-container', move: 'x', title: 'x Rotation', moves: ['x'], interval: 3000 },
      { id: 'y-rotation-container', move: 'y', title: 'y Rotation', moves: ['y'], interval: 3000 },
      { id: 'z-rotation-container', move: 'z', title: 'z Rotation', moves: ['z'], interval: 3000 }
    ]
  },
  
  moveDefinitions: {
    sectionClass: 'move-definitions',
    title: 'Move Definitions',
    description: 'Click on any move notation to see its definition and demonstration.',
    containerClass: 'move-definitions-container',
    components: []
  },
  
  f2l: {
    sectionClass: 'f2l',
    title: 'F2L (First Two Layers)',
    description: 'Solving the first two layers efficiently',
    introText: 'F2L is the second step of CFOP method. It involves solving the corners and edges of the first two layers simultaneously.',
    components: []
  },
  
  cross: {
    sectionClass: 'cross',
    title: 'Cross',
    description: 'Solving the white cross efficiently',
    introText: 'The cross is the foundation of CFOP solving. A well-executed cross should be completed in 8 moves or fewer, typically without rotations. This section covers various cross techniques with a focus on rotationless methods.',
    components: [
      // Basic cross cases
      { id: 'basic-cross-right', title: 'One Move Insert: R', moves: ['R'], setupAlg: "z2 R'", mask: CUBE_MASKS.CROSS_ONLY },
      { id: 'basic-cross-left', title: 'One Move Insert: L\'', moves: ['L\''], setupAlg: "z2 L", mask: CUBE_MASKS.CROSS_ONLY },
      { id: 'basic-cross-front', title: 'One Move Insert: L', moves: ['L'], setupAlg: "z2 L'", mask: CUBE_MASKS.CROSS_ONLY },
      { id: 'basic-cross-back', title: 'One Move Insert: R\'', moves: ['R\''], setupAlg: "z2 R", mask: CUBE_MASKS.CROSS_ONLY },
      
      // Daisy method
      { id: 'daisy-step1', title: 'Daisy Pattern', moves: ['R', 'U', 'R\'', 'F', 'U', 'F\''], interval: 1500, cumulative: true, mask: CUBE_MASKS.CROSS_ONLY },
      { id: 'daisy-step2', title: 'Convert to Cross', moves: ['F2', 'R2', 'B2', 'L2'], interval: 2000, mask: CUBE_MASKS.CROSS_ONLY },
      
      // Cross + 1 cases
      { id: 'cross-plus-1-case1', title: 'Cross + 1 (UFR)', moves: ['R', 'U', 'R\'', 'U', 'R', 'U\'', 'R\''], interval: 1000, setupAlg: 'z', cumulative: true, mask: CUBE_MASKS.CROSS_ONLY },
      { id: 'cross-plus-1-case2', title: 'Cross + 1 (UFL)', moves: ['L\'', 'U\'', 'L', 'U\'', 'L\'', 'U', 'L'], interval: 1000, setupAlg: 'z', cumulative: true, mask: CUBE_MASKS.CROSS_ONLY },
      
      // X-Cross example
      { id: 'x-cross-example', title: 'X-Cross Example', moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F', 'U', 'R', 'U\'', 'R\''], interval: 800, setupAlg: 'z', cumulative: true, mask: CUBE_MASKS.CROSS_ONLY },
      
      // Planning example
      { id: 'planning-example', title: 'Cross Planning', moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'], interval: 1200, setupAlg: 'z', cumulative: true, mask: CUBE_MASKS.CROSS_ONLY },
      
      // Cross patterns
      { id: 'white-cross', title: 'White Cross', moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'], interval: 1500, mask: CUBE_MASKS.CROSS_ONLY },
      { id: 'yellow-cross', title: 'Yellow Cross', moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'], interval: 1500, mask: CUBE_MASKS.CROSS_ONLY },
      
      // OLL patterns
      { id: 'line-pattern', title: 'Line Pattern', moves: ['F', 'R', 'U', 'R\'', 'U\'', 'F\''], interval: 1200, mask: CUBE_MASKS.CROSS_ONLY },
      { id: 'l-pattern', title: 'L-Pattern', moves: ['F', 'U', 'R', 'U\'', 'R\'', 'F\''], interval: 1200, mask: CUBE_MASKS.CROSS_ONLY },
      { id: 'dot-pattern', title: 'Dot Pattern', moves: ['F', 'R', 'U', 'R\'', 'U\'', 'F\'', 'U2', 'F', 'R', 'U', 'R\'', 'U\'', 'F\''], interval: 600, mask: CUBE_MASKS.CROSS_ONLY },
      
      // Practice scrambles
      { id: 'easy-scramble', title: 'Easy Cross', moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'], interval: 1000, setupAlg: 'z2', cumulative: true, mask: CUBE_MASKS.CROSS_ONLY },
      { id: 'medium-scramble', title: 'Medium Cross', moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'], interval: 1000, setupAlg: 'z2', cumulative: true, mask: CUBE_MASKS.CROSS_ONLY },
      { id: 'hard-scramble', title: 'Hard Cross', moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F', 'U', 'R', 'U\'', 'R\''], interval: 800, setupAlg: 'z2', cumulative: true, mask: CUBE_MASKS.CROSS_ONLY }
    ]
  }
};

// Template system for generating HTML
const TEMPLATES = {
  section: (config) => {
    const { sectionClass, title, description, introText, additionalText, containerClass, components } = config;
    
    // Group components by type for better organization
    const groupedComponents = groupComponentsByType(components);
    
    return `
      <section class="${sectionClass}">
        <h2>${title}</h2>
        ${description ? `<p>${description}</p>` : ''}
        ${introText ? `
          <div class="tip">
            <p>${introText}</p>
          </div>
        ` : ''}
        ${additionalText ? `<p>${additionalText}</p>` : ''}
        ${containerClass ? `<div class="${containerClass}">` : ''}
          ${generateGroupedComponents(groupedComponents)}
        ${containerClass ? '</div>' : ''}
        ${sectionClass === 'cross' ? TEMPLATES.crossTips : ''}
      </section>
    `;
  },
  
  // Individual component templates
  basicCross: (component) => `
    <div class="cross-case-box">
      <div class="cube-demo" id="${component.id}"></div>
    </div>
  `,
  
  daisyStep: (component) => {
    const stepData = {
      'daisy-step1': {
        title: 'Step 1: Create the Daisy',
        description: 'Move all white edges to the top layer with white facing up, forming a daisy pattern.'
      },
      'daisy-step2': {
        title: 'Step 2: Convert to Cross',
        description: 'For each edge, align it with its center and do F2 to insert it.'
      }
    };
    const data = stepData[component.id];
    
    return `
      <h4>${data.title}</h4>
      <p>${data.description}</p>
      <div class="cube-demo" id="${component.id}"></div>
    `;
  },
  
  crossPlusOne: (component) => {
    const caseData = {
      'cross-plus-1-case1': {
        title: 'Case 1: Corner in UFR',
        description: 'When white corner is in UFR with white on top:',
        solution: 'R U R\' (cross edge) + U R U\' R\' (corner)'
      },
      'cross-plus-1-case2': {
        title: 'Case 2: Corner in UFL',
        description: 'When white corner is in UFL with white on top:',
        solution: 'L\' U\' L (cross edge) + U\' L\' U L (corner)'
      }
    };
    const data = caseData[component.id];
    
    return `
      <div class="case">
        <h5>${data.title}</h5>
        <p>${data.description}</p>
        <p>${data.solution}</p>
        <div class="cube-demo" id="${component.id}"></div>
      </div>
    `;
  },
  
  xCrossExample: (component) => `
    <div class="case">
      <h5>X-Cross Example</h5>
      <p>Cross: R U R' F' U F</p>
      <p>F2L Pair: U R U' R'</p>
      <p>Total: R U R' F' U F U R U' R'</p>
      <div class="cube-demo" id="${component.id}"></div>
    </div>
  `,
  
  planningExample: (component) => `
    <h4>Planning Example</h4>
    <p>Given this scramble: R U R' F' U F U R U' R'</p>
    <p>Planned solution: R U R' F' U F (6 moves)</p>
    <div class="cube-demo" id="${component.id}"></div>
  `,
  
  colorCross: (component) => {
    const colorData = {
      'white-cross': {
        title: 'White Cross',
        description: 'Traditional approach, good for beginners'
      },
      'yellow-cross': {
        title: 'Yellow Cross',
        description: 'Alternative approach, can be more efficient'
      }
    };
    const data = colorData[component.id];
    
    return `
      <div class="color-example">
        <h4>${data.title}</h4>
        <p>${data.description}</p>
        <div class="cube-demo" id="${component.id}"></div>
      </div>
    `;
  },
  
  pattern: (component) => {
    const patternData = {
      'line-pattern': {
        title: 'Line Pattern',
        description: 'Two edges form a line on the top face',
        solution: 'F R U R\' U\' F\''
      },
      'l-pattern': {
        title: 'L-Pattern',
        description: 'Two edges form an L-shape on the top face',
        solution: 'F U R U\' R\' F\''
      },
      'dot-pattern': {
        title: 'Dot Pattern',
        description: 'No edges are solved on the top face',
        solution: 'F R U R\' U\' F\' U2 F R U R\' U\' F\''
      }
    };
    const data = patternData[component.id];
    
    return `
      <div class="pattern">
        <h4>${data.title}</h4>
        <p>${data.description}</p>
        <p>Solution: ${data.solution}</p>
        <div class="cube-demo" id="${component.id}"></div>
      </div>
    `;
  },
  
  scramble: (component) => {
    const scrambleData = {
      'easy-scramble': {
        title: 'Easy Cross (4-6 moves)',
        scramble: 'R U R\' F\' U F',
        solution: 'R U R\' F\' U F'
      },
      'medium-scramble': {
        title: 'Medium Cross (6-8 moves)',
        scramble: 'R U R\' F\' U F U R U\' R\'',
        solution: 'R U R\' F\' U F'
      },
      'hard-scramble': {
        title: 'Hard Cross (8+ moves)',
        scramble: 'R U R\' F\' U F U R U\' R\' F U F\'',
        solution: 'R U R\' F\' U F U R U\' R\''
      }
    };
    const data = scrambleData[component.id];
    
    return `
      <div class="scramble">
        <h4>${data.title}</h4>
        <p>Scramble: ${data.scramble}</p>
        <p>Solution: ${data.solution}</p>
        <div class="cube-demo" id="${component.id}"></div>
      </div>
    `;
  },
  
  mainMove: (component) => `
    <div class="cube-component clickable" id="${component.id}" onclick="handleMainMoveClick(event, '${component.id}')">
      <h3>${component.title}</h3>
      <button class="move-symbol" onclick="event.stopPropagation(); handleMainMoveModalClick(event, '${component.title}', ${JSON.stringify(component.moves)})">${component.moves[1] || component.moves[0]}</button>
      <div class="cube-demo" onclick="event.stopPropagation(); handleMainMoveModalClick(event, '${component.title}', ${JSON.stringify(component.moves)})"></div>
    </div>
  `,
  
  default: (component) => `<div id="${component.id}"></div>`,
  
  crossTips: `
    <!-- Cross Tips -->
    <div class="cross-tips">
      <h3>Cross Solving Tips</h3>
      <ul>
        <li><strong>Practice inspection:</strong> Use the full 15 seconds to plan your cross</li>
        <li><strong>Look ahead:</strong> While solving the cross, look for your first F2L pair</li>
        <li><strong>Finger tricks:</strong> Learn efficient finger tricks for cross moves</li>
        <li><strong>Color neutrality:</strong> Consider learning to solve on multiple colors</li>
        <li><strong>Cross + 1:</strong> Practice solving cross and one corner together</li>
        <li><strong>X-cross:</strong> Advanced technique to solve cross and first F2L pair</li>
      </ul>
    </div>
  `
};

// Helper function to group components by type
function groupComponentsByType(components) {
  const groups = {
    basicCross: [],
    daisySteps: [],
    crossPlusOne: [],
    xCrossExample: [],
    planningExample: [],
    colorCross: [],
    patterns: [],
    scrambles: [],
    mainMoves: [],
    default: []
  };
  
  components.forEach(component => {
    const { id } = component;
    
    if (id.includes('basic-cross-')) {
      groups.basicCross.push(component);
    } else if (id.includes('daisy-step')) {
      groups.daisySteps.push(component);
    } else if (id.includes('cross-plus-1')) {
      groups.crossPlusOne.push(component);
    } else if (id === 'x-cross-example') {
      groups.xCrossExample.push(component);
    } else if (id === 'planning-example') {
      groups.planningExample.push(component);
    } else if (id === 'white-cross' || id === 'yellow-cross') {
      groups.colorCross.push(component);
    } else if (id.includes('pattern')) {
      groups.patterns.push(component);
    } else if (id.includes('scramble')) {
      groups.scrambles.push(component);
    } else if (id.includes('-container') && (id.includes('turns') || id.includes('rotations'))) {
      groups.mainMoves.push(component);
    } else {
      groups.default.push(component);
    }
  });
  
  return groups;
}

// Helper function to generate grouped components with proper wrappers
function generateGroupedComponents(groups) {
  let html = '';
  
  // Basic cross cases in a grid
  if (groups.basicCross.length > 0) {
    html += '<div class="cross-cases-grid">\n';
    html += groups.basicCross.map(TEMPLATES.basicCross).join('');
    html += '</div>\n';
  }
  
  // Daisy steps
  if (groups.daisySteps.length > 0) {
    html += '<div class="technique-steps">\n';
    html += groups.daisySteps.map(TEMPLATES.daisyStep).join('');
    html += '</div>\n';
  }
  
  // Cross + 1 cases
  if (groups.crossPlusOne.length > 0) {
    html += '<div class="example-cases">\n';
    html += groups.crossPlusOne.map(TEMPLATES.crossPlusOne).join('');
    html += '</div>\n';
  }
  
  // X-cross example
  if (groups.xCrossExample.length > 0) {
    html += '<div class="example-cases">\n';
    html += groups.xCrossExample.map(TEMPLATES.xCrossExample).join('');
    html += '</div>\n';
  }
  
  // Planning example
  if (groups.planningExample.length > 0) {
    html += '<div class="planning-example">\n';
    html += groups.planningExample.map(TEMPLATES.planningExample).join('');
    html += '</div>\n';
  }
  
  // Color cross examples
  if (groups.colorCross.length > 0) {
    html += '<div class="color-examples">\n';
    html += groups.colorCross.map(TEMPLATES.colorCross).join('');
    html += '</div>\n';
  }
  
  // Cross patterns
  if (groups.patterns.length > 0) {
    html += '<div class="cross-patterns">\n';
    html += groups.patterns.map(TEMPLATES.pattern).join('');
    html += '</div>\n';
  }
  
  // Practice scrambles
  if (groups.scrambles.length > 0) {
    html += '<div class="practice-scrambles">\n';
    html += groups.scrambles.map(TEMPLATES.scramble).join('');
    html += '</div>\n';
  }
  
  // Main moves (basic move types)
  if (groups.mainMoves.length > 0) {
    html += groups.mainMoves.map(TEMPLATES.mainMove).join('');
  }
  
  // Default components
  html += groups.default.map(TEMPLATES.default).join('');
  
  return html;
}

// Function to generate HTML for a section
function generateSectionHTML(sectionConfig) {
  return TEMPLATES.section(sectionConfig);
}

// Function to generate all sections and insert them into the DOM
function generateAllSections() {
  const sectionsContainer = document.getElementById('sections-container');
  
  if (!sectionsContainer) {
    console.error('Sections container not found');
    return;
  }
  
  console.log('Generating sections...');
  
  Object.values(COMPONENT_CONFIGS).forEach(sectionConfig => {
    const html = generateSectionHTML(sectionConfig);
    
    // Create a temporary container to parse the HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const section = temp.firstElementChild;
    
    // Insert the section into the DOM
    sectionsContainer.appendChild(section);
    console.log(`Added section: ${sectionConfig.sectionClass}`);
  });
  
  console.log('All sections generated successfully');
}

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

// Helper function to capture the current state of a twisty-player
function captureCubeState(twistyPlayer) {
  if (!twistyPlayer) return null;
  
  // Get the current algorithm from the twisty-player's internal state
  let currentAlg = "";
  try {
    // Try to get the current algorithm from the twisty-player's state
    if (twistyPlayer.experimentalModel && twistyPlayer.experimentalModel.alg) {
      currentAlg = twistyPlayer.experimentalModel.alg.toString();
    } else if (twistyPlayer.getAttribute('alg')) {
      currentAlg = twistyPlayer.getAttribute('alg');
    }
  } catch (e) {
    // If we can't get the current alg, use the attribute or default to empty
    currentAlg = twistyPlayer.getAttribute('alg') || "";
  }
  
  return {
    setupAlg: twistyPlayer.getAttribute('experimental-setup-alg') || "x2",
    currentAlg: currentAlg,
    mask: twistyPlayer.getAttribute('experimental-stickering-mask-orbits') || "",
    visualization: twistyPlayer.getAttribute('visualization') || "3D"
  };
}

// Helper function to find the source twisty-player from a click event
function findSourceTwistyPlayer(event) {
  console.log('findSourceTwistyPlayer called, target:', event.target);
  
  // Look for the closest twisty-player element
  const twistyPlayer = event.target.closest('twisty-player');
  if (twistyPlayer) {
    console.log('Found twisty-player directly:', twistyPlayer);
    return twistyPlayer;
  }
  
  // If not found, look for the closest cube container and find its twisty-player
  const cubeContainer = event.target.closest('.cube-container, .cube-component, .cube-demo');
  if (cubeContainer) {
    const foundTwisty = cubeContainer.querySelector('twisty-player');
    console.log('Found twisty-player in container:', foundTwisty);
    return foundTwisty;
  }
  
  console.log('No twisty-player found');
  return null;
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
  
  // Generate all sections from configurations
  generateAllSections();
  
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
      // Try ID first, then class (for backward compatibility)
      const targetSection = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
      
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // If this is a section title link, also expand its submenu
        if (link.classList.contains('nav-section-title')) {
          const submenu = link.nextElementSibling;
          if (submenu && submenu.classList.contains('nav-submenu')) {
            submenu.classList.add('expanded');
            link.classList.add('expanded');
          }
        }
      }
    });
  });

  // Toggle submenu sections (for non-link titles like "OLL", "Cross", etc.)
  navSectionTitles.forEach(title => {
    // Skip if it's a link (those are handled above)
    if (title.tagName === 'A') return;
    
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
  // Create components from all section configurations
  Object.values(COMPONENT_CONFIGS).forEach(sectionConfig => {
    createCubeComponentsFromConfig(sectionConfig.components);
  });
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
      console.log('Move button clicked:', e.target.dataset.move);
      const move = e.target.dataset.move;
      const type = e.target.dataset.type;
      
      // Find the source twisty-player to capture its state
      const sourceTwistyPlayer = findSourceTwistyPlayer(e);
      const sourceCubeState = sourceTwistyPlayer ? captureCubeState(sourceTwistyPlayer) : null;
      
      console.log('Source cube state:', sourceCubeState);
      showMoveDefinitionModal(move, type, sourceCubeState);
    }
  });
}

function showMoveDefinitionModal(move, type, sourceCubeState = null) {
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
    { move: baseMove, label: 'Base', active: !isPrime && !isDouble },
    { move: baseMove + "'", label: 'Prime', active: isPrime },
    { move: baseMove + "2", label: 'Double', active: isDouble }
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
          ${moveVariants.map(variant => `
            <button class="move-variant-tab ${variant.active ? 'active' : ''}" 
                    data-move="${variant.move}">
              ${variant.label} (${variant.move})
            </button>
          `).join('')}
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

// Make functions globally accessible
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

// Helper function to handle main move component clicks
function handleMainMoveClick(event, componentId) {
  // Only scroll if the click wasn't on the cube demo
  if (!event.target.closest('.cube-demo')) {
    scrollToSection(componentId.replace('-container', '-breakdown'));
  }
}

// Helper function to handle main move modal clicks with state capture
function handleMainMoveModalClick(event, title, moves) {
  console.log('handleMainMoveModalClick called with:', { title, moves });
  
  // Find the source twisty-player to capture its state
  const sourceTwistyPlayer = findSourceTwistyPlayer(event);
  const sourceCubeState = sourceTwistyPlayer ? captureCubeState(sourceTwistyPlayer) : null;
  
  console.log('Source cube state for main move modal:', sourceCubeState);
  showMainMoveModal(title, moves, sourceCubeState);
}

// Function to show modal for main move types
function showMainMoveModal(title, moves, sourceCubeState = null) {
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

window.getMoveType = getMoveType;
window.getMoveDefinition = getMoveDefinition;
window.showMoveDefinitionModal = showMoveDefinitionModal;
window.handleMainMoveClick = handleMainMoveClick;
window.handleMainMoveModalClick = handleMainMoveModalClick;
window.showMainMoveModal = showMainMoveModal;
window.captureCubeState = captureCubeState;
window.findSourceTwistyPlayer = findSourceTwistyPlayer;

 