/**
 * Map synchronization management for the dashboard
 */
class MapSyncManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.primaryMapLeader = null; // Track primary leader in primary-leader mode
        
        // Global sync state management
        this.globalSyncState = {
            enabled: false,
            mode: 'all-leaders',
            primaryLeader: null
        };
    }

    // Map sync management methods
    syncAllMaps(leaderMap, syncMode) {
        
        this.dashboard.widgets.forEach((widgetInstance, widgetId) => {
            // Check if this is a map widget and global sync is enabled
            if (widgetInstance.type === 'map' && 
                this.globalSyncState.enabled && 
                !widgetInstance.config.isLeader) {
                
                
                if (syncMode === 'all-leaders') {
                    // In all-leaders mode, sync all enabled maps
                    widgetInstance.syncWithLeader(leaderMap);
                } else if (syncMode === 'primary-leader') {
                    // In primary-leader mode, sync all enabled maps with the primary leader
                    widgetInstance.syncWithLeader(leaderMap);
                }
            }
        });
    }
    
    setMapLeader(leaderWidget) {
        // Stop all other maps from being leaders
        this.dashboard.widgets.forEach((widgetInstance, widgetId) => {
            if (widgetInstance.type === 'map' && widgetInstance !== leaderWidget) {
                widgetInstance.stopBeingLeader();
            }
        });
        
        // Make the clicked widget the leader
        leaderWidget.config.isLeader = true;
        
        // Update all config panels to show new leader status
        this.updateAllConfigPanels();
    }
    
    setPrimaryLeader(primaryWidget) {
        // Set the primary leader for primary-leader mode
        this.primaryMapLeader = primaryWidget;
        this.globalSyncState.primaryLeader = primaryWidget;
        primaryWidget.config.isPrimaryLeader = true;
        primaryWidget.config.isLeader = true;
        
        
        // Stop all other maps from being leaders
        this.dashboard.widgets.forEach((widgetInstance, widgetId) => {
            if (widgetInstance.type === 'map' && widgetInstance !== primaryWidget) {
                widgetInstance.stopBeingLeader();
                widgetInstance.config.isPrimaryLeader = false;
            }
        });
    }
    
    // Global sync state management methods
    updateGlobalSyncState(enabled, mode, sourceWidget) {
        
        // Update global state
        this.globalSyncState.enabled = enabled;
        this.globalSyncState.mode = mode;
        
        if (enabled && mode === 'primary-leader') {
            if (sourceWidget) {
                this.globalSyncState.primaryLeader = sourceWidget;
                this.setPrimaryLeader(sourceWidget);
            } else {
                // If no sourceWidget specified, set the first map as primary leader
                const firstMapWidget = Array.from(this.dashboard.widgets.values()).find(w => w.type === 'map');
                if (firstMapWidget) {
                    this.globalSyncState.primaryLeader = firstMapWidget;
                    this.setPrimaryLeader(firstMapWidget);
                }
            }
        } else if (!enabled) {
            this.globalSyncState.primaryLeader = null;
            this.primaryMapLeader = null;
        }
        
        // Update all map widgets
        this.dashboard.widgets.forEach((widgetInstance, widgetId) => {
            if (widgetInstance.type === 'map') {
                // Update widget's local config to match global state
                widgetInstance.config.syncEnabled = enabled;
                widgetInstance.config.syncMode = mode;
                
                // Update leader status
                if (enabled && mode === 'primary-leader') {
                    widgetInstance.config.isPrimaryLeader = (widgetInstance === sourceWidget);
                    widgetInstance.config.isLeader = (widgetInstance === sourceWidget);
                } else if (enabled && mode === 'all-leaders') {
                    widgetInstance.config.isPrimaryLeader = false;
                    // In all-leaders mode, the widget that enables sync becomes the initial leader
                    widgetInstance.config.isLeader = (widgetInstance === sourceWidget);
                } else {
                    widgetInstance.config.isPrimaryLeader = false;
                    widgetInstance.config.isLeader = false;
                }
            }
        });
        
        // Update all open config panels
        this.updateAllConfigPanels();
    }
    
    updateAllConfigPanels() {
        // Find all open config panels and update their content
        const configPanels = document.querySelectorAll('.config-panel');
        configPanels.forEach(panel => {
            // Find which widget this panel belongs to
            const widgetId = panel.dataset.widgetId;
            if (widgetId) {
                const widgetInstance = this.dashboard.widgets.get(widgetId);
                if (widgetInstance && widgetInstance.getConfigPanel) {
                    // Update the entire config panel content
                    const content = panel.querySelector('#configPanelContent');
                    if (content) {
                        content.innerHTML = widgetInstance.getConfigPanel();
                        lucide.createIcons();
                        // Re-setup event listeners
                        this.dashboard.configPanel.setupConfigPanelListeners(widgetInstance.element, widgetInstance);
                    }
                }
            }
        });
    }
}

export { MapSyncManager };
