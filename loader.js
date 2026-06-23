(function() {
    // URL to your raw JSON data
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';

    const openTool = () => {
        // 1. Open popup window
        const popup = window.open('', 'WCAGTool', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        if (!popup) {
            alert("Popup blocked! Please allow popups for this site.");
            return;
        }

        // 2. Set initial "Loading" state
        popup.document.open();
        popup.document.write(`
            <html>
                <head><title>WCAG Lookup Tool</title></head>
                <body style="font-family:sans-serif; padding:20px;">
                    <h1 id="status">Loading...</h1>
                    <div id="root"></div>
                </body>
            </html>
        `);
        popup.document.close();

        // 3. Fetch data via XHR (The "Classic" Protocol)
        const xhr = new XMLHttpRequest();
        xhr.open('GET', dataUrl, true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const text = xhr.responseText;
                    // Robust extraction: find content between first [ and last ]
                    const start = text.indexOf('[');
                    const end = text.lastIndexOf(']') + 1;
                    const data = JSON.parse(text.substring(start, end));
                    
                    // Render successfully loaded data
                    popup.document.getElementById('status').innerText = "Success! " + data.length + " items.";
                    
                    // Your rendering logic here
                    let html = '<ul>';
                    data.forEach(item => {
                        html += `<li><strong>${item.name}</strong> - ${item.level}</li>`;
                    });
                    html += '</ul>';
                    popup.document.getElementById('root').innerHTML = html;
                    
                } catch (e) {
                    popup.document.getElementById('status').innerText = "Parsing Error";
                    popup.document.getElementById('root').innerHTML = `<p>${e.message}</p>`;
                }
            } else {
                popup.document.getElementById('status').innerText = "Error: " + xhr.status;
            }
        };

        xhr.onerror = () => {
            popup.document.getElementById('status').innerText = "Network Error";
        };

        xhr.send();
    };

    // Shortcut: Alt+Shift+A
    window.addEventListener('keydown', (e) => { 
        if (e.altKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            openTool();
        }
    });
})();
