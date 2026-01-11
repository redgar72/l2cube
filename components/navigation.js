// Navigation system for the tutorial

// Function to scroll to a specific section
export function scrollToSection(sectionClass) {
  const section = document.querySelector(`.${sectionClass}`);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

// Initialize navigation functionality
export function initializeNavigation() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navSectionTitles = document.querySelectorAll('.nav-section-title');

  // Toggle sidebar
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // Handle navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      // Try ID first, then class (for backward compatibility)
      const targetSection = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
      
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // If this is a section title link, also expand its submenu
        if (link.classList.contains('nav-section-title')) {
          const submenu = link.nextElementSibling;
          if (submenu && submenu.classList.contains('nav-submenu')) {
            submenu.classList.add('expanded');
            link.classList.add('expanded');
          }
        }
      }
    });
  });

  // Toggle submenu sections (for non-link titles like "OLL", "Cross", etc.)
  navSectionTitles.forEach(title => {
    // Skip if it's a link (those are handled above)
    if (title.tagName === 'A') return;
    
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

// Helper function to handle main move component clicks
export function handleMainMoveClick(event, componentId) {
  // Only scroll if the click wasn't on the cube demo
  if (!event.target.closest('.cube-demo')) {
    scrollToSection(componentId.replace('-container', '-breakdown'));
  }
}

// Helper function to handle main move modal clicks with state capture
export function handleMainMoveModalClick(event, title, moves) {
  console.log('handleMainMoveModalClick called with:', { title, moves });
  
  // Find the source twisty-player to capture its state
  const sourceTwistyPlayer = findSourceTwistyPlayer(event);
  const sourceCubeState = sourceTwistyPlayer ? captureCubeState(sourceTwistyPlayer) : null;
  
  console.log('Source cube state for main move modal:', sourceCubeState);
  // Use the global function that will be set by app.js
  window.showMainMoveModal(title, moves, sourceCubeState);
}

// Import dependencies for the modal functions
import { findSourceTwistyPlayer, captureCubeState } from './moveUtils.js'; 