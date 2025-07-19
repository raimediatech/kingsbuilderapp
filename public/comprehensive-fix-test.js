// Comprehensive Fix Test for KingsBuilder
console.log('🧪 Starting KingsBuilder Comprehensive Fix Test...');

class KingsBuilderFixTest {
    constructor() {
        this.testResults = [];
        this.startTime = Date.now();
    }

    // Test result logging
    logTest(testName, passed, details = '') {
        const result = {
            test: testName,
            passed: passed,
            details: details,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        const icon = passed ? '✅' : '❌';
        console.log(`${icon} ${testName}: ${passed ? 'PASSED' : 'FAILED'}${details ? ` - ${details}` : ''}`);
    }

    // Test 1: Icon Loading
    async testIconLoading() {
        console.log('\n📋 Testing Icon Loading...');
        
        try {
            // Check if Font Awesome is loaded
            const testElement = document.createElement('i');
            testElement.className = 'fas fa-home';
            testElement.style.position = 'absolute';
            testElement.style.left = '-9999px';
            document.body.appendChild(testElement);
            
            const computedStyle = window.getComputedStyle(testElement, ':before');
            const fontFamily = computedStyle.fontFamily;
            const content = computedStyle.content;
            
            document.body.removeChild(testElement);
            
            const fontAwesomeLoaded = fontFamily && fontFamily.includes('Font Awesome');
            const hasContent = content && content !== '""' && content !== 'none';
            
            this.logTest('Font Awesome CDN Loading', fontAwesomeLoaded, 
                fontAwesomeLoaded ? 'CDN loaded successfully' : 'Using fallback icons');
            
            this.logTest('Icon Content Rendering', hasContent || !fontAwesomeLoaded, 
                hasContent ? 'Icons rendering properly' : 'Using emoji fallbacks');
            
            // Test specific icons
            const iconTests = [
                { class: 'fa-crown', expected: '👑' },
                { class: 'fa-plus', expected: '+' },
                { class: 'fa-edit', expected: '✏️' },
                { class: 'fa-trash', expected: '🗑️' }
            ];
            
            let iconsFunctional = 0;
            iconTests.forEach(iconTest => {
                const iconEl = document.createElement('i');
                iconEl.className = `fas ${iconTest.class}`;
                iconEl.style.position = 'absolute';
                iconEl.style.left = '-9999px';
                document.body.appendChild(iconEl);
                
                const iconStyle = window.getComputedStyle(iconEl, ':before');
                const iconContent = iconStyle.content;
                
                document.body.removeChild(iconEl);
                
                if (iconContent && iconContent !== '""' && iconContent !== 'none') {
                    iconsFunctional++;
                }
            });
            
            this.logTest('Essential Icons Functional', iconsFunctional >= iconTests.length / 2, 
                `${iconsFunctional}/${iconTests.length} icons working`);
            
        } catch (error) {
            this.logTest('Icon Loading Test', false, `Error: ${error.message}`);
        }
    }

    // Test 2: API Connectivity
    async testAPIConnectivity() {
        console.log('\n📡 Testing API Connectivity...');
        
        try {
            // Test health check endpoint
            const healthResponse = await fetch('/api/pages/health/check');
            const healthData = await healthResponse.json();
            
            this.logTest('API Health Check', healthData.success, 
                healthData.message || 'API responding');
            
            // Test pages API
            const shop = new URLSearchParams(window.location.search).get('shop') || 'kingsbuilder.myshopify.com';
            const pagesResponse = await fetch(`/api/pages?shop=${encodeURIComponent(shop)}`);
            const pagesData = await pagesResponse.json();
            
            this.logTest('Pages API Response', pagesResponse.ok, 
                `Status: ${pagesResponse.status}`);
            
            this.logTest('Pages Data Structure', pagesData.hasOwnProperty('success'), 
                `Has success field: ${pagesData.success}`);
            
            if (pagesData.success && pagesData.pages) {
                this.logTest('Pages Data Loading', true, 
                    `Loaded ${pagesData.pages.length} pages`);
            } else if (pagesData.needsAuth) {
                this.logTest('Authentication Status', false, 
                    'Authentication required - please reconnect store');
            } else {
                this.logTest('Pages Data Loading', false, 
                    pagesData.error || 'Unknown error');
            }
            
        } catch (error) {
            this.logTest('API Connectivity Test', false, `Network error: ${error.message}`);
        }
    }

    // Test 3: Static File Loading
    async testStaticFileLoading() {
        console.log('\n📁 Testing Static File Loading...');
        
        const staticFiles = [
            'icon-fix.js',
            'page-content-fix.js',
            'dashboard-icon-fix.css',
            'ui-enhancements.js',
            'shopify-integration.js'
        ];
        
        for (const file of staticFiles) {
            try {
                const response = await fetch(`/${file}`);
                this.logTest(`Static File: ${file}`, response.ok, 
                    `Status: ${response.status}`);
            } catch (error) {
                this.logTest(`Static File: ${file}`, false, 
                    `Error: ${error.message}`);
            }
        }
    }

    // Test 4: DOM Elements
    async testDOMElements() {
        console.log('\n🏗️ Testing DOM Elements...');
        
        const requiredElements = [
            { id: 'connectionStatus', name: 'Connection Status' },
            { id: 'statusIcon', name: 'Status Icon' },
            { id: 'statusText', name: 'Status Text' },
            { id: 'createPageBtn', name: 'Create Page Button' }
        ];
        
        requiredElements.forEach(element => {
            const domElement = document.getElementById(element.id);
            this.logTest(`DOM Element: ${element.name}`, !!domElement, 
                domElement ? 'Found' : 'Missing');
        });
        
        // Test for pages container
        const pagesContainer = document.getElementById('pagesContainer') || 
                              document.querySelector('.pages-container') ||
                              document.querySelector('[data-pages-container]');
        
        this.logTest('Pages Container', !!pagesContainer, 
            pagesContainer ? 'Found' : 'Missing - pages may not display');
    }

    // Test 5: JavaScript Functionality
    async testJavaScriptFunctionality() {
        console.log('\n⚙️ Testing JavaScript Functionality...');
        
        // Test global objects
        const globalObjects = [
            { name: 'IconFix', obj: window.IconFix },
            { name: 'PageContentFix', obj: window.PageContentFix }
        ];
        
        globalObjects.forEach(global => {
            this.logTest(`Global Object: ${global.name}`, !!global.obj, 
                global.obj ? 'Available' : 'Not loaded');
        });
        
        // Test specific functions
        if (window.IconFix) {
            this.logTest('IconFix.initialize', typeof window.IconFix.initialize === 'function', 
                'Function available');
        }
        
        if (window.PageContentFix) {
            this.logTest('PageContentFix.loadPages', typeof window.PageContentFix.loadPages === 'function', 
                'Function available');
        }
    }

    // Test 6: Shopify Integration
    async testShopifyIntegration() {
        console.log('\n🛍️ Testing Shopify Integration...');
        
        // Check for Shopify App Bridge
        const hasAppBridge = typeof window.ShopifyApp !== 'undefined';
        this.logTest('Shopify App Bridge', hasAppBridge, 
            hasAppBridge ? 'Loaded' : 'Not available');
        
        // Check for shop parameter
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');
        this.logTest('Shop Parameter', !!shop, 
            shop ? `Shop: ${shop}` : 'No shop parameter');
        
        // Check if running in iframe
        const inIframe = window.parent !== window;
        this.logTest('Iframe Context', inIframe, 
            inIframe ? 'Running in Shopify Admin' : 'Standalone mode');
    }

    // Run all tests
    async runAllTests() {
        console.log('🚀 Running all KingsBuilder fix tests...\n');
        
        await this.testIconLoading();
        await this.testAPIConnectivity();
        await this.testStaticFileLoading();
        await this.testDOMElements();
        await this.testJavaScriptFunctionality();
        await this.testShopifyIntegration();
        
        this.generateReport();
    }

    // Generate test report
    generateReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log('\n📊 TEST REPORT');
        console.log('='.repeat(50));
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
        
        console.log('\n🎯 RECOMMENDATIONS:');
        
        if (failedTests === 0) {
            console.log('   ✅ All tests passed! KingsBuilder should be working properly.');
        } else {
            if (this.testResults.find(r => r.test.includes('Font Awesome') && !r.passed)) {
                console.log('   🎨 Icons: Font Awesome CDN may be blocked. Fallback icons should work.');
            }
            
            if (this.testResults.find(r => r.test.includes('API') && !r.passed)) {
                console.log('   📡 API: Check server logs and authentication status.');
            }
            
            if (this.testResults.find(r => r.test.includes('Static File') && !r.passed)) {
                console.log('   📁 Static Files: Check server routing and file permissions.');
            }
            
            if (this.testResults.find(r => r.test.includes('Authentication') && !r.passed)) {
                console.log('   🔐 Auth: Reconnect your Shopify store in the app settings.');
            }
        }
        
        console.log('\n🔧 KingsBuilder Fix Test Complete!');
        
        // Store results globally for debugging
        window.KingsBuilderTestResults = {
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
            const tester = new KingsBuilderFixTest();
            tester.runAllTests();
        }, 2000); // Wait 2 seconds for other scripts to load
    });
} else {
    setTimeout(() => {
        const tester = new KingsBuilderFixTest();
        tester.runAllTests();
    }, 2000);
}

// Export for manual testing
window.KingsBuilderFixTest = KingsBuilderFixTest;