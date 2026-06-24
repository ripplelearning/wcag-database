(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;
    let appState = { q: '', v: '', l: '', c: '' };

    const categoryMap = { /* ... keep your existing categoryMap ... */ };

    const openTool = () => {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Lookup Tool', `width=${w},height=${h},scrollbars=yes,resizable=yes`);
            popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><div id="root"><h1>Loading WCAG Data...</h1></div></body></html>');
            popup.document.close();
            fetch(dataUrl).then(r => r.text()).then(jsText => { (0, eval)(jsText); setupPopup(window.wcagData); });
        } else { popup.focus(); }
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <p id="search-desc" style="display:none;">Type to search criteria by ID, name, or keywords like buttons or info and relationships.</p>
            <label for="s">Search Criteria:</label>
            <input id="s" type="search" aria-describedby="search-desc" ... >
            <div id="container"></div>
        `;
        // ... (rest of logic)

        const render = (list) => {
            // ... (structure below)
            section.forEach(i => {
                const li = doc.createElement('li');
                // Use a proper aria-expanded button
                li.innerHTML = `
                    <button aria-expanded="false" aria-controls="det-${i.name.replace(/\s+/g,'')}">
                        ${i.name} (Level ${i.level})
                    </button>
                    <div id="det-${i.name.replace(/\s+/g,'')}" style="display:none;">
                        <p><strong>Description:</strong> ${i.desc}</p>
                        <p><strong>Failures:</strong> ${i.failures}</p>
                        <p><strong>Fixes:</strong> ${i.fixes}</p>
                        <p><strong>Disabilities:</strong> ${i.disabilitie}</p>
                        <p><strong>Categories:</strong> ${i.categories}</p>
                    </div>
                `;
                // Add the click handler to toggle display and aria-expanded
            });
        };
    }
    // ...
})();
