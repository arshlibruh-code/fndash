import { WidgetCore } from './WidgetCore.js';

/**
 * Dev Widget - Shows detailed instructions and keyboard shortcuts
 * Only visible in edit mode, hidden in view mode
 */
export class DevWidget extends WidgetCore {
    constructor(id, config = {}) {
        super(id, 'dev', config);
        this.content = this.getDevContent();
    }

    getDevContent() {
        return `
            <div style="padding: 20px; color: #fff; font-family: Arial, sans-serif;">
                <h3 style="color: #089BDF; margin-bottom: 12px; font-size: 16px; font-weight: 600;">Getting Started</h3>
                <p style="margin-bottom: 8px;"><kbd>shift</kbd> + <kbd>?</kbd> to add widgets</p>
                <p style="margin-bottom: 8px;"><kbd>shift</kbd> + <kbd>n</kbd> to create new dashboard</p>
                <p style="margin-bottom: 8px;">Configure widgets using the gear icon</p>
                <p style="margin-bottom: 8px;">Save your dashboard with the save button</p>
                <p style="margin-bottom: 16px;">Switch between dashboards using the dropdown</p>
                
                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: transparent; border-radius: 4px; font-size: 12px;">
                        <kbd>shift</kbd>
                        <kbd>g</kbd>
                        <span>Toggle Grid</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: transparent; border-radius: 4px; font-size: 12px;">
                        <kbd>shift</kbd>
                        <kbd>?</kbd>
                        <span>Add Widget Menu</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: transparent; border-radius: 4px; font-size: 12px;">
                        <kbd>↑</kbd>
                        <kbd>↓</kbd>
                        <span>Navigate Menu</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: transparent; border-radius: 4px; font-size: 12px;">
                        <kbd>enter</kbd>
                        <span>Select Widget</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: transparent; border-radius: 4px; font-size: 12px;">
                        <kbd>esc</kbd>
                        <span>Close/Deselect</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: transparent; border-radius: 4px; font-size: 12px;">
                        <kbd>cmd</kbd>
                        <kbd>shift</kbd>
                        <kbd>←→</kbd>
                        <span>Adjust Columns</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: transparent; border-radius: 4px; font-size: 12px;">
                        <kbd>cmd</kbd>
                        <kbd>shift</kbd>
                        <kbd>↑↓</kbd>
                        <span>Adjust Rows</span>
                    </div>
                </div>
            </div>
        `;
    }

    createElement() {
        const element = super.createElement();
        element.classList.add('dev-widget');
        const container = document.createElement('div');
        container.className = 'dev-container';
        container.innerHTML = this.content;
        element.appendChild(container);
        
        // Set initial visibility based on mode
        this.updateVisibility();
        return element;
    }

    updateVisibility() {
        if (this.element) {
            const isEditMode = !document.querySelector('.controls').classList.contains('view-mode');
            this.element.style.display = isEditMode ? 'block' : 'none';
        }
    }

    updateStyles() {
        this.updateVisibility();
    }

    getControls() {
        return '';
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
                <div class="config-group-title">Dev Widget</div>
                <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">
                    This widget shows detailed instructions and keyboard shortcuts. 
                    It only appears in edit mode and is hidden in view mode.
                </p>
            </div>
        `;
    }

    setupConfigListeners() {
        // No specific config needed for dev widget
    }
}
