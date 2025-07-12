// Component configurations organized by section
import { CUBE_MASKS } from './constants.js';

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