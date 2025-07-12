// Constants and configurations for Rubik's Cube Tutorial
//todo: Make sure each mask is unique and not copy pasted
// Mask enums for different cube views
export const CUBE_MASKS = {
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
export const MOVE_CONFIGS = {
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

//todo: Make the descriptions and titles be generated from the move Character
// Move definitions data structure
export const MOVE_DEFINITIONS = {
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