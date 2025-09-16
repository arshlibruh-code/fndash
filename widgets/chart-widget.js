import { WidgetCore } from './WidgetCore.js';

export class ChartWidget extends WidgetCore {
    constructor(config) {
        super('chart', config);
    }
    
    createElement() {
        const element = super.createElement();
        element.innerHTML = '<canvas id="chart"></canvas>';
        element.style.borderRadius = '4px'; // Will be updated by grid system
        return element;
    }
    
    getControls() {
        return `
            <div class="control-group widget-controls">
                <i data-lucide="bar-chart" class="icon"></i>
                <select id="chartType">
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                </select>
            </div>
        `;
    }
    
    getConfigPanel() {
        return `
            <div class="config-group">
                <div class="config-group-title">Widget Info</div>
                <div class="widget-info">
                    <div class="info-item">
                        <span class="info-label">Widget ID:</span>
                        <span class="info-value">${this.element?.id || 'Unknown'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${this.type}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Position:</span>
                        <span class="info-value">${this.element?.dataset.startCell || 'Unknown'} → ${this.element?.dataset.endCell || 'Unknown'}</span>
                    </div>
                </div>
            </div>
            
            <div class="config-group">
                <div class="config-group-title">Chart Settings</div>
                <label class="config-label">Chart Type</label>
                <select class="config-select" id="chartType">
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                </select>
                
                <small style="color: rgba(255,255,255,0.6); font-size: 10px;">
                    This is a placeholder widget. Full chart functionality coming soon.
                </small>
            </div>
        `;
    }
    
    setupConfigListeners() {
        // Placeholder - will be implemented when chart functionality is added
    }
}
