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
