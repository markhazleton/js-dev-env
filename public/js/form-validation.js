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