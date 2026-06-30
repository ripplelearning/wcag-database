(async function() {
    // 1. Setup UI and Styles first
    const container = document.getElementById('container');
    if (!container) return; // Guard clause
    
    container.innerHTML = 'Loading...';
    document.title = "WCAG Lookup Tool";

    // 2. Define data and config inside the same scope
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
        const response = await fetch('https://ripplelearning.github.io/wcag-database/wcag_data.js', { cache: "no-cache" });
        const wcagData = await response.json();

        // 3. Define helper functions inside the scope
        const formatAsList = (val) => (val || '').toString() ? `<ul>${(val || '').toString().split('|').map(i => `<li>${i.trim()}</li>`).join('')}</ul>` : '<ul><li>N/A</li></ul>';
        const formatAsCommaList = (val) => (val || '').toString().replace(/\|/g, ', ') || 'N/A';
        const formatParagraphs = (val) => (val || '').toString().split('|').map(p => `<p>${p.trim()}</p>`).join('');

        // 4. Define Render within the scope
        const render = (list) => {
            const listContainer = document.getElementById('list-container');
            listContainer.innerHTML = '';
            ['2.2', '2.1'].forEach(ver => {
                const filteredVer = list.filter(i => i.ver == ver);
                if (filteredVer.length === 0) return;
                listContainer.innerHTML += `<h3>WCAG ${ver} Success Criteria</h3>`;
                filteredVer.forEach(i => {
                    const div = document.createElement('div');
                    div.innerHTML = `<button class="acc-btn" style="width:100%; text-align:left; padding:10px;">${i.name}</button>
                        <div class="acc-content" style="display:none; padding:10px; border:1px solid #ccc;">
                            <strong>Description:</strong>${formatParagraphs(i.desc)}
                            <strong>Failures:</strong>${formatAsList(i.failures)}
                            <strong>Fixes:</strong>${formatAsList(i.fixes)}
                            <p><strong>Disabilities:</strong> ${formatAsCommaList(i.disabilitie)}</p>
                        </div>`;
                    div.querySelector('.acc-btn').onclick = function() {
                        const content = this.nextElementSibling;
                        content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    };
                    listContainer.appendChild(div);
                });
            });
            document.getElementById('count').textContent = `Found ${list.length} results`;
        };

        // 5. Build UI and attach events
        container.innerHTML = `
            <input id="s" type="search" placeholder="Search... 1.1.1, buttons..." style="width:90%; padding:10px;">
            <div>
                <select id="ver-f"><option value="">Version: All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <select id="lvl-f"><option value="">Level: All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <select id="cat-f"><option value="">Category: All</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count">Found ${wcagData.length} results</h2>
            <div id="list-container"></div>
        `;

        const applyFilters = () => {
            const q = document.getElementById('s').value.toLowerCase();
            const v = document.getElementById('ver-f').value;
            const l = document.getElementById('lvl-f').value;
            const c = document.getElementById('cat-f').value;
            const regex = c ? new RegExp(categoryMap[c], 'i') : null;
            render(wcagData.filter(i => 
                (i.name.toLowerCase().includes(q) || (i.desc && i.desc.toLowerCase().includes(q))) &&
                (v === "" || i.ver == v) && (l === "" || i.level === l) &&
                (!c || (i.tags && i.tags.some(t => regex.test(t))) || (regex && (regex.test(i.name) || (i.desc && regex.test(i.desc)))))
            ));
        };

        ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => document.getElementById(id).onchange = applyFilters);
        document.getElementById('s').oninput = applyFilters;
        document.getElementById('reset-btn').onclick = () => window.location.reload();

        render(wcagData);
        document.getElementById('s').focus();
    } catch (e) {
        container.innerHTML = 'Error: ' + e.message;
    }
})();
