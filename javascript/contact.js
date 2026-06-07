

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    
    // Validation
    const patterns = {
        name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        subject: /^.{5,100}$/,
        message: /^[\s\S]{10,1000}$/
    };
    
    // Validation de champ
    function validateContactField(field, pattern, errorId) {
        const errorElement = document.getElementById(errorId);
        const value = field.value.trim();
        
        if (!value) {
            field.classList.add('error');
            if (errorElement) errorElement.textContent = 'This field is required';
            return false;
        }
        
        if (!pattern.test(value)) {
            field.classList.add('error');
            return false;
        }
        
        field.classList.remove('error');
        if (errorElement) errorElement.textContent = '';
        return true;
    }
    
    // Real-time validation
    nameField.addEventListener('blur', () => {
        validateContactField(nameField, patterns.name, 'nameError');
    });
    
    emailField.addEventListener('blur', () => {
        validateContactField(emailField, patterns.email, 'emailError');
    });
    
    subjectField.addEventListener('blur', () => {
        validateContactField(subjectField, patterns.subject, 'subjectError');
    });
    
    messageField.addEventListener('blur', () => {
        validateContactField(messageField, patterns.message, 'messageError');
    });
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate de tous les champs avant de soumettre
        const isNameValid = validateContactField(nameField, patterns.name, 'nameError');
        const isEmailValid = validateContactField(emailField, patterns.email, 'emailError');
        const isSubjectValid = validateContactField(subjectField, patterns.subject, 'subjectError');
        const isMessageValid = validateContactField(messageField, patterns.message, 'messageError');
        
        if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
            return;
        }
        
        // Simulation d’envoi du formulaire
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            
            // Reset form
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}
