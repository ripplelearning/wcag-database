(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js?t=' + Date.now();
    
    // Create the script element
    const script = document.createElement('script');
    script.src = dataUrl;
    
    script.onload = () => {
        // The file is loaded, now we need to open the popup 
        // and pass the data from the current page to the popup
        if (typeof window.wcagData !== 'undefined') {
            openTool(window.wcagData);
        } else {
            alert("Error: Script loaded but 'wcagData' variable not found.");
        }
    };
    
    script.onerror = () => {
        alert("Error: Could not load the script due to security policies.");
    };
    
    document.head.appendChild(script);

    function openTool(data) {
        const popup = window.open('', 'WCAG Lookup Tool', 'width=800,height=600,scrollbars=yes');
        popup.document.write('<html><body><h1>WCAG Lookup Tool</h1><div id="container"></div></body></html>');
        popup.document.close();
        
        // Populate the popup using the data passed from the main page
        const container = popup.document.getElementById('container');
        data.forEach(i => {
            const btn = popup.document.createElement('button');
            btn.textContent = `${i.name} (Level ${i.level})`;
            btn.style.cssText = "display:block; width:100%; margin-top:5px;";
            container.appendChild(btn);
            // ... (Add your existing rendering/copy logic here)
        });
    }
})();
