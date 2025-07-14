// Video Widget - Advanced Video Integration
// Part of KingsBuilder Phase 2.1: Media Widgets

class VideoWidget {
    constructor() {
        this.type = 'video';
        this.title = 'Video';
        this.icon = 'eicon-youtube';
        this.category = 'media';
    }
    
    // Get default settings
    getDefaultSettings() {
        return {
            video_type: 'youtube',
            youtube_url: '',
            vimeo_url: '',
            hosted_url: '',
            start: 0,
            end: 0,
            autoplay: false,
            mute: false,
            loop: false,
            controls: true,
            modest_branding: false,
            privacy_mode: false,
            rel: false,
            aspect_ratio: '169',
            play_icon: true,
            lightbox: false,
            image_overlay: '',
            lazy_load: true
        };
    }
    
    // Get control panel
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-youtube"></i>
                    Video Settings
                </div>
                
                <!-- Video Type -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Video Type</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="video_type" value="youtube" id="video_youtube" checked>
                                    <label for="video_youtube" title="YouTube">
                                        <i class="fab fa-youtube"></i>
                                    </label>
                                    
                                    <input type="radio" name="video_type" value="vimeo" id="video_vimeo">
                                    <label for="video_vimeo" title="Vimeo">
                                        <i class="fab fa-vimeo"></i>
                                    </label>
                                    
                                    <input type="radio" name="video_type" value="hosted" id="video_hosted">
                                    <label for="video_hosted" title="Self Hosted">
                                        <i class="eicon-video-camera"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- YouTube URL -->
                <div class="elementor-control elementor-control-type-url" data-condition="video_type:youtube">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">YouTube URL</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="url" name="youtube_url" class="elementor-control-input" 
                                       placeholder="https://www.youtube.com/watch?v=...">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Vimeo URL -->
                <div class="elementor-control elementor-control-type-url" data-condition="video_type:vimeo">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Vimeo URL</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="url" name="vimeo_url" class="elementor-control-input" 
                                       placeholder="https://vimeo.com/...">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Hosted Video -->
                <div class="elementor-control elementor-control-type-media" data-condition="video_type:hosted">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Video File</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-control-media">
                                    <div class="elementor-control-media-area">
                                        <div class="elementor-control-media-upload-button">
                                            <i class="eicon-video-camera"></i>
                                            Choose Video
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Aspect Ratio -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Aspect Ratio</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="aspect_ratio" class="elementor-control-input">
                                    <option value="169">16:9</option>
                                    <option value="219">21:9</option>
                                    <option value="43">4:3</option>
                                    <option value="32">3:2</option>
                                    <option value="11">1:1</option>
                                    <option value="916">9:16</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Video Options -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Autoplay</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="autoplay" class="elementor-switch-input">
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Mute</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="mute" class="elementor-switch-input">
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Loop</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="loop" class="elementor-switch-input">
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Player Controls</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="controls" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Lightbox -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Lightbox</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="lightbox" class="elementor-switch-input">
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render the video widget
    render(elementData) {
        const settings = { ...this.getDefaultSettings(), ...elementData.settings };
        
        // Get video embed URL
        const embedUrl = this.getEmbedUrl(settings);
        if (!embedUrl) {
            return this.renderPlaceholder();
        }
        
        // Calculate aspect ratio
        const aspectRatio = this.getAspectRatio(settings.aspect_ratio);
        
        return `
            <div class="elementor-widget-video" data-id="${elementData.id}">
                <div class="elementor-video-wrapper" style="--aspect-ratio: ${aspectRatio};">
                    ${settings.lightbox ? this.renderLightboxTrigger(settings, embedUrl) : this.renderDirectVideo(settings, embedUrl)}
                </div>
            </div>
        `;
    }
    
    // Render direct video embed
    renderDirectVideo(settings, embedUrl) {
        return `
            <div class="elementor-video">
                <iframe 
                    src="${embedUrl}"
                    title="Video Player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="${settings.lazy_load ? 'lazy' : 'eager'}"
                ></iframe>
            </div>
        `;
    }
    
    // Render lightbox trigger
    renderLightboxTrigger(settings, embedUrl) {
        const thumbnailUrl = this.getThumbnailUrl(settings);
        
        return `
            <div class="elementor-video-lightbox" data-video-url="${embedUrl}">
                <div class="elementor-video-thumbnail" style="background-image: url('${thumbnailUrl}');">
                    ${settings.play_icon ? `
                        <div class="elementor-video-play-icon">
                            <i class="eicon-play"></i>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Render placeholder for empty video
    renderPlaceholder() {
        return `
            <div class="elementor-widget-video elementor-video-placeholder">
                <div class="elementor-placeholder">
                    <i class="eicon-video-camera"></i>
                    <div class="elementor-placeholder-title">Video Widget</div>
                    <div class="elementor-placeholder-description">Enter a video URL to display video</div>
                </div>
            </div>
        `;
    }
    
    // Get video embed URL
    getEmbedUrl(settings) {
        switch (settings.video_type) {
            case 'youtube':
                return this.getYouTubeEmbedUrl(settings);
            case 'vimeo':
                return this.getVimeoEmbedUrl(settings);
            case 'hosted':
                return settings.hosted_url;
            default:
                return '';
        }
    }
    
    // Get YouTube embed URL
    getYouTubeEmbedUrl(settings) {
        if (!settings.youtube_url) return '';
        
        const videoId = this.extractYouTubeId(settings.youtube_url);
        if (!videoId) return '';
        
        const params = [];
        
        if (settings.autoplay) params.push('autoplay=1');
        if (settings.mute) params.push('mute=1');
        if (settings.loop) params.push('loop=1', `playlist=${videoId}`);
        if (!settings.controls) params.push('controls=0');
        if (settings.modest_branding) params.push('modestbranding=1');
        if (!settings.rel) params.push('rel=0');
        if (settings.start > 0) params.push(`start=${settings.start}`);
        if (settings.end > 0) params.push(`end=${settings.end}`);
        
        const queryString = params.length > 0 ? '?' + params.join('&') : '';
        
        return `https://www.youtube${settings.privacy_mode ? '-nocookie' : ''}.com/embed/${videoId}${queryString}`;
    }
    
    // Get Vimeo embed URL
    getVimeoEmbedUrl(settings) {
        if (!settings.vimeo_url) return '';
        
        const videoId = this.extractVimeoId(settings.vimeo_url);
        if (!videoId) return '';
        
        const params = [];
        
        if (settings.autoplay) params.push('autoplay=1');
        if (settings.mute) params.push('muted=1');
        if (settings.loop) params.push('loop=1');
        if (!settings.controls) params.push('controls=0');
        
        const queryString = params.length > 0 ? '?' + params.join('&') : '';
        
        return `https://player.vimeo.com/video/${videoId}${queryString}`;
    }
    
    // Extract YouTube video ID
    extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // Extract Vimeo video ID
    extractVimeoId(url) {
        const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }
    
    // Get thumbnail URL
    getThumbnailUrl(settings) {
        if (settings.image_overlay) {
            return settings.image_overlay;
        }
        
        switch (settings.video_type) {
            case 'youtube':
                const youtubeId = this.extractYouTubeId(settings.youtube_url);
                return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : '';
            case 'vimeo':
                // Vimeo thumbnails require API call, use placeholder for now
                return 'https://via.placeholder.com/640x360/000000/ffffff?text=Vimeo+Video';
            default:
                return 'https://via.placeholder.com/640x360/000000/ffffff?text=Video';
        }
    }
    
    // Get aspect ratio value
    getAspectRatio(ratio) {
        const ratios = {
            '169': '56.25%',    // 16:9
            '219': '42.86%',    // 21:9
            '43': '75%',        // 4:3
            '32': '66.67%',     // 3:2
            '11': '100%',       // 1:1
            '916': '177.78%'    // 9:16
        };
        
        return ratios[ratio] || ratios['169'];
    }
    
    // Generate CSS
    generateCSS(settings, elementId) {
        const aspectRatio = this.getAspectRatio(settings.aspect_ratio);
        
        return `
            .elementor-element-${elementId} .elementor-video-wrapper {
                position: relative;
                padding-bottom: var(--aspect-ratio, ${aspectRatio});
                height: 0;
                overflow: hidden;
            }
            
            .elementor-element-${elementId} .elementor-video iframe,
            .elementor-element-${elementId} .elementor-video video {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 0;
            }
            
            .elementor-element-${elementId} .elementor-video-lightbox {
                position: relative;
                height: 100%;
                cursor: pointer;
            }
            
            .elementor-element-${elementId} .elementor-video-thumbnail {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .elementor-element-${elementId} .elementor-video-play-icon {
                width: 80px;
                height: 80px;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                transition: all 0.3s ease;
            }
            
            .elementor-element-${elementId} .elementor-video-play-icon:hover {
                background: rgba(255, 255, 255, 0.9);
                color: #000;
                transform: scale(1.1);
            }
            
            .elementor-element-${elementId} .elementor-video-placeholder {
                min-height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f8f9fa;
                border: 2px dashed #dee2e6;
                border-radius: 8px;
            }
        `;
    }
    
    // Initialize interactions
    initInteractions(element, elementData) {
        // Handle lightbox clicks
        const lightboxTrigger = element.querySelector('.elementor-video-lightbox');
        if (lightboxTrigger) {
            lightboxTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = lightboxTrigger.getAttribute('data-video-url');
                this.openLightbox(videoUrl);
            });
        }
    }
    
    // Open video lightbox
    openLightbox(videoUrl) {
        const lightbox = document.createElement('div');
        lightbox.className = 'elementor-video-lightbox-modal';
        lightbox.innerHTML = `
            <div class="elementor-video-lightbox-content">
                <button class="elementor-video-lightbox-close">&times;</button>
                <div class="elementor-video-lightbox-video">
                    <iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        `;
        
        // Add styles
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const content = lightbox.querySelector('.elementor-video-lightbox-content');
        content.style.cssText = `
            position: relative;
            width: 90%;
            max-width: 900px;
            aspect-ratio: 16/9;
        `;
        
        const closeBtn = lightbox.querySelector('.elementor-video-lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            z-index: 1;
        `;
        
        const videoContainer = lightbox.querySelector('.elementor-video-lightbox-video');
        videoContainer.style.cssText = `
            width: 100%;
            height: 100%;
        `;
        
        const iframe = lightbox.querySelector('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
        `;
        
        // Close handlers
        closeBtn.addEventListener('click', () => document.body.removeChild(lightbox));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) document.body.removeChild(lightbox);
        });
        
        document.body.appendChild(lightbox);
    }
}

// Export for use in main builder
window.VideoWidget = VideoWidget;