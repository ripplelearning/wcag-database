(function() {
    // 1. Define everything in one single scope immediately
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

    const initTool = async () => {
        document.title = "WCAG Lookup Tool";
        const container = document.getElementById('container');
        container.setAttribute('aria-label', 'WCAG Lookup Tool');
        container.innerHTML = 'Loading criteria...';

        try {
            const response = await fetch('https://ripplelearning.github.io/wcag-database/wcag_data.js', { cache: "no-cache" });
            const data = await response.json();

            // Setup UI
            container.innerHTML = `
                <input id="s" type="search" aria-label="Search WCAG Criteria" placeholder="Search... e.g. 1.1.1, buttons, tables" style="width:90%; padding:10px;">
                <div style="margin:15px 0;">
                    <select id="ver-f" aria-label="Filter by Version"><option value="">Version: All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                    <select id="lvl-f" aria-label="Filter by Level"><option value="">Level: All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                    <select id="cat-f" aria-label="Filter by Category"><option value="">Category: All</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select>
                    <button id="reset-btn">Reset (Alt+Shift+D)</button>
                </div>
                <h2 id="count" aria-live="polite">Found 0 results</h2>
                <div id="list-container"></div>
                <footer><details><summary>How to use this tool</summary><p>Search by criteria or filter by version, level, and category. Keyboard shortcuts: Escape (Minimize), Alt+Shift+A (Restore), Alt+Shift+D (Reset).</p></details></footer>
            `;

            const render = (list) => {
                const listContainer = document.getElementById('list-container');
                listContainer.innerHTML = '';
                ['2.2', '2.1'].forEach(ver => {
                    const filteredVer = list.filter(i => i.ver == ver);
                    if (filteredVer.length === 0) return;
                    const h3 = document.createElement('h3');
                    h3.textContent = `WCAG ${ver} Success Criteria`;
                    listContainer.appendChild(h3);
                    filteredVer.forEach(i => {
                        const div = document.createElement('div');
                        const desc = (i.desc || '').toString().split('|').map(p => `<p>${p.trim()}</p>`).join('');
                        const fails = `<ul>${(i.failures || '').toString().split('|').map(f => `<li>${f.trim()}</li>`).join('')}</ul>`;
                        const fixes = `<ul>${(i.fixes || '').toString().split('|').map(f => `<li>${f.trim()}</li>`).join('')}</ul>`;
                        const disab = (i.disabilitie || '').toString().replace(/\|/g, ', ') || 'N/A';
                        
                        div.innerHTML = `<button class="acc-btn" aria-expanded="false" style="width:100%; text-align:left; padding:10px;">${i.name} (Level ${i.level})</button>
                            <div class="acc-content" style="display:none; padding:10px; border:1px solid #eee;">
                                <strong>Description:</strong>${desc}
                                <strong>Failures:</strong>${fails}
                                <strong>Fixes:</strong>${fixes}
                                <p><strong>Disabilities:</strong> ${disab}</p>
                            </div>`;
                        div.querySelector('.acc-btn').onclick = function() {
                            const exp = this.getAttribute('aria-expanded') === 'true';
                            this.setAttribute('aria-expanded', !exp);
                            div.querySelector('.acc-content').style.display = exp ? 'none' : 'block';
                        };
                        listContainer.appendChild(div);
                    });
                });
                document.getElementById('count').textContent = `Found ${list.length} results`;
            };

            const applyFilters = () => {
                const q = document.getElementById('s').value.toLowerCase();
                const v = document.getElementById('ver-f').value;
                const l = document.getElementById('lvl-f').value;
                const c = document.getElementById('cat-f').value;
                const regex = c ? new RegExp(categoryMap[c], 'i') : null;
                render(data.filter(i => 
                    (i.name.toLowerCase().includes(q) || (i.desc && i.desc.toLowerCase().includes(q))) &&
                    (v === "" || i.ver == v) && (l === "" || i.level === l) &&
                    (!c || (i.tags && i.tags.some(t => regex.test(t))) || (regex && (regex.test(i.name) || (i.desc && regex.test(i.desc)))))
                ));
            };

            ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => document.getElementById(id).onchange = applyFilters);
            document.getElementById('s').oninput = applyFilters;
            document.getElementById('reset-btn').onclick = () => window.location.reload();
            render(data);
            document.getElementById('s').focus();
        } catch (e) { container.innerHTML = 'Error: ' + e.message; }
    };
    initTool();
})();
