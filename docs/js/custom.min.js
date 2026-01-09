/* Custom JS Bundle - Generated 2026-01-09T06:03:31.422Z */

/* custom.js */
/* Custom JS Bundle - Generated 2025-10-06T21:40:08.700Z */

/* custom.js */
/* Custom JS Bundle - Generated 2025-10-04T19:50:49.104Z */

/* custom.js */
/* Custom JS Bundle - Generated 2025-10-04T15:28:42.058Z */

/* custom.js */
/* Custom JS Bundle - Generated 2025-10-04T15:27:44.984Z */

/* custom.js */
/* Custom JS Bundle - Generated 2025-10-04T15:26:15.946Z */

/* custom.js */
/* Custom JS Bundle - Generated 2025-10-04T15:25:33.120Z */

/* custom.js */
/* Custom JS Bundle - Generated 2025-10-04T15:04:59.118Z */



/* song-detail.js */
// Song detail page JavaScript
console.log('External song-detail.js loaded!');

// Initialize when DOM is ready
(function() {
  function initializePage() {
    const loadingContainer = document.getElementById('loading-container');
    const errorContainer = document.getElementById('error-container');
    const songContainer = document.getElementById('song-container');
    const errorMessage = document.getElementById('error-message');

    // Get song ID from URL path
    const pathParts = window.location.pathname.split('/');
    const songId = pathParts[pathParts.length - 1];
    
    console.log('Song ID from URL:', songId);

    function loadSongDetails() {
      fetch(`/api/song/${songId}`)
        .then(response => {
          console.log('API Response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(song => {
          console.log('Song data received:', song);
          
          if (song.error) {
            throw new Error(song.error);
          }
          
          populateSongDetails(song);
          
          // Hide loading, show content
          loadingContainer.classList.add('d-none');
          songContainer.classList.remove('d-none');
        })
        .catch(error => {
          console.error('Error loading song:', error);
          showError(error.message || 'Failed to load song details');
        });
    }

    function populateSongDetails(song) {
      // Basic information
      document.getElementById('rank-number').textContent = song.rank || 'N/A';
      document.getElementById('song-title').textContent = song.title || 'Unknown Title';
      document.getElementById('channel-name').textContent = song.channel || 'Unknown Channel';
      document.getElementById('song-views').textContent = song.views || 'N/A';
      document.getElementById('song-duration').textContent = song.duration || 'N/A';
      document.getElementById('song-followers').textContent = song.followers || 'N/A';
      
      // Large stats
      document.getElementById('views-large').textContent = song.views || 'N/A';
      document.getElementById('duration-large').textContent = song.duration || 'N/A';
      document.getElementById('followers-large').textContent = song.followers || 'N/A';

      // Detailed information
      document.getElementById('song-full-title').textContent = song.title || 'Unknown Title';
      document.getElementById('category-badge').textContent = song.category || 'Music';

      // Channel link
      if (song.channelUrl) {
        document.getElementById('channel-link').href = song.channelUrl;
        document.getElementById('channel-url-container').classList.remove('d-none');
      } else {
        document.getElementById('channel-url-container').classList.add('d-none');
      }

      // Description
      renderDescription(song.description);

      // Tags
      renderTags(song.tags);

      // Navigation
      setupNavigation(parseInt(song.rank) || 1);

      // Update page title
      document.title = `${song.title || 'Unknown'} - ${song.channel || 'Unknown'} | Song Details`;
    }

    function renderDescription(description) {
      const descContainer = document.getElementById('song-description');
      const toggleBtn = document.getElementById('toggle-description');
      
      if (!description) {
        document.getElementById('description-card').classList.add('d-none');
        return;
      }

      const formattedDesc = formatDescription(description);
      
      if (formattedDesc.length > 500) {
        const shortDesc = formattedDesc.substring(0, 500) + '...';
        descContainer.innerHTML = shortDesc;
        toggleBtn.classList.remove('d-none');
        
        let isExpanded = false;
        toggleBtn.onclick = function() {
          if (isExpanded) {
            descContainer.innerHTML = shortDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Show More';
          } else {
            descContainer.innerHTML = formattedDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Show Less';
          }
          isExpanded = !isExpanded;
        };
      } else {
        descContainer.innerHTML = formattedDesc;
      }
    }

    function formatDescription(description) {
      // Convert URLs to clickable links
      return description.replace(/https?:\/\/[^\s\n]+/g, function(url) {
        return `<a href="${url}" target="_blank" class="text-primary text-decoration-none">${url} <i class="bi bi-box-arrow-up-right small"></i></a>`;
      }).replace(/\n/g, '<br>');
    }

    function renderTags(tags) {
      const tagsContainer = document.getElementById('song-tags');
      
      if (!tags) {
        document.getElementById('tags-card').classList.add('d-none');
        return;
      }

      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (tagList.length === 0) {
        document.getElementById('tags-card').classList.add('d-none');
        return;
      }

      tagsContainer.innerHTML = tagList.map(tag => 
        `<span class="badge bg-light text-dark border">${tag}</span>`
      ).join('');
    }

    function setupNavigation(currentRank) {
      const prevBtn = document.getElementById('prev-song');
      const nextBtn = document.getElementById('next-song');

      // Previous song
      if (currentRank > 1) {
        prevBtn.onclick = () => window.location.href = `/song/${currentRank - 1}`;
      } else {
        prevBtn.disabled = true;
      }

      // Next song (assuming max 100 songs)
      if (currentRank < 100) {
        nextBtn.onclick = () => window.location.href = `/song/${currentRank + 1}`;
      } else {
        nextBtn.disabled = true;
      }
    }

    function showError(message) {
      loadingContainer.classList.add('d-none');
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }

    // Initialize
    loadSongDetails();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
  } else {
    initializePage();
  }
})();

/* theme-demo.js */
/**
 * Theme Toggle Demo Button
 * 
 * This script initializes the theme toggle demo button on the homepage.
 * It's extracted from the inline script in pages.json to improve security
 * by avoiding inline scripts.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find the theme demo toggle button
  const themeToggleButton = document.getElementById('theme-demo-toggle');
  
  if (themeToggleButton) {
    // Initialize button text based on current theme
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    themeToggleButton.textContent = currentTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    
    // Add click event listener
    themeToggleButton.addEventListener('click', function() {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update theme
      htmlElement.setAttribute('data-bs-theme', newTheme);
      
      // Update button text
      this.textContent = newTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    });
  }
});


/* theme-toggle.js */
/**
 * Dark mode toggle script
 */
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use device preference
  const getThemePreference = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme preference
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'dark');
      if (darkModeToggle) {
        darkModeToggle.checked = true;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-moon-fill"></i>';
      }
    } else {
      htmlElement.setAttribute('data-bs-theme', 'light');
      if (darkModeToggle) {
        darkModeToggle.checked = false;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    }
  };

  // Initial theme setup
  applyTheme(getThemePreference());

  // Handle toggle click
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    });
  }

  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
});

/* component-library.js */
/**
 * Component Library JavaScript
 * Enhances the component library page with interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize syntax highlighting
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
      });
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Add offset for fixed header if needed
          const offset = 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  
    // Add "Copy code" buttons to code examples
    document.querySelectorAll('.code-example pre').forEach((preElement, index) => {
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'btn btn-sm btn-outline-primary copy-btn';
      copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
      copyButton.setAttribute('data-index', index);
      
      // Insert button before the pre element
      preElement.parentNode.insertBefore(copyButton, preElement);
      
      // Add click event to copy code
      copyButton.addEventListener('click', function() {
        const codeElement = this.nextElementSibling.querySelector('code');
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Change button text temporarily
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="bi bi-check2"></i> Copied!';
          this.classList.remove('btn-outline-primary');
          this.classList.add('btn-success');
          
          // Reset button after a delay
          setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('btn-success');
            this.classList.add('btn-outline-primary');
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
      });
    });
  
    // Highlight active section in the sidebar based on scroll position
    const sections = document.querySelectorAll('.component-section');
    const navItems = document.querySelectorAll('.list-group-item');
    
    function setActiveNavItem() {
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // This variable was unused, but removing it to fix the ESLint error
        // const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = '#' + section.getAttribute('id');
        }
      });
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentSection) {
          item.classList.add('active');
        }
      });
    }
    
    // Set active nav item on page load
    setActiveNavItem();
    
    // Update active nav item on scroll
    window.addEventListener('scroll', setActiveNavItem);
  });

/* form-validation.js */
/**
 * Form validation script
 * 
 * Enhances forms with Bootstrap 5 validation styles
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Fetch all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission if invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });

  // Add custom validation feedback for complex fields
  const passwordFields = document.querySelectorAll('input[type="password"].validate-strength');
  
  passwordFields.forEach(field => {
    field.addEventListener('input', () => {
      const value = field.value;
      const feedback = field.nextElementSibling;
      
      // Simple password strength feedback
      if (value.length < 8) {
        field.setCustomValidity('Password must be at least 8 characters');
        if (feedback) feedback.textContent = 'Password is too short (min 8 characters)';
      } else if (!/[A-Z]/.test(value)) {
        field.setCustomValidity('Password must contain at least one uppercase letter');
        if (feedback) feedback.textContent = 'Add at least one uppercase letter';
      } else if (!/[0-9]/.test(value)) {
        field.setCustomValidity('Password must contain at least one number');
        if (feedback) feedback.textContent = 'Add at least one number';
      } else {
        field.setCustomValidity('');
        if (feedback) feedback.textContent = 'Password strength: good';
      }
    });
  });
});

/* script.js */
console.log('Custom JavaScript loaded!');


/* service-worker-register.js */
/**
 * Service Worker Registration
 * 
 * This script registers the service worker for PWA support.
 * It's extracted from inline scripts to improve security.
 */
// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}




/* song-detail.js */
// Song detail page JavaScript
console.log('External song-detail.js loaded!');

// Initialize when DOM is ready
(function() {
  function initializePage() {
    const loadingContainer = document.getElementById('loading-container');
    const errorContainer = document.getElementById('error-container');
    const songContainer = document.getElementById('song-container');
    const errorMessage = document.getElementById('error-message');

    // Get song ID from URL path
    const pathParts = window.location.pathname.split('/');
    const songId = pathParts[pathParts.length - 1];
    
    console.log('Song ID from URL:', songId);

    function loadSongDetails() {
      fetch(`/api/song/${songId}`)
        .then(response => {
          console.log('API Response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(song => {
          console.log('Song data received:', song);
          
          if (song.error) {
            throw new Error(song.error);
          }
          
          populateSongDetails(song);
          
          // Hide loading, show content
          loadingContainer.classList.add('d-none');
          songContainer.classList.remove('d-none');
        })
        .catch(error => {
          console.error('Error loading song:', error);
          showError(error.message || 'Failed to load song details');
        });
    }

    function populateSongDetails(song) {
      // Basic information
      document.getElementById('rank-number').textContent = song.rank || 'N/A';
      document.getElementById('song-title').textContent = song.title || 'Unknown Title';
      document.getElementById('channel-name').textContent = song.channel || 'Unknown Channel';
      document.getElementById('song-views').textContent = song.views || 'N/A';
      document.getElementById('song-duration').textContent = song.duration || 'N/A';
      document.getElementById('song-followers').textContent = song.followers || 'N/A';
      
      // Large stats
      document.getElementById('views-large').textContent = song.views || 'N/A';
      document.getElementById('duration-large').textContent = song.duration || 'N/A';
      document.getElementById('followers-large').textContent = song.followers || 'N/A';

      // Detailed information
      document.getElementById('song-full-title').textContent = song.title || 'Unknown Title';
      document.getElementById('category-badge').textContent = song.category || 'Music';

      // Channel link
      if (song.channelUrl) {
        document.getElementById('channel-link').href = song.channelUrl;
        document.getElementById('channel-url-container').classList.remove('d-none');
      } else {
        document.getElementById('channel-url-container').classList.add('d-none');
      }

      // Description
      renderDescription(song.description);

      // Tags
      renderTags(song.tags);

      // Navigation
      setupNavigation(parseInt(song.rank) || 1);

      // Update page title
      document.title = `${song.title || 'Unknown'} - ${song.channel || 'Unknown'} | Song Details`;
    }

    function renderDescription(description) {
      const descContainer = document.getElementById('song-description');
      const toggleBtn = document.getElementById('toggle-description');
      
      if (!description) {
        document.getElementById('description-card').classList.add('d-none');
        return;
      }

      const formattedDesc = formatDescription(description);
      
      if (formattedDesc.length > 500) {
        const shortDesc = formattedDesc.substring(0, 500) + '...';
        descContainer.innerHTML = shortDesc;
        toggleBtn.classList.remove('d-none');
        
        let isExpanded = false;
        toggleBtn.onclick = function() {
          if (isExpanded) {
            descContainer.innerHTML = shortDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Show More';
          } else {
            descContainer.innerHTML = formattedDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Show Less';
          }
          isExpanded = !isExpanded;
        };
      } else {
        descContainer.innerHTML = formattedDesc;
      }
    }

    function formatDescription(description) {
      // Convert URLs to clickable links
      return description.replace(/https?:\/\/[^\s\n]+/g, function(url) {
        return `<a href="${url}" target="_blank" class="text-primary text-decoration-none">${url} <i class="bi bi-box-arrow-up-right small"></i></a>`;
      }).replace(/\n/g, '<br>');
    }

    function renderTags(tags) {
      const tagsContainer = document.getElementById('song-tags');
      
      if (!tags) {
        document.getElementById('tags-card').classList.add('d-none');
        return;
      }

      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (tagList.length === 0) {
        document.getElementById('tags-card').classList.add('d-none');
        return;
      }

      tagsContainer.innerHTML = tagList.map(tag => 
        `<span class="badge bg-light text-dark border">${tag}</span>`
      ).join('');
    }

    function setupNavigation(currentRank) {
      const prevBtn = document.getElementById('prev-song');
      const nextBtn = document.getElementById('next-song');

      // Previous song
      if (currentRank > 1) {
        prevBtn.onclick = () => window.location.href = `/song/${currentRank - 1}`;
      } else {
        prevBtn.disabled = true;
      }

      // Next song (assuming max 100 songs)
      if (currentRank < 100) {
        nextBtn.onclick = () => window.location.href = `/song/${currentRank + 1}`;
      } else {
        nextBtn.disabled = true;
      }
    }

    function showError(message) {
      loadingContainer.classList.add('d-none');
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }

    // Initialize
    loadSongDetails();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
  } else {
    initializePage();
  }
})();

/* theme-demo.js */
/**
 * Theme Toggle Demo Button
 * 
 * This script initializes the theme toggle demo button on the homepage.
 * It's extracted from the inline script in pages.json to improve security
 * by avoiding inline scripts.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find the theme demo toggle button
  const themeToggleButton = document.getElementById('theme-demo-toggle');
  
  if (themeToggleButton) {
    // Initialize button text based on current theme
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    themeToggleButton.textContent = currentTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    
    // Add click event listener
    themeToggleButton.addEventListener('click', function() {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update theme
      htmlElement.setAttribute('data-bs-theme', newTheme);
      
      // Update button text
      this.textContent = newTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    });
  }
});


/* theme-toggle.js */
/**
 * Dark mode toggle script
 */
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use device preference
  const getThemePreference = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme preference
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'dark');
      if (darkModeToggle) {
        darkModeToggle.checked = true;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-moon-fill"></i>';
      }
    } else {
      htmlElement.setAttribute('data-bs-theme', 'light');
      if (darkModeToggle) {
        darkModeToggle.checked = false;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    }
  };

  // Initial theme setup
  applyTheme(getThemePreference());

  // Handle toggle click
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    });
  }

  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
});

/* component-library.js */
/**
 * Component Library JavaScript
 * Enhances the component library page with interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize syntax highlighting
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
      });
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Add offset for fixed header if needed
          const offset = 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  
    // Add "Copy code" buttons to code examples
    document.querySelectorAll('.code-example pre').forEach((preElement, index) => {
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'btn btn-sm btn-outline-primary copy-btn';
      copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
      copyButton.setAttribute('data-index', index);
      
      // Insert button before the pre element
      preElement.parentNode.insertBefore(copyButton, preElement);
      
      // Add click event to copy code
      copyButton.addEventListener('click', function() {
        const codeElement = this.nextElementSibling.querySelector('code');
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Change button text temporarily
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="bi bi-check2"></i> Copied!';
          this.classList.remove('btn-outline-primary');
          this.classList.add('btn-success');
          
          // Reset button after a delay
          setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('btn-success');
            this.classList.add('btn-outline-primary');
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
      });
    });
  
    // Highlight active section in the sidebar based on scroll position
    const sections = document.querySelectorAll('.component-section');
    const navItems = document.querySelectorAll('.list-group-item');
    
    function setActiveNavItem() {
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // This variable was unused, but removing it to fix the ESLint error
        // const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = '#' + section.getAttribute('id');
        }
      });
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentSection) {
          item.classList.add('active');
        }
      });
    }
    
    // Set active nav item on page load
    setActiveNavItem();
    
    // Update active nav item on scroll
    window.addEventListener('scroll', setActiveNavItem);
  });

/* form-validation.js */
/**
 * Form validation script
 * 
 * Enhances forms with Bootstrap 5 validation styles
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Fetch all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission if invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });

  // Add custom validation feedback for complex fields
  const passwordFields = document.querySelectorAll('input[type="password"].validate-strength');
  
  passwordFields.forEach(field => {
    field.addEventListener('input', () => {
      const value = field.value;
      const feedback = field.nextElementSibling;
      
      // Simple password strength feedback
      if (value.length < 8) {
        field.setCustomValidity('Password must be at least 8 characters');
        if (feedback) feedback.textContent = 'Password is too short (min 8 characters)';
      } else if (!/[A-Z]/.test(value)) {
        field.setCustomValidity('Password must contain at least one uppercase letter');
        if (feedback) feedback.textContent = 'Add at least one uppercase letter';
      } else if (!/[0-9]/.test(value)) {
        field.setCustomValidity('Password must contain at least one number');
        if (feedback) feedback.textContent = 'Add at least one number';
      } else {
        field.setCustomValidity('');
        if (feedback) feedback.textContent = 'Password strength: good';
      }
    });
  });
});

/* script.js */
console.log('Custom JavaScript loaded!');


/* service-worker-register.js */
/**
 * Service Worker Registration
 * 
 * This script registers the service worker for PWA support.
 * It's extracted from inline scripts to improve security.
 */
// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}




/* song-detail.js */
// Song detail page JavaScript
console.log('External song-detail.js loaded!');

// Initialize when DOM is ready
(function() {
  function initializePage() {
    console.log('initializePage called');
    const loadingContainer = document.getElementById('loading-container');
    const errorContainer = document.getElementById('error-container');
    const songContainer = document.getElementById('song-container');
    const errorMessage = document.getElementById('error-message');

    console.log('DOM elements found:', {
      loadingContainer: !!loadingContainer,
      errorContainer: !!errorContainer,
      songContainer: !!songContainer,
      errorMessage: !!errorMessage
    });

    // Get song ID from URL path
    const pathParts = window.location.pathname.split('/');
    const songId = pathParts[pathParts.length - 1];
    
    console.log('Song ID from URL:', songId);
    console.log('Current URL:', window.location.pathname);

    function loadSongDetails() {
      console.log('loadSongDetails called with songId:', songId);
      const apiUrl = `/api/song/${songId}`;
      console.log('Fetching from URL:', apiUrl);
      
      fetch(apiUrl)
        .then(response => {
          console.log('API Response status:', response.status);
          console.log('API Response ok:', response.ok);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(song => {
          console.log('Song data received:', song);
          
          if (song.error) {
            throw new Error(song.error);
          }
          
          populateSongDetails(song);
          
          // Hide loading, show content
          loadingContainer.classList.add('d-none');
          songContainer.classList.remove('d-none');
        })
        .catch(error => {
          console.error('Error loading song:', error);
          showError(error.message || 'Failed to load song details');
        });
    }

    function populateSongDetails(song) {
      console.log('populateSongDetails called with:', song);
      
      // Basic information
      console.log('Setting basic info...');
      document.getElementById('rank-number').textContent = song.rank || 'N/A';
      document.getElementById('song-title').textContent = song.title || 'Unknown Title';
      document.getElementById('channel-name').textContent = song.channel || 'Unknown Channel';
      document.getElementById('song-views').textContent = song.views || 'N/A';
      document.getElementById('song-duration').textContent = song.duration || 'N/A';
      document.getElementById('song-followers').textContent = song.followers || 'N/A';
      
      // Large stats
      console.log('Setting large stats...');
      document.getElementById('views-large').textContent = song.views || 'N/A';
      document.getElementById('duration-large').textContent = song.duration || 'N/A';
      document.getElementById('followers-large').textContent = song.followers || 'N/A';

      // Detailed information
      console.log('Setting detailed info...');
      document.getElementById('song-full-title').textContent = song.title || 'Unknown Title';
      document.getElementById('category-badge').textContent = song.category || 'Music';

      // Channel link
      if (song.channelUrl) {
        document.getElementById('channel-link').href = song.channelUrl;
        document.getElementById('channel-url-container').classList.remove('d-none');
      } else {
        document.getElementById('channel-url-container').classList.add('d-none');
      }

      // Description
      renderDescription(song.description);

      // Tags
      renderTags(song.tags);

      // Navigation
      setupNavigation(parseInt(song.rank) || 1);

      // Update page title
      document.title = `${song.title || 'Unknown'} - ${song.channel || 'Unknown'} | Song Details`;
    }

    function renderDescription(description) {
      const descContainer = document.getElementById('song-description');
      const toggleBtn = document.getElementById('toggle-description');
      
      if (!description) {
        document.getElementById('description-card').classList.add('d-none');
        return;
      }

      const formattedDesc = formatDescription(description);
      
      if (formattedDesc.length > 500) {
        const shortDesc = formattedDesc.substring(0, 500) + '...';
        descContainer.innerHTML = shortDesc;
        toggleBtn.classList.remove('d-none');
        
        let isExpanded = false;
        toggleBtn.onclick = function() {
          if (isExpanded) {
            descContainer.innerHTML = shortDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Show More';
          } else {
            descContainer.innerHTML = formattedDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Show Less';
          }
          isExpanded = !isExpanded;
        };
      } else {
        descContainer.innerHTML = formattedDesc;
      }
    }

    function formatDescription(description) {
      // Convert URLs to clickable links
      return description.replace(/https?:\/\/[^\s\n]+/g, function(url) {
        return `<a href="${url}" target="_blank" class="text-primary text-decoration-none">${url} <i class="bi bi-box-arrow-up-right small"></i></a>`;
      }).replace(/\n/g, '<br>');
    }

    function renderTags(tags) {
      const tagsContainer = document.getElementById('song-tags');
      
      if (!tags) {
        document.getElementById('tags-card').classList.add('d-none');
        return;
      }

      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (tagList.length === 0) {
        document.getElementById('tags-card').classList.add('d-none');
        return;
      }

      tagsContainer.innerHTML = tagList.map(tag => 
        `<span class="badge bg-light text-dark border">${tag}</span>`
      ).join('');
    }

    function setupNavigation(currentRank) {
      const prevBtn = document.getElementById('prev-song');
      const nextBtn = document.getElementById('next-song');

      // Previous song
      if (currentRank > 1) {
        prevBtn.onclick = () => window.location.href = `/song/${currentRank - 1}`;
      } else {
        prevBtn.disabled = true;
      }

      // Next song (assuming max 100 songs)
      if (currentRank < 100) {
        nextBtn.onclick = () => window.location.href = `/song/${currentRank + 1}`;
      } else {
        nextBtn.disabled = true;
      }
    }

    function showError(message) {
      loadingContainer.classList.add('d-none');
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }

    // Initialize
    loadSongDetails();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
  } else {
    initializePage();
  }
})();

/* theme-demo.js */
/**
 * Theme Toggle Demo Button
 * 
 * This script initializes the theme toggle demo button on the homepage.
 * It's extracted from the inline script in pages.json to improve security
 * by avoiding inline scripts.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find the theme demo toggle button
  const themeToggleButton = document.getElementById('theme-demo-toggle');
  
  if (themeToggleButton) {
    // Initialize button text based on current theme
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    themeToggleButton.textContent = currentTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    
    // Add click event listener
    themeToggleButton.addEventListener('click', function() {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update theme
      htmlElement.setAttribute('data-bs-theme', newTheme);
      
      // Update button text
      this.textContent = newTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    });
  }
});


/* theme-toggle.js */
/**
 * Dark mode toggle script
 */
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use device preference
  const getThemePreference = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme preference
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'dark');
      if (darkModeToggle) {
        darkModeToggle.checked = true;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-moon-fill"></i>';
      }
    } else {
      htmlElement.setAttribute('data-bs-theme', 'light');
      if (darkModeToggle) {
        darkModeToggle.checked = false;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    }
  };

  // Initial theme setup
  applyTheme(getThemePreference());

  // Handle toggle click
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    });
  }

  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
});

/* component-library.js */
/**
 * Component Library JavaScript
 * Enhances the component library page with interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize syntax highlighting
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
      });
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Add offset for fixed header if needed
          const offset = 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  
    // Add "Copy code" buttons to code examples
    document.querySelectorAll('.code-example pre').forEach((preElement, index) => {
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'btn btn-sm btn-outline-primary copy-btn';
      copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
      copyButton.setAttribute('data-index', index);
      
      // Insert button before the pre element
      preElement.parentNode.insertBefore(copyButton, preElement);
      
      // Add click event to copy code
      copyButton.addEventListener('click', function() {
        const codeElement = this.nextElementSibling.querySelector('code');
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Change button text temporarily
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="bi bi-check2"></i> Copied!';
          this.classList.remove('btn-outline-primary');
          this.classList.add('btn-success');
          
          // Reset button after a delay
          setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('btn-success');
            this.classList.add('btn-outline-primary');
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
      });
    });
  
    // Highlight active section in the sidebar based on scroll position
    const sections = document.querySelectorAll('.component-section');
    const navItems = document.querySelectorAll('.list-group-item');
    
    function setActiveNavItem() {
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // This variable was unused, but removing it to fix the ESLint error
        // const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = '#' + section.getAttribute('id');
        }
      });
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentSection) {
          item.classList.add('active');
        }
      });
    }
    
    // Set active nav item on page load
    setActiveNavItem();
    
    // Update active nav item on scroll
    window.addEventListener('scroll', setActiveNavItem);
  });

/* form-validation.js */
/**
 * Form validation script
 * 
 * Enhances forms with Bootstrap 5 validation styles
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Fetch all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission if invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });

  // Add custom validation feedback for complex fields
  const passwordFields = document.querySelectorAll('input[type="password"].validate-strength');
  
  passwordFields.forEach(field => {
    field.addEventListener('input', () => {
      const value = field.value;
      const feedback = field.nextElementSibling;
      
      // Simple password strength feedback
      if (value.length < 8) {
        field.setCustomValidity('Password must be at least 8 characters');
        if (feedback) feedback.textContent = 'Password is too short (min 8 characters)';
      } else if (!/[A-Z]/.test(value)) {
        field.setCustomValidity('Password must contain at least one uppercase letter');
        if (feedback) feedback.textContent = 'Add at least one uppercase letter';
      } else if (!/[0-9]/.test(value)) {
        field.setCustomValidity('Password must contain at least one number');
        if (feedback) feedback.textContent = 'Add at least one number';
      } else {
        field.setCustomValidity('');
        if (feedback) feedback.textContent = 'Password strength: good';
      }
    });
  });
});

/* script.js */
console.log('Custom JavaScript loaded!');


/* service-worker-register.js */
/**
 * Service Worker Registration
 * 
 * This script registers the service worker for PWA support.
 * It's extracted from inline scripts to improve security.
 */
// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}




/* song-detail.js */
// Song detail page JavaScript
console.log('External song-detail.js loaded!');

// Initialize when DOM is ready
(function() {
  function initializePage() {
    console.log('initializePage called');
    const loadingContainer = document.getElementById('loading-container');
    const errorContainer = document.getElementById('error-container');
    const songContainer = document.getElementById('song-container');
    const errorMessage = document.getElementById('error-message');

    console.log('DOM elements found:', {
      loadingContainer: !!loadingContainer,
      errorContainer: !!errorContainer,
      songContainer: !!songContainer,
      errorMessage: !!errorMessage
    });

    // Get song ID from URL path
    const pathParts = window.location.pathname.split('/');
    const songId = pathParts[pathParts.length - 1];
    
    console.log('Song ID from URL:', songId);
    console.log('Current URL:', window.location.pathname);

    function loadSongDetails() {
      console.log('loadSongDetails called with songId:', songId);
      const apiUrl = `/api/song/${songId}`;
      console.log('Fetching from URL:', apiUrl);
      
      fetch(apiUrl)
        .then(response => {
          console.log('API Response status:', response.status);
          console.log('API Response ok:', response.ok);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(song => {
          console.log('Song data received:', song);
          
          if (song.error) {
            throw new Error(song.error);
          }
          
          populateSongDetails(song);
          
          // Hide loading, show content
          loadingContainer.classList.add('d-none');
          songContainer.classList.remove('d-none');
        })
        .catch(error => {
          console.error('Error loading song:', error);
          showError(error.message || 'Failed to load song details');
        });
    }

    function populateSongDetails(song) {
      console.log('populateSongDetails called with:', song);
      
      // Basic information
      console.log('Setting basic info...');
      document.getElementById('rank-number').textContent = song.rank || 'N/A';
      document.getElementById('song-title').textContent = song.title || 'Unknown Title';
      document.getElementById('channel-name').textContent = song.channel || 'Unknown Channel';
      document.getElementById('song-views').textContent = song.views || 'N/A';
      document.getElementById('song-duration').textContent = song.duration || 'N/A';
      document.getElementById('song-followers').textContent = song.followers || 'N/A';
      
      // Large stats
      console.log('Setting large stats...');
      document.getElementById('views-large').textContent = song.views || 'N/A';
      document.getElementById('duration-large').textContent = song.duration || 'N/A';
      document.getElementById('followers-large').textContent = song.followers || 'N/A';

      // Detailed information
      console.log('Setting detailed info...');
      document.getElementById('song-full-title').textContent = song.title || 'Unknown Title';
      document.getElementById('category-badge').textContent = song.category || 'Music';

      // Channel link
      if (song.channelUrl) {
        document.getElementById('channel-link').href = song.channelUrl;
        document.getElementById('channel-url-container').classList.remove('d-none');
      } else {
        document.getElementById('channel-url-container').classList.add('d-none');
      }

      // Description
      renderDescription(song.description);

      // Tags
      renderTags(song.tags);

      // Navigation
      setupNavigation(parseInt(song.rank) || 1);

      // Update page title
      document.title = `${song.title || 'Unknown'} - ${song.channel || 'Unknown'} | Song Details`;
    }

    function renderDescription(description) {
      const descContainer = document.getElementById('song-description');
      const toggleBtn = document.getElementById('toggle-description');
      
      if (!description) {
        document.getElementById('description-card').classList.add('d-none');
        return;
      }

      const formattedDesc = formatDescription(description);
      
      if (formattedDesc.length > 500) {
        const shortDesc = formattedDesc.substring(0, 500) + '...';
        descContainer.innerHTML = shortDesc;
        toggleBtn.classList.remove('d-none');
        
        let isExpanded = false;
        toggleBtn.onclick = function() {
          if (isExpanded) {
            descContainer.innerHTML = shortDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Show More';
          } else {
            descContainer.innerHTML = formattedDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Show Less';
          }
          isExpanded = !isExpanded;
        };
      } else {
        descContainer.innerHTML = formattedDesc;
      }
    }

    function formatDescription(description) {
      // Convert URLs to clickable links
      return description.replace(/https?:\/\/[^\s\n]+/g, function(url) {
        return `<a href="${url}" target="_blank" class="text-primary text-decoration-none">${url} <i class="bi bi-box-arrow-up-right small"></i></a>`;
      }).replace(/\n/g, '<br>');
    }

    function renderTags(tags) {
      const tagsContainer = document.getElementById('song-tags');
      
      if (!tags) {
        document.getElementById('tags-card').classList.add('d-none');
        return;
      }

      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (tagList.length === 0) {
        document.getElementById('tags-card').classList.add('d-none');
        return;
      }

      tagsContainer.innerHTML = tagList.map(tag => 
        `<span class="badge bg-light text-dark border">${tag}</span>`
      ).join('');
    }

    function setupNavigation(currentRank) {
      const prevBtn = document.getElementById('prev-song');
      const nextBtn = document.getElementById('next-song');

      // Previous song
      if (currentRank > 1) {
        prevBtn.onclick = () => window.location.href = `/song/${currentRank - 1}`;
      } else {
        prevBtn.disabled = true;
      }

      // Next song (assuming max 100 songs)
      if (currentRank < 100) {
        nextBtn.onclick = () => window.location.href = `/song/${currentRank + 1}`;
      } else {
        nextBtn.disabled = true;
      }
    }

    function showError(message) {
      loadingContainer.classList.add('d-none');
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }

    // Initialize
    loadSongDetails();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
  } else {
    initializePage();
  }
})();

/* theme-demo.js */
/**
 * Theme Toggle Demo Button
 * 
 * This script initializes the theme toggle demo button on the homepage.
 * It's extracted from the inline script in pages.json to improve security
 * by avoiding inline scripts.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find the theme demo toggle button
  const themeToggleButton = document.getElementById('theme-demo-toggle');
  
  if (themeToggleButton) {
    // Initialize button text based on current theme
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    themeToggleButton.textContent = currentTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    
    // Add click event listener
    themeToggleButton.addEventListener('click', function() {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update theme
      htmlElement.setAttribute('data-bs-theme', newTheme);
      
      // Update button text
      this.textContent = newTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    });
  }
});


/* theme-toggle.js */
/**
 * Dark mode toggle script
 */
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use device preference
  const getThemePreference = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme preference
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'dark');
      if (darkModeToggle) {
        darkModeToggle.checked = true;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-moon-fill"></i>';
      }
    } else {
      htmlElement.setAttribute('data-bs-theme', 'light');
      if (darkModeToggle) {
        darkModeToggle.checked = false;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    }
  };

  // Initial theme setup
  applyTheme(getThemePreference());

  // Handle toggle click
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    });
  }

  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
});

/* component-library.js */
/**
 * Component Library JavaScript
 * Enhances the component library page with interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize syntax highlighting
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
      });
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Add offset for fixed header if needed
          const offset = 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  
    // Add "Copy code" buttons to code examples
    document.querySelectorAll('.code-example pre').forEach((preElement, index) => {
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'btn btn-sm btn-outline-primary copy-btn';
      copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
      copyButton.setAttribute('data-index', index);
      
      // Insert button before the pre element
      preElement.parentNode.insertBefore(copyButton, preElement);
      
      // Add click event to copy code
      copyButton.addEventListener('click', function() {
        const codeElement = this.nextElementSibling.querySelector('code');
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Change button text temporarily
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="bi bi-check2"></i> Copied!';
          this.classList.remove('btn-outline-primary');
          this.classList.add('btn-success');
          
          // Reset button after a delay
          setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('btn-success');
            this.classList.add('btn-outline-primary');
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
      });
    });
  
    // Highlight active section in the sidebar based on scroll position
    const sections = document.querySelectorAll('.component-section');
    const navItems = document.querySelectorAll('.list-group-item');
    
    function setActiveNavItem() {
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // This variable was unused, but removing it to fix the ESLint error
        // const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = '#' + section.getAttribute('id');
        }
      });
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentSection) {
          item.classList.add('active');
        }
      });
    }
    
    // Set active nav item on page load
    setActiveNavItem();
    
    // Update active nav item on scroll
    window.addEventListener('scroll', setActiveNavItem);
  });

/* form-validation.js */
/**
 * Form validation script
 * 
 * Enhances forms with Bootstrap 5 validation styles
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Fetch all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission if invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });

  // Add custom validation feedback for complex fields
  const passwordFields = document.querySelectorAll('input[type="password"].validate-strength');
  
  passwordFields.forEach(field => {
    field.addEventListener('input', () => {
      const value = field.value;
      const feedback = field.nextElementSibling;
      
      // Simple password strength feedback
      if (value.length < 8) {
        field.setCustomValidity('Password must be at least 8 characters');
        if (feedback) feedback.textContent = 'Password is too short (min 8 characters)';
      } else if (!/[A-Z]/.test(value)) {
        field.setCustomValidity('Password must contain at least one uppercase letter');
        if (feedback) feedback.textContent = 'Add at least one uppercase letter';
      } else if (!/[0-9]/.test(value)) {
        field.setCustomValidity('Password must contain at least one number');
        if (feedback) feedback.textContent = 'Add at least one number';
      } else {
        field.setCustomValidity('');
        if (feedback) feedback.textContent = 'Password strength: good';
      }
    });
  });
});

/* script.js */
console.log('Custom JavaScript loaded!');


/* service-worker-register.js */
/**
 * Service Worker Registration
 * 
 * This script registers the service worker for PWA support.
 * It's extracted from inline scripts to improve security.
 */
// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}




/* song-detail.js */
// Song detail page JavaScript
console.log('External song-detail.js loaded!');

// Initialize when DOM is ready
(function() {
  function initializePage() {
    console.log('initializePage called');
    
    // Check if we're on a song detail page by looking for required elements
    const loadingContainer = document.getElementById('loading-container');
    const errorContainer = document.getElementById('error-container');
    const songContainer = document.getElementById('song-container');
    const errorMessage = document.getElementById('error-message');

    // If the required elements don't exist, this isn't a song detail page - exit early
    if (!loadingContainer || !errorContainer || !songContainer || !errorMessage) {
      console.log('Not a song detail page, skipping initialization');
      return;
    }

    console.log('DOM elements found:', {
      loadingContainer: !!loadingContainer,
      errorContainer: !!errorContainer,
      songContainer: !!songContainer,
      errorMessage: !!errorMessage
    });

    // Get song ID from URL path
    const pathParts = window.location.pathname.split('/');
    const songId = pathParts[pathParts.length - 1];
    
    console.log('Song ID from URL:', songId);
    console.log('Current URL:', window.location.pathname);

    function loadSongDetails() {
      console.log('loadSongDetails called with songId:', songId);
      const apiUrl = `/api/song/${songId}`;
      console.log('Fetching from URL:', apiUrl);
      
      fetch(apiUrl)
        .then(response => {
          console.log('API Response status:', response.status);
          console.log('API Response ok:', response.ok);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(song => {
          console.log('Song data received:', song);
          
          if (song.error) {
            throw new Error(song.error);
          }
          
          populateSongDetails(song);
          
          // Hide loading, show content
          loadingContainer.classList.add('d-none');
          songContainer.classList.remove('d-none');
        })
        .catch(error => {
          console.error('Error loading song:', error);
          showError(error.message || 'Failed to load song details');
        });
    }

    function populateSongDetails(song) {
      console.log('populateSongDetails called with:', song);
      
      // Check if all required elements exist before proceeding
      const requiredElements = [
        'rank-number', 'song-title', 'channel-name', 'song-views', 
        'song-duration', 'song-followers', 'views-large', 'duration-large', 
        'followers-large', 'song-full-title', 'category-badge'
      ];
      
      const missingElements = requiredElements.filter(id => !document.getElementById(id));
      if (missingElements.length > 0) {
        console.error('Missing required DOM elements:', missingElements);
        showError('Page structure is incomplete. Missing elements: ' + missingElements.join(', '));
        return;
      }
      
      // Basic information
      console.log('Setting basic info...');
      document.getElementById('rank-number').textContent = song.rank || 'N/A';
      document.getElementById('song-title').textContent = song.title || 'Unknown Title';
      document.getElementById('channel-name').textContent = song.channel || 'Unknown Channel';
      document.getElementById('song-views').textContent = song.views || 'N/A';
      document.getElementById('song-duration').textContent = song.duration || 'N/A';
      document.getElementById('song-followers').textContent = song.followers || 'N/A';
      
      // Large stats
      console.log('Setting large stats...');
      document.getElementById('views-large').textContent = song.views || 'N/A';
      document.getElementById('duration-large').textContent = song.duration || 'N/A';
      document.getElementById('followers-large').textContent = song.followers || 'N/A';

      // Detailed information
      console.log('Setting detailed info...');
      document.getElementById('song-full-title').textContent = song.title || 'Unknown Title';
      document.getElementById('category-badge').textContent = song.category || 'Music';

      // Channel link
      if (song.channelUrl) {
        document.getElementById('channel-link').href = song.channelUrl;
        document.getElementById('channel-url-container').classList.remove('d-none');
      } else {
        document.getElementById('channel-url-container').classList.add('d-none');
      }

      // Description
      renderDescription(song.description);

      // Tags
      renderTags(song.tags);

      // Navigation
      setupNavigation(parseInt(song.rank) || 1);

      // Update page title
      document.title = `${song.title || 'Unknown'} - ${song.channel || 'Unknown'} | Song Details`;
    }

    function renderDescription(description) {
      const descContainer = document.getElementById('song-description');
      const toggleBtn = document.getElementById('toggle-description');
      const descCard = document.getElementById('description-card');
      
      // Check if required elements exist
      if (!descContainer || !descCard) {
        console.log('Description elements not found, skipping description rendering');
        return;
      }
      
      if (!description) {
        descCard.classList.add('d-none');
        return;
      }

      const formattedDesc = formatDescription(description);
      
      if (formattedDesc.length > 500) {
        const shortDesc = formattedDesc.substring(0, 500) + '...';
        descContainer.innerHTML = shortDesc;
        toggleBtn.classList.remove('d-none');
        
        let isExpanded = false;
        toggleBtn.onclick = function() {
          if (isExpanded) {
            descContainer.innerHTML = shortDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Show More';
          } else {
            descContainer.innerHTML = formattedDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Show Less';
          }
          isExpanded = !isExpanded;
        };
      } else {
        descContainer.innerHTML = formattedDesc;
      }
    }

    function formatDescription(description) {
      // Convert URLs to clickable links
      return description.replace(/https?:\/\/[^\s\n]+/g, function(url) {
        return `<a href="${url}" target="_blank" class="text-primary text-decoration-none">${url} <i class="bi bi-box-arrow-up-right small"></i></a>`;
      }).replace(/\n/g, '<br>');
    }

    function renderTags(tags) {
      const tagsContainer = document.getElementById('song-tags');
      const tagsCard = document.getElementById('tags-card');
      
      // Check if required elements exist
      if (!tagsContainer || !tagsCard) {
        console.log('Tags elements not found, skipping tags rendering');
        return;
      }
      
      if (!tags) {
        tagsCard.classList.add('d-none');
        return;
      }

      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (tagList.length === 0) {
        tagsCard.classList.add('d-none');
        return;
      }

      tagsContainer.innerHTML = tagList.map(tag => 
        `<span class="badge bg-light text-dark border">${tag}</span>`
      ).join('');
    }

    function setupNavigation(currentRank) {
      const prevBtn = document.getElementById('prev-song');
      const nextBtn = document.getElementById('next-song');

      // Check if navigation elements exist
      if (!prevBtn || !nextBtn) {
        console.log('Navigation elements not found, skipping navigation setup');
        return;
      }

      // Previous song
      if (currentRank > 1) {
        prevBtn.onclick = () => window.location.href = `/song/${currentRank - 1}`;
      } else {
        prevBtn.disabled = true;
      }

      // Next song (assuming max 100 songs)
      if (currentRank < 100) {
        nextBtn.onclick = () => window.location.href = `/song/${currentRank + 1}`;
      } else {
        nextBtn.disabled = true;
      }
    }

    function showError(message) {
      console.log('showError called with:', message);
      
      // Check if error elements exist
      const loadingContainer = document.getElementById('loading-container');
      const errorContainer = document.getElementById('error-container');
      const errorMessage = document.getElementById('error-message');
      
      if (!loadingContainer || !errorContainer || !errorMessage) {
        console.error('Error display elements not found, logging error only:', message);
        return;
      }
      
      loadingContainer.classList.add('d-none');
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }

    // Initialize
    loadSongDetails();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
  } else {
    initializePage();
  }
})();

/* theme-demo.js */
/**
 * Theme Toggle Demo Button
 * 
 * This script initializes the theme toggle demo button on the homepage.
 * It's extracted from the inline script in pages.json to improve security
 * by avoiding inline scripts.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find the theme demo toggle button
  const themeToggleButton = document.getElementById('theme-demo-toggle');
  
  if (themeToggleButton) {
    // Initialize button text based on current theme
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    themeToggleButton.textContent = currentTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    
    // Add click event listener
    themeToggleButton.addEventListener('click', function() {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update theme
      htmlElement.setAttribute('data-bs-theme', newTheme);
      
      // Update button text
      this.textContent = newTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    });
  }
});


/* theme-toggle.js */
/**
 * Dark mode toggle script
 */
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use device preference
  const getThemePreference = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme preference
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'dark');
      if (darkModeToggle) {
        darkModeToggle.checked = true;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-moon-fill"></i>';
      }
    } else {
      htmlElement.setAttribute('data-bs-theme', 'light');
      if (darkModeToggle) {
        darkModeToggle.checked = false;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    }
  };

  // Initial theme setup
  applyTheme(getThemePreference());

  // Handle toggle click
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    });
  }

  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
});

/* component-library.js */
/**
 * Component Library JavaScript
 * Enhances the component library page with interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize syntax highlighting
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
      });
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Add offset for fixed header if needed
          const offset = 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  
    // Add "Copy code" buttons to code examples
    document.querySelectorAll('.code-example pre').forEach((preElement, index) => {
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'btn btn-sm btn-outline-primary copy-btn';
      copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
      copyButton.setAttribute('data-index', index);
      
      // Insert button before the pre element
      preElement.parentNode.insertBefore(copyButton, preElement);
      
      // Add click event to copy code
      copyButton.addEventListener('click', function() {
        const codeElement = this.nextElementSibling.querySelector('code');
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Change button text temporarily
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="bi bi-check2"></i> Copied!';
          this.classList.remove('btn-outline-primary');
          this.classList.add('btn-success');
          
          // Reset button after a delay
          setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('btn-success');
            this.classList.add('btn-outline-primary');
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
      });
    });
  
    // Highlight active section in the sidebar based on scroll position
    const sections = document.querySelectorAll('.component-section');
    const navItems = document.querySelectorAll('.list-group-item');
    
    function setActiveNavItem() {
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // This variable was unused, but removing it to fix the ESLint error
        // const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = '#' + section.getAttribute('id');
        }
      });
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentSection) {
          item.classList.add('active');
        }
      });
    }
    
    // Set active nav item on page load
    setActiveNavItem();
    
    // Update active nav item on scroll
    window.addEventListener('scroll', setActiveNavItem);
  });

/* form-validation.js */
/**
 * Form validation script
 * 
 * Enhances forms with Bootstrap 5 validation styles
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Fetch all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission if invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });

  // Add custom validation feedback for complex fields
  const passwordFields = document.querySelectorAll('input[type="password"].validate-strength');
  
  passwordFields.forEach(field => {
    field.addEventListener('input', () => {
      const value = field.value;
      const feedback = field.nextElementSibling;
      
      // Simple password strength feedback
      if (value.length < 8) {
        field.setCustomValidity('Password must be at least 8 characters');
        if (feedback) feedback.textContent = 'Password is too short (min 8 characters)';
      } else if (!/[A-Z]/.test(value)) {
        field.setCustomValidity('Password must contain at least one uppercase letter');
        if (feedback) feedback.textContent = 'Add at least one uppercase letter';
      } else if (!/[0-9]/.test(value)) {
        field.setCustomValidity('Password must contain at least one number');
        if (feedback) feedback.textContent = 'Add at least one number';
      } else {
        field.setCustomValidity('');
        if (feedback) feedback.textContent = 'Password strength: good';
      }
    });
  });
});

/* script.js */
console.log('Custom JavaScript loaded!');


/* service-worker-register.js */
/**
 * Service Worker Registration
 * 
 * This script registers the service worker for PWA support.
 * It's extracted from inline scripts to improve security.
 */
// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}




/* song-detail.js */
// Song detail page JavaScript
console.log('External song-detail.js loaded!');

// Initialize when DOM is ready
(function() {
  function initializePage() {
    console.log('initializePage called');
    
    // Check if we're on a song detail page by looking for required elements
    const loadingContainer = document.getElementById('loading-container');
    const errorContainer = document.getElementById('error-container');
    const songContainer = document.getElementById('song-container');
    const errorMessage = document.getElementById('error-message');

    // If the required elements don't exist, this isn't a song detail page - exit early
    if (!loadingContainer || !errorContainer || !songContainer || !errorMessage) {
      console.log('Not a song detail page, skipping initialization');
      return;
    }

    console.log('DOM elements found:', {
      loadingContainer: !!loadingContainer,
      errorContainer: !!errorContainer,
      songContainer: !!songContainer,
      errorMessage: !!errorMessage
    });

    // Get song ID from URL path
    const pathParts = window.location.pathname.split('/');
    const songId = pathParts[pathParts.length - 1];
    
    console.log('Song ID from URL:', songId);
    console.log('Current URL:', window.location.pathname);

    function loadSongDetails() {
      console.log('loadSongDetails called with songId:', songId);
      const apiUrl = `/api/song/${songId}`;
      console.log('Fetching from URL:', apiUrl);
      
      fetch(apiUrl)
        .then(response => {
          console.log('API Response status:', response.status);
          console.log('API Response ok:', response.ok);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(song => {
          console.log('Song data received:', song);
          
          if (song.error) {
            throw new Error(song.error);
          }
          
          populateSongDetails(song);
          
          // Hide loading, show content
          loadingContainer.classList.add('d-none');
          songContainer.classList.remove('d-none');
        })
        .catch(error => {
          console.error('Error loading song:', error);
          showError(error.message || 'Failed to load song details');
        });
    }

    function populateSongDetails(song) {
      console.log('populateSongDetails called with:', song);
      
      // Check if all required elements exist before proceeding
      const requiredElements = [
        'rank-number', 'song-title', 'channel-name', 'song-views', 
        'song-duration', 'song-followers', 'views-large', 'duration-large', 
        'followers-large', 'song-full-title', 'category-badge'
      ];
      
      const missingElements = requiredElements.filter(id => !document.getElementById(id));
      if (missingElements.length > 0) {
        console.error('Missing required DOM elements:', missingElements);
        showError('Page structure is incomplete. Missing elements: ' + missingElements.join(', '));
        return;
      }
      
      // Basic information
      console.log('Setting basic info...');
      document.getElementById('rank-number').textContent = song.rank || 'N/A';
      document.getElementById('song-title').textContent = song.title || 'Unknown Title';
      document.getElementById('channel-name').textContent = song.channel || 'Unknown Channel';
      document.getElementById('song-views').textContent = song.views || 'N/A';
      document.getElementById('song-duration').textContent = song.duration || 'N/A';
      document.getElementById('song-followers').textContent = song.followers || 'N/A';
      
      // Large stats
      console.log('Setting large stats...');
      document.getElementById('views-large').textContent = song.views || 'N/A';
      document.getElementById('duration-large').textContent = song.duration || 'N/A';
      document.getElementById('followers-large').textContent = song.followers || 'N/A';

      // Detailed information
      console.log('Setting detailed info...');
      document.getElementById('song-full-title').textContent = song.title || 'Unknown Title';
      document.getElementById('category-badge').textContent = song.category || 'Music';

      // Channel link
      if (song.channelUrl) {
        document.getElementById('channel-link').href = song.channelUrl;
        document.getElementById('channel-url-container').classList.remove('d-none');
      } else {
        document.getElementById('channel-url-container').classList.add('d-none');
      }

      // Description
      renderDescription(song.description);

      // Tags
      renderTags(song.tags);

      // Navigation
      setupNavigation(parseInt(song.rank) || 1);

      // Update page title
      document.title = `${song.title || 'Unknown'} - ${song.channel || 'Unknown'} | Song Details`;
    }

    function renderDescription(description) {
      const descContainer = document.getElementById('song-description');
      const toggleBtn = document.getElementById('toggle-description');
      const descCard = document.getElementById('description-card');
      
      // Check if required elements exist
      if (!descContainer || !descCard) {
        console.log('Description elements not found, skipping description rendering');
        return;
      }
      
      if (!description) {
        descCard.classList.add('d-none');
        return;
      }

      const formattedDesc = formatDescription(description);
      
      if (formattedDesc.length > 500) {
        const shortDesc = formattedDesc.substring(0, 500) + '...';
        descContainer.innerHTML = shortDesc;
        toggleBtn.classList.remove('d-none');
        
        let isExpanded = false;
        toggleBtn.onclick = function() {
          if (isExpanded) {
            descContainer.innerHTML = shortDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Show More';
          } else {
            descContainer.innerHTML = formattedDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Show Less';
          }
          isExpanded = !isExpanded;
        };
      } else {
        descContainer.innerHTML = formattedDesc;
      }
    }

    function formatDescription(description) {
      // Convert URLs to clickable links
      return description.replace(/https?:\/\/[^\s\n]+/g, function(url) {
        return `<a href="${url}" target="_blank" class="text-primary text-decoration-none">${url} <i class="bi bi-box-arrow-up-right small"></i></a>`;
      }).replace(/\n/g, '<br>');
    }

    function renderTags(tags) {
      const tagsContainer = document.getElementById('song-tags');
      const tagsCard = document.getElementById('tags-card');
      
      // Check if required elements exist
      if (!tagsContainer || !tagsCard) {
        console.log('Tags elements not found, skipping tags rendering');
        return;
      }
      
      if (!tags) {
        tagsCard.classList.add('d-none');
        return;
      }

      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (tagList.length === 0) {
        tagsCard.classList.add('d-none');
        return;
      }

      tagsContainer.innerHTML = tagList.map(tag => 
        `<span class="badge bg-light text-dark border">${tag}</span>`
      ).join('');
    }

    function setupNavigation(currentRank) {
      const prevBtn = document.getElementById('prev-song');
      const nextBtn = document.getElementById('next-song');

      // Check if navigation elements exist
      if (!prevBtn || !nextBtn) {
        console.log('Navigation elements not found, skipping navigation setup');
        return;
      }

      // Previous song
      if (currentRank > 1) {
        prevBtn.onclick = () => window.location.href = `/song/${currentRank - 1}`;
      } else {
        prevBtn.disabled = true;
      }

      // Next song (assuming max 100 songs)
      if (currentRank < 100) {
        nextBtn.onclick = () => window.location.href = `/song/${currentRank + 1}`;
      } else {
        nextBtn.disabled = true;
      }
    }

    function showError(message) {
      console.log('showError called with:', message);
      
      // Check if error elements exist
      const loadingContainer = document.getElementById('loading-container');
      const errorContainer = document.getElementById('error-container');
      const errorMessage = document.getElementById('error-message');
      
      if (!loadingContainer || !errorContainer || !errorMessage) {
        console.error('Error display elements not found, logging error only:', message);
        return;
      }
      
      loadingContainer.classList.add('d-none');
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }

    // Initialize
    loadSongDetails();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
  } else {
    initializePage();
  }
})();

/* theme-demo.js */
/**
 * Theme Toggle Demo Button
 * 
 * This script initializes the theme toggle demo button on the homepage.
 * It's extracted from the inline script in pages.json to improve security
 * by avoiding inline scripts.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find the theme demo toggle button
  const themeToggleButton = document.getElementById('theme-demo-toggle');
  
  if (themeToggleButton) {
    // Initialize button text based on current theme
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    themeToggleButton.textContent = currentTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    
    // Add click event listener
    themeToggleButton.addEventListener('click', function() {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update theme
      htmlElement.setAttribute('data-bs-theme', newTheme);
      
      // Update button text
      this.textContent = newTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    });
  }
});


/* theme-toggle.js */
/**
 * Dark mode toggle script
 */
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use device preference
  const getThemePreference = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme preference
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'dark');
      if (darkModeToggle) {
        darkModeToggle.checked = true;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-moon-fill"></i>';
      }
    } else {
      htmlElement.setAttribute('data-bs-theme', 'light');
      if (darkModeToggle) {
        darkModeToggle.checked = false;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    }
  };

  // Initial theme setup
  applyTheme(getThemePreference());

  // Handle toggle click
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    });
  }

  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
});

/* component-library.js */
/**
 * Component Library JavaScript
 * Enhances the component library page with interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize syntax highlighting
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
      });
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Add offset for fixed header if needed
          const offset = 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  
    // Add "Copy code" buttons to code examples
    document.querySelectorAll('.code-example pre').forEach((preElement, index) => {
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'btn btn-sm btn-outline-primary copy-btn';
      copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
      copyButton.setAttribute('data-index', index);
      
      // Insert button before the pre element
      preElement.parentNode.insertBefore(copyButton, preElement);
      
      // Add click event to copy code
      copyButton.addEventListener('click', function() {
        const codeElement = this.nextElementSibling.querySelector('code');
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Change button text temporarily
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="bi bi-check2"></i> Copied!';
          this.classList.remove('btn-outline-primary');
          this.classList.add('btn-success');
          
          // Reset button after a delay
          setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('btn-success');
            this.classList.add('btn-outline-primary');
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
      });
    });
  
    // Highlight active section in the sidebar based on scroll position
    const sections = document.querySelectorAll('.component-section');
    const navItems = document.querySelectorAll('.list-group-item');
    
    function setActiveNavItem() {
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // This variable was unused, but removing it to fix the ESLint error
        // const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = '#' + section.getAttribute('id');
        }
      });
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentSection) {
          item.classList.add('active');
        }
      });
    }
    
    // Set active nav item on page load
    setActiveNavItem();
    
    // Update active nav item on scroll
    window.addEventListener('scroll', setActiveNavItem);
  });

/* form-validation.js */
/**
 * Form validation script
 * 
 * Enhances forms with Bootstrap 5 validation styles
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Fetch all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission if invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });

  // Add custom validation feedback for complex fields
  const passwordFields = document.querySelectorAll('input[type="password"].validate-strength');
  
  passwordFields.forEach(field => {
    field.addEventListener('input', () => {
      const value = field.value;
      const feedback = field.nextElementSibling;
      
      // Simple password strength feedback
      if (value.length < 8) {
        field.setCustomValidity('Password must be at least 8 characters');
        if (feedback) feedback.textContent = 'Password is too short (min 8 characters)';
      } else if (!/[A-Z]/.test(value)) {
        field.setCustomValidity('Password must contain at least one uppercase letter');
        if (feedback) feedback.textContent = 'Add at least one uppercase letter';
      } else if (!/[0-9]/.test(value)) {
        field.setCustomValidity('Password must contain at least one number');
        if (feedback) feedback.textContent = 'Add at least one number';
      } else {
        field.setCustomValidity('');
        if (feedback) feedback.textContent = 'Password strength: good';
      }
    });
  });
});

/* script.js */
console.log('Custom JavaScript loaded!');


/* service-worker-register.js */
/**
 * Service Worker Registration
 * 
 * This script registers the service worker for PWA support.
 * It's extracted from inline scripts to improve security.
 */
// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}




/* song-detail.js */
// Song detail page JavaScript
console.log('External song-detail.js loaded!');

// Initialize when DOM is ready
(function() {
  function initializePage() {
    console.log('initializePage called');
    
    // Check if we're on a song detail page by looking for required elements
    const loadingContainer = document.getElementById('loading-container');
    const errorContainer = document.getElementById('error-container');
    const songContainer = document.getElementById('song-container');
    const errorMessage = document.getElementById('error-message');

    // If the required elements don't exist, this isn't a song detail page - exit early
    if (!loadingContainer || !errorContainer || !songContainer || !errorMessage) {
      console.log('Not a song detail page, skipping initialization');
      return;
    }

    console.log('DOM elements found:', {
      loadingContainer: !!loadingContainer,
      errorContainer: !!errorContainer,
      songContainer: !!songContainer,
      errorMessage: !!errorMessage
    });

    // Get song ID from URL path
    // Filter out empty strings and look for the numeric ID
    const pathParts = window.location.pathname.split('/').filter(p => p);
    // Find 'song' in the path and get the next part
    const songIndex = pathParts.indexOf('song');
    const songId = songIndex !== -1 && pathParts[songIndex + 1] ? pathParts[songIndex + 1] : '';
    
    console.log('Song detail page loading for songId:', songId);
    console.log('Current URL:', window.location.pathname);

    function loadSongDetails() {
      console.log('loadSongDetails called with songId:', songId);
      
      // Load from static JSON file (GitHub Pages static site)
      const staticDataUrl = '/js-dev-env/data/youtube-top-100-songs-2025.json';
      
      console.log('Attempting to load from static data:', staticDataUrl);
      
      fetch(staticDataUrl)
        .then(response => {
          if (!response.ok) {
            console.error(`Static data fetch failed: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to load song data: ${response.statusText}`);
          }
          console.log('Static data fetched successfully');
          return response.json();
        })
        .then(data => {
          console.log('Data parsed successfully, array length:', data.length);
          
          // Data should be an array for static site
          if (!Array.isArray(data)) {
            console.error('Expected array but got:', typeof data);
            throw new Error('Invalid data format');
          }
          
          console.log('Loading from static JSON array');
          const songIndex = parseInt(songId) - 1;
          console.log('Looking for song at index:', songIndex, '(rank', songId, ')');
          
          if (songIndex < 0 || songIndex >= data.length) {
            console.error(`Song index ${songIndex} out of range [0, ${data.length - 1}]`);
            throw new Error(`Song #${songId} not found`);
          }
          
          // Get song from array and add rank
          const song = {
            ...data[songIndex],
            rank: parseInt(songId),
            id: parseInt(songId)
          };
          
          console.log('Song data loaded:', song.title);
          
          if (song.error) {
            throw new Error(song.error);
          }
          
          populateSongDetails(song);
          
          // Hide loading, show content
          loadingContainer.classList.add('d-none');
          songContainer.classList.remove('d-none');
        })
        .catch(error => {
          console.error('Error loading song:', error);
          showError(error.message || 'Failed to load song details');
        });
    }

    function populateSongDetails(song) {
      console.log('populateSongDetails called with:', song);
      
      // Check if all required elements exist before proceeding
      const requiredElements = [
        'rank-number', 'song-title', 'channel-name', 'song-views', 
        'song-duration', 'song-followers', 'views-large', 'duration-large', 
        'followers-large', 'song-full-title', 'category-badge'
      ];
      
      const missingElements = requiredElements.filter(id => !document.getElementById(id));
      if (missingElements.length > 0) {
        console.error('Missing required DOM elements:', missingElements);
        showError('Page structure is incomplete. Missing elements: ' + missingElements.join(', '));
        return;
      }
      
      // Basic information
      console.log('Setting basic info...');
      document.getElementById('rank-number').textContent = song.rank || 'N/A';
      document.getElementById('song-title').textContent = song.title || 'Unknown Title';
      document.getElementById('channel-name').textContent = song.channel || 'Unknown Channel';
      document.getElementById('song-views').textContent = song.views || 'N/A';
      document.getElementById('song-duration').textContent = song.duration || 'N/A';
      document.getElementById('song-followers').textContent = song.followers || 'N/A';
      
      // Large stats
      console.log('Setting large stats...');
      document.getElementById('views-large').textContent = song.views || 'N/A';
      document.getElementById('duration-large').textContent = song.duration || 'N/A';
      document.getElementById('followers-large').textContent = song.followers || 'N/A';

      // Detailed information
      console.log('Setting detailed info...');
      document.getElementById('song-full-title').textContent = song.title || 'Unknown Title';
      document.getElementById('category-badge').textContent = song.category || 'Music';

      // Channel link
      if (song.channelUrl) {
        document.getElementById('channel-link').href = song.channelUrl;
        document.getElementById('channel-url-container').classList.remove('d-none');
      } else {
        document.getElementById('channel-url-container').classList.add('d-none');
      }

      // Description
      renderDescription(song.description);

      // Tags
      renderTags(song.tags);

      // Navigation
      setupNavigation(parseInt(song.rank) || 1);

      // Update page title
      document.title = `${song.title || 'Unknown'} - ${song.channel || 'Unknown'} | Song Details`;
    }

    function renderDescription(description) {
      const descContainer = document.getElementById('song-description');
      const toggleBtn = document.getElementById('toggle-description');
      const descCard = document.getElementById('description-card');
      
      // Check if required elements exist
      if (!descContainer || !descCard) {
        console.log('Description elements not found, skipping description rendering');
        return;
      }
      
      if (!description) {
        descCard.classList.add('d-none');
        return;
      }

      const formattedDesc = formatDescription(description);
      
      if (formattedDesc.length > 500) {
        const shortDesc = formattedDesc.substring(0, 500) + '...';
        descContainer.innerHTML = shortDesc;
        toggleBtn.classList.remove('d-none');
        
        let isExpanded = false;
        toggleBtn.onclick = function() {
          if (isExpanded) {
            descContainer.innerHTML = shortDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Show More';
          } else {
            descContainer.innerHTML = formattedDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Show Less';
          }
          isExpanded = !isExpanded;
        };
      } else {
        descContainer.innerHTML = formattedDesc;
      }
    }

    function formatDescription(description) {
      // Escape HTML to prevent XSS
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };
      
      const escaped = escapeHtml(description);
      
      // Convert URLs to clickable links (after escaping)
      return escaped.replace(/https?:\/\/[^\s\n]+/g, function(url) {
        // Re-escape the URL for the href attribute
        const safeUrl = url.replace(/"/g, '&quot;');
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-primary text-decoration-none">${escapeHtml(url)} <i class="bi bi-box-arrow-up-right small"></i></a>`;
      }).replace(/\n/g, '<br>');
    }

    function renderTags(tags) {
      const tagsContainer = document.getElementById('song-tags');
      const tagsCard = document.getElementById('tags-card');
      
      // Check if required elements exist
      if (!tagsContainer || !tagsCard) {
        console.log('Tags elements not found, skipping tags rendering');
        return;
      }
      
      if (!tags) {
        tagsCard.classList.add('d-none');
        return;
      }

      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (tagList.length === 0) {
        tagsCard.classList.add('d-none');
        return;
      }

      // Escape HTML in tags to prevent XSS
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };

      tagsContainer.innerHTML = tagList.map(tag => 
        `<span class="badge bg-light text-dark border">${escapeHtml(tag)}</span>`
      ).join('');
    }

    function setupNavigation(currentRank) {
      const prevBtn = document.getElementById('prev-song');
      const nextBtn = document.getElementById('next-song');

      // Check if navigation elements exist
      if (!prevBtn || !nextBtn) {
        console.log('Navigation elements not found, skipping navigation setup');
        return;
      }

      // Previous song
      if (currentRank > 1) {
        prevBtn.onclick = () => window.location.href = `/song/${currentRank - 1}`;
      } else {
        prevBtn.disabled = true;
      }

      // Next song (assuming max 100 songs)
      if (currentRank < 100) {
        nextBtn.onclick = () => window.location.href = `/song/${currentRank + 1}`;
      } else {
        nextBtn.disabled = true;
      }
    }

    function showError(message) {
      console.log('showError called with:', message);
      
      // Check if error elements exist
      const loadingContainer = document.getElementById('loading-container');
      const errorContainer = document.getElementById('error-container');
      const errorMessage = document.getElementById('error-message');
      
      if (!loadingContainer || !errorContainer || !errorMessage) {
        console.error('Error display elements not found, logging error only:', message);
        return;
      }
      
      loadingContainer.classList.add('d-none');
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }

    // Initialize
    loadSongDetails();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
  } else {
    initializePage();
  }
})();

/* theme-demo.js */
/**
 * Theme Toggle Demo Button
 * 
 * This script initializes the theme toggle demo button on the homepage.
 * It's extracted from the inline script in pages.json to improve security
 * by avoiding inline scripts.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find the theme demo toggle button
  const themeToggleButton = document.getElementById('theme-demo-toggle');
  
  if (themeToggleButton) {
    // Initialize button text based on current theme
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    themeToggleButton.textContent = currentTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    
    // Add click event listener
    themeToggleButton.addEventListener('click', function() {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update theme
      htmlElement.setAttribute('data-bs-theme', newTheme);
      
      // Update button text
      this.textContent = newTheme === 'dark' ? 'Try Light Mode' : 'Try Dark Mode';
    });
  }
});


/* theme-toggle.js */
/**
 * Dark mode toggle script
 */
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use device preference
  const getThemePreference = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme preference
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'dark');
      if (darkModeToggle) {
        darkModeToggle.checked = true;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-moon-fill"></i>';
      }
    } else {
      htmlElement.setAttribute('data-bs-theme', 'light');
      if (darkModeToggle) {
        darkModeToggle.checked = false;
        darkModeToggle.nextElementSibling.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    }
  };

  // Initial theme setup
  applyTheme(getThemePreference());

  // Handle toggle click
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    });
  }

  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
});

/* component-library.js */
/**
 * Component Library JavaScript
 * Enhances the component library page with interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize syntax highlighting
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
      });
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Add offset for fixed header if needed
          const offset = 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  
    // Add "Copy code" buttons to code examples
    document.querySelectorAll('.code-example pre').forEach((preElement, index) => {
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'btn btn-sm btn-outline-primary copy-btn';
      copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
      copyButton.setAttribute('data-index', index);
      
      // Insert button before the pre element
      preElement.parentNode.insertBefore(copyButton, preElement);
      
      // Add click event to copy code
      copyButton.addEventListener('click', function() {
        const codeElement = this.nextElementSibling.querySelector('code');
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Change button text temporarily
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="bi bi-check2"></i> Copied!';
          this.classList.remove('btn-outline-primary');
          this.classList.add('btn-success');
          
          // Reset button after a delay
          setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('btn-success');
            this.classList.add('btn-outline-primary');
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
      });
    });
  
    // Highlight active section in the sidebar based on scroll position
    const sections = document.querySelectorAll('.component-section');
    const navItems = document.querySelectorAll('.list-group-item');
    
    function setActiveNavItem() {
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // This variable was unused, but removing it to fix the ESLint error
        // const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = '#' + section.getAttribute('id');
        }
      });
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentSection) {
          item.classList.add('active');
        }
      });
    }
    
    // Set active nav item on page load
    setActiveNavItem();
    
    // Update active nav item on scroll
    window.addEventListener('scroll', setActiveNavItem);
  });

/* form-validation.js */
/**
 * Form validation script
 * 
 * Enhances forms with Bootstrap 5 validation styles
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Fetch all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission if invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });

  // Add custom validation feedback for complex fields
  const passwordFields = document.querySelectorAll('input[type="password"].validate-strength');
  
  passwordFields.forEach(field => {
    field.addEventListener('input', () => {
      const value = field.value;
      const feedback = field.nextElementSibling;
      
      // Simple password strength feedback
      if (value.length < 8) {
        field.setCustomValidity('Password must be at least 8 characters');
        if (feedback) feedback.textContent = 'Password is too short (min 8 characters)';
      } else if (!/[A-Z]/.test(value)) {
        field.setCustomValidity('Password must contain at least one uppercase letter');
        if (feedback) feedback.textContent = 'Add at least one uppercase letter';
      } else if (!/[0-9]/.test(value)) {
        field.setCustomValidity('Password must contain at least one number');
        if (feedback) feedback.textContent = 'Add at least one number';
      } else {
        field.setCustomValidity('');
        if (feedback) feedback.textContent = 'Password strength: good';
      }
    });
  });
});

/* script.js */
console.log('Custom JavaScript loaded!');


/* service-worker-register.js */
/**
 * Service Worker Registration
 * 
 * This script registers the service worker for PWA support.
 * It's extracted from inline scripts to improve security.
 */
// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Calculate the path to the root of the site
    // pathname looks like: /js-dev-env/getting-started/ or /js-dev-env/
    // or on dev server: /data-tables/ or just /
    const pathname = window.location.pathname;
    
    // Detect if we're on GitHub Pages (has js-dev-env in path)
    const isGitHubPages = pathname.includes('/js-dev-env/');
    
    let rootPath;
    if (isGitHubPages) {
      // For GitHub Pages: /js-dev-env/... -> /js-dev-env/
      rootPath = '/js-dev-env/';
    } else {
      // For local dev server: always use root /
      rootPath = '/';
    }
    
    // Service worker must be at the root of the site scope
    const swPath = `${rootPath}service-worker.js`;
    
    navigator.serviceWorker
      .register(swPath)
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}


