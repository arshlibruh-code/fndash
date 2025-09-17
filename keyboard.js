/**
 * Keyboard shortcuts and input handling for the dashboard
 */
class KeyboardManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.setupKeyboardShortcuts();
    }

    handleArrowKeys(e, id) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const increment = e.shiftKey ? 10 : 1;
            const direction = e.key === 'ArrowUp' ? 1 : -1;
            this.dashboard[id] = Math.max(this.dashboard.config[id].min, Math.min(this.dashboard.config[id].max, this.dashboard[id] + (increment * direction)));
            e.target.value = this.dashboard[id];
            this.dashboard.updateGrid();
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Shift+G to toggle grid visibility (works in both modes)
            if (e.shiftKey && e.key === 'G') {
                e.preventDefault();
                this.dashboard.toggleGridVisibility();
                return;
            }
            
            // Shift+? to toggle add widget menu
            if (e.shiftKey && e.key === '?') {
                e.preventDefault();
                this.toggleWidgetMenu();
                return;
            }
            
            // Shift+N to create new dashboard
            if (e.shiftKey && e.key === 'N') {
                e.preventDefault();
                this.dashboard.dashboardManager.createNewDashboard();
                return;
            }
            
            // Shift+P to toggle dashboard menu
            if (e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.dashboard.dashboardManager.toggleDashboardMenu();
                return;
            }
            
            if (!this.dashboard.gridMode) return; // Guard clause for grid mode
            
            if (e.metaKey && e.shiftKey) {
                const adjustments = {
                    'ArrowLeft': () => this.dashboard.adjustValue('columns', -1),
                    'ArrowRight': () => this.dashboard.adjustValue('columns', 1),
                    'ArrowUp': () => this.dashboard.adjustValue('rows', -1),
                    'ArrowDown': () => this.dashboard.adjustValue('rows', 1)
                };
                
                if (adjustments[e.key]) {
                    e.preventDefault();
                    adjustments[e.key]();
                }
            }
            
            // Handle widget menu navigation
            const widgetMenuOverlay = document.getElementById('widgetMenuOverlay');
            if (widgetMenuOverlay && widgetMenuOverlay.classList.contains('show')) {
                if (e.key === 'Escape') {
                    this.dashboard.closeWidgetMenu();
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateWidgetMenu(e.key === 'ArrowDown' ? 1 : -1);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.selectFocusedWidget();
                }
            } else {
                // ESC key to deselect widgets when menu is closed
                if (e.key === 'Escape') {
                    this.dashboard.widgetManager.deselectAllWidgets();
                }
            }
        });
        
        // Click outside to deselect or close menu
        document.addEventListener('click', (e) => {
            // Close widget menu if clicking outside
            const widgetMenuOverlay = document.getElementById('widgetMenuOverlay');
            if (widgetMenuOverlay && widgetMenuOverlay.classList.contains('show')) {
                if (!e.target.closest('.widget-menu') && !e.target.closest('#addWidgetBtn')) {
                    this.dashboard.closeWidgetMenu();
                }
            }
            
            // Close dashboard menu if clicking outside
            const dashboardMenuOverlay = document.getElementById('dashboardMenuOverlay');
            if (dashboardMenuOverlay && dashboardMenuOverlay.classList.contains('show')) {
                if (!e.target.closest('.dashboard-menu') && !e.target.closest('#dashboardMenuBtn')) {
                    this.dashboard.closeDashboardMenu();
                }
            }
            
            // Deselect widgets if not clicking on widget, controls, or config panel
            if (!e.target.closest('.widget') && !e.target.closest('.controls') && !e.target.closest('.config-panel')) {
                this.dashboard.widgetManager.deselectAllWidgets();
            }
        });
        
        // Window resize to update widget positions
        window.addEventListener('resize', () => {
            this.dashboard.updateWidgetPositions();
        });
    }
    
    navigateWidgetMenu(direction) {
        const widgetMenuOverlay = document.getElementById('widgetMenuOverlay');
        if (!widgetMenuOverlay) return;
        
        const options = widgetMenuOverlay.querySelectorAll('.widget-option');
        const currentFocused = widgetMenuOverlay.querySelector('.widget-option.focused');
        
        if (!currentFocused) {
            // If no option is focused, focus the first one
            if (options.length > 0) {
                options[0].classList.add('focused');
                options[0].focus();
            }
            return;
        }
        
        const currentIndex = Array.from(options).indexOf(currentFocused);
        let newIndex = currentIndex + direction;
        
        // Wrap around
        if (newIndex < 0) {
            newIndex = options.length - 1;
        } else if (newIndex >= options.length) {
            newIndex = 0;
        }
        
        // Remove focus from current option
        currentFocused.classList.remove('focused');
        
        // Add focus to new option
        const newFocused = options[newIndex];
        newFocused.classList.add('focused');
        newFocused.focus();
    }
    
    selectFocusedWidget() {
        const widgetMenuOverlay = document.getElementById('widgetMenuOverlay');
        if (!widgetMenuOverlay) return;
        
        const focusedOption = widgetMenuOverlay.querySelector('.widget-option.focused');
        if (focusedOption) {
            const widgetType = focusedOption.dataset.widgetType;
            this.dashboard.selectWidgetType(widgetType);
        }
    }
    
    toggleWidgetMenu() {
        const widgetMenuOverlay = document.getElementById('widgetMenuOverlay');
        if (!widgetMenuOverlay) return;
        
        if (widgetMenuOverlay.classList.contains('show')) {
            this.dashboard.closeWidgetMenu();
        } else {
            this.dashboard.openWidgetMenu();
        }
    }
}

export { KeyboardManager };
