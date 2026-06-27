// loader.js
async function initTool() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    
    // Add announcer for accessibility
    if (!document.getElementById('sr-announcer')) {
        const announcer = document.createElement('div');
        announcer.id = 'sr-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.style.cssText = "position:absolute; left:-9999px;";
        document.body.appendChild(announcer);
    }
    const announcer = document.getElementById('sr-announcer');

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
            <label for="s">Search Criteria:</label><br>
            <input id="s" type="search" style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <select id="ver-f"><option value="">Version: All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <select id="lvl-f"><option value="">Level: All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <select id="cat-f"><option value="">Category: All</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite">Found 0 results</h2>
            <div id="list-container"></div>
            <footer style="margin-top: 40px; border-top: 1px solid #ccc;">
                <details>
                    <summary style="font-weight:bold; cursor:pointer;">How to use this tool</summary>
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
            const msg = `Found ${list.length} results`;
            document.getElementById('count').textContent = msg;
            if(announcer) announcer.textContent = msg;

            ['2.2', '2.1'].forEach(ver => {
                const section = list.filter(i => i.ver == ver);
                if (!section.length) return;

                const h3 = document.createElement('h3');
                h3.textContent = `WCAG ${ver} Success Criteria`;
                listContainer.appendChild(h3);

                section.forEach(i => {
                    const div = document.createElement('div');
                    div.style.marginBottom = "5px";
                    div.innerHTML = `
                        <button class="acc-btn" aria-expanded="false" style="width:100%; text-align:left; padding:10px;">${i.name} (${i.level})</button>
                        <div class="acc-content" style="display:none; padding:10px; border:1px solid #eee;">
                            <p><strong>Description:</strong> ${i.desc}</p>
                            <a href="${i.Link}" target="_blank">View on W3C</a>
                            <div style="margin-top:10px;">
                                <button class="copy-btn" data-text="${i.name}">Copy Name</button>
                                <button class="copy-btn" data-text="${i.failures}">Copy Failures</button>
                                <button class="copy-btn" data-text="${i.fixes}">Copy Fixes</button>
                                <button class="copy-btn" data-text="${i.Link}">Copy Link</button>
                                <button class="copy-btn" data-text="Name: ${i.name}\nFailures: ${i.failures}\nFixes: ${i.fixes}">Copy Full</button>
                            </div>
                        </div>
                    `;
                    
                    div.querySelector('.acc-btn').onclick = function() {
                        const content = this.nextElementSibling;
                        const isHidden = content.style.display === 'none';
                        document.querySelectorAll('.acc-content').forEach(el => el.style.display = 'none');
                        document.querySelectorAll('.acc-btn').forEach(el => el.setAttribute('aria-expanded', 'false'));
                        if(isHidden) { content.style.display = 'block'; this.setAttribute('aria-expanded', 'true'); }
                    };

                    div.querySelectorAll('.copy-btn').forEach(btn => {
                        btn.onclick = function() {
                            navigator.clipboard.writeText(this.getAttribute('data-text'));
                            const originalText = this.textContent;
                            this.textContent = "Copied!";
                            setTimeout(() => this.textContent = originalText, 2000);
                        };
                    });
                    listContainer.appendChild(div);
                });
            });
        };

        const applyFilters = () => {
            const q = document.getElementById('s').value.toLowerCase();
            const v = document.getElementById('ver-f').value;
            const l = document.getElementById('lvl-f').value;
            const c = document.getElementById('cat-f').value;
            const catPattern = categoryMap[c] || "";
            
            render(data.filter(i => 
                (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)) &&
                (v === "" || i.ver == v) && 
                (l === "" || i.level === l) &&
                (c === "" || (i.tags && i.tags.some(t => t.match(new RegExp(catPattern, 'i')))))
            ));
        };

        ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => document.getElementById(id).onchange = applyFilters);
        document.getElementById('s').oninput = applyFilters;
        document.getElementById('reset-btn').onclick = () => { window.location.reload(); };
        
        window.addEventListener('keydown', (e) => { 
            if (e.altKey && e.shiftKey && e.key === 'D') { window.location.reload(); }
            if (e.key === 'Escape') { window.resizeTo(0, 0); window.blur(); } 
        });

        render(data);
        document.getElementById('s').focus();
    } catch (e) {
        container.innerHTML = 'Error loading data: ' + e.message;
    }
}
initTool();
