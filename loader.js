(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';

    const openTool = () => {
        // 1. Create the window with a reference
        const popup = window.open('', 'WCAGTool', 'width=600,height=400,scrollbars=yes,resizable=yes');
        
        if (!popup) {
            alert("Popup blocked! Please allow popups for this site.");
            return;
        }

        // 2. Initialize the popup content immediately
        popup.document.open();
        popup.document.write(`
            <html>
                <head>
                    <title>WCAG Lookup Tool</title>
                    <style>body { font-family: sans-serif; padding: 20px; }</style>
                </head>
                <body>
                    <div id="root"><h1>Loading WCAG Data...</h1></div>
                </body>
            </html>
        `);
        popup.document.close();

        // 3. Fetch data using XHR (Reliable, no injection)
        const xhr = new XMLHttpRequest();
        xhr.open('GET', dataUrl, true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const text = xhr.responseText;
                    // Extract the array contents between the first '[' and last ']'
                    const start = text.indexOf('[');
                    const end = text.lastIndexOf(']') + 1;
                    const data = JSON.parse(text.substring(start, end));
                    
                    // Render content into the existing popup
                    popup.document.getElementById('root').innerHTML = `
                        <h1>Success!</h1>
                        <p>Loaded ${data.length} criteria.</p>
                        <input type="search" placeholder="Search..." id="searchBox" style="width:100%; padding:8px;">
                        <ul id="list"></ul>
                    `;
                } catch (e) {
                    popup.document.getElementById('root').innerHTML = "<h1>Parsing Error</h1><p>" + e.message + "</p>";
                }
            } else {
                popup.document.getElementById('root').innerHTML = "<h1>Network Error</h1><p>Status: " + xhr.status + "</p>";
            }
        };
        
        xhr.onerror = function() {
            popup.document.getElementById('root').innerHTML = "<h1>Request Failed</h1><p>Check your connection.</p>";
        };
        
        xhr.send();
    };

    // Global listener for the shortcut
    window.addEventListener('keydown', (e) => { 
        if (e.altKey && e.shiftKey && e.key === 'A') {
            e.preventDefault(); // Stop default browser behaviors
            openTool();
        }
    });
})();
