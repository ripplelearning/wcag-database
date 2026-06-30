// Move constant outside initTool so all functions can see it
const categoryMap = {
    "ARIA & Live Regions": "ARIA|Live|Region|Role|State",
    "Audio & Video": "Multimedia|Audio|Video|Captions|Transcripts|Media",
    "Buttons & Navigation": "Navigation|Link|Skip|Bypass|Button|Menu|Interaction",
    "Color & Contrast": "Color|Contrast|Luminance|Foreground|Background",
    "Focus & Keyboard": "Keyboard|Focus|Tabindex|Modal|Operable",
    "Forms & Inputs": "Forms|Input|Autocomplete|Authentication|Labels",
    "Images & Graphics": "Images|Graphic|Icons|Charts|Alt Text",
    "Interactions": "Interactions|Pointer|Dragging|Input Modalities|Gestures",
    "Language & Text": "Text|Language|Jargon|Acronym|Pronunciation|Readability",
    "Layout & Structure": "Layout|Structure|Semantics|Reading Order|Reflow|CSS|Grouping",
    "Mobile & Touch": "Mobile|Orientation|Tap Targets|Touch|Sensors",
    "Motion & Animation": "Animation|Reduced Motion|Seizure|Flash|Blinking",
    "Notifications & Errors": "Error|Notifications|Alert|Status|Validation",
    "Time & Timeouts": "Timeouts|Refresh|Expiration|Interruptions",
    "Tooltips & Overlays": "Tooltips|Overlays|Popups|Dialog|Hover|Focus"
};

async function initTool() {
    document.title = "WCAG Lookup Tool";
    
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    container.setAttribute('aria-label', 'WCAG Lookup Tool');
    container.setAttribute('role', 'region');
    container.innerHTML = 'Loading criteria...';

    // ... (All style, formatAsList, formatAsCommaList, formatParagraphs, cleanForCopy remain same) ...

    const resetTool = () => {
        document.getElementById('s').value = '';
        document.getElementById('ver-f').value = '';
        document.getElementById('lvl-f').value = '';
        document.getElementById('cat-f').value = '';
        // Manually trigger the event to refresh view
        document.getElementById('s').dispatchEvent(new Event('input'));
        document.getElementById('s').focus();
    };

    try {
        const response = await fetch(dataUrl, { cache: "no-cache" });
        const data = await response.json();

        // (The rest of your HTML template remains identical, 
        // including the category selection logic which now reads from global categoryMap)
        
        // ... (Render and ApplyFilters functions use the global categoryMap) ...
        
        render(data);
        document.getElementById('s').focus();
    } catch (e) { container.innerHTML = 'Error loading data: ' + e.message; }
}
initTool();
