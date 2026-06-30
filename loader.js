(async function() {
    const container = document.getElementById('container');
    if (!container) return;
    
    // We add an overlay wrapper that we can show/hide
    container.innerHTML = '<div id="tool-ui">Loading...</div>';
    const toolUi = document.getElementById('tool-ui');

    try {
        const response = await fetch('https://ripplelearning.github.io/wcag-database/wcag_data.js', { cache: "no-cache" });
        const wcagData = await response.json();
        
        // ... [Insert categoryMap, formatters, and render logic here] ...

        toolUi.innerHTML = `
            <input id="s" type="search" placeholder="Search... 1.1.1, buttons..." style="width:90%; padding:10px;">
            <div id="list-container"></div>
        `;

        // AGGRESSIVE KEYBOARD LISTENER
        document.addEventListener('keydown', (e) => {
            // Restore: Alt+Shift+A
            if (e.altKey && e.shiftKey && e.key === 'A') {
                toolUi.style.display = 'block';
                document.getElementById('s').focus();
                e.preventDefault();
            }
            // Minimize: Escape
            if (e.key === 'Escape') {
                toolUi.style.display = 'none';
            }
            // Reset: Alt+Shift+D
            if (e.altKey && e.shiftKey && e.key === 'D') {
                window.location.reload();
            }
        }, true); // Use 'true' to capture event in the 'capture' phase, before the site intercepts it

        render(wcagData);
    } catch (e) { container.innerHTML = 'Error: ' + e.message; }
})();
