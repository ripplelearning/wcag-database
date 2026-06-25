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
            
            // Create script tag to load the data file
            const script = popup.document.createElement('script');
            script.src = dataUrl;
            
            script.onload = () => {
                // Now that the script has loaded, the data should be available on the popup's window object
                if (popup.window.wcagData) {
                    console.log("Data successfully loaded into popup.");
                    setupPopup(popup.window.wcagData);
                } else {
                    console.error("Script loaded, but window.wcagData not found.");
                    popup.document.getElementById('root').innerHTML = "<h1>Error: wcagData not found.</h1>";
                }
            };
            
            script.onerror = () => {
                console.error("Failed to load the external script.");
                popup.document.getElementById('root').innerHTML = "<h1>Error loading data script.</h1>";
            };
            
            popup.document.head.appendChild(script);
        } else {
            popup.focus();
        }
    };

    // Note: Ensure your original 'setupPopup' function follows this line
    function setupPopup(data) {
        // ... (Keep your original code from here down)
        console.log("setupPopup initiated with", data.length, "items.");
        // Make sure your rendering logic calls here...
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    // openTool(); // Uncomment if you want it to open automatically
})();
