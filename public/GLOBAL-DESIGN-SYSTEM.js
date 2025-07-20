// 🎨 GLOBAL DESIGN SYSTEM - Professional Color & Typography Controls
// Completes Phase 3: Advanced Features - Global Design System
console.log('🎨 GLOBAL DESIGN SYSTEM: Loading professional design controls...');

class GlobalDesignSystem {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.currentTheme = 'default';
        this.customColors = {};
        this.customFonts = {};
        
        if (this.isBuilder) {
            this.init();
        }
    }

    init() {
        console.log('🔧 Initializing Global Design System...');
        
        setTimeout(() => {
            this.setupColorPalettes();
            this.setupTypographySystem();
            this.setupDesignPanel();
            this.initializeThemeSystem();
            this.addDesignControls();
            console.log('✅ GLOBAL DESIGN SYSTEM: Professional design controls active!');
        }, 2500);
    }

    setupColorPalettes() {
        console.log('🎨 Setting up professional color palettes...');
        
        this.colorPalettes = {
            default: {
                name: 'Default',
                primary: '#3b82f6',
                secondary: '#8b5cf6',
                accent: '#10b981',
                neutral: '#6b7280',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                background: '#ffffff',
                surface: '#f9fafb',
                text: '#1f2937',
                textSecondary: '#6b7280'
            },
            
            modern: {
                name: 'Modern Blue',
                primary: '#2563eb',
                secondary: '#7c3aed',
                accent: '#06b6d4',
                neutral: '#64748b',
                success: '#059669',
                warning: '#d97706',
                error: '#dc2626',
                background: '#ffffff',
                surface: '#f8fafc',
                text: '#0f172a',
                textSecondary: '#64748b'
            },
            
            warm: {
                name: 'Warm Sunset',
                primary: '#ea580c',
                secondary: '#dc2626',
                accent: '#f59e0b',
                neutral: '#78716c',
                success: '#16a34a',
                warning: '#ca8a04',
                error: '#b91c1c',
                background: '#fffbeb',
                surface: '#fef3c7',
                text: '#1c1917',
                textSecondary: '#78716c'
            },
            
            cool: {
                name: 'Cool Mint',
                primary: '#0891b2',
                secondary: '#0284c7',
                accent: '#059669',
                neutral: '#6b7280',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                background: '#f0fdfa',
                surface: '#ccfbf1',
                text: '#134e4a',
                textSecondary: '#6b7280'
            },
            
            dark: {
                name: 'Dark Professional',
                primary: '#3b82f6',
                secondary: '#8b5cf6',
                accent: '#10b981',
                neutral: '#9ca3af',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                background: '#111827',
                surface: '#1f2937',
                text: '#f9fafb',
                textSecondary: '#d1d5db'
            },
            
            elegant: {
                name: 'Elegant Purple',
                primary: '#7c3aed',
                secondary: '#a855f7',
                accent: '#ec4899',
                neutral: '#6b7280',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                background: '#faf5ff',
                surface: '#f3e8ff',
                text: '#581c87',
                textSecondary: '#7c2d92'
            }
        };
    }

    setupTypographySystem() {
        console.log('📝 Setting up professional typography system...');
        
        this.typographyPresets = {
            modern: {
                name: 'Modern Sans',
                headingFont: 'Inter, system-ui, sans-serif',
                bodyFont: 'Inter, system-ui, sans-serif',
                headingWeight: '700',
                bodyWeight: '400',
                headingLineHeight: '1.2',
                bodyLineHeight: '1.6',
                scale: {
                    h1: '3rem',
                    h2: '2.25rem',
                    h3: '1.875rem',
                    h4: '1.5rem',
                    h5: '1.25rem',
                    h6: '1.125rem',
                    body: '1rem',
                    small: '0.875rem'
                }
            },
            
            classic: {
                name: 'Classic Serif',
                headingFont: 'Georgia, Times, serif',
                bodyFont: 'Georgia, Times, serif',
                headingWeight: '700',
                bodyWeight: '400',
                headingLineHeight: '1.3',
                bodyLineHeight: '1.7',
                scale: {
                    h1: '3.5rem',
                    h2: '2.5rem',
                    h3: '2rem',
                    h4: '1.625rem',
                    h5: '1.375rem',
                    h6: '1.25rem',
                    body: '1.125rem',
                    small: '1rem'
                }
            },
            
            minimal: {
                name: 'Minimal Clean',
                headingFont: 'Helvetica Neue, Arial, sans-serif',
                bodyFont: 'Helvetica Neue, Arial, sans-serif',
                headingWeight: '300',
                bodyWeight: '300',
                headingLineHeight: '1.1',
                bodyLineHeight: '1.5',
                scale: {
                    h1: '2.5rem',
                    h2: '2rem',
                    h3: '1.75rem',
                    h4: '1.5rem',
                    h5: '1.25rem',
                    h6: '1.125rem',
                    body: '1rem',
                    small: '0.875rem'
                }
            },
            
            bold: {
                name: 'Bold Impact',
                headingFont: 'Montserrat, sans-serif',
                bodyFont: 'Open Sans, sans-serif',
                headingWeight: '800',
                bodyWeight: '400',
                headingLineHeight: '1.1',
                bodyLineHeight: '1.6',
                scale: {
                    h1: '4rem',
                    h2: '3rem',
                    h3: '2.25rem',
                    h4: '1.875rem',
                    h5: '1.5rem',
                    h6: '1.25rem',
                    body: '1rem',
                    small: '0.875rem'
                }
            },
            
            elegant: {
                name: 'Elegant Script',
                headingFont: 'Playfair Display, serif',
                bodyFont: 'Source Sans Pro, sans-serif',
                headingWeight: '400',
                bodyWeight: '400',
                headingLineHeight: '1.3',
                bodyLineHeight: '1.6',
                scale: {
                    h1: '3.75rem',
                    h2: '2.75rem',
                    h3: '2.125rem',
                    h4: '1.75rem',
                    h5: '1.375rem',
                    h6: '1.125rem',
                    body: '1rem',
                    small: '0.875rem'
                }
            }
        };
    }

    setupDesignPanel() {
        console.log('🔧 Setting up design control panel...');
        
        // Add design tab to navigation
        this.addDesignTab();
        
        // Create design panel content
        this.createDesignPanelContent();
    }

    addDesignTab() {
        const navTabs = document.querySelector('.nav-tabs, .builder-nav, .sidebar-nav');
        if (!navTabs) return;
        
        // Check if design tab already exists
        if (document.querySelector('[data-tab="design"]')) return;
        
        const designTab = document.createElement('div');
        designTab.className = 'nav-tab';
        designTab.setAttribute('data-tab', 'design');
        designTab.innerHTML = `
            <i class="fas fa-palette"></i>
            <span>Design</span>
        `;
        
        designTab.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #6b7280;
            font-weight: 500;
        `;
        
        designTab.addEventListener('click', () => this.showDesignPanel());
        navTabs.appendChild(designTab);
    }

    createDesignPanelContent() {
        const sidebar = document.querySelector('.sidebar, .left-panel, .builder-sidebar');
        if (!sidebar) return;
        
        const designPanel = document.createElement('div');
        designPanel.id = 'design-panel';
        designPanel.className = 'panel-content';
        designPanel.style.display = 'none';
        
        designPanel.innerHTML = `
            <div class="design-panel-content" style="padding: 20px; height: 100%; overflow-y: auto;">
                <!-- Color Palettes Section -->
                <div class="design-section" style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-palette"></i>
                        Color Palettes
                    </h3>
                    <div class="color-palettes" id="color-palettes">
                        ${this.renderColorPalettes()}
                    </div>
                </div>
                
                <!-- Typography Section -->
                <div class="design-section" style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-font"></i>
                        Typography
                    </h3>
                    <div class="typography-presets" id="typography-presets">
                        ${this.renderTypographyPresets()}
                    </div>
                </div>
                
                <!-- Custom Colors Section -->
                <div class="design-section" style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-eyedropper"></i>
                        Custom Colors
                    </h3>
                    <div class="custom-colors" id="custom-colors">
                        ${this.renderCustomColorControls()}
                    </div>
                </div>
                
                <!-- Spacing & Layout Section -->
                <div class="design-section" style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-expand-arrows-alt"></i>
                        Spacing & Layout
                    </h3>
                    <div class="spacing-controls" id="spacing-controls">
                        ${this.renderSpacingControls()}
                    </div>
                </div>
                
                <!-- Theme Actions -->
                <div class="design-section">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-save"></i>
                        Theme Actions
                    </h3>
                    <div class="theme-actions" style="display: flex; flex-direction: column; gap: 10px;">
                        <button onclick="globalDesignSystem.saveCustomTheme()" 
                                style="background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: background 0.3s;">
                            <i class="fas fa-save"></i> Save Custom Theme
                        </button>
                        <button onclick="globalDesignSystem.exportTheme()" 
                                style="background: #10b981; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: background 0.3s;">
                            <i class="fas fa-download"></i> Export Theme
                        </button>
                        <button onclick="globalDesignSystem.resetToDefault()" 
                                style="background: #6b7280; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: background 0.3s;">
                            <i class="fas fa-undo"></i> Reset to Default
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        sidebar.appendChild(designPanel);
    }

    renderColorPalettes() {
        return Object.entries(this.colorPalettes).map(([key, palette]) => `
            <div class="color-palette ${key === this.currentTheme ? 'active' : ''}" 
                 data-palette="${key}" 
                 onclick="globalDesignSystem.applyColorPalette('${key}')"
                 style="background: white; border: 2px solid ${key === this.currentTheme ? '#3b82f6' : '#e5e7eb'}; border-radius: 12px; padding: 15px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937;">${palette.name}</h4>
                    ${key === this.currentTheme ? '<i class="fas fa-check" style="color: #3b82f6;"></i>' : ''}
                </div>
                <div style="display: flex; gap: 4px; margin-bottom: 10px;">
                    <div style="width: 20px; height: 20px; border-radius: 4px; background: ${palette.primary};" title="Primary"></div>
                    <div style="width: 20px; height: 20px; border-radius: 4px; background: ${palette.secondary};" title="Secondary"></div>
                    <div style="width: 20px; height: 20px; border-radius: 4px; background: ${palette.accent};" title="Accent"></div>
                    <div style="width: 20px; height: 20px; border-radius: 4px; background: ${palette.success};" title="Success"></div>
                    <div style="width: 20px; height: 20px; border-radius: 4px; background: ${palette.warning};" title="Warning"></div>
                    <div style="width: 20px; height: 20px; border-radius: 4px; background: ${palette.error};" title="Error"></div>
                </div>
                <div style="font-size: 12px; color: #6b7280;">
                    Primary: ${palette.primary} • Background: ${palette.background}
                </div>
            </div>
        `).join('');
    }

    renderTypographyPresets() {
        return Object.entries(this.typographyPresets).map(([key, preset]) => `
            <div class="typography-preset" 
                 data-preset="${key}" 
                 onclick="globalDesignSystem.applyTypography('${key}')"
                 style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 15px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s;"
                 onmouseover="this.style.borderColor='#3b82f6'" 
                 onmouseout="this.style.borderColor='#e5e7eb'">
                <h4 style="margin: 0 0 10px 0; font-family: ${preset.headingFont}; font-weight: ${preset.headingWeight}; font-size: 16px; color: #1f2937;">
                    ${preset.name}
                </h4>
                <div style="font-family: ${preset.headingFont}; font-weight: ${preset.headingWeight}; font-size: 20px; line-height: ${preset.headingLineHeight}; margin-bottom: 8px; color: #374151;">
                    Sample Heading
                </div>
                <div style="font-family: ${preset.bodyFont}; font-weight: ${preset.bodyWeight}; font-size: 14px; line-height: ${preset.bodyLineHeight}; color: #6b7280;">
                    Sample body text with this typography preset applied.
                </div>
                <div style="font-size: 12px; color: #9ca3af; margin-top: 8px;">
                    Heading: ${preset.headingFont.split(',')[0]} • Body: ${preset.bodyFont.split(',')[0]}
                </div>
            </div>
        `).join('');
    }

    renderCustomColorControls() {
        return `
            <div class="color-controls" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="color-control">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: 500; color: #374151;">Primary Color</label>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="color" value="#3b82f6" onchange="globalDesignSystem.updateCustomColor('primary', this.value)" 
                               style="width: 40px; height: 40px; border: none; border-radius: 8px; cursor: pointer;">
                        <input type="text" value="#3b82f6" onchange="globalDesignSystem.updateCustomColor('primary', this.value)" 
                               style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px;">
                    </div>
                </div>
                
                <div class="color-control">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: 500; color: #374151;">Secondary Color</label>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="color" value="#8b5cf6" onchange="globalDesignSystem.updateCustomColor('secondary', this.value)" 
                               style="width: 40px; height: 40px; border: none; border-radius: 8px; cursor: pointer;">
                        <input type="text" value="#8b5cf6" onchange="globalDesignSystem.updateCustomColor('secondary', this.value)" 
                               style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px;">
                    </div>
                </div>
                
                <div class="color-control">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: 500; color: #374151;">Accent Color</label>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="color" value="#10b981" onchange="globalDesignSystem.updateCustomColor('accent', this.value)" 
                               style="width: 40px; height: 40px; border: none; border-radius: 8px; cursor: pointer;">
                        <input type="text" value="#10b981" onchange="globalDesignSystem.updateCustomColor('accent', this.value)" 
                               style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px;">
                    </div>
                </div>
                
                <div class="color-control">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: 500; color: #374151;">Background</label>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="color" value="#ffffff" onchange="globalDesignSystem.updateCustomColor('background', this.value)" 
                               style="width: 40px; height: 40px; border: none; border-radius: 8px; cursor: pointer;">
                        <input type="text" value="#ffffff" onchange="globalDesignSystem.updateCustomColor('background', this.value)" 
                               style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px;">
                    </div>
                </div>
            </div>
        `;
    }

    renderSpacingControls() {
        return `
            <div class="spacing-controls" style="display: flex; flex-direction: column; gap: 15px;">
                <div class="spacing-control">
                    <label style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 500; color: #374151;">Container Max Width</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" min="800" max="1400" value="1200" 
                               onchange="globalDesignSystem.updateSpacing('maxWidth', this.value + 'px')"
                               style="flex: 1;">
                        <span style="font-size: 12px; color: #6b7280; min-width: 60px;">1200px</span>
                    </div>
                </div>
                
                <div class="spacing-control">
                    <label style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 500; color: #374151;">Section Padding</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" min="20" max="100" value="60" 
                               onchange="globalDesignSystem.updateSpacing('sectionPadding', this.value + 'px')"
                               style="flex: 1;">
                        <span style="font-size: 12px; color: #6b7280; min-width: 60px;">60px</span>
                    </div>
                </div>
                
                <div class="spacing-control">
                    <label style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 500; color: #374151;">Element Spacing</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" min="10" max="50" value="20" 
                               onchange="globalDesignSystem.updateSpacing('elementSpacing', this.value + 'px')"
                               style="flex: 1;">
                        <span style="font-size: 12px; color: #6b7280; min-width: 60px;">20px</span>
                    </div>
                </div>
                
                <div class="spacing-control">
                    <label style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 500; color: #374151;">Border Radius</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="range" min="0" max="20" value="8" 
                               onchange="globalDesignSystem.updateSpacing('borderRadius', this.value + 'px')"
                               style="flex: 1;">
                        <span style="font-size: 12px; color: #6b7280; min-width: 60px;">8px</span>
                    </div>
                </div>
            </div>
        `;
    }

    showDesignPanel() {
        // Hide all other panels
        document.querySelectorAll('.panel-content').forEach(panel => {
            panel.style.display = 'none';
        });
        
        // Show design panel
        const designPanel = document.getElementById('design-panel');
        if (designPanel) {
            designPanel.style.display = 'block';
        }
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.background = 'transparent';
            tab.style.color = '#6b7280';
        });
        
        const designTab = document.querySelector('[data-tab="design"]');
        if (designTab) {
            designTab.classList.add('active');
            designTab.style.background = '#3b82f6';
            designTab.style.color = 'white';
        }
    }

    applyColorPalette(paletteKey) {
        console.log(`🎨 Applying color palette: ${paletteKey}`);
        
        const palette = this.colorPalettes[paletteKey];
        if (!palette) return;
        
        this.currentTheme = paletteKey;
        
        // Apply CSS custom properties
        const root = document.documentElement;
        Object.entries(palette).forEach(([key, value]) => {
            if (key !== 'name') {
                root.style.setProperty(`--color-${key}`, value);
            }
        });
        
        // Update all elements with the new colors
        this.updateElementColors(palette);
        
        // Update palette selection UI
        document.querySelectorAll('.color-palette').forEach(el => {
            el.classList.remove('active');
            el.style.borderColor = '#e5e7eb';
        });
        
        const selectedPalette = document.querySelector(`[data-palette="${paletteKey}"]`);
        if (selectedPalette) {
            selectedPalette.classList.add('active');
            selectedPalette.style.borderColor = '#3b82f6';
        }
        
        this.showSuccessMessage(`Applied ${palette.name} color palette`);
    }

    applyTypography(presetKey) {
        console.log(`📝 Applying typography: ${presetKey}`);
        
        const preset = this.typographyPresets[presetKey];
        if (!preset) return;
        
        // Apply typography CSS
        const style = document.getElementById('typography-styles') || document.createElement('style');
        style.id = 'typography-styles';
        
        style.textContent = `
            :root {
                --font-heading: ${preset.headingFont};
                --font-body: ${preset.bodyFont};
                --weight-heading: ${preset.headingWeight};
                --weight-body: ${preset.bodyWeight};
                --line-height-heading: ${preset.headingLineHeight};
                --line-height-body: ${preset.bodyLineHeight};
            }
            
            h1, h2, h3, h4, h5, h6, .heading {
                font-family: var(--font-heading) !important;
                font-weight: var(--weight-heading) !important;
                line-height: var(--line-height-heading) !important;
            }
            
            p, span, div, .text, .body {
                font-family: var(--font-body) !important;
                font-weight: var(--weight-body) !important;
                line-height: var(--line-height-body) !important;
            }
            
            h1 { font-size: ${preset.scale.h1} !important; }
            h2 { font-size: ${preset.scale.h2} !important; }
            h3 { font-size: ${preset.scale.h3} !important; }
            h4 { font-size: ${preset.scale.h4} !important; }
            h5 { font-size: ${preset.scale.h5} !important; }
            h6 { font-size: ${preset.scale.h6} !important; }
        `;
        
        if (!document.getElementById('typography-styles')) {
            document.head.appendChild(style);
        }
        
        this.showSuccessMessage(`Applied ${preset.name} typography`);
    }

    updateCustomColor(colorType, value) {
        console.log(`🎨 Updating custom color: ${colorType} = ${value}`);
        
        this.customColors[colorType] = value;
        document.documentElement.style.setProperty(`--color-${colorType}`, value);
        
        // Update the corresponding text input
        const textInput = event.target.parentNode.querySelector('input[type="text"]');
        const colorInput = event.target.parentNode.querySelector('input[type="color"]');
        
        if (event.target.type === 'color' && textInput) {
            textInput.value = value;
        } else if (event.target.type === 'text' && colorInput) {
            colorInput.value = value;
        }
        
        // Apply to elements immediately
        this.updateElementColors({ [colorType]: value });
    }

    updateSpacing(property, value) {
        console.log(`📏 Updating spacing: ${property} = ${value}`);
        
        document.documentElement.style.setProperty(`--${property}`, value);
        
        // Update the display value
        const control = event.target.parentNode;
        const display = control.querySelector('span');
        if (display) {
            display.textContent = value;
        }
        
        // Apply spacing changes
        this.applySpacingChanges(property, value);
    }

    updateElementColors(colors) {
        // Update buttons
        document.querySelectorAll('button, .btn').forEach(btn => {
            if (colors.primary && !btn.style.background) {
                btn.style.background = colors.primary;
            }
        });
        
        // Update links
        document.querySelectorAll('a').forEach(link => {
            if (colors.primary) {
                link.style.color = colors.primary;
            }
        });
        
        // Update backgrounds
        if (colors.background) {
            document.body.style.background = colors.background;
        }
        
        // Update text colors
        if (colors.text) {
            document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
                if (!heading.style.color) {
                    heading.style.color = colors.text;
                }
            });
        }
    }

    applySpacingChanges(property, value) {
        switch (property) {
            case 'maxWidth':
                document.querySelectorAll('.container, .kb-container').forEach(el => {
                    el.style.maxWidth = value;
                });
                break;
            case 'sectionPadding':
                document.querySelectorAll('section, .section').forEach(el => {
                    el.style.padding = `${value} 20px`;
                });
                break;
            case 'elementSpacing':
                document.querySelectorAll('.kb-element').forEach(el => {
                    el.style.marginBottom = value;
                });
                break;
            case 'borderRadius':
                document.querySelectorAll('button, .btn, .card, .kb-element').forEach(el => {
                    el.style.borderRadius = value;
                });
                break;
        }
    }

    initializeThemeSystem() {
        console.log('🔧 Initializing theme system...');
        
        // Load saved theme if exists
        const savedTheme = localStorage.getItem('kingsbuilder-theme');
        if (savedTheme) {
            try {
                const theme = JSON.parse(savedTheme);
                this.applyColorPalette(theme.palette || 'default');
                if (theme.typography) {
                    this.applyTypography(theme.typography);
                }
            } catch (e) {
                console.warn('Failed to load saved theme:', e);
            }
        }
    }

    saveCustomTheme() {
        const themeName = prompt('Enter a name for your custom theme:');
        if (!themeName) return;
        
        const customTheme = {
            name: themeName,
            palette: this.currentTheme,
            customColors: this.customColors,
            customFonts: this.customFonts,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('kingsbuilder-theme', JSON.stringify(customTheme));
        this.showSuccessMessage(`Theme "${themeName}" saved successfully!`);
    }

    exportTheme() {
        const theme = {
            name: 'KingsBuilder Custom Theme',
            palette: this.currentTheme,
            colors: this.colorPalettes[this.currentTheme],
            customColors: this.customColors,
            customFonts: this.customFonts,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kingsbuilder-theme.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage('Theme exported successfully!');
    }

    resetToDefault() {
        if (confirm('Are you sure you want to reset to the default theme? This will remove all customizations.')) {
            this.currentTheme = 'default';
            this.customColors = {};
            this.customFonts = {};
            
            // Remove custom styles
            const customStyles = document.getElementById('typography-styles');
            if (customStyles) {
                customStyles.remove();
            }
            
            // Reset CSS custom properties
            const root = document.documentElement;
            const palette = this.colorPalettes.default;
            Object.entries(palette).forEach(([key, value]) => {
                if (key !== 'name') {
                    root.style.setProperty(`--color-${key}`, value);
                }
            });
            
            // Clear localStorage
            localStorage.removeItem('kingsbuilder-theme');
            
            // Refresh design panel
            this.createDesignPanelContent();
            
            this.showSuccessMessage('Theme reset to default successfully!');
        }
    }

    addDesignControls() {
        // Add global CSS for design system
        const designCSS = document.createElement('style');
        designCSS.id = 'global-design-system-styles';
        designCSS.textContent = `
            /* Global Design System Styles */
            :root {
                --color-primary: #3b82f6;
                --color-secondary: #8b5cf6;
                --color-accent: #10b981;
                --color-neutral: #6b7280;
                --color-success: #10b981;
                --color-warning: #f59e0b;
                --color-error: #ef4444;
                --color-background: #ffffff;
                --color-surface: #f9fafb;
                --color-text: #1f2937;
                --color-textSecondary: #6b7280;
            }
            
            .design-panel-content {
                font-family: 'Inter', system-ui, sans-serif;
            }
            
            .color-palette:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .typography-preset:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .theme-actions button:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            
            /* Apply design system colors to elements */
            .kb-element button, .btn-primary {
                background: var(--color-primary) !important;
                border-color: var(--color-primary) !important;
            }
            
            .kb-element a {
                color: var(--color-primary) !important;
            }
            
            .success-message {
                background: var(--color-success) !important;
            }
            
            .error-message {
                background: var(--color-error) !important;
            }
        `;
        
        document.head.appendChild(designCSS);
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'design-notification success';
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize Global Design System
console.log('🎨 GLOBAL DESIGN SYSTEM: Initializing...');
window.globalDesignSystem = new GlobalDesignSystem();

console.log('✅ GLOBAL DESIGN SYSTEM: Professional design controls loaded!');