// Move button initialization and functionality
import { getMoveType, findSourceTwistyPlayer, captureCubeState } from './moveUtils.js';
import { showMoveDefinitionModal } from './modalSystem.js';
import { MOVE_COLORS } from './constants.js';

// Utility function to convert move notation to clickable buttons
export function initializeMoveButtons() {
  // Find all text content that might contain move notation
  // Exclude elements inside cube-component to avoid processing algorithm text that's already been processed
  const textElements = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, div:not(.cube-component):not(.modal-overlay)');
  
  textElements.forEach(element => {
    // Skip if inside a cube-component (these are handled by CubeComponent.processAlgorithmText)
    // This check MUST come first before any other processing
    if (element.closest('.cube-component') || element.closest('.oll-case-box') || element.closest('.cross-case-box')) {
      return;
    }
    
    // Skip if already processed, has children, or contains algorithm triggers/move buttons
    if (element.children.length > 0 || 
        element.dataset.processed || 
        element.querySelector('.algorithm-trigger') ||
        element.querySelector('.move-button')) return;
    
    let text = element.textContent;
    let hasChanges = false;
    
    // Create a single regex that matches all move patterns at once
    const allMovesRegex = /(?<!\w)([RUFDLBrLufdlbMESxyz]'?2?)(?!\w)/g;
    
    text = text.replace(allMovesRegex, (match, move) => {
      // Determine the type and styling based on the move
      let type = 'face';
      let buttonClass = 'move-button';
      let colorType = 'normal';
      
      if (move.includes("'")) {
        buttonClass += ' move-button-prime';
        colorType = 'prime';
        if (move.match(/[RUFDLB]/)) type = 'face-prime';
        else if (move.match(/[rufdlb]/)) type = 'wide-prime';
        else if (move.match(/[MES]/)) type = 'slice-prime';
        else if (move.match(/[xyz]/)) type = 'rotation-prime';
      } else if (move.includes("2")) {
        colorType = 'double';
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
      const color = MOVE_COLORS[colorType];
      const style = color ? ` style=\"background-color: ${color};\"` : '';
      hasChanges = true;
      return `<button class=\"${buttonClass}\" data-move=\"${move}\" data-type=\"${type}\"${style}>${move}</button>`;
    });
    
    if (hasChanges) {
      element.innerHTML = text;
      element.dataset.processed = 'true'; // Mark as processed
    }
  });
  
  // Add click handlers to move buttons
  document.addEventListener('click', (e) => {
    // Skip if clicking on a trigger (triggers handle their own clicks)
    if (e.target.closest('.algorithm-trigger')) {
      return;
    }
    
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