/**
 * KingsBuilder Widget Manager
 * =====================================================
 * Manages all widgets, their registration, rendering, and interactions
 * Based on Elementor's widget architecture
 */

class WidgetManager {
    constructor() {
        this.widgets = new Map();
        this.categories = new Map();
        this.initialized = false;
        
        console.log('🧩 Widget Manager initialized');
    }

    async init() {
        if (this.initialized) return;
        
        // Register default categories
        this.registerDefaultCategories();
        
        // Register default widgets
        this.registerDefaultWidgets();
        
        // Render widget panel
        this.renderWidgetPanel();
        
        // Bind events
        this.bindEvents();
        
        this.initialized = true;
        console.log('✅ Widget Manager ready');
    }

    /**
     * Register default widget categories
     */
    registerDefaultCategories() {
        const categories = [
            {
                name: 'basic',
                title: 'Basic',
                icon: 'fas fa-layer-group',
                active: true
            },
            {
                name: 'general',
                title: 'General',
                icon: 'fas fa-cube'
            },
            {
                name: 'media',
                title: 'Media',
                icon: 'fas fa-photo-video'
            },
            {
                name: 'forms',
                title: 'Forms',
                icon: 'fas fa-wpforms'
            },
            {
                name: 'ecommerce',
                title: 'E-Commerce',
                icon: 'fas fa-shopping-cart'
            },
            {
                name: 'advanced',
                title: 'Advanced',
                icon: 'fas fa-cogs'
            }
        ];

        categories.forEach(category => {
            this.categories.set(category.name, category);
        });
    }

    /**
     * Register default widgets
     */
    registerDefaultWidgets() {
        // Basic widgets
        this.registerWidget('heading', new HeadingWidget());
        this.registerWidget('text', new TextWidget());
        this.registerWidget('button', new ButtonWidget());
        this.registerWidget('image', new ImageWidget());
        this.registerWidget('spacer', new SpacerWidget());
        this.registerWidget('divider', new DividerWidget());
        
        // General widgets
        this.registerWidget('icon', new IconWidget());
        this.registerWidget('icon-box', new IconBoxWidget());
        this.registerWidget('icon-list', new IconListWidget());
        
        // Media widgets
        this.registerWidget('video', new VideoWidget());
        this.registerWidget('audio', new AudioWidget());
        this.registerWidget('image-gallery', new ImageGalleryWidget());
        this.registerWidget('image-carousel', new ImageCarouselWidget());
        
        // Interactive widgets
        this.registerWidget('accordion', new AccordionWidget());
        this.registerWidget('tabs', new TabsWidget());
        this.registerWidget('toggle', new ToggleWidget());
        
        // Form widgets
        this.registerWidget('contact-form', new ContactFormWidget());
        
        console.log(`📦 Registered ${this.widgets.size} widgets`);
    }

    /**
     * Register a widget
     */
    registerWidget(name, widget) {
        if (this.widgets.has(name)) {
            console.warn(`Widget ${name} already registered`);
            return;
        }
        
        widget.name = name;
        this.widgets.set(name, widget);
    }

    /**
     * Get widget by name
     */
    getWidget(name) {
        return this.widgets.get(name);
    }

    /**
     * Render widget panel
     */
    renderWidgetPanel() {
        const container = document.getElementById('kb-widget-categories');
        if (!container) return;

        let html = '';

        // Group widgets by category
        const widgetsByCategory = new Map();
        
        this.widgets.forEach((widget, name) => {
            const category = widget.getCategory() || 'basic';
            if (!widgetsByCategory.has(category)) {
                widgetsByCategory.set(category, []);
            }
            widgetsByCategory.get(category).push({ name, widget });
        });

        // Render categories
        this.categories.forEach((category, categoryName) => {
            const widgets = widgetsByCategory.get(categoryName) || [];
            if (widgets.length === 0) return;

            html += `
                <div class="kb-widget-category ${category.active ? 'active' : ''}" data-category="${categoryName}">
                    <div class="kb-category-header">
                        <i class="${category.icon}"></i>
                        <span>${category.title}</span>
                        <i class="fas fa-chevron-down kb-toggle-icon"></i>
                    </div>
                    <div class="kb-category-content">
                        <div class="kb-widgets-grid">
                            ${widgets.map(({ name, widget }) => `
                                <div class="kb-widget-item" 
                                     data-widget="${name}" 
                                     draggable="true"
                                     title="${widget.getTitle()}">
                                    <div class="kb-widget-icon">
                                        <i class="${widget.getIcon()}"></i>
                                    </div>
                                    <span class="kb-widget-title">${widget.getTitle()}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    /**
     * Bind widget panel events
     */
    bindEvents() {
        // Category toggle
        document.addEventListener('click', (e) => {
            const header = e.target.closest('.kb-category-header');
            if (header) {
                const category = header.parentElement;
                category.classList.toggle('active');
            }
        });

        // Widget search
        const searchInput = document.getElementById('kb-widget-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterWidgets(e.target.value);
            });
        }

        // Widget drag start
        document.addEventListener('dragstart', (e) => {
            const widgetItem = e.target.closest('.kb-widget-item');
            if (widgetItem) {
                const widgetName = widgetItem.dataset.widget;
                e.dataTransfer.setData('text/plain', widgetName);
                e.dataTransfer.effectAllowed = 'copy';
                
                // Add drag class for visual feedback
                widgetItem.classList.add('kb-dragging');
                
                console.log(`🎯 Started dragging widget: ${widgetName}`);
            }
        });

        // Widget drag end
        document.addEventListener('dragend', (e) => {
            const widgetItem = e.target.closest('.kb-widget-item');
            if (widgetItem) {
                widgetItem.classList.remove('kb-dragging');
            }
        });
    }

    /**
     * Filter widgets by search term
     */
    filterWidgets(searchTerm) {
        const term = searchTerm.toLowerCase();
        const widgetItems = document.querySelectorAll('.kb-widget-item');
        
        widgetItems.forEach(item => {
            const title = item.querySelector('.kb-widget-title').textContent.toLowerCase();
            const widget = this.getWidget(item.dataset.widget);
            const keywords = widget.getKeywords().join(' ').toLowerCase();
            
            const matches = title.includes(term) || keywords.includes(term);
            item.style.display = matches ? 'flex' : 'none';
        });

        // Hide empty categories
        document.querySelectorAll('.kb-widget-category').forEach(category => {
            const visibleWidgets = category.querySelectorAll('.kb-widget-item[style*="flex"], .kb-widget-item:not([style])');
            category.style.display = visibleWidgets.length > 0 ? 'block' : 'none';
        });
    }

    /**
     * Create widget element
     */
    createWidget(widgetName, settings = {}) {
        try {
            console.log('🔧 Creating widget:', widgetName, 'with settings:', settings);
            
            // Handle container creation
            if (widgetName.startsWith('container-')) {
                const containerType = widgetName.replace('container-', '');
                console.log('🔧 Creating container widget:', containerType);
                return this.createContainerWidget(containerType, settings);
            }

            const widget = this.getWidget(widgetName);
            if (!widget) {
                console.error(`🚨 Widget ${widgetName} not found`);
                console.log('🔧 Available widgets:', Object.keys(this.widgets));
                return null;
            }
            console.log('✅ Widget found:', widget);

            // Create wrapper element
            const element = document.createElement('div');
            element.className = 'kb-element kb-widget';
            element.dataset.widget = widgetName;
            element.dataset.id = this.generateId();
            
            console.log('🔧 Element created with ID:', element.dataset.id);
            
            // Add widget-specific classes
            element.classList.add(`kb-widget-${widgetName}`);
            
            // Render widget content
            console.log('🔧 Rendering widget content...');
            const content = widget.render(settings);
            element.innerHTML = content;
            console.log('✅ Widget content rendered');
            
            // Store widget settings
            element._kbSettings = { ...widget.getDefaultSettings(), ...settings };
            element._kbWidget = widget;
            
            // Make element interactive
            console.log('🔧 Making element interactive...');
            this.makeElementInteractive(element);
            console.log('✅ Element made interactive');
            
            console.log(`✨ Created widget: ${widgetName}`);
            return element;
            
        } catch (error) {
            console.error('🚨 Error creating widget:', error);
            console.error('🚨 Widget name:', widgetName);
            console.error('🚨 Settings:', settings);
            return null;
        }
    }

    /**
     * Create container widget
     */
    createContainerWidget(containerType, settings = {}) {
        const containerSystem = window.kingsBuilder?.canvasManager?.containerSystem;
        if (!containerSystem) {
            console.error('Container system not available');
            return null;
        }

        // Create container with default column
        const container = containerSystem.createContainer(containerType, settings);
        const column = containerSystem.createColumn();
        container.appendChild(column);

        // Make container interactive
        this.makeElementInteractive(container);
        
        console.log(`✨ Created container: ${containerType}`);
        return container;
    }

    /**
     * Make element interactive
     */
    makeElementInteractive(element) {
        // Click to select
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            window.kingsBuilder.selectElement(element);
        });

        // Right-click context menu
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.kingsBuilder.selectElement(element);
            this.showContextMenu(e, element);
        });

        // Hover effects
        element.addEventListener('mouseenter', () => {
            if (element !== window.kingsBuilder.selectedElement) {
                element.classList.add('kb-hover');
            }
        });

        element.addEventListener('mouseleave', () => {
            element.classList.remove('kb-hover');
        });
    }

    /**
     * Show context menu
     */
    showContextMenu(e, element) {
        const contextMenu = document.getElementById('kb-context-menu');
        if (!contextMenu) return;

        // Position menu
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;

        // Handle menu actions
        const handleAction = (action) => {
            switch (action) {
                case 'edit':
                    window.kingsBuilder.selectElement(element);
                    break;
                case 'duplicate':
                    this.duplicateElement(element);
                    break;
                case 'copy':
                    window.kingsBuilder.copyElement(element);
                    break;
                case 'paste':
                    window.kingsBuilder.pasteElement();
                    break;
                case 'move-up':
                    this.moveElement(element, 'up');
                    break;
                case 'move-down':
                    this.moveElement(element, 'down');
                    break;
                case 'delete':
                    window.kingsBuilder.deleteElement(element);
                    break;
            }
            contextMenu.style.display = 'none';
        };

        // Bind menu item clicks
        contextMenu.querySelectorAll('.kb-context-item').forEach(item => {
            item.onclick = () => handleAction(item.dataset.action);
        });

        // Hide menu on outside click
        const hideMenu = (e) => {
            if (!contextMenu.contains(e.target)) {
                contextMenu.style.display = 'none';
                document.removeEventListener('click', hideMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', hideMenu);
        }, 0);
    }

    /**
     * Duplicate element
     */
    duplicateElement(element) {
        window.kingsBuilder.saveState();
        
        const clone = element.cloneNode(true);
        clone.dataset.id = this.generateId();
        
        // Insert after original
        element.parentNode.insertBefore(clone, element.nextSibling);
        
        // Make clone interactive
        this.makeElementInteractive(clone);
        
        window.kingsBuilder.canvasManager.updateNavigator();
        window.kingsBuilder.showNotification('Element duplicated', 'success');
    }

    /**
     * Move element up or down
     */
    moveElement(element, direction) {
        window.kingsBuilder.saveState();
        
        const sibling = direction === 'up' ? element.previousElementSibling : element.nextElementSibling;
        if (!sibling) return;

        if (direction === 'up') {
            element.parentNode.insertBefore(element, sibling);
        } else {
            element.parentNode.insertBefore(sibling, element);
        }

        window.kingsBuilder.canvasManager.updateNavigator();
        window.kingsBuilder.showNotification(`Element moved ${direction}`, 'success');
    }

    /**
     * Update widget settings
     */
    updateWidget(element, settings) {
        const widget = element._kbWidget;
        if (!widget) return;

        // Merge settings
        element._kbSettings = { ...element._kbSettings, ...settings };
        
        // Re-render widget
        const content = widget.render(element._kbSettings);
        element.innerHTML = content;
        
        console.log(`🔄 Updated widget: ${element.dataset.widget}`);
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'kb_' + Math.random().toString(36).substr(2, 9);
    }
}

// Export for global use
window.WidgetManager = WidgetManager;