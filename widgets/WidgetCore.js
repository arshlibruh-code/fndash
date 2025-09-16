// Base widget functionality and widget type definitions
export class WidgetCore {
    constructor(type, config) {
        this.type = type;
        this.startCell = config.startCell;
        this.endCell = config.endCell;
        this.element = null;
    }
    
    createElement() {
        const element = document.createElement('div');
        element.className = `widget ${this.type}-widget`;
        element.dataset.startCell = this.startCell;
        element.dataset.endCell = this.endCell;
        element.dataset.mode = 'edit';
        return element;
    }
    
    addDebugBox(element) {
        const debugBox = document.createElement('div');
        debugBox.className = 'widget-debug';
        element.appendChild(debugBox);
        this.updateDebugInfo(element);
    }
    
    updateDebugInfo(element) {
        const debugBox = element.querySelector('.widget-debug');
        if (!debugBox) return;
        
        const startCell = element.dataset.startCell;
        const endCell = element.dataset.endCell;
        
        // Calculate grid cells consumed
        const startCoords = WidgetCore.parseCellId(startCell);
        const endCoords = WidgetCore.parseCellId(endCell);
        const cellsConsumed = (endCoords.row - startCoords.row + 1) * (endCoords.col - startCoords.col + 1);
        
        debugBox.textContent = `${startCell}\n${endCell}\n${cellsConsumed} cells`;
    }
    
    static parseCellId(cellId) {
        const match = cellId.match(/^(\d+)([A-Z]+)$/);
        if (!match) throw new Error(`Invalid cell ID: ${cellId}`);
        
        const row = parseInt(match[1]);
        const colLetter = match[2];
        const col = colLetter.charCodeAt(0) - 64; // A=1, B=2, etc.
        
        return { row, col };
    }
    
    static updateDebugInfo(element) {
        const debugBox = element.querySelector('.widget-debug');
        if (!debugBox) return;
        
        const startCell = element.dataset.startCell;
        const endCell = element.dataset.endCell;
        
        // Calculate grid cells consumed
        const startCoords = WidgetCore.parseCellId(startCell);
        const endCoords = WidgetCore.parseCellId(endCell);
        const cellsConsumed = (endCoords.row - startCoords.row + 1) * (endCoords.col - startCoords.col + 1);
        
        debugBox.textContent = `${startCell}\n${endCell}\n${cellsConsumed} cells`;
    }
    
    getControls() {
        // Override in specific widget classes
        return '';
    }
}

// Widget type definitions
export const WIDGET_TYPES = {
    map: {
        name: 'Map',
        defaultStart: '3F',
        defaultEnd: '7H',
        class: 'MapWidget'
    },
    chart: {
        name: 'Chart',
        defaultStart: '1A',
        defaultEnd: '4D',
        class: 'ChartWidget'
    }
};
