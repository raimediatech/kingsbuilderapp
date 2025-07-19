// Builder Test for KingsBuilder Page Editor
console.log('🧪 Loading Builder Test...');

class BuilderTest {
    constructor() {
        this.testResults = [];
        this.startTime = Date.now();
    }

    // Log test result
    logTest(testName, passed, details = '') {
        const result = {
            test: testName,
            passed: passed,
            details: details,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        const icon = passed ? '✅' : '❌';
        console.log(`${icon} BUILDER TEST - ${testName}: ${passed ? 'PASSED' : 'FAILED'}${details ? ` - ${details}` : ''}`);
    }

    // Test 1: Builder Interface Elements
    testBuilderInterface() {
        console.log('\n🏗️ Testing Builder Interface...');
        
        // Test main builder elements
        const builderElements = [
            { id: 'kingsbuilder-editor-wrapper', name: 'Editor Wrapper' },
            { id: 'kingsbuilder-panel', name: 'Left Panel' },
            { id: 'kingsbuilder-panel-header', name: 'Panel Header' },
            { id: 'kingsbuilder-panel-nav', name: 'Panel Navigation' },
            { id: 'kingsbuilder-panel-content', name: 'Panel Content' }
        ];
        
        builderElements.forEach(element => {
            const domElement = document.getElementById(element.id);
            this.logTest(`Interface: ${element.name}`, !!domElement, 
                domElement ? 'Found' : 'Missing');
        });
        
        // Test navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        this.logTest('Navigation Tabs', navTabs.length >= 3, 
            `Found ${navTabs.length} tabs`);
        
        // Test element categories
        const categories = document.querySelectorAll('.category');
        this.logTest('Element Categories', categories.length > 0, 
            `Found ${categories.length} categories`);
    }

    // Test 2: Builder Icons
    testBuilderIcons() {
        console.log('\n🎨 Testing Builder Icons...');
        
        // Test specific builder icons
        const iconTests = [
            { selector: '.kingsbuilder-logo i', name: 'Logo Crown Icon' },
            { selector: '.header-button i', name: 'Header Button Icons' },
            { selector: '.nav-tab i', name: 'Navigation Tab Icons' },
            { selector: '.element-icon i', name: 'Element Icons' },
            { selector: '.category-header i', name: 'Category Icons' }
        ];
        
        iconTests.forEach(test => {
            const icons = document.querySelectorAll(test.selector);
            this.logTest(`Icons: ${test.name}`, icons.length > 0, 
                `Found ${icons.length} icons`);
            
            // Test if icons are visible
            if (icons.length > 0) {
                let visibleCount = 0;
                icons.forEach(icon => {
                    const style = window.getComputedStyle(icon);
                    if (style.display !== 'none' && style.visibility !== 'hidden') {
                        visibleCount++;
                    }
                });
                
                this.logTest(`Icons Visible: ${test.name}`, visibleCount > 0, 
                    `${visibleCount}/${icons.length} visible`);
            }
        });
        
        // Test Font Awesome loading
        const testIcon = document.createElement('i');
        testIcon.className = 'fas fa-home';
        testIcon.style.position = 'absolute';
        testIcon.style.left = '-9999px';
        document.body.appendChild(testIcon);
        
        const computedStyle = window.getComputedStyle(testIcon, ':before');
        const fontAwesomeLoaded = computedStyle.fontFamily && 
                                 computedStyle.fontFamily.includes('Font Awesome');
        
        document.body.removeChild(testIcon);
        
        this.logTest('Font Awesome Loading', fontAwesomeLoaded, 
            fontAwesomeLoaded ? 'CDN loaded' : 'Using fallbacks');
    }

    // Test 3: Builder Functionality
    testBuilderFunctionality() {
        console.log('\n⚙️ Testing Builder Functionality...');
        
        // Test global objects
        const globalObjects = [
            { name: 'BuilderIconFix', obj: window.BuilderIconFix },
            { name: 'BuilderContentFix', obj: window.BuilderContentFix }
        ];
        
        globalObjects.forEach(global => {
            this.logTest(`Global: ${global.name}`, !!global.obj, 
                global.obj ? 'Available' : 'Not loaded');
        });
        
        // Test drag and drop elements
        const draggableElements = document.querySelectorAll('[draggable="true"]');
        this.logTest('Draggable Elements', draggableElements.length > 0, 
            `Found ${draggableElements.length} draggable elements`);
        
        // Test element categories functionality
        const categoryHeaders = document.querySelectorAll('.category-header');
        let clickableCategories = 0;
        
        categoryHeaders.forEach(header => {
            if (header.onclick || header.addEventListener) {
                clickableCategories++;
            }
        });
        
        this.logTest('Category Interaction', clickableCategories > 0, 
            `${clickableCategories} interactive categories`);
    }

    // Test 4: Page Content Loading
    async testPageContentLoading() {
        console.log('\n📄 Testing Page Content Loading...');
        
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');
        const pageId = urlParams.get('page') || urlParams.get('pageId');
        
        this.logTest('URL Parameters', !!(shop || pageId), 
            `Shop: ${shop || 'none'}, Page: ${pageId || 'none'}`);
        
        // Test preview area
        const previewArea = document.getElementById('kingsbuilder-preview') || 
                           document.querySelector('.kingsbuilder-preview') ||
                           document.querySelector('#preview-frame');
        
        this.logTest('Preview Area', !!previewArea, 
            previewArea ? 'Found' : 'Missing');
        
        // Test API connectivity if we have parameters
        if (shop && pageId) {
            try {
                const response = await fetch(`/api/pages/${pageId}?shop=${encodeURIComponent(shop)}`);
                this.logTest('Page API Response', response.ok, 
                    `Status: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    this.logTest('Page Data Structure', data.hasOwnProperty('success'), 
                        `Success: ${data.success}`);
                }
            } catch (error) {
                this.logTest('Page API Connectivity', false, 
                    `Error: ${error.message}`);
            }
        }
    }

    // Test 5: Builder Responsiveness
    testBuilderResponsiveness() {
        console.log('\n📱 Testing Builder Responsiveness...');
        
        // Test panel visibility on different screen sizes
        const panel = document.getElementById('kingsbuilder-panel');
        if (panel) {
            const panelStyle = window.getComputedStyle(panel);
            this.logTest('Panel Visibility', panelStyle.display !== 'none', 
                `Display: ${panelStyle.display}`);
            
            // Test panel width
            const panelWidth = parseInt(panelStyle.width);
            this.logTest('Panel Width', panelWidth > 0, 
                `Width: ${panelWidth}px`);
        }
        
        // Test mobile menu button
        const mobileMenuBtn = document.getElementById('panelMinimize') || 
                             document.querySelector('.mobile-menu-btn');
        this.logTest('Mobile Menu Button', !!mobileMenuBtn, 
            mobileMenuBtn ? 'Found' : 'Missing');
        
        // Test viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        this.logTest('Viewport Meta Tag', !!viewportMeta, 
            viewportMeta ? viewportMeta.content : 'Missing');
    }

    // Test 6: Builder Performance
    testBuilderPerformance() {
        console.log('\n⚡ Testing Builder Performance...');
        
        // Test script loading
        const scripts = document.querySelectorAll('script[src]');
        let loadedScripts = 0;
        let failedScripts = 0;
        
        scripts.forEach(script => {
            if (script.readyState === 'complete' || script.readyState === 'loaded') {
                loadedScripts++;
            } else if (script.onerror) {
                failedScripts++;
            }
        });
        
        this.logTest('Script Loading', loadedScripts > failedScripts, 
            `${loadedScripts} loaded, ${failedScripts} failed`);
        
        // Test CSS loading
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        this.logTest('Stylesheet Count', stylesheets.length > 0, 
            `${stylesheets.length} stylesheets`);
        
        // Test DOM ready time
        const domReadyTime = Date.now() - this.startTime;
        this.logTest('DOM Ready Time', domReadyTime < 5000, 
            `${domReadyTime}ms`);
    }

    // Run all tests
    async runAllTests() {
        console.log('🚀 Running Builder Tests...\n');
        
        this.testBuilderInterface();
        this.testBuilderIcons();
        this.testBuilderFunctionality();
        await this.testPageContentLoading();
        this.testBuilderResponsiveness();
        this.testBuilderPerformance();
        
        this.generateReport();
    }

    // Generate test report
    generateReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log('\n📊 BUILDER TEST REPORT');
        console.log('='.repeat(50));
        console.log(`🏗️ KingsBuilder Page Editor Test Results`);
        console.log(`Total Tests: ${totalTests}`);
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`⏱️ Duration: ${duration}ms`);
        console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
        
        if (failedTests > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults.filter(r => !r.passed).forEach(test => {
                console.log(`   • ${test.test}: ${test.details}`);
            });
        }
        
        console.log('\n🎯 BUILDER RECOMMENDATIONS:');
        
        if (failedTests === 0) {
            console.log('   ✅ All tests passed! Your page builder should be working perfectly.');
        } else {
            if (this.testResults.find(r => r.test.includes('Icons') && !r.passed)) {
                console.log('   🎨 Icons: Some icons may not be displaying. Fallback system should handle this.');
            }
            
            if (this.testResults.find(r => r.test.includes('Interface') && !r.passed)) {
                console.log('   🏗️ Interface: Some builder elements are missing. Check HTML structure.');
            }
            
            if (this.testResults.find(r => r.test.includes('API') && !r.passed)) {
                console.log('   📡 API: Page content loading issues. Check authentication and server.');
            }
            
            if (this.testResults.find(r => r.test.includes('Performance') && !r.passed)) {
                console.log('   ⚡ Performance: Some resources may be loading slowly.');
            }
        }
        
        console.log('\n🔧 Builder Test Complete!');
        
        // Store results globally
        window.BuilderTestResults = {
            results: this.testResults,
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                successRate: Math.round((passedTests / totalTests) * 100),
                duration: duration
            }
        };
    }
}

// Auto-run tests when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const tester = new BuilderTest();
            tester.runAllTests();
        }, 3000); // Wait for builder to initialize
    });
} else {
    setTimeout(() => {
        const tester = new BuilderTest();
        tester.runAllTests();
    }, 3000);
}

// Export for manual testing
window.BuilderTest = BuilderTest;

console.log('✅ Builder Test loaded');