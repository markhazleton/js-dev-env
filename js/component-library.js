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