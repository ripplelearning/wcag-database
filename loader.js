// loader.js
async function initTool() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');

    // Announcer for accessibility
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

        // Single Render Function
        const render = (list) => {
            const listContainer = document.getElementById('list-container');
            const countHeader = document.getElementById('count');
            listContainer.innerHTML = '';
            
            const msg = `Found ${list.length} results`;
            countHeader.textContent = msg;
            announcer.textContent = msg; // Accessibility update

            list.forEach(i => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <button class="acc-btn" aria-expanded="false">${i.name} (Level ${i.level})</button>
                    <div class="acc-content" style="display:none; padding:10px; border:1px solid #ccc;">
                        <p>${i.desc}</p>
                    </div>
                `;
                const btn = div.querySelector('.acc-btn');
                const content = div.querySelector('.acc-content');
                btn.onclick = () => {
                    const expanded = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', !expanded);
                    content.style.display = expanded ? 'none' : 'block';
                };
                listContainer.appendChild(div);
            });
        };

        const applyFilters = () => {
            const catSelection = document.getElementById('cat-f').value;
            const searchTerm = document.getElementById('s').value.toLowerCase();
            
            const filtered = data.filter(item => {
                const matchesSearch = item.name.toLowerCase().includes(searchTerm) || item.desc.toLowerCase().includes(searchTerm);
                
                // If "All" is selected (empty string), matchesCategory is true
                const matchesCategory = !catSelection || 
                    (item.tags && item.tags.some(tag => new RegExp(categoryMap[catSelection], 'i').test(tag))) ||
                    new RegExp(categoryMap[catSelection], 'i').test(item.name) ||
                    new RegExp(categoryMap[catSelection], 'i').test(item.desc);
                
                return matchesSearch && matchesCategory;
            });
            
            render(filtered);
        };

        // Attach listeners
        document.getElementById('cat-f').onchange = applyFilters;
        document.getElementById('s').oninput = applyFilters;

        // Initial View
        render(data);
    } catch (e) { console.error("Data error:", e); }
}
initTool();
