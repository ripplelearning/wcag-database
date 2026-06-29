async function initTool() {
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
            <div style="margin:15px 0;">
                <select id="ver-f"><option value="">Version: All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <select id="lvl-f"><option value="">Level: All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <select id="cat-f"><option value="">Category: All</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite">Found 0 results</h2>
            <div id="list-container"></div>
            <footer style="margin-top:40px; border-top:1px solid #ccc; padding-top:10px;">
                <details>
                    <summary style="font-weight:bold; cursor:pointer;">How to use this tool</summary>
                    <p>This tool allows you to search and filter WCAG success criteria to identify accessibility issues and their corresponding fixes.</p>
                    <p><strong>Keyboard Shortcuts:</strong></p>
                    <ul>
                        <li><strong>Alt+Shift+A:</strong> Restore Tool</li>
                        <li><strong>Alt+Shift+D:</strong> Reset Filters</li>
                        <li><strong>Escape:</strong> Minimize/Hide Tool</li>
                    </ul>
                </details>
            </footer>
        `;

        const render = (list) => {
            const listContainer = document.getElementById('list-container');
            listContainer.innerHTML = '';
            
            // Separate by version
            ['2.2', '2.1'].forEach(ver => {
                const filteredVer = list.filter(i => i.ver == ver);
                if (filteredVer.length === 0) return;

                const h3 = document.createElement('h3');
                h3.textContent = `WCAG ${ver} Success Criteria`;
                listContainer.appendChild(h3);

                filteredVer.forEach(i => {
                    const div = document.createElement('div');
                    div.style.marginBottom = "10px";
                    div.innerHTML = `
                        <button class="acc-btn" aria-expanded="false" style="width:100%; text-align:left; padding:10px;">${i.name} (Level ${i.level})</button>
                        <div class="acc-content" style="display:none; padding:10px; border:1px solid #eee;">
                            <p><strong>Description:</strong> ${i.desc}</p>
                            <p><strong>Failures:</strong> ${i.failures}</p>
                            <p><strong>Fixes:</strong> ${i.fixes}</p>
                            <p><strong>Disabilities:</strong> ${i.disabilities || 'N/A'}</p>
                            <a href="${i.Link}" target="_blank">View on W3C</a>
                            <div style="margin-top:10px;">
                                <button class="copy-btn" data-text="${i.name}">Copy Name</button>
                                <button class="copy-btn" data-text="${i.desc}">Copy Desc</button>
                                <button class="copy-btn" data-text="${i.failures}">Copy Failures</button>
                                <button class="copy-btn" data-text="${i.fixes}">Copy Fixes</button>
                                <button class="copy-btn" data-text="${i.Link}">Copy Link</button>
                            </div>
                        </div>
                    `;
                    const btn = div.querySelector('.acc-btn');
                    const content = div.querySelector('.acc-content');
                    btn.onclick = () => {
                        const exp = btn.getAttribute('aria-expanded') === 'true';
                        btn.setAttribute('aria-expanded', !exp);
                        content.style.display = exp ? 'none' : 'block';
                    };
                    div.querySelectorAll('.copy-btn').forEach(b => {
                        b.onclick = () => navigator.clipboard.writeText(b.getAttribute('data-text'));
                    });
                    listContainer.appendChild(div);
                });
            });
            
            const msg = `Found ${list.length} results`;
            document.getElementById('count').textContent = msg;
            announcer.textContent = msg;
        };

        const applyFilters = () => {
            const q = document.getElementById('s').value.toLowerCase();
            const v = document.getElementById('ver-f').value;
            const l = document.getElementById('lvl-f').value;
            const c = document.getElementById('cat-f').value;
            
            const filtered = data.filter(i => {
                const matchSearch = i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q);
                const matchVer = v === "" || i.ver == v;
                const matchLvl = l === "" || i.level === l;
                const regex = c ? new RegExp(categoryMap[c], 'i') : null;
                const matchCat = !c || (Array.isArray(i.tags) && i.tags.some(t => regex.test(t))) || (regex && (regex.test(i.name) || regex.test(i.desc)));
                return matchSearch && matchVer && matchLvl && matchCat;
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
    } catch (e) {
        if(container) container.innerHTML = 'Error loading data: ' + e.message;
    }
}
initTool();
