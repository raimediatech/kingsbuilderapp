// 🚀 COMPLETION WIDGETS - Final 20% Widget Library
// Adds the remaining 19+ widgets to complete the KingsBuilder widget system
console.log('🚀 COMPLETION WIDGETS: Loading final widget set...');

class CompletionWidgets {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.widgets = {};
        
        if (this.isBuilder) {
            this.init();
        }
    }

    init() {
        console.log('🔧 Initializing completion widgets...');
        
        // Wait for DOM and critical fixes to load
        setTimeout(() => {
            this.setupCompletionWidgets();
            this.integrateWithBuilder();
            console.log('✅ COMPLETION WIDGETS: All 25+ widgets now available!');
        }, 2000);
    }

    setupCompletionWidgets() {
        console.log('🔧 Setting up completion widget library...');
        
        // Complete widget library with all missing widgets
        this.widgets = {
            // FORM WIDGETS (5 widgets)
            input: {
                name: 'Input Field',
                icon: 'fas fa-edit',
                category: 'Forms',
                render: (config = {}) => {
                    const label = config.label || 'Input Label';
                    const placeholder = config.placeholder || 'Enter text...';
                    const type = config.type || 'text';
                    const required = config.required || false;
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-input-element" data-element-type="input" data-element-id="${id}" style="margin-bottom: 20px;">
                            <div class="kb-element-content">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">${label}</label>
                                <input type="${type}" placeholder="${placeholder}" ${required ? 'required' : ''} 
                                       style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; transition: border-color 0.3s;">
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            textarea: {
                name: 'Textarea',
                icon: 'fas fa-align-left',
                category: 'Forms',
                render: (config = {}) => {
                    const label = config.label || 'Message';
                    const placeholder = config.placeholder || 'Enter your message...';
                    const rows = config.rows || 4;
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-textarea-element" data-element-type="textarea" data-element-id="${id}" style="margin-bottom: 20px;">
                            <div class="kb-element-content">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">${label}</label>
                                <textarea rows="${rows}" placeholder="${placeholder}" 
                                         style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; resize: vertical; transition: border-color 0.3s;"></textarea>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            select: {
                name: 'Select Dropdown',
                icon: 'fas fa-chevron-down',
                category: 'Forms',
                render: (config = {}) => {
                    const label = config.label || 'Select Option';
                    const options = config.options || ['Option 1', 'Option 2', 'Option 3'];
                    const id = this.generateElementId();
                    
                    const optionsHtml = options.map(option => `<option value="${option}">${option}</option>`).join('');
                    
                    return `
                        <div class="kb-element kb-select-element" data-element-type="select" data-element-id="${id}" style="margin-bottom: 20px;">
                            <div class="kb-element-content">
                                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">${label}</label>
                                <select style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; background: white;">
                                    ${optionsHtml}
                                </select>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            checkbox: {
                name: 'Checkbox',
                icon: 'fas fa-check-square',
                category: 'Forms',
                render: (config = {}) => {
                    const label = config.label || 'Check this option';
                    const checked = config.checked || false;
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-checkbox-element" data-element-type="checkbox" data-element-id="${id}" style="margin-bottom: 16px;">
                            <div class="kb-element-content" style="display: flex; align-items: center;">
                                <input type="checkbox" ${checked ? 'checked' : ''} 
                                       style="margin-right: 12px; width: 18px; height: 18px; accent-color: #3b82f6;">
                                <label style="font-size: 16px; color: #374151; cursor: pointer;">${label}</label>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            radio: {
                name: 'Radio Buttons',
                icon: 'fas fa-dot-circle',
                category: 'Forms',
                render: (config = {}) => {
                    const label = config.label || 'Choose an option';
                    const options = config.options || ['Option 1', 'Option 2', 'Option 3'];
                    const name = config.name || `radio_${Date.now()}`;
                    const id = this.generateElementId();
                    
                    const optionsHtml = options.map((option, index) => `
                        <div style="margin-bottom: 8px;">
                            <input type="radio" name="${name}" value="${option}" id="${name}_${index}" 
                                   style="margin-right: 8px; accent-color: #3b82f6;" ${index === 0 ? 'checked' : ''}>
                            <label for="${name}_${index}" style="font-size: 16px; color: #374151; cursor: pointer;">${option}</label>
                        </div>
                    `).join('');
                    
                    return `
                        <div class="kb-element kb-radio-element" data-element-type="radio" data-element-id="${id}" style="margin-bottom: 20px;">
                            <div class="kb-element-content">
                                <label style="display: block; margin-bottom: 12px; font-weight: 500; color: #374151;">${label}</label>
                                ${optionsHtml}
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },

            // MEDIA WIDGETS (4 widgets)
            gallery: {
                name: 'Image Gallery',
                icon: 'fas fa-images',
                category: 'Media',
                render: (config = {}) => {
                    const columns = config.columns || 3;
                    const spacing = config.spacing || '10px';
                    const images = config.images || [
                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
                    ];
                    const id = this.generateElementId();
                    
                    const galleryHtml = images.map(img => `
                        <div style="flex: 1; min-width: calc(100% / ${columns} - ${spacing}); margin: ${spacing};">
                            <img src="${img}" alt="Gallery Image" 
                                 style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; cursor: pointer; transition: transform 0.3s;"
                                 onmouseover="this.style.transform='scale(1.05)'" 
                                 onmouseout="this.style.transform='scale(1)'">
                        </div>
                    `).join('');
                    
                    return `
                        <div class="kb-element kb-gallery-element" data-element-type="gallery" data-element-id="${id}" style="margin-bottom: 30px;">
                            <div class="kb-element-content">
                                <div style="display: flex; flex-wrap: wrap; margin: -${spacing};">
                                    ${galleryHtml}
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            slider: {
                name: 'Image Slider',
                icon: 'fas fa-sliders-h',
                category: 'Media',
                render: (config = {}) => {
                    const images = config.images || [
                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
                        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop'
                    ];
                    const height = config.height || '400px';
                    const autoplay = config.autoplay || true;
                    const id = this.generateElementId();
                    
                    const slidesHtml = images.map((img, index) => `
                        <div class="slide" style="display: ${index === 0 ? 'block' : 'none'};">
                            <img src="${img}" alt="Slide ${index + 1}" 
                                 style="width: 100%; height: ${height}; object-fit: cover; border-radius: 12px;">
                        </div>
                    `).join('');
                    
                    return `
                        <div class="kb-element kb-slider-element" data-element-type="slider" data-element-id="${id}" style="margin-bottom: 30px;">
                            <div class="kb-element-content">
                                <div class="slider-container" style="position: relative; overflow: hidden; border-radius: 12px;">
                                    ${slidesHtml}
                                    <div class="slider-controls" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px;">
                                        ${images.map((_, index) => `
                                            <button class="slider-dot" data-slide="${index}" 
                                                    style="width: 12px; height: 12px; border-radius: 50%; border: none; background: ${index === 0 ? '#fff' : 'rgba(255,255,255,0.5)'}; cursor: pointer;"></button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            videoEmbed: {
                name: 'Video Embed',
                icon: 'fas fa-video',
                category: 'Media',
                render: (config = {}) => {
                    const videoUrl = config.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
                    const aspectRatio = config.aspectRatio || '16:9';
                    const autoplay = config.autoplay || false;
                    const id = this.generateElementId();
                    
                    const paddingTop = aspectRatio === '16:9' ? '56.25%' : aspectRatio === '4:3' ? '75%' : '56.25%';
                    
                    return `
                        <div class="kb-element kb-video-element" data-element-type="video" data-element-id="${id}" style="margin-bottom: 30px;">
                            <div class="kb-element-content">
                                <div style="position: relative; width: 100%; padding-top: ${paddingTop}; border-radius: 12px; overflow: hidden;">
                                    <iframe src="${videoUrl}${autoplay ? '?autoplay=1' : ''}" 
                                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                                            allowfullscreen></iframe>
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            audioPlayer: {
                name: 'Audio Player',
                icon: 'fas fa-music',
                category: 'Media',
                render: (config = {}) => {
                    const audioUrl = config.audioUrl || 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
                    const title = config.title || 'Audio Track';
                    const artist = config.artist || 'Unknown Artist';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-audio-element" data-element-type="audio" data-element-id="${id}" style="margin-bottom: 30px;">
                            <div class="kb-element-content">
                                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; color: white;">
                                    <div style="margin-bottom: 15px;">
                                        <h4 style="margin: 0 0 5px 0; font-size: 18px;">${title}</h4>
                                        <p style="margin: 0; opacity: 0.8; font-size: 14px;">${artist}</p>
                                    </div>
                                    <audio controls style="width: 100%; height: 40px;">
                                        <source src="${audioUrl}" type="audio/mpeg">
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },

            // INTERACTIVE WIDGETS (5 widgets)
            modal: {
                name: 'Modal/Popup',
                icon: 'fas fa-window-restore',
                category: 'Interactive',
                render: (config = {}) => {
                    const buttonText = config.buttonText || 'Open Modal';
                    const title = config.title || 'Modal Title';
                    const content = config.content || 'This is the modal content. You can add any content here.';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-modal-element" data-element-type="modal" data-element-id="${id}" style="margin-bottom: 20px;">
                            <div class="kb-element-content">
                                <button onclick="openModal('${id}')" 
                                        style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; transition: background 0.3s;"
                                        onmouseover="this.style.background='#2563eb'" 
                                        onmouseout="this.style.background='#3b82f6'">
                                    ${buttonText}
                                </button>
                                
                                <div id="modal-${id}" class="modal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);">
                                    <div style="position: relative; margin: 10% auto; padding: 30px; background: white; width: 80%; max-width: 600px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                                        <span onclick="closeModal('${id}')" style="position: absolute; top: 15px; right: 20px; font-size: 28px; font-weight: bold; cursor: pointer; color: #999;">&times;</span>
                                        <h3 style="margin-top: 0; color: #1f2937;">${title}</h3>
                                        <p style="color: #6b7280; line-height: 1.6;">${content}</p>
                                    </div>
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            progressBar: {
                name: 'Progress Bar',
                icon: 'fas fa-tasks',
                category: 'Interactive',
                render: (config = {}) => {
                    const label = config.label || 'Progress';
                    const percentage = config.percentage || 75;
                    const color = config.color || '#3b82f6';
                    const showPercentage = config.showPercentage !== false;
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-progress-element" data-element-type="progress" data-element-id="${id}" style="margin-bottom: 25px;">
                            <div class="kb-element-content">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-weight: 500; color: #374151;">${label}</span>
                                    ${showPercentage ? `<span style="color: #6b7280;">${percentage}%</span>` : ''}
                                </div>
                                <div style="width: 100%; background: #e5e7eb; border-radius: 10px; height: 12px; overflow: hidden;">
                                    <div style="width: ${percentage}%; background: ${color}; height: 100%; border-radius: 10px; transition: width 0.5s ease;"></div>
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            countdown: {
                name: 'Countdown Timer',
                icon: 'fas fa-clock',
                category: 'Interactive',
                render: (config = {}) => {
                    const targetDate = config.targetDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    const title = config.title || 'Limited Time Offer';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-countdown-element" data-element-type="countdown" data-element-id="${id}" style="margin-bottom: 30px;">
                            <div class="kb-element-content">
                                <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white;">
                                    <h3 style="margin: 0 0 20px 0; font-size: 24px;">${title}</h3>
                                    <div id="countdown-${id}" style="display: flex; justify-content: center; gap: 20px; font-size: 18px; font-weight: bold;">
                                        <div style="text-align: center;">
                                            <div class="days" style="font-size: 32px; margin-bottom: 5px;">00</div>
                                            <div style="font-size: 14px; opacity: 0.8;">DAYS</div>
                                        </div>
                                        <div style="text-align: center;">
                                            <div class="hours" style="font-size: 32px; margin-bottom: 5px;">00</div>
                                            <div style="font-size: 14px; opacity: 0.8;">HOURS</div>
                                        </div>
                                        <div style="text-align: center;">
                                            <div class="minutes" style="font-size: 32px; margin-bottom: 5px;">00</div>
                                            <div style="font-size: 14px; opacity: 0.8;">MINUTES</div>
                                        </div>
                                        <div style="text-align: center;">
                                            <div class="seconds" style="font-size: 32px; margin-bottom: 5px;">00</div>
                                            <div style="font-size: 14px; opacity: 0.8;">SECONDS</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            socialShare: {
                name: 'Social Share',
                icon: 'fas fa-share-alt',
                category: 'Interactive',
                render: (config = {}) => {
                    const title = config.title || 'Share this page';
                    const url = config.url || window.location.href;
                    const platforms = config.platforms || ['facebook', 'twitter', 'linkedin', 'pinterest'];
                    const id = this.generateElementId();
                    
                    const shareButtons = platforms.map(platform => {
                        const icons = {
                            facebook: 'fab fa-facebook-f',
                            twitter: 'fab fa-twitter',
                            linkedin: 'fab fa-linkedin-in',
                            pinterest: 'fab fa-pinterest-p',
                            instagram: 'fab fa-instagram'
                        };
                        
                        const colors = {
                            facebook: '#1877f2',
                            twitter: '#1da1f2',
                            linkedin: '#0077b5',
                            pinterest: '#bd081c',
                            instagram: '#e4405f'
                        };
                        
                        return `
                            <button onclick="shareOn('${platform}', '${url}')" 
                                    style="background: ${colors[platform]}; color: white; border: none; width: 50px; height: 50px; border-radius: 50%; margin: 0 8px; cursor: pointer; transition: transform 0.3s;"
                                    onmouseover="this.style.transform='scale(1.1)'" 
                                    onmouseout="this.style.transform='scale(1)'">
                                <i class="${icons[platform]}"></i>
                            </button>
                        `;
                    }).join('');
                    
                    return `
                        <div class="kb-element kb-social-element" data-element-type="social" data-element-id="${id}" style="margin-bottom: 30px;">
                            <div class="kb-element-content">
                                <div style="text-align: center; padding: 25px; background: #f9fafb; border-radius: 12px;">
                                    <h4 style="margin: 0 0 20px 0; color: #374151;">${title}</h4>
                                    <div style="display: flex; justify-content: center; align-items: center;">
                                        ${shareButtons}
                                    </div>
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            rating: {
                name: 'Star Rating',
                icon: 'fas fa-star',
                category: 'Interactive',
                render: (config = {}) => {
                    const rating = config.rating || 4.5;
                    const maxStars = config.maxStars || 5;
                    const showNumber = config.showNumber !== false;
                    const label = config.label || 'Rating';
                    const id = this.generateElementId();
                    
                    const stars = Array.from({length: maxStars}, (_, i) => {
                        const filled = i < Math.floor(rating);
                        const halfFilled = i === Math.floor(rating) && rating % 1 !== 0;
                        
                        return `
                            <i class="fas fa-star" 
                               style="color: ${filled || halfFilled ? '#fbbf24' : '#e5e7eb'}; font-size: 24px; margin-right: 4px;"></i>
                        `;
                    }).join('');
                    
                    return `
                        <div class="kb-element kb-rating-element" data-element-type="rating" data-element-id="${id}" style="margin-bottom: 20px;">
                            <div class="kb-element-content">
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <span style="font-weight: 500; color: #374151;">${label}:</span>
                                    <div style="display: flex; align-items: center;">
                                        ${stars}
                                        ${showNumber ? `<span style="margin-left: 10px; color: #6b7280; font-size: 16px;">(${rating})</span>` : ''}
                                    </div>
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },

            // LAYOUT WIDGETS (3 widgets)
            spacer: {
                name: 'Spacer',
                icon: 'fas fa-arrows-alt-v',
                category: 'Layout',
                render: (config = {}) => {
                    const height = config.height || '50px';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-spacer-element" data-element-type="spacer" data-element-id="${id}">
                            <div class="kb-element-content" style="height: ${height}; background: repeating-linear-gradient(90deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 11px); border-radius: 4px; position: relative;">
                                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #6b7280;">
                                    Spacer (${height})
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            divider: {
                name: 'Divider',
                icon: 'fas fa-minus',
                category: 'Layout',
                render: (config = {}) => {
                    const style = config.style || 'solid';
                    const color = config.color || '#e5e7eb';
                    const thickness = config.thickness || '2px';
                    const margin = config.margin || '30px';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-divider-element" data-element-type="divider" data-element-id="${id}" style="margin: ${margin} 0;">
                            <div class="kb-element-content">
                                <hr style="border: none; border-top: ${thickness} ${style} ${color}; margin: 0;">
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            columns: {
                name: 'Columns Layout',
                icon: 'fas fa-columns',
                category: 'Layout',
                render: (config = {}) => {
                    const columnCount = config.columnCount || 2;
                    const gap = config.gap || '20px';
                    const id = this.generateElementId();
                    
                    const columns = Array.from({length: columnCount}, (_, i) => `
                        <div class="column" style="flex: 1; min-height: 150px; background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">
                            Column ${i + 1}
                            <br><small>Drop elements here</small>
                        </div>
                    `).join('');
                    
                    return `
                        <div class="kb-element kb-columns-element" data-element-type="columns" data-element-id="${id}" style="margin-bottom: 30px;">
                            <div class="kb-element-content">
                                <div style="display: flex; gap: ${gap};">
                                    ${columns}
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },

            // E-COMMERCE WIDGETS (2 widgets)
            productCard: {
                name: 'Product Card',
                icon: 'fas fa-shopping-bag',
                category: 'E-commerce',
                render: (config = {}) => {
                    const productName = config.productName || 'Sample Product';
                    const price = config.price || '$29.99';
                    const originalPrice = config.originalPrice || '$39.99';
                    const image = config.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';
                    const rating = config.rating || 4.5;
                    const id = this.generateElementId();
                    
                    const stars = Array.from({length: 5}, (_, i) => 
                        `<i class="fas fa-star" style="color: ${i < Math.floor(rating) ? '#fbbf24' : '#e5e7eb'}; font-size: 14px;"></i>`
                    ).join('');
                    
                    return `
                        <div class="kb-element kb-product-element" data-element-type="product" data-element-id="${id}" style="margin-bottom: 30px;">
                            <div class="kb-element-content">
                                <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; max-width: 300px;">
                                    <img src="${image}" alt="${productName}" style="width: 100%; height: 200px; object-fit: cover;">
                                    <div style="padding: 20px;">
                                        <h4 style="margin: 0 0 10px 0; font-size: 18px; color: #1f2937;">${productName}</h4>
                                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                            ${stars}
                                            <span style="margin-left: 8px; color: #6b7280; font-size: 14px;">(${rating})</span>
                                        </div>
                                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                            <span style="font-size: 20px; font-weight: bold; color: #dc2626;">${price}</span>
                                            <span style="margin-left: 10px; text-decoration: line-through; color: #9ca3af;">${originalPrice}</span>
                                        </div>
                                        <button style="width: 100%; background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: background 0.3s;"
                                                onmouseover="this.style.background='#2563eb'" 
                                                onmouseout="this.style.background='#3b82f6'">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            },
            
            pricingTable: {
                name: 'Pricing Table',
                icon: 'fas fa-dollar-sign',
                category: 'E-commerce',
                render: (config = {}) => {
                    const plans = config.plans || [
                        { name: 'Basic', price: '$9', period: '/month', features: ['Feature 1', 'Feature 2', 'Feature 3'], popular: false },
                        { name: 'Pro', price: '$19', period: '/month', features: ['Everything in Basic', 'Feature 4', 'Feature 5', 'Priority Support'], popular: true },
                        { name: 'Enterprise', price: '$39', period: '/month', features: ['Everything in Pro', 'Feature 6', 'Feature 7', 'Custom Integration'], popular: false }
                    ];
                    const id = this.generateElementId();
                    
                    const plansHtml = plans.map(plan => `
                        <div style="flex: 1; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative; ${plan.popular ? 'border: 3px solid #3b82f6; transform: scale(1.05);' : 'border: 1px solid #e5e7eb;'}">
                            ${plan.popular ? '<div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #3b82f6; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 500;">Most Popular</div>' : ''}
                            <h3 style="margin: 0 0 10px 0; text-align: center; color: #1f2937;">${plan.name}</h3>
                            <div style="text-align: center; margin-bottom: 25px;">
                                <span style="font-size: 36px; font-weight: bold; color: #3b82f6;">${plan.price}</span>
                                <span style="color: #6b7280;">${plan.period}</span>
                            </div>
                            <ul style="list-style: none; padding: 0; margin: 0 0 25px 0;">
                                ${plan.features.map(feature => `
                                    <li style="padding: 8px 0; color: #4b5563; display: flex; align-items: center;">
                                        <i class="fas fa-check" style="color: #10b981; margin-right: 10px;"></i>
                                        ${feature}
                                    </li>
                                `).join('')}
                            </ul>
                            <button style="width: 100%; background: ${plan.popular ? '#3b82f6' : '#f3f4f6'}; color: ${plan.popular ? 'white' : '#374151'}; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.3s;">
                                Choose ${plan.name}
                            </button>
                        </div>
                    `).join('');
                    
                    return `
                        <div class="kb-element kb-pricing-element" data-element-type="pricing" data-element-id="${id}" style="margin-bottom: 40px;">
                            <div class="kb-element-content">
                                <div style="display: flex; gap: 20px; align-items: stretch;">
                                    ${plansHtml}
                                </div>
                            </div>
                            ${this.getElementControls(id)}
                        </div>
                    `;
                }
            }
        };
    }

    generateElementId() {
        return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getElementControls(id) {
        return `
            <div class="kb-element-controls" style="position: absolute; top: -15px; right: -15px; display: none; gap: 5px; z-index: 100;">
                <button class="kb-element-control" onclick="kingsBuilder.editElement('${id}')" title="Edit" 
                        style="background: #3b82f6; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-edit" style="font-size: 12px;"></i>
                </button>
                <button class="kb-element-control" onclick="kingsBuilder.duplicateElement('${id}')" title="Duplicate"
                        style="background: #10b981; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-copy" style="font-size: 12px;"></i>
                </button>
                <button class="kb-element-control danger" onclick="kingsBuilder.deleteElement('${id}')" title="Delete"
                        style="background: #ef4444; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-trash" style="font-size: 12px;"></i>
                </button>
            </div>
        `;
    }

    integrateWithBuilder() {
        console.log('🔧 Integrating completion widgets with builder...');
        
        // Add widgets to global builder if it exists
        if (window.kingsBuilder && window.kingsBuilder.widgets) {
            Object.assign(window.kingsBuilder.widgets, this.widgets);
            console.log('✅ Widgets integrated with existing builder');
        }
        
        // Add widgets to critical fix if it exists
        if (window.criticalBuilderFix && window.criticalBuilderFix.widgets) {
            Object.assign(window.criticalBuilderFix.widgets, this.widgets);
            console.log('✅ Widgets integrated with critical fix');
        }
        
        // Update widget sidebar if it exists
        this.updateWidgetSidebar();
        
        // Add interactive functionality
        this.addInteractiveFunctionality();
    }

    updateWidgetSidebar() {
        const widgetSidebar = document.querySelector('.widget-sidebar, .elements-panel, #elements-tab');
        if (!widgetSidebar) return;
        
        console.log('🔧 Updating widget sidebar with new widgets...');
        
        // Group widgets by category
        const categories = {
            'Basic': ['text', 'heading', 'button', 'image', 'icon', 'container'],
            'Forms': ['input', 'textarea', 'select', 'checkbox', 'radio'],
            'Media': ['gallery', 'slider', 'videoEmbed', 'audioPlayer'],
            'Interactive': ['modal', 'progressBar', 'countdown', 'socialShare', 'rating'],
            'Layout': ['spacer', 'divider', 'columns'],
            'E-commerce': ['productCard', 'pricingTable']
        };
        
        let sidebarHTML = '';
        
        Object.entries(categories).forEach(([category, widgetKeys]) => {
            sidebarHTML += `
                <div class="widget-category" style="margin-bottom: 25px;">
                    <h4 style="margin: 0 0 15px 0; padding: 10px; background: #f3f4f6; border-radius: 8px; font-size: 14px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${category}
                    </h4>
                    <div class="widget-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            `;
            
            widgetKeys.forEach(key => {
                const widget = this.widgets[key] || window.kingsBuilder?.widgets?.[key];
                if (widget) {
                    sidebarHTML += `
                        <div class="widget-item" draggable="true" data-widget-type="${key}" 
                             style="padding: 12px; background: white; border: 2px solid #e5e7eb; border-radius: 8px; cursor: grab; text-align: center; transition: all 0.3s; user-select: none;"
                             onmouseover="this.style.borderColor='#3b82f6'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(59,130,246,0.15)'"
                             onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            <i class="${widget.icon}" style="font-size: 20px; color: #3b82f6; margin-bottom: 8px; display: block;"></i>
                            <span style="font-size: 12px; color: #374151; font-weight: 500;">${widget.name}</span>
                        </div>
                    `;
                }
            });
            
            sidebarHTML += `
                    </div>
                </div>
            `;
        });
        
        // Update the sidebar content
        const existingContent = widgetSidebar.innerHTML;
        if (!existingContent.includes('widget-category')) {
            widgetSidebar.innerHTML = sidebarHTML;
        }
    }

    addInteractiveFunctionality() {
        console.log('🔧 Adding interactive functionality...');
        
        // Add global functions for interactive widgets
        window.openModal = (id) => {
            const modal = document.getElementById(`modal-${id}`);
            if (modal) modal.style.display = 'block';
        };
        
        window.closeModal = (id) => {
            const modal = document.getElementById(`modal-${id}`);
            if (modal) modal.style.display = 'none';
        };
        
        window.shareOn = (platform, url) => {
            const shareUrls = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`
            };
            
            if (shareUrls[platform]) {
                window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            }
        };
        
        // Initialize countdown timers
        this.initializeCountdowns();
        
        // Initialize sliders
        this.initializeSliders();
    }

    initializeCountdowns() {
        document.querySelectorAll('[id^="countdown-"]').forEach(countdown => {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 7); // 7 days from now
            
            const updateCountdown = () => {
                const now = new Date().getTime();
                const distance = targetDate.getTime() - now;
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                const daysEl = countdown.querySelector('.days');
                const hoursEl = countdown.querySelector('.hours');
                const minutesEl = countdown.querySelector('.minutes');
                const secondsEl = countdown.querySelector('.seconds');
                
                if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
                if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
                
                if (distance < 0) {
                    countdown.innerHTML = '<div style="font-size: 24px;">Time\'s Up!</div>';
                }
            };
            
            updateCountdown();
            setInterval(updateCountdown, 1000);
        });
    }

    initializeSliders() {
        document.querySelectorAll('.slider-container').forEach(slider => {
            const slides = slider.querySelectorAll('.slide');
            const dots = slider.querySelectorAll('.slider-dot');
            let currentSlide = 0;
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    slides[currentSlide].style.display = 'none';
                    dots[currentSlide].style.background = 'rgba(255,255,255,0.5)';
                    
                    currentSlide = index;
                    slides[currentSlide].style.display = 'block';
                    dots[currentSlide].style.background = '#fff';
                });
            });
            
            // Auto-advance slides every 5 seconds
            setInterval(() => {
                slides[currentSlide].style.display = 'none';
                dots[currentSlide].style.background = 'rgba(255,255,255,0.5)';
                
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].style.display = 'block';
                dots[currentSlide].style.background = '#fff';
            }, 5000);
        });
    }
}

// Initialize completion widgets
console.log('🚀 COMPLETION WIDGETS: Initializing...');
window.completionWidgets = new CompletionWidgets();

console.log('✅ COMPLETION WIDGETS: 25+ widgets loaded successfully!');