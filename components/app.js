// Main application file for Rubik's Cube Tutorial
import { COMPONENT_CONFIGS } from './configs.js';
import { generateSectionHTML } from './templates.js';
import { initializeNavigation, handleMainMoveClick, handleMainMoveModalClick } from './navigation.js';
import { initializeMoveButtons } from './moveButtons.js';
import { getMoveType, getMoveDefinition, captureCubeState, findSourceTwistyPlayer } from './moveUtils.js';
import { showMoveDefinitionModal, showMainMoveModal, showF2LCaseModal } from './modalSystem.js';

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
    mask: ""
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

function initializeCubeComponents() {
  // Create components from all section configurations
  Object.values(COMPONENT_CONFIGS).forEach(sectionConfig => {
    createCubeComponentsFromConfig(sectionConfig.components);
  });
}

// Main initialization function
function initializeApp() {
  console.log("DOM loaded, initializing components...");
  
  // Generate all sections from configurations
  generateAllSections();
  
  // Initialize cube components
  initializeCubeComponents();
  initializeNavigation();
  initializeMoveButtons();
  
  console.log("Initialization complete!");
}

// Initialize when DOM is loaded
window.addEventListener("DOMContentLoaded", initializeApp);

// Make functions globally accessible for HTML onclick handlers
window.getMoveType = getMoveType;
window.getMoveDefinition = getMoveDefinition;
window.showMoveDefinitionModal = showMoveDefinitionModal;
window.handleMainMoveClick = handleMainMoveClick;
window.handleMainMoveModalClick = handleMainMoveModalClick;
window.showMainMoveModal = showMainMoveModal;
  window.showF2LCaseModal = showF2LCaseModal;
window.captureCubeState = captureCubeState;
window.findSourceTwistyPlayer = findSourceTwistyPlayer; 