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
      if (darkModeToggle && darkModeToggle.nextElementSibling) {
        darkModeToggle.checked = true;
        // Create icon element safely instead of using innerHTML
        const icon = document.createElement('i');
        icon.className = 'bi bi-moon-fill';
        darkModeToggle.nextElementSibling.textContent = '';
        darkModeToggle.nextElementSibling.appendChild(icon);
      }
    } else {
      htmlElement.setAttribute('data-bs-theme', 'light');
      if (darkModeToggle && darkModeToggle.nextElementSibling) {
        darkModeToggle.checked = false;
        // Create icon element safely instead of using innerHTML
        const icon = document.createElement('i');
        icon.className = 'bi bi-sun-fill';
        darkModeToggle.nextElementSibling.textContent = '';
        darkModeToggle.nextElementSibling.appendChild(icon);
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