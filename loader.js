(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';

    const openTool = () => {
        // 1. Open to a "about:blank"
        const popup = window.open('', 'WCAGTool', 'width=600,height=400,scrollbars=yes,resizable=yes');
        
        if (!popup) {
            alert("Popup blocked! Check your browser settings.");
            return;
        }

        // 2. We use a Data URI to force the page to "load" 
        // This is often more reliable than document.write
        popup.location.href = 'data:text/html;charset=utf-8,' + encodeURI(`
            <html>
                <head><title>WCAG Lookup Tool</title></head>
                <body style="font-family:sans-serif; padding:20px;">
                    <h1 id="status">Loading data...</h1>
                    <div id="root"></div>
                </body>
            </html>
        `);

        // 3. Wait a split second for the window to "load" before fetching
        setTimeout(() => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', dataUrl, true);
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        const text = xhr.responseText;
                        const start = text.indexOf('[');
                        const end = text.lastIndexOf(']') + 1;
                        const data = JSON.parse(text.substring(start, end));
                        
                        // Access the document inside the newly loaded window
                        popup.document.getElementById('status').innerText = "Data Loaded!";
                        popup.document.getElementById('root').innerHTML = `<p>Successfully loaded ${data.length} criteria.</p>`;
                    } catch (e) {
                        popup.document.getElementById('status').innerText = "Error Parsing Data";
                    }
                }
            };
            xhr.send();
        }, 500); // Wait 500ms for the page to initialize
    };

    window.addEventListener('keydown', (e) => { 
        if (e.altKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            openTool();
        }
    });
})();
