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
        const isVersion1 = currentPath.includes('index1.html');
        const isVersion2 = currentPath.includes('index2.html');
        const isAboutPage = currentPath.includes('about.html');

        // Create drawer content
        drawerElement.innerHTML = `
            <div class="drawer-logo">
                <img src="images/auris-logo-%23394E71.svg" alt="Auris Logo" class="drawer-logo-image">
                <button class="drawer-close icon-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="drawer-content">
                <a href="${isVersion2 ? 'index2.html' : 'index1.html'}" class="drawer-menu-item ${isVersion1 || isVersion2 ? 'active' : ''}">
                    <span>Návštěvy</span>
                </a>
                <a href="about.html" class="drawer-menu-item ${isAboutPage ? 'active' : ''}">
                    <span>O aplikaci</span>
                </a>
                <div class="drawer-menu-item version-menu-item">
                    <span>Verze</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
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

        // Handle version menu item click
        const versionMenuItem = drawerElement.querySelector('.version-menu-item');
        versionMenuItem.addEventListener('click', (e) => {
            const rect = versionMenuItem.getBoundingClientRect();
            this.showVersionMenu(rect);
        });

        // Handle menu item clicks (except version menu)
        const menuItems = drawerElement.querySelectorAll('.drawer-menu-item:not(.version-menu-item)');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent immediate navigation
                const href = item.getAttribute('href');
                
                // Hide drawer first, then navigate
                this.hideDrawer(() => {
                    // Navigate to the new page after drawer is closed
                    window.location.href = href;
                });
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

    showVersionMenu(rect) {
        // Remove any existing version menu
        const existingMenu = document.querySelector('.version-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Create version menu
        const menu = document.createElement('div');
        menu.className = 'version-context-menu';
        menu.innerHTML = `
            <a href="index1.html" class="version-menu-option">
                <span class="version-badge">Verze 1</span>
                <span class="status-badge status-active">Aktivní</span>
            </a>
            <a href="index2.html" class="version-menu-option">
                <span class="version-badge">Verze 2</span>
                <span class="status-badge status-in-progress">V přípravě</span>
            </a>
        `;

        // Position the menu
        menu.style.position = 'fixed';
        menu.style.left = rect.right + 'px';
        menu.style.top = rect.top + 'px';

        // Add menu to body
        document.body.appendChild(menu);

        // Handle menu item clicks
        const menuItems = menu.querySelectorAll('.version-menu-option');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                this.hideDrawer(() => {
                    window.location.href = href;
                });
            });
        });

        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && !document.querySelector('.version-menu-item').contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        // Add click listener on next tick to avoid immediate closure
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    }

    showDrawer() {
        const drawer = this.createDrawerMenu();
        // Use setTimeout to ensure proper animation
        setTimeout(() => {
            drawer.classList.add('active');
            drawer.querySelector('.drawer').classList.add('active');
        }, 10);
    }

    hideDrawer(callback) {
        const drawer = document.querySelector('.drawer-overlay');
        if (!drawer) {
            if (callback) callback();
            return;
        }
        
        const drawerElement = drawer.querySelector('.drawer');
        
        // First remove the active class to trigger the slide-out animation
        drawer.classList.remove('active');
        drawerElement.classList.remove('active');
        
        // Wait for the animation to complete before removing the element
        setTimeout(() => {
            // Only remove the drawer after the animation completes
            drawer.remove();
            if (callback) callback();
        }, 300); // Match this with the CSS transition duration
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
}); 