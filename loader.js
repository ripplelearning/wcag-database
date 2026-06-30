(async function() {
    const ID = "wcag-lookup-tool";
    let container = document.getElementById(ID);
    
    // Toggle if it already exists
    if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
        if (container.style.display === 'block') document.getElementById('s').focus();
        return;
    }

    // Create the container
    container = document.createElement('div');
    container.id = ID;
    container.style.cssText = "position:fixed; top:20px; right:20px; width:400px; max-height:80vh; background:white; z-index:999999; border:2px solid #333; overflow-y:auto; padding:20px; box-shadow: 0 0 10px rgba(0,0,0,0.5); border-radius:8px;";
    document.body.appendChild(container);
    
    container.innerHTML = '<div id="tool-ui">Loading data...</div>';
    const toolUi = document.getElementById('tool-ui');

    try {
        const response = await fetch('https://ripplelearning.github.io/wcag-database/wcag_data.js', { cache: "no-cache" });
        const data = await response.json();
        
        // Render Function
        const render = (list) => {
            toolUi.innerHTML = `
                <h2>WCAG Lookup Tool</h2>
                <input id="s" type="search" placeholder="Search... 1.1.1, buttons, tables" style="width:100%; padding:8px; margin-bottom:10px;">
                <div id="list-container"></div>
                <hr>
                <details>
                    <summary style="font-weight:bold; cursor:pointer;">How to use this tool</summary>
                    <p>Search via the input box for criteria by name or number. Use the filters to narrow results by version, level, or category.</p>
                    <p>Click any criteria title to expand details. Use the "Copy" buttons to export content to your clipboard.</p>
                    <p><strong>Keyboard Shortcuts:</strong></p>
                    <ul>
                        <li><strong>Minimize Tool:</strong> Escape</li>
                        <li><strong>Restore Tool:</strong> Alt+Shift+A</li>
                        <li><strong>Reset Tool:</strong> Alt+Shift+D</li>
                    </ul>
                </details>
            `;
            // ... (Add your rendering logic for list-container here)
        };

        render(data);

        // Robust Shortcut Listener
        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.shiftKey && e.key === 'A') {
                container.style.display = 'block';
                document.getElementById('s').focus();
            } else if (e.key === 'Escape') {
                container.style.display = 'none';
            } else if (e.altKey && e.shiftKey && e.key === 'D') {
                container.remove();
                // Re-trigger the tool launch
            }
        }, true);

    } catch (e) {
        container.innerHTML = '<p>Error loading data. Please check your connection.</p>';
    }
})();
