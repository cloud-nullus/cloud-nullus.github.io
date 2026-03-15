// ============================================
// FEATURE 1: Role Switcher
// ============================================
function initRoleSwitcher() {
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const role = btn.dataset.role;
            if (role === state.currentRole) return;
            state.currentRole = role;
            document.querySelectorAll('.role-btn').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            applyRole(role);
        });
    });
}

function applyRole(role) {
    document.body.classList.remove('role-admin', 'role-devops', 'role-developer');
    const adminPages = ['organization', 'users', 'clusters', 'home'];
    const devopsOnlyPages = ['install', 'templates', 'list', 'history', 'clusters', 'organization', 'users', 'compatibility', 'monitoring', 'alertlist', 'alerthistory', 'cicdtemplates', 'cicdlist', 'cicdhistory'];
    const developerPages = ['cicdtemplates', 'cicdlist', 'cicdhistory', 'developer', 'monitoring', 'alertlist', 'alerthistory'];

    if (role === 'admin') {
        document.body.classList.add('role-admin');
        if (adminPages.includes(state.currentPage)) {
            state.lastAdminPage = state.currentPage;
        } else {
            state.lastAdminPage = 'organization';
        }
        switchPage(state.lastAdminPage);
    } else if (role === 'developer') {
        document.body.classList.add('role-developer');
        if (developerPages.includes(state.currentPage)) {
            state.lastDeveloperPage = state.currentPage;
        } else {
            state.lastDeveloperPage = 'cicdlist';
        }
        switchPage(state.lastDeveloperPage);
    } else {
        document.body.classList.add('role-devops');
        if (devopsOnlyPages.includes(state.currentPage)) {
            state.lastDevopsPage = state.currentPage;
        } else {
            state.lastDevopsPage = 'list';
        }
        switchPage(state.lastDevopsPage);
    }
}

// ============================================
// FEATURE 2: Template Presets
// ============================================
function initTemplatePresets() {
    document.querySelectorAll('.btn-preset-apply').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const preset = btn.dataset.preset;
            applyPreset(preset);
        });
    });
    document.querySelectorAll('.preset-card').forEach(card => {
        card.addEventListener('click', () => {
            const preset = card.dataset.preset;
            applyPreset(preset);
        });
    });
}

// ============================================
// FEATURE 3: Export Configuration
// ============================================
function initExportConfig() {
    const exportJsonBtn = document.getElementById('exportConfigBtn');
    const exportYamlBtn = document.getElementById('exportYamlBtn');

    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            exportAsJSON();
        });
    }
    if (exportYamlBtn) {
        exportYamlBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            exportAsYAML();
        });
    }
}

// ============================================
// FEATURE 4: K8s Object Preview Modal
// ============================================
let currentK8sTab = 'namespace';

function initK8sPreview() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('#previewK8sObjectsBtn')) {
            e.preventDefault();
            openK8sPreviewModal();
        }
        if (e.target.closest('#closeK8sPreviewModal')) {
            closeK8sPreviewModal();
        }
        if (e.target.closest('#copyK8sYamlBtn')) {
            const el = document.getElementById('k8sPreviewContent');
            if (el && el.textContent) {
                navigator.clipboard.writeText(el.textContent).then(() => {
                    showNotification('K8s YAML copied to clipboard', 'success');
                }).catch(() => showNotification('Failed to copy', 'error'));
            }
        }
        if (e.target.closest('.k8s-tab')) {
            const tab = e.target.closest('.k8s-tab');
            const tabName = tab.dataset.k8sTab;
            currentK8sTab = tabName;
            document.querySelectorAll('.k8s-tab').forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            renderK8sPreview(tabName);
        }
    });
    const modal = document.getElementById('k8sPreviewModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeK8sPreviewModal();
        });
    }
}

// ============================================
// Initialize all new features
// ============================================
(function initNewFeatures() {
    const origInit = window.addEventListener ? null : null;
    document.addEventListener('DOMContentLoaded', () => {
        initRoleSwitcher();
        applyRole('admin');
        initTemplatePresets();
        initTemplatesPageActions();
        initExportConfig();
        initK8sPreview();
        initDeveloperExperience();
        initSidebarToggle();
        initThemeToggle();
        initI18n();
        initClusterListDetail();
        initStackListDetail();

        const style = document.createElement('style');
        style.textContent = `
            .template-category-btn {
                padding: 7px 16px;
                border: 1.5px solid #e5e7eb;
                border-radius: 20px;
                background: #fff;
                color: #6b7280;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.18s;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .template-category-btn.active,
            .template-category-btn:hover {
                background: #6366f1;
                color: #fff;
                border-color: #6366f1;
            }
        `;
        document.head.appendChild(style);
    });
})();

// Sidebar collapse/expand toggle
function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const mobileToggleBtn = document.getElementById('mobileSidebarToggle');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const sidebar = document.getElementById('mainSidebar');
    const sidebarResizeHandle = document.getElementById('sidebarResizeHandle');
    if (!toggleBtn) return;

    const STORAGE_KEY = 'nullus_sidebar_collapsed';
    const SIDEBAR_WIDTH_KEY = 'nullus_sidebar_width';
    const SIDEBAR_MIN = 220;
    const SIDEBAR_MAX = 420;

    const isMobileViewport = () => window.matchMedia('(max-width: 1200px)').matches;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const applySidebarWidth = (rawWidth) => {
        if (!rawWidth) return;
        const width = clamp(parseInt(rawWidth, 10), SIDEBAR_MIN, SIDEBAR_MAX);
        if (Number.isNaN(width)) return;
        document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
        localStorage.setItem(SIDEBAR_WIDTH_KEY, String(width));
    };
    const restoreDesktopState = () => {
        if (isMobileViewport()) {
            document.body.classList.remove('sidebar-collapsed');
            return;
        }
        document.body.classList.remove('sidebar-collapsed');
    };
    const closeMobileSidebar = () => {
        document.body.classList.remove('mobile-sidebar-open');
        if (mobileToggleBtn) {
            mobileToggleBtn.setAttribute('aria-expanded', 'false');
        }
        if (sidebarBackdrop) {
            sidebarBackdrop.setAttribute('aria-hidden', 'true');
        }
    };
    const toggleMobileSidebar = () => {
        const willOpen = !document.body.classList.contains('mobile-sidebar-open');
        document.body.classList.toggle('mobile-sidebar-open', willOpen);
        if (mobileToggleBtn) {
            mobileToggleBtn.setAttribute('aria-expanded', String(willOpen));
        }
        if (sidebarBackdrop) {
            sidebarBackdrop.setAttribute('aria-hidden', String(!willOpen));
        }
    };

    const savedSidebarWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    if (savedSidebarWidth) {
        applySidebarWidth(savedSidebarWidth);
    }

    restoreDesktopState();

    if (mobileToggleBtn) {
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        mobileToggleBtn.addEventListener('click', toggleMobileSidebar);
    }
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeMobileSidebar);
    }

    if (sidebarResizeHandle && sidebar) {
        let isResizing = false;
        const startResize = (event) => {
            if (isMobileViewport()) return;
            isResizing = true;
            document.body.classList.add('sidebar-resizing');
            event.preventDefault();
        };
        const onResize = (event) => {
            if (!isResizing || isMobileViewport()) return;
            applySidebarWidth(event.clientX);
        };
        const stopResize = () => {
            if (!isResizing) return;
            isResizing = false;
            document.body.classList.remove('sidebar-resizing');
        };

        sidebarResizeHandle.addEventListener('mousedown', startResize);
        document.addEventListener('mousemove', onResize);
        document.addEventListener('mouseup', stopResize);
        sidebarResizeHandle.addEventListener('touchstart', (event) => {
            if (!event.touches || !event.touches[0]) return;
            if (isMobileViewport()) return;
            isResizing = true;
            document.body.classList.add('sidebar-resizing');
            event.preventDefault();
        }, { passive: false });
        document.addEventListener('touchmove', (event) => {
            if (!isResizing || !event.touches || !event.touches[0] || isMobileViewport()) return;
            applySidebarWidth(event.touches[0].clientX);
            event.preventDefault();
        }, { passive: false });
        document.addEventListener('touchend', stopResize);
    }

    toggleBtn.addEventListener('click', () => {
        if (isMobileViewport()) {
            toggleMobileSidebar();
            return;
        }
        document.body.classList.toggle('sidebar-collapsed');
        localStorage.setItem(STORAGE_KEY, document.body.classList.contains('sidebar-collapsed'));
    });

    window.addEventListener('resize', () => {
        if (!isMobileViewport()) {
            closeMobileSidebar();
            restoreDesktopState();
        } else {
            document.body.classList.remove('sidebar-collapsed');
        }
    });
}
window.initSidebarToggle = initSidebarToggle;

// Theme (light/dark) toggle
function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const STORAGE_KEY = 'nullus_theme';
    if (localStorage.getItem(STORAGE_KEY) === 'light') {
        document.body.classList.add('light-mode');
        btn.querySelector('i').className = 'fas fa-moon';
    }
    btn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        btn.querySelector('i').className = isLight ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
    });
}
window.initThemeToggle = initThemeToggle;

// i18n (en/ko) language toggle
function initI18n() {
    if (typeof i18n === 'undefined') return;
    i18n.apply();
    const label = document.getElementById('langLabel');
    if (label) label.textContent = (i18n.locale || 'ko').toUpperCase();
    const dropdown = document.getElementById('langDropdown');
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown?.classList.toggle('open');
        });
        document.addEventListener('click', () => dropdown?.classList.remove('open'));
        langMenu.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = opt.dataset.lang;
                if (lang) i18n.setLocale(lang);
                dropdown?.classList.remove('open');
            });
        });
    }
}
window.initI18n = initI18n;
