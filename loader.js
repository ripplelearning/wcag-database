async function initTool() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    container.innerHTML = 'Loading criteria...';

    // Inject styles
    const style = document.createElement('style');
    style.innerHTML = `
        .acc-content ul { list-style-type: none; padding-left: 0; margin: 0; } 
        .acc-content ul li { margin-bottom: 5px; }
        .acc-content p { margin: 0 0 10px 0; }
        .acc-content strong { display: block; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    // Announcer for screen readers
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

    const formatAsList = (val) => {
        const text = (val || '').toString();
        return text ? `<ul>${text.split('|').map(i => `<li>${i.trim()}</li>`).join('')}</ul>` : '<ul><li>N/A</li></ul>';
    };
    const formatAsCommaList = (val) => (val || '').toString().replace(/\|/g, ', ') || 'N/A';
    const formatParagraphs = (val) => {
        const text = (val || '').toString();
        return text ? text.split('|').map(p => `<p>${p.trim()}</p>`).join('') : '';
    };
    const cleanForCopy = (val) => (val || '').toString().replace(/\|/g, '\n');

    try {
        const response = await fetch(dataUrl, { cache: "no-cache" });
        const data = await response.json();

        container.innerHTML = `
            <input id="s" type="search" placeholder="Search... e.g. 1.1.1, buttons, tables" style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <select id="ver-f"><option value="">Version: All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <select id="lvl-f"><option value="">Level: All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <select id="cat-f"><option value="">Category: All</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select>
                <button id="reset-btn">Reset</button>
            </div>
            <h2 id="count" aria-live="polite">Found 0 results</h2>
            <div id="list-container"></div>
            <footer style="margin-top:40px; border-top:1px solid #ccc; padding-top:10px;">
                <details>
                    <summary style="font-weight:bold; cursor:pointer;">How to use this tool</summary>
                    <p>Search and filter WCAG success criteria.</p>
                </details>
            </footer>
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
                    const desc = formatParagraphs(i.desc);
                    const fails = formatAsList(i.failures);
                    const fixes = formatAsList(i.fixes);
                    const disab = formatAsCommaList(i.disabilitie);
                    
                    const fullEntry = `Name: ${i.name}\n\nDescription:\n${cleanForCopy(i.desc)}\n\nFailures:\n${cleanForCopy(i.failures)}\n\nFixes:\n${cleanForCopy(i.fixes)}\n\nDisabilities: ${disab}\n\nLink: ${i.Link}`;
                    
                    div.innerHTML = `
                        <button class="acc-btn" aria-expanded="false" style="width:100%; text-align:left; padding:10px;">${i.name} (Level ${i.level})</button>
                        <div class="acc-content" style="display:none; padding:10px; border:1px solid #eee;">
                            <strong>Description:</strong>${desc}
                            <strong>Failures:</strong>${fails}
                            <strong>Fixes:</strong>${fixes}
                            <p><strong>Disabilities:</strong> ${disab}</p>
                            <a href="${i.Link || '#'}" target="_blank">View on W3C</a>
                            <div style="margin-top:10px;">
                                <button class="copy-btn" data-text="${fullEntry}">Copy Full Entry</button>
                                <button class="copy-btn" data-text="${cleanForCopy(i.name)}">Copy Name</button>
                                <button class="copy-btn" data-text="${cleanForCopy(i.desc)}">Copy Desc</button>
                                <button class="copy-btn" data-text="${cleanForCopy(i.failures)}">Copy Failures</button>
                                <button class="copy-btn" data-text="${cleanForCopy(i.fixes)}">Copy Fixes</button>
                                <button class="copy-btn" data-text="${i.Link || ''}">Copy Link</button>
                            </div>
                        </div>
                    `;
                    div.querySelector('.acc-btn').onclick = function() {
                        const exp = this.getAttribute('aria-expanded') === 'true';
                        this.setAttribute('aria-expanded', !exp);
                        div.querySelector('.acc-content').style.display = exp ? 'none' : 'block';
                    };
                    div.querySelectorAll('.copy-btn').forEach(b => {
                        b.onclick = () => {
                            navigator.clipboard.writeText(b.getAttribute('data-text'));
                            const original = b.textContent;
                            b.textContent = "Copied!";
                            setTimeout(() => b.textContent = original, 2000);
                        };
                    });
                    listContainer.appendChild(div);
                });
            });
            const countText = `Found ${list.length} results`;
            document.getElementById('count').textContent = countText;
            announcer.textContent = countText;
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
                (!c || (Array.isArray(i.tags) && i.tags.some(t => regex.test(t))) || (regex && (regex.test(i.name) || (i.desc && regex.test(i.desc)))))
            ));
        };

        ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => document.getElementById(id).onchange = applyFilters);
        document.getElementById('s').oninput = applyFilters;
        document.getElementById('reset-btn').onclick = () => window.location.reload();
        render(data);
    } catch (e) { container.innerHTML = 'Error loading data: ' + e.message; }
}
initTool();
