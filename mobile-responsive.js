/* ===================================================
   Mobile Responsive Enhancement
=================================================== */
class MobileResponsive {
    constructor() {
        this.breakpoint = 768; // Tablet breakpoint
        this.isMobile = window.innerWidth <= this.breakpoint;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.adjustLayout();
        this.setupTouchGestures();
        this.optimizeForMobile();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= this.breakpoint;
            this.adjustLayout();
        });

        // Orientation change için
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.adjustLayout(), 100);
        });
    }

    adjustLayout() {
        const mainGrid = document.querySelector('.main-grid');
        const cards = document.querySelectorAll('.card');
        const uploadZones = document.querySelectorAll('.upload-zone');
        
        if (this.isMobile) {
            // Mobile layout
            if (mainGrid) {
                mainGrid.style.gridTemplateColumns = '1fr';
                mainGrid.style.gap = '16px';
            }
            
            // Card padding'ı azalt
            cards.forEach(card => {
                card.style.padding = '16px';
            });
            
            // Upload zones için touch optimizasyonu
            uploadZones.forEach(zone => {
                zone.style.minHeight = '120px';
                zone.style.padding = '16px';
            });
            
            // Form grid'ini ayarla
            this.adjustFormGrids();
            
            // Butonları mobil için ayarla
            this.adjustButtons();
            
            // Modal'ları mobil için ayarla
            this.adjustModals();
            
        } else {
            // Desktop layout
            if (mainGrid) {
                mainGrid.style.gridTemplateColumns = '1fr 380px';
                mainGrid.style.gap = '24px';
            }
            
            cards.forEach(card => {
                card.style.padding = '20px';
            });
            
            uploadZones.forEach(zone => {
                zone.style.minHeight = '';
                zone.style.padding = '20px';
            });
            
            this.restoreDesktopLayout();
        }
    }

    adjustFormGrids() {
        const formGrids = document.querySelectorAll('[style*="grid-template-columns"]');
        
        formGrids.forEach(grid => {
            const currentColumns = grid.style.gridTemplateColumns;
            
            if (currentColumns.includes('repeat(3')) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else if (currentColumns.includes('repeat(4')) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            }
        });
    }

    adjustButtons() {
        const buttonGroups = document.querySelectorAll('.btn');
        
        buttonGroups.forEach(btn => {
            if (this.isMobile) {
                btn.style.fontSize = '14px';
                btn.style.padding = '12px 16px';
                btn.style.minHeight = '44px'; // Touch friendly
            } else {
                btn.style.fontSize = '';
                btn.style.padding = '';
                btn.style.minHeight = '';
            }
        });
    }

    adjustModals() {
        const modals = document.querySelectorAll('.modal-content');
        
        modals.forEach(modal => {
            if (this.isMobile) {
                modal.style.margin = '16px';
                modal.style.maxWidth = 'calc(100% - 32px)';
                modal.style.maxHeight = '80vh';
                modal.style.overflowY = 'auto';
            } else {
                modal.style.margin = '';
                modal.style.maxWidth = '';
                modal.style.maxHeight = '';
                modal.style.overflowY = '';
            }
        });
    }

    restoreDesktopLayout() {
        // Form grid'lerini geri yükle
        const formGrids = document.querySelectorAll('[data-original-grid]');
        
        formGrids.forEach(grid => {
            const originalGrid = grid.dataset.originalGrid;
            if (originalGrid) {
                grid.style.gridTemplateColumns = originalGrid;
            }
        });
    }

    setupTouchGestures() {
        if (!this.isMobile) return;
        
        const uploadZones = document.querySelectorAll('.upload-zone');
        
        uploadZones.forEach(zone => {
            // Touch feedback
            zone.addEventListener('touchstart', (e) => {
                zone.classList.add('touch-active');
                zone.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            zone.addEventListener('touchend', (e) => {
                zone.classList.remove('touch-active');
                zone.style.transform = 'scale(1)';
            }, { passive: true });
        });
    }

    optimizeForMobile() {
        if (!this.isMobile) return;
        
        // Virtual keyboard için optimizasyon
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                // Keyboard açıldığında scroll'u ayarla
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
        
        // Select dropdown'ları mobil için iyileştir
        const selects = document.querySelectorAll('.select-field');
        
        selects.forEach(select => {
            select.style.fontSize = '16px'; // iOS zoom'u önlemek için
        });
        
        // Long press prevention
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Mobile menü ekle
    addMobileMenu() {
        if (!this.isMobile) return;
        
        const header = document.querySelector('header');
        if (!header) return;
        
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        mobileMenuBtn.style.cssText = `
            display: none;
            background: var(--accent);
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            color: #060a08;
            cursor: pointer;
            position: fixed;
            top: 16px;
            right: 16px;
            z-index: 1000;
        `;
        
        header.appendChild(mobileMenuBtn);
        
        // Mobil menüyü göster/gizle
        mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Responsive butonu göster
        if (this.isMobile) {
            mobileMenuBtn.style.display = 'block';
        }
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sticky-sidebar');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (!sidebar) return;
        
        const isVisible = sidebar.style.display !== 'none';
        
        if (isVisible) {
            sidebar.style.display = 'none';
            menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        } else {
            sidebar.style.display = 'block';
            menuBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
        }
    }

    // Performance optimizasyonu
    optimizePerformance() {
        if (!this.isMobile) return;
        
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
        
        // Reduce animations on mobile
        if (this.isMobile) {
            document.body.classList.add('reduce-animations');
        }
    }

    // PWA features
    setupPWA() {
        // Service worker registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
        
        // Install prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Install butonu göster
            this.showInstallButton();
        });
        
        window.addEventListener('appinstalled', () => {
            deferredPrompt = null;
            this.hideInstallButton();
        });
    }

    showInstallButton() {
        const installBtn = document.createElement('button');
        installBtn.className = 'install-pwa-btn';
        installBtn.innerHTML = '<i class="fa-solid fa-download"></i> Uygulamayı Yükle';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--accent);
            color: #060a08;
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            font-weight: 600;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,230,118,0.3);
        `;
        
        document.body.appendChild(installBtn);
        
        installBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            }
        });
    }

    hideInstallButton() {
        const installBtn = document.querySelector('.install-pwa-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }
}

// CSS ekle
const mobileCSS = `
<style>
.mobile-menu-btn {
    display: none !important;
}

.touch-active {
    opacity: 0.7 !important;
    transform: scale(0.98) !important;
}

.reduce-animations * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}

@media (max-width: 768px) {
    .mobile-menu-btn {
        display: block !important;
    }
    
    .main-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
    }
    
    .card {
        padding: 16px !important;
    }
    
    .upload-zone {
        min-height: 120px !important;
        padding: 16px !important;
    }
    
    .btn {
        font-size: 14px !important;
        padding: 12px 16px !important;
        min-height: 44px !important;
    }
    
    .modal-content {
        margin: 16px !important;
        max-width: calc(100% - 32px) !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
    }
    
    .input-field, .select-field {
        font-size: 16px !important; /* iOS zoom prevention */
    }
    
    .sticky-sidebar {
        position: fixed !important;
        top: 0 !important;
        right: -100% !important;
        width: 80% !important;
        height: 100vh !important;
        background: var(--bg-card) !important;
        transition: right 0.3s ease !important;
        z-index: 999 !important;
        overflow-y: auto !important;
    }
    
    .sticky-sidebar.active {
        right: 0 !important;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', mobileCSS);

// Global instance
const mobileResponsive = new MobileResponsive();

// Export
window.mobileResponsive = mobileResponsive;
