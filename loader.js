(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup = null;
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
        const w = Math.round(window.screen.width * 0.5);
        const h = Math.round(window.screen.height * 0.5);

        // Restore/Resize Logic
        if (popup && !
