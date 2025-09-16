class GridTest {
    constructor() {
        this.grid = document.getElementById('grid');
        this.widgetsOverlay = document.getElementById('widgetsOverlay');
        
        // Default widget coordinates
        this.DEFAULT_START_CELL = '3F';
        this.DEFAULT_END_CELL = '7H';
        
        this.config = {
            columns: { min: 1, max: 12, default: 12 },
            rows: { min: 1, max: 12, default: 8 },
            gap: { min: 0, max: 100, default: 10 },
            radius: { min: 0, max: 1000, default: 4 },
            padding: { min: 0, max: 1000, default: 10 }
        };
        
        // Initialize values
        Object.keys(this.config).forEach(key => {
            this[key] = this.config[key].default;
        });
        
        // Grid visibility state
        this.gridVisible = true;
        
        // Mode constants and state
        this.MODES = {
            EDIT: 'edit',
            VIEW: 'view'
        };
        this.gridMode = true;
        
        this.setupControls();
        this.setupKeyboardShortcuts();
        this.updateGrid(); // Apply initial values to CSS
    }
    
    setupControls() {
        Object.keys(this.config).forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', (e) => this.handleInput(e, id));
            input.addEventListener('keydown', (e) => this.handleArrowKeys(e, id));
        });
        
        // Map coordinate controls
        document.getElementById('mapStart').addEventListener('input', (e) => this.handleMapInput(e, 'start'));
        document.getElementById('mapEnd').addEventListener('input', (e) => this.handleMapInput(e, 'end'));
    }
    
    handleInput(e, id) {
        const value = parseInt(e.target.value) || this.config[id].min;
        this[id] = Math.max(this.config[id].min, Math.min(this.config[id].max, value));
        e.target.value = this[id];
        this.updateGrid();
    }
    
    handleArrowKeys(e, id) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const increment = e.shiftKey ? 10 : 1;
            const direction = e.key === 'ArrowUp' ? 1 : -1;
            this[id] = Math.max(this.config[id].min, Math.min(this.config[id].max, this[id] + (increment * direction)));
            e.target.value = this[id];
            this.updateGrid();
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Shift+G to toggle grid visibility (works in both modes)
            if (e.shiftKey && e.key === 'G') {
                e.preventDefault();
                this.toggleGridVisibility();
                return;
            }
            
            if (!this.gridMode) return; // Guard clause for grid mode
            
            if (e.metaKey && e.shiftKey) {
                const adjustments = {
                    'ArrowLeft': () => this.adjustValue('columns', -1),
                    'ArrowRight': () => this.adjustValue('columns', 1),
                    'ArrowUp': () => this.adjustValue('rows', -1),
                    'ArrowDown': () => this.adjustValue('rows', 1)
                };
                
                if (adjustments[e.key]) {
                    e.preventDefault();
                    adjustments[e.key]();
                }
            }
            
            // ESC key to deselect
            if (e.key === 'Escape') {
                this.deselectAllWidgets();
            }
        });
        
        // Click outside to deselect
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.widget') && !e.target.closest('.controls')) {
                this.deselectAllWidgets();
            }
        });
    }
    
    adjustValue(id, delta) {
        this[id] = Math.max(this.config[id].min, Math.min(this.config[id].max, this[id] + delta));
        document.getElementById(id).value = this[id];
        this.updateGrid();
    }
    
    handleMapInput(e, type) {
        const value = e.target.value.toUpperCase();
        const mapWidget = this.widgetsOverlay.querySelector('#map');
        
        if (!mapWidget) return;
        
        // Validate the input format (e.g., "3F", "7H")
        if (this.isValidCellId(value)) {
            if (type === 'start') {
                mapWidget.dataset.startCell = value;
            } else {
                mapWidget.dataset.endCell = value;
            }
            
            // Update widget position
            const startCell = mapWidget.dataset.startCell;
            const endCell = mapWidget.dataset.endCell;
            this.positionWidget(mapWidget, startCell, endCell);
            this.updateDebugInfo(mapWidget);
        }
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
        // Store current widget position before recreating
        const existingMap = this.widgetsOverlay.querySelector('#map');
        let currentStartCell = this.DEFAULT_START_CELL;
        let currentEndCell = this.DEFAULT_END_CELL;
        
        if (existingMap) {
            currentStartCell = existingMap.dataset.startCell || this.DEFAULT_START_CELL;
            currentEndCell = existingMap.dataset.endCell || this.DEFAULT_END_CELL;
        }
        
        // Remove all grid items
        const gridItems = this.grid.querySelectorAll('.grid-item');
        gridItems.forEach(item => item.remove());
        
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
        
        // Add the map widget to overlay with preserved position
        this.addMapWidget(currentStartCell, currentEndCell);
    }
    
    addMapWidget(startCell = this.DEFAULT_START_CELL, endCell = this.DEFAULT_END_CELL) {
        // Remove existing map widget if it exists
        const existingMap = this.widgetsOverlay.querySelector('#map');
        if (existingMap) {
            existingMap.remove();
        }
        
        // Create map widget with specified coordinates
        const mapWidget = document.createElement('div');
        mapWidget.className = 'widget map-widget';
        mapWidget.id = 'map';
        mapWidget.textContent = 'MAP';
        mapWidget.style.borderRadius = `${this.radius}px`;
        mapWidget.dataset.mode = this.MODES.EDIT;
        
        // Add debug box
        this.addDebugBox(mapWidget);
        
        // Add resize handles
        this.addResizeHandles(mapWidget);
        
        // Add click handler for selection
        this.addSelectionHandler(mapWidget);
        
        // Calculate position based on provided grid coordinates
        this.positionWidget(mapWidget, startCell, endCell);
        
        this.widgetsOverlay.appendChild(mapWidget);
        
        // Initialize Lucide icons for the new widget
        lucide.createIcons();
    }
    
    addDebugBox(widget) {
        const debugBox = document.createElement('div');
        debugBox.className = 'widget-debug';
        widget.appendChild(debugBox);
        
        // Update debug info
        this.updateDebugInfo(widget);
    }
    
    updateDebugInfo(widget) {
        const debugBox = widget.querySelector('.widget-debug');
        if (!debugBox) return;
        
        const startCell = widget.dataset.startCell || this.DEFAULT_START_CELL;
        const endCell = widget.dataset.endCell || this.DEFAULT_END_CELL;
        
        // Calculate grid cells consumed
        const startCoords = this.parseCellId(startCell);
        const endCoords = this.parseCellId(endCell);
        const cellsConsumed = (endCoords.row - startCoords.row + 1) * (endCoords.col - startCoords.col + 1);
        
        debugBox.textContent = `${startCell}\n${endCell}\n${cellsConsumed} cells`;
    }
    
    positionWidget(widget, startCell, endCell) {
        const startCoords = this.parseCellId(startCell);
        const endCoords = this.parseCellId(endCell);
        
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
    }
    
    parseCellId(cellId) {
        const match = cellId.match(/^(\d+)([A-Z]+)$/);
        if (!match) throw new Error(`Invalid cell ID: ${cellId}`);
        
        const row = parseInt(match[1]);
        const colLetter = match[2];
        const col = colLetter.charCodeAt(0) - 64; // A=1, B=2, etc.
        
        return { row, col };
    }
    
    updateWidgetPositions() {
        // Update all widget positions when grid changes
        const mapWidget = this.widgetsOverlay.querySelector('#map');
        if (mapWidget) {
            const startCell = mapWidget.dataset.startCell || this.DEFAULT_START_CELL;
            const endCell = mapWidget.dataset.endCell || this.DEFAULT_END_CELL;
            this.positionWidget(mapWidget, startCell, endCell);
            this.updateDebugInfo(mapWidget);
        }
    }
    
    addResizeHandles(widget) {
        // Drag handle
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '<i data-lucide="move"></i>';
        widget.appendChild(dragHandle);
        
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
        
        // Add drag functionality
        this.addDragFunctionality(widget, dragHandle);
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
        document.getElementById('mapStart').value = widget.dataset.startCell;
        document.getElementById('mapEnd').value = widget.dataset.endCell;
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
        const handles = widget.querySelectorAll('.resize-handle, .drag-handle');
        handles.forEach(handle => {
            handle.style.pointerEvents = isEditMode ? 'auto' : 'none';
        });
    }
    
    toggleGridVisibility() {
        this.gridMode = !this.gridMode;
        
        if (this.gridMode) {
            // Enter grid mode
            this.grid.style.display = 'grid';
            document.querySelector('.controls').style.display = 'flex';
            this.setAllWidgetsMode(this.MODES.EDIT);
        } else {
            // Enter widget mode
            this.grid.style.display = 'none';
            document.querySelector('.controls').style.display = 'none';
            this.setAllWidgetsMode(this.MODES.VIEW);
            this.deselectAllWidgets();
        }
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
            preview = this.createPreview();
            
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        });
        
        const handleDrag = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startCoords.x;
            const deltaY = e.clientY - startCoords.y;
            
            // Calculate cell dimensions
            const { cellWidth, cellHeight } = this.getCellDimensions();
            
            // Convert pixel movement to grid cells
            const deltaCols = Math.round(deltaX / (cellWidth + this.gap));
            const deltaRows = Math.round(deltaY / (cellHeight + this.gap));
            
            // Calculate new start position
            const startCellCoords = this.parseCellId(startCell);
            const endCellCoords = this.parseCellId(endCell);
            
            let newStartCol = startCellCoords.col + deltaCols;
            let newStartRow = startCellCoords.row + deltaRows;
            
            // Calculate widget size
            const widgetWidth = endCellCoords.col - startCellCoords.col + 1;
            const widgetHeight = endCellCoords.row - startCellCoords.row + 1;
            
            // Calculate new end position
            let newEndCol = newStartCol + widgetWidth - 1;
            let newEndRow = newStartRow + widgetHeight - 1;
            
            // Constrain to grid bounds
            newStartCol = Math.max(1, Math.min(this.columns - widgetWidth + 1, newStartCol));
            newStartRow = Math.max(1, Math.min(this.rows - widgetHeight + 1, newStartRow));
            newEndCol = newStartCol + widgetWidth - 1;
            newEndRow = newStartRow + widgetHeight - 1;
            
            const newStartCell = `${newStartRow}${this.getColumnLetter(newStartCol)}`;
            const newEndCell = `${newEndRow}${this.getColumnLetter(newEndCol)}`;
            
            // Show drag preview
            this.positionWidget(preview, newStartCell, newEndCell);
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
                this.positionWidget(widget, finalStartCell, finalEndCell);
                this.updateDebugInfo(widget);
                
                // Update toolbar
                document.getElementById('mapStart').value = finalStartCell;
                document.getElementById('mapEnd').value = finalEndCell;
                
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
            preview = this.createPreview();
            
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault();
        };
        
        const handleResize = (e) => {
            if (!isResizing) return;
            
            const deltaX = e.clientX - startCoords.x;
            const deltaY = e.clientY - startCoords.y;
            
            // Calculate cell dimensions
            const { cellWidth, cellHeight } = this.getCellDimensions();
            
            // Convert pixel movement to grid cells
            const deltaCols = Math.round(deltaX / (cellWidth + this.gap));
            const deltaRows = Math.round(deltaY / (cellHeight + this.gap));
            
            // Update end cell based on direction
            const endCoords = this.parseCellId(endCell);
            let newEndCol = endCoords.col + deltaCols;
            let newEndRow = endCoords.row + deltaRows;
            
            // Constrain to grid bounds
            newEndCol = Math.max(1, Math.min(this.columns, newEndCol));
            newEndRow = Math.max(1, Math.min(this.rows, newEndRow));
            
            const newEndCell = `${newEndRow}${this.getColumnLetter(newEndCol)}`;
            
            // Show preview
            this.positionWidget(preview, startCell, newEndCell);
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
                this.positionWidget(widget, startCell, finalEndCell);
                this.updateDebugInfo(widget);
                
                // Update toolbar
                document.getElementById('mapEnd').value = finalEndCell;
                
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
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gridTest = new GridTest();
});
