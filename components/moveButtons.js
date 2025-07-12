// Move button initialization and functionality
import { getMoveType, findSourceTwistyPlayer, captureCubeState } from './moveUtils.js';
import { showMoveDefinitionModal } from './modalSystem.js';

// Utility function to convert move notation to clickable buttons
export function initializeMoveButtons() {
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