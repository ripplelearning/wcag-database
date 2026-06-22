(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';
    let popup;
    let appState = { q: '', v: '', l: '', c: '' };

    const categoryMap = {
        "ARIA & Live Regions": "ARIA|Live",
        "Audio & Video": "Multimedia|Audio|Video|Captions|Transcripts",
        "Buttons & Navigation": "Navigation|Link|Skip|Bypass",
        "Color & Contrast": "Color|Contrast",
        "Focus & Keyboard": "Keyboard|Focus|Tabindex|Modal",
        "Forms & Inputs": "Forms|Input|Autocomplete|Authentication",
        "Images & Graphics": "Images|Graphic|Icons|Charts",
        "Interactions": "Interactions|Pointer|Dragging|Input Modalities",
        "Language & Text": "Text|Language|Jargon|Acronym|Pronunciation",
        "Layout & Structure": "Layout|Structure|Semantics|Reading Order|Reflow|CSS",
        "Mobile & Touch": "Mobile|Orientation|Tap Targets",
        "Motion & Animation": "Animation|Reduced Motion|Seizure|Flash",
        "Notifications & Errors": "Error|Notifications|Alert|Status",
        "Time & Timeouts": "Timeouts|Refresh|Expiration",
        "Tooltips & Overlays": "Tooltips|Overlays|Popups|Dialog"
    };

    const openTool = () => {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        const options = `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`;
        
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Lookup Tool', options);
            popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><div id="root"><h1>Loading WCAG Data...</h1></div></body></html>');
            popup.document.close();
            
            // FIXED: Removed eval(), switched to json()
            fetch(dataUrl)
                .then(r => r.json())
                .then(data => {
                    setupPopup(data);
                })
                .catch(err => {
                    console.error("Fetch failed:", err);
                    popup.document.getElementById('root').innerHTML = "<h1>Error loading data. Check console.</h1>";
                });
        } else {
            popup.focus();
        }
    };

    function setupPopup(data) {
        // ... (Rest of your setupPopup code remains exactly the same)
        const doc = popup.document;
        doc.body.style.fontFamily = "sans-serif";
        doc.body.style.padding = "20px";
        
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <div id="sr-announcer" aria-live="assertive" style="position:absolute; left:-9999px;"></div>
            <label for="s">Search Criteria:</label><br>
            <input id="s" type="search" autocomplete="off" aria-controls="count" placeholder="e.g. 1.1.1, images, keyboard..." style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <label>Version: <select id="ver-f"><option value="">All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select></label>
                <label>Level: <select id="lvl-f"><option value="">All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select></label>
                <label>Category: 
                    <select id="cat-f">
                        <option value="">All</option>
                        ${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </label>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite"></h2>
            <ul id="container" style="list-style-type:none; padding:0;"></ul>
            <hr style="margin-top:40px;">
            <details>
                <summary style="font-size: 1.17em; font-weight: bold; cursor: pointer; margin-bottom: 10px;">How to use this tool</summary>
                <ul style="list-style-type: none; padding: 0; margin: 0;">
                    <li><p>This WCAG Lookup Tool is a professional reference library...</p></li>
                </ul>
            </details>
        `;
        // ... (The rest of your event listeners and render functions remain unchanged)
        // Ensure you copy your original function logic below this point!
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
