/**
 * Physics 110 v1.1 - Router Class
 * Handles SPA navigation for the course website
 */

class PhysicsRouter {
    constructor() {
        this.routes = {
            'home': 'home-section',
            'lectures': 'lectures-section', 
            'notebooks': 'notebooks-section',
            'homework': 'homework-section',
            'quizzes': 'quizzes-section',
            'resources': 'resources-section'
        };
        
        this.currentSection = 'home';
        this.init();
    }

    init() {
        console.log('Physics Router v1.1 initialized');
        
        // Handle initial load
        this.handleRouteChange();
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            this.handleRouteChange();
        });

        // Handle anchor clicks
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();
                const target = anchor.getAttribute('href').substring(1);
                this.navigateTo(target);
            }
        });

        // Close mobile menu on navigation
        this.setupMobileMenu();
    }

    navigateTo(section) {
        if (this.routes[section]) {
            // Update URL without page reload
            history.pushState({}, '', `#${section}`);
            this.handleRouteChange();
            
            // Close mobile menu if open
            this.closeMobileMenu();
        } else {
            console.warn(`Route not found: ${section}`);
            this.navigateTo('home');
        }
    }

    handleRouteChange() {
        const hash = window.location.hash.substring(1) || 'home';
        const targetSection = this.routes[hash] || this.routes['home'];
        
        this.showSection(targetSection);
        this.updateActiveNav(hash);
        this.currentSection = hash;
        
        // Update page title
        this.updatePageTitle(hash);
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('[id$="-section"]').forEach(section => {
            section.classList.remove('section-active');
            section.classList.add('section-hidden');
        });
        
        // Show target section with animation
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            targetElement.classList.remove('section-hidden');
            targetElement.classList.add('section-active');
            
            // Scroll to top for better UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    updateActiveNav(currentRoute) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current route
        const activeLink = document.querySelector(`a[href="#${currentRoute}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    updatePageTitle(section) {
        const baseTitle = 'Physics 110: Introductory Mechanics';
        const sectionTitles = {
            'home': baseTitle,
            'lectures': `Lectures - ${baseTitle}`,
            'notebooks': `Notebooks - ${baseTitle}`,
            'homework': `Homework - ${baseTitle}`,
            'quizzes': `Quizzes - ${baseTitle}`,
            'resources': `Resources - ${baseTitle}`
        };
        
        document.title = sectionTitles[section] || baseTitle;
    }

    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }

    // Utility method to get current route
    getCurrentRoute() {
        return this.currentSection;
    }

    // Utility method to check if route exists
    routeExists(route) {
        return this.routes.hasOwnProperty(route);
    }
}

// Global helper function for navigation
function navigateTo(section) {
    if (window.router && window.router.navigateTo) {
        window.router.navigateTo(section);
    } else {
        // Fallback for direct anchor navigation
        window.location.hash = section;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PhysicsRouter, navigateTo };
}