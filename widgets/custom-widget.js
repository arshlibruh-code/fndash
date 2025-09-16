import { WidgetCore } from './WidgetCore.js';

export class CustomWidget extends WidgetCore {
    constructor(config) {
        super('custom', config);
        this.customConfig = {
            title: config.title || 'Custom Widget',
            description: config.description || '',
            html: config.html || '<div class="custom-widget-content"><h3>Custom Widget</h3><p>Configure this widget using the settings panel.</p></div>',
            css: config.css || '.custom-widget-content { padding: 20px; text-align: center; color: #fff; }',
            js: config.js || '// Custom JavaScript will go here',
            settings: config.settings || {
                backgroundColor: '#1a1a1a',
                textColor: '#ffffff',
                borderRadius: '8px',
                padding: '0px',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif'
            },
            layout: config.layout || {
                minWidth: 2,
                minHeight: 2,
                maxWidth: 6,
                maxHeight: 4
            },
            interactions: config.interactions || {
                clickable: true,
                hoverable: true,
                draggable: false,
                resizable: true,
                refreshable: false
            }
        };
        this.isRendered = false;
    }
    
    createElement() {
        const element = super.createElement();
        
        // Create custom content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'custom-widget-container';
        contentContainer.style.width = '100%';
        contentContainer.style.height = '100%';
        contentContainer.style.overflow = 'hidden';
        
        element.appendChild(contentContainer);
        
        // Render custom content
        this.renderCustomContent(contentContainer);
        
        return element;
    }
    
    renderCustomContent(container) {
        try {
            // Clear existing content
            container.innerHTML = '';
            
            // Create style element for custom CSS
            const styleElement = document.createElement('style');
            styleElement.textContent = this.customConfig.css;
            container.appendChild(styleElement);
            
            // Process HTML content to replace title placeholders
            let processedHtml = this.customConfig.html;
            
            // Replace common title placeholders with actual title
            processedHtml = processedHtml.replace(/\{\{title\}\}/g, this.customConfig.title);
            processedHtml = processedHtml.replace(/\{\{description\}\}/g, this.customConfig.description);
            processedHtml = processedHtml.replace(/Custom Widget/g, this.customConfig.title);
            
            // If HTML doesn't contain a title, add one
            if (!processedHtml.includes('<h1') && !processedHtml.includes('<h2') && !processedHtml.includes('<h3') && !processedHtml.includes('title')) {
                processedHtml = `<div class="custom-widget-content">
                    <h3>${this.customConfig.title}</h3>
                    ${this.customConfig.description ? `<p>${this.customConfig.description}</p>` : ''}
                    ${processedHtml}
                </div>`;
            }
            
            // Add custom HTML
            const htmlElement = document.createElement('div');
            htmlElement.innerHTML = processedHtml;
            container.appendChild(htmlElement);
            
            // Execute custom JavaScript
            if (this.customConfig.js && this.customConfig.js.trim()) {
                try {
                    // Create a function with the custom JS and execute it
                    const customFunction = new Function('container', 'widget', this.customConfig.js);
                    customFunction(container, this);
                } catch (error) {
                    console.error('Error executing custom JavaScript:', error);
                    // Show error in widget
                    const errorDiv = document.createElement('div');
                    errorDiv.style.cssText = 'color: #ff6b6b; padding: 10px; font-size: 12px;';
                    errorDiv.textContent = `JS Error: ${error.message}`;
                    container.appendChild(errorDiv);
                }
            }
            
            this.isRendered = true;
        } catch (error) {
            console.error('Error rendering custom widget:', error);
            container.innerHTML = '<div style="color: #ff6b6b; padding: 20px; text-align: center;">Error rendering custom widget</div>';
        }
    }
    
    getConfigPanel() {
        const startCell = this.element?.dataset.startCell || 'Unknown';
        const endCell = this.element?.dataset.endCell || 'Unknown';
        
        return `
            <div class="config-section">
                <div class="config-group">
                    <div class="config-group-title">Widget Info</div>
                    <div class="widget-info">
                        <div class="info-item">
                            <span class="info-label">Widget ID:</span>
                            <span class="info-value">${this.id}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Type:</span>
                            <span class="info-value">${this.type}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Position:</span>
                            <span class="info-value">${startCell} → ${endCell}</span>
                        </div>
                    </div>
                </div>
                
                <div class="config-group">
                    <div class="config-group-title">JSON</div>
                    <textarea id="customCode" placeholder="Paste your complete JSON configuration here...">${this.getCurrentConfigAsJSON()}</textarea>
                </div>
                
                <div class="config-actions">
                    <button id="previewCustomWidget" class="config-btn">Preview</button>
                    <button id="saveCustomWidget" class="config-btn">Save Widget</button>
                    <button id="resetCustomWidget" class="config-btn">Reset</button>
                </div>
            </div>
        `;
    }
    
    setupConfigListeners() {
        // Code (JSON Configuration)
        const codeInput = document.getElementById('customCode');
        if (codeInput) {
            codeInput.addEventListener('input', (e) => {
                this.parseAndApplyJSON(e.target.value);
            });
        }
        
        
        // Preview button
        const previewBtn = document.getElementById('previewCustomWidget');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.previewWidget();
            });
        }
        
        // Save button
        const saveBtn = document.getElementById('saveCustomWidget');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveWidget();
            });
        }
        
        // Reset button
        const resetBtn = document.getElementById('resetCustomWidget');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetWidget();
            });
        }
    }
    
    updateWidgetTitle() {
        // Update the widget's debug info or title display
        const debugBox = this.element?.querySelector('.widget-debug');
        if (debugBox) {
            const startCell = this.element.dataset.startCell;
            const endCell = this.element.dataset.endCell;
            const cellsConsumed = this.calculateCellsConsumed();
            debugBox.textContent = `${this.customConfig.title}\n${startCell}-${endCell}\n${cellsConsumed} cells`;
        }
        
        // Also update the widget's HTML content if it contains a title
        this.updateWidgetContent();
    }
    
    updateWidgetContent() {
        // Re-render the widget content with updated configuration
        const container = this.element?.querySelector('.custom-widget-container');
        if (container) {
            this.renderCustomContent(container);
        }
    }
    
    updateWidgetStyles() {
        if (!this.element) return;
        
        // Apply settings to the widget element
        this.element.style.backgroundColor = this.customConfig.settings.backgroundColor;
        this.element.style.color = this.customConfig.settings.textColor;
        this.element.style.borderRadius = this.customConfig.settings.borderRadius;
        this.element.style.padding = this.customConfig.settings.padding;
        this.element.style.fontSize = this.customConfig.settings.fontSize;
        this.element.style.fontFamily = this.customConfig.settings.fontFamily;
    }
    
    previewWidget() {
        // Re-render the widget with current configuration
        const container = this.element?.querySelector('.custom-widget-container');
        if (container) {
            this.renderCustomContent(container);
            this.updateWidgetStyles();
        }
    }
    
    saveWidget() {
        try {
            // Get saved widgets from localStorage
            const savedWidgets = JSON.parse(localStorage.getItem('savedCustomWidgets') || '[]');
            
            // Create widget data to save
            const widgetData = {
                id: Date.now().toString(), // Simple ID based on timestamp
                name: this.customConfig.title || 'Untitled Widget',
                description: this.customConfig.description || '',
                config: { ...this.customConfig },
                savedAt: new Date().toISOString()
            };
            
            // Add to saved widgets
            savedWidgets.push(widgetData);
            
            // Save back to localStorage
            localStorage.setItem('savedCustomWidgets', JSON.stringify(savedWidgets));
            
            // Show success message
            this.showSaveMessage(`Widget "${widgetData.name}" saved successfully!`);
            
        } catch (error) {
            console.error('Error saving widget:', error);
            this.showSaveMessage('Error saving widget', 'error');
        }
    }
    
    showSaveMessage(message, type = 'success') {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            background: ${type === 'error' ? '#ef4444' : '#089BDF'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        messageEl.textContent = message;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(messageEl);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.remove();
            style.remove();
        }, 3000);
    }
    
    getCurrentConfigAsJSON() {
        // Return current configuration as formatted JSON
        return JSON.stringify({
            title: this.customConfig.title,
            description: this.customConfig.description,
            html: this.customConfig.html,
            css: this.customConfig.css,
            js: this.customConfig.js,
            settings: this.customConfig.settings,
            layout: this.customConfig.layout,
            interactions: this.customConfig.interactions
        }, null, 2);
    }
    
    parseAndApplyJSON(jsonString) {
        try {
            // Try to parse the JSON
            const config = JSON.parse(jsonString);
            
            // Validate and apply the configuration
            if (config.title) this.customConfig.title = config.title;
            if (config.description) this.customConfig.description = config.description;
            if (config.html) this.customConfig.html = config.html;
            if (config.css) this.customConfig.css = config.css;
            if (config.js) this.customConfig.js = config.js;
            if (config.settings) this.customConfig.settings = { ...this.customConfig.settings, ...config.settings };
            if (config.layout) this.customConfig.layout = { ...this.customConfig.layout, ...config.layout };
            if (config.interactions) this.customConfig.interactions = { ...this.customConfig.interactions, ...config.interactions };
            
            // Update the widget content
            this.updateWidgetContent();
            this.updateWidgetStyles();
            
            // Update other input fields to reflect the changes
            this.updateConfigInputs();
            
        } catch (error) {
            // JSON is invalid, don't update anything
            console.log('Invalid JSON, waiting for valid input...');
        }
    }
    
    resetWidget() {
        // Reset to default configuration
        this.customConfig = {
            title: 'Custom Widget',
            description: '',
            html: '<div class="custom-widget-content"><h3>Custom Widget</h3><p>Configure this widget using the settings panel.</p></div>',
            css: '.custom-widget-content { padding: 20px; text-align: center; color: #fff; }',
            js: '// Custom JavaScript will go here',
            settings: {
                backgroundColor: '#1a1a1a',
                textColor: '#ffffff',
                borderRadius: '8px',
                padding: '0px',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif'
            },
            interactions: {
                clickable: true,
                hoverable: true,
                draggable: false,
                resizable: true,
                refreshable: false
            }
        };
        
        // Update the config panel inputs
        this.updateConfigInputs();
        
        // Re-render the widget
        this.previewWidget();
    }
    
    updateConfigInputs() {
        // Update all input fields with current config values
        const codeInput = document.getElementById('customCode');
        if (codeInput) codeInput.value = this.getCurrentConfigAsJSON();
    }
    
    calculateCellsConsumed() {
        if (!this.element) return 0;
        
        const startCell = this.element.dataset.startCell;
        const endCell = this.element.dataset.endCell;
        
        if (!startCell || !endCell) return 0;
        
        const startCoords = WidgetCore.parseCellId(startCell);
        const endCoords = WidgetCore.parseCellId(endCell);
        
        return (endCoords.row - startCoords.row + 1) * (endCoords.col - startCoords.col + 1);
    }
}
