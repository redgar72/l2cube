// Template system for generating HTML
export const TEMPLATES = {
  section: (config) => {
    const { sectionClass, title, description, introText, additionalText, containerClass, components } = config;
    
    // Group components by type for better organization
    const groupedComponents = groupComponentsByType(components);
    
    return `
      <section class="${sectionClass}">
        <h2>${title}</h2>
        ${description ? `<p>${description}</p>` : ''}
        ${introText ? `
          <div class="cross-intro">
            <p>${introText}</p>
          </div>
        ` : ''}
        ${additionalText ? `<p>${additionalText}</p>` : ''}
        ${containerClass ? `<div class="${containerClass}">` : ''}
          ${generateGroupedComponents(groupedComponents)}
        ${containerClass ? '</div>' : ''}
        ${sectionClass === 'cross' ? TEMPLATES.crossTips : ''}
      </section>
    `;
  },
  
  // Individual component templates
  basicCross: (component) => `
    <div class="cross-case-box">
      <div class="cube-demo" id="${component.id}"></div>
    </div>
  `,
  
  daisyStep: (component) => {
    const stepData = {
      'daisy-step1': {
        title: 'Step 1: Create the Daisy',
        description: 'Move all white edges to the top layer with white facing up, forming a daisy pattern.'
      },
      'daisy-step2': {
        title: 'Step 2: Convert to Cross',
        description: 'For each edge, align it with its center and do F2 to insert it.'
      }
    };
    const data = stepData[component.id];
    
    return `
      <h4>${data.title}</h4>
      <p>${data.description}</p>
      <div class="cube-demo" id="${component.id}"></div>
    `;
  },
  
  crossPlusOne: (component) => {
    const caseData = {
      'cross-plus-1-case1': {
        title: 'Case 1: Corner in UFR',
        description: 'When white corner is in UFR with white on top:',
        solution: 'R U R\' (cross edge) + U R U\' R\' (corner)'
      },
      'cross-plus-1-case2': {
        title: 'Case 2: Corner in UFL',
        description: 'When white corner is in UFL with white on top:',
        solution: 'L\' U\' L (cross edge) + U\' L\' U L (corner)'
      }
    };
    const data = caseData[component.id];
    
    return `
      <div class="case">
        <h5>${data.title}</h5>
        <p>${data.description}</p>
        <p>${data.solution}</p>
        <div class="cube-demo" id="${component.id}"></div>
      </div>
    `;
  },
  
  xCrossExample: (component) => `
    <div class="case">
      <h5>X-Cross Example</h5>
      <p>Cross: R U R' F' U F</p>
      <p>F2L Pair: U R U' R'</p>
      <p>Total: R U R' F' U F U R U' R'</p>
      <div class="cube-demo" id="${component.id}"></div>
    </div>
  `,
  
  planningExample: (component) => `
    <h4>Planning Example</h4>
    <p>Given this scramble: R U R' F' U F U R U' R'</p>
    <p>Planned solution: R U R' F' U F (6 moves)</p>
    <div class="cube-demo" id="${component.id}"></div>
  `,
  
  colorCross: (component) => {
    const colorData = {
      'white-cross': {
        title: 'White Cross',
        description: 'Traditional approach, good for beginners'
      },
      'yellow-cross': {
        title: 'Yellow Cross',
        description: 'Alternative approach, can be more efficient'
      }
    };
    const data = colorData[component.id];
    
    return `
      <div class="color-example">
        <h4>${data.title}</h4>
        <p>${data.description}</p>
        <div class="cube-demo" id="${component.id}"></div>
      </div>
    `;
  },
  
  pattern: (component) => {
    const patternData = {
      'line-pattern': {
        title: 'Line Pattern',
        description: 'Two edges form a line on the top face',
        solution: 'F R U R\' U\' F\''
      },
      'l-pattern': {
        title: 'L-Pattern',
        description: 'Two edges form an L-shape on the top face',
        solution: 'F U R U\' R\' F\''
      },
      'dot-pattern': {
        title: 'Dot Pattern',
        description: 'No edges are solved on the top face',
        solution: 'F R U R\' U\' F\' U2 F R U R\' U\' F\''
      }
    };
    const data = patternData[component.id];
    
    return `
      <div class="pattern">
        <h4>${data.title}</h4>
        <p>${data.description}</p>
        <p>Solution: ${data.solution}</p>
        <div class="cube-demo" id="${component.id}"></div>
      </div>
    `;
  },
  
  scramble: (component) => {
    const scrambleData = {
      'easy-scramble': {
        title: 'Easy Cross (4-6 moves)',
        scramble: 'R U R\' F\' U F',
        solution: 'R U R\' F\' U F'
      },
      'medium-scramble': {
        title: 'Medium Cross (6-8 moves)',
        scramble: 'R U R\' F\' U F U R U\' R\'',
        solution: 'R U R\' F\' U F'
      },
      'hard-scramble': {
        title: 'Hard Cross (8+ moves)',
        scramble: 'R U R\' F\' U F U R U\' R\' F U F\'',
        solution: 'R U R\' F\' U F U R U\' R\''
      }
    };
    const data = scrambleData[component.id];
    
    return `
      <div class="scramble">
        <h4>${data.title}</h4>
        <p>Scramble: ${data.scramble}</p>
        <p>Solution: ${data.solution}</p>
        <div class="cube-demo" id="${component.id}"></div>
      </div>
    `;
  },
  
  mainMove: (component) => `
    <div class="cube-component clickable" id="${component.id}" onclick="handleMainMoveClick(event, '${component.id}')">
      <h3>${component.title}</h3>
      <button class="move-symbol" onclick="event.stopPropagation(); handleMainMoveModalClick(event, '${component.title}', ${JSON.stringify(component.moves)})">${component.moves[1] || component.moves[0]}</button>
      <div class="cube-demo" onclick="event.stopPropagation(); handleMainMoveModalClick(event, '${component.title}', ${JSON.stringify(component.moves)})"></div>
    </div>
  `,
  
  default: (component) => `<div id="${component.id}"></div>`,
  
  crossTips: `
    <!-- Cross Tips -->
    <div class="cross-tips">
      <h3>Cross Solving Tips</h3>
      <ul>
        <li><strong>Practice inspection:</strong> Use the full 15 seconds to plan your cross</li>
        <li><strong>Look ahead:</strong> While solving the cross, look for your first F2L pair</li>
        <li><strong>Finger tricks:</strong> Learn efficient finger tricks for cross moves</li>
        <li><strong>Color neutrality:</strong> Consider learning to solve on multiple colors</li>
        <li><strong>Cross + 1:</strong> Practice solving cross and one corner together</li>
        <li><strong>X-cross:</strong> Advanced technique to solve cross and first F2L pair</li>
      </ul>
    </div>
  `
};

// Helper function to group components by type
function groupComponentsByType(components) {
  const groups = {
    basicCross: [],
    daisySteps: [],
    crossPlusOne: [],
    xCrossExample: [],
    planningExample: [],
    colorCross: [],
    patterns: [],
    scrambles: [],
    mainMoves: [],
    default: []
  };
  
  //todo: Find a better way to handle this than a  massive else if chain
  components.forEach(component => {
    const { id } = component;
    
    if (id.includes('basic-cross-')) {
      groups.basicCross.push(component);
    } else if (id.includes('daisy-step')) {
      groups.daisySteps.push(component);
    } else if (id.includes('cross-plus-1')) {
      groups.crossPlusOne.push(component);
    } else if (id === 'x-cross-example') {
      groups.xCrossExample.push(component);
    } else if (id === 'planning-example') {
      groups.planningExample.push(component);
    } else if (id === 'white-cross' || id === 'yellow-cross') {
      groups.colorCross.push(component);
    } else if (id.includes('pattern')) {
      groups.patterns.push(component);
    } else if (id.includes('scramble')) {
      groups.scrambles.push(component);
    } else if (id.includes('-container') && (id.includes('turns') || id.includes('rotations'))) {
      groups.mainMoves.push(component);
    } else {
      groups.default.push(component);
    }
  });
  
  return groups;
}

//todo: this is just gross theres gotta be a cleaner way
// Helper function to generate grouped components with proper wrappers
function generateGroupedComponents(groups) {
  let html = '';
  
  // Basic cross cases in a grid
  if (groups.basicCross.length > 0) {
    html += '<div class="cross-cases-grid">\n';
    html += groups.basicCross.map(TEMPLATES.basicCross).join('');
    html += '</div>\n';
  }
  
  // Daisy steps
  if (groups.daisySteps.length > 0) {
    html += '<div class="technique-steps">\n';
    html += groups.daisySteps.map(TEMPLATES.daisyStep).join('');
    html += '</div>\n';
  }
  
  // Cross + 1 cases
  if (groups.crossPlusOne.length > 0) {
    html += '<div class="example-cases">\n';
    html += groups.crossPlusOne.map(TEMPLATES.crossPlusOne).join('');
    html += '</div>\n';
  }
  
  // X-cross example
  if (groups.xCrossExample.length > 0) {
    html += '<div class="example-cases">\n';
    html += groups.xCrossExample.map(TEMPLATES.xCrossExample).join('');
    html += '</div>\n';
  }
  
  // Planning example
  if (groups.planningExample.length > 0) {
    html += '<div class="planning-example">\n';
    html += groups.planningExample.map(TEMPLATES.planningExample).join('');
    html += '</div>\n';
  }
  
  // Color cross examples
  if (groups.colorCross.length > 0) {
    html += '<div class="color-examples">\n';
    html += groups.colorCross.map(TEMPLATES.colorCross).join('');
    html += '</div>\n';
  }
  
  // Cross patterns
  if (groups.patterns.length > 0) {
    html += '<div class="cross-patterns">\n';
    html += groups.patterns.map(TEMPLATES.pattern).join('');
    html += '</div>\n';
  }
  
  // Practice scrambles
  if (groups.scrambles.length > 0) {
    html += '<div class="practice-scrambles">\n';
    html += groups.scrambles.map(TEMPLATES.scramble).join('');
    html += '</div>\n';
  }
  
  // Main moves (basic move types)
  if (groups.mainMoves.length > 0) {
    html += groups.mainMoves.map(TEMPLATES.mainMove).join('');
  }
  
  // Default components
  html += groups.default.map(TEMPLATES.default).join('');
  
  return html;
}

// Function to generate HTML for a section
export function generateSectionHTML(sectionConfig) {
  return TEMPLATES.section(sectionConfig);
} 