// Static JavaScript for Rubik's Cube Tutorial
// Uses Twisty CDN directly without bundled dependencies

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing components...");
  
  // Initialize cube components
  initializeCubeComponents();
  initializeNavigation();
  
  console.log("Initialization complete!");
});

function scrollToSection(sectionClass) {
  const section = document.querySelector(`.${sectionClass}`);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

function initializeNavigation() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navSectionTitles = document.querySelectorAll('.nav-section-title');

  // Toggle sidebar
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // Handle navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.querySelector(`.${targetId}`);
      
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Toggle submenu sections
  navSectionTitles.forEach(title => {
    title.addEventListener('click', () => {
      const submenu = title.nextElementSibling;
      submenu.classList.toggle('expanded');
      title.classList.toggle('expanded');
    });
  });

  // Auto-highlight current section based on scroll position
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.className;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

function initializeCubeComponents() {
  // Welcome section - random moves with both 3D and 2D
  const welcomeContainer = document.getElementById("welcome-cube-container");
  if (welcomeContainer) {
    new CubeComponent(welcomeContainer, {
      title: "3D & 2D View",
      show2D: true,
      showMoveDisplay: true,
      moves: ["R", "U", "F", "L", "D", "B", "R'", "U'", "F'", "L'", "D'", "B'"],
      interval: 1500,
      setupAlg: "x2"
    });
  }

  // Face turns - clickable to scroll to breakdown
  const faceTurnsContainer = document.getElementById("face-turns-container");
  if (faceTurnsContainer) {
    new CubeComponent(faceTurnsContainer, {
      title: "Face Turns",
      show2D: false,
      showMoveDisplay: true,
      moves: ["R", "U", "F", "L", "D", "B"],
      interval: 2000,
      setupAlg: "x2",
      clickable: true,
      onClick: () => scrollToSection('face-turns-breakdown')
    });
  }

  // Wide turns - clickable to scroll to breakdown
  const wideTurnsContainer = document.getElementById("wide-turns-container");
  if (wideTurnsContainer) {
    new CubeComponent(wideTurnsContainer, {
      title: "Wide Turns",
      show2D: false,
      showMoveDisplay: true,
      moves: ["r", "u", "f", "l", "d", "b"],
      interval: 2000,
      setupAlg: "x2",
      clickable: true,
      onClick: () => scrollToSection('wide-turns-breakdown')
    });
  }

  // Slice turns - clickable to scroll to breakdown
  const sliceTurnsContainer = document.getElementById("slice-turns-container");
  if (sliceTurnsContainer) {
    new CubeComponent(sliceTurnsContainer, {
      title: "Slice Turns",
      show2D: false,
      showMoveDisplay: true,
      moves: ["M", "E", "S"],
      interval: 2000,
      setupAlg: "x2",
      clickable: true,
      onClick: () => scrollToSection('slice-turns-breakdown')
    });
  }

  // Rotations - clickable to scroll to breakdown
  const rotationsContainer = document.getElementById("rotations-container");
  if (rotationsContainer) {
    new CubeComponent(rotationsContainer, {
      title: "Rotations",
      show2D: false,
      showMoveDisplay: true,
      moves: ["x", "y", "z"],
      interval: 2000,
      setupAlg: "x2",
      clickable: true,
      onClick: () => scrollToSection('rotations-breakdown')
    });
  }

  // Initialize individual move components in breakdown sections
  initializeBreakdownComponents();
}

function initializeBreakdownComponents() {
  // Face turns breakdown - individual moves
  const faceMoves = [
    { id: 'r-move-container', move: 'R', title: 'R Move', row: 'row-1' },
    { id: 'u-move-container', move: 'U', title: 'U Move', row: 'row-1' },
    { id: 'f-move-container', move: 'F', title: 'F Move', row: 'row-1' },
    { id: 'l-move-container', move: 'L', title: 'L Move', row: 'row-2' },
    { id: 'd-move-container', move: 'D', title: 'D Move', row: 'row-2' },
    { id: 'b-move-container', move: 'B', title: 'B Move', row: 'row-2' }
  ];

  const faceComponents = [];
  const rowComponents = { 'row-1': [], 'row-2': [] };

  faceMoves.forEach(({ id, move, title, row }) => {
    const container = document.getElementById(id);
    if (container) {
      const component = new CubeComponent(container, {
        title: title,
        show2D: false,
        showMoveDisplay: true,
        moves: [move],
        interval: 3000,
        setupAlg: "x2",
        expandable: true,
        onExpand: (component) => {
          // Collapse all other rows first
          Object.values(rowComponents).forEach(rowComps => {
            rowComps.forEach(comp => {
              if (comp !== component) {
                comp.collapse();
                comp.show(); // Make sure all components are visible initially
              }
            });
          });
          
          // Hide other components in the same row
          const currentRow = rowComponents[row];
          currentRow.forEach(comp => {
            if (comp !== component) {
              comp.hide();
            }
          });
          
          // Expand this component with base, prime, and double moves
          const baseMove = move;
          const primeMove = move + "'";
          const doubleMove = move + "2";
          
          component.setExpandedMoves([baseMove, primeMove, doubleMove]);
        },
        onCollapse: (component) => {
          // Show all components in the same row when this one collapses
          const currentRow = rowComponents[row];
          currentRow.forEach(comp => {
            comp.show();
          });
        }
      });
      
      faceComponents.push(component);
      rowComponents[row].push(component);
    }
  });

  // Wide turns breakdown - individual moves
  const wideMoves = [
    { id: 'r-wide-container', move: 'r', title: 'r Move' },
    { id: 'u-wide-container', move: 'u', title: 'u Move' },
    { id: 'f-wide-container', move: 'f', title: 'f Move' },
    { id: 'l-wide-container', move: 'l', title: 'l Move' },
    { id: 'd-wide-container', move: 'd', title: 'd Move' },
    { id: 'b-wide-container', move: 'b', title: 'b Move' }
  ];

  wideMoves.forEach(({ id, move, title }) => {
    const container = document.getElementById(id);
    if (container) {
      new CubeComponent(container, {
        title: title,
        show2D: false,
        showMoveDisplay: true,
        moves: [move],
        interval: 3000,
        setupAlg: "x2"
      });
    }
  });

  // Slice turns breakdown - individual moves
  const sliceMoves = [
    { id: 'm-slice-container', move: 'M', title: 'M Move' },
    { id: 'e-slice-container', move: 'E', title: 'E Move' },
    { id: 's-slice-container', move: 'S', title: 'S Move' }
  ];

  sliceMoves.forEach(({ id, move, title }) => {
    const container = document.getElementById(id);
    if (container) {
      new CubeComponent(container, {
        title: title,
        show2D: false,
        showMoveDisplay: true,
        moves: [move],
        interval: 3000,
        setupAlg: "x2"
      });
    }
  });

  // Rotations breakdown - individual moves
  const rotationMoves = [
    { id: 'x-rotation-container', move: 'x', title: 'x Rotation' },
    { id: 'y-rotation-container', move: 'y', title: 'y Rotation' },
    { id: 'z-rotation-container', move: 'z', title: 'z Rotation' }
  ];

  rotationMoves.forEach(({ id, move, title }) => {
    const container = document.getElementById(id);
    if (container) {
      new CubeComponent(container, {
        title: title,
        show2D: false,
        showMoveDisplay: true,
        moves: [move],
        interval: 3000,
        setupAlg: "x2"
      });
    }
  });
} 