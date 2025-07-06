// Always keep the following line if you are using any twisty players on your page.
import "cubing/twisty";
// Use the following line for specific imports from `cubing/twisty`.
import { TwistyAlgViewer, type TwistyPlayer } from "cubing/twisty";

class RubiksCubeTutorial {
  // Main player for current scramble
  mainPlayer: TwistyPlayer = document.querySelector("#main-player")!;
  
  // Cross tutorial players
  crossStep1: TwistyPlayer = document.querySelector("#cross-step-1")!;
  crossStep2: TwistyPlayer = document.querySelector("#cross-step-2")!;
  crossStep3: TwistyPlayer = document.querySelector("#cross-step-3")!;
  crossStep4: TwistyPlayer = document.querySelector("#cross-step-4")!;
  crossStep5: TwistyPlayer = document.querySelector("#cross-step-5")!;

  constructor() {
    console.log("Initializing RubiksCubeTutorial...");
    this.initializeTutorial();
  }

  initializeTutorial() {
    console.log("Setting up tutorial...");
    
    // Set main player to solved state
    this.mainPlayer.alg = "";
    console.log("Main player set to solved state");
    
    // Initialize cross tutorial steps
    this.initializeCrossSteps();
  }

  initializeCrossSteps() {
    console.log("Initializing cross steps...");
    
    // Check if elements exist
    console.log("Cross step elements found:", {
      step1: !!this.crossStep1,
      step2: !!this.crossStep2,
      step3: !!this.crossStep3,
      step4: !!this.crossStep4,
      step5: !!this.crossStep5
    });
    
    // Set up camera and controls for all cross tutorial cubes
    this.setupCrossStep(this.crossStep1, "Step 1");
    this.setupCrossStep(this.crossStep2, "Step 2");
    this.setupCrossStep(this.crossStep3, "Step 3");
    this.setupCrossStep(this.crossStep4, "Step 4");
    this.setupCrossStep(this.crossStep5, "Step 5");
    
    console.log("Cross steps initialization complete");
  }

  setupCrossStep(player: TwistyPlayer, stepName: string) {
    try {
      console.log(`Setting up ${stepName}...`);
      
      // Set camera to show the bottom face (white) clearly
      player.cameraLatitude = 180; // Look at bottom face
      player.cameraLongitude = 0;
      player.cameraDistance = 2.5;
      
      // Disable controls for tutorial cubes
      player.controlPanel = "none";
      
      console.log(`${stepName} setup complete`);
    } catch (error) {
      console.error(`Error setting up ${stepName}:`, error);
    }
  }
}

// Initialize the tutorial app
console.log("Creating tutorial instance...");
const tutorial = new RubiksCubeTutorial();

// Make the tutorial object available in the console for debugging
globalThis.tutorial = tutorial;
console.log("Tutorial ready!");
