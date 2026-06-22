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
            
            // Inject script tag directly to bypass CORS
            const script = popup.document.createElement('script');
            script.src = dataUrl;
            script.onload = () => {
                if (popup.window.wcagData) {
                    setupPopup(popup.window.wcagData);
                } else {
                    popup.document.getElementById('root').innerHTML = "<h1>Error: Data not found in file.</h1>";
                }
            };
            script.onerror = () => {
                popup.document.getElementById('root').innerHTML = "<h1>Error loading data script.</h1>";
            };
            popup.document.head.appendChild(script);
        } else {
            popup.focus();
        }
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.style.fontFamily = "sans-serif";
        doc.body.style.padding = "20px";
        
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <input id="s" type="search" placeholder="Search..." style="width:90%; padding:10px;">
            <div id="filters" style="margin:15px 0;">
                <select id="ver-f"><option value="">All Versions</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <select id="lvl-f"><option value="">All Levels</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <button id="reset-btn">Reset</button>
            </div>
            <h2 id="count"></h2>
            <ul id="container" style="list-style-type:none; padding:0;"></ul>
        `;

        // Render function logic (ensure you append your filtering/rendering functions here)
        // ... (Keep your existing render/filter/event listener logic from your original code)
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
})();
