(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;
    let appState = { q: '', v: '', l: '', c: '' };

    // Enhanced category and tag mapping for deep filtering
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
            <hr style="margin-top: 40px;">
            <details>
                <summary style="font-size: 1.2em; font-weight: bold; cursor: pointer; padding: 10px 0;">How to use this tool</summary>
                <p style="padding-left: 20px;">Use the search box and filters above to find WCAG success criteria. Click on any criterion title to expand its details, including descriptions, failures, and remediation fixes.</p>
            </details>
        `;

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            doc.getElementById('count').textContent = `Found ${list.length} results`;
            doc.getElementById('sr-announcer').textContent = `Found ${list.length} results`;

            ['2.2', '2.1'].forEach((ver) => {
                const section = list.filter(i => i.ver == ver);
                if (section.length === 0) return;
                const h3 = doc.createElement('h3');
                h3.textContent = `WCAG ${ver} Success Criteria`;
                container.appendChild(h3);
                const ul = doc.createElement('ul');
                ul.style.listStyleType = "none"; ul.style.padding = "0";

                section.forEach((i, idx) => {
                    const li = doc.createElement('li');
                    const btn = doc.createElement('button');
                    const details = doc.createElement('div');
                    
                    btn.textContent = `${i.name} (Level ${i.level})`;
                    btn.style.cssText = "width:100%; text-align:left; margin-top:5px;";
                    btn.setAttribute('aria-expanded', 'false');
                    
                    details.style.display = 'none';
                    details.innerHTML = `<p><strong>Description:</strong> ${i.desc}</p><p><strong>Failures:</strong> ${i.failures}</p><p><strong>Fixes:</strong> ${i.fixes}</p>`;
                    
                    btn.onclick = () => {
                        const isExp = details.style.display === 'block';
                        details.style.display = isExp ? 'none' : 'block';
                        btn.setAttribute('aria-expanded', !isExp);
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
                (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || (i.tags||"").toLowerCase().includes(q) || (i.categories||"").toLowerCase().includes(q)) &&
                (v === "" || i.ver == v) && 
                (l === "" || i.level === l) && 
                (c === "" || (i.categories + "|" + i.tags).toLowerCase().includes(mapFilter.split('|')[0].toLowerCase()))
            );
            render(filtered);
        };

        ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => doc.getElementById(id).onchange = filter);
        doc.getElementById('s').oninput = filter;
        
        doc.getElementById('reset-btn').onclick = () => { 
            ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => doc.getElementById(id).value = '');
            render(data); 
            doc.getElementById('s').focus();
        };

        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') popup.close();
            if (e.altKey && e.shiftKey && e.key === 'D') doc.getElementById('reset-btn').click();
        });

        render(data);
        doc.getElementById('s').focus();
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
