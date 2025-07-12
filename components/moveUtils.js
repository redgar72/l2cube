// Move-related utility functions
import { MOVE_DEFINITIONS } from './constants.js';

// Helper function to get move type from move string
export function getMoveType(move) {
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
export function getMoveDefinition(move, type) {
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

// Helper function to capture the current state of a twisty-player
export function captureCubeState(twistyPlayer) {
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
export function findSourceTwistyPlayer(event) {
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