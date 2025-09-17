import { WidgetCore } from './WidgetCore.js';

export class RichTextWidget extends WidgetCore {
    constructor(config = {}) {
        super('richtext', config);
        this.content = config.content || this.getDefaultContent();
        this.fontSize = config.fontSize || 14;
        this.textColor = config.textColor || '#ffffff';
        this.backgroundColor = config.backgroundColor || '#1A1A1A';
        this.padding = config.padding || 16;
        this.borderRadius = config.borderRadius || 8;
        this.textAlign = config.textAlign || 'left';
        this.lineHeight = config.lineHeight || 1.5;
    }

    getDefaultContent() {
        return `
            <h1 style="color: #ffffff; margin-bottom: 24px; font-size: 32px; font-weight: 600;">fndash</h1>
            
            <p style="margin-bottom: 24px; font-size: 18px; color: rgba(255, 255, 255, 0.9);">
                Build custom dashboards with interactive widgets and real-time data visualization.
            </p>
            
            <p style="margin-bottom: 16px; font-size: 48px; color: #ffffff; font-weight: 600;"><kbd>shift</kbd> + <kbd>g</kbd> to get started!</p>
            
            
        `;
    }

    createElement() {
        const element = super.createElement();
        
        const container = document.createElement('div');
        container.className = 'richtext-container';
        container.innerHTML = this.content;
        
        this.applyStyles(container);
        element.appendChild(container);
        
        return element;
    }


    getConfigPanel() {
        const startCell = this.element?.dataset.startCell || 'Unknown';
        const endCell = this.element?.dataset.endCell || 'Unknown';
        
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
                        <span class="info-value">${startCell} → ${endCell}</span>
                    </div>
                </div>
            </div>
            
            <div class="config-group">
                <div class="config-group-title">Content</div>
                <label class="config-label">Rich Text Content</label>
                <textarea id="richtextContent" class="config-textarea" rows="8" placeholder="Enter your HTML content here...">${this.content}</textarea>
            </div>
            
            <div class="config-group">
                <div class="config-group-title">Styling</div>
                
                <label class="config-label">Font Size (px)</label>
                <input type="number" id="fontSize" class="config-input" value="${this.fontSize}" min="8" max="48">
                
                <label class="config-label">Text Color</label>
                <input type="color" id="textColor" class="config-input" value="${this.textColor}">
                
                <label class="config-label">Background Color</label>
                <input type="color" id="backgroundColor" class="config-input" value="${this.backgroundColor}">
                
                <label class="config-label">Padding (px)</label>
                <input type="number" id="padding" class="config-input" value="${this.padding}" min="0" max="50">
                
                <label class="config-label">Border Radius (px)</label>
                <input type="number" id="borderRadius" class="config-input" value="${this.borderRadius}" min="0" max="20">
                
                <label class="config-label">Text Alignment</label>
                <select id="textAlign" class="config-select">
                    <option value="left" ${this.textAlign === 'left' ? 'selected' : ''}>Left</option>
                    <option value="center" ${this.textAlign === 'center' ? 'selected' : ''}>Center</option>
                    <option value="right" ${this.textAlign === 'right' ? 'selected' : ''}>Right</option>
                    <option value="justify" ${this.textAlign === 'justify' ? 'selected' : ''}>Justify</option>
                </select>
                
                <label class="config-label">Line Height</label>
                <input type="number" id="lineHeight" class="config-input" value="${this.lineHeight}" min="1" max="3" step="0.1">
            </div>
        `;
    }

    setupConfigListeners() {
        const contentTextarea = document.getElementById('richtextContent');
        const fontSizeInput = document.getElementById('fontSize');
        const textColorInput = document.getElementById('textColor');
        const backgroundColorInput = document.getElementById('backgroundColor');
        const paddingInput = document.getElementById('padding');
        const borderRadiusInput = document.getElementById('borderRadius');
        const textAlignSelect = document.getElementById('textAlign');
        const lineHeightInput = document.getElementById('lineHeight');

        if (contentTextarea) {
            contentTextarea.addEventListener('input', () => {
                this.content = contentTextarea.value;
                this.updateContent();
            });
        }

        if (fontSizeInput) {
            fontSizeInput.addEventListener('input', () => {
                this.fontSize = parseInt(fontSizeInput.value);
                this.updateStyles();
            });
        }

        if (textColorInput) {
            textColorInput.addEventListener('input', () => {
                this.textColor = textColorInput.value;
                this.updateStyles();
            });
        }

        if (backgroundColorInput) {
            backgroundColorInput.addEventListener('input', () => {
                this.backgroundColor = backgroundColorInput.value;
                this.updateStyles();
            });
        }

        if (paddingInput) {
            paddingInput.addEventListener('input', () => {
                this.padding = parseInt(paddingInput.value);
                this.updateStyles();
            });
        }

        if (borderRadiusInput) {
            borderRadiusInput.addEventListener('input', () => {
                this.borderRadius = parseInt(borderRadiusInput.value);
                this.updateStyles();
            });
        }

        if (textAlignSelect) {
            textAlignSelect.addEventListener('change', () => {
                this.textAlign = textAlignSelect.value;
                this.updateStyles();
            });
        }

        if (lineHeightInput) {
            lineHeightInput.addEventListener('input', () => {
                this.lineHeight = parseFloat(lineHeightInput.value);
                this.updateStyles();
            });
        }
    }

    updateContent() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.innerHTML = this.content;
        }
    }

    updateStyles() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            this.applyStyles(container);
        }
        
        // Update position based on current mode
        this.updatePositionForMode();
    }

    updatePositionForMode() {
        if (!this.element) return;
        
        const isEditMode = !document.querySelector('.controls').classList.contains('view-mode');
        const dashboardManager = window.gridTest?.dashboardManager;
        
        if (dashboardManager) {
            if (isEditMode) {
                // Edit mode: 3D to 5I
                dashboardManager.gridTest.positionWidget(this.element, '3D', '5I');
            } else {
                // View mode: 5D to 7I
                dashboardManager.gridTest.positionWidget(this.element, '5D', '7I');
            }
        }
    }
    
    applyStyles(container) {
        const bgColor = this.backgroundColor === '#1A1A1A' ? 'transparent' : this.backgroundColor;
        container.style.cssText = `
            padding: ${this.padding}px;
            background-color: ${bgColor};
            border-radius: ${this.borderRadius}px;
            color: ${this.textColor};
            font-size: ${this.fontSize}px;
            text-align: ${this.textAlign};
            line-height: ${this.lineHeight};
            overflow-y: auto;
            height: 100%;
            box-sizing: border-box;
        `;
    }

    getControls() {
        return '';
    }
}
