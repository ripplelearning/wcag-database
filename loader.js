// loader.js
async function initTool() {
    window.resizeTo(800, 600);
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    const announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.style.cssText = "position:absolute; left:-9999px;";
    document.body.appendChild(announcer);

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
            <input id="s" type="search" placeholder="Search..." style="width:90%; padding:10px;">
            <select id="ver-f"><option value="">All Versions</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
            <select id="lvl-f"><option value="">All Levels</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
            <select id="cat-f"><option value="">All Categories</option>${Object.keys(categoryMap).sort().map(c => `<option value="${c}">${c}</option>`).join('')}</select>
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
                    <button class="acc-btn" aria-expanded="false" style="width:100%; text-align:left;">${i.name} (${i.level})</button>
                    <div class="acc-content" style="display:none; padding:10px; border:1px solid #ccc;">
                        <p>${i.desc}</p>
                        <button class="copy-btn" data-text="${i.name.replace(/\|/g, '\n\n')}">Copy Entry</button>
                    </div>
                `;
                const btn = div.querySelector('.acc-btn');
                btn.onclick = () => {
                    const exp = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', !exp);
                    div.querySelector('.acc-content').style.display = exp ? 'none' : 'block';
                };
                listContainer.appendChild(div);
            });
            announcer.textContent = `Found ${list.length} results.`;
        };

        const filter = () => {
            const q = document.getElementById('s').value.toLowerCase();
            const c = document.getElementById('cat-f').value;
            const reg = c ? new RegExp(categoryMap[c], 'i') : null;
            render(data.filter(i => 
                (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)) &&
                (!reg || (i.tags && i.tags.some(t => reg.test(t))))
            ));
        };

        ['s', 'cat-f'].forEach(id => document.getElementById(id).onchange = filter);
        document.getElementById('s').oninput = filter;
        document.getElementById('reset-btn').onclick = () => window.location.reload();

        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.shiftKey && e.key === 'A') { window.resizeTo(800, 600); window.focus(); }
            if (e.altKey && e.shiftKey && e.key === 'D') { window.location.reload(); }
            if (e.key === 'Escape') { window.resizeTo(0, 0); }
        });

        render(data);
    } catch (e) { console.error(e); }
}
initTool();
