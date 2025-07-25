/**
 * KingsBuilder Base Widget Classes
 * =====================================================
 * Base classes and core widgets based on Elementor architecture
 */

/**
 * Base Widget Class
 */
class BaseWidget {
    constructor() {
        this.name = '';
        this.title = '';
        this.icon = 'fas fa-cube';
        this.category = 'basic';
        this.keywords = [];
    }

    getName() {
        return this.name;
    }

    getTitle() {
        return this.title;
    }

    getIcon() {
        return this.icon;
    }

    getCategory() {
        return this.category;
    }

    getKeywords() {
        return this.keywords;
    }

    getDefaultSettings() {
        return {};
    }

    getControls() {
        return [];
    }

    render(settings = {}) {
        return '<div>Base Widget</div>';
    }
}

/**
 * Heading Widget
 */
class HeadingWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Heading';
        this.icon = 'fas fa-heading';
        this.category = 'basic';
        this.keywords = ['heading', 'title', 'h1', 'h2', 'h3'];
    }

    getDefaultSettings() {
        return {
            title: 'Add Your Heading Text Here',
            size: 'h2',
            color: '#000000',
            alignment: 'left',
            typography: {
                family: 'inherit',
                size: '',
                weight: 'normal',
                style: 'normal'
            }
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
                        name: 'title',
                        label: 'Title',
                        type: 'text',
                        default: 'Add Your Heading Text Here'
                    },
                    {
                        name: 'size',
                        label: 'HTML Tag',
                        type: 'select',
                        options: {
                            'h1': 'H1',
                            'h2': 'H2',
                            'h3': 'H3',
                            'h4': 'H4',
                            'h5': 'H5',
                            'h6': 'H6'
                        },
                        default: 'h2'
                    },
                    {
                        name: 'alignment',
                        label: 'Alignment',
                        type: 'choose',
                        options: {
                            'left': { title: 'Left', icon: 'fas fa-align-left' },
                            'center': { title: 'Center', icon: 'fas fa-align-center' },
                            'right': { title: 'Right', icon: 'fas fa-align-right' },
                            'justify': { title: 'Justify', icon: 'fas fa-align-justify' }
                        },
                        default: 'left'
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
                        label: 'Text Color',
                        type: 'color',
                        default: '#000000'
                    },
                    {
                        name: 'typography',
                        label: 'Typography',
                        type: 'typography',
                        default: {
                            family: 'inherit',
                            size: '',
                            weight: 'normal',
                            style: 'normal'
                        }
                    }
                ]
            }
        ];
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        const tag = config.size || 'h2';
        
        const styles = [
            `color: ${config.color}`,
            `text-align: ${config.alignment}`,
            config.typography.family !== 'inherit' ? `font-family: ${config.typography.family}` : '',
            config.typography.size ? `font-size: ${config.typography.size}px` : '',
            config.typography.weight !== 'normal' ? `font-weight: ${config.typography.weight}` : '',
            config.typography.style !== 'normal' ? `font-style: ${config.typography.style}` : ''
        ].filter(Boolean).join('; ');

        return `<${tag} class="kb-heading" style="${styles}">${config.title}</${tag}>`;
    }
}

/**
 * Text Widget - Complete Elementor-style controls
 */
class TextWidget extends BaseWidget {
    constructor() {
        super();
        this.name = 'text';
        this.title = 'Text Editor';
        this.icon = 'fas fa-font';
        this.category = 'basic';
        this.keywords = ['text', 'paragraph', 'content'];
    }

    getControls() {
        return [
            {
                name: 'content',
                label: 'Content',
                tab: 'content',
                controls: [
                    {
                        name: 'editor',
                        label: 'Text Editor',
                        type: 'wysiwyg',
                        default: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>'
                    },
                    {
                        name: 'drop_cap',
                        label: 'Drop Cap',
                        type: 'switcher',
                        label_on: 'Yes',
                        label_off: 'No',
                        default: 'no'
                    },
                    {
                        name: 'text_columns',
                        label: 'Columns',
                        type: 'select',
                        options: {
                            '': 'Default',
                            '1': '1 Column',
                            '2': '2 Columns',
                            '3': '3 Columns',
                            '4': '4 Columns'
                        },
                        default: ''
                    },
                    {
                        name: 'column_gap',
                        label: 'Column Gap',
                        type: 'slider',
                        range: { min: 0, max: 100, step: 1 },
                        default: 20,
                        condition: { text_columns: ['2', '3', '4'] }
                    }
                ]
            },
            {
                name: 'style',
                label: 'Style',
                tab: 'style',
                controls: [
                    {
                        name: 'align',
                        label: 'Alignment',
                        type: 'choose',
                        options: {
                            'left': { title: 'Left', icon: 'fas fa-align-left' },
                            'center': { title: 'Center', icon: 'fas fa-align-center' },
                            'right': { title: 'Right', icon: 'fas fa-align-right' },
                            'justify': { title: 'Justify', icon: 'fas fa-align-justify' }
                        },
                        default: 'left'
                    },
                    {
                        name: 'text_color',
                        label: 'Text Color',
                        type: 'color',
                        default: '#000000'
                    },
                    {
                        name: 'typography',
                        label: 'Typography',
                        type: 'typography',
                        default: {
                            family: 'inherit',
                            size: 16,
                            weight: 'normal',
                            style: 'normal',
                            decoration: 'none',
                            transform: 'none',
                            line_height: 1.5,
                            letter_spacing: 0
                        }
                    },
                    {
                        name: 'text_shadow',
                        label: 'Text Shadow',
                        type: 'text_shadow',
                        default: {
                            horizontal: 0,
                            vertical: 0,
                            blur: 0,
                            color: '#000000'
                        }
                    },
                    {
                        name: 'blend_mode',
                        label: 'Blend Mode',
                        type: 'select',
                        options: {
                            'normal': 'Normal',
                            'multiply': 'Multiply',
                            'screen': 'Screen',
                            'overlay': 'Overlay',
                            'darken': 'Darken',
                            'lighten': 'Lighten',
                            'color-dodge': 'Color Dodge',
                            'color-burn': 'Color Burn',
                            'hard-light': 'Hard Light',
                            'soft-light': 'Soft Light',
                            'difference': 'Difference',
                            'exclusion': 'Exclusion'
                        },
                        default: 'normal'
                    }
                ]
            },
            {
                name: 'advanced',
                label: 'Advanced',
                tab: 'advanced',
                controls: [
                    {
                        name: '_margin',
                        label: 'Margin',
                        type: 'dimensions',
                        default: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' }
                    },
                    {
                        name: '_padding',
                        label: 'Padding',
                        type: 'dimensions',
                        default: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' }
                    },
                    {
                        name: '_element_id',
                        label: 'CSS ID',
                        type: 'text',
                        default: '',
                        placeholder: 'my-element-id'
                    },
                    {
                        name: '_css_classes',
                        label: 'CSS Classes',
                        type: 'text',
                        default: '',
                        placeholder: 'my-class another-class'
                    }
                ]
            }
        ];
    }

    getDefaultSettings() {
        return {
            editor: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>',
            drop_cap: 'no',
            text_columns: '',
            column_gap: 20,
            align: 'left',
            text_color: '#000000',
            typography: {
                family: 'inherit',
                size: 16,
                weight: 'normal',
                style: 'normal',
                decoration: 'none',
                transform: 'none',
                line_height: 1.5,
                letter_spacing: 0
            },
            text_shadow: {
                horizontal: 0,
                vertical: 0,
                blur: 0,
                color: '#000000'
            },
            blend_mode: 'normal',
            _margin: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' },
            _padding: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' },
            _element_id: '',
            _css_classes: ''
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        const styles = [
            config.text_color ? `color: ${config.text_color}` : '',
            config.align ? `text-align: ${config.align}` : '',
            config.typography?.family && config.typography.family !== 'inherit' ? `font-family: ${config.typography.family}` : '',
            config.typography?.size ? `font-size: ${config.typography.size}px` : '',
            config.typography?.weight && config.typography.weight !== 'normal' ? `font-weight: ${config.typography.weight}` : '',
            config.typography?.style && config.typography.style !== 'normal' ? `font-style: ${config.typography.style}` : '',
            config.typography?.decoration && config.typography.decoration !== 'none' ? `text-decoration: ${config.typography.decoration}` : '',
            config.typography?.transform && config.typography.transform !== 'none' ? `text-transform: ${config.typography.transform}` : '',
            config.typography?.line_height && config.typography.line_height !== 1.5 ? `line-height: ${config.typography.line_height}` : '',
            config.typography?.letter_spacing && config.typography.letter_spacing !== 0 ? `letter-spacing: ${config.typography.letter_spacing}px` : '',
            config.text_columns ? `column-count: ${config.text_columns}; column-gap: ${config.column_gap}px` : '',
            config.blend_mode && config.blend_mode !== 'normal' ? `mix-blend-mode: ${config.blend_mode}` : '',
            config._margin ? `margin: ${config._margin.top}${config._margin.unit} ${config._margin.right}${config._margin.unit} ${config._margin.bottom}${config._margin.unit} ${config._margin.left}${config._margin.unit}` : '',
            config._padding ? `padding: ${config._padding.top}${config._padding.unit} ${config._padding.right}${config._padding.unit} ${config._padding.bottom}${config._padding.unit} ${config._padding.left}${config._padding.unit}` : ''
        ].filter(Boolean).join('; ');

        const content = config.editor || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        const cssId = config._element_id ? ` id="${config._element_id}"` : '';
        const cssClasses = config._css_classes ? ` ${config._css_classes}` : '';
        const dropCapClass = config.drop_cap === 'yes' ? ' kb-drop-cap' : '';
        
        return `<div class="kb-text-content${cssClasses}${dropCapClass}"${cssId} style="${styles}">${content}</div>`;
    }
}

/**
 * Button Widget - Complete Elementor-style controls
 */
class ButtonWidget extends BaseWidget {
    constructor() {
        super();
        this.name = 'button';
        this.title = 'Button';
        this.icon = 'fas fa-mouse-pointer';
        this.category = 'basic';
        this.keywords = ['button', 'link', 'cta', 'click'];
    }

    getControls() {
        return [
            {
                name: 'content',
                label: 'Content',
                tab: 'content',
                controls: [
                    {
                        name: 'text',
                        label: 'Text',
                        type: 'text',
                        default: 'Click Here',
                        placeholder: 'Enter button text'
                    },
                    {
                        name: 'link',
                        label: 'Link',
                        type: 'url',
                        default: '#',
                        placeholder: 'https://example.com'
                    },
                    {
                        name: 'size',
                        label: 'Size',
                        type: 'select',
                        options: {
                            'xs': 'Extra Small',
                            'sm': 'Small',
                            'md': 'Medium',
                            'lg': 'Large',
                            'xl': 'Extra Large'
                        },
                        default: 'md'
                    },
                    {
                        name: 'button_css_id',
                        label: 'Button ID',
                        type: 'text',
                        default: '',
                        placeholder: 'button-id'
                    }
                ]
            },
            {
                name: 'style',
                label: 'Style',
                tab: 'style',
                controls: [
                    {
                        name: 'button_type',
                        label: 'Type',
                        type: 'select',
                        options: {
                            'primary': 'Primary',
                            'secondary': 'Secondary',
                            'success': 'Success',
                            'info': 'Info',
                            'warning': 'Warning',
                            'danger': 'Danger'
                        },
                        default: 'primary'
                    },
                    {
                        name: 'align',
                        label: 'Alignment',
                        type: 'choose',
                        options: {
                            'left': { title: 'Left', icon: 'fas fa-align-left' },
                            'center': { title: 'Center', icon: 'fas fa-align-center' },
                            'right': { title: 'Right', icon: 'fas fa-align-right' },
                            'justify': { title: 'Justify', icon: 'fas fa-align-justify' }
                        },
                        default: 'left'
                    },
                    {
                        name: 'text_color',
                        label: 'Text Color',
                        type: 'color',
                        default: '#ffffff'
                    },
                    {
                        name: 'background_color',
                        label: 'Background Color',
                        type: 'color',
                        default: '#007cba'
                    },
                    {
                        name: 'border_width',
                        label: 'Border Width',
                        type: 'slider',
                        range: { min: 0, max: 10 },
                        default: 0
                    },
                    {
                        name: 'border_color',
                        label: 'Border Color',
                        type: 'color',
                        default: '#007cba'
                    },
                    {
                        name: 'border_radius',
                        label: 'Border Radius',
                        type: 'slider',
                        range: { min: 0, max: 50 },
                        default: 4
                    },
                    {
                        name: 'typography',
                        label: 'Typography',
                        type: 'typography',
                        default: {
                            family: 'inherit',
                            size: 16,
                            weight: 'normal',
                            style: 'normal'
                        }
                    },
                    {
                        name: 'text_shadow',
                        label: 'Text Shadow',
                        type: 'text_shadow',
                        default: {
                            horizontal: 0,
                            vertical: 0,
                            blur: 0,
                            color: '#000000'
                        }
                    },
                    {
                        name: 'box_shadow',
                        label: 'Box Shadow',
                        type: 'text_shadow',
                        default: {
                            horizontal: 0,
                            vertical: 2,
                            blur: 4,
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                ]
            },
            {
                name: 'advanced',
                label: 'Advanced',
                tab: 'advanced',
                controls: [
                    {
                        name: '_margin',
                        label: 'Margin',
                        type: 'dimensions',
                        default: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' }
                    },
                    {
                        name: '_padding',
                        label: 'Padding',
                        type: 'dimensions',
                        default: { top: 12, right: 24, bottom: 12, left: 24, unit: 'px' }
                    },
                    {
                        name: '_element_id',
                        label: 'CSS ID',
                        type: 'text',
                        default: '',
                        placeholder: 'my-button-id'
                    },
                    {
                        name: '_css_classes',
                        label: 'CSS Classes',
                        type: 'text',
                        default: '',
                        placeholder: 'my-class another-class'
                    }
                ]
            }
        ];
    }

    getDefaultSettings() {
        return {
            text: 'Click Here',
            link: '#',
            size: 'md',
            button_css_id: '',
            button_type: 'primary',
            align: 'left',
            text_color: '#ffffff',
            background_color: '#007cba',
            border_width: 0,
            border_color: '#007cba',
            border_radius: 4,
            typography: {
                family: 'inherit',
                size: 16,
                weight: 'normal',
                style: 'normal'
            },
            text_shadow: {
                horizontal: 0,
                vertical: 0,
                blur: 0,
                color: '#000000'
            },
            box_shadow: {
                horizontal: 0,
                vertical: 2,
                blur: 4,
                color: 'rgba(0,0,0,0.1)'
            },
            _margin: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' },
            _padding: { top: 12, right: 24, bottom: 12, left: 24, unit: 'px' },
            _element_id: '',
            _css_classes: ''
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        const styles = [
            `color: ${config.text_color}`,
            `background-color: ${config.background_color}`,
            config.border_width ? `border: ${config.border_width}px solid ${config.border_color}` : 'border: none',
            `border-radius: ${config.border_radius}px`,
            config.typography?.family && config.typography.family !== 'inherit' ? `font-family: ${config.typography.family}` : '',
            config.typography?.size ? `font-size: ${config.typography.size}px` : '',
            config.typography?.weight && config.typography.weight !== 'normal' ? `font-weight: ${config.typography.weight}` : '',
            config.typography?.style && config.typography.style !== 'normal' ? `font-style: ${config.typography.style}` : '',
            config._margin ? `margin: ${config._margin.top}${config._margin.unit} ${config._margin.right}${config._margin.unit} ${config._margin.bottom}${config._margin.unit} ${config._margin.left}${config._margin.unit}` : '',
            config._padding ? `padding: ${config._padding.top}${config._padding.unit} ${config._padding.right}${config._padding.unit} ${config._padding.bottom}${config._padding.unit} ${config._padding.left}${config._padding.unit}` : '',
            'cursor: pointer',
            'text-decoration: none',
            'display: inline-block',
            'transition: all 0.3s ease'
        ].filter(Boolean).join('; ');

        const cssId = config._element_id ? ` id="${config._element_id}"` : '';
        const cssClasses = config._css_classes ? ` ${config._css_classes}` : '';
        const buttonId = config.button_css_id ? ` id="${config.button_css_id}"` : '';
        const sizeClass = ` kb-btn-${config.size}`;
        const typeClass = ` kb-btn-${config.button_type}`;
        const alignClass = config.align !== 'left' ? ` kb-align-${config.align}` : '';
        
        return `<div class="kb-button-wrapper${alignClass}${cssClasses}"${cssId} style="text-align: ${config.align}">
            <a href="${config.link}" class="kb-button${sizeClass}${typeClass}"${buttonId} style="${styles}">
                ${config.text}
            </a>
        </div>`;
    }
}

/**
 * Image Widget - Complete Elementor-style controls
 */
class ImageWidget extends BaseWidget {
    constructor() {
        super();
        this.name = 'image';
        this.title = 'Image';
        this.icon = 'fas fa-image';
        this.category = 'basic';
        this.keywords = ['image', 'photo', 'picture'];
    }

    getControls() {
        return [
            {
                name: 'content',
                label: 'Content',
                tab: 'content',
                controls: [
                    {
                        name: 'image',
                        label: 'Choose Image',
                        type: 'media',
                        default: {
                            url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Image+Placeholder',
                            alt: 'Placeholder Image'
                        }
                    },
                    {
                        name: 'image_size',
                        label: 'Image Size',
                        type: 'select',
                        options: {
                            'thumbnail': 'Thumbnail',
                            'medium': 'Medium',
                            'large': 'Large',
                            'full': 'Full Size',
                            'custom': 'Custom'
                        },
                        default: 'large'
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
                    },
                    {
                        name: 'caption',
                        label: 'Caption',
                        type: 'text',
                        default: '',
                        placeholder: 'Enter image caption'
                    },
                    {
                        name: 'link_to',
                        label: 'Link',
                        type: 'select',
                        options: {
                            'none': 'None',
                            'file': 'Media File',
                            'custom': 'Custom URL'
                        },
                        default: 'none'
                    },
                    {
                        name: 'link',
                        label: 'Link URL',
                        type: 'url',
                        default: '',
                        condition: { link_to: 'custom' }
                    }
                ]
            },
            {
                name: 'style',
                label: 'Style',
                tab: 'style',
                controls: [
                    {
                        name: 'width',
                        label: 'Width',
                        type: 'slider',
                        range: { min: 0, max: 100 },
                        default: 100,
                        unit: '%'
                    },
                    {
                        name: 'max_width',
                        label: 'Max Width',
                        type: 'slider',
                        range: { min: 0, max: 1000 },
                        default: '',
                        unit: 'px'
                    },
                    {
                        name: 'height',
                        label: 'Height',
                        type: 'slider',
                        range: { min: 0, max: 1000 },
                        default: '',
                        unit: 'px'
                    },
                    {
                        name: 'object_fit',
                        label: 'Object Fit',
                        type: 'select',
                        options: {
                            '': 'Default',
                            'fill': 'Fill',
                            'cover': 'Cover',
                            'contain': 'Contain',
                            'scale-down': 'Scale Down',
                            'none': 'None'
                        },
                        default: ''
                    },
                    {
                        name: 'border_radius',
                        label: 'Border Radius',
                        type: 'slider',
                        range: { min: 0, max: 50 },
                        default: 0
                    },
                    {
                        name: 'opacity',
                        label: 'Opacity',
                        type: 'slider',
                        range: { min: 0.1, max: 1, step: 0.1 },
                        default: 1
                    },
                    {
                        name: 'css_filters',
                        label: 'CSS Filters',
                        type: 'select',
                        options: {
                            '': 'Normal',
                            'blur(2px)': 'Blur',
                            'brightness(150%)': 'Bright',
                            'contrast(150%)': 'Contrast',
                            'grayscale(100%)': 'Grayscale',
                            'sepia(100%)': 'Sepia'
                        },
                        default: ''
                    },
                    {
                        name: 'hover_animation',
                        label: 'Hover Animation',
                        type: 'select',
                        options: {
                            '': 'None',
                            'grow': 'Grow',
                            'shrink': 'Shrink',
                            'pulse': 'Pulse',
                            'bounce': 'Bounce'
                        },
                        default: ''
                    }
                ]
            },
            {
                name: 'advanced',
                label: 'Advanced',
                tab: 'advanced',
                controls: [
                    {
                        name: '_margin',
                        label: 'Margin',
                        type: 'dimensions',
                        default: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' }
                    },
                    {
                        name: '_padding',
                        label: 'Padding',
                        type: 'dimensions',
                        default: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' }
                    },
                    {
                        name: '_element_id',
                        label: 'CSS ID',
                        type: 'text',
                        default: '',
                        placeholder: 'my-image-id'
                    },
                    {
                        name: '_css_classes',
                        label: 'CSS Classes',
                        type: 'text',
                        default: '',
                        placeholder: 'my-class another-class'
                    }
                ]
            }
        ];
    }

    getDefaultSettings() {
        return {
            image: {
                url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Image+Placeholder',
                alt: 'Placeholder Image'
            },
            image_size: 'large',
            alignment: 'center',
            caption: '',
            link_to: 'none',
            link: '',
            width: 100,
            max_width: '',
            height: '',
            object_fit: '',
            border_radius: 0,
            opacity: 1,
            css_filters: '',
            hover_animation: '',
            _margin: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' },
            _padding: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' },
            _element_id: '',
            _css_classes: ''
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        const imageUrl = typeof config.image === 'object' ? config.image.url : config.image;
        const imageAlt = typeof config.image === 'object' ? config.image.alt : 'Image';
        
        const styles = [
            config.width ? `width: ${config.width}%` : '',
            config.max_width ? `max-width: ${config.max_width}px` : '',
            config.height ? `height: ${config.height}px` : '',
            config.object_fit ? `object-fit: ${config.object_fit}` : '',
            config.border_radius ? `border-radius: ${config.border_radius}px` : '',
            config.opacity !== 1 ? `opacity: ${config.opacity}` : '',
            config.css_filters ? `filter: ${config.css_filters}` : '',
            config._margin ? `margin: ${config._margin.top}${config._margin.unit} ${config._margin.right}${config._margin.unit} ${config._margin.bottom}${config._margin.unit} ${config._margin.left}${config._margin.unit}` : '',
            config._padding ? `padding: ${config._padding.top}${config._padding.unit} ${config._padding.right}${config._padding.unit} ${config._padding.bottom}${config._padding.unit} ${config._padding.left}${config._padding.unit}` : ''
        ].filter(Boolean).join('; ');

        const cssId = config._element_id ? ` id="${config._element_id}"` : '';
        const cssClasses = config._css_classes ? ` ${config._css_classes}` : '';
        const hoverClass = config.hover_animation ? ` kb-hover-${config.hover_animation}` : '';
        
        let imageElement = `<img src="${imageUrl}" alt="${imageAlt}" class="kb-image${hoverClass}" style="${styles}">`;
        
        if (config.link_to === 'custom' && config.link) {
            imageElement = `<a href="${config.link}">${imageElement}</a>`;
        } else if (config.link_to === 'file') {
            imageElement = `<a href="${imageUrl}" target="_blank">${imageElement}</a>`;
        }
        
        const caption = config.caption ? `<figcaption class="kb-image-caption">${config.caption}</figcaption>` : '';
        
        return `<figure class="kb-image-wrapper${cssClasses}"${cssId} style="text-align: ${config.alignment}">
            ${imageElement}
            ${caption}
        </figure>`;
    }
}

/**
 * Container Widget - Complete Elementor-style controls
 */
class ContainerWidget extends BaseWidget {
    constructor(type = 'flex') {
        super();
        this.name = 'container';
        this.title = type === 'grid' ? 'Grid Container' : 'Flex Container';
        this.icon = type === 'grid' ? 'fas fa-th' : 'fas fa-square';
        this.category = 'layout';
        this.containerType = type;
    }

    getTitle() {
        return this.title;
    }

    getDefaultSettings() {
        return {
            direction: this.containerType === 'grid' ? 'row' : 'row',
            justify_content: 'flex-start',
            align_items: 'stretch',
            gap: 20,
            padding: 20,
            margin: 10,
            background_color: 'transparent',
            border_radius: 0,
            min_height: 'auto',
            // Grid specific
            grid_columns: '1fr',
            grid_rows: 'auto',
            grid_gap: 20
        };
    }

    getControls() {
        const baseControls = [
            {
                name: 'content',
                label: 'Layout',
                tab: 'content',
                controls: [
                    {
                        name: 'direction',
                        label: 'Direction',
                        type: 'select',
                        options: this.containerType === 'grid' ? {
                            'row': 'Row',
                            'column': 'Column'
                        } : {
                            'row': 'Row',
                            'column': 'Column',
                            'row-reverse': 'Row Reverse',
                            'column-reverse': 'Column Reverse'
                        },
                        default: 'row'
                    },
                    {
                        name: 'gap',
                        label: 'Gap (px)',
                        type: 'slider',
                        range: { min: 0, max: 100 },
                        default: 20
                    }
                ]
            },
            {
                name: 'style',
                label: 'Style',
                tab: 'style',
                controls: [
                    {
                        name: 'padding',
                        label: 'Padding (px)',
                        type: 'slider',
                        range: { min: 0, max: 100 },
                        default: 20
                    },
                    {
                        name: 'margin',
                        label: 'Margin (px)',
                        type: 'slider',
                        range: { min: 0, max: 50 },
                        default: 10
                    },
                    {
                        name: 'background_color',
                        label: 'Background Color',
                        type: 'color',
                        default: 'transparent'
                    },
                    {
                        name: 'border_radius',
                        label: 'Border Radius (px)',
                        type: 'slider',
                        range: { min: 0, max: 50 },
                        default: 0
                    }
                ]
            }
        ];

        // Add flex-specific controls
        if (this.containerType === 'flex') {
            baseControls[0].controls.push(
                {
                    name: 'justify_content',
                    label: 'Justify Content',
                    type: 'select',
                    options: {
                        'flex-start': 'Start',
                        'center': 'Center',
                        'flex-end': 'End',
                        'space-between': 'Space Between',
                        'space-around': 'Space Around',
                        'space-evenly': 'Space Evenly'
                    },
                    default: 'flex-start'
                },
                {
                    name: 'align_items',
                    label: 'Align Items',
                    type: 'select',
                    options: {
                        'stretch': 'Stretch',
                        'flex-start': 'Start',
                        'center': 'Center',
                        'flex-end': 'End',
                        'baseline': 'Baseline'
                    },
                    default: 'stretch'
                }
            );
        }

        // Add grid-specific controls
        if (this.containerType === 'grid') {
            baseControls[0].controls.push(
                {
                    name: 'grid_columns',
                    label: 'Grid Columns',
                    type: 'text',
                    default: '1fr',
                    placeholder: 'e.g., 1fr 1fr or repeat(3, 1fr)'
                },
                {
                    name: 'grid_rows',
                    label: 'Grid Rows',
                    type: 'text',
                    default: 'auto',
                    placeholder: 'e.g., auto or 100px 200px'
                }
            );
        }

        return baseControls;
    }

    render(settings = {}) {
        return '<!-- Container content managed by container system -->';
    }
}

/**
 * Column Widget
 */
class ColumnWidget extends BaseWidget {
    constructor() {
        super();
        this.title = 'Column';
        this.icon = 'fas fa-columns';
        this.category = 'layout';
    }

    getDefaultSettings() {
        return {
            width: '100%',
            padding: 15,
            margin: 0,
            background_color: 'transparent',
            border_radius: 0,
            align_self: 'stretch'
        };
    }

    getControls() {
        return [
            {
                name: 'content',
                label: 'Layout',
                tab: 'content',
                controls: [
                    {
                        name: 'width',
                        label: 'Width',
                        type: 'text',
                        default: '100%',
                        placeholder: 'e.g., 50%, 300px, 1fr'
                    },
                    {
                        name: 'align_self',
                        label: 'Align Self',
                        type: 'select',
                        options: {
                            'stretch': 'Stretch',
                            'flex-start': 'Start',
                            'center': 'Center',
                            'flex-end': 'End',
                            'baseline': 'Baseline'
                        },
                        default: 'stretch'
                    }
                ]
            },
            {
                name: 'style',
                label: 'Style',
                tab: 'style',
                controls: [
                    {
                        name: 'padding',
                        label: 'Padding (px)',
                        type: 'slider',
                        range: { min: 0, max: 100 },
                        default: 15
                    },
                    {
                        name: 'margin',
                        label: 'Margin (px)',
                        type: 'slider',
                        range: { min: 0, max: 50 },
                        default: 0
                    },
                    {
                        name: 'background_color',
                        label: 'Background Color',
                        type: 'color',
                        default: 'transparent'
                    },
                    {
                        name: 'border_radius',
                        label: 'Border Radius (px)',
                        type: 'slider',
                        range: { min: 0, max: 50 },
                        default: 0
                    }
                ]
            }
        ];
    }

    render(settings = {}) {
        return '<!-- Column content managed by container system -->';
    }
}

/**
 * Spacer Widget - Complete Elementor-style controls
 */
class SpacerWidget extends BaseWidget {
    constructor() {
        super();
        this.name = 'spacer';
        this.title = 'Spacer';
        this.icon = 'fas fa-arrows-alt-v';
        this.category = 'basic';
        this.keywords = ['spacer', 'space', 'gap', 'margin'];
    }

    getControls() {
        return [
            {
                name: 'content',
                label: 'Content',
                tab: 'content',
                controls: [
                    {
                        name: 'height',
                        label: 'Height',
                        type: 'slider',
                        range: { min: 10, max: 500 },
                        default: 50,
                        unit: 'px'
                    }
                ]
            },
            {
                name: 'advanced',
                label: 'Advanced',
                tab: 'advanced',
                controls: [
                    {
                        name: '_margin',
                        label: 'Margin',
                        type: 'dimensions',
                        default: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' }
                    },
                    {
                        name: '_element_id',
                        label: 'CSS ID',
                        type: 'text',
                        default: '',
                        placeholder: 'my-spacer-id'
                    },
                    {
                        name: '_css_classes',
                        label: 'CSS Classes',
                        type: 'text',
                        default: '',
                        placeholder: 'my-class another-class'
                    }
                ]
            }
        ];
    }

    getDefaultSettings() {
        return {
            height: 50,
            _margin: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' },
            _element_id: '',
            _css_classes: ''
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        const styles = [
            `height: ${config.height}px`,
            config._margin ? `margin: ${config._margin.top}${config._margin.unit} ${config._margin.right}${config._margin.unit} ${config._margin.bottom}${config._margin.unit} ${config._margin.left}${config._margin.unit}` : ''
        ].filter(Boolean).join('; ');

        const cssId = config._element_id ? ` id="${config._element_id}"` : '';
        const cssClasses = config._css_classes ? ` ${config._css_classes}` : '';
        
        return `<div class="kb-spacer${cssClasses}"${cssId} style="${styles}"></div>`;
    }
}

/**
 * Divider Widget - Complete Elementor-style controls
 */
class DividerWidget extends BaseWidget {
    constructor() {
        super();
        this.name = 'divider';
        this.title = 'Divider';
        this.icon = 'fas fa-minus';
        this.category = 'basic';
        this.keywords = ['divider', 'separator', 'line', 'hr'];
    }

    getControls() {
        return [
            {
                name: 'content',
                label: 'Content',
                tab: 'content',
                controls: [
                    {
                        name: 'style',
                        label: 'Style',
                        type: 'select',
                        options: {
                            'solid': 'Solid',
                            'dashed': 'Dashed',
                            'dotted': 'Dotted',
                            'double': 'Double'
                        },
                        default: 'solid'
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
                        default: '#cccccc'
                    },
                    {
                        name: 'weight',
                        label: 'Weight',
                        type: 'slider',
                        range: { min: 1, max: 10 },
                        default: 1
                    },
                    {
                        name: 'width',
                        label: 'Width',
                        type: 'slider',
                        range: { min: 10, max: 100 },
                        default: 100,
                        unit: '%'
                    },
                    {
                        name: 'gap',
                        label: 'Gap',
                        type: 'slider',
                        range: { min: 0, max: 50 },
                        default: 15
                    }
                ]
            },
            {
                name: 'advanced',
                label: 'Advanced',
                tab: 'advanced',
                controls: [
                    {
                        name: '_margin',
                        label: 'Margin',
                        type: 'dimensions',
                        default: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' }
                    },
                    {
                        name: '_padding',
                        label: 'Padding',
                        type: 'dimensions',
                        default: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' }
                    },
                    {
                        name: '_element_id',
                        label: 'CSS ID',
                        type: 'text',
                        default: '',
                        placeholder: 'my-divider-id'
                    },
                    {
                        name: '_css_classes',
                        label: 'CSS Classes',
                        type: 'text',
                        default: '',
                        placeholder: 'my-class another-class'
                    }
                ]
            }
        ];
    }

    getDefaultSettings() {
        return {
            style: 'solid',
            alignment: 'center',
            color: '#cccccc',
            weight: 1,
            width: 100,
            gap: 15,
            _margin: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' },
            _padding: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' },
            _element_id: '',
            _css_classes: ''
        };
    }

    render(settings = {}) {
        const config = { ...this.getDefaultSettings(), ...settings };
        
        const dividerStyles = [
            `border-top: ${config.weight}px ${config.style} ${config.color}`,
            `width: ${config.width}%`,
            `margin: ${config.gap}px auto`,
            config._margin ? `margin: ${config._margin.top}${config._margin.unit} ${config._margin.right}${config._margin.unit} ${config._margin.bottom}${config._margin.unit} ${config._margin.left}${config._margin.unit}` : '',
            config._padding ? `padding: ${config._padding.top}${config._padding.unit} ${config._padding.right}${config._padding.unit} ${config._padding.bottom}${config._padding.unit} ${config._padding.left}${config._padding.unit}` : ''
        ].filter(Boolean).join('; ');

        const cssId = config._element_id ? ` id="${config._element_id}"` : '';
        const cssClasses = config._css_classes ? ` ${config._css_classes}` : '';
        
        return `<div class="kb-divider-wrapper${cssClasses}"${cssId} style="text-align: ${config.alignment}">
            <div class="kb-divider" style="${dividerStyles}"></div>
        </div>`;
    }
}

// Export widgets for global use
window.BaseWidget = BaseWidget;
window.HeadingWidget = HeadingWidget;
window.TextWidget = TextWidget;
window.ButtonWidget = ButtonWidget;
window.ImageWidget = ImageWidget;
window.SpacerWidget = SpacerWidget;
window.DividerWidget = DividerWidget;
window.ContainerWidget = ContainerWidget;
window.ColumnWidget = ColumnWidget;