import { WidgetCore } from './widgets/WidgetCore.js';
import { MapWidget } from './widgets/map-widget.js';
import { ChartWidget } from './widgets/chart-widget.js';
import { SunburstWidget } from './widgets/sunburst-widget.js';
import { CustomWidget } from './widgets/custom-widget.js';
import { RichTextWidget } from './widgets/richtext-widget.js';
import { DevWidget } from './widgets/dev-widget.js';
import { KeyboardManager } from './keyboard.js';
import { MapSyncManager } from './widgets/map-sync.js';
import { ConfigPanel } from './config-panel.js';
import { WidgetManager } from './widget-manager.js';

class DashboardManager {
    constructor(gridTest) {
        this.gridTest = gridTest;
        this.dashboards = JSON.parse(localStorage.getItem('savedDashboards') || '{}');
        this.currentDashboard = localStorage.getItem('currentDashboard') || 'START PAGE';
        this.hasUnsavedChanges = false;
        this.initializeDefaultDashboards();
        this.setupDashboardName();
        this.setupDashboardControls();
        this.setupDashboardMenu();
        this.setupChangeDetection();
        
        // Load the current dashboard after initialization
        this.loadDashboard(this.currentDashboard);
    }
    
    initializeDefaultDashboards() {
        // Only initialize START PAGE dashboard - let users create others manually
        
        // Add or update Start Page dashboard
        this.dashboards['START PAGE'] = {
            name: 'START PAGE',
            gridConfig: {
                columns: 12,
                rows: 12,
                gap: 10,
                padding: 10,
                radius: 4
            },
            widgets: [
                {
                    id: 'richtext-1',
                    type: 'richtext',
                    startCell: '3D',
                    endCell: '5I'
                },
                {
                    id: 'dev-1',
                    type: 'dev',
                    startCell: '6D',
                    endCell: '8I'
                }
            ],
            savedAt: new Date().toISOString()
        };
        
        // Fix any existing dashboards with undefined grid config values
        this.fixDashboardGridConfigs();
        
        localStorage.setItem('savedDashboards', JSON.stringify(this.dashboards));
    }
    
    fixDashboardGridConfigs() {
        // Fix any dashboards that have undefined grid config values
        Object.keys(this.dashboards).forEach(dashboardName => {
            const dashboard = this.dashboards[dashboardName];
            if (dashboard.gridConfig) {
                // Check and fix undefined values
                if (dashboard.gridConfig.columns === undefined) dashboard.gridConfig.columns = 12;
                if (dashboard.gridConfig.rows === undefined) dashboard.gridConfig.rows = 8;
                if (dashboard.gridConfig.gap === undefined) dashboard.gridConfig.gap = 10;
                if (dashboard.gridConfig.padding === undefined) dashboard.gridConfig.padding = 10;
                if (dashboard.gridConfig.radius === undefined) dashboard.gridConfig.radius = 4;
            }
        });
    }
    
    setupDashboardName() {
        const nameElement = document.getElementById('dashboardName');
        nameElement.textContent = this.currentDashboard;
        
        nameElement.addEventListener('click', () => {
            this.startEditing();
        });
    }
    
    startEditing() {
        const nameElement = document.getElementById('dashboardName');
        const currentName = nameElement.textContent;
        
        nameElement.classList.add('editing');
        nameElement.contentEditable = true;
        nameElement.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(nameElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        const finishEditing = () => {
            const newName = nameElement.textContent.trim().toUpperCase() || 'MY DASHBOARD';
            this.currentDashboard = newName;
            nameElement.textContent = newName;
            nameElement.classList.remove('editing');
            nameElement.contentEditable = false;
            localStorage.setItem('currentDashboard', newName);
        };
        
        nameElement.addEventListener('blur', finishEditing, { once: true });
        nameElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                finishEditing();
            } else if (e.key === 'Escape') {
                nameElement.textContent = this.currentDashboard;
                finishEditing();
            }
        });
    }
    
    setupDashboardControls() {
        document.getElementById('saveDashboard').addEventListener('click', () => {
            this.saveCurrentDashboard();
        });
    }
    
    setupDashboardMenu() {
        const menuBtn = document.getElementById('dashboardMenuBtn');
        
        menuBtn.addEventListener('click', () => {
            this.openDashboardMenu();
        });
    }
    
    toggleDashboardMenu() {
        const overlay = document.getElementById('dashboardMenuOverlay');
        if (overlay.classList.contains('show')) {
            this.closeDashboardMenu();
        } else {
            this.openDashboardMenu();
        }
    }
    
    openDashboardMenu() {
        const overlay = document.getElementById('dashboardMenuOverlay');
        overlay.classList.add('show');
        this.populateDashboardList();
        
        // Clear any existing focus
        this.clearAllFocus();
        
        // Focus first option for keyboard navigation (Create New Dashboard)
        const firstOption = overlay.querySelector('.dashboard-option');
        if (firstOption) {
            firstOption.focus();
            firstOption.classList.add('focused');
        }
        
        // Add keyboard navigation
        this.setupDashboardMenuKeyboardNavigation();
    }
    
    closeDashboardMenu() {
        const overlay = document.getElementById('dashboardMenuOverlay');
        overlay.classList.remove('show');
        
        // Clear all focus
        this.clearAllFocus();
        
        // Remove keyboard navigation listeners
        this.removeDashboardMenuKeyboardNavigation();
    }
    
    clearAllFocus() {
        const overlay = document.getElementById('dashboardMenuOverlay');
        if (overlay) {
            const allOptions = overlay.querySelectorAll('.dashboard-option');
            allOptions.forEach(option => {
                option.classList.remove('focused');
                option.blur();
            });
        }
    }
    
    setupDashboardMenuKeyboardNavigation() {
        // Store the current handler so we can remove it later
        this.dashboardMenuKeyHandler = (e) => {
            const overlay = document.getElementById('dashboardMenuOverlay');
            if (!overlay.classList.contains('show')) return;
            
            const options = overlay.querySelectorAll('.dashboard-option');
            const currentFocused = overlay.querySelector('.dashboard-option.focused');
            
            if (!currentFocused) {
                // If no option is focused, focus the first one
                if (options.length > 0) {
                    options[0].classList.add('focused');
                    options[0].focus();
                }
                return;
            }
            
            const currentIndex = Array.from(options).indexOf(currentFocused);
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
                    this.updateDashboardMenuFocus(options, nextIndex);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
                    this.updateDashboardMenuFocus(options, prevIndex);
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (currentFocused) {
                        currentFocused.click();
                    }
                    break;
                    
                case 'Escape':
                    e.preventDefault();
                    this.closeDashboardMenu();
                    break;
                    
                case 'Delete':
                    e.preventDefault();
                    if (currentFocused && currentFocused.dataset.dashboardAction !== 'create') {
                        // Only delete if it's not the "Create New Dashboard" option
                        const dashboardName = currentFocused.querySelector('.dashboard-name-text')?.textContent;
                        if (dashboardName && dashboardName !== this.currentDashboard && dashboardName !== 'START PAGE') {
                            this.deleteDashboard(dashboardName);
                        }
                    }
                    break;
            }
        };
        
        document.addEventListener('keydown', this.dashboardMenuKeyHandler);
    }
    
    removeDashboardMenuKeyboardNavigation() {
        if (this.dashboardMenuKeyHandler) {
            document.removeEventListener('keydown', this.dashboardMenuKeyHandler);
            this.dashboardMenuKeyHandler = null;
        }
    }
    
    updateDashboardMenuFocus(options, focusedIndex) {
        // Clear all focus first
        this.clearAllFocus();
        
        // Add focus class and focus to current option
        if (options[focusedIndex]) {
            options[focusedIndex].classList.add('focused');
            options[focusedIndex].focus();
        }
    }
    
    populateDashboardList() {
        const content = document.getElementById('dashboardMenuContent');
        content.innerHTML = '';
        
        // Clear all focus when repopulating
        this.clearAllFocus();
        
        // Handle the "Create New Dashboard" option that's now in HTML
        const createOption = document.querySelector('[data-dashboard-action="create"]');
        if (createOption) {
            // Remove existing event listeners to prevent duplicates
            createOption.replaceWith(createOption.cloneNode(true));
            const newCreateOption = document.querySelector('[data-dashboard-action="create"]');
            
            newCreateOption.addEventListener('click', () => {
                this.createNewDashboard();
                this.closeDashboardMenu();
            });
        }
        
        Object.keys(this.dashboards).forEach(name => {
            const option = document.createElement('div');
            option.className = 'dashboard-option';
            option.setAttribute('tabindex', '0');
            
            // Create dashboard name span
            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            nameSpan.className = 'dashboard-name-text';
            
            option.appendChild(nameSpan);
            
            // Only show delete button if it's not the current dashboard and not START PAGE
            if (name !== this.currentDashboard && name !== 'START PAGE') {
                // Create delete button (hidden by default)
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'dashboard-delete-btn';
                deleteBtn.innerHTML = '<i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>';
                deleteBtn.title = 'Delete dashboard';
                
                // Add click handler for delete button
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering the dashboard load
                    this.deleteDashboard(name);
                    // Don't close the menu - keep it open and refresh
                });
                
                option.appendChild(deleteBtn);
            }
            
            if (name === this.currentDashboard) {
                option.classList.add('active');
            }
            
            option.addEventListener('click', () => {
                this.loadDashboard(name);
                this.closeDashboardMenu();
            });
            
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.loadDashboard(name);
                    this.closeDashboardMenu();
                }
            });
            
            content.appendChild(option);
        });
        
        // Initialize Lucide icons for all delete buttons after they're all created
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    setupChangeDetection() {
        // Listen for grid changes
        const gridInputs = ['columns', 'rows', 'gap', 'padding', 'radius'];
        gridInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.markAsChanged();
                });
            }
        });
        
        // Listen for widget changes (add/remove/move)
        this.gridTest.widgetsOverlay.addEventListener('DOMNodeInserted', () => {
            this.markAsChanged();
        });
        
        this.gridTest.widgetsOverlay.addEventListener('DOMNodeRemoved', () => {
            this.markAsChanged();
        });
        
        // Initial state
        this.updateSaveButtonState();
    }
    
    markAsChanged() {
        this.hasUnsavedChanges = true;
        this.updateSaveButtonState();
    }
    
    markAsSaved() {
        this.hasUnsavedChanges = false;
        this.updateSaveButtonState();
    }
    
    updateSaveButtonState() {
        const saveBtn = document.getElementById('saveDashboard');
        if (saveBtn) {
            if (this.hasUnsavedChanges) {
                saveBtn.classList.add('has-changes');
            } else {
                saveBtn.classList.remove('has-changes');
            }
        }
    }
    
    saveCurrentDashboard() {
        const dashboardData = {
            name: this.currentDashboard,
            gridConfig: {
                columns: this.gridTest.columns,
                rows: this.gridTest.rows,
                gap: this.gridTest.gap,
                padding: this.gridTest.padding,
                radius: this.gridTest.radius
            },
            widgets: this.getCurrentWidgets(),
            savedAt: new Date().toISOString()
        };
        
        this.dashboards[this.currentDashboard] = dashboardData;
        localStorage.setItem('savedDashboards', JSON.stringify(this.dashboards));
        this.markAsSaved();
        this.showMessage('Dashboard saved!');
    }
    
    getCurrentWidgets() {
        const widgets = [];
        const widgetElements = this.gridTest.widgetsOverlay.querySelectorAll('[id^="map-"], [id^="chart-"], [id^="sunburst-"], [id^="custom-"], [id^="richtext-"]');
        
        widgetElements.forEach(widget => {
            widgets.push({
                id: widget.id,
                type: widget.id.split('-')[0],
                startCell: widget.dataset.startCell,
                endCell: widget.dataset.endCell
            });
        });
        
        return widgets;
    }
    
    loadDashboard(name) {
        const dashboard = this.dashboards[name];
        if (!dashboard) return;
        
        // Apply grid config with fallback to defaults for undefined values
        this.gridTest.columns = dashboard.gridConfig.columns ?? 12;
        this.gridTest.rows = dashboard.gridConfig.rows ?? 8;
        this.gridTest.gap = dashboard.gridConfig.gap ?? 10;
        this.gridTest.padding = dashboard.gridConfig.padding ?? 10;
        this.gridTest.radius = dashboard.gridConfig.radius ?? 4;
        
        // Update UI
        document.getElementById('columns').value = this.gridTest.columns;
        document.getElementById('rows').value = this.gridTest.rows;
        document.getElementById('gap').value = this.gridTest.gap;
        document.getElementById('padding').value = this.gridTest.padding;
        document.getElementById('radius').value = this.gridTest.radius;
        
        // Clear existing widgets
        this.gridTest.widgetsOverlay.innerHTML = '';
        
        // Recreate widgets
        dashboard.widgets.forEach(widgetData => {
            if (widgetData.startCell && widgetData.endCell) {
                // Create widget with position data
                const widget = this.gridTest.widgetManager.createWidget(widgetData.type, {
                    startCell: widgetData.startCell,
                    endCell: widgetData.endCell
                }, widgetData.id);
                
                if (widget) {
                    // Get the actual widget element
                    const widgetElement = this.gridTest.widgetsOverlay.querySelector(`#${widget}`);
                    if (widgetElement) {
                        // Position the widget
                        this.gridTest.positionWidget(widgetElement, widgetData.startCell, widgetData.endCell);
                    }
                }
            }
        });
        
        // Update grid configuration without recreating grid items
        this.gridTest.updateGridConfig();
        
        // Update RichText widget positions for current mode
        this.gridTest.updateRichTextWidgetPositions();
        
        // Update dashboard name
        this.currentDashboard = name;
        document.getElementById('dashboardName').textContent = name;
        localStorage.setItem('currentDashboard', name);
        
        // Mark as saved since we just loaded a saved state
        this.markAsSaved();
        
        this.showMessage('Dashboard loaded!');
    }
    
    deleteDashboard(name) {
        // Delete from localStorage
        delete this.dashboards[name];
        localStorage.setItem('savedDashboards', JSON.stringify(this.dashboards));
        
        // If we deleted the current dashboard, reset to default
        if (name === this.currentDashboard) {
            this.resetToDefaultDashboard();
        }
        
        // Refresh the dashboard list (keeps menu open)
        this.populateDashboardList();
        
        this.showMessage('Dashboard deleted!');
    }
    
    resetToDefaultDashboard() {
        // Clear all widgets
        this.gridTest.widgetsOverlay.innerHTML = '';
        
        // Reset to default dashboard name
        this.currentDashboard = 'START PAGE';
        document.getElementById('dashboardName').textContent = this.currentDashboard;
        localStorage.setItem('currentDashboard', this.currentDashboard);
        
        // Create a default map widget
        this.gridTest.widgetManager.createWidget('map', { startCell: '3F', endCell: '7H' });
        
        // Mark as saved
        this.markAsSaved();
        
        this.showMessage('Reset to default dashboard');
    }
    
    createNewDashboard() {
        // Generate sequential number for untitled dashboards
        let counter = 1;
        let newName;
        do {
            const now = new Date();
            const day = now.getDate().toString().padStart(2, '0');
            const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                              'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            const month = monthNames[now.getMonth()];
            const year = now.getFullYear().toString().slice(-2);
            
            newName = `untitled-dashboard-${counter.toString().padStart(4, '0')}-${day}-${month}-${year}`;
            counter++;
        } while (this.dashboards[newName]); // Ensure unique name
        
        // Create empty dashboard with current grid config
        this.dashboards[newName] = {
            name: newName,
            gridConfig: {
                columns: this.gridTest.columns,
                rows: this.gridTest.rows,
                gap: this.gridTest.gap,
                padding: this.gridTest.padding,
                radius: this.gridTest.radius
            },
            widgets: [],
            savedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('savedDashboards', JSON.stringify(this.dashboards));
        
        // Load the new dashboard
        this.loadDashboard(newName);
        
        this.showMessage('New dashboard created!');
    }
    
    showMessage(text) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#089BDF;color:white;padding:8px 16px;border-radius:4px;z-index:1000;font-size:14px;';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    }
}

class GridTest {
    constructor() {
        this.grid = document.getElementById('grid');
        this.widgetsOverlay = document.getElementById('widgetsOverlay');
        
        // Widget system
        this.widgetTypes = {
            map: MapWidget,
            chart: ChartWidget,
            sunburst: SunburstWidget,
            custom: CustomWidget,
            richtext: RichTextWidget,
            dev: DevWidget
        };
        this.widgets = new Map(); // Track all widgets
        this.selectedWidget = null;
        this.widgetCounters = { map: 0, chart: 0, sunburst: 0, custom: 0, richtext: 0, dev: 0 }; // Track widget instances
        
        this.config = {
            columns: { min: 1, max: 12, default: 12 },
            rows: { min: 1, max: 12, default: 8 },
            gap: { min: 0, max: 100, default: 10 },
            radius: { min: 0, max: 800, default: 4 },
            padding: { min: 0, max: 500, default: 10 }
        };
        
        // Initialize values
        Object.keys(this.config).forEach(key => {
            this[key] = this.config[key].default;
        });
        
        // Ensure values don't exceed new limits
        this.padding = Math.min(this.padding, this.config.padding.max);
        this.radius = Math.min(this.radius, this.config.radius.max);
        
        // Grid visibility state
        this.gridVisible = true;
        
        // Mode constants and state
        this.MODES = {
            EDIT: 'edit',
            VIEW: 'view'
        };
        this.gridMode = false;
        
        // Initialize managers first
        this.keyboardManager = new KeyboardManager(this);
        this.mapSyncManager = new MapSyncManager(this);
        this.configPanel = new ConfigPanel(this);
        this.widgetManager = new WidgetManager(this);
        this.dashboardManager = new DashboardManager(this);
        
        this.setupControls();
        this.setupAddWidgetControls();
        this.setupColorPicker();
        this.updateGrid(); // Apply initial values to CSS
        
        // Set initial toolbar mode and hide grid
        this.setToolbarMode('view');
        this.grid.style.display = 'none';
        this.widgetManager.setAllWidgetsMode(this.MODES.VIEW);
    }
    
    setupControls() {
        Object.keys(this.config).forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', (e) => this.handleInput(e, id));
            input.addEventListener('keydown', (e) => this.keyboardManager.handleArrowKeys(e, id));
        });
        
        // Widget controls will be set up dynamically
    }
    
    setupAddWidgetControls() {
        const addWidgetBtn = document.getElementById('addWidgetBtn');
        const widgetMenuOverlay = document.getElementById('widgetMenuOverlay');
        const widgetOptions = document.querySelectorAll('.widget-option');
        
        if (addWidgetBtn) {
            addWidgetBtn.addEventListener('click', () => {
                this.openWidgetMenu();
            });
        }
        
        // Close menu when clicking outside (handled by click outside listener)
        
        // Handle widget selection
        widgetOptions.forEach(option => {
            option.addEventListener('click', () => {
                const widgetType = option.dataset.widgetType;
                this.selectWidgetType(widgetType);
            });
            
            // Make options focusable for keyboard navigation
            option.setAttribute('tabindex', '0');
            
            // Handle keyboard selection
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const widgetType = option.dataset.widgetType;
                    this.selectWidgetType(widgetType);
                }
            });
        });
    }
    
    setupColorPicker() {
        const colorPicker = document.getElementById('colorPicker');
        
        if (colorPicker) {
            // Set initial color to match current body background
            const currentBgColor = getComputedStyle(document.body).backgroundColor;
            const rgbToHex = (rgb) => {
                const result = rgb.match(/\d+/g);
                if (result) {
                    const r = parseInt(result[0]);
                    const g = parseInt(result[1]);
                    const b = parseInt(result[2]);
                    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                }
                return "#1a1a1a"; // fallback
            };
            
            const hexColor = rgbToHex(currentBgColor);
            colorPicker.value = hexColor;
            
            // Color change handler
            colorPicker.addEventListener('input', (e) => {
                this.updateBackgroundColor(e.target.value);
            });
        }
    }
    
    updateBackgroundColor(color) {
        document.body.style.backgroundColor = color;
        const grid = document.getElementById('grid');
        if (grid) {
            grid.style.backgroundColor = color;
        }
    }
    
    openWidgetMenu() {
        const widgetMenuOverlay = document.getElementById('widgetMenuOverlay');
        if (widgetMenuOverlay) {
            widgetMenuOverlay.classList.add('show');
            // Focus first widget option for keyboard navigation
            const firstOption = widgetMenuOverlay.querySelector('.widget-option');
            if (firstOption) {
                firstOption.focus();
                firstOption.classList.add('focused');
            }
        }
    }
    
    closeWidgetMenu() {
        const widgetMenuOverlay = document.getElementById('widgetMenuOverlay');
        if (widgetMenuOverlay) {
            widgetMenuOverlay.classList.remove('show');
            // Remove focus from all options
            const focusedOption = widgetMenuOverlay.querySelector('.widget-option.focused');
            if (focusedOption) {
                focusedOption.classList.remove('focused');
            }
        }
    }
    
    selectWidgetType(widgetType) {
        this.closeWidgetMenu();
        this.widgetManager.addNewWidget(widgetType);
    }
    
    handleInput(e, id) {
        const value = parseInt(e.target.value) || this.config[id].min;
        this[id] = Math.max(this.config[id].min, Math.min(this.config[id].max, value));
        e.target.value = this[id];
        this.updateGrid();
    }
    
    
    adjustValue(id, delta) {
        this[id] = Math.max(this.config[id].min, Math.min(this.config[id].max, this[id] + delta));
        document.getElementById(id).value = this[id];
        this.updateGrid();
    }
    
    
    isValidCellId(cellId) {
        if (!cellId) return false;
        const match = cellId.match(/^(\d+)([A-Z]+)$/);
        if (!match) return false;
        
        const row = parseInt(match[1]);
        const colLetter = match[2];
        const col = colLetter.charCodeAt(0) - 64;
        
        // Check if within current grid bounds
        return row >= 1 && row <= this.rows && col >= 1 && col <= this.columns;
    }
    
    updateGrid() {
        // Update CSS properties
        this.grid.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
        this.grid.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        this.grid.style.gap = `${this.gap}px`;
        this.grid.style.padding = `${this.padding}px`;
        
        // Only recreate grid items if columns or rows changed
        if (this.columns !== this.lastColumns || this.rows !== this.lastRows) {
            this.createGridItems();
            this.lastColumns = this.columns;
            this.lastRows = this.rows;
        }
        
        // Update radius for existing items
        const gridItems = this.grid.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            item.style.borderRadius = `${this.radius}px`;
        });
        
        // Update widget positions when grid changes
        this.updateWidgetPositions();
    }
    
    updateGridConfig() {
        // Update grid styling without recreating grid items
        this.grid.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
        this.grid.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        this.grid.style.gap = `${this.gap}px`;
        this.grid.style.padding = `${this.padding}px`;
        
        // Update radius for existing items
        const gridItems = this.grid.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            item.style.borderRadius = `${this.radius}px`;
        });
        
        // Update widget positions
        this.updateWidgetPositions();
    }
    
    createGridItems() {
        // Store all existing widgets before recreating grid
        const existingWidgets = Array.from(this.widgetsOverlay.children).map(widget => ({
            id: widget.id,
            type: widget.dataset.widgetType || widget.id.split('-')[0],
            startCell: widget.dataset.startCell,
            endCell: widget.dataset.endCell,
            element: widget
        }));
        
        // Remove all grid items
        const gridItems = this.grid.querySelectorAll('.grid-item');
        gridItems.forEach(item => item.remove());
        
        // Create new grid items
        for (let row = 1; row <= this.rows; row++) {
            for (let col = 1; col <= this.columns; col++) {
            const item = document.createElement('div');
            item.className = 'grid-item';
                item.id = `${row}${this.getColumnLetter(col)}`;
            item.style.borderRadius = `${this.radius}px`;
                item.textContent = `${row}${this.getColumnLetter(col)}`;
            this.grid.appendChild(item);
            }
        }
        
        // Re-add existing widgets to preserve them (don't recreate)
        existingWidgets.forEach(widgetData => {
            if (widgetData.element && widgetData.startCell && widgetData.endCell) {
                // Just reposition the existing widget, don't recreate it
                this.positionWidget(widgetData.element, widgetData.startCell, widgetData.endCell);
            }
        });
        
        // If no widgets exist, create a default map widget
        if (existingWidgets.length === 0) {
            this.widgetManager.createWidget('map', { startCell: '3F', endCell: '7H' });
        }
    }
    
    createWidget(type, config, uniqueId = null) {
        return this.widgetManager.createWidget(type, config, uniqueId);
    }
    
    addNewWidget(type) {
        return this.widgetManager.addNewWidget(type);
    }
    
    
    positionWidget(widget, startCell, endCell) {
        const startCoords = WidgetCore.parseCellId(startCell);
        const endCoords = WidgetCore.parseCellId(endCell);
        
        // Store grid coordinates in widget data attributes
        widget.dataset.startCell = startCell;
        widget.dataset.endCell = endCell;
        
        // Calculate cell dimensions
        const { cellWidth, cellHeight } = this.getCellDimensions();
        
        // Calculate position and size
        const left = this.padding + (startCoords.col - 1) * (cellWidth + this.gap);
        const top = this.padding + (startCoords.row - 1) * (cellHeight + this.gap);
        const width = (endCoords.col - startCoords.col + 1) * cellWidth + (endCoords.col - startCoords.col) * this.gap;
        const height = (endCoords.row - startCoords.row + 1) * cellHeight + (endCoords.row - startCoords.row) * this.gap;
        
        // Apply position and size
        widget.style.left = `${left}px`;
        widget.style.top = `${top}px`;
        widget.style.width = `${width}px`;
        widget.style.height = `${height}px`;
        
        // Update config panel if it's open for this widget
        this.updateConfigPanelIfOpen(widget);
    }
    
    updateConfigPanelIfOpen(widget) {
        this.configPanel.updateConfigPanelIfOpen(widget);
    }
    
    updateWidgetPositions() {
        // Update all widget positions when grid changes
        const widgets = this.widgetsOverlay.querySelectorAll('.widget');
        widgets.forEach(widget => {
            const startCell = widget.dataset.startCell;
            const endCell = widget.dataset.endCell;
            if (startCell && endCell) {
                this.positionWidget(widget, startCell, endCell);
                WidgetCore.updateDebugInfo(widget);
            }
        });
    }
    
    
    toggleGridVisibility() {
        this.gridMode = !this.gridMode;
        
        if (this.gridMode) {
            // Enter edit mode
            this.grid.style.display = 'grid';
            this.setToolbarMode('edit');
            this.widgetManager.setAllWidgetsMode(this.MODES.EDIT);
        } else {
            // Enter view mode
            this.grid.style.display = 'none';
            this.setToolbarMode('view');
            this.widgetManager.setAllWidgetsMode(this.MODES.VIEW);
            this.widgetManager.deselectAllWidgets();
        }
    }
    
    setToolbarMode(mode) {
        const controls = document.querySelector('.controls');
        
        if (mode === 'edit') {
            controls.classList.remove('view-mode');
            controls.classList.add('edit-mode');
        } else {
            controls.classList.remove('edit-mode');
            controls.classList.add('view-mode');
        }
        
        // Update dev widget visibility
        this.updateDevWidgetVisibility();
    }
    
    updateDevWidgetVisibility() {
        const devWidgets = document.querySelectorAll('.dev-widget');
        const isEditMode = !document.querySelector('.controls').classList.contains('view-mode');
        
        devWidgets.forEach(widget => {
            widget.style.display = isEditMode ? 'block' : 'none';
        });
        
        // Update RichText widget positions for mode changes
        this.updateRichTextWidgetPositions();
    }
    
    updateRichTextWidgetPositions() {
        const richtextWidgets = document.querySelectorAll('.richtext-widget');
        richtextWidgets.forEach(widget => {
            const widgetInstance = this.widgets.get(widget.id);
            if (widgetInstance && widgetInstance.updatePositionForMode) {
                widgetInstance.updatePositionForMode();
            }
        });
    }
    
    
    getColumnLetter(columnNumber) {
        // Convert column number to letter (1=A, 2=B, 3=C, etc.)
        return String.fromCharCode(64 + columnNumber);
    }
    
    getCellDimensions() {
        // Calculate cell dimensions (used in multiple places)
        // Temporarily show grid to get accurate dimensions if it's hidden
        const wasHidden = this.grid.style.display === 'none';
        if (wasHidden) {
            this.grid.style.display = 'grid';
            this.grid.style.visibility = 'hidden';
        }
        
        const cellWidth = (this.grid.offsetWidth - this.padding * 2 - (this.columns - 1) * this.gap) / this.columns;
        const cellHeight = (this.grid.offsetHeight - this.padding * 2 - (this.rows - 1) * this.gap) / this.rows;
        
        // Restore original state if it was hidden
        if (wasHidden) {
            this.grid.style.display = 'none';
            this.grid.style.visibility = 'visible';
        }
        
        return { cellWidth, cellHeight };
    }
    
    createPreview() {
        // Create preview element for drag/resize operations
        const preview = document.createElement('div');
        preview.className = 'preview';
        this.widgetsOverlay.appendChild(preview);
        return preview;
    }
    
    
    
    // Map sync management methods (delegated to MapSyncManager)
    syncAllMaps(leaderMap, syncMode) {
        return this.mapSyncManager.syncAllMaps(leaderMap, syncMode);
    }
    
    setMapLeader(leaderWidget) {
        return this.mapSyncManager.setMapLeader(leaderWidget);
    }
    
    setPrimaryLeader(primaryWidget) {
        return this.mapSyncManager.setPrimaryLeader(primaryWidget);
    }
    
    updateGlobalSyncState(enabled, mode, sourceWidget) {
        return this.mapSyncManager.updateGlobalSyncState(enabled, mode, sourceWidget);
    }
    
    updateAllConfigPanels() {
        return this.mapSyncManager.updateAllConfigPanels();
    }
    
    // Expose map sync state for widgets
    get globalSyncState() {
        return this.mapSyncManager.globalSyncState;
    }
    
    get primaryMapLeader() {
        return this.mapSyncManager.primaryMapLeader;
    }
    
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gridTest = new GridTest();
});
