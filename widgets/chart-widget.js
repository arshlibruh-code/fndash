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
}
