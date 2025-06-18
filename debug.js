try {
    require('./api/routes/app.js');
    console.log('No syntax errors');
} catch(e) {
    console.error('Syntax error:', e.message, 'Line:', e.lineNumber);
}