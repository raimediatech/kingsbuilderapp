// Professional Template System - Enterprise-Level Templates
// Part of KingsBuilder Phase 4.1: Professional Features

class TemplateSystem {
    constructor() {
        this.templates = {
            pages: [
                {
                    id: 'home-business',
                    name: 'Business Homepage',
                    category: 'Business',
                    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
                    description: 'Professional business homepage with hero section, services, and testimonials',
                    structure: {
                        sections: [
                            {
                                type: 'hero',
                                settings: {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    height: '100vh',
                                    content: {
                                        title: 'Transform Your Business Today',
                                        subtitle: 'Professional solutions for modern companies',
                                        buttons: [
                                            { text: 'Get Started', style: 'primary' },
                                            { text: 'Learn More', style: 'secondary' }
                                        ]
                                    }
                                }
                            },
                            {
                                type: 'services',
                                settings: {
                                    columns: 3,
                                    style: 'cards',
                                    services: [
                                        { icon: 'chart-line', title: 'Analytics', description: 'Data-driven insights for growth' },
                                        { icon: 'cog', title: 'Automation', description: 'Streamlined business processes' },
                                        { icon: 'shield', title: 'Security', description: 'Enterprise-grade protection' }
                                    ]
                                }
                            },
                            {
                                type: 'testimonials',
                                settings: {
                                    layout: 'carousel',
                                    items: 3,
                                    testimonials: [
                                        { name: 'John Smith', company: 'Tech Corp', rating: 5, text: 'Outstanding service and results!' },
                                        { name: 'Sarah Johnson', company: 'Design Studio', rating: 5, text: 'Exceeded all expectations!' },
                                        { name: 'Mike Davis', company: 'Marketing Inc', rating: 5, text: 'Highly recommended service!' }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    id: 'landing-saas',
                    name: 'SaaS Landing Page',
                    category: 'SaaS',
                    preview: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
                    description: 'Modern SaaS landing page with pricing, features, and CTA',
                    structure: {
                        sections: [
                            {
                                type: 'hero',
                                settings: {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    height: '90vh',
                                    content: {
                                        title: 'The Future of Software',
                                        subtitle: 'Powerful SaaS solution for growing businesses',
                                        buttons: [
                                            { text: 'Start Free Trial', style: 'primary' },
                                            { text: 'Watch Demo', style: 'outline' }
                                        ]
                                    }
                                }
                            },
                            {
                                type: 'features',
                                settings: {
                                    layout: 'grid',
                                    columns: 2,
                                    features: [
                                        { icon: 'rocket', title: 'Fast Performance', description: 'Lightning-fast speeds' },
                                        { icon: 'lock', title: 'Secure', description: 'Enterprise-grade security' },
                                        { icon: 'chart-bar', title: 'Analytics', description: 'Detailed insights' },
                                        { icon: 'users', title: 'Collaboration', description: 'Team workflow' }
                                    ]
                                }
                            },
                            {
                                type: 'pricing',
                                settings: {
                                    columns: 3,
                                    style: 'cards',
                                    plans: [
                                        { name: 'Starter', price: '$29', period: 'month', features: ['5 Projects', '10GB Storage', 'Basic Support'] },
                                        { name: 'Professional', price: '$79', period: 'month', features: ['25 Projects', '100GB Storage', 'Priority Support'], popular: true },
                                        { name: 'Enterprise', price: '$199', period: 'month', features: ['Unlimited Projects', '1TB Storage', '24/7 Support'] }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    id: 'portfolio-creative',
                    name: 'Creative Portfolio',
                    category: 'Portfolio',
                    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
                    description: 'Stunning portfolio for creative professionals',
                    structure: {
                        sections: [
                            {
                                type: 'hero',
                                settings: {
                                    background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                                    height: '80vh',
                                    content: {
                                        title: 'Creative Designer',
                                        subtitle: 'Bringing ideas to life through design',
                                        buttons: [
                                            { text: 'View Work', style: 'primary' },
                                            { text: 'Contact Me', style: 'outline' }
                                        ]
                                    }
                                }
                            },
                            {
                                type: 'portfolio',
                                settings: {
                                    layout: 'masonry',
                                    columns: 3,
                                    filter: true,
                                    categories: ['Web Design', 'Branding', 'Print Design']
                                }
                            }
                        ]
                    }
                },
                {
                    id: 'ecommerce-shop',
                    name: 'E-commerce Shop',
                    category: 'E-commerce',
                    preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
                    description: 'Complete e-commerce store with product showcase',
                    structure: {
                        sections: [
                            {
                                type: 'hero',
                                settings: {
                                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                                    height: '70vh',
                                    content: {
                                        title: 'Premium Products',
                                        subtitle: 'Discover our latest collection',
                                        buttons: [
                                            { text: 'Shop Now', style: 'primary' },
                                            { text: 'View Collection', style: 'secondary' }
                                        ]
                                    }
                                }
                            },
                            {
                                type: 'products',
                                settings: {
                                    layout: 'grid',
                                    columns: 4,
                                    filter: true,
                                    categories: ['Electronics', 'Fashion', 'Home & Garden', 'Sports']
                                }
                            }
                        ]
                    }
                }
            ],
            sections: [
                {
                    id: 'hero-modern',
                    name: 'Modern Hero Section',
                    category: 'Hero',
                    preview: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop',
                    description: 'Clean, modern hero section with gradient background',
                    structure: {
                        type: 'hero',
                        settings: {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            height: '80vh',
                            content: {
                                title: 'Your Amazing Title Here',
                                subtitle: 'Compelling subtitle that converts',
                                buttons: [
                                    { text: 'Get Started', style: 'primary' },
                                    { text: 'Learn More', style: 'outline' }
                                ]
                            }
                        }
                    }
                },
                {
                    id: 'services-grid',
                    name: 'Services Grid',
                    category: 'Services',
                    preview: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
                    description: 'Responsive services grid with icons and descriptions',
                    structure: {
                        type: 'services',
                        settings: {
                            columns: 3,
                            style: 'cards',
                            services: [
                                { icon: 'design', title: 'Design', description: 'Beautiful, user-friendly designs' },
                                { icon: 'development', title: 'Development', description: 'Modern, responsive websites' },
                                { icon: 'marketing', title: 'Marketing', description: 'Strategic digital marketing' }
                            ]
                        }
                    }
                },
                {
                    id: 'testimonials-carousel',
                    name: 'Testimonials Carousel',
                    category: 'Testimonials',
                    preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
                    description: 'Elegant testimonials carousel with customer reviews',
                    structure: {
                        type: 'testimonials',
                        settings: {
                            layout: 'carousel',
                            items: 3,
                            testimonials: [
                                { name: 'Alex Johnson', company: 'StartupCorp', rating: 5, text: 'Exceptional service and results!' },
                                { name: 'Maria Garcia', company: 'TechFlow', rating: 5, text: 'Exceeded all our expectations!' },
                                { name: 'David Chen', company: 'Innovation Labs', rating: 5, text: 'Outstanding quality and support!' }
                            ]
                        }
                    }
                },
                {
                    id: 'pricing-table',
                    name: 'Pricing Table',
                    category: 'Pricing',
                    preview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
                    description: 'Professional pricing table with multiple plans',
                    structure: {
                        type: 'pricing',
                        settings: {
                            columns: 3,
                            style: 'cards',
                            plans: [
                                { name: 'Basic', price: '19', period: 'month', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
                                { name: 'Pro', price: '49', period: 'month', features: ['All Basic', 'Feature 4', 'Feature 5'], popular: true },
                                { name: 'Enterprise', price: '99', period: 'month', features: ['All Pro', 'Feature 6', 'Feature 7'] }
                            ]
                        }
                    }
                }
            ]
        };
        
        this.savedTemplates = [];
        this.init();
    }
    
    init() {
        this.loadSavedTemplates();
        this.setupUI();
        this.addTemplateButton();
    }
    
    loadSavedTemplates() {
        const saved = localStorage.getItem('kingsbuilder_saved_templates');
        if (saved) {
            try {
                this.savedTemplates = JSON.parse(saved);
            } catch (e) {
                console.warn('Error loading saved templates:', e);
            }
        }
    }
    
    setupUI() {
        this.createTemplateLibrary();
        this.bindEvents();
    }
    
    createTemplateLibrary() {
        const library = document.createElement('div');
        library.className = 'kb-template-library';
        library.innerHTML = `
            <div class="kb-template-library-overlay"></div>
            <div class="kb-template-library-modal">
                <div class="kb-template-library-header">
                    <h2>
                        <i class="eicon-library"></i>
                        Template Library
                    </h2>
                    <button class="kb-close-library">
                        <i class="eicon-close"></i>
                    </button>
                </div>
                
                <div class="kb-template-library-content">
                    <!-- Template Categories -->
                    <div class="kb-template-categories">
                        <button class="kb-template-category active" data-category="all">All Templates</button>
                        <button class="kb-template-category" data-category="pages">Pages</button>
                        <button class="kb-template-category" data-category="sections">Sections</button>
                        <button class="kb-template-category" data-category="saved">My Templates</button>
                    </div>
                    
                    <!-- Search and Filters -->
                    <div class="kb-template-search">
                        <div class="kb-search-box">
                            <input type="text" placeholder="Search templates..." class="kb-template-search-input">
                            <i class="eicon-search"></i>
                        </div>
                        <div class="kb-template-filters">
                            <select class="kb-template-filter">
                                <option value="">All Categories</option>
                                <option value="Business">Business</option>
                                <option value="SaaS">SaaS</option>
                                <option value="Portfolio">Portfolio</option>
                                <option value="E-commerce">E-commerce</option>
                                <option value="Hero">Hero</option>
                                <option value="Services">Services</option>
                                <option value="Testimonials">Testimonials</option>
                                <option value="Pricing">Pricing</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Template Grid -->
                    <div class="kb-template-grid">
                        ${this.renderTemplateGrid('all')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(library);
    }
    
    renderTemplateGrid(category) {
        let templates = [];
        
        if (category === 'all') {
            templates = [...this.templates.pages, ...this.templates.sections];
        } else if (category === 'pages') {
            templates = this.templates.pages;
        } else if (category === 'sections') {
            templates = this.templates.sections;
        } else if (category === 'saved') {
            templates = this.savedTemplates;
        }
        
        if (templates.length === 0) {
            return '<div class="kb-no-templates">No templates found. Create your first template!</div>';
        }
        
        return templates.map(template => `
            <div class="kb-template-item" data-template-id="${template.id}" data-category="${template.category}">
                <div class="kb-template-preview">
                    <img src="${template.preview}" alt="${template.name}" loading="lazy">
                    <div class="kb-template-overlay">
                        <div class="kb-template-actions">
                            <button class="kb-preview-template" title="Preview Template">
                                <i class="eicon-eye"></i>
                            </button>
                            <button class="kb-insert-template" title="Insert Template">
                                <i class="eicon-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="kb-template-info">
                    <h3 class="kb-template-name">${template.name}</h3>
                    <p class="kb-template-description">${template.description}</p>
                    <div class="kb-template-meta">
                        <span class="kb-template-category-tag">${template.category}</span>
                        <span class="kb-template-type">${this.getTemplateType(template)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    getTemplateType(template) {
        if (this.templates.pages.includes(template)) return 'Page';
        if (this.templates.sections.includes(template)) return 'Section';
        return 'Custom';
    }
    
    bindEvents() {
        const library = document.querySelector('.kb-template-library');
        if (!library) return;
        
        // Close library
        library.querySelector('.kb-close-library').addEventListener('click', () => {
            this.closeLibrary();
        });
        
        library.querySelector('.kb-template-library-overlay').addEventListener('click', () => {
            this.closeLibrary();
        });
        
        // Category switching
        library.querySelectorAll('.kb-template-category').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.switchCategory(category);
            });
        });
        
        // Search
        library.querySelector('.kb-template-search-input').addEventListener('input', (e) => {
            this.searchTemplates(e.target.value);
        });
        
        // Filter
        library.querySelector('.kb-template-filter').addEventListener('change', (e) => {
            this.filterTemplates(e.target.value);
        });
        
        // Template actions
        library.addEventListener('click', (e) => {
            if (e.target.closest('.kb-preview-template')) {
                const templateId = e.target.closest('.kb-template-item').dataset.templateId;
                this.previewTemplate(templateId);
            } else if (e.target.closest('.kb-insert-template')) {
                const templateId = e.target.closest('.kb-template-item').dataset.templateId;
                this.insertTemplate(templateId);
            }
        });
    }
    
    addTemplateButton() {
        // Add template button to toolbar
        const toolbar = document.querySelector('.elementor-panel-header');
        if (toolbar) {
            const templateButton = document.createElement('button');
            templateButton.className = 'kb-template-library-button';
            templateButton.innerHTML = '<i class="eicon-library"></i> Templates';
            templateButton.title = 'Open Template Library';
            templateButton.addEventListener('click', () => {
                this.showLibrary();
            });
            toolbar.appendChild(templateButton);
        }
    }
    
    showLibrary() {
        const library = document.querySelector('.kb-template-library');
        if (library) {
            library.classList.add('active');
            document.body.classList.add('kb-modal-open');
        }
    }
    
    closeLibrary() {
        const library = document.querySelector('.kb-template-library');
        if (library) {
            library.classList.remove('active');
            document.body.classList.remove('kb-modal-open');
        }
    }
    
    switchCategory(category) {
        const library = document.querySelector('.kb-template-library');
        
        // Update active category
        library.querySelectorAll('.kb-template-category').forEach(btn => {
            btn.classList.remove('active');
        });
        library.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Update grid
        const grid = library.querySelector('.kb-template-grid');
        grid.innerHTML = this.renderTemplateGrid(category);
    }
    
    searchTemplates(query) {
        const library = document.querySelector('.kb-template-library');
        const items = library.querySelectorAll('.kb-template-item');
        
        items.forEach(item => {
            const name = item.querySelector('.kb-template-name').textContent.toLowerCase();
            const description = item.querySelector('.kb-template-description').textContent.toLowerCase();
            const matches = name.includes(query.toLowerCase()) || description.includes(query.toLowerCase());
            
            item.style.display = matches ? 'block' : 'none';
        });
    }
    
    filterTemplates(category) {
        const library = document.querySelector('.kb-template-library');
        const items = library.querySelectorAll('.kb-template-item');
        
        items.forEach(item => {
            const itemCategory = item.dataset.category;
            const matches = !category || itemCategory === category;
            
            item.style.display = matches ? 'block' : 'none';
        });
    }
    
    previewTemplate(templateId) {
        const template = this.findTemplate(templateId);
        if (!template) return;
        
        const modal = document.createElement('div');
        modal.className = 'kb-template-preview-modal';
        modal.innerHTML = `
            <div class="kb-preview-backdrop"></div>
            <div class="kb-preview-container">
                <div class="kb-preview-header">
                    <h3>${template.name}</h3>
                    <button class="kb-close-preview">
                        <i class="eicon-close"></i>
                    </button>
                </div>
                
                <div class="kb-preview-content">
                    <div class="kb-preview-frame">
                        <img src="${template.preview}" alt="${template.name}">
                    </div>
                    
                    <div class="kb-preview-info">
                        <h4>Template Details</h4>
                        <p>${template.description}</p>
                        <div class="kb-preview-meta">
                            <span><strong>Category:</strong> ${template.category}</span>
                            <span><strong>Type:</strong> ${this.getTemplateType(template)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="kb-preview-actions">
                    <button class="kb-cancel-preview">Cancel</button>
                    <button class="kb-insert-from-preview">Insert Template</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Bind events
        modal.querySelector('.kb-close-preview').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.kb-preview-backdrop').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.kb-cancel-preview').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.kb-insert-from-preview').addEventListener('click', () => {
            this.insertTemplate(templateId);
            modal.remove();
        });
        
        // Show modal
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    insertTemplate(templateId) {
        const template = this.findTemplate(templateId);
        if (!template) return;
        
        // Insert template structure
        this.insertTemplateStructure(template.structure);
        
        // Close library
        this.closeLibrary();
        
        // Show success message
        this.showNotification(`Template "${template.name}" inserted successfully!`, 'success');
    }
    
    insertTemplateStructure(structure) {
        const editorContent = document.querySelector('.elementor-editor-content');
        if (!editorContent) return;
        
        if (structure.sections) {
            // Page template
            structure.sections.forEach(section => {
                this.createSection(section);
            });
        } else if (structure.type) {
            // Single section
            this.createSection(structure);
        }
    }
    
    createSection(sectionData) {
        const section = document.createElement('div');
        section.className = 'elementor-section kb-template-section';
        section.dataset.sectionType = sectionData.type;
        
        // Add content based on section type
        if (sectionData.type === 'hero') {
            section.innerHTML = this.generateHeroHTML(sectionData.settings);
        } else if (sectionData.type === 'services') {
            section.innerHTML = this.generateServicesHTML(sectionData.settings);
        } else if (sectionData.type === 'testimonials') {
            section.innerHTML = this.generateTestimonialsHTML(sectionData.settings);
        } else if (sectionData.type === 'pricing') {
            section.innerHTML = this.generatePricingHTML(sectionData.settings);
        }
        
        // Add to editor
        const editorContent = document.querySelector('.elementor-editor-content');
        if (editorContent) {
            editorContent.appendChild(section);
        }
        
        // Add edit functionality
        this.addEditFunctionality(section);
    }
    
    generateHeroHTML(settings) {
        return `
            <div class="kb-hero-section" style="background: ${settings.background}; height: ${settings.height}; display: flex; align-items: center; justify-content: center; text-align: center; color: white;">
                <div class="kb-hero-content" style="max-width: 800px; padding: 40px;">
                    <h1 class="kb-hero-title" style="font-size: 3rem; margin-bottom: 20px; font-weight: 700;">${settings.content.title}</h1>
                    <p class="kb-hero-subtitle" style="font-size: 1.5rem; margin-bottom: 40px; opacity: 0.9;">${settings.content.subtitle}</p>
                    <div class="kb-hero-buttons" style="display: flex; gap: 20px; justify-content: center;">
                        ${settings.content.buttons.map(btn => 
                            `<button class="kb-button kb-button-${btn.style}" style="padding: 15px 30px; font-size: 1.1rem; border: none; border-radius: 5px; cursor: pointer; ${btn.style === 'primary' ? 'background: #007cba; color: white;' : 'background: transparent; color: white; border: 2px solid white;'}">${btn.text}</button>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    generateServicesHTML(settings) {
        return `
            <div class="kb-services-section" style="padding: 80px 20px;">
                <div class="kb-services-container" style="max-width: 1200px; margin: 0 auto;">
                    <div class="kb-services-grid" style="display: grid; grid-template-columns: repeat(${settings.columns}, 1fr); gap: 40px;">
                        ${settings.services.map(service => `
                            <div class="kb-service-card" style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 10px; transition: transform 0.3s ease;">
                                <div class="kb-service-icon" style="font-size: 3rem; color: #007cba; margin-bottom: 20px;">
                                    <i class="eicon-${service.icon}"></i>
                                </div>
                                <h3 class="kb-service-title" style="font-size: 1.5rem; margin-bottom: 15px; color: #333;">${service.title}</h3>
                                <p class="kb-service-description" style="color: #666; line-height: 1.6;">${service.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    generateTestimonialsHTML(settings) {
        return `
            <div class="kb-testimonials-section" style="padding: 80px 20px; background: #f8f9fa;">
                <div class="kb-testimonials-container" style="max-width: 1200px; margin: 0 auto;">
                    <div class="kb-testimonials-grid" style="display: grid; grid-template-columns: repeat(${settings.items}, 1fr); gap: 30px;">
                        ${settings.testimonials.map(testimonial => `
                            <div class="kb-testimonial-card" style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <div class="kb-testimonial-rating" style="color: #ffd700; font-size: 1.2rem; margin-bottom: 15px;">
                                    ${'★'.repeat(testimonial.rating)}
                                </div>
                                <p class="kb-testimonial-text" style="font-style: italic; margin-bottom: 20px; color: #333;">"${testimonial.text}"</p>
                                <div class="kb-testimonial-author">
                                    <strong style="color: #333;">${testimonial.name}</strong>
                                    <span style="color: #666; display: block; font-size: 0.9rem;">${testimonial.company}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    generatePricingHTML(settings) {
        return `
            <div class="kb-pricing-section" style="padding: 80px 20px;">
                <div class="kb-pricing-container" style="max-width: 1200px; margin: 0 auto;">
                    <div class="kb-pricing-grid" style="display: grid; grid-template-columns: repeat(${settings.columns}, 1fr); gap: 30px;">
                        ${settings.plans.map(plan => `
                            <div class="kb-pricing-card ${plan.popular ? 'kb-popular' : ''}" style="background: white; padding: 40px 30px; border-radius: 10px; border: 2px solid ${plan.popular ? '#007cba' : '#e0e0e0'}; text-align: center; position: relative;">
                                ${plan.popular ? '<div class="kb-popular-badge" style="background: #007cba; color: white; padding: 8px 20px; border-radius: 20px; position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-size: 0.9rem;">Most Popular</div>' : ''}
                                <h3 class="kb-plan-name" style="font-size: 1.5rem; margin-bottom: 20px; color: #333;">${plan.name}</h3>
                                <div class="kb-plan-price" style="margin-bottom: 30px;">
                                    <span class="kb-price-currency" style="font-size: 1.2rem; color: #666;">$</span>
                                    <span class="kb-price-amount" style="font-size: 3rem; font-weight: 700; color: #333;">${plan.price}</span>
                                    <span class="kb-price-period" style="color: #666;">/${plan.period}</span>
                                </div>
                                <ul class="kb-plan-features" style="list-style: none; padding: 0; margin-bottom: 30px;">
                                    ${plan.features.map(feature => `<li style="padding: 8px 0; color: #666; border-bottom: 1px solid #f0f0f0;">${feature}</li>`).join('')}
                                </ul>
                                <button class="kb-plan-button" style="width: 100%; padding: 15px; background: ${plan.popular ? '#007cba' : '#f0f0f0'}; color: ${plan.popular ? 'white' : '#333'}; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1rem; font-weight: 600;">Choose Plan</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    addEditFunctionality(section) {
        section.addEventListener('click', (e) => {
            e.preventDefault();
            section.classList.add('elementor-element-edit-mode');
        });
    }
    
    findTemplate(templateId) {
        return [...this.templates.pages, ...this.templates.sections, ...this.savedTemplates]
            .find(t => t.id === templateId);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `kb-notification kb-notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            border-radius: 5px;
            z-index: 10001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Save current page as template
    saveCurrentAsTemplate() {
        const templateName = prompt('Enter template name:');
        if (!templateName) return;
        
        const templateDescription = prompt('Enter template description:');
        if (!templateDescription) return;
        
        const newTemplate = {
            id: 'custom-' + Date.now(),
            name: templateName,
            category: 'Custom',
            preview: 'https://via.placeholder.com/400x300?text=Custom+Template',
            description: templateDescription,
            structure: this.getCurrentPageStructure(),
            created: new Date().toISOString()
        };
        
        this.savedTemplates.push(newTemplate);
        localStorage.setItem('kingsbuilder_saved_templates', JSON.stringify(this.savedTemplates));
        this.showNotification(`Template "${templateName}" saved successfully!`, 'success');
    }
    
    getCurrentPageStructure() {
        const sections = document.querySelectorAll('.elementor-section');
        const structure = { sections: [] };
        
        sections.forEach(section => {
            const sectionType = section.dataset.sectionType || 'generic';
            structure.sections.push({
                type: sectionType,
                settings: this.extractSectionSettings(section)
            });
        });
        
        return structure;
    }
    
    extractSectionSettings(section) {
        return {
            background: section.style.background || 'default',
            height: section.style.height || 'auto',
            content: this.extractSectionContent(section)
        };
    }
    
    extractSectionContent(section) {
        return {
            title: section.querySelector('h1, h2, h3')?.textContent || '',
            text: section.querySelector('p')?.textContent || '',
            buttons: Array.from(section.querySelectorAll('button')).map(btn => ({
                text: btn.textContent,
                style: btn.className.includes('primary') ? 'primary' : 'secondary'
            }))
        };
    }
}

// Initialize Template System
window.templateSystem = new TemplateSystem();
console.log('🎨 Professional Template System loaded - Ready for enterprise templates!');