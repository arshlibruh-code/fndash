/**
 * Config Panel management for the dashboard
 * Handles widget configuration panel creation, updates, and interactions
 */
class ConfigPanel {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.widgets = dashboard.widgets;
    }

    openConfigPanel(widget) {
        // Create config panel if it doesn't exist
        let configPanel = document.getElementById('configPanel');
        if (!configPanel) {
            configPanel = this.createConfigPanel();
        }
        
        // Store widget ID in panel for updates
        configPanel.dataset.widgetId = widget.id;
        
        // Update panel content for selected widget
        this.updateConfigPanelContent(widget);
        
        // Show panel
        configPanel.classList.add('open');
    }
    
    createConfigPanel() {
        const panel = document.createElement('div');
        panel.id = 'configPanel';
        panel.className = 'config-panel';
        
        panel.innerHTML = `
            <div class="config-panel-header">
                <div class="config-panel-title">Widget Configuration</div>
                <button class="config-panel-close" id="configPanelClose">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="config-panel-content" id="configPanelContent">
                <!-- Dynamic content will be inserted here -->
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add close handler
        document.getElementById('configPanelClose').addEventListener('click', () => {
            panel.classList.remove('open');
        });
        
        // Initialize Lucide icons
        lucide.createIcons();
        
        return panel;
    }
    
    updateConfigPanelContent(widget) {
        const content = document.getElementById('configPanelContent');
        const widgetType = widget.id;
        const widgetInstance = this.widgets.get(widgetType);
        
        if (widgetInstance && widgetInstance.getConfigPanel) {
            content.innerHTML = widgetInstance.getConfigPanel();
            // Initialize Lucide icons for new content
            lucide.createIcons();
            
            // Set up event listeners for config inputs
            this.setupConfigPanelListeners(widget, widgetInstance);
        } else {
            content.innerHTML = '<p>No configuration options available for this widget.</p>';
        }
    }
    
    setupConfigPanelListeners(widget, widgetInstance) {
        // Generic approach: let each widget handle its own config events
        if (widgetInstance.setupConfigListeners) {
            widgetInstance.setupConfigListeners();
        }
    }
    
    updateConfigPanelIfOpen(widget) {
        const configPanel = document.getElementById('configPanel');
        if (configPanel && configPanel.classList.contains('open') && 
            configPanel.dataset.widgetId === widget.id) {
            this.updateConfigPanelContent(widget);
        }
    }
}

export { ConfigPanel };
