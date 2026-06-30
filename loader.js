(async function() {
    const container = document.getElementById('container');
    if (!container) return;
    
    // Create a wrapper for the tool to allow easy hiding
    container.innerHTML = '<div id="tool-wrapper">Loading...</div>';
    const wrapper = document.getElementById('tool-wrapper');
    document.title = "WCAG Lookup Tool";

    // ... (keep all categoryMap, formatters, and render logic here as before) ...

    // UI and events
    wrapper.innerHTML = `
        <input id="s" type="search" placeholder="Search... 1.1.1, buttons..." style="width:90%; padding:10px;">
        `;

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        // Alt+Shift+A: Restore
        if (e.altKey && e.shiftKey && e.key === 'A') {
            wrapper.style.display = 'block';
            document.getElementById('s').focus();
        }
        // Escape: Minimize
        if (e.key === 'Escape') {
            wrapper.style.display = 'none';
        }
        // Alt+Shift+D: Reset
        if (e.altKey && e.shiftKey && e.key === 'D') {
            window.location.reload();
        }
    });

    // ... (rest of the logic)
})();
