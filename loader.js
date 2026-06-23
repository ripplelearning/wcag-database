(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';
    let popup = null;
    let savedSearch = "";

    const openTool = () => {
        // Calculate 50% dimensions
        const w = Math.round(window.screen.width * 0.5);
        const h = Math.round(window.screen.height * 0.5);

        // If window exists, restore size and focus
        if (popup && !popup.closed) {
            popup.resizeTo(w, h);
            popup.moveTo((window.screen.width - w) / 2, (window.screen.height - h) / 2);
            popup.focus();
            return;
        }

        // Open new window at 50% dimensions
        popup = window.open('', 'WCAGTool', `width=${w},height=${h},scrollbars=yes,resizable=yes`);
        
        popup.document.open();
        popup.document.write(`
            <html>
                <head><title>WCAG Lookup Tool</title></head>
                <body style="font-family:sans-serif; padding:20px;">
                    <h2>WCAG Lookup Tool</h2>
                    <input type="search" id="search" placeholder="Search criteria..." style="width:100%; padding:10px;">
                    <div id="results" style="margin-top:20px;"></div>
                </body>
            </html>
        `);
        popup.document.close();

        // Fetch data
        const xhr = new XMLHttpRequest();
        xhr.open('GET', dataUrl, true);
        xhr.onload = function() {
            const data = JSON.parse(xhr.responseText.substring(xhr.responseText.indexOf('['), xhr.responseText.lastIndexOf(']') + 1));
            const input = popup.document.getElementById('search');
            
            input.value = savedSearch;
            render(data, savedSearch);

            input.oninput = function() {
                savedSearch = this.value;
                render(data, savedSearch);
            };
        };
        xhr.send();
    };

    function render(data, term) {
        const filtered = data.filter(i => i.name.toLowerCase().includes(term.toLowerCase()));
        popup.document.getElementById('results').innerHTML = filtered.map(i => 
            `<p><strong>${i.name}</strong><br>${i.desc}</p>`
        ).join('');
    }

    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            openTool();
        }
        if (e.key === 'Escape' && popup && !popup.closed) {
            // Shrink to effectively hidden size
            popup.resizeTo(0, 0);
            popup.moveTo(window.screen.width, window.screen.height);
        }
    });
})();
