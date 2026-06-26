(function() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    let popup;

    // We define this globally so the script we load can "call" it
    window.processWcagData = function(data) {
        setupPopup(data);
    };

    const w = window.screen.availWidth * 0.5;
    const h = window.screen.availHeight * 0.5;
    popup = window.open('', 'WCAG Lookup Tool', `width=${w},height=${h},scrollbars=yes,resizable=yes`);
    popup.document.write('<html><body><h1>Loading WCAG Data...</h1></body></html>');

    const s = document.createElement('script');
    s.src = dataUrl;
    s.onerror = () => {
        popup.document.body.innerHTML = '<h1>Error</h1><p>Could not load data file. Check if URL is correct.</p>';
    };
    document.body.appendChild(s);

    function setupPopup(data) {
        // ... [Insert your existing setupPopup/render/filter logic here] ...
        // Ensure this function initializes the UI using the 'data' argument passed to it
    }
})();
