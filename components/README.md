# Components Directory

This directory contains the modular JavaScript components for the Rubik's Cube Tutorial.

## File Structure

### Core Files
- **`app.js`** - Main application file that ties everything together
- **`constants.js`** - All constants and configurations (CUBE_MASKS, MOVE_DEFINITIONS, etc.)
- **`configs.js`** - Component configurations organized by section
- **`templates.js`** - HTML template system for generating sections

### Utility Files
- **`moveUtils.js`** - Move-related utility functions (getMoveType, getMoveDefinition, etc.)
- **`modalSystem.js`** - Modal system for move definitions and demonstrations
- **`navigation.js`** - Navigation system and scroll functionality
- **`moveButtons.js`** - Move button initialization and click handling

### Legacy Files
- **`CubeComponent.js`** - Original cube component class (kept for compatibility)

## Benefits of Modular Structure

1. **Maintainability** - Each file has a single responsibility
2. **Readability** - Much easier to understand and navigate
3. **Reusability** - Components can be easily reused or modified
4. **Collaboration** - Multiple developers can work on different modules
5. **Testing** - Individual modules can be tested in isolation

## How to Add New Features

### Adding New Move Types
1. Add move definition to `constants.js` in `MOVE_DEFINITIONS`
2. Add configuration to `configs.js` if needed
3. Update templates in `templates.js` if new UI is required

### Adding New Sections
1. Add section configuration to `configs.js`
2. Add corresponding template to `templates.js` if needed
3. Update navigation in `navigation.js` if required

### Adding New Modals
1. Add modal function to `modalSystem.js`
2. Export the function and import it in `app.js`
3. Make it globally available if needed for HTML onclick handlers

## Import/Export Pattern

All modules use ES6 import/export syntax:

```javascript
// Exporting
export function myFunction() { ... }
export const myConstant = { ... };

// Importing
import { myFunction, myConstant } from './module.js';
```

## Global Functions

Some functions need to be globally available for HTML onclick handlers. These are set in `app.js`:

```javascript
window.myFunction = myFunction;
```

## Migration from static.js

The original `static.js` file (1239 lines) has been broken down into these focused modules:

- **Constants** → `constants.js` (100 lines)
- **Configurations** → `configs.js` (150 lines)  
- **Templates** → `templates.js` (300 lines)
- **Move Utils** → `moveUtils.js` (80 lines)
- **Modal System** → `modalSystem.js` (320 lines)
- **Navigation** → `navigation.js` (80 lines)
- **Move Buttons** → `moveButtons.js` (70 lines)
- **Main App** → `app.js` (80 lines)

Total: ~1180 lines across 8 focused files vs 1239 lines in one monolithic file. 