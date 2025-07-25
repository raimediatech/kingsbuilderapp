/**
 * KingsBuilder Advanced Widgets
 * =====================================================
 * Advanced widgets with complex functionality
 */

/**
 * Icon Widget
 */
class IconWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Icon';
        this.icon = 'fas fa-star';
        this.category = 'general';
        this.keywords = ['icon', 'symbol', 'fontawesome'];
    }

    getDefaultSettings() {
        return {
            icon: 'fas fa-star',
            size: '50',
            color: '#007cba',
            alignment: 'center',
            link: '',
            hover_color: ''
        };
    }

    getControls() {
        return [
            {
                name: 'content',
                label: 'Content',
                tab: 'content',
                controls: [
                    {
                        name: 'icon',
                        label: 'Icon',
                        type: 'icon',
                        default: 'fas fa-star'
                    },
                    {
                        name: 'link',
                        label: 'Link',
                        type: 'url',
                        default: ''
                    },
                    {
                        name: 'alignment',
                        label: 'Alignment',
                        type: 'choose',
                        options: {
                            'left': { title: 'Left', icon: 'fas fa-align-left' },
                            'center': { title: 'Center', icon: 'fas fa-align-center' },
                            'right': { title: 'Right', icon: 'fas fa-align-right' }
                        },
                        default: 'center'
                    }
                ]
            },
            {
                name: 'style',
                label: 'Style',
                tab: 'style',
                controls: [
                    {
                        name: 'color',
                        label: 'Color',
                        type: 'color',
                        default: '#007cba'
                    },
                    {
                        name: 'size',
                        label: 'Size (px)',
                        type: 'slider',
                        range: { min: 10, max: 200 },
                        default: 50
                    },
                    {
                        name: 'hover_color',
                        label: 'Hover Color',
                        type: 'color',
                        default: ''
                    }
                ]
            }
        ];
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        const iconStyles = [
            `font-size: ${config.size}px`,
            `color: ${config.color}`,
            `transition: color 0.3s ease`
        ].join('; ');

        const wrapperStyles = `text-align: ${config.alignment}`;
        
        const hoverStyle = config.hover_color ? 
            `<style>.kb-icon:hover { color: ${config.hover_color} !important; }</style>` : '';

        const iconElement = `<i class="${config.icon} kb-icon" style="${iconStyles}"></i>`;
        
        const content = config.link ? 
            `<a href="${config.link}" style="text-decoration: none;">${iconElement}</a>` : 
            iconElement;

        return `
            ${hoverStyle}
            <div class="kb-icon-wrapper" style="${wrapperStyles}">
                ${content}
            </div>
        `;
    }
}

/**
 * Icon Box Widget
 */
class IconBoxWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Icon Box';
        this.icon = 'fas fa-cube';
        this.category = 'general';
        this.keywords = ['icon', 'box', 'feature', 'service'];
    }

    getDefaultSettings() {
        return {
            icon: 'fas fa-star',
            title: 'This is the heading',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            position: 'top',
            alignment: 'center',
            icon_color: '#007cba',
            icon_size: '40',
            title_color: '#000000',
            description_color: '#666666'
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        const iconStyles = [
            `font-size: ${config.icon_size}px`,
            `color: ${config.icon_color}`,
            `margin-bottom: 15px`
        ].join('; ');

        const titleStyles = [
            `color: ${config.title_color}`,
            `margin-bottom: 10px`,
            `font-size: 18px`,
            `font-weight: 600`
        ].join('; ');

        const descriptionStyles = [
            `color: ${config.description_color}`,
            `line-height: 1.6`
        ].join('; ');

        const wrapperStyles = `text-align: ${config.alignment}`;

        return `
            <div class="kb-icon-box" style="${wrapperStyles}">
                <div class="kb-icon-box-icon">
                    <i class="${config.icon}" style="${iconStyles}"></i>
                </div>
                <div class="kb-icon-box-content">
                    <h3 class="kb-icon-box-title" style="${titleStyles}">${config.title}</h3>
                    <p class="kb-icon-box-description" style="${descriptionStyles}">${config.description}</p>
                </div>
            </div>
        `;
    }
}

/**
 * Video Widget
 */
class VideoWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Video';
        this.icon = 'fas fa-play';
        this.category = 'media';
        this.keywords = ['video', 'youtube', 'vimeo', 'media'];
    }

    getDefaultSettings() {
        return {
            video_type: 'youtube',
            youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            vimeo_url: '',
            hosted_url: '',
            aspect_ratio: '169',
            autoplay: false,
            mute: false,
            controls: true
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        let embedCode = '';
        
        if (config.video_type === 'youtube' && config.youtube_url) {
            const videoId = this.extractYouTubeId(config.youtube_url);
            if (videoId) {
                const params = new URLSearchParams({
                    autoplay: config.autoplay ? '1' : '0',
                    mute: config.mute ? '1' : '0',
                    controls: config.controls ? '1' : '0'
                });
                
                embedCode = `
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}?${params.toString()}"
                        frameborder="0"
                        allowfullscreen
                        style="width: 100%; height: 100%;">
                    </iframe>
                `;
            }
        }
        
        const aspectRatio = config.aspect_ratio === '169' ? '56.25%' : '75%'; // 16:9 or 4:3
        
        return `
            <div class="kb-video-wrapper" style="position: relative; padding-bottom: ${aspectRatio}; height: 0; overflow: hidden;">
                ${embedCode || '<div style="background: #f0f0f0; height: 100%; display: flex; align-items: center; justify-content: center; color: #666;">Video placeholder</div>'}
            </div>
        `;
    }

    extractYouTubeId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}

/**
 * Accordion Widget
 */
class AccordionWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Accordion';
        this.icon = 'fas fa-bars';
        this.category = 'general';
        this.keywords = ['accordion', 'collapse', 'faq', 'toggle'];
    }

    getDefaultSettings() {
        return {
            items: [
                {
                    title: 'Accordion Item #1',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    active: true
                },
                {
                    title: 'Accordion Item #2',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    active: false
                },
                {
                    title: 'Accordion Item #3',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    active: false
                }
            ],
            title_color: '#000000',
            content_color: '#666666',
            background_color: '#ffffff',
            border_color: '#e0e0e0'
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        const accordionId = 'accordion_' + Math.random().toString(36).substr(2, 9);
        
        let html = `<div class="kb-accordion" id="${accordionId}">`;
        
        config.items.forEach((item, index) => {
            const itemId = `${accordionId}_item_${index}`;
            const isActive = item.active ? 'active' : '';
            const isOpen = item.active ? 'show' : '';
            
            html += `
                <div class="kb-accordion-item ${isActive}">
                    <div class="kb-accordion-header" 
                         style="background: ${config.background_color}; border: 1px solid ${config.border_color}; padding: 15px; cursor: pointer;"
                         onclick="kingsBuilderToggleAccordion('${itemId}')">
                        <h4 style="color: ${config.title_color}; margin: 0; display: flex; justify-content: space-between; align-items: center;">
                            ${item.title}
                            <i class="fas fa-chevron-down kb-accordion-icon" style="transition: transform 0.3s;"></i>
                        </h4>
                    </div>
                    <div class="kb-accordion-content ${isOpen}" 
                         id="${itemId}"
                         style="border: 1px solid ${config.border_color}; border-top: none; padding: ${isOpen ? '15px' : '0 15px'}; max-height: ${isOpen ? '1000px' : '0'}; overflow: hidden; transition: all 0.3s ease;">
                        <p style="color: ${config.content_color}; margin: 0;">${item.content}</p>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add toggle function to global scope if not exists
        if (!window.kingsBuilderToggleAccordion) {
            window.kingsBuilderToggleAccordion = function(itemId) {
                const content = document.getElementById(itemId);
                const header = content.previousElementSibling;
                const icon = header.querySelector('.kb-accordion-icon');
                
                if (content.classList.contains('show')) {
                    content.classList.remove('show');
                    content.style.maxHeight = '0';
                    content.style.padding = '0 15px';
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    content.classList.add('show');
                    content.style.maxHeight = '1000px';
                    content.style.padding = '15px';
                    icon.style.transform = 'rotate(180deg)';
                }
            };
        }
        
        return html;
    }
}

/**
 * Tabs Widget
 */
class TabsWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Tabs';
        this.icon = 'fas fa-folder-open';
        this.category = 'general';
        this.keywords = ['tabs', 'tabbed', 'content', 'switch'];
    }

    getDefaultSettings() {
        return {
            tabs: [
                { title: 'Tab #1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
                { title: 'Tab #2', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
                { title: 'Tab #3', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
            ],
            active_tab: 0,
            tab_color: '#666666',
            active_tab_color: '#007cba',
            content_color: '#000000'
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        const tabsId = 'tabs_' + Math.random().toString(36).substr(2, 9);
        
        let html = `<div class="kb-tabs" id="${tabsId}">`;
        
        // Tab headers
        html += '<div class="kb-tabs-nav" style="border-bottom: 1px solid #e0e0e0; margin-bottom: 20px;">';
        config.tabs.forEach((tab, index) => {
            const isActive = index === config.active_tab;
            const tabStyle = [
                `color: ${isActive ? config.active_tab_color : config.tab_color}`,
                `padding: 10px 20px`,
                `cursor: pointer`,
                `display: inline-block`,
                `border-bottom: 2px solid ${isActive ? config.active_tab_color : 'transparent'}`,
                `transition: all 0.3s ease`
            ].join('; ');
            
            html += `
                <div class="kb-tab-nav ${isActive ? 'active' : ''}" 
                     style="${tabStyle}"
                     onclick="kingsBuilderSwitchTab('${tabsId}', ${index})">
                    ${tab.title}
                </div>
            `;
        });
        html += '</div>';
        
        // Tab content
        html += '<div class="kb-tabs-content">';
        config.tabs.forEach((tab, index) => {
            const isActive = index === config.active_tab;
            html += `
                <div class="kb-tab-pane ${isActive ? 'active' : ''}" 
                     style="display: ${isActive ? 'block' : 'none'}; color: ${config.content_color};">
                    ${tab.content}
                </div>
            `;
        });
        html += '</div>';
        
        html += '</div>';
        
        // Add switch function to global scope if not exists
        if (!window.kingsBuilderSwitchTab) {
            window.kingsBuilderSwitchTab = function(tabsId, activeIndex) {
                const tabsContainer = document.getElementById(tabsId);
                const navItems = tabsContainer.querySelectorAll('.kb-tab-nav');
                const panes = tabsContainer.querySelectorAll('.kb-tab-pane');
                
                // Update nav items
                navItems.forEach((nav, index) => {
                    if (index === activeIndex) {
                        nav.classList.add('active');
                        nav.style.borderBottomColor = nav.style.color;
                    } else {
                        nav.classList.remove('active');
                        nav.style.borderBottomColor = 'transparent';
                    }
                });
                
                // Update content panes
                panes.forEach((pane, index) => {
                    if (index === activeIndex) {
                        pane.classList.add('active');
                        pane.style.display = 'block';
                    } else {
                        pane.classList.remove('active');
                        pane.style.display = 'none';
                    }
                });
            };
        }
        
        return html;
    }
}

/**
 * Contact Form Widget
 */
class ContactFormWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Contact Form';
        this.icon = 'fas fa-envelope';
        this.category = 'forms';
        this.keywords = ['form', 'contact', 'email', 'message'];
    }

    getDefaultSettings() {
        return {
            show_labels: true,
            fields: [
                { type: 'text', label: 'Name', placeholder: 'Your Name', required: true },
                { type: 'email', label: 'Email', placeholder: 'Your Email', required: true },
                { type: 'textarea', label: 'Message', placeholder: 'Your Message', required: true }
            ],
            button_text: 'Send Message',
            button_color: '#007cba',
            button_text_color: '#ffffff'
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        const formId = 'form_' + Math.random().toString(36).substr(2, 9);
        
        let html = `<form class="kb-contact-form" id="${formId}" onsubmit="return kingsBuilderSubmitForm(event, '${formId}')">`;
        
        config.fields.forEach((field, index) => {
            const fieldId = `${formId}_field_${index}`;
            const required = field.required ? 'required' : '';
            
            html += '<div class="kb-form-field" style="margin-bottom: 20px;">';
            
            if (config.show_labels) {
                html += `<label for="${fieldId}" style="display: block; margin-bottom: 5px; font-weight: 500;">${field.label}${field.required ? ' *' : ''}</label>`;
            }
            
            const fieldStyle = [
                'width: 100%',
                'padding: 12px',
                'border: 1px solid #ddd',
                'border-radius: 4px',
                'font-size: 14px',
                'box-sizing: border-box'
            ].join('; ');
            
            if (field.type === 'textarea') {
                html += `<textarea id="${fieldId}" name="${field.label.toLowerCase()}" placeholder="${field.placeholder}" ${required} style="${fieldStyle}; min-height: 100px; resize: vertical;"></textarea>`;
            } else {
                html += `<input type="${field.type}" id="${fieldId}" name="${field.label.toLowerCase()}" placeholder="${field.placeholder}" ${required} style="${fieldStyle}">`;
            }
            
            html += '</div>';
        });
        
        const buttonStyle = [
            `background-color: ${config.button_color}`,
            `color: ${config.button_text_color}`,
            'border: none',
            'padding: 12px 24px',
            'border-radius: 4px',
            'cursor: pointer',
            'font-size: 14px',
            'transition: opacity 0.3s ease'
        ].join('; ');
        
        html += `<button type="submit" style="${buttonStyle}" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">${config.button_text}</button>`;
        html += '</form>';
        
        // Add submit function to global scope if not exists
        if (!window.kingsBuilderSubmitForm) {
            window.kingsBuilderSubmitForm = function(event, formId) {
                event.preventDefault();
                
                // Simple form validation and submission
                const form = document.getElementById(formId);
                const formData = new FormData(form);
                
                // Show success message (in real implementation, send to server)
                window.kingsBuilder?.showNotification('Message sent successfully!', 'success');
                form.reset();
                
                return false;
            };
        }
        
        return html;
    }
}

// Additional utility widgets
class AudioWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Audio';
        this.icon = 'fas fa-music';
        this.category = 'media';
        this.keywords = ['audio', 'music', 'sound', 'mp3'];
    }

    getDefaultSettings() {
        return {
            audio_url: '',
            controls: true,
            autoplay: false,
            loop: false
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        if (!config.audio_url) {
            return `
                <div class="kb-audio-placeholder" style="background: #f0f0f0; padding: 40px; text-align: center; border: 2px dashed #ccc;">
                    <i class="fas fa-music" style="font-size: 48px; color: #ccc; margin-bottom: 10px;"></i>
                    <p style="color: #666; margin: 0;">Add audio URL in settings</p>
                </div>
            `;
        }
        
        const attributes = [
            config.controls ? 'controls' : '',
            config.autoplay ? 'autoplay' : '',
            config.loop ? 'loop' : ''
        ].filter(Boolean).join(' ');
        
        return `
            <div class="kb-audio-wrapper">
                <audio ${attributes} style="width: 100%;">
                    <source src="${config.audio_url}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>
        `;
    }
}

class ImageGalleryWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Image Gallery';
        this.icon = 'fas fa-images';
        this.category = 'media';
        this.keywords = ['gallery', 'images', 'photos', 'grid'];
    }

    getDefaultSettings() {
        return {
            images: [
                { url: 'https://via.placeholder.com/300x200/007cba/ffffff?text=Image+1', alt: 'Image 1' },
                { url: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Image+2', alt: 'Image 2' },
                { url: 'https://via.placeholder.com/300x200/dc3545/ffffff?text=Image+3', alt: 'Image 3' },
                { url: 'https://via.placeholder.com/300x200/ffc107/000000?text=Image+4', alt: 'Image 4' }
            ],
            columns: 3,
            gap: 15
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        const gridStyle = [
            'display: grid',
            `grid-template-columns: repeat(${config.columns}, 1fr)`,
            `gap: ${config.gap}px`
        ].join('; ');
        
        let html = `<div class="kb-image-gallery" style="${gridStyle}">`;
        
        config.images.forEach((image, index) => {
            html += `
                <div class="kb-gallery-item">
                    <img src="${image.url}" 
                         alt="${image.alt}" 
                         style="width: 100%; height: auto; border-radius: 4px; cursor: pointer;"
                         onclick="kingsBuilderOpenLightbox('${image.url}', '${image.alt}')">
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add lightbox function if not exists
        if (!window.kingsBuilderOpenLightbox) {
            window.kingsBuilderOpenLightbox = function(src, alt) {
                // Simple lightbox implementation
                const lightbox = document.createElement('div');
                lightbox.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
                    align-items: center; justify-content: center; cursor: pointer;
                `;
                
                lightbox.innerHTML = `
                    <img src="${src}" alt="${alt}" style="max-width: 90%; max-height: 90%; border-radius: 8px;">
                `;
                
                lightbox.onclick = () => lightbox.remove();
                document.body.appendChild(lightbox);
            };
        }
        
        return html;
    }
}

class ImageCarouselWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Image Carousel';
        this.icon = 'fas fa-images';
        this.category = 'media';
        this.keywords = ['carousel', 'slider', 'images', 'slideshow'];
    }

    getDefaultSettings() {
        return {
            images: [
                { url: 'https://via.placeholder.com/800x400/007cba/ffffff?text=Slide+1', alt: 'Slide 1' },
                { url: 'https://via.placeholder.com/800x400/28a745/ffffff?text=Slide+2', alt: 'Slide 2' },
                { url: 'https://via.placeholder.com/800x400/dc3545/ffffff?text=Slide+3', alt: 'Slide 3' }
            ],
            autoplay: true,
            interval: 5000,
            show_arrows: true,
            show_dots: true
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        const carouselId = 'carousel_' + Math.random().toString(36).substr(2, 9);
        
        let html = `<div class="kb-carousel" id="${carouselId}" style="position: relative; overflow: hidden; border-radius: 8px;">`;
        
        // Images
        html += '<div class="kb-carousel-inner" style="position: relative; width: 100%; height: 400px;">';
        config.images.forEach((image, index) => {
            const isActive = index === 0;
            html += `
                <div class="kb-carousel-item ${isActive ? 'active' : ''}" 
                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: ${isActive ? '1' : '0'}; transition: opacity 0.5s ease;">
                    <img src="${image.url}" alt="${image.alt}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            `;
        });
        html += '</div>';
        
        // Navigation arrows
        if (config.show_arrows) {
            html += `
                <button class="kb-carousel-prev" 
                        style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 10px 15px; cursor: pointer; border-radius: 4px;"
                        onclick="kingsBuilderCarouselPrev('${carouselId}')">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="kb-carousel-next" 
                        style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 10px 15px; cursor: pointer; border-radius: 4px;"
                        onclick="kingsBuilderCarouselNext('${carouselId}')">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
        
        // Dots indicator
        if (config.show_dots) {
            html += '<div class="kb-carousel-dots" style="position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px;">';
            config.images.forEach((_, index) => {
                const isActive = index === 0;
                html += `
                    <button class="kb-carousel-dot ${isActive ? 'active' : ''}" 
                            style="width: 12px; height: 12px; border-radius: 50%; border: none; background: ${isActive ? 'white' : 'rgba(255,255,255,0.5)'}; cursor: pointer;"
                            onclick="kingsBuilderCarouselGoTo('${carouselId}', ${index})">
                    </button>
                `;
            });
            html += '</div>';
        }
        
        html += '</div>';
        
        // Add carousel functions if not exist
        if (!window.kingsBuilderCarouselFunctions) {
            window.kingsBuilderCarouselFunctions = true;
            
            window.kingsBuilderCarouselNext = function(carouselId) {
                const carousel = document.getElementById(carouselId);
                const items = carousel.querySelectorAll('.kb-carousel-item');
                const dots = carousel.querySelectorAll('.kb-carousel-dot');
                let current = Array.from(items).findIndex(item => item.classList.contains('active'));
                
                items[current].classList.remove('active');
                items[current].style.opacity = '0';
                if (dots[current]) dots[current].classList.remove('active');
                if (dots[current]) dots[current].style.background = 'rgba(255,255,255,0.5)';
                
                current = (current + 1) % items.length;
                
                items[current].classList.add('active');
                items[current].style.opacity = '1';
                if (dots[current]) dots[current].classList.add('active');
                if (dots[current]) dots[current].style.background = 'white';
            };
            
            window.kingsBuilderCarouselPrev = function(carouselId) {
                const carousel = document.getElementById(carouselId);
                const items = carousel.querySelectorAll('.kb-carousel-item');
                const dots = carousel.querySelectorAll('.kb-carousel-dot');
                let current = Array.from(items).findIndex(item => item.classList.contains('active'));
                
                items[current].classList.remove('active');
                items[current].style.opacity = '0';
                if (dots[current]) dots[current].classList.remove('active');
                if (dots[current]) dots[current].style.background = 'rgba(255,255,255,0.5)';
                
                current = current === 0 ? items.length - 1 : current - 1;
                
                items[current].classList.add('active');
                items[current].style.opacity = '1';
                if (dots[current]) dots[current].classList.add('active');
                if (dots[current]) dots[current].style.background = 'white';
            };
            
            window.kingsBuilderCarouselGoTo = function(carouselId, index) {
                const carousel = document.getElementById(carouselId);
                const items = carousel.querySelectorAll('.kb-carousel-item');
                const dots = carousel.querySelectorAll('.kb-carousel-dot');
                
                items.forEach((item, i) => {
                    if (i === index) {
                        item.classList.add('active');
                        item.style.opacity = '1';
                    } else {
                        item.classList.remove('active');
                        item.style.opacity = '0';
                    }
                });
                
                dots.forEach((dot, i) => {
                    if (i === index) {
                        dot.classList.add('active');
                        dot.style.background = 'white';
                    } else {
                        dot.classList.remove('active');
                        dot.style.background = 'rgba(255,255,255,0.5)';
                    }
                });
            };
        }
        
        return html;
    }
}

class IconListWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Icon List';
        this.icon = 'fas fa-list';
        this.category = 'general';
        this.keywords = ['list', 'icon', 'features', 'checklist'];
    }

    getDefaultSettings() {
        return {
            items: [
                { icon: 'fas fa-check', text: 'List item #1' },
                { icon: 'fas fa-check', text: 'List item #2' },
                { icon: 'fas fa-check', text: 'List item #3' }
            ],
            icon_color: '#007cba',
            text_color: '#000000',
            gap: '10'
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        let html = '<div class="kb-icon-list">';
        
        config.items.forEach(item => {
            html += `
                <div class="kb-icon-list-item" style="display: flex; align-items: center; margin-bottom: ${config.gap}px;">
                    <i class="${item.icon}" style="color: ${config.icon_color}; margin-right: 10px; font-size: 16px;"></i>
                    <span style="color: ${config.text_color};">${item.text}</span>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
}

class ToggleWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Toggle';
        this.icon = 'fas fa-toggle-on';
        this.category = 'general';
        this.keywords = ['toggle', 'collapse', 'expand', 'show', 'hide'];
    }

    getDefaultSettings() {
        return {
            title: 'Toggle Title',
            content: 'Toggle content goes here. Click the title to show/hide this content.',
            title_color: '#000000',
            content_color: '#666666',
            icon: 'fas fa-plus'
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        const toggleId = 'toggle_' + Math.random().toString(36).substr(2, 9);
        
        const html = `
            <div class="kb-toggle">
                <div class="kb-toggle-header" 
                     style="cursor: pointer; padding: 15px; background: #f8f9fa; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;"
                     onclick="kingsBuilderToggleContent('${toggleId}')">
                    <h4 style="color: ${config.title_color}; margin: 0;">${config.title}</h4>
                    <i class="${config.icon} kb-toggle-icon" id="${toggleId}_icon" style="transition: transform 0.3s;"></i>
                </div>
                <div class="kb-toggle-content" 
                     id="${toggleId}"
                     style="max-height: 0; overflow: hidden; transition: all 0.3s ease; border: 1px solid #e0e0e0; border-top: none;">
                    <div style="padding: 15px; color: ${config.content_color};">
                        ${config.content}
                    </div>
                </div>
            </div>
        `;
        
        // Add toggle function if not exists
        if (!window.kingsBuilderToggleContent) {
            window.kingsBuilderToggleContent = function(toggleId) {
                const content = document.getElementById(toggleId);
                const icon = document.getElementById(toggleId + '_icon');
                
                if (content.style.maxHeight === '0px' || !content.style.maxHeight) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    icon.style.transform = 'rotate(45deg)';
                } else {
                    content.style.maxHeight = '0';
                    icon.style.transform = 'rotate(0deg)';
                }
            };
        }
        
        return html;
    }
}

// Export advanced widgets
window.IconWidget = IconWidget;
window.IconBoxWidget = IconBoxWidget;
window.VideoWidget = VideoWidget;
window.AccordionWidget = AccordionWidget;
window.TabsWidget = TabsWidget;
window.ContactFormWidget = ContactFormWidget;
window.AudioWidget = AudioWidget;
window.ImageGalleryWidget = ImageGalleryWidget;
window.ImageCarouselWidget = ImageCarouselWidget;
window.IconListWidget = IconListWidget;
window.ToggleWidget = ToggleWidget;