// Menu mobile
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    // Ouvrir / fermer le menu mobile
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Fermer le menu si on clique en dehors de la navbar
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Vérifier si l’utilisateur est connecté
function checkUserSession() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const loginLink = document.getElementById('loginLink');
    
    if (user && authButtons && userMenu) {
        // Utilisateur connecté → afficher menu utilisateur
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        
        if (userName) {
            userName.textContent = `Bonjour, ${user.firstName}`;
        }
        
        // cacher le lien login
        if (loginLink) {
            loginLink.style.display = 'none';
        }
    } else if (authButtons && userMenu) {
        // Utilisateur non connecté → afficher boutons login/register
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        
        if (loginLink) {
            loginLink.style.display = 'block';
        }
    }
}

// Déconnexion utilisateur
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        showToast('Déconnexion réussie', 'success');
        
        setTimeout(() => {
            // Redirection vers la page d’accueil
            const isInContent = window.location.pathname.includes('/content/');
            window.location.href = isInContent ? '../index.html' : 'index.html';
        }, 1000);
    });
}

// Afficher une notification (toast)
function showToast(message, type = 'success') {
    // Supprimer l’ancien toast s’il existe
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Créer le toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Afficher le toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Le cacher après 3 secondes
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Gestion de la newsletter
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Vérifier l’email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Veuillez entrer un email valide', 'error');
            return;
        }
        
        // Simulation d’inscription
        showToast('Merci pour votre abonnement !', 'success');
        newsletterForm.reset();
    });
}

// Scroll fluide vers les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Effet navbar au scroll
const navbar = document.querySelector('.navbar');
const headerTransparent = document.querySelector('.header-transparent');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (headerTransparent && navbar) {
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
});

// Fonctions accessibles globalement
window.showToast = showToast;
window.checkUserSession = checkUserSession;