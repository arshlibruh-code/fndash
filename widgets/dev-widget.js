import { WidgetCore } from './WidgetCore.js';

/**
 * Dev Widget - Shows detailed instructions and keyboard shortcuts
 * Only visible in edit mode, hidden in view mode
 */
export class DevWidget extends WidgetCore {
    constructor(config = {}) {
        super('dev', config);
        this.content = this.getDevContent();
    }

    getDevContent() {
        return `
            <div style="padding: 12px; color: #fff; font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #fff; margin-bottom: 20px; font-size: 20px; font-weight: 400;">Quick Start</h2>
                
                <p style="margin: 0 0 16px 0; font-size: 14px; color: rgba(255,255,255,0.9); line-height: 1.5; font-weight: 400;">
                    fndash is a universal dashboard builder that lets you create custom dashboards with interactive widgets and real-time data visualization. Build, customize, and share professional dashboards without any coding required.
                </p>
                <p style="margin: 0 0 24px 0; font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.4; font-weight: 400;">
                    <i data-lucide="move" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>Drag and drop widgets, configure them with the <i data-lucide="settings" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin: 0 4px;"></i> gear icon, <i data-lucide="copy" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin: 0 4px;"></i> duplicate, <i data-lucide="trash-2" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin: 0 4px;"></i> delete, and save your layouts <i data-lucide="save" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin: 0 4px;"></i>(in bottom toolbar). Switch between edit and view modes, create multiple dashboards, and use keyboard shortcuts for efficient workflow.
                </p>
                
                <div style="display: flex; gap: 32px; margin-bottom: 24px;">
                    <div style="flex: 1;">
                        <h4 style="color: #fff; margin-bottom: 12px; font-size: 14px; font-weight: 400;">Essential</h4>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <kbd>shift</kbd> <kbd>G</kbd>
                                <span style="font-size: 14px; font-weight: 400;">Toggle Edit/View Mode</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <kbd>shift</kbd> <kbd>?</kbd>
                                <span style="font-size: 14px; font-weight: 400;">Add Widgets</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <kbd>shift</kbd> <kbd>N</kbd>
                                <span style="font-size: 14px; font-weight: 400;">Create New Dashboard</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <kbd>shift</kbd> <kbd>P</kbd>
                                <span style="font-size: 14px; font-weight: 400;">Open Dashboard Menu</span>
                            </div>
                        </div>
                    </div>

                    <div style="flex: 1;">
                        <h4 style="color: #fff; margin-bottom: 12px; font-size: 14px; font-weight: 400;">Navigation</h4>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <kbd>esc</kbd>
                                <span style="font-size: 14px; font-weight: 400;">Deselect Widgets</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <kbd>↑</kbd> <kbd>↓</kbd>
                                <span style="font-size: 14px; font-weight: 400;">Navigate Widget Menu</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <kbd>enter</kbd>
                                <span style="font-size: 14px; font-weight: 400;">Select Widget</span>
                            </div>
                        </div>
                    </div>

                    <div style="flex: 1;">
                        <h4 style="color: #fff; margin-bottom: 12px; font-size: 14px; font-weight: 400;">Layout</h4>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <kbd>cmd</kbd> <kbd>shift</kbd> <kbd>←</kbd> <kbd>→</kbd>
                                <span style="font-size: 14px; font-weight: 400;">Adjust Columns</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <kbd>cmd</kbd> <kbd>shift</kbd> <kbd>↑</kbd> <kbd>↓</kbd>
                                <span style="font-size: 14px; font-weight: 400;">Adjust Rows</span>
                            </div>
                        </div>
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
        
        // Initialize Lucide icons for the gear icon
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
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
                        <span class="info-value">${this.getDisplayName()}</span>
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
