(function() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    
    // 1. Open the window immediately
    const w = window.screen.availWidth * 0.5;
    const h = window.screen.availHeight * 0.5;
    const popup = window.open('', 'WCAG Lookup Tool', `width=${w},height=${h},scrollbars=yes,resizable=yes`);
    
    // 2. Set the initial loading state
    popup.document.write('<html><body><h1>Loading WCAG Data...</h1></body></html>');
    popup.document.close();

    // 3. Define the callback globally so the script can find it
    window.processWcagData = function(data) {
        // Now render the UI using the data
        renderUI(popup, data);
    };

    // 4. Inject the script
    const s = document.createElement('script');
    s.src = dataUrl;
    s.onerror = () => { popup.document.body.innerHTML = '<h1>Error</h1><p>Failed to load data file.</p>'; };
    document.body.appendChild(s);

    function renderUI(win, data) {
        // Put your full UI building logic here (the setupPopup function content)
        win.document.body.innerHTML = '<h1>Success! Data Loaded.</h1>';
        // ... rest of your render logic ...
    }
})();
