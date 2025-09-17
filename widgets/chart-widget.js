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
                        <span class="info-value">${this.getDisplayName()}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Position:</span>
                        <span class="info-value">${this.element?.dataset.startCell || 'Unknown'} → ${this.element?.dataset.endCell || 'Unknown'}</span>
                    </div>
                </div>
            </div>
            
            <div class="config-group">
                <div class="config-group-title">Chart Settings</div>
                <label class="config-label">Chart Category</label>
                <select class="config-select chart-category-dropdown" id="chartCategory">
                    <option value="time-series">Time Series & Trends</option>
                    <option value="comparisons">Comparisons & Rankings</option>
                    <option value="proportions">Proportions & Distributions</option>
                    <option value="performance">Performance & KPIs</option>
                    <option value="data-density">Data Density & Patterns</option>
                    <option value="statistical">Statistical & Advanced</option>
                    <option value="geographic">Geographic & Spatial</option>
                    <option value="network">Network & Relationships</option>
                    <option value="financial">Financial & Trading</option>
                    <option value="scientific">Scientific & Technical</option>
                    <option value="interactive">Interactive & Dynamic</option>
                    <option value="specialized">Specialized & Creative</option>
                </select>
                
                <div class="chart-options-grid" id="chartOptionsGrid">
                    <!-- Time Series & Trends -->
                    <div class="chart-options-category" data-category="time-series">
                        <div class="chart-option enabled" data-chart="line">Line Charts</div>
                        <div class="chart-option disabled" data-chart="area">Area Charts</div>
                        <div class="chart-option disabled" data-chart="candlestick">Candlestick Charts</div>
                        <div class="chart-option disabled" data-chart="spline">Spline Charts</div>
                        <div class="chart-option disabled" data-chart="step">Step Charts</div>
                        <div class="chart-option disabled" data-chart="multi-line">Multi-line Charts</div>
                        <div class="chart-option disabled" data-chart="stacked-area">Stacked Area Charts</div>
                        <div class="chart-option disabled" data-chart="stream">Stream Charts</div>
                        <div class="chart-option disabled" data-chart="timeline">Timeline Charts</div>
                    </div>
                    
                    <!-- Comparisons & Rankings -->
                    <div class="chart-options-category" data-category="comparisons" style="display: none;">
                        <div class="chart-option enabled" data-chart="bar">Bar Charts</div>
                        <div class="chart-option disabled" data-chart="horizontal-bar">Horizontal Bar Charts</div>
                        <div class="chart-option disabled" data-chart="column">Column Charts</div>
                        <div class="chart-option disabled" data-chart="grouped-bar">Grouped Bar Charts</div>
                        <div class="chart-option disabled" data-chart="stacked-bar">Stacked Bar Charts</div>
                        <div class="chart-option disabled" data-chart="waterfall">Waterfall Charts</div>
                        <div class="chart-option disabled" data-chart="lollipop">Lollipop Charts</div>
                        <div class="chart-option disabled" data-chart="dot">Dot Charts</div>
                        <div class="chart-option disabled" data-chart="radar">Radar Charts</div>
                        <div class="chart-option disabled" data-chart="polar">Polar Charts</div>
                    </div>
                    
                    <!-- Proportions & Distributions -->
                    <div class="chart-options-category" data-category="proportions" style="display: none;">
                        <div class="chart-option enabled" data-chart="pie">Pie Charts</div>
                        <div class="chart-option disabled" data-chart="doughnut">Doughnut Charts</div>
                        <div class="chart-option disabled" data-chart="treemap">Treemap Charts</div>
                        <div class="chart-option disabled" data-chart="sunburst">Sunburst Charts</div>
                        <div class="chart-option disabled" data-chart="sankey">Sankey Diagrams</div>
                        <div class="chart-option disabled" data-chart="venn">Venn Diagrams</div>
                        <div class="chart-option disabled" data-chart="waffle">Waffle Charts</div>
                        <div class="chart-option disabled" data-chart="pictogram">Pictogram Charts</div>
                        <div class="chart-option disabled" data-chart="marimekko">Marimekko Charts</div>
                    </div>
                    
                    <!-- Performance & KPIs -->
                    <div class="chart-options-category" data-category="performance" style="display: none;">
                        <div class="chart-option disabled" data-chart="gauge">Gauge Charts</div>
                        <div class="chart-option disabled" data-chart="radial-progress">Radial Progress</div>
                        <div class="chart-option disabled" data-chart="speedometer">Speedometer Charts</div>
                        <div class="chart-option disabled" data-chart="bullet">Bullet Charts</div>
                        <div class="chart-option disabled" data-chart="progress-bars">Progress Bars</div>
                        <div class="chart-option disabled" data-chart="kpi-cards">KPI Cards</div>
                        <div class="chart-option disabled" data-chart="sparklines">Sparklines</div>
                        <div class="chart-option disabled" data-chart="thermometer">Thermometer Charts</div>
                        <div class="chart-option disabled" data-chart="traffic-light">Traffic Light Charts</div>
                    </div>
                    
                    <!-- Data Density & Patterns -->
                    <div class="chart-options-category" data-category="data-density" style="display: none;">
                        <div class="chart-option disabled" data-chart="heatmap">Heatmaps</div>
                        <div class="chart-option disabled" data-chart="scatter">Scatter Plots</div>
                        <div class="chart-option disabled" data-chart="bubble">Bubble Charts</div>
                        <div class="chart-option disabled" data-chart="density">Density Plots</div>
                        <div class="chart-option disabled" data-chart="contour">Contour Plots</div>
                        <div class="chart-option disabled" data-chart="hexbin">Hexbin Plots</div>
                        <div class="chart-option disabled" data-chart="violin">Violin Plots</div>
                        <div class="chart-option disabled" data-chart="ridge">Ridge Plots</div>
                        <div class="chart-option disabled" data-chart="correlation">Correlation Matrices</div>
                    </div>
                    
                    <!-- Statistical & Advanced -->
                    <div class="chart-options-category" data-category="statistical" style="display: none;">
                        <div class="chart-option disabled" data-chart="box">Box Plots</div>
                        <div class="chart-option disabled" data-chart="histogram">Histogram</div>
                        <div class="chart-option disabled" data-chart="funnel">Funnel Charts</div>
                        <div class="chart-option disabled" data-chart="qq">Q-Q Plots</div>
                        <div class="chart-option disabled" data-chart="pareto">Pareto Charts</div>
                        <div class="chart-option disabled" data-chart="control">Control Charts</div>
                        <div class="chart-option disabled" data-chart="run">Run Charts</div>
                        <div class="chart-option disabled" data-chart="candlestick-volume">Candlestick with Volume</div>
                        <div class="chart-option disabled" data-chart="renko">Renko Charts</div>
                    </div>
                    
                    <!-- Geographic & Spatial -->
                    <div class="chart-options-category" data-category="geographic" style="display: none;">
                        <div class="chart-option disabled" data-chart="choropleth">Choropleth Maps</div>
                        <div class="chart-option disabled" data-chart="bubble-map">Bubble Maps</div>
                        <div class="chart-option disabled" data-chart="flow-map">Flow Maps</div>
                        <div class="chart-option disabled" data-chart="cartogram">Cartograms</div>
                        <div class="chart-option disabled" data-chart="heat-map">Heat Maps</div>
                        <div class="chart-option disabled" data-chart="proportional">Proportional Symbols</div>
                    </div>
                    
                    <!-- Network & Relationships -->
                    <div class="chart-options-category" data-category="network" style="display: none;">
                        <div class="chart-option disabled" data-chart="node-link">Node-Link Diagrams</div>
                        <div class="chart-option disabled" data-chart="force-directed">Force-Directed Graphs</div>
                        <div class="chart-option disabled" data-chart="chord">Chord Diagrams</div>
                        <div class="chart-option disabled" data-chart="arc">Arc Diagrams</div>
                        <div class="chart-option disabled" data-chart="matrix">Matrix Diagrams</div>
                        <div class="chart-option disabled" data-chart="tree">Tree Diagrams</div>
                    </div>
                    
                    <!-- Financial & Trading -->
                    <div class="chart-options-category" data-category="financial" style="display: none;">
                        <div class="chart-option disabled" data-chart="ohlc">OHLC Charts</div>
                        <div class="chart-option disabled" data-chart="volume">Volume Charts</div>
                        <div class="chart-option disabled" data-chart="renko-financial">Renko Charts</div>
                        <div class="chart-option disabled" data-chart="point-figure">Point & Figure</div>
                        <div class="chart-option disabled" data-chart="kagi">Kagi Charts</div>
                        <div class="chart-option disabled" data-chart="equivolume">Equivolume Charts</div>
                    </div>
                    
                    <!-- Scientific & Technical -->
                    <div class="chart-options-category" data-category="scientific" style="display: none;">
                        <div class="chart-option disabled" data-chart="spectrogram">Spectrograms</div>
                        <div class="chart-option disabled" data-chart="contour-map">Contour Maps</div>
                        <div class="chart-option disabled" data-chart="vector-field">Vector Fields</div>
                        <div class="chart-option disabled" data-chart="phase">Phase Diagrams</div>
                        <div class="chart-option disabled" data-chart="pareto-scientific">Pareto Charts</div>
                        <div class="chart-option disabled" data-chart="control-scientific">Control Charts</div>
                    </div>
                    
                    <!-- Interactive & Dynamic -->
                    <div class="chart-options-category" data-category="interactive" style="display: none;">
                        <div class="chart-option disabled" data-chart="animated">Animated Charts</div>
                        <div class="chart-option disabled" data-chart="drill-down">Drill-down Charts</div>
                        <div class="chart-option disabled" data-chart="crossfilter">Crossfilter Charts</div>
                        <div class="chart-option disabled" data-chart="brush">Brush Charts</div>
                        <div class="chart-option disabled" data-chart="zoom">Zoom Charts</div>
                        <div class="chart-option disabled" data-chart="pan">Pan Charts</div>
                    </div>
                    
                    <!-- Specialized & Creative -->
                    <div class="chart-options-category" data-category="specialized" style="display: none;">
                        <div class="chart-option disabled" data-chart="word-cloud">Word Clouds</div>
                        <div class="chart-option disabled" data-chart="sankey-specialized">Sankey Diagrams</div>
                        <div class="chart-option disabled" data-chart="alluvial">Alluvial Diagrams</div>
                        <div class="chart-option disabled" data-chart="circular-packing">Circular Packing</div>
                        <div class="chart-option disabled" data-chart="icicle">Icicle Charts</div>
                        <div class="chart-option disabled" data-chart="mosaic">Mosaic Plots</div>
                    </div>
                </div>
                
                <small style="color: rgba(255,255,255,0.6); font-size: 10px;">
                    Select a category to see available chart types. Currently working: Line, Bar, Pie charts.
                </small>
            </div>
        `;
    }
    
    setupConfigListeners() {
        // Handle category dropdown change
        const categoryDropdown = document.getElementById('chartCategory');
        if (categoryDropdown) {
            categoryDropdown.addEventListener('change', (e) => {
                this.switchChartCategory(e.target.value);
            });
        }
        
        // Handle chart option selection
        const chartOptions = document.querySelectorAll('.chart-option');
        chartOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                if (!e.target.classList.contains('disabled')) {
                    this.selectChartOption(e.target);
                }
            });
        });
    }
    
    switchChartCategory(category) {
        // Hide all category sections
        const allCategories = document.querySelectorAll('.chart-options-category');
        allCategories.forEach(cat => {
            cat.style.display = 'none';
        });
        
        // Show selected category
        const selectedCategory = document.querySelector(`[data-category="${category}"]`);
        if (selectedCategory) {
            selectedCategory.style.display = 'grid';
        }
    }
    
    selectChartOption(option) {
        // Remove selection from all options
        const allOptions = document.querySelectorAll('.chart-option');
        allOptions.forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection to clicked option
        option.classList.add('selected');
        
        // Update chart type (placeholder for now)
        const chartType = option.dataset.chart;
        console.log('Selected chart type:', chartType);
        
        // TODO: Future implementation - Each chart type will have specific configuration parameters
        // Examples:
        // - Treemap: data source, color scheme, size mapping, label settings
        // - Line Chart: data series, axis settings, line styles, markers
        // - Heatmap: data matrix, color scale, cell size, labels
        // - Gauge: min/max values, thresholds, needle style, arc settings
        // - Scatter Plot: x/y data, point size, color mapping, trend lines
        // This will require dynamic config panel generation based on selected chart type
        this.updateChartConfigPanel(chartType);
    }
    
    updateChartConfigPanel(chartType) {
        // TODO: Future implementation - Dynamic configuration panel based on chart type
        // This method will:
        // 1. Clear existing chart-specific config sections
        // 2. Generate appropriate config fields for the selected chart type
        // 3. Add event listeners for chart-specific parameters
        // 4. Update the chart visualization with new parameters
        // 5. Handle data source configuration (static, API, real-time)
        // 6. Manage chart styling options (colors, fonts, animations)
        // 7. Configure chart interactions (zoom, pan, tooltips, legends)
        
        console.log('Chart config panel will be updated for:', chartType);
    }
}
