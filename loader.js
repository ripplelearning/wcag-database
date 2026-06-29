async function initTool() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    const announcer = document.getElementById('sr-announcer') || (() => {
        const div = document.createElement('div');
        div.id = 'sr-announcer';
        div.setAttribute('aria-live', 'polite');
        div.style.cssText = "position:absolute; left:-9999px;";
        document.body.appendChild(div);
        return div;
    })();

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

    try {
        const response = await fetch(dataUrl, { cache: "no-cache" });
        const data = await response.json();

        // Ensure we are working with the full object from the DB
        const render = (list) => {
            container.querySelector('#list-container').innerHTML = '';
            
            // Re-render items using the FULL data object passed in the list
            list.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <button class="acc-btn" aria-expanded="false">${item.name}</button>
                    <div class="acc-content" style="display:none;">
                        <p>${item.desc}</p>
                    </div>
                `;
                // ... rest of your UI logic ...
                container.querySelector('#list-container').appendChild(div);
            });
            container.querySelector('#count').textContent = `Found ${list.length} results`;
            announcer.textContent = `Found ${list.length} results`;
        };

        const applyFilters = () => {
            const c = document.getElementById('cat-f').value;
            const filtered = data.filter(item => {
                // If "All" is selected, return true
                if (!c) return true;
                
                // Construct regex from map
                const regex = new RegExp(categoryMap[c], 'i');
                
                // IMPORTANT: Check if item.tags is an array, if not, verify the item fields
                // This assumes your data has an array property called 'tags'
                const hasTagMatch = item.tags && item.tags.some(tag => regex.test(tag));
                
                // Fallback: If tags missing, check if keywords exist in description/name
                const hasKeywordMatch = regex.test(item.name) || regex.test(item.desc);
                
                return hasTagMatch || hasKeywordMatch;
            });
            render(filtered);
        };

        // UI Setup
        document.getElementById('cat-f').onchange = applyFilters;
        
    } catch (e) { console.error(e); }
}
