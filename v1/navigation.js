// Navigation Component
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        // Add event listener to menu button
        const menuBtn = document.getElementById('menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.showDrawer());
        }
    }

    createDrawerMenu() {
        // Check if drawer already exists
        let drawer = document.querySelector('.drawer-overlay');
        if (drawer) {
            return drawer;
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';

        // Create drawer
        const drawerElement = document.createElement('div');
        drawerElement.className = 'drawer';

        // Get current page path
        const currentPath = window.location.pathname;
        const isVisitsPage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/v1/');
        const isAboutPage = currentPath.endsWith('about.html');

        // Create drawer content
        drawerElement.innerHTML = `
            <div class="drawer-logo">
                <img src="images/auris-logo-%23394E71.svg" alt="Auris Logo" class="drawer-logo-image">
                <button class="drawer-close icon-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="drawer-content">
                <a href="index.html" class="drawer-menu-item ${isVisitsPage ? 'active' : ''}">
                    <span>Návštěvy</span>
                </a>
                <a href="about.html" class="drawer-menu-item ${isAboutPage ? 'active' : ''}">
                    <span>O aplikaci</span>
                </a>
            </div>
            <div class="drawer-footer">
                <div class="drawer-footer-item">
                    <i class="far fa-envelope"></i>
                    <span>Kontaktujte nás</span>
                </div>
                <div class="drawer-footer-item">
                    <i class="far fa-user"></i>
                    <span>Jméno Příjmení</span>
                </div>
            </div>
        `;

        // Add drawer to overlay
        overlay.appendChild(drawerElement);
        document.body.appendChild(overlay);

        // Handle close button click
        const closeBtn = drawerElement.querySelector('.drawer-close');
        closeBtn.addEventListener('click', () => this.hideDrawer());

        // Handle menu item clicks
        const menuItems = drawerElement.querySelectorAll('.drawer-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                this.hideDrawer();
            });
        });

        // Handle close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideDrawer();
            }
        });

        return overlay;
    }

    showDrawer() {
        const drawer = this.createDrawerMenu();
        // Use setTimeout to ensure proper animation
        setTimeout(() => {
            drawer.classList.add('active');
            drawer.querySelector('.drawer').classList.add('active');
        }, 10);
    }

    hideDrawer() {
        const drawer = document.querySelector('.drawer-overlay');
        if (!drawer) return;
        
        const drawerElement = drawer.querySelector('.drawer');
        drawer.classList.remove('active');
        drawerElement.classList.remove('active');
        
        // Remove drawer after animation
        setTimeout(() => {
            drawer.remove();
        }, 300);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
}); 