// Component configurations organized by section
import { CUBE_MASKS } from './constants.js';

// Experimental stickering configurations
const CROSS_STICKERING = "Cross";

// Helper function to add stickering to components
function addStickering(components, stickering) {
  return components.map(component => {
    if (component.type === 'text' || component.stickering) {
      return component;
    }
    return { ...component, stickering };
  });
}

export const COMPONENT_CONFIGS = {
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
  
  cross: {
    sectionClass: 'cross',
    title: 'Cross',
    description: 'Solving the white cross efficiently',
    introText: 'The cross is the foundation of CFOP solving. A well-executed cross should be completed in 8 moves or fewer, typically without rotations. This section covers various cross techniques with a focus on rotationless methods.',
    components: []
  },
  
  goodEdges: {
    sectionClass: 'good-edges',
    title: 'Good Edges',
    description: 'Edges that can be inserted without rotating the cube',
    introText: 'Good edges are the foundation of efficient cross solving. These are edges that can be inserted with a single move without requiring cube rotations.',
    components: addStickering([
      // Basic cross cases (good edges) - 3x2 grid
      { id: 'basic-cross-right', title: 'One Move Insert: R', moves: ['R'], setupAlg: "R'" },
      { id: 'basic-cross-back', title: 'One Move Insert: R\'', moves: ['R\''], setupAlg: "R" },
      { id: 'basic-cross-r2', title: 'One Move Insert: R2', moves: ['R2'], setupAlg: "R2" },
      { id: 'basic-cross-front', title: 'One Move Insert: L', moves: ['L'], setupAlg: "L'" },
      { id: 'basic-cross-left', title: 'One Move Insert: L\'', moves: ['L\''], setupAlg: "L" },
      { id: 'basic-cross-l2', title: 'One Move Insert: L2', moves: ['L2'], setupAlg: "L2" },

      { type: 'text', content: '<div class="tip"><p><strong>Good Edges</strong> are edges that can be inserted without rotating the cube. These are the most efficient cases to learn first.</p></div>' },

      // Top layer cases - white edge facing up but in wrong position
      { id: 'top-edge-front', title: 'Edge in Front: U\' R2', moves: ['U\'', 'R2'], setupAlg: "R2 U" },
      { id: 'top-edge-back', title: 'Edge in Back: U\' L2', moves: ['U\'', 'L2'], setupAlg: "L2 U" },

      { type: 'text', content: '<div class="tip"><p>When the white edge is on top but in the wrong position, first move it to the correct side, then insert with R2 or L2.</p></div>' }
    ], CROSS_STICKERING)
  },
  
  badEdges: {
    sectionClass: 'bad-edges',
    title: 'Bad Edges',
    description: 'Edges that require cube rotations to insert',
    introText: 'Bad edges require cube rotations to insert efficiently. While not ideal, understanding these cases helps with overall cross planning.',
    components: addStickering([
      // F insert case
      { id: 'bad-edge-f-insert', title: 'F Insert: x F\' U\' F', moves: ['x', 'F\'', 'U\'', 'F'], setupAlg: "F U F' x'" },
      // FR insert case
      { id: 'bad-edge-fr-insert', title: 'FR Insert: y x R\' U R', moves: ['y', 'x', 'R\'', 'U', 'R'], setupAlg: "R U' R' x' y'" },

      { type: 'text', content: '<div class="tip"><p><strong>Bad Edges</strong> are edges that require rotating the cube to insert. These cases are less efficient but still important to understand.</p></div>' }
    ], CROSS_STICKERING)
  },
  
  daisy: {
    sectionClass: 'daisy',
    title: 'Daisy Method',
    description: 'Beginner-friendly approach to cross solving',
    introText: 'The daisy method is a beginner-friendly approach that creates a "daisy" pattern first, then converts it to a cross.',
    components: addStickering([
      // Daisy method
      { id: 'daisy-step1', title: 'Daisy Pattern', moves: ['R', 'U', 'R\'', 'F', 'U', 'F\''], interval: 1500 },
      { id: 'daisy-step2', title: 'Convert to Cross', moves: ['F2', 'R2', 'B2', 'L2'], interval: 2000 },

      { type: 'text', content: '<div class="tip"><p>The daisy method is great for beginners. First create the daisy pattern, then convert each edge to the cross using F2 moves.</p></div>' }
    ], CROSS_STICKERING)
  },
  
  crossAdvanced: {
    sectionClass: 'cross-advanced',
    title: 'Advanced Cross',
    description: 'Advanced cross techniques and planning',
    introText: 'Advanced cross techniques include Cross + 1, X-Cross, and advanced planning methods.',
    components: addStickering([
      // Cross + 1 cases
      { id: 'cross-plus-1-case1', title: 'Cross + 1 (UFR)', moves: ['R', 'U', 'R\'', 'U', 'R', 'U\'', 'R\''], interval: 1000, setupAlg: 'z' },
      { id: 'cross-plus-1-case2', title: 'Cross + 1 (UFL)', moves: ['L\'', 'U\'', 'L', 'U\'', 'L\'', 'U', 'L'], interval: 1000, setupAlg: 'z' },

      // X-Cross example
      { id: 'x-cross-example', title: 'X-Cross Example', moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F', 'U', 'R', 'U\'', 'R\''], interval: 800, setupAlg: 'z' },

      // Planning example
      { id: 'planning-example', title: 'Cross Planning', moves: ['R', 'U', 'R\'', 'F\'', 'U', 'F'], interval: 1200, setupAlg: 'z' },

      { type: 'text', content: '<div class="tip"><p>Advanced techniques like Cross + 1 and X-Cross can significantly improve your solve times.</p></div>' }
    ], CROSS_STICKERING)
  },
  
  f2l: {
    sectionClass: 'f2l',
    title: 'F2L (First Two Layers)',
    description: 'Solving the first two layers efficiently',
    introText: 'F2L is the second step of CFOP method. It involves solving the corners and edges of the first two layers simultaneously.',
    components: [
      { type: 'text', content: '<div class="tip"><p>These are the easiest cases to solve. These are 3-move inserts.</p></div>' },
      
      // F2L examples
      { id: 'f2l-case1', title: '3 move FR: R U\' R\'', moves: ['R', 'U\'', 'R\''], setupAlg: 'R U R\'', stickering: 'F2L' },
      { id: 'f2l-case2', title: '3 move FL: L\' U\' L', moves: ['L\'', 'U', 'L'], setupAlg: 'L\' U\' L', stickering: 'F2L' },
      { id: 'f2l-case3', title: '3 move BR: L\' U\' L', moves: ['R\'', 'U', 'R'], setupAlg: 'R\' U\' R', stickering: 'F2L' },
      
      { type: 'text', content: '<div class="tip"><p>These cases show how to pair up and insert corner-edge pairs in just 3 moves. They are the most efficient F2L cases and form the foundation for more advanced F2L solutions.</p></div>' },

      { type: 'text', content: '<div class="tip"><p><strong>Note:</strong> These cases apply when the corner and edge have opposite colors facing up and the bottom color is pointing to the side.</p></div>' },

      { id: 'f2l-case4', title: '3 move FR to Back: R U R\'', moves: ['R', 'U', 'R\''], setupAlg: 'R U\' R\'', stickering: 'F2L' },
      { id: 'f2l-case5', title: '3 move FL to Back: L U L\'', moves: ['L\'', 'U\'', 'L'], setupAlg: 'L\' U L', stickering: 'F2L' },
      { id: 'f2l-case6', title: '3 move BR to Front: R\' U\' R', moves: ['R\'', 'U\'', 'R'], setupAlg: 'R\' U R', stickering: 'F2L' },
    
      { type: 'text', content: '<div class="tip"><p>Here are three more cases where the corner and edge have the same color facing up. These show how to pair them before insertion.</p></div>' },
      
      { id: 'f2l-case7', title: 'Same Color Up FR: R U2 R\'', moves: ['R', 'U2', 'R\''], setupAlg: 'R U R\' U2 R U2 R\'', stickering: 'F2L' },
      { id: 'f2l-case8', title: 'Same Color Up FL: L\' U2 L', moves: ['L\'', 'U2', 'L'], setupAlg: 'L\' U\' L U2 L\' U2 L', stickering: 'F2L' },
      { id: 'f2l-case9', title: 'Same Color Up BR: R\' U2 R', moves: ['R\'', 'U2', 'R'], setupAlg: 'R\' U\' R U2 R\' U2 R', stickering: 'F2L' },
      
      { type: 'text', content: '<div class="tip"><p>Now that you know how to pair up the pieces, you can insert them using the 3-move inserts we learned earlier:</p><ul><li>For front slots: R U\' R\' or L\' U L</li><li>For back slots: R\' U R or L U\' L\'</li></ul><p>Practice combining the pairing with the insertion to develop muscle memory.</p></div>' },

      { type: 'text', content: '<div class="tip"><p><strong>Lift-and-pair</strong>: Use F/B triggers to raise both the corner and its edge from the bottom to U simultaneously, then pair on U and insert.</p><ul><li>Front slots: F U F\' or F\' U\' F</li><li>Back slots: B U B\' or B\' U\' B</li><li>Insert: front-right R U\' R\', front-left L\' U L, back-right R\' U R, back-left L U\' L\'</li></ul></div>' },

      { id: 'f2l-case-lift-pair-fr-1', title: 'Lift & Pair FR: F\' U\' F → U R U\' R\'', moves: ["F'", "U'", "F", "U", "R", "U'", "R'"], setupAlg: "R U R' U' F' U F", interval: 1200, stickering: 'F2L' },
      { id: 'f2l-case-lift-pair-fl-1', title: 'Lift & Pair FL: F U F\' → U\' L\' U L', moves: ["F", "U", "F'", "U'", "L'", "U", "L"], setupAlg: "L' U' L U F U' F'", interval: 1200, stickering: 'F2L' },
      { id: 'f2l-case-lift-pair-fr-edge-slot', title: 'Lift & Pair FR (edge in slot, corner on U): F\' U\' F → U R U\' R\'', moves: ["F'", "U'", "F", "U", "R", "U'", "R'"], setupAlg: "R U R' U' F' U F", interval: 1200, stickering: 'F2L' },
      { id: 'f2l-case-lift-pair-fl-edge-slot', title: 'Lift & Pair FL (edge in slot, corner on U): F U F\' → U\' L\' U L', moves: ["F", "U", "F'", "U'", "L'", "U", "L"], setupAlg: "L' U' L U F U' F'", interval: 1200, stickering: 'F2L' },
      { id: 'f2l-case-lift-pair-bl-wide', title: 'Lift & Pair BL (wide): U\' f\' L f\' → U L U\' L\'', moves: ["U'", "f'", "L", "f'", "U", "L", "U'", "L'"], setupAlg: "L U L' U f U' f'", interval: 1200, stickering: 'F2L' },
      { id: 'f2l-insert-bl', title: 'Insert Back-Left: U L U\' L\'', moves: ["U", "L", "U'", "L'"], setupAlg: "L U L' U'", interval: 1000, stickering: 'F2L' }

    ]
  },

  f2lCases: {
    sectionClass: 'f2l-cases',
    title: 'F2L Cases',
    description: 'Solving the first two layers efficiently',
    introText: 'F2L is the second step of CFOP method. It involves solving the corners and edges of the first two layers simultaneously.',
    components: [
      { type: 'text', content: '<div class="tip"><p>These are the easiest cases to solve. These are 3-move inserts.</p></div>' },
    ]
  },
};

// Helper function to scroll to section (needed for onClick handlers)
function scrollToSection(sectionClass) {
  const section = document.querySelector(`.${sectionClass}`);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

// Make scrollToSection available globally for onClick handlers
window.scrollToSection = scrollToSection; 