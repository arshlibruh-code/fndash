import { WidgetCore } from './WidgetCore.js';

export class SunburstWidget extends WidgetCore {
    constructor(config) {
        super('sunburst', config);
        this.chart = null;
        this.dataSource = 'financial'; // Default data source
        this.animationsEnabled = true; // Track animation state
    }
    
    createElement() {
        const element = super.createElement();
        
        // Create chart container
        const chartContainer = document.createElement('div');
        chartContainer.id = 'sunburst-container';
        chartContainer.style.width = '100%';
        chartContainer.style.height = '100%';
        
        element.appendChild(chartContainer);
        
        // Initialize ECharts after a short delay to ensure element is rendered
        setTimeout(() => {
            this.initializeChart(chartContainer);
        }, 100);
        
        return element;
    }
    
    initializeChart(container) {
        // Check if ECharts is available
        if (typeof echarts === 'undefined') {
            console.error('ECharts library not loaded');
            return;
        }
        
        try {
            // Initialize ECharts
            this.chart = echarts.init(container, null, {
                renderer: 'canvas',
                useDirtyRect: false
            });
            
            // Set up the chart with financial data
            this.setupChart();
            
            // Add resize observer to handle widget resizing
            this.setupResizeObserver(container);
            
        } catch (error) {
            console.error('Error initializing sunburst chart:', error);
        }
    }
    
    getCurrentData() {
        switch (this.dataSource) {
            case 'company':
                return this.getCompanyData();
            case 'projects':
                return this.getProjectData();
            case 'sales':
                return this.getSalesData();
            default:
                return this.getFinancialData();
        }
    }
    
    getCurrentColors() {
        switch (this.dataSource) {
            case 'company':
                return ['#4A90E2', '#357ABD', '#2E5A8A', '#1E3A5F', '#0F1F3A'];
            case 'projects':
                return ['#7ED321', '#5BA317', '#3F7A0F', '#2B520A', '#1A3306'];
            case 'sales':
                return ['#FF6B6B', '#FF8E53', '#FF6B9D', '#C44569', '#F8B500'];
            default:
                return ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555'];
        }
    }
    
    getFinancialData() {
        const colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555'];
        return [
            {
                name: 'Stocks',
                itemStyle: { color: colors[1] },
                children: [
                    {
                        name: 'Tech',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'Apple' },
                                    { name: 'Microsoft' },
                                    { name: 'Google' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Amazon' },
                                    { name: 'Tesla' },
                                    { name: 'Netflix' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Meta' }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Finance',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'JPMorgan' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Bank of America' },
                                    { name: 'Wells Fargo' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Goldman Sachs' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Bonds',
                itemStyle: { color: colors[2] },
                children: [
                    {
                        name: 'Government',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: '10-Year Treasury' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: '30-Year Treasury' },
                                    { name: 'TIPS' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Municipal Bonds' }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Corporate',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'AAA Corporate' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'AA Corporate' },
                                    { name: 'A Corporate' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'BBB Corporate' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    }
    
    getCompanyData() {
        const colors = ['#4A90E2', '#357ABD', '#2E5A8A', '#1E3A5F', '#0F1F3A'];
        return [
            {
                name: 'Engineering',
                itemStyle: { color: colors[1] },
                children: [
                    {
                        name: 'Frontend',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'React Team' },
                                    { name: 'Vue Team' },
                                    { name: 'Angular Team' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Mobile Team' },
                                    { name: 'Design System' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Legacy Team' }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Backend',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'API Team' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Database Team' },
                                    { name: 'Infrastructure' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Legacy Backend' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Sales',
                itemStyle: { color: colors[2] },
                children: [
                    {
                        name: 'Enterprise',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'Enterprise Team' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Mid-Market Team' },
                                    { name: 'Government Team' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'SMB Team' }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Marketing',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'Digital Marketing' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Content Team' },
                                    { name: 'Events Team' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Traditional Marketing' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    }
    
    getProjectData() {
        const colors = ['#7ED321', '#5BA317', '#3F7A0F', '#2B520A', '#1A3306'];
        return [
            {
                name: 'Active',
                itemStyle: { color: colors[1] },
                children: [
                    {
                        name: 'High Priority',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'Mobile App Redesign' },
                                    { name: 'API Migration' },
                                    { name: 'Security Audit' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Dashboard Update' },
                                    { name: 'Performance Optimization' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Documentation Update' }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Medium Priority',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'Feature Enhancement' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Bug Fixes' },
                                    { name: 'UI Improvements' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Code Refactoring' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Planning',
                itemStyle: { color: colors[2] },
                children: [
                    {
                        name: 'Q1 2024',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'New Platform' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Integration Project' },
                                    { name: 'Analytics Upgrade' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Maintenance Tasks' }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Q2 2024',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'AI Integration' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Mobile Expansion' },
                                    { name: 'Cloud Migration' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Legacy Cleanup' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    }
    
    getSalesData() {
        const colors = ['#FF6B6B', '#FF8E53', '#FF6B9D', '#C44569', '#F8B500'];
        return [
            {
                name: 'Q1 2024',
                itemStyle: { color: colors[1] },
                children: [
                    {
                        name: 'Enterprise',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'Tech Corp Deal' },
                                    { name: 'Finance Corp Deal' },
                                    { name: 'Healthcare Corp Deal' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Manufacturing Deal' },
                                    { name: 'Retail Deal' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'SMB Deal' }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'SMB',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'Startup Deal' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Local Business Deal' },
                                    { name: 'Consulting Deal' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Small Retail Deal' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Q2 2024',
                itemStyle: { color: colors[2] },
                children: [
                    {
                        name: 'Enterprise',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'Global Corp Deal' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Energy Corp Deal' },
                                    { name: 'Media Corp Deal' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Government Deal' }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Consumer',
                        children: [
                            {
                                name: '5★',
                                children: [
                                    { name: 'Premium Consumer Deal' }
                                ]
                            },
                            {
                                name: '4★',
                                children: [
                                    { name: 'Standard Consumer Deal' },
                                    { name: 'Basic Consumer Deal' }
                                ]
                            },
                            {
                                name: '3★',
                                children: [
                                    { name: 'Trial Consumer Deal' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    }
    
    setupChart() {
        const bgColor = '#2E2733';
        
        // Get data based on current data source
        const data = this.getCurrentData();
        
        // Extract colors from the data (each data method defines its own colors)
        const colors = this.getCurrentColors();
        const itemStyle = {
            star5: {
                color: colors[0]
            },
            star4: {
                color: colors[1]
            },
            star3: {
                color: colors[2]
            },
            star2: {
                color: colors[3]
            }
        };
        
        // Process data for styling
        for (let j = 0; j < data.length; ++j) {
            let level1 = data[j].children;
            for (let i = 0; i < level1.length; ++i) {
                let block = level1[i].children;
                for (let star = 0; star < block.length; ++star) {
                    let style = (function (name) {
                        switch (name) {
                            case '5★':
                                return itemStyle.star5;
                            case '4★':
                                return itemStyle.star4;
                            case '3★':
                                return itemStyle.star3;
                            case '2★':
                                return itemStyle.star2;
                        }
                    })(block[star].name);
                    block[star].label = {
                        color: style.color,
                        downplay: {
                            opacity: 0.5
                        }
                    };
                    if (block[star].children) {
                        style = {
                            opacity: 1,
                            color: style.color
                        };
                        block[star].children.forEach(function (book) {
                            book.value = 1;
                            book.itemStyle = style;
                            book.label = {
                                color: style.color
                            };
                        });
                    }
                }
                level1[i].itemStyle = {
                    color: data[j].itemStyle.color
                };
            }
        }
        
        const option = {
            backgroundColor: bgColor,
            color: colors,
            series: [
                {
                    type: 'sunburst',
                    center: ['50%', '48%'],
                    data: data,
                    sort: function (a, b) {
                        if (a.depth === 1) {
                            return b.getValue() - a.getValue();
                        } else {
                            return a.dataIndex - b.dataIndex;
                        }
                    },
                    label: {
                        rotate: 'radial',
                        color: bgColor
                    },
                    itemStyle: {
                        borderColor: bgColor,
                        borderWidth: 2
                    },
                    levels: [
                        {},
                        {
                            r0: 0,
                            r: 40,
                            label: {
                                rotate: 0
                            }
                        },
                        {
                            r0: 40,
                            r: 105
                        },
                        {
                            r0: 115,
                            r: 140,
                            itemStyle: {
                                shadowBlur: 2,
                                shadowColor: colors[2],
                                color: 'transparent'
                            },
                            label: {
                                rotate: 'tangential',
                                fontSize: 10,
                                color: colors[0]
                            }
                        },
                        {
                            r0: 140,
                            r: 145,
                            itemStyle: {
                                shadowBlur: 80,
                                shadowColor: colors[0]
                            },
                            label: {
                                position: 'outside',
                                textShadowBlur: 5,
                                textShadowColor: '#333'
                            },
                            downplay: {
                                label: {
                                    opacity: 0.5
                                }
                            }
                        }
                    ]
                }
            ]
        };
        
        if (option && typeof option === 'object') {
            this.chart.setOption(option);
        }
    }
    
    setupResizeObserver(container) {
        // Create ResizeObserver to watch for widget size changes
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                // Resize the chart when the container size changes
                if (this.chart && this.chart.resize) {
                    this.chart.resize();
                }
            });
            
            // Observe the widget container (parent of chart container)
            const widgetElement = container.closest('.widget');
            if (widgetElement) {
                resizeObserver.observe(widgetElement);
            }
        }
        
        // Also listen for window resize events as fallback
        window.addEventListener('resize', () => {
            if (this.chart && this.chart.resize) {
                this.chart.resize();
            }
        });
    }
    
    
    getControls() {
        return `
            <div class="control-group widget-controls">
                <i data-lucide="move-up-left" class="icon"></i>
                <input type="text" id="widgetStart" placeholder="Start" maxlength="3">
            </div>
            <div class="control-group widget-controls">
                <i data-lucide="move-down-right" class="icon"></i>
                <input type="text" id="widgetEnd" placeholder="End" maxlength="3">
            </div>
        `;
    }
    
    // Set up configuration panel event listeners
    setupConfigListeners() {
        const colorSchemeSelect = document.getElementById('colorScheme');
        const backgroundColorInput = document.getElementById('backgroundColor');
        const enableAnimationsCheckbox = document.getElementById('enableAnimations');
        const dataSourceSelect = document.getElementById('dataSource');
        
        if (colorSchemeSelect) {
            colorSchemeSelect.addEventListener('change', (e) => {
                this.updateColorScheme(e.target.value);
            });
        }
        
        if (backgroundColorInput) {
            backgroundColorInput.addEventListener('input', (e) => {
                this.updateBackgroundColor(e.target.value);
            });
        }
        
        if (enableAnimationsCheckbox) {
            enableAnimationsCheckbox.addEventListener('change', (e) => {
                this.updateAnimationSettings(e.target.checked);
            });
        }
        
        if (dataSourceSelect) {
            dataSourceSelect.addEventListener('change', (e) => {
                this.updateDataSource(e.target.value);
            });
        }
    }
    
    // Configuration update methods
    updateColorScheme(scheme) {
        let colors;
        switch (scheme) {
            case 'blue':
                colors = ['#4A90E2', '#357ABD', '#2E5A8A', '#1E3A5F', '#0F1F3A'];
                break;
            case 'green':
                colors = ['#7ED321', '#5BA317', '#3F7A0F', '#2B520A', '#1A3306'];
                break;
            default:
                colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555'];
        }
        
        if (this.chart) {
            const option = this.chart.getOption();
            option.color = colors;
            this.chart.setOption(option);
        }
    }
    
    updateBackgroundColor(color) {
        if (this.chart) {
            const option = this.chart.getOption();
            option.backgroundColor = color;
            this.chart.setOption(option);
        }
    }
    
    updateAnimationSettings(enabled) {
        // Update our tracked state
        this.animationsEnabled = enabled;
        
        if (this.chart) {
            // Get current option and update animation setting at both levels
            const option = this.chart.getOption();
            option.animation = enabled;
            
            // Also set animation at series level for sunburst charts
            if (option.series && option.series[0]) {
                option.series[0].animation = enabled;
            }
            
            // Force a complete chart update to properly enable/disable animations
            this.chart.setOption(option, {
                notMerge: true,  // Don't merge, replace completely
                lazyUpdate: false,
                silent: false
            });
        }
    }
    
    updateDataSource(source) {
        this.dataSource = source;
        // Rebuild the entire chart with new data
        this.setupChart();
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
                <div class="config-group-title">Sunburst Chart Settings</div>
                <label class="config-label">Data Source</label>
                <select class="config-select" id="dataSource">
                    <option value="financial" ${this.dataSource === 'financial' ? 'selected' : ''}>Financial Portfolio</option>
                    <option value="company" ${this.dataSource === 'company' ? 'selected' : ''}>Company Structure</option>
                    <option value="projects" ${this.dataSource === 'projects' ? 'selected' : ''}>Project Portfolio</option>
                    <option value="sales" ${this.dataSource === 'sales' ? 'selected' : ''}>Sales Analytics</option>
                </select>
                
                <small style="color: rgba(255,255,255,0.6); font-size: 10px;">
                    Interactive sunburst chart showing hierarchical financial data
                </small>
            </div>
            
            <div class="config-group">
                <div class="config-group-title">Visual Settings</div>
                <label class="config-label">Color Scheme</label>
                <select class="config-select" id="colorScheme">
                    <option value="default" selected>Default (Orange-Purple)</option>
                    <option value="blue">Blue Theme</option>
                    <option value="green">Green Theme</option>
                </select>
                
                <label class="config-label">Background Color</label>
                <input type="color" class="config-input" id="backgroundColor" value="#2E2733" style="width: 100%; height: 40px; border: none; border-radius: 4px;">
                
                <label class="config-label">
                    <input type="checkbox" id="enableAnimations" ${this.animationsEnabled ? 'checked' : ''}> Enable Animations
                </label>
            </div>
        `;
    }
}
