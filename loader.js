(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;

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

    const openTool = () => {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        const options = `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`;
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Lookup Tool', options);
            popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><div id="root"><h1>Loading WCAG Data...</h1></div></body></html>');
            popup.document.close();
            fetch(dataUrl).then(r => r.text()).then(jsText => { (0, eval)(jsText); setupPopup(window.wcagData); });
        } else { popup.focus(); }
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.style.cssText = "font-family:sans-serif; padding:20px;";
        
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <div id="sr-announcer" aria-live="assertive" style="position:absolute; left:-9999px;"></div>
            <label for="s">Search Criteria (ID, name, or keywords):</label><br>
            <input id="s" type="search" style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <label>Version: <select id="ver-f"><option value="">All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select></label>
                <label>Level: <select id="lvl-f"><option value="">All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select></label>
                <label>Category: <select id="cat-f"><option value="">All</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select></label>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite"></h2>
            <div id="container"></div>
            <footer style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 10px;">
                <details>
                    <summary style="font-size: 1.2em; font-weight: bold; cursor: pointer; padding: 10px 0;">How to use this tool</summary>
                    <div style="padding-left: 20px;">
                        <p><strong>Searching & Filtering:</strong> Use the search box to find criteria by ID or keyword.</p>
                        <p><strong>Keyboard Shortcuts:</strong></p>
                        <ul>
                            <li><strong>Alt+Shift+A:</strong> Restore the tool window.</li>
                            <li><strong>Alt+Shift+D:</strong> Reset all filters.</li>
                            <li><strong>Ctrl+Up/Down:</strong> Navigate between criteria.</li>
                            <li><strong>Escape:</strong> Close the tool window.</li>
                        </ul>
                    </div>
                </details>
            </footer>`;

        doc.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-trigger')) {
                const text = e.target.getAttribute('data-clipboard-text');
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = e.target.textContent;
                    e.target.textContent = "Copied!";
                    setTimeout(() => e.target.textContent = originalText, 2000);
                });
            }
        });

        doc.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                e.preventDefault();
                const buttons = Array.from(doc.querySelectorAll('#container button[aria-expanded]'));
                const currentIndex = buttons.indexOf(doc.activeElement);
                let nextIndex = e.key === 'ArrowDown' ? (currentIndex + 1) : (currentIndex - 1 + buttons.length);
                buttons[nextIndex % buttons.length].focus();
            }
            if (e.key === 'Escape') popup.close();
            if (e.altKey && e.shiftKey && e.key === 'D') doc.getElementById('reset-btn').click();
        });

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            doc.getElementById('count').textContent = `Found ${list.length} results`;

            ['2.2', '2.1'].forEach((ver) => {
                const section = list.filter(i => i.ver == ver);
                if (section.length === 0) return;
                const h3 = doc.createElement('h3');
                h3.textContent = `WCAG ${ver} Success Criteria`;
                container.appendChild(h3);
                const ul = doc.createElement('ul');
                ul.style.listStyleType = "none"; ul.style.padding = "0";

                section.forEach((i) => {
                    const li = doc.createElement('li');
                    const btn = doc.createElement('button');
                    const details = doc.createElement('div');
                    
                    btn.textContent = `${i.name} (Level ${i.level})`;
                    btn.style.cssText = "display:block; width:100%; text-align:left; padding:10px; margin-top:5px; font-size:1em; cursor:pointer;";
                    btn.setAttribute('aria-expanded', 'false');
                    
                    details.style.display = 'none';
                    const fullEntry = `Name: ${i.name}\r\nDescription: ${i.desc}\r\nFailures:\n${i.failures}\r\nFixes:\n${i.fixes}\r\nLink: ${i.Link}`;
                    
                    details.innerHTML = `
                        <div style="padding:10px;">
                            <p><strong>Description:</strong> ${i.desc}</p>
                            <p><strong>Failures:</strong> ${i.failures}</p>
                            <p><strong>Fixes:</strong> ${i.fixes}</p>
                            <p><a href="${i.Link}" target="_blank" rel="noopener noreferrer" aria-label="View ${i.name} on W3C Website">View on W3C Website</a></p>
                            <ul style="display: flex; gap: 5px; flex-wrap: wrap; list-style-type: none; padding: 0;">
                                <li><button class="copy-trigger" data-clipboard-text="${fullEntry.replace(/"/g, '&quot;')}">Copy Full Entry</button></li>
                                <li><button class="copy-trigger" data-clipboard-text="${(i.name||"").replace(/"/g, '&quot;')}">Copy Name</button></li>
                                <li><button class="copy-trigger" data-clipboard-text="${(i.failures||"").replace(/"/g, '&quot;')}">Copy Failures</button></li>
                                <li><button class="copy-trigger" data-clipboard-text="${(i.fixes||"").replace(/"/g, '&quot;')}">Copy Fixes</button></li>
                                <li><button class="copy-trigger" data-clipboard-text="${(i.Link||"").replace(/"/g, '&quot;')}">Copy Link</button></li>
                            </ul>
                        </div>`;
                    
                    btn.onclick = () => {
                        const isExp = details.style.display === 'block';
                        doc.querySelectorAll('#container div[style*="display"]').forEach(d => d.style.display = 'none');
                        doc.querySelectorAll('#container button[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
                        if (!isExp) { details.style.display = 'block'; btn.setAttribute('aria-expanded', 'true'); }
                    };
                    li.append(btn, details);
                    ul.append(li);
                });
                container.appendChild(ul);
            });
        };

        const filter = () => {
            const q = doc.getElementById('s').value.toLowerCase();
            const v = doc.getElementById('ver-f').value;
            const l = doc.getElementById('lvl-f').value;
            const c = doc.getElementById('cat-f').value;
            const mapFilter = categoryMap[c] || "";
            const filtered = data.filter(i => 
                (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || (i.tags||"").toLowerCase().includes(q)) &&
                (v === "" || i.ver == v) && (l === "" || i.level === l) && (c === "" || (i.categories + "|" + i.tags).toLowerCase().includes(mapFilter.split('|')[0].toLowerCase()))
            );
            render(filtered);
        };

        ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => doc.getElementById(id).onchange = filter);
        doc.getElementById('s').oninput = filter;
        doc.getElementById('reset-btn').onclick = () => { ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => doc.getElementById(id).value = ''); render(data); doc.getElementById('s').focus(); };
        render(data);
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
