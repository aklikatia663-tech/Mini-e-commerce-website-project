//  Modèles de validation (RegEx) 
const patterns = {
    firstName: /^[a-zA-ZÀ-ÿ\s]{2,30}$/,
    lastName: /^[a-zA-ZÀ-ÿ\s]{2,30}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^(\+213|0)(5|6|7)[0-9]{8}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
};

// Messages d’erreur 
const messages = {
    firstName: 'Le prénom doit contenir entre 2 et 30 lettres',
    lastName: 'Le nom doit contenir entre 2 et 30 lettres',
    email: 'Veuillez entrer une adresse email valide',
    phone: 'Veuillez entrer un numéro de téléphone algérien valide',
    password: 'Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule et chiffre',
    confirmPassword: 'Les mots de passe ne correspondent pas',
    terms: 'Vous devez accepter les conditions d’utilisation'
};

//  Vérification d’un champ 
function validateField(field, pattern, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    const value = field.value.trim();
    
    // Champ vide
    if (!value) {
        field.classList.add('error');
        if (errorElement) errorElement.textContent = 'Ce champ est obligatoire';
        return false;
    }
    
    // Format invalide
    if (!pattern.test(value)) {
        field.classList.add('error');
        if (errorElement) errorElement.textContent = messages[field.name] || 'Valeur invalide';
        return false;
    }
    
    // Tout est OK
    field.classList.remove('error');
    if (errorElement) errorElement.textContent = '';
    return true;
}

//  Calcul de la force du mot de passe 
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    return strength;
}

//  Mise à jour de la barre de force du mot de passe 
function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    const strength = checkPasswordStrength(password);
    
    strengthBar.classList.remove('weak', 'medium', 'strong');
    strengthText.classList.remove('weak', 'medium', 'strong');
    
    // Faible
    if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = 'Faible';
    
    // Moyen
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = 'Moyen';
    
    // Fort
    } else {
        strengthBar.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = 'Fort';
    }
}

//  Afficher / cacher le mot de passe 
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Changer l’état de l’icône
        this.classList.toggle('active');
    });
});

// Gestion du formulaire de connexion 
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    // Validation en temps réel (email)
    emailField.addEventListener('blur', () => {
        validateField(emailField, patterns.email, 'emailError');
    });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const serverMessage = document.getElementById('serverMessage');
        
        // Vérification des champs
        const isEmailValid = validateField(emailField, patterns.email, 'emailError');
        const isPasswordValid = passwordField.value.length >= 6;
        
        if (!isPasswordValid) {
            passwordField.classList.add('error');
            document.getElementById('passwordError').textContent = 'Le mot de passe doit contenir au moins 6 caractères';
        }
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }
        
        // Affichage du chargement
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Connexion...';
        submitBtn.disabled = true;
        
        try {
            // Envoi vers le backend PHP
            const formData = new FormData(loginForm);
            const response = await fetch('../php/login.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Sauvegarder l’utilisateur
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                
                serverMessage.className = 'server-message success';
                serverMessage.textContent = 'Connexion réussie ! Redirection...';
                serverMessage.style.display = 'block';
                
                // Redirection
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);
            } else {
                serverMessage.className = 'server-message error';
                serverMessage.textContent = result.message || 'Email ou mot de passe incorrect';
                serverMessage.style.display = 'block';
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            // Mode fallback (localStorage si PHP ne fonctionne pas)
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === emailField.value && u.password === passwordField.value);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                serverMessage.className = 'server-message success';
                serverMessage.textContent = 'Connexion réussie ! Redirection...';
                serverMessage.style.display = 'block';
                
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);
            } else {
                serverMessage.className = 'server-message error';
                serverMessage.textContent = 'Email ou mot de passe incorrect';
                serverMessage.style.display = 'block';
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}

//  Gestion du formulaire d’inscription 
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const termsField = document.getElementById('terms');
    
    // Validation en temps réel
    firstNameField.addEventListener('blur', () => {
        validateField(firstNameField, patterns.firstName, 'firstNameError');
    });
    
    lastNameField.addEventListener('blur', () => {
        validateField(lastNameField, patterns.lastName, 'lastNameError');
    });
    
    emailField.addEventListener('blur', () => {
        validateField(emailField, patterns.email, 'emailError');
    });
    
    phoneField.addEventListener('blur', () => {
        validateField(phoneField, patterns.phone, 'phoneError');
    });
    
    // Mise à jour de la force du mot de passe
    passwordField.addEventListener('input', () => {
        updatePasswordStrength(passwordField.value);
    });
    
    passwordField.addEventListener('blur', () => {
        validateField(passwordField, patterns.password, 'passwordError');
    });
    
    // Vérification confirmation mot de passe
    confirmPasswordField.addEventListener('blur', () => {
        const errorElement = document.getElementById('confirmPasswordError');
        if (confirmPasswordField.value !== passwordField.value) {
            confirmPasswordField.classList.add('error');
            errorElement.textContent = messages.confirmPassword;
        } else {
            confirmPasswordField.classList.remove('error');
            errorElement.textContent = '';
        }
    });
    
    // Soumission du formulaire
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const serverMessage = document.getElementById('serverMessage');
        
        // Vérification de tous les champs
        const validations = [
            validateField(firstNameField, patterns.firstName, 'firstNameError'),
            validateField(lastNameField, patterns.lastName, 'lastNameError'),
            validateField(emailField, patterns.email, 'emailError'),
            validateField(phoneField, patterns.phone, 'phoneError'),
            validateField(passwordField, patterns.password, 'passwordError')
        ];
        
        // Vérification confirmation mot de passe
        const confirmError = document.getElementById('confirmPasswordError');
        if (confirmPasswordField.value !== passwordField.value) {
            confirmPasswordField.classList.add('error');
            confirmError.textContent = messages.confirmPassword;
            validations.push(false);
        } else {
            confirmPasswordField.classList.remove('error');
            confirmError.textContent = '';
            validations.push(true);
        }
        
        // Vérification des conditions
        const termsError = document.getElementById('termsError');
        if (!termsField.checked) {
            termsError.textContent = messages.terms;
            validations.push(false);
        } else {
            termsError.textContent = '';
            validations.push(true);
        }
        
        // Stop si erreur
        if (validations.includes(false)) {
            return;
        }
        
        // Affichage du chargement
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Création du compte...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(registerForm);
            const response = await fetch('../php/register.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                
                serverMessage.className = 'server-message success';
                serverMessage.textContent = 'Compte créé avec succès ! Redirection...';
                serverMessage.style.display = 'block';
                
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);
            } else {
                serverMessage.className = 'server-message error';
                serverMessage.textContent = result.message || 'Échec de l’inscription';
                serverMessage.style.display = 'block';
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            // Mode fallback si PHP ne marche pas
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Vérifier si email existe déjà
            if (users.some(u => u.email === emailField.value)) {
                serverMessage.className = 'server-message error';
                serverMessage.textContent = 'Email déjà utilisé';
                serverMessage.style.display = 'block';
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Création utilisateur
            const newUser = {
                id: Date.now(),
                firstName: firstNameField.value.trim(),
                lastName: lastNameField.value.trim(),
                email: emailField.value.trim(),
                phone: phoneField.value.trim(),
                password: passwordField.value
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Connexion automatique après inscription
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            serverMessage.className = 'server-message success';
            serverMessage.textContent = 'Compte créé avec succès ! Redirection...';
            serverMessage.style.display = 'block';
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        }
    });
}