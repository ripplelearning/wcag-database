(async function() {
    const ID = "wcag-lookup-tool";
    let container = document.getElementById(ID);
    
    // Toggle logic: If it exists, just show/hide it
    if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
        if (container.style.display === 'block') document.getElementById('s').focus();
        return;
    }

    // Create the container
    container = document.createElement('div');
    container.id = ID;
    container.style.cssText = "position:fixed; top:20px; right:20px; width:400px; max-height:80vh; background:white; z-index:9999999; border:2px solid #333; overflow-y:auto; padding:20px; box-shadow: 0 0 10px rgba(0,0,0,0.5); border-radius:8px;";
    document.body.appendChild(container);
    
    container.innerHTML = '<div id="tool-ui">Loading data...</div>';
    const toolUi = document.getElementById('tool-ui');

    try {
        const response = await fetch('https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js', { cache: "no-cache" });
        const data = await response.json();
        
        toolUi.innerHTML = `
            <h2>WCAG Lookup Tool</h2>
            <input id="s" type="search" placeholder="Search... 1.1.1, buttons..." style="width:100%; padding:8px; margin-bottom:10px;">
            <div id="list-container"></div>
            <hr>
            <details>
                <summary style="font-weight:bold; cursor:pointer;">How to use this tool</summary>
                <p>Search via the input box for criteria by name or number. Use the filters to narrow results.</p>
                <p><strong>Shortcuts:</strong></p>
                <ul>
                    <li><strong>Minimize:</strong> Escape</li>
                    <li><strong>Restore:</strong> Alt+Shift+A</li>
                    <li><strong>Reset:</strong> Alt+Shift+D</li>
                </ul>
            </details>
        `;

        // The "Nuclear Option" Listener
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.shiftKey && e.key === 'A') {
                container.style.display = 'block';
                document.getElementById('s').focus();
                e.stopImmediatePropagation();
            } else if (e.key === 'Escape') {
                container.style.display = 'none';
                e.stopImmediatePropagation();
            } else if (e.altKey && e.shiftKey && e.key === 'D') {
                window.location.reload();
                e.stopImmediatePropagation();
            }
        }, true);

    } catch (e) {
        container.innerHTML = '<p>Error loading data.</p>';
    }
})();
