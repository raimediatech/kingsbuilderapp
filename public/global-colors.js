// Global Colors System - Professional Color Management
// Part of KingsBuilder Phase 3.1: Advanced Styling System

class GlobalColorsSystem {
    constructor() {
        this.colors = {
            primary: '#6ec1e4',
            secondary: '#f39c12',
            accent: '#e74c3c',
            text: '#333333',
            text_light: '#666666',
            background: '#ffffff',
            background_dark: '#f8f9fa',
            success: '#27ae60',
            warning: '#f39c12',
            error: '#e74c3c',
            info: '#3498db'
        };
        
        this.customColors = [];
        this.init();
    }
    
    init() {
        this.loadSavedColors();
        this.injectColorVariables();
        this.setupUI();
    }
    
    loadSavedColors() {
        const savedColors = localStorage.getItem('kingsbuilder_global_colors');
        if (savedColors) {
            try {
                const parsedColors = JSON.parse(savedColors);
                this.colors = { ...this.colors, ...parsedColors };
            } catch (e) {
                console.warn('Error loading saved colors:', e);
            }
        }
    }
    
    saveColors() {
        localStorage.setItem('kingsbuilder_global_colors', JSON.stringify(this.colors));
        this.injectColorVariables();
        this.notifyColorChange();
    }
    
    injectColorVariables() {
        let cssVariables = ':root {\n';
        
        // Add default colors
        Object.entries(this.colors).forEach(([key, value]) => {
            cssVariables += `  --kb-color-${key.replace('_', '-')}: ${value};\n`;
        });
        
        // Add custom colors
        this.customColors.forEach((color, index) => {
            cssVariables += `  --kb-color-custom-${index + 1}: ${color.value};\n`;
        });
        
        cssVariables += '}\n';
        
        // Remove existing global colors style
        const existingStyle = document.getElementById('kb-global-colors');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Inject new global colors
        const style = document.createElement('style');
        style.id = 'kb-global-colors';
        style.textContent = cssVariables;
        document.head.appendChild(style);
    }
    
    setupUI() {
        this.createGlobalColorsPanel();
        this.bindEvents();
    }
    
    createGlobalColorsPanel() {
        const panel = document.createElement('div');
        panel.className = 'kb-global-colors-panel';
        panel.innerHTML = `
            <div class="kb-global-colors-header">
                <h3>
                    <i class="eicon-global-colors"></i>
                    Global Colors
                </h3>
                <button class="kb-global-colors-toggle" title="Toggle Global Colors">
                    <i class="eicon-chevron-down"></i>
                </button>
            </div>
            
            <div class="kb-global-colors-content">
                <!-- System Colors -->
                <div class="kb-color-section">
                    <h4 class="kb-color-section-title">System Colors</h4>
                    <div class="kb-color-grid">
                        ${this.renderSystemColors()}
                    </div>
                </div>
                
                <!-- Custom Colors -->
                <div class="kb-color-section">
                    <h4 class="kb-color-section-title">Custom Colors</h4>
                    <div class="kb-custom-colors-grid">
                        ${this.renderCustomColors()}
                    </div>
                    <button class="kb-add-custom-color">
                        <i class="eicon-plus"></i>
                        Add Custom Color
                    </button>
                </div>
                
                <!-- Color Scheme Templates -->
                <div class="kb-color-section">
                    <h4 class="kb-color-section-title">Color Schemes</h4>
                    <div class="kb-color-schemes">
                        ${this.renderColorSchemes()}
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="kb-color-actions">
                    <button class="kb-reset-colors">Reset to Default</button>
                    <button class="kb-export-colors">Export Colors</button>
                    <button class="kb-import-colors">Import Colors</button>
                </div>
            </div>
        `;
        
        // Add to sidebar
        const sidebar = document.querySelector('.elementor-panel-sidebar');
        if (sidebar) {
            sidebar.appendChild(panel);
        }
    }
    
    renderSystemColors() {
        const systemColors = [
            { key: 'primary', name: 'Primary', description: 'Main brand color' },
            { key: 'secondary', name: 'Secondary', description: 'Secondary brand color' },
            { key: 'accent', name: 'Accent', description: 'Accent color' },
            { key: 'text', name: 'Text', description: 'Primary text color' },
            { key: 'text_light', name: 'Text Light', description: 'Light text color' },
            { key: 'background', name: 'Background', description: 'Main background' },
            { key: 'background_dark', name: 'Background Dark', description: 'Dark background' },
            { key: 'success', name: 'Success', description: 'Success messages' },
            { key: 'warning', name: 'Warning', description: 'Warning messages' },
            { key: 'error', name: 'Error', description: 'Error messages' },
            { key: 'info', name: 'Info', description: 'Info messages' }
        ];
        
        return systemColors.map(color => `
            <div class="kb-color-item" data-color-key="${color.key}">
                <div class="kb-color-preview" style="background-color: ${this.colors[color.key]}"></div>
                <div class="kb-color-info">
                    <div class="kb-color-name">${color.name}</div>
                    <div class="kb-color-description">${color.description}</div>
                    <div class="kb-color-value">${this.colors[color.key]}</div>
                </div>
                <div class="kb-color-actions">
                    <button class="kb-edit-color" title="Edit Color">
                        <i class="eicon-edit"></i>
                    </button>
                    <button class="kb-copy-color" title="Copy Color">
                        <i class="eicon-copy"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    renderCustomColors() {
        if (this.customColors.length === 0) {
            return '<div class="kb-no-custom-colors">No custom colors added yet</div>';
        }
        
        return this.customColors.map((color, index) => `
            <div class="kb-custom-color-item" data-custom-index="${index}">
                <div class="kb-color-preview" style="background-color: ${color.value}"></div>
                <div class="kb-color-info">
                    <div class="kb-color-name">${color.name}</div>
                    <div class="kb-color-value">${color.value}</div>
                </div>
                <div class="kb-color-actions">
                    <button class="kb-edit-custom-color" title="Edit Color">
                        <i class="eicon-edit"></i>
                    </button>
                    <button class="kb-delete-custom-color" title="Delete Color">
                        <i class="eicon-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    renderColorSchemes() {
        const schemes = [
            {
                name: 'Professional Blue',
                colors: {
                    primary: '#2563eb',
                    secondary: '#64748b',
                    accent: '#0ea5e9',
                    text: '#1e293b',
                    text_light: '#64748b'
                }
            },
            {
                name: 'Elegant Purple',
                colors: {
                    primary: '#7c3aed',
                    secondary: '#a855f7',
                    accent: '#ec4899',
                    text: '#1f2937',
                    text_light: '#6b7280'
                }
            },
            {
                name: 'Modern Green',
                colors: {
                    primary: '#059669',
                    secondary: '#10b981',
                    accent: '#34d399',
                    text: '#111827',
                    text_light: '#4b5563'
                }
            },
            {
                name: 'Warm Orange',
                colors: {
                    primary: '#ea580c',
                    secondary: '#f97316',
                    accent: '#fb923c',
                    text: '#1c1917',
                    text_light: '#57534e'
                }
            },
            {
                name: 'Dark Mode',
                colors: {
                    primary: '#3b82f6',
                    secondary: '#6366f1',
                    accent: '#8b5cf6',
                    text: '#f9fafb',
                    text_light: '#d1d5db',
                    background: '#111827',
                    background_dark: '#1f2937'
                }
            }
        ];
        
        return schemes.map(scheme => `
            <div class="kb-color-scheme" data-scheme='${JSON.stringify(scheme.colors)}'>
                <div class="kb-scheme-preview">
                    <div class="kb-scheme-color" style="background-color: ${scheme.colors.primary}"></div>
                    <div class="kb-scheme-color" style="background-color: ${scheme.colors.secondary}"></div>
                    <div class="kb-scheme-color" style="background-color: ${scheme.colors.accent}"></div>
                    <div class="kb-scheme-color" style="background-color: ${scheme.colors.text}"></div>
                </div>
                <div class="kb-scheme-name">${scheme.name}</div>
                <button class="kb-apply-scheme">Apply</button>
            </div>
        `).join('');
    }
    
    bindEvents() {
        const panel = document.querySelector('.kb-global-colors-panel');
        if (!panel) return;
        
        // Toggle panel
        panel.querySelector('.kb-global-colors-toggle').addEventListener('click', () => {
            const content = panel.querySelector('.kb-global-colors-content');
            const icon = panel.querySelector('.kb-global-colors-toggle i');
            
            content.classList.toggle('active');
            icon.classList.toggle('rotated');
        });
        
        // Edit system colors
        panel.querySelectorAll('.kb-edit-color').forEach(button => {
            button.addEventListener('click', (e) => {
                const colorItem = e.target.closest('.kb-color-item');
                const colorKey = colorItem.dataset.colorKey;
                this.openColorEditor(colorKey, this.colors[colorKey]);
            });
        });
        
        // Copy color
        panel.querySelectorAll('.kb-copy-color').forEach(button => {
            button.addEventListener('click', (e) => {
                const colorItem = e.target.closest('.kb-color-item');
                const colorKey = colorItem.dataset.colorKey;
                this.copyToClipboard(this.colors[colorKey]);
            });
        });
        
        // Add custom color
        panel.querySelector('.kb-add-custom-color').addEventListener('click', () => {
            this.addCustomColor();
        });
        
        // Apply color scheme
        panel.querySelectorAll('.kb-apply-scheme').forEach(button => {
            button.addEventListener('click', (e) => {
                const schemeData = JSON.parse(e.target.closest('.kb-color-scheme').dataset.scheme);
                this.applyColorScheme(schemeData);
            });
        });
        
        // Reset colors
        panel.querySelector('.kb-reset-colors').addEventListener('click', () => {
            this.resetColors();
        });
        
        // Export colors
        panel.querySelector('.kb-export-colors').addEventListener('click', () => {
            this.exportColors();
        });
        
        // Import colors
        panel.querySelector('.kb-import-colors').addEventListener('click', () => {
            this.importColors();
        });
    }
    
    openColorEditor(colorKey, currentColor) {
        const modal = document.createElement('div');
        modal.className = 'kb-color-editor-modal';
        modal.innerHTML = `
            <div class="kb-color-editor-backdrop"></div>
            <div class="kb-color-editor">
                <div class="kb-color-editor-header">
                    <h3>Edit Color: ${colorKey.replace('_', ' ')}</h3>
                    <button class="kb-close-editor">
                        <i class="eicon-close"></i>
                    </button>
                </div>
                
                <div class="kb-color-editor-content">
                    <div class="kb-color-preview-large" style="background-color: ${currentColor}"></div>
                    
                    <div class="kb-color-inputs">
                        <div class="kb-color-input-group">
                            <label>HEX</label>
                            <input type="text" class="kb-color-hex" value="${currentColor}" pattern="^#[0-9A-Fa-f]{6}$">
                        </div>
                        
                        <div class="kb-color-input-group">
                            <label>RGB</label>
                            <div class="kb-rgb-inputs">
                                <input type="number" class="kb-color-r" min="0" max="255" value="${this.hexToRgb(currentColor).r}">
                                <input type="number" class="kb-color-g" min="0" max="255" value="${this.hexToRgb(currentColor).g}">
                                <input type="number" class="kb-color-b" min="0" max="255" value="${this.hexToRgb(currentColor).b}">
                            </div>
                        </div>
                        
                        <div class="kb-color-input-group">
                            <label>HSL</label>
                            <div class="kb-hsl-inputs">
                                <input type="number" class="kb-color-h" min="0" max="360" value="${this.hexToHsl(currentColor).h}">
                                <input type="number" class="kb-color-s" min="0" max="100" value="${this.hexToHsl(currentColor).s}">
                                <input type="number" class="kb-color-l" min="0" max="100" value="${this.hexToHsl(currentColor).l}">
                            </div>
                        </div>
                    </div>
                    
                    <div class="kb-color-picker-container">
                        <input type="color" class="kb-color-picker" value="${currentColor}">
                    </div>
                    
                    <div class="kb-color-suggestions">
                        <h4>Color Suggestions</h4>
                        <div class="kb-color-suggestions-grid">
                            ${this.generateColorSuggestions(currentColor)}
                        </div>
                    </div>
                </div>
                
                <div class="kb-color-editor-actions">
                    <button class="kb-cancel-color">Cancel</button>
                    <button class="kb-save-color">Save Color</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Bind modal events
        this.bindColorEditorEvents(modal, colorKey);
        
        // Show modal
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    bindColorEditorEvents(modal, colorKey) {
        const hexInput = modal.querySelector('.kb-color-hex');
        const rInput = modal.querySelector('.kb-color-r');
        const gInput = modal.querySelector('.kb-color-g');
        const bInput = modal.querySelector('.kb-color-b');
        const hInput = modal.querySelector('.kb-color-h');
        const sInput = modal.querySelector('.kb-color-s');
        const lInput = modal.querySelector('.kb-color-l');
        const colorPicker = modal.querySelector('.kb-color-picker');
        const preview = modal.querySelector('.kb-color-preview-large');
        
        // Update color when inputs change
        const updateColor = (newColor) => {
            preview.style.backgroundColor = newColor;
            
            // Update all inputs
            const rgb = this.hexToRgb(newColor);
            const hsl = this.hexToHsl(newColor);
            
            hexInput.value = newColor;
            rInput.value = rgb.r;
            gInput.value = rgb.g;
            bInput.value = rgb.b;
            hInput.value = hsl.h;
            sInput.value = hsl.s;
            lInput.value = hsl.l;
            colorPicker.value = newColor;
        };
        
        // HEX input
        hexInput.addEventListener('input', (e) => {
            if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                updateColor(e.target.value);
            }
        });
        
        // RGB inputs
        [rInput, gInput, bInput].forEach(input => {
            input.addEventListener('input', () => {
                const hex = this.rgbToHex(parseInt(rInput.value), parseInt(gInput.value), parseInt(bInput.value));
                updateColor(hex);
            });
        });
        
        // HSL inputs
        [hInput, sInput, lInput].forEach(input => {
            input.addEventListener('input', () => {
                const hex = this.hslToHex(parseInt(hInput.value), parseInt(sInput.value), parseInt(lInput.value));
                updateColor(hex);
            });
        });
        
        // Color picker
        colorPicker.addEventListener('input', (e) => {
            updateColor(e.target.value);
        });
        
        // Close modal
        modal.querySelector('.kb-close-editor').addEventListener('click', () => {
            this.closeColorEditor(modal);
        });
        
        modal.querySelector('.kb-color-editor-backdrop').addEventListener('click', () => {
            this.closeColorEditor(modal);
        });
        
        modal.querySelector('.kb-cancel-color').addEventListener('click', () => {
            this.closeColorEditor(modal);
        });
        
        // Save color
        modal.querySelector('.kb-save-color').addEventListener('click', () => {
            this.colors[colorKey] = hexInput.value;
            this.saveColors();
            this.updateColorUI();
            this.closeColorEditor(modal);
        });
        
        // Color suggestions
        modal.querySelectorAll('.kb-suggestion-color').forEach(button => {
            button.addEventListener('click', (e) => {
                const color = e.target.style.backgroundColor;
                const hex = this.rgbToHex(...color.match(/\d+/g).map(Number));
                updateColor(hex);
            });
        });
    }
    
    generateColorSuggestions(baseColor) {
        const suggestions = [];
        const rgb = this.hexToRgb(baseColor);
        
        // Lighter variations
        for (let i = 1; i <= 3; i++) {
            const lighter = this.lightenColor(baseColor, i * 20);
            suggestions.push(lighter);
        }
        
        // Darker variations
        for (let i = 1; i <= 3; i++) {
            const darker = this.darkenColor(baseColor, i * 20);
            suggestions.push(darker);
        }
        
        // Complementary colors
        const complementary = this.getComplementaryColor(baseColor);
        suggestions.push(complementary);
        
        return suggestions.map(color => 
            `<div class="kb-suggestion-color" style="background-color: ${color}" title="${color}"></div>`
        ).join('');
    }
    
    closeColorEditor(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    
    addCustomColor() {
        const colorName = prompt('Enter color name:');
        if (!colorName) return;
        
        const colorValue = prompt('Enter color value (hex):', '#000000');
        if (!colorValue || !colorValue.match(/^#[0-9A-Fa-f]{6}$/)) {
            alert('Invalid color format. Please use hex format (#000000)');
            return;
        }
        
        this.customColors.push({
            name: colorName,
            value: colorValue
        });
        
        this.saveColors();
        this.updateCustomColorsUI();
    }
    
    applyColorScheme(schemeColors) {
        this.colors = { ...this.colors, ...schemeColors };
        this.saveColors();
        this.updateColorUI();
    }
    
    resetColors() {
        if (confirm('Are you sure you want to reset all colors to default?')) {
            this.colors = {
                primary: '#6ec1e4',
                secondary: '#f39c12',
                accent: '#e74c3c',
                text: '#333333',
                text_light: '#666666',
                background: '#ffffff',
                background_dark: '#f8f9fa',
                success: '#27ae60',
                warning: '#f39c12',
                error: '#e74c3c',
                info: '#3498db'
            };
            this.customColors = [];
            this.saveColors();
            this.updateColorUI();
        }
    }
    
    exportColors() {
        const colorData = {
            systemColors: this.colors,
            customColors: this.customColors
        };
        
        const blob = new Blob([JSON.stringify(colorData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kingsbuilder-colors.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    importColors() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const colorData = JSON.parse(event.target.result);
                    
                    if (colorData.systemColors) {
                        this.colors = { ...this.colors, ...colorData.systemColors };
                    }
                    
                    if (colorData.customColors) {
                        this.customColors = colorData.customColors;
                    }
                    
                    this.saveColors();
                    this.updateColorUI();
                    alert('Colors imported successfully!');
                } catch (error) {
                    alert('Error importing colors: Invalid file format');
                }
            };
            reader.readAsText(file);
        });
        
        input.click();
    }
    
    updateColorUI() {
        const panel = document.querySelector('.kb-global-colors-panel');
        if (!panel) return;
        
        // Update system colors
        const systemGrid = panel.querySelector('.kb-color-grid');
        if (systemGrid) {
            systemGrid.innerHTML = this.renderSystemColors();
        }
        
        // Update custom colors
        this.updateCustomColorsUI();
        
        // Re-bind events
        this.bindEvents();
    }
    
    updateCustomColorsUI() {
        const panel = document.querySelector('.kb-global-colors-panel');
        if (!panel) return;
        
        const customGrid = panel.querySelector('.kb-custom-colors-grid');
        if (customGrid) {
            customGrid.innerHTML = this.renderCustomColors();
        }
    }
    
    copyToClipboard(color) {
        navigator.clipboard.writeText(color).then(() => {
            // Show success message
            this.showNotification('Color copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = color;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showNotification('Color copied to clipboard!', 'success');
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `kb-notification kb-notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    notifyColorChange() {
        // Notify other components that colors have changed
        window.dispatchEvent(new CustomEvent('kingsbuilder:colorsChanged', {
            detail: { colors: this.colors, customColors: this.customColors }
        }));
    }
    
    // Color utility functions
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
        const g = Math.round(hue2rgb(p, q, h) * 255);
        const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
        
        return this.rgbToHex(r, g, b);
    }
    
    lightenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * percent / 100));
        const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * percent / 100));
        const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * percent / 100));
        return this.rgbToHex(r, g, b);
    }
    
    darkenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        const r = Math.max(0, Math.round(rgb.r - rgb.r * percent / 100));
        const g = Math.max(0, Math.round(rgb.g - rgb.g * percent / 100));
        const b = Math.max(0, Math.round(rgb.b - rgb.b * percent / 100));
        return this.rgbToHex(r, g, b);
    }
    
    getComplementaryColor(hex) {
        const rgb = this.hexToRgb(hex);
        const r = 255 - rgb.r;
        const g = 255 - rgb.g;
        const b = 255 - rgb.b;
        return this.rgbToHex(r, g, b);
    }
    
    // Public API
    getColor(colorKey) {
        return this.colors[colorKey];
    }
    
    setColor(colorKey, value) {
        this.colors[colorKey] = value;
        this.saveColors();
    }
    
    getAllColors() {
        return { ...this.colors };
    }
    
    getCustomColors() {
        return [...this.customColors];
    }
}

// Initialize Global Colors System
window.globalColors = new GlobalColorsSystem();