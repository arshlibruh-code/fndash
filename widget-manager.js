import { WidgetCore } from './widgets/WidgetCore.js';

/**
 * Widget management for the dashboard
 * Handles widget creation, lifecycle, drag/resize, and selection
 */
class WidgetManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.widgets = dashboard.widgets;
        this.widgetsOverlay = dashboard.widgetsOverlay;
        this.MODES = dashboard.MODES;
        this.widgetCounters = dashboard.widgetCounters;
        this.widgetTypes = dashboard.widgetTypes;
    }

    createWidget(type, config, uniqueId = null) {
        // Generate unique ID if not provided
        if (!uniqueId) {
            this.widgetCounters[type] = (this.widgetCounters[type] || 0) + 1;
            uniqueId = `${type}-${this.widgetCounters[type]}`;
        }
        
        // Remove existing widget with this ID if it exists
        const existingWidget = this.widgetsOverlay.querySelector(`#${uniqueId}`);
        if (existingWidget) {
            existingWidget.remove();
        }
        
        // Get widget class and create instance
        const WidgetClass = this.widgetTypes[type];
        if (!WidgetClass) {
            console.error(`Unknown widget type: ${type}`);
            return;
        }
        
        const widgetInstance = new WidgetClass(config);
        const widgetElement = widgetInstance.createElement();
        widgetElement.id = uniqueId;
        widgetElement.style.borderRadius = `${this.dashboard.radius}px`;
        widgetElement.dataset.mode = this.MODES.EDIT;
        
        // Add debug box using widget instance method
        widgetInstance.addDebugBox(widgetElement);
        
        // Add resize handles
        this.addResizeHandles(widgetElement);
        
        // Add click handler for selection
        this.addSelectionHandler(widgetElement);
        
        // Add widget control header (move, config, duplicate, delete)
        this.addWidgetControlHeader(widgetElement);
        
        // Calculate position based on provided grid coordinates
        this.dashboard.positionWidget(widgetElement, config.startCell, config.endCell);
        
        // Store the element reference in the widget instance
        widgetInstance.element = widgetElement;
        
        // Store widget instance with unique ID
        this.widgets.set(uniqueId, widgetInstance);
        
        this.widgetsOverlay.appendChild(widgetElement);
        
        // Initialize Lucide icons for the new widget
        lucide.createIcons();
        
        return uniqueId;
    }
    
    addNewWidget(type) {
        // Check map widget limit
        if (type === 'map') {
            const mapWidgetCount = Array.from(this.widgets.values()).filter(w => w.type === 'map').length;
            if (mapWidgetCount >= 16) {
                alert('Maximum of 16 map widgets allowed per dashboard');
                return;
            }
        }
        
        // Find an available position for the new widget
        const availablePosition = this.findAvailablePosition();
        if (!availablePosition) {
            alert('No available space for new widget');
            return;
        }
        
        // Create widget with default config
        const config = {
            startCell: availablePosition.start,
            endCell: availablePosition.end
        };
        
        const widgetId = this.createWidget(type, config);
    }
    
    findAvailablePosition() {
        // Simple algorithm to find available grid space
        // Start from top-left and find first available 2x2 area
        for (let row = 1; row <= this.dashboard.rows - 1; row++) {
            for (let col = 1; col <= this.dashboard.columns - 1; col++) {
                const startCell = `${row}${this.dashboard.getColumnLetter(col)}`;
                const endCell = `${row + 1}${this.dashboard.getColumnLetter(col + 1)}`;
                
                // Check if this position is available
                if (this.isPositionAvailable(startCell, endCell)) {
                    return { start: startCell, end: endCell };
                }
            }
        }
        return null;
    }
    
    isPositionAvailable(startCell, endCell) {
        // Check if any existing widget overlaps with this position
        const widgets = this.widgetsOverlay.querySelectorAll('.widget');
        for (const widget of widgets) {
            const widgetStart = widget.dataset.startCell;
            const widgetEnd = widget.dataset.endCell;
            
            if (this.positionsOverlap(startCell, endCell, widgetStart, widgetEnd)) {
                return false;
            }
        }
        return true;
    }
    
    positionsOverlap(start1, end1, start2, end2) {
        const coords1 = WidgetCore.parseCellId(start1);
        const coords2 = WidgetCore.parseCellId(end1);
        const coords3 = WidgetCore.parseCellId(start2);
        const coords4 = WidgetCore.parseCellId(end2);
        
        return !(coords2.row < coords3.row || coords4.row < coords1.row || 
                 coords2.col < coords3.col || coords4.col < coords1.col);
    }
    
    addResizeHandles(widget) {
        // Right handle
        const rightHandle = document.createElement('div');
        rightHandle.className = 'resize-handle resize-handle-right';
        widget.appendChild(rightHandle);
        
        // Bottom handle
        const bottomHandle = document.createElement('div');
        bottomHandle.className = 'resize-handle resize-handle-bottom';
        widget.appendChild(bottomHandle);
        
        // Corner handle
        const cornerHandle = document.createElement('div');
        cornerHandle.className = 'resize-handle resize-handle-corner';
        widget.appendChild(cornerHandle);
        
        // Add resize functionality
        this.addResizeFunctionality(widget, rightHandle, bottomHandle, cornerHandle);
    }
    
    addSelectionHandler(widget) {
        widget.addEventListener('click', (e) => {
            if (widget.dataset.mode !== this.MODES.EDIT) return;
            e.stopPropagation();
            this.selectWidget(widget);
        });
    }
    
    selectWidget(widget) {
        // Deselect all widgets
        this.deselectAllWidgets();
        
        // Select this widget
        widget.classList.add('selected');
        
        // Show widget controls
        this.showWidgetControls();
        
        // Update toolbar inputs
        this.updateWidgetControls(widget);
        
        // Update config panel if it's open
        const configPanel = document.getElementById('configPanel');
        if (configPanel && configPanel.classList.contains('open')) {
            this.dashboard.configPanel.openConfigPanel(widget);
        }
    }
    
    deselectAllWidgets() {
        document.querySelectorAll('.widget').forEach(w => w.classList.remove('selected'));
        this.hideWidgetControls();
    }
    
    showWidgetControls() {
        document.querySelectorAll('.widget-controls').forEach(control => {
            control.style.display = 'flex';
        });
    }
    
    hideWidgetControls() {
        document.querySelectorAll('.widget-controls').forEach(control => {
            control.style.display = 'none';
        });
    }
    
    updateWidgetControls(widget) {
        const widgetType = widget.id;
        const widgetInstance = this.widgets.get(widgetType);
        
        if (widgetInstance) {
            const controlsHTML = widgetInstance.getControls();
            const controlsContainer = document.getElementById('widgetControls');
            controlsContainer.innerHTML = controlsHTML;
            
            // Set up event listeners for the new controls
            this.setupWidgetControlListeners(widget);
            
            // Update input values
            const startInput = controlsContainer.querySelector('#widgetStart');
            const endInput = controlsContainer.querySelector('#widgetEnd');
            if (startInput) startInput.value = widget.dataset.startCell;
            if (endInput) endInput.value = widget.dataset.endCell;
        }
    }
    
    setupWidgetControlListeners(widget) {
        const startInput = document.getElementById('widgetStart');
        const endInput = document.getElementById('widgetEnd');
        
        if (startInput) {
            startInput.addEventListener('input', (e) => this.handleWidgetInput(e, widget, 'start'));
        }
        if (endInput) {
            endInput.addEventListener('input', (e) => this.handleWidgetInput(e, widget, 'end'));
        }
    }
    
    handleWidgetInput(e, widget, type) {
        const value = e.target.value.toUpperCase();
        
        if (this.dashboard.isValidCellId(value)) {
            if (type === 'start') {
                widget.dataset.startCell = value;
            } else {
                widget.dataset.endCell = value;
            }
            
            // Update widget position
            const startCell = widget.dataset.startCell;
            const endCell = widget.dataset.endCell;
            this.dashboard.positionWidget(widget, startCell, endCell);
            WidgetCore.updateDebugInfo(widget);
            
            // Resize map if it's a map widget
            const widgetInstance = this.widgets.get(widget.id);
            if (widgetInstance && widgetInstance.resizeMap) {
                widgetInstance.resizeMap();
            }
        }
    }
    
    setWidgetMode(widget, mode) {
        widget.dataset.mode = mode;
        this.updateWidgetInteractions(widget);
    }
    
    setAllWidgetsMode(mode) {
        document.querySelectorAll('.widget').forEach(widget => {
            this.setWidgetMode(widget, mode);
        });
    }
    
    updateWidgetInteractions(widget) {
        const isEditMode = widget.dataset.mode === this.MODES.EDIT;
        
        // Toggle visual indicators
        widget.classList.toggle('edit-mode', isEditMode);
        widget.classList.toggle('view-mode', !isEditMode);
        
        // Enable/disable handles
        const handles = widget.querySelectorAll('.resize-handle');
        handles.forEach(handle => {
            handle.style.pointerEvents = isEditMode ? 'auto' : 'none';
        });
    }
    
    addDragFunctionality(widget, dragHandle) {
        let isDragging = false;
        let startCoords, startCell, endCell, preview;
        
        dragHandle.addEventListener('mousedown', (e) => {
            if (widget.dataset.mode !== this.MODES.EDIT) return;
            
            // Select widget first
            this.selectWidget(widget);
            
            isDragging = true;
            startCoords = { x: e.clientX, y: e.clientY };
            startCell = widget.dataset.startCell;
            endCell = widget.dataset.endCell;
            
            // Create drag preview
            preview = this.dashboard.createPreview();
            
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        });
        
        const handleDrag = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startCoords.x;
            const deltaY = e.clientY - startCoords.y;
            
            // Calculate cell dimensions
            const { cellWidth, cellHeight } = this.dashboard.getCellDimensions();
            
            // Convert pixel movement to grid cells
            const deltaCols = Math.round(deltaX / (cellWidth + this.dashboard.gap));
            const deltaRows = Math.round(deltaY / (cellHeight + this.dashboard.gap));
            
            // Calculate new start position
            const startCellCoords = WidgetCore.parseCellId(startCell);
            const endCellCoords = WidgetCore.parseCellId(endCell);
            
            let newStartCol = startCellCoords.col + deltaCols;
            let newStartRow = startCellCoords.row + deltaRows;
            
            // Calculate widget size
            const widgetWidth = endCellCoords.col - startCellCoords.col + 1;
            const widgetHeight = endCellCoords.row - startCellCoords.row + 1;
            
            // Calculate new end position
            let newEndCol = newStartCol + widgetWidth - 1;
            let newEndRow = newStartRow + widgetHeight - 1;
            
            // Constrain to grid bounds
            newStartCol = Math.max(1, Math.min(this.dashboard.columns - widgetWidth + 1, newStartCol));
            newStartRow = Math.max(1, Math.min(this.dashboard.rows - widgetHeight + 1, newStartRow));
            newEndCol = newStartCol + widgetWidth - 1;
            newEndRow = newStartRow + widgetHeight - 1;
            
            const newStartCell = `${newStartRow}${this.dashboard.getColumnLetter(newStartCol)}`;
            const newEndCell = `${newEndRow}${this.dashboard.getColumnLetter(newEndCol)}`;
            
            // Show drag preview
            this.dashboard.positionWidget(preview, newStartCell, newEndCell);
            preview.classList.add('show');
        };
        
        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', stopDrag);
            
            // Get final preview position and apply to widget
            if (preview) {
                const finalStartCell = preview.dataset.startCell;
                const finalEndCell = preview.dataset.endCell;
                
                // Hide preview first
                preview.classList.remove('show');
                
                // Apply new position to widget
                widget.dataset.startCell = finalStartCell;
                widget.dataset.endCell = finalEndCell;
                this.dashboard.positionWidget(widget, finalStartCell, finalEndCell);
                WidgetCore.updateDebugInfo(widget);
                
                // Resize map if it's a map widget
                const widgetInstance = this.widgets.get(widget.id);
                if (widgetInstance && widgetInstance.resizeMap) {
                    widgetInstance.resizeMap();
                }
                
                // Update toolbar
                this.updateWidgetControls(widget);
                
                // Remove preview after transition
                setTimeout(() => {
                    if (preview) preview.remove();
                }, 100);
            }
        };
    }
    
    addResizeFunctionality(widget, rightHandle, bottomHandle, cornerHandle) {
        let isResizing = false;
        let startCoords, startCell, endCell, preview;
        
        const startResize = (e) => {
            if (widget.dataset.mode !== this.MODES.EDIT) return;
            
            isResizing = true;
            startCoords = { x: e.clientX, y: e.clientY };
            startCell = widget.dataset.startCell;
            endCell = widget.dataset.endCell;
            
            // Create preview element
            preview = this.dashboard.createPreview();
            
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault();
        };
        
        const handleResize = (e) => {
            if (!isResizing) return;
            
            const deltaX = e.clientX - startCoords.x;
            const deltaY = e.clientY - startCoords.y;
            
            // Calculate cell dimensions
            const { cellWidth, cellHeight } = this.dashboard.getCellDimensions();
            
            // Convert pixel movement to grid cells
            const deltaCols = Math.round(deltaX / (cellWidth + this.dashboard.gap));
            const deltaRows = Math.round(deltaY / (cellHeight + this.dashboard.gap));
            
            // Update end cell based on direction
            const endCoords = WidgetCore.parseCellId(endCell);
            let newEndCol = endCoords.col + deltaCols;
            let newEndRow = endCoords.row + deltaRows;
            
            // Constrain to grid bounds
            newEndCol = Math.max(1, Math.min(this.dashboard.columns, newEndCol));
            newEndRow = Math.max(1, Math.min(this.dashboard.rows, newEndRow));
            
            const newEndCell = `${newEndRow}${this.dashboard.getColumnLetter(newEndCol)}`;
            
            // Show preview
            this.dashboard.positionWidget(preview, startCell, newEndCell);
            preview.classList.add('show');
        };
        
        const stopResize = () => {
            isResizing = false;
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResize);
            
            // Get final preview position and apply to widget
            if (preview) {
                const finalEndCell = preview.dataset.endCell;
                
                // Hide preview first
                preview.classList.remove('show');
                
                // Apply new position to widget
                widget.dataset.endCell = finalEndCell;
                this.dashboard.positionWidget(widget, startCell, finalEndCell);
                WidgetCore.updateDebugInfo(widget);
                
                // Resize map if it's a map widget
                const widgetInstance = this.widgets.get(widget.id);
                if (widgetInstance && widgetInstance.resizeMap) {
                    widgetInstance.resizeMap();
                }
                
                // Update toolbar
                this.updateWidgetControls(widget);
                
                // Remove preview after transition
                setTimeout(() => {
                    if (preview) preview.remove();
                }, 100);
            }
        };
        
        // Add event listeners
        rightHandle.addEventListener('mousedown', (e) => startResize(e));
        bottomHandle.addEventListener('mousedown', (e) => startResize(e));
        cornerHandle.addEventListener('mousedown', (e) => startResize(e));
    }
    
    addWidgetControlHeader(widget) {
        // Create the header container
        const header = document.createElement('div');
        header.className = 'widget-hover-header';
        
        // Create move button
        const moveBtn = document.createElement('div');
        moveBtn.className = 'widget-control-btn move-btn';
        moveBtn.innerHTML = '<i data-lucide="move"></i>';
        
        // Add drag functionality to move button
        this.addDragFunctionality(widget, moveBtn);
        
        // Create config button
        const configBtn = document.createElement('div');
        configBtn.className = 'widget-control-btn config-btn';
        configBtn.innerHTML = '<i data-lucide="settings"></i>';
        configBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dashboard.configPanel.openConfigPanel(widget);
        });
        
        // Create duplicate button
        const duplicateBtn = document.createElement('div');
        duplicateBtn.className = 'widget-control-btn duplicate-btn';
        duplicateBtn.innerHTML = '<i data-lucide="copy"></i>';
        duplicateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.duplicateWidget(widget.id);
        });
        
        // Create delete button
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'widget-control-btn delete-btn';
        deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteWidget(widget.id);
        });
        
        // Add all buttons to header
        header.appendChild(moveBtn);
        header.appendChild(configBtn);
        header.appendChild(duplicateBtn);
        header.appendChild(deleteBtn);
        
        // Add header to widget
        widget.appendChild(header);
    }
    
    duplicateWidget(widgetId) {
        const originalWidget = this.widgets.get(widgetId);
        if (!originalWidget) return;
        
        // Extract configuration from original widget
        const config = this.extractWidgetConfig(originalWidget);
        
        // Find available position for duplicated widget
        const availablePosition = this.findAvailablePosition();
        if (!availablePosition) {
            alert('No available space for duplicated widget');
            return;
        }
        
        // Update config with new position
        config.startCell = availablePosition.start;
        config.endCell = availablePosition.end;
        
        // Create new widget with copied configuration
        const newWidgetId = this.createWidget(originalWidget.type, config);
        
        // Select the new widget
        if (newWidgetId) {
            const newWidget = this.widgetsOverlay.querySelector(`#${newWidgetId}`);
            if (newWidget) {
                this.selectWidget(newWidget);
            }
        }
    }
    
    deleteWidget(widgetId) {
        const widget = this.widgetsOverlay.querySelector(`#${widgetId}`);
        if (!widget) return;
        
        // Remove from DOM
        widget.remove();
        
        // Remove from widgets map
        this.widgets.delete(widgetId);
        
        // Deselect if this was the selected widget
        if (this.dashboard.selectedWidget === widgetId) {
            this.dashboard.selectedWidget = null;
            this.hideWidgetControls();
        }
        
        // Close config panel if it was open for this widget
        const configPanel = document.getElementById('configPanel');
        if (configPanel && configPanel.classList.contains('open')) {
            this.dashboard.configPanel.closeConfigPanel();
        }
    }
    
    extractWidgetConfig(widgetInstance) {
        const config = {
            startCell: widgetInstance.startCell,
            endCell: widgetInstance.endCell,
            type: widgetInstance.type
        };
        
        // Extract widget-specific configuration
        if (widgetInstance.type === 'sunburst') {
            config.dataSource = widgetInstance.dataSource;
            config.animationsEnabled = widgetInstance.animationsEnabled;
            // Add other sunburst-specific config as needed
        } else if (widgetInstance.type === 'custom') {
            config.customConfig = widgetInstance.customConfig;
            config.title = widgetInstance.customConfig.title;
            config.description = widgetInstance.customConfig.description;
            config.html = widgetInstance.customConfig.html;
            config.css = widgetInstance.customConfig.css;
            config.js = widgetInstance.customConfig.js;
            config.settings = widgetInstance.customConfig.settings;
            config.layout = widgetInstance.customConfig.layout;
            config.interactions = widgetInstance.customConfig.interactions;
        }
        
        // Add other widget types' specific config here
        // if (widgetInstance.type === 'map') { ... }
        // if (widgetInstance.type === 'chart') { ... }
        
        return config;
    }
}

export { WidgetManager };
