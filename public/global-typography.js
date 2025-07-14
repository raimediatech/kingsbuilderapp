// Global Typography System - Professional Font Management
// Part of KingsBuilder Phase 3.1: Advanced Styling System

class GlobalTypographySystem {
    constructor() {
        this.fonts = {
            primary: {
                family: 'Inter',
                weights: ['300', '400', '500', '600', '700'],
                fallback: 'sans-serif'
            },
            secondary: {
                family: 'Playfair Display',
                weights: ['400', '700'],
                fallback: 'serif'
            },
            heading: {
                family: 'Poppins',
                weights: ['400', '600', '700'],
                fallback: 'sans-serif'
            },
            body: {
                family: 'Open Sans',
                weights: ['400', '600'],
                fallback: 'sans-serif'
            }
        };
        
        this.googleFonts = [];
        this.loadedFonts = new Set();
        this.init();
    }
    
    init() {
        this.loadGoogleFonts();
        this.loadSavedFonts();
        this.injectTypographyVariables();
        this.setupUI();
    }
    
    async loadGoogleFonts() {
        try {
            // Load popular Google Fonts list
            this.googleFonts = [
                { family: 'Inter', category: 'sans-serif', variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
                { family: 'Roboto', category: 'sans-serif', variants: ['100', '300', '400', '500', '700', '900'] },
                { family: 'Open Sans', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800'] },
                { family: 'Poppins', category: 'sans-serif', variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
                { family: 'Lato', category: 'sans-serif', variants: ['100', '300', '400', '700', '900'] },
                { family: 'Montserrat', category: 'sans-serif', variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
                { family: 'Source Sans Pro', category: 'sans-serif', variants: ['200', '300', '400', '600', '700', '900'] },
                { family: 'Nunito', category: 'sans-serif', variants: ['200', '300', '400', '500', '600', '700', '800', '900'] },
                { family: 'Raleway', category: 'sans-serif', variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
                { family: 'Ubuntu', category: 'sans-serif', variants: ['300', '400', '500', '700'] },
                
                // Serif fonts
                { family: 'Playfair Display', category: 'serif', variants: ['400', '500', '600', '700', '800', '900'] },
                { family: 'Lora', category: 'serif', variants: ['400', '500', '600', '700'] },
                { family: 'Merriweather', category: 'serif', variants: ['300', '400', '700', '900'] },
                { family: 'Crimson Text', category: 'serif', variants: ['400', '600', '700'] },
                { family: 'Libre Baskerville', category: 'serif', variants: ['400', '700'] },
                { family: 'EB Garamond', category: 'serif', variants: ['400', '500', '600', '700', '800'] },
                { family: 'Cormorant Garamond', category: 'serif', variants: ['300', '400', '500', '600', '700'] },
                { family: 'Spectral', category: 'serif', variants: ['200', '300', '400', '500', '600', '700', '800'] },
                
                // Display fonts
                { family: 'Oswald', category: 'sans-serif', variants: ['200', '300', '400', '500', '600', '700'] },
                { family: 'Bebas Neue', category: 'display', variants: ['400'] },
                { family: 'Anton', category: 'sans-serif', variants: ['400'] },
                { family: 'Righteous', category: 'display', variants: ['400'] },
                { family: 'Fredoka One', category: 'display', variants: ['400'] },
                { family: 'Pacifico', category: 'handwriting', variants: ['400'] },
                { family: 'Dancing Script', category: 'handwriting', variants: ['400', '500', '600', '700'] },
                { family: 'Great Vibes', category: 'handwriting', variants: ['400'] },
                
                // Monospace fonts
                { family: 'Fira Code', category: 'monospace', variants: ['300', '400', '500', '600', '700'] },
                { family: 'Source Code Pro', category: 'monospace', variants: ['200', '300', '400', '500', '600', '700', '900'] },
                { family: 'JetBrains Mono', category: 'monospace', variants: ['100', '200', '300', '400', '500', '600', '700', '800'] },
                { family: 'Roboto Mono', category: 'monospace', variants: ['100', '200', '300', '400', '500', '600', '700'] }
            ];
        } catch (error) {
            console.warn('Error loading Google Fonts:', error);
        }
    }
    
    loadSavedFonts() {
        const savedFonts = localStorage.getItem('kingsbuilder_global_fonts');
        if (savedFonts) {
            try {
                const parsedFonts = JSON.parse(savedFonts);
                this.fonts = { ...this.fonts, ...parsedFonts };
            } catch (e) {
                console.warn('Error loading saved fonts:', e);
            }
        }
    }
    
    saveFonts() {
        localStorage.setItem('kingsbuilder_global_fonts', JSON.stringify(this.fonts));
        this.injectTypographyVariables();
        this.notifyTypographyChange();
    }
    
    injectTypographyVariables() {
        let cssVariables = ':root {\n';
        
        // Add font families
        Object.entries(this.fonts).forEach(([key, font]) => {
            cssVariables += `  --kb-font-${key}: "${font.family}", ${font.fallback};\n`;
        });
        
        // Add base typography settings
        cssVariables += `
  --kb-font-size-xs: 12px;
  --kb-font-size-sm: 14px;
  --kb-font-size-base: 16px;
  --kb-font-size-lg: 18px;
  --kb-font-size-xl: 20px;
  --kb-font-size-2xl: 24px;
  --kb-font-size-3xl: 30px;
  --kb-font-size-4xl: 36px;
  --kb-font-size-5xl: 48px;
  --kb-font-size-6xl: 60px;
  
  --kb-line-height-none: 1;
  --kb-line-height-tight: 1.25;
  --kb-line-height-snug: 1.375;
  --kb-line-height-normal: 1.5;
  --kb-line-height-relaxed: 1.625;
  --kb-line-height-loose: 2;
  
  --kb-letter-spacing-tighter: -0.05em;
  --kb-letter-spacing-tight: -0.025em;
  --kb-letter-spacing-normal: 0em;
  --kb-letter-spacing-wide: 0.025em;
  --kb-letter-spacing-wider: 0.05em;
  --kb-letter-spacing-widest: 0.1em;
        `;
        
        cssVariables += '}\n';
        
        // Load Google Fonts
        this.loadGoogleFontCSS();
        
        // Remove existing typography style
        const existingStyle = document.getElementById('kb-global-typography');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Inject new typography variables
        const style = document.createElement('style');
        style.id = 'kb-global-typography';
        style.textContent = cssVariables;
        document.head.appendChild(style);
    }
    
    loadGoogleFontCSS() {
        const fontsToLoad = [];
        
        Object.values(this.fonts).forEach(font => {
            const googleFont = this.googleFonts.find(gf => gf.family === font.family);
            if (googleFont && !this.loadedFonts.has(font.family)) {
                fontsToLoad.push({
                    family: font.family,
                    weights: font.weights
                });
                this.loadedFonts.add(font.family);
            }
        });
        
        if (fontsToLoad.length > 0) {
            const fontUrl = this.buildGoogleFontURL(fontsToLoad);
            this.loadFontCSS(fontUrl);
        }
    }
    
    buildGoogleFontURL(fonts) {
        const baseUrl = 'https://fonts.googleapis.com/css2?';
        const families = fonts.map(font => {
            const weights = font.weights.join(';');
            return `family=${font.family.replace(/\s+/g, '+')}:wght@${weights}`;
        });
        
        return baseUrl + families.join('&') + '&display=swap';
    }
    
    loadFontCSS(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    }
    
    setupUI() {
        this.createTypographyPanel();
        this.bindEvents();
    }
    
    createTypographyPanel() {
        const panel = document.createElement('div');
        panel.className = 'kb-global-typography-panel';
        panel.innerHTML = `
            <div class="kb-global-typography-header">
                <h3>
                    <i class="eicon-font"></i>
                    Global Typography
                </h3>
                <button class="kb-global-typography-toggle" title="Toggle Typography">
                    <i class="eicon-chevron-down"></i>
                </button>
            </div>
            
            <div class="kb-global-typography-content">
                <!-- Font Settings -->
                <div class="kb-typography-section">
                    <h4 class="kb-typography-section-title">Font Settings</h4>
                    <div class="kb-font-settings">
                        ${this.renderFontSettings()}
                    </div>
                </div>
                
                <!-- Typography Presets -->
                <div class="kb-typography-section">
                    <h4 class="kb-typography-section-title">Typography Presets</h4>
                    <div class="kb-typography-presets">
                        ${this.renderTypographyPresets()}
                    </div>
                </div>
                
                <!-- Google Fonts Browser -->
                <div class="kb-typography-section">
                    <h4 class="kb-typography-section-title">Google Fonts</h4>
                    <div class="kb-font-browser">
                        <div class="kb-font-search">
                            <input type="text" placeholder="Search fonts..." class="kb-font-search-input">
                            <div class="kb-font-filters">
                                <select class="kb-font-category-filter">
                                    <option value="">All Categories</option>
                                    <option value="sans-serif">Sans Serif</option>
                                    <option value="serif">Serif</option>
                                    <option value="display">Display</option>
                                    <option value="handwriting">Handwriting</option>
                                    <option value="monospace">Monospace</option>
                                </select>
                            </div>
                        </div>
                        <div class="kb-font-list">
                            ${this.renderGoogleFonts()}
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="kb-typography-actions">
                    <button class="kb-reset-typography">Reset Typography</button>
                    <button class="kb-export-typography">Export Settings</button>
                </div>
            </div>
        `;
        
        // Add to sidebar
        const sidebar = document.querySelector('.elementor-panel-sidebar');
        if (sidebar) {
            sidebar.appendChild(panel);
        }
    }
    
    renderFontSettings() {
        const fontTypes = [
            { key: 'primary', name: 'Primary Font', description: 'Main brand font' },
            { key: 'secondary', name: 'Secondary Font', description: 'Secondary font' },
            { key: 'heading', name: 'Heading Font', description: 'For headings' },
            { key: 'body', name: 'Body Font', description: 'For body text' }
        ];
        
        return fontTypes.map(fontType => `
            <div class="kb-font-setting" data-font-type="${fontType.key}">
                <div class="kb-font-setting-header">
                    <div class="kb-font-setting-info">
                        <div class="kb-font-setting-name">${fontType.name}</div>
                        <div class="kb-font-setting-description">${fontType.description}</div>
                    </div>
                    <button class="kb-change-font">Change</button>
                </div>
                <div class="kb-font-preview" style="font-family: ${this.fonts[fontType.key].family}">
                    ${this.fonts[fontType.key].family}
                </div>
                <div class="kb-font-preview-text" style="font-family: ${this.fonts[fontType.key].family}">
                    The quick brown fox jumps over the lazy dog
                </div>
            </div>
        `).join('');
    }
    
    renderTypographyPresets() {
        const presets = [
            {
                name: 'Modern Business',
                fonts: {
                    primary: { family: 'Inter', weights: ['300', '400', '500', '600', '700'], fallback: 'sans-serif' },
                    secondary: { family: 'Playfair Display', weights: ['400', '700'], fallback: 'serif' },
                    heading: { family: 'Poppins', weights: ['400', '600', '700'], fallback: 'sans-serif' },
                    body: { family: 'Open Sans', weights: ['400', '600'], fallback: 'sans-serif' }
                }
            },
            {
                name: 'Creative Studio',
                fonts: {
                    primary: { family: 'Montserrat', weights: ['300', '400', '500', '600', '700'], fallback: 'sans-serif' },
                    secondary: { family: 'Lora', weights: ['400', '700'], fallback: 'serif' },
                    heading: { family: 'Oswald', weights: ['400', '600', '700'], fallback: 'sans-serif' },
                    body: { family: 'Source Sans Pro', weights: ['400', '600'], fallback: 'sans-serif' }
                }
            },
            {
                name: 'Elegant Magazine',
                fonts: {
                    primary: { family: 'Playfair Display', weights: ['400', '700'], fallback: 'serif' },
                    secondary: { family: 'Lato', weights: ['300', '400', '700'], fallback: 'sans-serif' },
                    heading: { family: 'Crimson Text', weights: ['400', '600', '700'], fallback: 'serif' },
                    body: { family: 'Merriweather', weights: ['300', '400', '700'], fallback: 'serif' }
                }
            },
            {
                name: 'Tech Startup',
                fonts: {
                    primary: { family: 'Roboto', weights: ['300', '400', '500', '700'], fallback: 'sans-serif' },
                    secondary: { family: 'Fira Code', weights: ['400', '500', '600'], fallback: 'monospace' },
                    heading: { family: 'Ubuntu', weights: ['400', '500', '700'], fallback: 'sans-serif' },
                    body: { family: 'Source Sans Pro', weights: ['400', '600'], fallback: 'sans-serif' }
                }
            }
        ];
        
        return presets.map(preset => `
            <div class="kb-typography-preset" data-preset='${JSON.stringify(preset.fonts)}'>
                <div class="kb-preset-name">${preset.name}</div>
                <div class="kb-preset-preview">
                    <div class="kb-preset-heading" style="font-family: ${preset.fonts.heading.family}">Heading</div>
                    <div class="kb-preset-body" style="font-family: ${preset.fonts.body.family}">Body text example</div>
                </div>
                <button class="kb-apply-preset">Apply</button>
            </div>
        `).join('');
    }
    
    renderGoogleFonts() {
        return this.googleFonts.slice(0, 20).map(font => `
            <div class="kb-google-font" data-font-family="${font.family}" data-font-category="${font.category}">
                <div class="kb-google-font-preview" style="font-family: '${font.family}'">
                    ${font.family}
                </div>
                <div class="kb-google-font-example" style="font-family: '${font.family}'">
                    The quick brown fox jumps over the lazy dog
                </div>
                <div class="kb-google-font-info">
                    <span class="kb-font-category">${font.category}</span>
                    <span class="kb-font-variants">${font.variants.length} weights</span>
                </div>
                <button class="kb-use-google-font">Use Font</button>
            </div>
        `).join('');
    }
    
    bindEvents() {
        const panel = document.querySelector('.kb-global-typography-panel');
        if (!panel) return;
        
        // Toggle panel
        panel.querySelector('.kb-global-typography-toggle').addEventListener('click', () => {
            const content = panel.querySelector('.kb-global-typography-content');
            const icon = panel.querySelector('.kb-global-typography-toggle i');
            
            content.classList.toggle('active');
            icon.classList.toggle('rotated');
        });
        
        // Change font buttons
        panel.querySelectorAll('.kb-change-font').forEach(button => {
            button.addEventListener('click', (e) => {
                const fontSetting = e.target.closest('.kb-font-setting');
                const fontType = fontSetting.dataset.fontType;
                this.openFontSelector(fontType);
            });
        });
        
        // Apply typography preset
        panel.querySelectorAll('.kb-apply-preset').forEach(button => {
            button.addEventListener('click', (e) => {
                const presetData = JSON.parse(e.target.closest('.kb-typography-preset').dataset.preset);
                this.applyTypographyPreset(presetData);
            });
        });
        
        // Google font search
        const searchInput = panel.querySelector('.kb-font-search-input');
        const categoryFilter = panel.querySelector('.kb-font-category-filter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterGoogleFonts();
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterGoogleFonts();
            });
        }
        
        // Use Google font
        panel.querySelectorAll('.kb-use-google-font').forEach(button => {
            button.addEventListener('click', (e) => {
                const fontItem = e.target.closest('.kb-google-font');
                const fontFamily = fontItem.dataset.fontFamily;
                this.showFontTypeSelector(fontFamily);
            });
        });
        
        // Reset typography
        panel.querySelector('.kb-reset-typography').addEventListener('click', () => {
            this.resetTypography();
        });
        
        // Export typography
        panel.querySelector('.kb-export-typography').addEventListener('click', () => {
            this.exportTypography();
        });
    }
    
    openFontSelector(fontType) {
        const modal = document.createElement('div');
        modal.className = 'kb-font-selector-modal';
        modal.innerHTML = `
            <div class="kb-font-selector-backdrop"></div>
            <div class="kb-font-selector">
                <div class="kb-font-selector-header">
                    <h3>Select Font for ${fontType}</h3>
                    <button class="kb-close-font-selector">
                        <i class="eicon-close"></i>
                    </button>
                </div>
                
                <div class="kb-font-selector-content">
                    <div class="kb-font-selector-search">
                        <input type="text" placeholder="Search fonts..." class="kb-font-selector-search-input">
                    </div>
                    
                    <div class="kb-font-selector-list">
                        ${this.renderFontSelectorList()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Bind modal events
        this.bindFontSelectorEvents(modal, fontType);
        
        // Show modal
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    renderFontSelectorList() {
        return this.googleFonts.map(font => `
            <div class="kb-font-selector-item" data-font-family="${font.family}">
                <div class="kb-font-selector-preview" style="font-family: '${font.family}'">
                    ${font.family}
                </div>
                <div class="kb-font-selector-example" style="font-family: '${font.family}'">
                    The quick brown fox jumps over the lazy dog
                </div>
                <button class="kb-select-font">Select</button>
            </div>
        `).join('');
    }
    
    bindFontSelectorEvents(modal, fontType) {
        // Close modal
        modal.querySelector('.kb-close-font-selector').addEventListener('click', () => {
            this.closeFontSelector(modal);
        });
        
        modal.querySelector('.kb-font-selector-backdrop').addEventListener('click', () => {
            this.closeFontSelector(modal);
        });
        
        // Search fonts
        modal.querySelector('.kb-font-selector-search-input').addEventListener('input', (e) => {
            this.searchFonts(modal, e.target.value);
        });
        
        // Select font
        modal.querySelectorAll('.kb-select-font').forEach(button => {
            button.addEventListener('click', (e) => {
                const fontItem = e.target.closest('.kb-font-selector-item');
                const fontFamily = fontItem.dataset.fontFamily;
                const googleFont = this.googleFonts.find(gf => gf.family === fontFamily);
                
                if (googleFont) {
                    this.fonts[fontType] = {
                        family: fontFamily,
                        weights: googleFont.variants,
                        fallback: googleFont.category
                    };
                    
                    this.saveFonts();
                    this.updateFontUI();
                    this.closeFontSelector(modal);
                }
            });
        });
    }
    
    closeFontSelector(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    
    searchFonts(modal, query) {
        const items = modal.querySelectorAll('.kb-font-selector-item');
        items.forEach(item => {
            const fontFamily = item.dataset.fontFamily.toLowerCase();
            const visible = fontFamily.includes(query.toLowerCase());
            item.style.display = visible ? 'block' : 'none';
        });
    }
    
    showFontTypeSelector(fontFamily) {
        const fontTypes = [
            { key: 'primary', name: 'Primary Font' },
            { key: 'secondary', name: 'Secondary Font' },
            { key: 'heading', name: 'Heading Font' },
            { key: 'body', name: 'Body Font' }
        ];
        
        const modal = document.createElement('div');
        modal.className = 'kb-font-type-selector-modal';
        modal.innerHTML = `
            <div class="kb-font-type-selector-backdrop"></div>
            <div class="kb-font-type-selector">
                <div class="kb-font-type-selector-header">
                    <h3>Apply "${fontFamily}" to:</h3>
                    <button class="kb-close-font-type-selector">
                        <i class="eicon-close"></i>
                    </button>
                </div>
                
                <div class="kb-font-type-selector-content">
                    ${fontTypes.map(type => `
                        <button class="kb-font-type-option" data-font-type="${type.key}">
                            ${type.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Bind events
        modal.querySelector('.kb-close-font-type-selector').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.kb-font-type-selector-backdrop').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelectorAll('.kb-font-type-option').forEach(button => {
            button.addEventListener('click', (e) => {
                const fontType = e.target.dataset.fontType;
                const googleFont = this.googleFonts.find(gf => gf.family === fontFamily);
                
                if (googleFont) {
                    this.fonts[fontType] = {
                        family: fontFamily,
                        weights: googleFont.variants,
                        fallback: googleFont.category
                    };
                    
                    this.saveFonts();
                    this.updateFontUI();
                    modal.remove();
                }
            });
        });
        
        // Show modal
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    filterGoogleFonts() {
        const panel = document.querySelector('.kb-global-typography-panel');
        const searchInput = panel.querySelector('.kb-font-search-input');
        const categoryFilter = panel.querySelector('.kb-font-category-filter');
        const fontItems = panel.querySelectorAll('.kb-google-font');
        
        const searchTerm = searchInput.value.toLowerCase();
        const categoryFilter_value = categoryFilter.value;
        
        fontItems.forEach(item => {
            const fontFamily = item.dataset.fontFamily.toLowerCase();
            const fontCategory = item.dataset.fontCategory;
            
            const matchesSearch = fontFamily.includes(searchTerm);
            const matchesCategory = !categoryFilter_value || fontCategory === categoryFilter_value;
            
            item.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });
    }
    
    applyTypographyPreset(presetFonts) {
        this.fonts = { ...this.fonts, ...presetFonts };
        this.saveFonts();
        this.updateFontUI();
    }
    
    resetTypography() {
        if (confirm('Are you sure you want to reset typography to default?')) {
            this.fonts = {
                primary: { family: 'Inter', weights: ['300', '400', '500', '600', '700'], fallback: 'sans-serif' },
                secondary: { family: 'Playfair Display', weights: ['400', '700'], fallback: 'serif' },
                heading: { family: 'Poppins', weights: ['400', '600', '700'], fallback: 'sans-serif' },
                body: { family: 'Open Sans', weights: ['400', '600'], fallback: 'sans-serif' }
            };
            
            this.saveFonts();
            this.updateFontUI();
        }
    }
    
    exportTypography() {
        const typographyData = {
            fonts: this.fonts
        };
        
        const blob = new Blob([JSON.stringify(typographyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kingsbuilder-typography.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    updateFontUI() {
        const panel = document.querySelector('.kb-global-typography-panel');
        if (!panel) return;
        
        const fontSettings = panel.querySelector('.kb-font-settings');
        if (fontSettings) {
            fontSettings.innerHTML = this.renderFontSettings();
        }
        
        // Re-bind events
        this.bindEvents();
    }
    
    notifyTypographyChange() {
        // Notify other components that typography has changed
        window.dispatchEvent(new CustomEvent('kingsbuilder:typographyChanged', {
            detail: { fonts: this.fonts }
        }));
    }
    
    // Public API
    getFont(fontType) {
        return this.fonts[fontType];
    }
    
    setFont(fontType, fontConfig) {
        this.fonts[fontType] = fontConfig;
        this.saveFonts();
    }
    
    getAllFonts() {
        return { ...this.fonts };
    }
    
    getFontCSS(fontType) {
        const font = this.fonts[fontType];
        return `"${font.family}", ${font.fallback}`;
    }
}

// Initialize Global Typography System
window.globalTypography = new GlobalTypographySystem();