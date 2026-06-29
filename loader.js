// loader.js
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

        container.innerHTML = `
            <label for="s">Search:</label><input id="s" type="search"><br>
            <select id="ver-f"><option value="">All Versions</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
            <select id="lvl-f"><option value="">All Levels</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
            <select id="cat-f"><option value="">All Categories</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select>
            <button id="reset-btn">Reset (Alt+Shift+D)</button>
            <h2 id="count" aria-live="polite">Found 0 results</h2>
            <div id="list-container"></div>
        `;

        const render = (list) => {
            const listContainer = document.getElementById('list-container');
            listContainer.innerHTML = '';
            list.forEach(i => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <button class="acc-btn" aria-expanded="false">${i.name} (${i.level})</button>
                    <div class="acc-content" style="display:none;">
                        <p>${i.desc}</p>
                        <button class="copy-btn" data-text="${i.name}\n\n${i.desc}">Copy Entry</button>
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
            announcer.textContent = `Displaying ${list.length} results.`;
        };

        const applyFilters = () => {
            const q = document.getElementById('s').value.toLowerCase();
            const v = document.getElementById('ver-f').value;
            const l = document.getElementById('lvl-f').value;
            const c = document.getElementById('cat-f').value;
            
            const filtered = data.filter(i => {
                const matchCat = !c || (i.tags && i.tags.some(t => new RegExp(categoryMap[c], 'i').test(t)));
                return (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)) &&
                       (v === "" || i.ver == v) && (l === "" || i.level === l) && matchCat;
            });
            render(filtered);
        };

        ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => document.getElementById(id).onchange = applyFilters);
        document.getElementById('reset-btn').onclick = () => window.location.reload();

        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.shiftKey && e.key === 'A') { window.resizeTo(800, 600); window.focus(); }
            if (e.altKey && e.shiftKey && e.key === 'D') { window.location.reload(); }
            if (e.key === 'Escape') { window.resizeTo(0, 0); }
        });

        render(data);
    } catch (e) { container.innerHTML = 'Error.'; }
}
initTool();
