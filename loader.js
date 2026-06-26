(async function() {
    // This is the URL to your data file hosted on GitHub Pages
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';

    try {
        const response = await fetch(dataUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Create the popup window
        const popup = window.open('', 'WCAG Tool', 'width=800,height=600');
        popup.document.write('<html><head><title>WCAG Tool</title></head><body>');
        popup.document.write('<h1>WCAG Tool</h1><div id="container"></div>');
        popup.document.write('</body></html>');
        
        const container = popup.document.getElementById('container');
        
        // Render buttons
        data.forEach((i, index) => {
            const btn = popup.document.createElement('button');
            btn.textContent = `${i.name || "Item " + index} (Level ${i.level || "N/A"})`;
            btn.style.display = "block";
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.style.margin = "5px 0";
            btn.style.padding = "10px";
            btn.style.cursor = "pointer";
            
            btn.onclick = () => {
                alert(`Description:\n${i.desc || "No description provided."}`);
            };
            
            container.appendChild(btn);
        });
    } catch (e) {
        console.error("Failed to load WCAG data:", e);
        alert("Error loading tool. Ensure wcag_data.js is valid JSON and accessible via GitHub Pages.");
    }
})();
