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
        this.fontFamily = config.fontFamily || 'Inter, sans-serif';
        this.fontWeight = config.fontWeight || 'normal';
        this.textDecoration = config.textDecoration || 'none';
        this.hasBackground = config.hasBackground !== undefined ? config.hasBackground : false;
        this.backgroundOpacity = config.backgroundOpacity || 1.0;
    }

    getDefaultContent() {
        return `
            <h1>fndash</h1>
            
            <p>
                Build custom dashboards with interactive widgets and real-time data visualization.
            </p>
            
            <p style="font-size: 3em;"><kbd>shift</kbd> <kbd>G</kbd> to get started!</p>
        `;
    }

    createElement() {
        const element = super.createElement();
        
        const container = document.createElement('div');
        container.className = 'richtext-container';
        container.innerHTML = this.content;
        
        // Set up initial styles using individual methods
        this.setupInitialStyles(container);
        element.appendChild(container);
        
        return element;
    }

    setupInitialStyles(container) {
        // Set up all initial styles using individual property assignments
        // This ensures individual updates work properly later
        container.style.padding = `${this.padding}px`;
        // Set background using the new logic
        if (!this.hasBackground) {
            container.style.backgroundColor = 'transparent';
        } else {
            const color = this.backgroundColor;
            const opacity = this.backgroundOpacity;
            
            if (color.startsWith('#')) {
                const hex = color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                container.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            } else {
                container.style.backgroundColor = color;
            }
        }
        container.style.borderRadius = `${this.borderRadius}px`;
        container.style.color = this.textColor;
        container.style.fontSize = `${this.fontSize}px`;
        container.style.fontFamily = this.fontFamily;
        container.style.fontWeight = this.fontWeight;
        container.style.textDecoration = this.textDecoration;
        container.style.textAlign = this.textAlign;
        container.style.lineHeight = this.lineHeight;
        container.style.overflowY = 'auto';
        container.style.height = '100%';
        container.style.boxSizing = 'border-box';
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
                <input type="number" id="fontSize" class="config-input" value="${this.fontSize}" min="8" max="90">
                
                <label class="config-label">Text Color</label>
                <input type="color" id="textColor" class="config-input" value="${this.textColor}">
                
                <label class="config-label">Background Color</label>
                <div class="config-background-simple">
                    <div class="config-hex-container">
                        <div class="config-color-swatch" id="colorSwatch" style="background-color: ${this.backgroundColor};"></div>
                        <input type="text" id="backgroundColorHex" class="config-hex-input" value="${this.backgroundColor.replace('#', '')}" placeholder="223B68" ${!this.hasBackground ? 'disabled' : ''}>
                    </div>
                    <div class="config-opacity-wrapper">
                        <input type="number" id="backgroundOpacity" class="config-opacity-simple" value="${Math.round(this.backgroundOpacity * 100)}" min="0" max="100" ${!this.hasBackground ? 'disabled' : ''}>
                        <span class="config-opacity-suffix">%</span>
                    </div>
                    <button type="button" id="hasBackground" class="config-eye-btn ${!this.hasBackground ? 'active' : ''}">
                        <i data-lucide="${this.hasBackground ? 'eye' : 'eye-off'}" class="config-eye-icon"></i>
                    </button>
                </div>
                <input type="color" id="backgroundColor" class="config-color-picker" value="${this.backgroundColor}" style="display: none;">
                
                <label class="config-label">Padding (px)</label>
                <input type="number" id="padding" class="config-input" value="${this.padding}" min="0" max="800">
                
                <label class="config-label">Border Radius (px)</label>
                <input type="number" id="borderRadius" class="config-input" value="${this.borderRadius}" min="0" max="900">
                
                <label class="config-label">Text Alignment</label>
                <select id="textAlign" class="config-select">
                    <option value="left" ${this.textAlign === 'left' ? 'selected' : ''}>Left</option>
                    <option value="center" ${this.textAlign === 'center' ? 'selected' : ''}>Center</option>
                    <option value="right" ${this.textAlign === 'right' ? 'selected' : ''}>Right</option>
                    <option value="justify" ${this.textAlign === 'justify' ? 'selected' : ''}>Justify</option>
                </select>
                
                <label class="config-label">Line Height</label>
                <input type="number" id="lineHeight" class="config-input" value="${this.lineHeight}" min="1" max="3" step="0.1">
                
                <label class="config-label">Font Family</label>
                <select id="fontFamily" class="config-select">
                    <option value="Inter, sans-serif" ${this.fontFamily === 'Inter, sans-serif' ? 'selected' : ''}>Inter</option>
                    <option value="Roboto, sans-serif" ${this.fontFamily === 'Roboto, sans-serif' ? 'selected' : ''}>Roboto</option>
                    <option value="Open Sans, sans-serif" ${this.fontFamily === 'Open Sans, sans-serif' ? 'selected' : ''}>Open Sans</option>
                    <option value="Lato, sans-serif" ${this.fontFamily === 'Lato, sans-serif' ? 'selected' : ''}>Lato</option>
                    <option value="Montserrat, sans-serif" ${this.fontFamily === 'Montserrat, sans-serif' ? 'selected' : ''}>Montserrat</option>
                    <option value="Poppins, sans-serif" ${this.fontFamily === 'Poppins, sans-serif' ? 'selected' : ''}>Poppins</option>
                    <option value="Source Sans Pro, sans-serif" ${this.fontFamily === 'Source Sans Pro, sans-serif' ? 'selected' : ''}>Source Sans Pro</option>
                    <option value="Nunito, sans-serif" ${this.fontFamily === 'Nunito, sans-serif' ? 'selected' : ''}>Nunito</option>
                    <option value="Playfair Display, serif" ${this.fontFamily === 'Playfair Display, serif' ? 'selected' : ''}>Playfair Display</option>
                    <option value="Merriweather, serif" ${this.fontFamily === 'Merriweather, serif' ? 'selected' : ''}>Merriweather</option>
                    <option value="Oswald, sans-serif" ${this.fontFamily === 'Oswald, sans-serif' ? 'selected' : ''}>Oswald</option>
                    <option value="Raleway, sans-serif" ${this.fontFamily === 'Raleway, sans-serif' ? 'selected' : ''}>Raleway</option>
                    <option value="Ubuntu, sans-serif" ${this.fontFamily === 'Ubuntu, sans-serif' ? 'selected' : ''}>Ubuntu</option>
                    <option value="PT Sans, sans-serif" ${this.fontFamily === 'PT Sans, sans-serif' ? 'selected' : ''}>PT Sans</option>
                    <option value="PT Serif, serif" ${this.fontFamily === 'PT Serif, serif' ? 'selected' : ''}>PT Serif</option>
                    <option value="Crimson Text, serif" ${this.fontFamily === 'Crimson Text, serif' ? 'selected' : ''}>Crimson Text</option>
                    <option value="Lora, serif" ${this.fontFamily === 'Lora, serif' ? 'selected' : ''}>Lora</option>
                    <option value="Libre Baskerville, serif" ${this.fontFamily === 'Libre Baskerville, serif' ? 'selected' : ''}>Libre Baskerville</option>
                    <option value="Noto Sans, sans-serif" ${this.fontFamily === 'Noto Sans, sans-serif' ? 'selected' : ''}>Noto Sans</option>
                    <option value="Noto Serif, serif" ${this.fontFamily === 'Noto Serif, serif' ? 'selected' : ''}>Noto Serif</option>
                </select>
                
                <label class="config-label">Font Weight</label>
                <select id="fontWeight" class="config-select">
                    <option value="normal" ${this.fontWeight === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="bold" ${this.fontWeight === 'bold' ? 'selected' : ''}>Bold</option>
                    <option value="100" ${this.fontWeight === '100' ? 'selected' : ''}>100 - Thin</option>
                    <option value="200" ${this.fontWeight === '200' ? 'selected' : ''}>200 - Extra Light</option>
                    <option value="300" ${this.fontWeight === '300' ? 'selected' : ''}>300 - Light</option>
                    <option value="400" ${this.fontWeight === '400' ? 'selected' : ''}>400 - Regular</option>
                    <option value="500" ${this.fontWeight === '500' ? 'selected' : ''}>500 - Medium</option>
                    <option value="600" ${this.fontWeight === '600' ? 'selected' : ''}>600 - Semi Bold</option>
                    <option value="700" ${this.fontWeight === '700' ? 'selected' : ''}>700 - Bold</option>
                    <option value="800" ${this.fontWeight === '800' ? 'selected' : ''}>800 - Extra Bold</option>
                    <option value="900" ${this.fontWeight === '900' ? 'selected' : ''}>900 - Black</option>
                </select>
                
                <label class="config-label">Text Decoration</label>
                <select id="textDecoration" class="config-select">
                    <option value="none" ${this.textDecoration === 'none' ? 'selected' : ''}>None</option>
                    <option value="underline" ${this.textDecoration === 'underline' ? 'selected' : ''}>Underline</option>
                    <option value="line-through" ${this.textDecoration === 'line-through' ? 'selected' : ''}>Line Through</option>
                    <option value="overline" ${this.textDecoration === 'overline' ? 'selected' : ''}>Overline</option>
                </select>
            </div>
        `;
    }

    setupConfigListeners() {
        const contentTextarea = document.getElementById('richtextContent');
        const fontSizeInput = document.getElementById('fontSize');
        const textColorInput = document.getElementById('textColor');
        const backgroundColorInput = document.getElementById('backgroundColor');
        const backgroundColorHexInput = document.getElementById('backgroundColorHex');
        const colorSwatch = document.getElementById('colorSwatch');
        const hasBackgroundToggle = document.getElementById('hasBackground');
        const backgroundOpacityInput = document.getElementById('backgroundOpacity');
        const paddingInput = document.getElementById('padding');
        const borderRadiusInput = document.getElementById('borderRadius');
        const textAlignSelect = document.getElementById('textAlign');
        const lineHeightInput = document.getElementById('lineHeight');
        const fontFamilySelect = document.getElementById('fontFamily');
        const fontWeightSelect = document.getElementById('fontWeight');
        const textDecorationSelect = document.getElementById('textDecoration');

        // Add Shift + Arrow key functionality for numeric inputs
        this.setupNumericInputShortcuts(fontSizeInput, 'fontSize', 8, 90, 1);
        this.setupNumericInputShortcuts(paddingInput, 'padding', 0, 800, 1);
        this.setupNumericInputShortcuts(borderRadiusInput, 'borderRadius', 0, 900, 1);
        this.setupNumericInputShortcuts(lineHeightInput, 'lineHeight', 1, 3, 0.1);
        // Note: backgroundOpacityInput handled by manual event listener below

        if (contentTextarea) {
            contentTextarea.addEventListener('input', () => {
                this.content = contentTextarea.value;
                this.updateContent();
            });
        }

        if (fontSizeInput) {
            fontSizeInput.addEventListener('input', () => {
                this.fontSize = parseInt(fontSizeInput.value);
                this.updateFontSize();
            });
        }

        if (textColorInput) {
            textColorInput.addEventListener('input', () => {
                this.textColor = textColorInput.value;
                this.updateTextColor();
            });
        }

        if (hasBackgroundToggle) {
            hasBackgroundToggle.addEventListener('click', () => {
                // Toggle the background state
                this.hasBackground = !this.hasBackground;
                
                // Update toggle button appearance
                hasBackgroundToggle.classList.toggle('active', !this.hasBackground);
                
                // Update icon
                const icon = hasBackgroundToggle.querySelector('.config-eye-icon');
                if (icon) {
                    icon.setAttribute('data-lucide', this.hasBackground ? 'eye' : 'eye-off');
                    // Re-initialize Lucide icons for the new icon
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
                
                // Enable/disable color inputs
                if (backgroundColorHexInput) {
                    backgroundColorHexInput.disabled = !this.hasBackground;
                }
                if (backgroundOpacityInput) {
                    backgroundOpacityInput.disabled = !this.hasBackground;
                }
                
                // Update color swatch
                this.updateColorSwatch();
                this.updateBackgroundColor();
            });
        }

        if (backgroundColorInput) {
            backgroundColorInput.addEventListener('input', () => {
                this.backgroundColor = backgroundColorInput.value;
                if (backgroundColorHexInput) {
                    backgroundColorHexInput.value = this.backgroundColor.replace('#', '');
                }
                this.updateColorSwatch();
                this.updateBackgroundColor();
            });
        }

        if (backgroundColorHexInput) {
            backgroundColorHexInput.addEventListener('input', () => {
                let hexValue = backgroundColorHexInput.value;
                // Add # prefix
                if (hexValue && !hexValue.startsWith('#')) {
                    hexValue = '#' + hexValue;
                }
                // Validate hex color (6 characters)
                if (/^[0-9A-Fa-f]{6}$/.test(backgroundColorHexInput.value)) {
                    this.backgroundColor = hexValue;
                    if (backgroundColorInput) {
                        backgroundColorInput.value = hexValue;
                    }
                    this.updateColorSwatch();
                    this.updateBackgroundColor();
                }
            });
        }

        if (colorSwatch) {
            colorSwatch.addEventListener('click', () => {
                if (backgroundColorInput) {
                    // If background is off, enable it first
                    if (!this.hasBackground) {
                        this.hasBackground = true;
                        
                        // Update toggle button appearance
                        if (hasBackgroundToggle) {
                            hasBackgroundToggle.classList.toggle('active', !this.hasBackground);
                            
                            // Update icon to eye
                            const icon = hasBackgroundToggle.querySelector('.config-eye-icon');
                            if (icon) {
                                icon.setAttribute('data-lucide', 'eye');
                                if (typeof lucide !== 'undefined') {
                                    lucide.createIcons();
                                }
                            }
                        }
                        
                        // Enable color inputs
                        if (backgroundColorHexInput) {
                            backgroundColorHexInput.disabled = false;
                        }
                        if (backgroundOpacityInput) {
                            backgroundOpacityInput.disabled = false;
                        }
                        
                        // Update color swatch
                        this.updateColorSwatch();
                        this.updateBackgroundColor();
                    }
                    
                    // Open color picker
                    backgroundColorInput.click();
                }
            });
        }

        if (backgroundOpacityInput) {
            // Handle regular input changes
            backgroundOpacityInput.addEventListener('input', () => {
                this.backgroundOpacity = parseInt(backgroundOpacityInput.value) / 100;
                this.updateColorSwatch();
                this.updateBackgroundColor();
            });

            // Handle Shift + Arrow key functionality
            backgroundOpacityInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Calculate increment: Shift = 10, normal = 1
                    const increment = e.shiftKey ? 10 : 1;
                    const direction = e.key === 'ArrowUp' ? 1 : -1;
                    
                    // Get current value and calculate new value
                    let currentValue = parseInt(backgroundOpacityInput.value) || 0;
                    let newValue = currentValue + (increment * direction);
                    
                    // Clamp to 0-100 bounds
                    newValue = Math.max(0, Math.min(100, newValue));
                    
                    // Update input value and widget property
                    backgroundOpacityInput.value = newValue;
                    this.backgroundOpacity = newValue / 100;
                    
                    // Update visual elements
                    this.updateColorSwatch();
                    this.updateBackgroundColor();
                }
            });
        }

        if (paddingInput) {
            paddingInput.addEventListener('input', () => {
                this.padding = parseInt(paddingInput.value);
                this.updatePadding();
            });
        }

        if (borderRadiusInput) {
            borderRadiusInput.addEventListener('input', () => {
                this.borderRadius = parseInt(borderRadiusInput.value);
                this.updateBorderRadius();
            });
        }

        if (textAlignSelect) {
            textAlignSelect.addEventListener('change', () => {
                this.textAlign = textAlignSelect.value;
                this.updateTextAlign();
            });
        }

        if (lineHeightInput) {
            lineHeightInput.addEventListener('input', () => {
                this.lineHeight = parseFloat(lineHeightInput.value);
                this.updateLineHeight();
            });
        }

        if (fontFamilySelect) {
            fontFamilySelect.addEventListener('change', () => {
                this.fontFamily = fontFamilySelect.value;
                this.updateFontFamily();
            });
        }

        if (fontWeightSelect) {
            fontWeightSelect.addEventListener('change', () => {
                this.fontWeight = fontWeightSelect.value;
                this.updateFontWeight();
            });
        }

        if (textDecorationSelect) {
            textDecorationSelect.addEventListener('change', () => {
                this.textDecoration = textDecorationSelect.value;
                this.updateTextDecoration();
            });
        }

        // Initialize Lucide icons for the eye button
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setupNumericInputShortcuts(input, property, min, max, step) {
        if (!input) return;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                
                // Calculate increment: Shift = 10x step, normal = 1x step
                const increment = e.shiftKey ? (step * 10) : step;
                const direction = e.key === 'ArrowUp' ? 1 : -1;
                
                // Get current value and calculate new value
                let currentValue = parseFloat(input.value) || 0;
                let newValue = currentValue + (increment * direction);
                
                // Clamp to min/max bounds
                newValue = Math.max(min, Math.min(max, newValue));
                
                // Round to appropriate decimal places
                if (step < 1) {
                    newValue = Math.round(newValue * 10) / 10;
                } else {
                    newValue = Math.round(newValue);
                }
                
                // Update input value and widget property
                input.value = newValue;
                this[property] = newValue;
                
                // Call the appropriate update method
                const updateMethod = `update${property.charAt(0).toUpperCase() + property.slice(1)}`;
                if (this[updateMethod]) {
                    this[updateMethod]();
                }
            }
        });
    }

    updateContent() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.innerHTML = this.content;
        }
    }

    // Individual update methods for each style property (following standard widget pattern)
    updateFontSize() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.style.fontSize = `${this.fontSize}px`;
        }
    }

    updateTextColor() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.style.color = this.textColor;
        }
    }

    updateColorSwatch() {
        const colorSwatch = document.getElementById('colorSwatch');
        if (colorSwatch) {
            if (!this.hasBackground) {
                colorSwatch.style.backgroundColor = this.backgroundColor;
            } else {
                // Show color with opacity in the swatch
                const color = this.backgroundColor;
                const opacity = this.backgroundOpacity;
                
                if (color.startsWith('#')) {
                    const hex = color.replace('#', '');
                    const r = parseInt(hex.substr(0, 2), 16);
                    const g = parseInt(hex.substr(2, 2), 16);
                    const b = parseInt(hex.substr(4, 2), 16);
                    colorSwatch.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                } else {
                    colorSwatch.style.backgroundColor = color;
                }
            }
        }
    }

    updateBackgroundColor() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            if (!this.hasBackground) {
                // No Fill: transparent background
                container.style.backgroundColor = 'transparent';
            } else {
                // Has background: use color with opacity
                const color = this.backgroundColor;
                const opacity = this.backgroundOpacity;
                
                // Convert hex to rgba with opacity
                if (color.startsWith('#')) {
                    const hex = color.replace('#', '');
                    const r = parseInt(hex.substr(0, 2), 16);
                    const g = parseInt(hex.substr(2, 2), 16);
                    const b = parseInt(hex.substr(4, 2), 16);
                    container.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                } else {
                    container.style.backgroundColor = color;
                }
            }
        }
    }

    updatePadding() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.style.padding = `${this.padding}px`;
        }
    }

    updateBorderRadius() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.style.borderRadius = `${this.borderRadius}px`;
        }
    }

    updateTextAlign() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.style.textAlign = this.textAlign;
        }
    }

    updateLineHeight() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.style.lineHeight = this.lineHeight;
        }
    }

    updateFontFamily() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.style.fontFamily = this.fontFamily;
        }
    }

    updateFontWeight() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.style.fontWeight = this.fontWeight;
        }
    }

    updateTextDecoration() {
        const container = this.element?.querySelector('.richtext-container');
        if (container) {
            container.style.textDecoration = this.textDecoration;
        }
    }

    updatePositionForMode() {
        if (!this.element) return;
        
        const isEditMode = !document.querySelector('.controls').classList.contains('view-mode');
        const dashboardManager = window.gridTest?.dashboardManager;
        
        if (dashboardManager) {
            if (isEditMode) {
                // Edit mode: 3D to 4I
                dashboardManager.gridTest.positionWidget(this.element, '3D', '4I');
            } else {
                // View mode: 5D to 7I
                dashboardManager.gridTest.positionWidget(this.element, '5D', '7I');
            }
        }
    }
    

    getControls() {
        return '';
    }
}
