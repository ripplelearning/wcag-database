(async function() {
    // Unique ID to prevent multiple instances
    const ID = "wcag-lookup-tool";
    let container = document.getElementById(ID);
    
    // Toggle logic: If it exists, just show/hide it
    if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
        return;
    }

    // Otherwise, create the container
    container = document.createElement('div');
    container.id = ID;
    container.style.cssText = "position:fixed; top:10px; right:10px; width:400px; max-height:80vh; background:white; z-index:999999; border:1px solid #000; overflow-y:auto; padding:10px;";
    document.body.appendChild(container);
    
    container.innerHTML = '<div id="tool-ui">Loading data...</div>';
    const toolUi = document.getElementById('tool-ui');

    try {
        const response = await fetch('https://ripplelearning.github.io/wcag-database/wcag_data.js', { cache: "no-cache" });
        const data = await response.json();
        
        // --- [Insert categoryMap, formatters, and render function logic here] ---
        // (Use the logic from our previous successful build)

        toolUi.innerHTML = `<h3>WCAG Lookup</h3><input id="s" type="search" placeholder="Search..."><div id="list-container"></div>`;
        
        // ATTACH TO WINDOW TO BYPASS PAGE-LEVEL INTERFERENCE
        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.shiftKey && e.key === 'A') {
                container.style.display = 'block';
                document.getElementById('s').focus();
            } else if (e.key === 'Escape') {
                container.style.display = 'none';
            } else if (e.altKey && e.shiftKey && e.key === 'D') {
                container.remove(); // Removes tool to allow clean re-launch
                window.location.reload();
            }
        }, { capture: true });

        // Logic to render content...
        // render(data); 

    } catch (e) {
        container.innerHTML = 'Error: ' + e.message;
    }
})();
