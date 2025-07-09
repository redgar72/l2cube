// Always keep the following line if you are using any twisty players on your page.
import "cubing/twisty";
// Use the following line for specific imports from `cubing/twisty`.
import { TwistyAlgViewer, type TwistyPlayer } from "cubing/twisty";

class RubiksCubeTutorial {
  // Welcome player for reference cube
  welcomePlayer: TwistyPlayer = document.querySelector("#welcome-player")!;

  constructor() {
    console.log("Initializing RubiksCubeTutorial...");
    this.initializeTutorial();
  }

  initializeTutorial() {
    console.log("Setting up tutorial...");
    
    // Set welcome player to solved state
    this.welcomePlayer.alg = "";
    console.log("Welcome player set to solved state");
    
    // Set up camera for the welcome cube
    //this.setupWelcomeCube();
  }

  setupWelcomeCube() {
    try {
      console.log("Setting up welcome cube...");
      
      // Set camera to show the cube clearly
      this.welcomePlayer.cameraLatitude = 45;
      this.welcomePlayer.cameraLongitude = 45;
      this.welcomePlayer.cameraDistance = 2.5;
      
      console.log("Welcome cube setup complete");
    } catch (error) {
      console.error("Error setting up welcome cube:", error);
    }
  }
}

// Initialize the tutorial app
console.log("Creating tutorial instance...");
const tutorial = new RubiksCubeTutorial();

// Make the tutorial object available in the console for debugging
globalThis.tutorial = tutorial;
console.log("Tutorial ready!");
