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