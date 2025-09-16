import { WidgetCore } from './WidgetCore.js';

export class MapWidget extends WidgetCore {
    constructor(config) {
        super('map', config);
        this.config = {
            mapboxToken: window.CONFIG?.MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example',
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-74.5, 40],
            zoom: 9,
            pitch: 0,
            bearing: 0,
            syncEnabled: false,
            syncMode: 'all-leaders', // 'primary-leader' or 'all-leaders'
            isLeader: false,
            isPrimaryLeader: false
        };
    }
    
    createElement() {
        const element = super.createElement();
        
        // Create map container
        const mapContainer = document.createElement('div');
        mapContainer.id = 'mapbox-container';
        
        // Add map placeholder text (will be replaced by map)
        mapContainer.textContent = 'MAP';
        mapContainer.style.display = 'flex';
        mapContainer.style.alignItems = 'center';
        mapContainer.style.justifyContent = 'center';
        mapContainer.style.fontSize = '16px';
        mapContainer.style.fontWeight = 'bold';
        mapContainer.style.color = '#fff';
        
        element.appendChild(mapContainer);
        
        // Initialize Mapbox after a short delay to ensure element is rendered
        setTimeout(() => {
            this.initializeMapbox(mapContainer);
        }, 100);
        
        return element;
    }
    
    initializeMapbox(container) {
        // Check if Mapbox GL JS is available
        if (typeof mapboxgl === 'undefined') {
            return;
        }
        
        try {
            // Clear placeholder text
            container.textContent = '';
            container.style.display = 'block';
            
            // Set Mapbox access token
            mapboxgl.accessToken = this.config.mapboxToken;
            
            // Create map
            const map = new mapboxgl.Map({
                container: container,
                style: this.config.style,
                center: this.config.center,
                zoom: this.config.zoom,
                pitch: this.config.pitch,
                bearing: this.config.bearing
            });
            
            // Store map instance
            this.map = map;
            
            // Add resize observer to handle widget resizing
            this.setupResizeObserver(container, map);
            
            // Set up map sync functionality
            this.setupMapSync();
            
        } catch (error) {
            // Restore placeholder text on error
            container.textContent = 'MAP';
            container.style.display = 'flex';
        }
    }
    
    setupResizeObserver(container, map) {
        // Create ResizeObserver to watch for widget size changes
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                // Resize the map when the container size changes
                if (map && map.resize) {
                    map.resize();
                }
            });
            
            // Observe the widget container (parent of map container)
            const widgetElement = container.closest('.widget');
            if (widgetElement) {
                resizeObserver.observe(widgetElement);
            }
        }
        
        // Also listen for window resize events as fallback
        window.addEventListener('resize', () => {
            if (map && map.resize) {
                map.resize();
            }
        });
    }
    
    // Method to manually trigger map resize (called by grid system)
    resizeMap() {
        if (this.map && this.map.resize) {
            this.map.resize();
        }
    }
    
    // Map sync functionality
    setupMapSync() {
        if (!this.map) return;
        
        // Set up event listeners for real-time sync during dragging
        this.map.on('move', () => this.broadcastSync());
        this.map.on('zoom', () => this.broadcastSync());
        this.map.on('rotate', () => this.broadcastSync());
        this.map.on('pitch', () => this.broadcastSync());
        
        // Also keep the 'end' events for final sync
        this.map.on('moveend', () => this.broadcastSync());
        this.map.on('zoomend', () => this.broadcastSync());
        this.map.on('rotateend', () => this.broadcastSync());
        this.map.on('pitchend', () => this.broadcastSync());
        
        // Set up interaction handlers to become leader in all-leaders mode
        this.map.on('click', () => this.handleMapInteraction());
        this.map.on('mousedown', () => this.handleMapInteraction());
        this.map.on('touchstart', () => this.handleMapInteraction());
    }
    
    handleMapInteraction() {
        // Check global sync state instead of local config
        if (window.gridTest && window.gridTest.globalSyncState.enabled && 
            window.gridTest.globalSyncState.mode === 'all-leaders') {
            this.becomeLeader();
        }
    }
    
    becomeLeader() {
        this.config.isLeader = true;
        // Tell script.js to make this the leader
        if (window.gridTest) {
            window.gridTest.setMapLeader(this);
        }
    }
    
    stopBeingLeader() {
        this.config.isLeader = false;
    }
    
    broadcastSync() {
        if (window.gridTest && window.gridTest.globalSyncState.enabled && this.config.isLeader && this.map) {
            // Tell script.js to sync all other maps
            window.gridTest.syncAllMaps(this.map, window.gridTest.globalSyncState.mode);
        }
    }
    
    syncWithLeader(leaderMap) {
        if (this.map && window.gridTest && window.gridTest.globalSyncState.enabled && !this.config.isLeader) {
            // Sync navigation properties but keep individual style
            this.map.setCenter(leaderMap.getCenter());
            this.map.setZoom(leaderMap.getZoom());
            this.map.setBearing(leaderMap.getBearing());
            this.map.setPitch(leaderMap.getPitch());
        }
    }
    
    // Set up configuration panel event listeners
    setupConfigListeners() {
        const mapboxTokenInput = document.getElementById('mapboxToken');
        const mapStyleSelect = document.getElementById('mapStyle');
        const centerLngInput = document.getElementById('centerLng');
        const centerLatInput = document.getElementById('centerLat');
        const zoomInput = document.getElementById('zoom');
        const pitchInput = document.getElementById('pitch');
        const bearingInput = document.getElementById('bearing');
        
        if (mapboxTokenInput) {
            mapboxTokenInput.addEventListener('input', (e) => {
                this.updateMapboxToken(e.target.value);
            });
        }
        
        if (mapStyleSelect) {
            mapStyleSelect.addEventListener('change', (e) => {
                this.updateMapStyle(e.target.value);
            });
        }
        
        if (centerLngInput) {
            centerLngInput.addEventListener('input', (e) => {
                const lng = parseFloat(e.target.value);
                const lat = parseFloat(centerLatInput?.value || this.config.center[1]);
                if (!isNaN(lng)) {
                    this.updateMapCenter([lng, lat]);
                }
            });
        }
        
        if (centerLatInput) {
            centerLatInput.addEventListener('input', (e) => {
                const lat = parseFloat(e.target.value);
                const lng = parseFloat(centerLngInput?.value || this.config.center[0]);
                if (!isNaN(lat)) {
                    this.updateMapCenter([lng, lat]);
                }
            });
        }
        
        if (zoomInput) {
            zoomInput.addEventListener('input', (e) => {
                const zoom = parseFloat(e.target.value);
                if (!isNaN(zoom)) {
                    this.updateMapZoom(zoom);
                }
            });
        }
        
        if (pitchInput) {
            pitchInput.addEventListener('input', (e) => {
                const pitch = parseFloat(e.target.value);
                if (!isNaN(pitch)) {
                    this.updateMapPitch(pitch);
                }
            });
        }
        
        if (bearingInput) {
            bearingInput.addEventListener('input', (e) => {
                const bearing = parseFloat(e.target.value);
                if (!isNaN(bearing)) {
                    this.updateMapBearing(bearing);
                }
            });
        }
        
        // Sync controls
        const syncEnabledCheckbox = document.getElementById('syncEnabled');
        const syncModeSelect = document.getElementById('syncMode');
        
        if (syncEnabledCheckbox) {
            syncEnabledCheckbox.addEventListener('change', (e) => {
                this.updateSyncEnabled(e.target.checked);
            });
        }
        
        if (syncModeSelect) {
            syncModeSelect.addEventListener('change', (e) => {
                this.updateSyncMode(e.target.value);
            });
        }
    }
    
    // Map configuration update methods
    updateMapboxToken(token) {
        this.config.mapboxToken = token;
        if (this.map) {
            mapboxgl.accessToken = token;
        }
    }
    
    updateMapStyle(style) {
        this.config.style = style;
        if (this.map) {
            this.map.setStyle(style);
        }
    }
    
    updateMapCenter(center) {
        this.config.center = center;
        if (this.map) {
            this.map.setCenter(center);
        }
    }
    
    updateMapZoom(zoom) {
        this.config.zoom = zoom;
        if (this.map) {
            this.map.setZoom(zoom);
        }
    }
    
    updateMapPitch(pitch) {
        this.config.pitch = pitch;
        if (this.map) {
            this.map.setPitch(pitch);
        }
    }
    
    updateMapBearing(bearing) {
        this.config.bearing = bearing;
        if (this.map) {
            this.map.setBearing(bearing);
        }
    }
    
    updateSyncEnabled(enabled) {
        // Get current sync mode from UI, not from config
        const syncModeSelect = document.getElementById('syncMode');
        const currentMode = syncModeSelect ? syncModeSelect.value : this.config.syncMode;
        
        // Update global sync state instead of local config
        if (window.gridTest) {
            window.gridTest.updateGlobalSyncState(enabled, currentMode, this);
        }
    }
    
    updateSyncMode(mode) {
        // Get current sync enabled state from UI, not from config
        const syncEnabledCheckbox = document.getElementById('syncEnabled');
        const currentEnabled = syncEnabledCheckbox ? syncEnabledCheckbox.checked : this.config.syncEnabled;
        
        // Update global sync state instead of local config
        if (window.gridTest) {
            window.gridTest.updateGlobalSyncState(currentEnabled, mode, this);
        }
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
    
    getConfigPanel() {
        // Get global sync state
        const globalSync = window.gridTest?.globalSyncState || { enabled: false, mode: 'all-leaders' };
        
        return `
            <div class="config-group">
                <div class="config-group-title">Widget Information</div>
                <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; margin-bottom: 12px; font-family: monospace; font-size: 12px;">
                    <strong style="color: #22c55e;">Widget ID:</strong> ${this.element?.id || 'Unknown'}<br>
                    <strong style="color: #22c55e;">Type:</strong> ${this.type}<br>
                    <strong style="color: #22c55e;">Position:</strong> ${this.element?.dataset.startCell || 'Unknown'} → ${this.element?.dataset.endCell || 'Unknown'}
                </div>
            </div>
            
            <div class="config-group">
                <div class="config-group-title">Map Settings</div>
                <label class="config-label">Mapbox Access Token</label>
                <input type="text" class="config-input" id="mapboxToken" value="${this.config.mapboxToken}" placeholder="Enter Mapbox token">
                <small style="color: rgba(255,255,255,0.6); font-size: 10px;">Token loaded from config.js</small>
                
                <label class="config-label">Map Style</label>
                <select class="config-select" id="mapStyle">
                    <option value="mapbox://styles/mapbox/streets-v12" ${this.config.style === 'mapbox://styles/mapbox/streets-v12' ? 'selected' : ''}>Streets</option>
                    <option value="mapbox://styles/mapbox/outdoors-v12" ${this.config.style === 'mapbox://styles/mapbox/outdoors-v12' ? 'selected' : ''}>Outdoors</option>
                    <option value="mapbox://styles/mapbox/light-v11" ${this.config.style === 'mapbox://styles/mapbox/light-v11' ? 'selected' : ''}>Light</option>
                    <option value="mapbox://styles/mapbox/dark-v11" ${this.config.style === 'mapbox://styles/mapbox/dark-v11' ? 'selected' : ''}>Dark</option>
                    <option value="mapbox://styles/mapbox/satellite-v9" ${this.config.style === 'mapbox://styles/mapbox/satellite-v9' ? 'selected' : ''}>Satellite</option>
                </select>
                
                <label class="config-label">Center Longitude</label>
                <input type="number" class="config-input" id="centerLng" value="${this.config.center[0]}" step="0.0001" placeholder="Longitude">
                
                <label class="config-label">Center Latitude</label>
                <input type="number" class="config-input" id="centerLat" value="${this.config.center[1]}" step="0.0001" placeholder="Latitude">
                
                <label class="config-label">Zoom Level</label>
                <input type="number" class="config-input" id="zoom" value="${this.config.zoom}" min="0" max="22" step="0.1" placeholder="Zoom">
                
                <label class="config-label">Pitch</label>
                <input type="number" class="config-input" id="pitch" value="${this.config.pitch}" min="0" max="85" step="1" placeholder="Pitch">
                
                <label class="config-label">Bearing</label>
                <input type="number" class="config-input" id="bearing" value="${this.config.bearing}" min="-180" max="180" step="1" placeholder="Bearing">
            </div>
            
            <div class="config-group">
                <div class="config-group-title">Map Synchronization (Global)</div>
                <label class="config-label">
                    <input type="checkbox" id="syncEnabled" ${globalSync.enabled ? 'checked' : ''}> Enable Map Sync
                </label>
                
                <label class="config-label">Sync Mode</label>
                <select class="config-select" id="syncMode">
                    <option value="all-leaders" ${globalSync.mode === 'all-leaders' ? 'selected' : ''}>All Leaders (any map can lead)</option>
                    <option value="primary-leader" ${globalSync.mode === 'primary-leader' ? 'selected' : ''}>Primary Leader (one map leads)</option>
                </select>
                
                <small style="color: rgba(255,255,255,0.6); font-size: 10px;">
                    ${globalSync.mode === 'all-leaders' 
                        ? 'Click any map to make it the leader' 
                        : 'First enabled map becomes the primary leader'}
                </small>
                <br>
                <small style="color: rgba(255,255,255,0.4); font-size: 9px;">
                    Changes apply to ALL map widgets on the dashboard
                </small>
                <br><br>
                <label class="config-label">Sync Status</label>
                <div style="margin-bottom: 8px;">
                    ${this.getLeaderStatus()}
                </div>
            </div>
        `;
    }
    
    getLeaderStatus() {
        const globalSync = window.gridTest?.globalSyncState || { enabled: false, mode: 'all-leaders' };
        
        if (!globalSync.enabled) {
            return 'Sync is disabled';
        }
        
        if (globalSync.mode === 'primary-leader') {
            if (this.config.isPrimaryLeader) {
                return `This map is the primary leader<br><small style="color: rgba(255,255,255,0.6); font-size: 10px;">Primary leader cannot be changed</small>`;
            } else {
                const leaderId = globalSync.primaryLeader?.element?.id || 'Unknown';
                return `Following: ${leaderId}`;
            }
        } else {
            if (this.config.isLeader) {
                return `This map is the current leader<br><small style="color: rgba(255,255,255,0.6); font-size: 10px;">Click any map to make it the leader</small>`;
            } else {
                // Find the current leader in all-leaders mode
                const currentLeader = Array.from(window.gridTest?.widgets?.values() || [])
                    .find(w => w.type === 'map' && w.config.isLeader);
                const leaderId = currentLeader?.element?.id || 'Unknown';
                return `Following: ${leaderId}`;
            }
        }
    }
}
