// loader.js
async function initTool() {
    const dataUrl = 'wcag_data.js';
    const container = document.getElementById('container');

    try {
        const response = await fetch(dataUrl);
        const data = await response.json();
        
        // Define your category mapping here
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

        // Render the Search UI
        container.innerHTML = `
            <input id="s" type="search" placeholder="Search criteria..." style="width:90%; padding:10px;">
            <div id="results-count"></div>
            <div id="list-container"></div>
        `;

        const render = (list) => {
            const listContainer = document.getElementById('list-container');
            listContainer.innerHTML = '';
            list.forEach(i => {
                const div = document.createElement('div');
                div.className = 'criterion';
                div.innerHTML = `
                    <button style="width:100%; text-align:left;">${i.name}</button>
                    <div style="display:none;">
                        <p><strong>Desc:</strong> ${i.desc}</p>
                        <p><strong>Failures:</strong> ${i.failures}</p>
                        <p><strong>Fixes:</strong> ${i.fixes}</p>
                    </div>
                `;
                // Add your event listeners here
                listContainer.appendChild(div);
            });
        };

        // Initial render
        render(data);

        // Add filter functionality
        document.getElementById('s').oninput = (e) => {
            const val = e.target.value.toLowerCase();
            const filtered = data.filter(i => i.name.toLowerCase().includes(val) || i.desc.toLowerCase().includes(val));
            render(filtered);
        };

    } catch (e) {
        container.innerHTML = '<p>Error loading data. Check your JSON format.</p>';
        console.error(e);
    }
}

// Automatically initialize when the page loads
initTool();
