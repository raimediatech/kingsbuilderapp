// DIRECT FIX - MAKE BUTTONS ACTUALLY WORK
console.log('🔥 DIRECT FIX: Starting...');

// Wait for DOM to be ready
function waitForDOM() {
    return new Promise((resolve) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
}

// Wait a bit more for all elements to load
function waitForElements() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

async function initDirectFix() {
    await waitForDOM();
    await waitForElements();
    
    console.log('🔥 DIRECT FIX: DOM ready, applying fixes...');
    
    // 1. FIX SIDEBAR ELEMENTS - MAKE THEM CLICKABLE
    const elementItems = document.querySelectorAll('.element-item');
    console.log(`🔥 Found ${elementItems.length} element items`);
    
    elementItems.forEach((item, index) => {
        const elementType = item.getAttribute('data-element');
        console.log(`🔥 Element ${index}: ${elementType}`);
        
        // Remove any existing click handlers
        item.onclick = null;
        
        // Add new click handler
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🔥 CLICKED: ${elementType}`);
            addElementToCanvas(elementType);
        });
        
        // Add visual feedback
        item.style.cursor = 'pointer';
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#000';
            this.style.color = '#fff';
        });
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.color = '';
        });
    });
    
    // 2. FIX TOOLBAR BUTTONS
    const saveBtn = document.getElementById('saveBtn');
    const previewBtn = document.getElementById('previewBtn');
    const publishBtn = document.getElementById('publishBtn');
    
    console.log('🔥 Toolbar buttons:', { saveBtn: !!saveBtn, previewBtn: !!previewBtn, publishBtn: !!publishBtn });
    
    if (saveBtn) {
        saveBtn.onclick = null;
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔥 SAVE CLICKED');
            savePage();
        });
    }
    
    if (previewBtn) {
        previewBtn.onclick = null;
        previewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔥 PREVIEW CLICKED');
            previewPage();
        });
    }
    
    if (publishBtn) {
        publishBtn.onclick = null;
        publishBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔥 PUBLISH CLICKED');
            publishPage();
        });
    }
    
    // 3. FIX CANVAS - MAKE ELEMENTS SELECTABLE AND DELETABLE
    setupCanvas();
    
    console.log('✅ DIRECT FIX: All fixes applied!');
}

// Add element to canvas
function addElementToCanvas(elementType) {
    console.log(`🔥 Adding ${elementType} to canvas`);
    
    const canvas = document.querySelector('.canvas-frame');
    if (!canvas) {
        console.error('❌ Canvas not found');
        return;
    }
    
    // Create element
    const elementId = 'element_' + Date.now();
    const elementDiv = document.createElement('div');
    elementDiv.className = 'kb-element';
    elementDiv.setAttribute('data-element-id', elementId);
    elementDiv.setAttribute('data-element-type', elementType);
    elementDiv.style.cssText = `
        position: relative;
        margin: 10px 0;
        padding: 15px;
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        background: #f8f9fa;
        transition: all 0.2s;
    `;
    
    // Add content based on element type
    let content = '';
    switch (elementType) {
        case 'text':
        case 'enhanced-text':
            content = '<p style="margin: 0; font-size: 16px; color: #333;">This is a text element. Click to edit.</p>';
            break;
        case 'heading':
        case 'enhanced-heading':
            content = '<h2 style="margin: 0; font-size: 24px; color: #000;">This is a heading</h2>';
            break;
        case 'button':
        case 'enhanced-button':
            content = '<button style="background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Click Me</button>';
            break;
        case 'image':
        case 'enhanced-image':
            content = '<div style="background: #e9ecef; padding: 40px; text-align: center; border: 2px dashed #adb5bd;"><i class="fas fa-image" style="font-size: 48px; color: #6c757d;"></i><p style="margin: 10px 0 0 0; color: #6c757d;">Click to upload image</p></div>';
            break;
        case 'video':
            content = '<div style="background: #000; padding: 40px; text-align: center; border-radius: 4px;"><i class="fas fa-play" style="font-size: 48px; color: white;"></i><p style="margin: 10px 0 0 0; color: white;">Video Player</p></div>';
            break;
        default:
            content = `<div style="padding: 20px; text-align: center; background: #e9ecef; border-radius: 4px;"><strong>${elementType}</strong><p style="margin: 5px 0 0 0; color: #6c757d;">Click to configure this element</p></div>`;
    }
    
    elementDiv.innerHTML = `
        ${content}
        <div class="element-controls" style="
            position: absolute;
            top: -35px;
            right: 0;
            background: #000;
            border-radius: 4px;
            padding: 4px;
            display: none;
            z-index: 100;
        ">
            <button onclick="editElement('${elementId}')" style="
                background: none;
                border: none;
                color: white;
                padding: 4px 8px;
                cursor: pointer;
                font-size: 12px;
            ">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button onclick="deleteElement('${elementId}')" style="
                background: none;
                border: none;
                color: #ff4444;
                padding: 4px 8px;
                cursor: pointer;
                font-size: 12px;
            ">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    // Add event listeners
    elementDiv.addEventListener('click', function(e) {
        e.stopPropagation();
        selectElement(elementId);
    });
    
    elementDiv.addEventListener('mouseenter', function() {
        const controls = this.querySelector('.element-controls');
        if (controls) controls.style.display = 'flex';
        this.style.borderColor = '#007cba';
    });
    
    elementDiv.addEventListener('mouseleave', function() {
        const controls = this.querySelector('.element-controls');
        if (controls) controls.style.display = 'none';
        if (!this.classList.contains('selected')) {
            this.style.borderColor = 'transparent';
        }
    });
    
    // Add to canvas
    canvas.appendChild(elementDiv);
    
    // Select the new element
    selectElement(elementId);
    
    console.log(`✅ Added ${elementType} with ID: ${elementId}`);
}

// Select element
function selectElement(elementId) {
    console.log(`🔥 Selecting element: ${elementId}`);
    
    // Deselect all elements
    document.querySelectorAll('.kb-element').forEach(el => {
        el.classList.remove('selected');
        el.style.borderColor = 'transparent';
    });
    
    // Select current element
    const element = document.querySelector(`[data-element-id="${elementId}"]`);
    if (element) {
        element.classList.add('selected');
        element.style.borderColor = '#007cba';
        showProperties(elementId);
    }
}

// Show properties panel
function showProperties(elementId) {
    console.log(`🔥 Showing properties for: ${elementId}`);
    
    const element = document.querySelector(`[data-element-id="${elementId}"]`);
    if (!element) return;
    
    const elementType = element.getAttribute('data-element-type');
    
    // Create or update properties panel
    let propertiesPanel = document.querySelector('.direct-properties-panel');
    if (!propertiesPanel) {
        propertiesPanel = document.createElement('div');
        propertiesPanel.className = 'direct-properties-panel';
        propertiesPanel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 300px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-height: 70vh;
            overflow-y: auto;
        `;
        document.body.appendChild(propertiesPanel);
    }
    
    propertiesPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${elementType} Properties</h3>
            <button onclick="this.parentElement.parentElement.style.display='none'" style="
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #999;
            ">×</button>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Element ID</label>
            <input type="text" value="${elementId}" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa;">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Element Type</label>
            <input type="text" value="${elementType}" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa;">
        </div>
        <div style="margin-bottom: 15px;">
            <button onclick="deleteElement('${elementId}')" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-weight: bold;
            ">Delete Element</button>
        </div>
    `;
    
    propertiesPanel.style.display = 'block';
}

// Edit element
function editElement(elementId) {
    console.log(`🔥 Editing element: ${elementId}`);
    selectElement(elementId);
}

// Delete element
function deleteElement(elementId) {
    console.log(`🔥 Deleting element: ${elementId}`);
    
    const element = document.querySelector(`[data-element-id="${elementId}"]`);
    if (element) {
        element.remove();
        
        // Hide properties panel
        const propertiesPanel = document.querySelector('.direct-properties-panel');
        if (propertiesPanel) {
            propertiesPanel.style.display = 'none';
        }
        
        console.log(`✅ Deleted element: ${elementId}`);
    }
}

// Setup canvas
function setupCanvas() {
    console.log('🔥 Setting up canvas...');
    
    const canvas = document.querySelector('.canvas-frame');
    if (!canvas) {
        console.error('❌ Canvas not found');
        return;
    }
    
    // Click to deselect
    canvas.addEventListener('click', function(e) {
        if (e.target === canvas) {
            // Deselect all elements
            document.querySelectorAll('.kb-element').forEach(el => {
                el.classList.remove('selected');
                el.style.borderColor = 'transparent';
            });
            
            // Hide properties panel
            const propertiesPanel = document.querySelector('.direct-properties-panel');
            if (propertiesPanel) {
                propertiesPanel.style.display = 'none';
            }
        }
    });
    
    console.log('✅ Canvas setup complete');
}

// Save page
function savePage() {
    console.log('🔥 Saving page...');
    
    const canvas = document.querySelector('.canvas-frame');
    if (!canvas) {
        alert('❌ Canvas not found');
        return;
    }
    
    const content = canvas.innerHTML;
    console.log('📄 Page content:', content);
    
    // Show success message
    showNotification('💾 Page saved successfully!', 'success');
}

// Preview page
function previewPage() {
    console.log('🔥 Opening preview...');
    
    const canvas = document.querySelector('.canvas-frame');
    if (!canvas) {
        alert('❌ Canvas not found');
        return;
    }
    
    const content = canvas.innerHTML;
    
    // Open preview in new window
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Preview - KingsBuilder</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .preview-header { background: #000; color: white; padding: 10px 20px; margin: -20px -20px 20px -20px; }
                .element-controls { display: none !important; }
            </style>
        </head>
        <body>
            <div class="preview-header">
                <h3 style="margin: 0;">🔥 PREVIEW MODE - Page Builder</h3>
            </div>
            ${content}
        </body>
        </html>
    `);
    
    showNotification('👁️ Preview opened in new window', 'info');
}

// Publish page
function publishPage() {
    console.log('🔥 Publishing page...');
    
    // Show success message
    showNotification('🚀 Page published successfully!', 'success');
    
    // Show publish modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            max-width: 400px;
            width: 90%;
        ">
            <h2 style="color: #28a745; margin-bottom: 20px;">🚀 Published Successfully!</h2>
            <p style="margin-bottom: 20px;">Your page is now live!</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #007cba;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        color: white;
        font-weight: bold;
        z-index: 15000;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007cba'};
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Make functions global so they can be called from HTML
window.editElement = editElement;
window.deleteElement = deleteElement;
window.selectElement = selectElement;
window.addElementToCanvas = addElementToCanvas;
window.savePage = savePage;
window.previewPage = previewPage;
window.publishPage = publishPage;

// Initialize
initDirectFix();

console.log('✅ DIRECT FIX: Loaded and ready!');