// 🏗️ THEME BUILDER - Professional Header/Footer/Archive Builder
// Completes Phase 4: Professional Features - Theme Builder
console.log('🏗️ THEME BUILDER: Loading professional theme building system...');

class ThemeBuilder {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.currentThemeType = 'header';
        this.themeTemplates = {};
        this.customThemes = {};
        
        if (this.isBuilder) {
            this.init();
        }
    }

    init() {
        console.log('🔧 Initializing Theme Builder...');
        
        setTimeout(() => {
            this.setupThemeTemplates();
            this.setupThemeBuilder();
            this.addThemeBuilderTab();
            this.initializeThemePreview();
            console.log('✅ THEME BUILDER: Professional theme building system active!');
        }, 3000);
    }

    setupThemeTemplates() {
        console.log('🏗️ Setting up professional theme templates...');
        
        this.themeTemplates = {
            headers: {
                modern: {
                    name: 'Modern Header',
                    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=100&fit=crop',
                    structure: {
                        type: 'header',
                        layout: 'horizontal',
                        background: 'white',
                        height: '80px',
                        elements: [
                            {
                                type: 'logo',
                                position: 'left',
                                content: 'Your Logo',
                                styles: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }
                            },
                            {
                                type: 'navigation',
                                position: 'center',
                                items: ['Home', 'About', 'Services', 'Contact'],
                                styles: { gap: '30px', fontSize: '16px', color: '#374151' }
                            },
                            {
                                type: 'cta',
                                position: 'right',
                                content: 'Get Started',
                                styles: { background: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '6px' }
                            }
                        ]
                    }
                },
                
                minimal: {
                    name: 'Minimal Header',
                    preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=100&fit=crop',
                    structure: {
                        type: 'header',
                        layout: 'centered',
                        background: '#f9fafb',
                        height: '60px',
                        elements: [
                            {
                                type: 'logo',
                                position: 'center',
                                content: 'BRAND',
                                styles: { fontSize: '20px', fontWeight: '300', color: '#1f2937', letterSpacing: '2px' }
                            },
                            {
                                type: 'navigation',
                                position: 'below',
                                items: ['Home', 'Work', 'About', 'Contact'],
                                styles: { gap: '40px', fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }
                            }
                        ]
                    }
                },
                
                ecommerce: {
                    name: 'E-commerce Header',
                    preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=100&fit=crop',
                    structure: {
                        type: 'header',
                        layout: 'complex',
                        background: 'white',
                        height: '100px',
                        elements: [
                            {
                                type: 'logo',
                                position: 'left',
                                content: 'SHOP',
                                styles: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }
                            },
                            {
                                type: 'search',
                                position: 'center',
                                placeholder: 'Search products...',
                                styles: { width: '400px', padding: '12px', borderRadius: '8px' }
                            },
                            {
                                type: 'actions',
                                position: 'right',
                                items: ['Account', 'Wishlist', 'Cart (0)'],
                                styles: { gap: '20px', fontSize: '14px', color: '#374151' }
                            },
                            {
                                type: 'navigation',
                                position: 'below',
                                items: ['New Arrivals', 'Men', 'Women', 'Kids', 'Sale'],
                                styles: { gap: '30px', fontSize: '16px', color: '#374151', padding: '15px 0' }
                            }
                        ]
                    }
                }
            },
            
            footers: {
                corporate: {
                    name: 'Corporate Footer',
                    preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=150&fit=crop',
                    structure: {
                        type: 'footer',
                        layout: 'columns',
                        background: '#1f2937',
                        color: 'white',
                        padding: '60px 0 30px',
                        elements: [
                            {
                                type: 'column',
                                title: 'Company',
                                items: ['About Us', 'Our Team', 'Careers', 'News'],
                                styles: { color: '#d1d5db' }
                            },
                            {
                                type: 'column',
                                title: 'Services',
                                items: ['Web Design', 'Development', 'Marketing', 'Consulting'],
                                styles: { color: '#d1d5db' }
                            },
                            {
                                type: 'column',
                                title: 'Support',
                                items: ['Help Center', 'Contact', 'Documentation', 'Status'],
                                styles: { color: '#d1d5db' }
                            },
                            {
                                type: 'column',
                                title: 'Connect',
                                items: ['Newsletter', 'Social Media', 'Blog', 'Events'],
                                styles: { color: '#d1d5db' }
                            },
                            {
                                type: 'bottom',
                                content: '© 2024 Your Company. All rights reserved.',
                                styles: { textAlign: 'center', borderTop: '1px solid #374151', paddingTop: '30px', marginTop: '40px' }
                            }
                        ]
                    }
                },
                
                simple: {
                    name: 'Simple Footer',
                    preview: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=400&h=150&fit=crop',
                    structure: {
                        type: 'footer',
                        layout: 'centered',
                        background: '#f9fafb',
                        padding: '40px 0',
                        elements: [
                            {
                                type: 'social',
                                platforms: ['facebook', 'twitter', 'instagram', 'linkedin'],
                                styles: { gap: '20px', marginBottom: '20px' }
                            },
                            {
                                type: 'navigation',
                                items: ['Privacy', 'Terms', 'Contact', 'About'],
                                styles: { gap: '30px', fontSize: '14px', color: '#6b7280' }
                            },
                            {
                                type: 'copyright',
                                content: '© 2024 Your Brand',
                                styles: { fontSize: '14px', color: '#9ca3af', marginTop: '20px' }
                            }
                        ]
                    }
                }
            },
            
            archives: {
                blog: {
                    name: 'Blog Archive',
                    preview: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=400&h=200&fit=crop',
                    structure: {
                        type: 'archive',
                        layout: 'grid',
                        columns: 3,
                        elements: [
                            {
                                type: 'title',
                                content: 'Latest Articles',
                                styles: { fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }
                            },
                            {
                                type: 'filters',
                                items: ['All', 'Technology', 'Design', 'Business'],
                                styles: { gap: '20px', marginBottom: '30px', textAlign: 'center' }
                            },
                            {
                                type: 'posts',
                                layout: 'grid',
                                itemTemplate: {
                                    image: true,
                                    title: true,
                                    excerpt: true,
                                    meta: ['date', 'author', 'category'],
                                    readMore: true
                                }
                            },
                            {
                                type: 'pagination',
                                style: 'numbers',
                                position: 'center'
                            }
                        ]
                    }
                },
                
                portfolio: {
                    name: 'Portfolio Archive',
                    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
                    structure: {
                        type: 'archive',
                        layout: 'masonry',
                        columns: 4,
                        elements: [
                            {
                                type: 'title',
                                content: 'Our Work',
                                styles: { fontSize: '42px', fontWeight: 'bold', textAlign: 'center', marginBottom: '50px' }
                            },
                            {
                                type: 'categories',
                                items: ['All', 'Web Design', 'Branding', 'Photography'],
                                styles: { gap: '25px', marginBottom: '40px', textAlign: 'center' }
                            },
                            {
                                type: 'projects',
                                layout: 'masonry',
                                itemTemplate: {
                                    image: true,
                                    overlay: true,
                                    title: true,
                                    category: true,
                                    link: true
                                }
                            }
                        ]
                    }
                }
            }
        };
    }

    setupThemeBuilder() {
        console.log('🔧 Setting up theme builder interface...');
        
        this.createThemeBuilderPanel();
    }

    addThemeBuilderTab() {
        const navTabs = document.querySelector('.nav-tabs, .builder-nav, .sidebar-nav');
        if (!navTabs) return;
        
        // Check if theme tab already exists
        if (document.querySelector('[data-tab="theme"]')) return;
        
        const themeTab = document.createElement('div');
        themeTab.className = 'nav-tab';
        themeTab.setAttribute('data-tab', 'theme');
        themeTab.innerHTML = `
            <i class="fas fa-layer-group"></i>
            <span>Theme</span>
        `;
        
        themeTab.style.cssText = `
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
        
        themeTab.addEventListener('click', () => this.showThemeBuilder());
        navTabs.appendChild(themeTab);
    }

    createThemeBuilderPanel() {
        const sidebar = document.querySelector('.sidebar, .left-panel, .builder-sidebar');
        if (!sidebar) return;
        
        const themePanel = document.createElement('div');
        themePanel.id = 'theme-panel';
        themePanel.className = 'panel-content';
        themePanel.style.display = 'none';
        
        themePanel.innerHTML = `
            <div class="theme-panel-content" style="padding: 20px; height: 100%; overflow-y: auto;">
                <!-- Theme Type Selector -->
                <div class="theme-type-selector" style="margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937;">
                        <i class="fas fa-layer-group"></i> Theme Builder
                    </h3>
                    <div class="theme-types" style="display: flex; gap: 8px; margin-bottom: 20px;">
                        <button onclick="themeBuilder.switchThemeType('header')" 
                                class="theme-type-btn active" data-type="header"
                                style="flex: 1; padding: 10px; border: 2px solid #3b82f6; background: #3b82f6; color: white; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.3s;">
                            Headers
                        </button>
                        <button onclick="themeBuilder.switchThemeType('footer')" 
                                class="theme-type-btn" data-type="footer"
                                style="flex: 1; padding: 10px; border: 2px solid #e5e7eb; background: white; color: #374151; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.3s;">
                            Footers
                        </button>
                        <button onclick="themeBuilder.switchThemeType('archive')" 
                                class="theme-type-btn" data-type="archive"
                                style="flex: 1; padding: 10px; border: 2px solid #e5e7eb; background: white; color: #374151; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.3s;">
                            Archives
                        </button>
                    </div>
                </div>
                
                <!-- Theme Templates -->
                <div class="theme-templates" id="theme-templates">
                    ${this.renderThemeTemplates('header')}
                </div>
                
                <!-- Custom Theme Builder -->
                <div class="custom-theme-section" style="margin-top: 30px; padding-top: 25px; border-top: 2px solid #f3f4f6;">
                    <h4 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-magic"></i>
                        Custom Builder
                    </h4>
                    <button onclick="themeBuilder.startCustomBuilder()" 
                            style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.3s; margin-bottom: 15px;">
                        <i class="fas fa-plus"></i> Create Custom ${this.currentThemeType}
                    </button>
                    
                    <div class="theme-actions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="themeBuilder.importTheme()" 
                                style="background: #10b981; color: white; border: none; padding: 10px; border-radius: 6px; font-size: 14px; cursor: pointer;">
                            <i class="fas fa-upload"></i> Import
                        </button>
                        <button onclick="themeBuilder.exportTheme()" 
                                style="background: #f59e0b; color: white; border: none; padding: 10px; border-radius: 6px; font-size: 14px; cursor: pointer;">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>
                
                <!-- Theme Preview -->
                <div class="theme-preview-section" style="margin-top: 25px; padding-top: 25px; border-top: 2px solid #f3f4f6;">
                    <h4 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-eye"></i>
                        Live Preview
                    </h4>
                    <div class="theme-preview" id="theme-preview" 
                         style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; min-height: 150px; display: flex; align-items: center; justify-content: center; color: #6b7280;">
                        Select a theme to preview
                    </div>
                </div>
            </div>
        `;
        
        sidebar.appendChild(themePanel);
    }

    renderThemeTemplates(type) {
        const templates = this.themeTemplates[type + 's'] || {};
        
        return `
            <div class="templates-grid" style="display: flex; flex-direction: column; gap: 15px;">
                ${Object.entries(templates).map(([key, template]) => `
                    <div class="theme-template" 
                         data-template="${key}" 
                         data-type="${type}"
                         onclick="themeBuilder.selectTemplate('${type}', '${key}')"
                         style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s;"
                         onmouseover="this.style.borderColor='#3b82f6'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(59,130,246,0.15)'"
                         onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        
                        <div class="template-preview" style="height: 80px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 12px;">
                            ${template.name} Preview
                        </div>
                        
                        <div class="template-info" style="padding: 15px;">
                            <h5 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1f2937;">
                                ${template.name}
                            </h5>
                            <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.4;">
                                ${this.getTemplateDescription(type, key)}
                            </p>
                            <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ${type.toUpperCase()}
                                </span>
                                <button onclick="event.stopPropagation(); themeBuilder.previewTemplate('${type}', '${key}')" 
                                        style="background: #f3f4f6; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; color: #6b7280; cursor: pointer;">
                                    Preview
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getTemplateDescription(type, key) {
        const descriptions = {
            header: {
                modern: 'Clean horizontal layout with logo, navigation, and CTA button',
                minimal: 'Centered minimal design with subtle navigation',
                ecommerce: 'Full-featured e-commerce header with search and cart'
            },
            footer: {
                corporate: 'Multi-column corporate footer with comprehensive links',
                simple: 'Clean centered footer with social links and copyright'
            },
            archive: {
                blog: 'Grid-based blog archive with filters and pagination',
                portfolio: 'Masonry portfolio layout with category filtering'
            }
        };
        
        return descriptions[type]?.[key] || 'Professional theme template';
    }

    showThemeBuilder() {
        // Hide all other panels
        document.querySelectorAll('.panel-content').forEach(panel => {
            panel.style.display = 'none';
        });
        
        // Show theme panel
        const themePanel = document.getElementById('theme-panel');
        if (themePanel) {
            themePanel.style.display = 'block';
        }
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.background = 'transparent';
            tab.style.color = '#6b7280';
        });
        
        const themeTab = document.querySelector('[data-tab="theme"]');
        if (themeTab) {
            themeTab.classList.add('active');
            themeTab.style.background = '#3b82f6';
            themeTab.style.color = 'white';
        }
    }

    switchThemeType(type) {
        console.log(`🔧 Switching to ${type} builder`);
        
        this.currentThemeType = type;
        
        // Update button states
        document.querySelectorAll('.theme-type-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'white';
            btn.style.color = '#374151';
            btn.style.borderColor = '#e5e7eb';
        });
        
        const activeBtn = document.querySelector(`[data-type="${type}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.style.background = '#3b82f6';
            activeBtn.style.color = 'white';
            activeBtn.style.borderColor = '#3b82f6';
        }
        
        // Update templates display
        const templatesContainer = document.getElementById('theme-templates');
        if (templatesContainer) {
            templatesContainer.innerHTML = this.renderThemeTemplates(type);
        }
        
        // Update custom builder button text
        const customBtn = document.querySelector('.custom-theme-section button');
        if (customBtn) {
            customBtn.innerHTML = `<i class="fas fa-plus"></i> Create Custom ${type}`;
        }
    }

    selectTemplate(type, templateKey) {
        console.log(`🎨 Selecting ${type} template: ${templateKey}`);
        
        const template = this.themeTemplates[type + 's'][templateKey];
        if (!template) return;
        
        // Apply template to current page
        this.applyTemplate(template);
        
        // Update preview
        this.previewTemplate(type, templateKey);
        
        // Show success message
        this.showSuccessMessage(`Applied ${template.name} template`);
    }

    previewTemplate(type, templateKey) {
        console.log(`👁️ Previewing ${type} template: ${templateKey}`);
        
        const template = this.themeTemplates[type + 's'][templateKey];
        if (!template) return;
        
        const previewContainer = document.getElementById('theme-preview');
        if (!previewContainer) return;
        
        previewContainer.innerHTML = this.generateTemplatePreview(template);
    }

    generateTemplatePreview(template) {
        const structure = template.structure;
        
        switch (structure.type) {
            case 'header':
                return this.generateHeaderPreview(structure);
            case 'footer':
                return this.generateFooterPreview(structure);
            case 'archive':
                return this.generateArchivePreview(structure);
            default:
                return '<div style="color: #6b7280;">Preview not available</div>';
        }
    }

    generateHeaderPreview(structure) {
        return `
            <div style="width: 100%; background: ${structure.background}; height: ${structure.height}; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; font-size: 12px;">
                ${structure.elements.map(element => {
                    switch (element.type) {
                        case 'logo':
                            return `<div style="font-weight: bold; color: ${element.styles.color};">${element.content}</div>`;
                        case 'navigation':
                            return `<div style="display: flex; gap: 15px; color: ${element.styles.color};">${element.items.map(item => `<span>${item}</span>`).join('')}</div>`;
                        case 'cta':
                            return `<div style="background: ${element.styles.background}; color: ${element.styles.color}; padding: 5px 10px; border-radius: 4px; font-size: 11px;">${element.content}</div>`;
                        case 'search':
                            return `<div style="background: #f3f4f6; padding: 5px 10px; border-radius: 4px; color: #6b7280; font-size: 11px;">🔍 ${element.placeholder}</div>`;
                        default:
                            return '';
                    }
                }).join('')}
            </div>
        `;
    }

    generateFooterPreview(structure) {
        return `
            <div style="width: 100%; background: ${structure.background}; color: ${structure.color}; padding: 20px; font-size: 10px;">
                ${structure.layout === 'columns' ? `
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                        ${structure.elements.filter(el => el.type === 'column').map(col => `
                            <div>
                                <div style="font-weight: bold; margin-bottom: 5px;">${col.title}</div>
                                ${col.items.map(item => `<div style="margin-bottom: 2px; opacity: 0.8;">${item}</div>`).join('')}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div style="text-align: center; opacity: 0.7; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                    © 2024 Your Company
                </div>
            </div>
        `;
    }

    generateArchivePreview(structure) {
        return `
            <div style="width: 100%; padding: 15px; font-size: 10px;">
                <div style="text-align: center; font-weight: bold; margin-bottom: 10px;">Archive Title</div>
                <div style="display: grid; grid-template-columns: repeat(${structure.columns}, 1fr); gap: 8px;">
                    ${Array.from({length: 6}, (_, i) => `
                        <div style="background: #f3f4f6; height: 40px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #6b7280;">
                            Item ${i + 1}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    applyTemplate(template) {
        console.log(`🚀 Applying template: ${template.name}`);
        
        const structure = template.structure;
        
        // Create the theme element based on type
        let themeHTML = '';
        
        switch (structure.type) {
            case 'header':
                themeHTML = this.buildHeaderHTML(structure);
                break;
            case 'footer':
                themeHTML = this.buildFooterHTML(structure);
                break;
            case 'archive':
                themeHTML = this.buildArchiveHTML(structure);
                break;
        }
        
        // Add to canvas
        this.addThemeToCanvas(themeHTML, structure.type);
    }

    buildHeaderHTML(structure) {
        return `
            <header class="kb-element kb-header-element" data-element-type="header" data-element-id="${this.generateElementId()}" 
                    style="background: ${structure.background}; height: ${structure.height}; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; position: relative;">
                
                ${structure.elements.map(element => {
                    switch (element.type) {
                        case 'logo':
                            return `
                                <div class="header-logo" style="font-size: ${element.styles.fontSize}; font-weight: ${element.styles.fontWeight}; color: ${element.styles.color};">
                                    ${element.content}
                                </div>
                            `;
                        case 'navigation':
                            return `
                                <nav class="header-nav" style="display: flex; gap: ${element.styles.gap}; font-size: ${element.styles.fontSize}; color: ${element.styles.color};">
                                    ${element.items.map(item => `
                                        <a href="#" style="color: inherit; text-decoration: none; transition: opacity 0.3s;" 
                                           onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">${item}</a>
                                    `).join('')}
                                </nav>
                            `;
                        case 'cta':
                            return `
                                <button class="header-cta" style="background: ${element.styles.background}; color: ${element.styles.color}; padding: ${element.styles.padding}; border: none; border-radius: ${element.styles.borderRadius}; cursor: pointer; transition: all 0.3s;"
                                        onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15)'"
                                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                    ${element.content}
                                </button>
                            `;
                        case 'search':
                            return `
                                <div class="header-search" style="position: relative;">
                                    <input type="text" placeholder="${element.placeholder}" 
                                           style="width: ${element.styles.width}; padding: ${element.styles.padding}; border: 1px solid #e5e7eb; border-radius: ${element.styles.borderRadius}; font-size: 14px;">
                                    <i class="fas fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #6b7280;"></i>
                                </div>
                            `;
                        default:
                            return '';
                    }
                }).join('')}
                
                ${this.getElementControls(this.generateElementId())}
            </header>
        `;
    }

    buildFooterHTML(structure) {
        return `
            <footer class="kb-element kb-footer-element" data-element-type="footer" data-element-id="${this.generateElementId()}" 
                    style="background: ${structure.background}; color: ${structure.color}; padding: ${structure.padding}; position: relative;">
                
                ${structure.layout === 'columns' ? `
                    <div class="footer-columns" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; max-width: 1200px; margin: 0 auto;">
                        ${structure.elements.filter(el => el.type === 'column').map(column => `
                            <div class="footer-column">
                                <h4 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">${column.title}</h4>
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    ${column.items.map(item => `
                                        <li style="margin-bottom: 12px;">
                                            <a href="#" style="color: ${column.styles.color}; text-decoration: none; transition: opacity 0.3s;"
                                               onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">${item}</a>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${structure.elements.find(el => el.type === 'bottom') ? `
                    <div class="footer-bottom" style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; margin-top: 40px; max-width: 1200px; margin-left: auto; margin-right: auto;">
                        ${structure.elements.find(el => el.type === 'bottom').content}
                    </div>
                ` : ''}
                
                ${this.getElementControls(this.generateElementId())}
            </footer>
        `;
    }

    buildArchiveHTML(structure) {
        return `
            <section class="kb-element kb-archive-element" data-element-type="archive" data-element-id="${this.generateElementId()}" 
                     style="padding: 60px 20px; position: relative;">
                
                <div class="archive-container" style="max-width: 1200px; margin: 0 auto;">
                    ${structure.elements.map(element => {
                        switch (element.type) {
                            case 'title':
                                return `
                                    <h1 style="font-size: ${element.styles.fontSize}; font-weight: ${element.styles.fontWeight}; text-align: ${element.styles.textAlign}; margin-bottom: ${element.styles.marginBottom}; color: #1f2937;">
                                        ${element.content}
                                    </h1>
                                `;
                            case 'filters':
                                return `
                                    <div class="archive-filters" style="display: flex; justify-content: center; gap: ${element.styles.gap}; margin-bottom: ${element.styles.marginBottom};">
                                        ${element.items.map(item => `
                                            <button style="background: transparent; border: 2px solid #e5e7eb; padding: 8px 20px; border-radius: 25px; cursor: pointer; transition: all 0.3s;"
                                                    onmouseover="this.style.borderColor='#3b82f6'; this.style.color='#3b82f6'"
                                                    onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">${item}</button>
                                        `).join('')}
                                    </div>
                                `;
                            case 'posts':
                            case 'projects':
                                return `
                                    <div class="archive-grid" style="display: grid; grid-template-columns: repeat(${structure.columns}, 1fr); gap: 30px; margin-bottom: 50px;">
                                        ${Array.from({length: 6}, (_, i) => `
                                            <article class="archive-item" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s;"
                                                     onmouseover="this.style.transform='translateY(-4px)'"
                                                     onmouseout="this.style.transform='translateY(0)'">
                                                <div style="height: 200px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); display: flex; align-items: center; justify-content: center; color: #6b7280;">
                                                    Image ${i + 1}
                                                </div>
                                                <div style="padding: 20px;">
                                                    <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #1f2937;">Sample Title ${i + 1}</h3>
                                                    <p style="margin: 0 0 15px 0; color: #6b7280; line-height: 1.6;">Sample excerpt or description text...</p>
                                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #9ca3af;">
                                                        <span>Jan ${i + 1}, 2024</span>
                                                        <a href="#" style="color: #3b82f6; text-decoration: none;">Read More</a>
                                                    </div>
                                                </div>
                                            </article>
                                        `).join('')}
                                    </div>
                                `;
                            case 'pagination':
                                return `
                                    <div class="archive-pagination" style="display: flex; justify-content: center; gap: 10px;">
                                        ${Array.from({length: 5}, (_, i) => `
                                            <button style="width: 40px; height: 40px; border: 2px solid #e5e7eb; background: ${i === 0 ? '#3b82f6' : 'white'}; color: ${i === 0 ? 'white' : '#374151'}; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
                                                ${i + 1}
                                            </button>
                                        `).join('')}
                                    </div>
                                `;
                            default:
                                return '';
                        }
                    }).join('')}
                </div>
                
                ${this.getElementControls(this.generateElementId())}
            </section>
        `;
    }

    addThemeToCanvas(themeHTML, type) {
        const canvas = document.querySelector('.canvas, .builder-canvas, #canvas');
        if (!canvas) return;
        
        // Add theme to appropriate position
        if (type === 'header') {
            canvas.insertAdjacentHTML('afterbegin', themeHTML);
        } else if (type === 'footer') {
            canvas.insertAdjacentHTML('beforeend', themeHTML);
        } else {
            canvas.insertAdjacentHTML('beforeend', themeHTML);
        }
        
        // Initialize element interactions
        this.initializeThemeElement();
    }

    startCustomBuilder() {
        console.log(`🎨 Starting custom ${this.currentThemeType} builder`);
        
        // Create custom builder modal
        this.showCustomBuilderModal();
    }

    showCustomBuilderModal() {
        const modal = document.createElement('div');
        modal.className = 'custom-builder-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; width: 90%; max-width: 800px; height: 80%; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;">
                    <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 20px; color: #1f2937;">Custom ${this.currentThemeType} Builder</h3>
                        <button onclick="this.parentNode.parentNode.parentNode.remove()" style="background: none; border: none; font-size: 24px; color: #6b7280; cursor: pointer;">&times;</button>
                    </div>
                    <div style="flex: 1; padding: 20px; overflow-y: auto;">
                        <p style="color: #6b7280; margin-bottom: 20px;">Build your custom ${this.currentThemeType} from scratch with our visual builder.</p>
                        <div style="text-align: center; padding: 60px 20px; background: #f9fafb; border-radius: 8px; color: #6b7280;">
                            <i class="fas fa-magic" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                            <h4 style="margin: 0 0 10px 0;">Custom Builder Coming Soon</h4>
                            <p style="margin: 0;">Advanced custom theme builder will be available in the next update.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    importTheme() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const theme = JSON.parse(e.target.result);
                        this.customThemes[theme.name] = theme;
                        this.showSuccessMessage(`Imported theme: ${theme.name}`);
                    } catch (error) {
                        this.showErrorMessage('Invalid theme file');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    exportTheme() {
        const theme = {
            name: `Custom ${this.currentThemeType}`,
            type: this.currentThemeType,
            templates: this.themeTemplates[this.currentThemeType + 's'],
            customizations: this.customThemes,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kingsbuilder-${this.currentThemeType}-theme.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage('Theme exported successfully!');
    }

    initializeThemePreview() {
        // Add CSS for theme builder
        const themeCSS = document.createElement('style');
        themeCSS.id = 'theme-builder-styles';
        themeCSS.textContent = `
            .theme-template:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(59,130,246,0.15);
            }
            
            .theme-type-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .kb-header-element {
                border-bottom: 1px solid #e5e7eb;
            }
            
            .kb-footer-element {
                border-top: 1px solid #e5e7eb;
            }
            
            .archive-item:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
        `;
        
        document.head.appendChild(themeCSS);
    }

    initializeThemeElement() {
        // Add hover effects and interactions to theme elements
        document.querySelectorAll('.kb-header-element, .kb-footer-element, .kb-archive-element').forEach(element => {
            element.addEventListener('mouseenter', () => {
                const controls = element.querySelector('.kb-element-controls');
                if (controls) {
                    controls.style.display = 'flex';
                }
            });
            
            element.addEventListener('mouseleave', () => {
                const controls = element.querySelector('.kb-element-controls');
                if (controls) {
                    controls.style.display = 'none';
                }
            });
        });
    }

    generateElementId() {
        return `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getElementControls(id) {
        return `
            <div class="kb-element-controls" style="position: absolute; top: 10px; right: 10px; display: none; gap: 5px; z-index: 100;">
                <button class="kb-element-control" onclick="themeBuilder.editThemeElement('${id}')" title="Edit Theme" 
                        style="background: #3b82f6; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-edit" style="font-size: 12px;"></i>
                </button>
                <button class="kb-element-control" onclick="themeBuilder.duplicateThemeElement('${id}')" title="Duplicate"
                        style="background: #10b981; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-copy" style="font-size: 12px;"></i>
                </button>
                <button class="kb-element-control danger" onclick="themeBuilder.deleteThemeElement('${id}')" title="Delete"
                        style="background: #ef4444; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-trash" style="font-size: 12px;"></i>
                </button>
            </div>
        `;
    }

    editThemeElement(id) {
        console.log(`✏️ Editing theme element: ${id}`);
        this.showSuccessMessage('Theme element editing coming soon!');
    }

    duplicateThemeElement(id) {
        console.log(`📋 Duplicating theme element: ${id}`);
        const element = document.querySelector(`[data-element-id="${id}"]`);
        if (element) {
            const clone = element.cloneNode(true);
            clone.setAttribute('data-element-id', this.generateElementId());
            element.parentNode.insertBefore(clone, element.nextSibling);
            this.showSuccessMessage('Theme element duplicated!');
        }
    }

    deleteThemeElement(id) {
        console.log(`🗑️ Deleting theme element: ${id}`);
        const element = document.querySelector(`[data-element-id="${id}"]`);
        if (element && confirm('Are you sure you want to delete this theme element?')) {
            element.remove();
            this.showSuccessMessage('Theme element deleted!');
        }
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
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

    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #ef4444; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-circle"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize Theme Builder
console.log('🏗️ THEME BUILDER: Initializing...');
window.themeBuilder = new ThemeBuilder();

console.log('✅ THEME BUILDER: Professional theme building system loaded!');