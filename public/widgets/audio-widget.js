// Audio Widget - Advanced Audio Player
// Part of KingsBuilder Phase 2.1: Media Widgets

class AudioWidget {
    constructor() {
        this.type = 'audio';
        this.title = 'Audio';
        this.icon = 'eicon-headphones';
        this.category = 'media';
    }
    
    getDefaultSettings() {
        return {
            audio_source: 'hosted',
            hosted_url: '',
            soundcloud_url: '',
            spotify_url: '',
            show_controls: true,
            autoplay: false,
            loop: false,
            muted: false,
            preload: 'metadata',
            download: false,
            player_style: 'default',
            primary_color: '#007cba',
            secondary_color: '#f1f1f1',
            show_artwork: true,
            show_title: true,
            show_artist: true,
            show_duration: true,
            show_progress: true,
            show_volume: true,
            playlist_mode: false,
            playlist: []
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-headphones"></i>
                    Audio Settings
                </div>
                
                <!-- Audio Source -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Audio Source</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="audio_source" value="hosted" id="audio_hosted" checked>
                                    <label for="audio_hosted" title="Self Hosted">
                                        <i class="eicon-upload"></i>
                                    </label>
                                    
                                    <input type="radio" name="audio_source" value="soundcloud" id="audio_soundcloud">
                                    <label for="audio_soundcloud" title="SoundCloud">
                                        <i class="fab fa-soundcloud"></i>
                                    </label>
                                    
                                    <input type="radio" name="audio_source" value="spotify" id="audio_spotify">
                                    <label for="audio_spotify" title="Spotify">
                                        <i class="fab fa-spotify"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Hosted Audio -->
                <div class="elementor-control elementor-control-type-media" data-condition="audio_source:hosted">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Audio File</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-control-media">
                                    <div class="elementor-control-media-area">
                                        <div class="elementor-control-media-upload-button">
                                            <i class="eicon-headphones"></i>
                                            Choose Audio File
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- SoundCloud URL -->
                <div class="elementor-control elementor-control-type-url" data-condition="audio_source:soundcloud">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">SoundCloud URL</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="url" name="soundcloud_url" class="elementor-control-input" 
                                       placeholder="https://soundcloud.com/...">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Player Style -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Player Style</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="player_style" class="elementor-control-input">
                                    <option value="default">Default</option>
                                    <option value="minimal">Minimal</option>
                                    <option value="modern">Modern</option>
                                    <option value="compact">Compact</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Player Options -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Show Controls</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="show_controls" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
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
                
                <!-- Colors -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Primary Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="primary_color" data-default="#007cba">
                                    <button type="button" class="pcr-button" style="color: #007cba;" aria-label="Toggle color picker dialog"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    render(elementData) {
        const settings = { ...this.getDefaultSettings(), ...elementData.settings };
        
        if (!this.hasAudioSource(settings)) {
            return this.renderPlaceholder();
        }
        
        switch (settings.audio_source) {
            case 'hosted':
                return this.renderHostedAudio(elementData, settings);
            case 'soundcloud':
                return this.renderSoundCloudAudio(elementData, settings);
            case 'spotify':
                return this.renderSpotifyAudio(elementData, settings);
            default:
                return this.renderPlaceholder();
        }
    }
    
    renderHostedAudio(elementData, settings) {
        return `
            <div class="elementor-widget-audio elementor-audio-${settings.player_style}" data-id="${elementData.id}">
                <div class="elementor-audio-player">
                    ${settings.show_artwork ? this.renderArtwork(settings) : ''}
                    
                    <div class="elementor-audio-content">
                        ${settings.show_title || settings.show_artist ? this.renderTrackInfo(settings) : ''}
                        
                        <div class="elementor-audio-controls">
                            <audio 
                                ${settings.show_controls ? 'controls' : ''}
                                ${settings.autoplay ? 'autoplay' : ''}
                                ${settings.loop ? 'loop' : ''}
                                ${settings.muted ? 'muted' : ''}
                                preload="${settings.preload}"
                                ${settings.download ? 'controlsList="nodownload"' : 'controlsList="nodownload"'}
                                src="${settings.hosted_url}"
                                class="elementor-audio-element"
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                        
                        ${!settings.show_controls ? this.renderCustomControls(settings) : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSoundCloudAudio(elementData, settings) {
        const embedUrl = this.getSoundCloudEmbedUrl(settings.soundcloud_url, settings);
        
        return `
            <div class="elementor-widget-audio elementor-audio-soundcloud" data-id="${elementData.id}">
                <div class="elementor-audio-embed">
                    <iframe 
                        src="${embedUrl}"
                        width="100%" 
                        height="166" 
                        frameborder="no" 
                        allow="autoplay"
                        loading="lazy">
                    </iframe>
                </div>
            </div>
        `;
    }
    
    renderSpotifyAudio(elementData, settings) {
        const embedUrl = this.getSpotifyEmbedUrl(settings.spotify_url);
        
        return `
            <div class="elementor-widget-audio elementor-audio-spotify" data-id="${elementData.id}">
                <div class="elementor-audio-embed">
                    <iframe 
                        src="${embedUrl}"
                        width="100%" 
                        height="152" 
                        frameborder="0" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy">
                    </iframe>
                </div>
            </div>
        `;
    }
    
    renderArtwork(settings) {
        const artworkUrl = settings.artwork_url || 'https://via.placeholder.com/150x150/333333/ffffff?text=♪';
        
        return `
            <div class="elementor-audio-artwork">
                <img src="${artworkUrl}" alt="Audio Artwork" loading="lazy">
            </div>
        `;
    }
    
    renderTrackInfo(settings) {
        return `
            <div class="elementor-audio-info">
                ${settings.show_title ? `<div class="elementor-audio-title">${settings.track_title || 'Audio Track'}</div>` : ''}
                ${settings.show_artist ? `<div class="elementor-audio-artist">${settings.track_artist || 'Unknown Artist'}</div>` : ''}
            </div>
        `;
    }
    
    renderCustomControls(settings) {
        return `
            <div class="elementor-audio-custom-controls">
                <button class="elementor-audio-play-pause">
                    <i class="eicon-play" data-play-icon="eicon-play" data-pause-icon="eicon-pause"></i>
                </button>
                
                ${settings.show_progress ? `
                    <div class="elementor-audio-progress-container">
                        <div class="elementor-audio-progress">
                            <div class="elementor-audio-progress-bar"></div>
                        </div>
                        ${settings.show_duration ? '<div class="elementor-audio-time">0:00 / 0:00</div>' : ''}
                    </div>
                ` : ''}
                
                ${settings.show_volume ? `
                    <div class="elementor-audio-volume-container">
                        <button class="elementor-audio-volume-toggle">
                            <i class="eicon-volume-up"></i>
                        </button>
                        <div class="elementor-audio-volume-slider">
                            <input type="range" min="0" max="100" value="100" class="elementor-audio-volume-input">
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    renderPlaceholder() {
        return `
            <div class="elementor-widget-audio elementor-audio-placeholder">
                <div class="elementor-placeholder">
                    <i class="eicon-headphones"></i>
                    <div class="elementor-placeholder-title">Audio Widget</div>
                    <div class="elementor-placeholder-description">Select an audio source to display audio player</div>
                </div>
            </div>
        `;
    }
    
    hasAudioSource(settings) {
        switch (settings.audio_source) {
            case 'hosted':
                return !!settings.hosted_url;
            case 'soundcloud':
                return !!settings.soundcloud_url;
            case 'spotify':
                return !!settings.spotify_url;
            default:
                return false;
        }
    }
    
    getSoundCloudEmbedUrl(url, settings) {
        if (!url) return '';
        
        const params = [];
        params.push(`url=${encodeURIComponent(url)}`);
        params.push(`color=${encodeURIComponent(settings.primary_color.replace('#', ''))}`);
        params.push(`auto_play=${settings.autoplay ? 'true' : 'false'}`);
        params.push('hide_related=false');
        params.push('show_comments=true');
        params.push('show_user=true');
        params.push('show_reposts=false');
        params.push('show_teaser=true');
        
        return `https://w.soundcloud.com/player/?${params.join('&')}`;
    }
    
    getSpotifyEmbedUrl(url) {
        if (!url) return '';
        
        // Convert Spotify URL to embed URL
        const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
        const playlistMatch = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
        const albumMatch = url.match(/spotify\.com\/album\/([a-zA-Z0-9]+)/);
        
        if (trackMatch) {
            return `https://open.spotify.com/embed/track/${trackMatch[1]}`;
        } else if (playlistMatch) {
            return `https://open.spotify.com/embed/playlist/${playlistMatch[1]}`;
        } else if (albumMatch) {
            return `https://open.spotify.com/embed/album/${albumMatch[1]}`;
        }
        
        return '';
    }
    
    generateCSS(settings, elementId) {
        return `
            .elementor-element-${elementId} .elementor-audio-player {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                background: ${settings.secondary_color};
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .elementor-element-${elementId} .elementor-audio-artwork {
                flex-shrink: 0;
            }
            
            .elementor-element-${elementId} .elementor-audio-artwork img {
                width: 60px;
                height: 60px;
                border-radius: 6px;
                object-fit: cover;
            }
            
            .elementor-element-${elementId} .elementor-audio-content {
                flex: 1;
                min-width: 0;
            }
            
            .elementor-element-${elementId} .elementor-audio-info {
                margin-bottom: 8px;
            }
            
            .elementor-element-${elementId} .elementor-audio-title {
                font-weight: 600;
                font-size: 14px;
                color: #333;
                margin-bottom: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .elementor-element-${elementId} .elementor-audio-artist {
                font-size: 12px;
                color: #666;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .elementor-element-${elementId} .elementor-audio-element {
                width: 100%;
                height: 40px;
            }
            
            .elementor-element-${elementId} .elementor-audio-custom-controls {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .elementor-element-${elementId} .elementor-audio-play-pause {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 50%;
                background: ${settings.primary_color};
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .elementor-element-${elementId} .elementor-audio-play-pause:hover {
                opacity: 0.8;
                transform: scale(1.05);
            }
            
            .elementor-element-${elementId} .elementor-audio-progress-container {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .elementor-element-${elementId} .elementor-audio-progress {
                flex: 1;
                height: 4px;
                background: rgba(0,0,0,0.1);
                border-radius: 2px;
                overflow: hidden;
                cursor: pointer;
            }
            
            .elementor-element-${elementId} .elementor-audio-progress-bar {
                height: 100%;
                background: ${settings.primary_color};
                width: 0%;
                transition: width 0.1s ease;
            }
            
            .elementor-element-${elementId} .elementor-audio-time {
                font-size: 11px;
                color: #666;
                min-width: 80px;
                text-align: center;
            }
            
            .elementor-element-${elementId} .elementor-audio-volume-container {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .elementor-element-${elementId} .elementor-audio-volume-toggle {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 4px;
            }
            
            .elementor-element-${elementId} .elementor-audio-volume-slider {
                width: 60px;
            }
            
            .elementor-element-${elementId} .elementor-audio-volume-input {
                width: 100%;
                height: 4px;
                background: rgba(0,0,0,0.1);
                border-radius: 2px;
                outline: none;
                -webkit-appearance: none;
            }
            
            .elementor-element-${elementId} .elementor-audio-volume-input::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: ${settings.primary_color};
                cursor: pointer;
            }
            
            /* Player Style Variations */
            .elementor-element-${elementId}.elementor-audio-minimal .elementor-audio-player {
                padding: 8px;
                background: transparent;
                box-shadow: none;
                border: 1px solid rgba(0,0,0,0.1);
            }
            
            .elementor-element-${elementId}.elementor-audio-compact .elementor-audio-player {
                flex-direction: column;
                text-align: center;
            }
            
            .elementor-element-${elementId}.elementor-audio-modern .elementor-audio-player {
                background: linear-gradient(135deg, ${settings.primary_color}20, ${settings.secondary_color});
                border: none;
                backdrop-filter: blur(10px);
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .elementor-element-${elementId} .elementor-audio-player {
                    flex-direction: column;
                    text-align: center;
                    gap: 12px;
                }
                
                .elementor-element-${elementId} .elementor-audio-custom-controls {
                    justify-content: center;
                    flex-wrap: wrap;
                }
            }
        `;
    }
    
    initInteractions(element, elementData) {
        const audioElement = element.querySelector('.elementor-audio-element');
        const playPauseBtn = element.querySelector('.elementor-audio-play-pause');
        const progressBar = element.querySelector('.elementor-audio-progress-bar');
        const progressContainer = element.querySelector('.elementor-audio-progress');
        const timeDisplay = element.querySelector('.elementor-audio-time');
        const volumeInput = element.querySelector('.elementor-audio-volume-input');
        
        if (!audioElement || !playPauseBtn) return;
        
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (audioElement.paused) {
                audioElement.play();
                playPauseBtn.querySelector('i').className = 'eicon-pause';
            } else {
                audioElement.pause();
                playPauseBtn.querySelector('i').className = 'eicon-play';
            }
        });
        
        // Progress update
        if (progressBar && timeDisplay) {
            audioElement.addEventListener('timeupdate', () => {
                const progress = (audioElement.currentTime / audioElement.duration) * 100;
                progressBar.style.width = `${progress}%`;
                
                const currentTime = this.formatTime(audioElement.currentTime);
                const duration = this.formatTime(audioElement.duration);
                timeDisplay.textContent = `${currentTime} / ${duration}`;
            });
        }
        
        // Progress click
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                audioElement.currentTime = percentage * audioElement.duration;
            });
        }
        
        // Volume control
        if (volumeInput) {
            volumeInput.addEventListener('input', (e) => {
                audioElement.volume = e.target.value / 100;
            });
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

window.AudioWidget = AudioWidget;