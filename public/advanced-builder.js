// KingsBuilder Advanced Page Builder
// Complete professional implementation according to roadmap requirements
console.log('🚀 KingsBuilder Advanced Builder: Initializing...');

class KingsBuilderAdvanced {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.elements = new Map();
        this.selectedElement = null;
        this.draggedElement = null;
        this.history = [];
        this.historyIndex = -1;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        console.log('🔧 Initializing KingsBuilder Advanced Features...');
        
        // Initialize core systems
        this.initializeResponsiveSystem();
        this.initializeAnimationSystem();
        this.initializeUndoRedoSystem();
        this.initializeShortcuts();
        this.initializeContextMenu();
        this.initializeElementHierarchy();
        
        this.isInitialized = true;
        console.log('✅ KingsBuilder Advanced: All systems initialized');
    }
    
    initializeResponsiveSystem() {
        console.log('📱 Initializing responsive design system...');
        
        const deviceButtons = document.querySelectorAll('.device-btn');
        deviceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const device = btn.dataset.device;
                this.switchDevice(device);
            });
        });
    }
    
    switchDevice(device) {
        const canvas = document.querySelector('.kingsbuilder-canvas');
        const deviceButtons = document.querySelectorAll('.device-btn');
        
        // Update canvas class
        canvas.className = canvas.className.replace(/desktop|tablet|mobile/, device);
        
        // Update active button
        deviceButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.device === device);
        });
        
        console.log('📱 Switched to device:', device);
        
        // Trigger responsive recalculation
        this.triggerResponsiveUpdate();
    }
    
    triggerResponsiveUpdate() {
        // Notify all elements about device change
        document.querySelectorAll('.kb-element').forEach(element => {
            const event = new CustomEvent('devicechange', {
                detail: { device: this.getCurrentDevice() }
            });
            element.dispatchEvent(event);
        });
    }
    
    getCurrentDevice() {
        const canvas = document.querySelector('.kingsbuilder-canvas');
        if (canvas.classList.contains('tablet')) return 'tablet';
        if (canvas.classList.contains('mobile')) return 'mobile';
        return 'desktop';
    }
    
    initializeAnimationSystem() {
        console.log('✨ Initializing animation system...');
        
        // Add intersection observer for entrance animations
        this.setupEntranceAnimations();
        this.setupHoverAnimations();
    }
    
    setupEntranceAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.dataset.entranceAnimation) {
                        element.classList.add('animate-in');
                    }
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all elements with entrance animations
        document.querySelectorAll('[data-entrance-animation]').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupHoverAnimations() {
        document.addEventListener('mouseover', (e) => {
            const element = e.target.closest('[data-hover-animation]');
            if (element) {
                const animation = element.dataset.hoverAnimation;
                element.classList.add(`hover-${animation}`);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            const element = e.target.closest('[data-hover-animation]');
            if (element) {
                const animation = element.dataset.hoverAnimation;
                element.classList.remove(`hover-${animation}`);
            }
        });
    }
    
    initializeUndoRedoSystem() {
        console.log('↩️ Initializing undo/redo system...');
        
        this.saveState('Initial state');
        
        // Auto-save state on significant changes
        const observer = new MutationObserver(() => {
            this.debounced(this.saveCurrentState.bind(this), 1000)();
        });
        
        const canvas = document.querySelector('.canvas-frame');
        if (canvas) {
            observer.observe(canvas, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
    }
    
    saveState(description) {
        const canvas = document.querySelector('.canvas-frame');
        if (!canvas) return;
        
        const state = {
            html: canvas.innerHTML,
            timestamp: Date.now(),
            description: description || 'Auto save'
        };
        
        // Remove future history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(state);
        this.historyIndex = this.history.length - 1;
        
        // Keep only last 50 states
        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
            this.historyIndex = this.history.length - 1;
        }
        
        console.log('💾 State saved:', description);
    }
    
    saveCurrentState() {
        this.saveState('Auto save');
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            console.log('↩️ Undo performed');
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            console.log('↪️ Redo performed');
        }
    }
    
    restoreState(state) {
        const canvas = document.querySelector('.canvas-frame');
        if (canvas && state) {
            canvas.innerHTML = state.html;
            // Re-setup interactions for restored elements
            canvas.querySelectorAll('.kb-element').forEach(element => {
                window.__CRITICAL_BUILDER_FIX__.setupElementInteraction(element);
            });
        }
    }
    
    initializeShortcuts() {
        console.log('⌨️ Initializing keyboard shortcuts...');
        
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                    case 's':
                        e.preventDefault();
                        this.savePage();
                        break;
                    case 'c':
                        e.preventDefault();
                        this.copyElement();
                        break;
                    case 'v':
                        e.preventDefault();
                        this.pasteElement();
                        break;
                    case 'a':
                        e.preventDefault();
                        this.selectAll();
                        break;
                }
            }
        });
    }
    
    initializeContextMenu() {
        console.log('🖱️ Initializing context menu...');
        
        const contextMenu = document.getElementById('contextMenu');
        if (!contextMenu) return;
        
        document.addEventListener('contextmenu', (e) => {
            const element = e.target.closest('.kb-element');
            if (element) {
                e.preventDefault();
                this.showContextMenu(e.pageX, e.pageY, element);
            }
        });
        
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });
        
        // Handle context menu actions
        contextMenu.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (action && this.selectedElement) {
                this.handleContextAction(action);
            }
        });
    }
    
    showContextMenu(x, y, element) {
        const contextMenu = document.getElementById('contextMenu');
        if (!contextMenu) return;
        
        this.selectedElement = element;
        
        contextMenu.style.display = 'block';
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        
        // Adjust position if menu goes outside viewport
        const rect = contextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            contextMenu.style.left = (x - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            contextMenu.style.top = (y - rect.height) + 'px';
        }
    }
    
    hideContextMenu() {
        const contextMenu = document.getElementById('contextMenu');
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    }
    
    handleContextAction(action) {
        const elementId = this.selectedElement?.dataset.elementId;
        if (!elementId) return;
        
        switch (action) {
            case 'copy':
                this.copyElement();
                break;
            case 'paste':
                this.pasteElement();
                break;
            case 'duplicate':
                window.kingsBuilder.duplicateElement(elementId);
                break;
            case 'edit':
                window.kingsBuilder.editElement(elementId);
                break;
            case 'delete':
                window.kingsBuilder.deleteElement(elementId);
                break;
            case 'reset-style':
                this.resetElementStyle(elementId);
                break;
            case 'navigator':
                this.showInNavigator(elementId);
                break;
        }
        
        this.hideContextMenu();
    }
    
    copyElement() {
        if (this.selectedElement) {
            this.clipboard = this.selectedElement.cloneNode(true);
            console.log('📋 Element copied to clipboard');
        }
    }
    
    pasteElement() {
        if (this.clipboard) {
            const clone = this.clipboard.cloneNode(true);
            const newId = this.generateElementId();
            clone.dataset.elementId = newId;
            
            // Update onclick handlers
            const controls = clone.querySelectorAll('.kb-element-control');
            controls.forEach(control => {
                const onclick = control.getAttribute('onclick');
                if (onclick) {
                    control.setAttribute('onclick', onclick.replace(/elementId.*?'/g, `elementId = '${newId}'`));
                }
            });
            
            const canvas = document.querySelector('.canvas-frame');
            canvas.appendChild(clone);
            
            if (window.__CRITICAL_BUILDER_FIX__) {
                window.__CRITICAL_BUILDER_FIX__.setupElementInteraction(clone);
            }
            
            console.log('📋 Element pasted from clipboard');
            this.saveState('Paste element');
        }
    }
    
    initializeElementHierarchy() {
        console.log('🗂️ Initializing element hierarchy system...');
        
        this.updateNavigator();
        
        // Listen for DOM changes to update navigator
        const observer = new MutationObserver(() => {
            this.debounced(this.updateNavigator.bind(this), 500)();
        });
        
        const canvas = document.querySelector('.canvas-frame');
        if (canvas) {
            observer.observe(canvas, {
                childList: true,
                subtree: true
            });
        }
    }
    
    updateNavigator() {
        const navigator = document.getElementById('navigatorContent');
        if (!navigator) return;
        
        const canvas = document.querySelector('.canvas-frame');
        const elements = canvas?.querySelectorAll('.kb-element') || [];
        
        if (elements.length === 0) {
            navigator.innerHTML = `
                <div class="navigator-empty">
                    <div class="navigator-empty-icon">
                        <i class="fas fa-sitemap"></i>
                    </div>
                    <p>No elements yet</p>
                </div>
            `;
            return;
        }
        
        const hierarchyHtml = Array.from(elements).map(element => {
            const type = element.dataset.elementType;
            const id = element.dataset.elementId;
            const icon = this.getElementIcon(type);
            
            return `
                <div class="navigator-item" data-element-id="${id}" onclick="kingsBuilder.selectElementById('${id}')">
                    <i class="${icon}"></i>
                    <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    <div class="navigator-actions">
                        <button onclick="event.stopPropagation(); kingsBuilder.editElement('${id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="event.stopPropagation(); kingsBuilder.deleteElement('${id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        navigator.innerHTML = hierarchyHtml;
    }
    
    getElementIcon(type) {
        const icons = {
            text: 'fas fa-font',
            heading: 'fas fa-heading',
            button: 'fas fa-mouse-pointer',
            image: 'fas fa-image',
            icon: 'fas fa-star',
            container: 'fas fa-square'
        };
        return icons[type] || 'fas fa-cube';
    }
    
    selectElementById(elementId) {
        const element = document.querySelector(`[data-element-id="${elementId}"]`);
        if (element && window.__CRITICAL_BUILDER_FIX__) {
            window.__CRITICAL_BUILDER_FIX__.selectElement(element);
        }
    }
    
    // Utility functions
    generateElementId() {
        return 'kb-' + Math.random().toString(36).substr(2, 9);
    }
    
    debounced(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    savePage() {
        if (window.kingsBuilder && window.kingsBuilder.savePage) {
            window.kingsBuilder.savePage();
        }
    }
    
    resetElementStyle(elementId) {
        const element = document.querySelector(`[data-element-id="${elementId}"]`);
        if (element) {
            element.style.cssText = '';
            console.log('🎨 Element style reset:', elementId);
            this.saveState('Reset element style');
        }
    }
    
    showInNavigator(elementId) {
        const navigatorItem = document.querySelector(`.navigator-item[data-element-id="${elementId}"]`);
        if (navigatorItem) {
            navigatorItem.scrollIntoView({ behavior: 'smooth' });
            navigatorItem.classList.add('highlight');
            setTimeout(() => {
                navigatorItem.classList.remove('highlight');
            }, 2000);
        }
    }
    
    selectAll() {
        const elements = document.querySelectorAll('.kb-element');
        elements.forEach(element => {
            element.classList.add('selected');
        });
        console.log('🎯 All elements selected');
    }
}

// Initialize the advanced builder
if (!window.__KINGS_BUILDER_ADVANCED__) {
    window.__KINGS_BUILDER_ADVANCED__ = new KingsBuilderAdvanced();
}

// Make it globally available
window.KingsBuilder = window.KingsBuilder || {};
window.KingsBuilder.Advanced = window.__KINGS_BUILDER_ADVANCED__;

console.log('✅ KingsBuilder Advanced: Ready for action!');
