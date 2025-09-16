import { WidgetCore } from './widgets/WidgetCore.js';
import { MapWidget } from './widgets/map-widget.js';
import { ChartWidget } from './widgets/chart-widget.js';
import { SunburstWidget } from './widgets/sunburst-widget.js';
import { CustomWidget } from './widgets/custom-widget.js';
import { KeyboardManager } from './keyboard.js';
import { MapSyncManager } from './widgets/map-sync.js';
import { ConfigPanel } from './config-panel.js';
import { WidgetManager } from './widget-manager.js';

class GridTest {
    constructor() {
        this.grid = document.getElementById('grid');
        this.widgetsOverlay = document.getElementById('widgetsOverlay');
        
        // Widget system
        this.widgetTypes = {
            map: MapWidget,
            chart: ChartWidget,
            sunburst: SunburstWidget,
            custom: CustomWidget
        };
        this.widgets = new Map(); // Track all widgets
        this.selectedWidget = null;
        this.widgetCounters = { map: 0, chart: 0, sunburst: 0, custom: 0 }; // Track widget instances
        
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
        this.gridMode = true;
        
        // Initialize managers first
        this.keyboardManager = new KeyboardManager(this);
        this.mapSyncManager = new MapSyncManager(this);
        this.configPanel = new ConfigPanel(this);
        this.widgetManager = new WidgetManager(this);
        
        this.setupControls();
        this.setupAddWidgetControls();
        this.setupColorPicker();
        this.updateGrid(); // Apply initial values to CSS
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
        const closeWidgetMenu = document.getElementById('closeWidgetMenu');
        const widgetOptions = document.querySelectorAll('.widget-option');
        
        if (addWidgetBtn) {
            addWidgetBtn.addEventListener('click', () => {
                this.openWidgetMenu();
            });
        }
        
        if (closeWidgetMenu) {
            closeWidgetMenu.addEventListener('click', () => {
                this.closeWidgetMenu();
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
            // Enter grid mode
            this.grid.style.display = 'grid';
            document.querySelector('.controls').style.display = 'flex';
            document.getElementById('addWidgetControls').style.display = 'flex';
            this.widgetManager.setAllWidgetsMode(this.MODES.EDIT);
        } else {
            // Enter widget mode
            this.grid.style.display = 'none';
            document.querySelector('.controls').style.display = 'none';
            document.getElementById('addWidgetControls').style.display = 'none';
            this.widgetManager.setAllWidgetsMode(this.MODES.VIEW);
            this.widgetManager.deselectAllWidgets();
        }
    }
    
    
    getColumnLetter(columnNumber) {
        // Convert column number to letter (1=A, 2=B, 3=C, etc.)
        return String.fromCharCode(64 + columnNumber);
    }
    
    getCellDimensions() {
        // Calculate cell dimensions (used in multiple places)
        const cellWidth = (this.grid.offsetWidth - this.padding * 2 - (this.columns - 1) * this.gap) / this.columns;
        const cellHeight = (this.grid.offsetHeight - this.padding * 2 - (this.rows - 1) * this.gap) / this.rows;
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
