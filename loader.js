(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;
    // Track search, filters, and specific criteria panels that are expanded
    let appState = { q: '', v: '', l: '', c: '', expandedPanels: [] };

    const categoryMap = {
        "ARIA & Live Regions": "ARIA|Live",
        "Audio & Video": "Multimedia|Audio|Video|Captions|Transcripts",
        "Buttons & Navigation": "Navigation|Link|Skip|Bypass",
        "Color & Contrast": "Color|Contrast",
        "Focus & Keyboard": "Keyboard|Focus|Tabindex|Modal",
        "Forms & Inputs": "Forms|Input|Autocomplete|Authentication",
        "Images & Graphics": "Images|Graphic|Icons|Charts",
        "Interactions": "Interactions|Pointer|Dragging|Input Modalities",
        "Language & Text": "Text|Language|Jargon|Acronym|Pronunciation",
        "Layout & Structure": "Layout|Structure|Semantics|Reading Order|Reflow|CSS",
        "Mobile & Touch": "Mobile|Orientation|Tap Targets",
        "Motion & Animation": "Animation|Reduced Motion|Seizure|Flash",
        "Notifications & Errors": "Error|Notifications|Alert|Status",
        "Time & Timeouts": "Timeouts|Refresh|Expiration",
        "Tooltips & Overlays": "Tooltips|Overlays|Popups|Dialog"
    };

    const openTool = () => {
        const w = Math.round(window.screen.availWidth * 0.5);
        const h = Math.round(window.screen.availHeight * 0.5);
        
        if (popup && !popup.closed) {
            popup.resizeTo(w, h);
            popup.moveTo((window.screen.availWidth - w) / 2, (window.screen.availHeight - h) / 2);
            popup.focus();
            if (popup.document.getElementById('s')) {
                popup.document.getElementById('s').dispatchEvent(new Event('input'));
            }
            return;
        }

        popup = window.open('', 'WCAG Lookup Tool', `width=${w},height=${h},scrollbars=yes,resizable=yes`);
        popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><div id="root"><h1>Loading WCAG Data...</h1></div></body></html>');
        popup.document.close();
            
        fetch(dataUrl).then(r => r.text()).then(jsText => {
            (0, eval)(jsText);
            setupPopup(window.wcagData);
        });
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.style.cssText = "font-family:sans-serif; padding:20px;";
        doc.getElementById('root').innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <input id="s" type="search" placeholder="Search criteria..." style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <select id="ver-f"><option value="">All Versions</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <select id="lvl-f"><option value="">All Levels</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <select id="cat-f"><option value="">All Categories</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count"></h2>
            <ul id="container" style="list-style-type:none; padding:0;"></ul>
        `;

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            doc.getElementById('count').textContent = `Found ${list.length} results`;

            list.forEach((i) => {
                const li = doc.createElement('li');
                const btn = doc.createElement('button');
                btn.textContent = `${i.name} (Level ${i.level})`;
                btn.style.cssText = "width:100%; text-align:left; margin-top:10px;";
                
                const details = doc.createElement('div');
                details.style.cssText = `display:${appState.expandedPanels.includes(i.name) ? 'block' : 'none'}; padding:10px; border:1px solid #ccc;`;
                details.innerHTML = `<strong>Description:</strong> ${i.desc}<br><br><a href="${i.Link}" target="_blank">View W3C Docs</a>`;
                
                btn.onclick = () => {
                    const isOpen = details.style.display === 'block';
                    details.style.display = isOpen ? 'none' : 'block';
                    if (!isOpen) {
                        if (!appState.expandedPanels.includes(i.name)) appState.expandedPanels.push(i.name);
                    } else {
                        appState.expandedPanels = appState.expandedPanels.filter(name => name !== i.name);
                    }
                };
                li.append(btn, details);
                container.append(li);
            });
        };

        const filter = () => {
            appState.q = doc.getElementById('s').value.toLowerCase();
            appState.v = doc.getElementById('ver-f').value;
            appState.l = doc.getElementById('lvl-f').value;
            appState.c = doc.getElementById('cat-f').value;
            
            const mapEntry = categoryMap[appState.c] || "";
            const filtered = data.filter(i => 
                (i.name.toLowerCase().includes(appState.q) || i.desc.toLowerCase().includes(appState.q)) &&
                (appState.v === "" || i.ver == appState.v) && 
                (appState.l === "" || i.level === appState.l) && 
                (appState.c === "" || (i.categories + "|" + i.tags).includes(mapEntry.split('|')[0]))
            );
            render(filtered);
        };

        ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => doc.getElementById(id).onchange = filter);
        doc.getElementById('s').oninput = filter;
        doc.getElementById('reset-btn').onclick = () => { 
            appState = { q: '', v: '', l: '', c: '', expandedPanels: [] };
            doc.getElementById('s').value = '';
            doc.getElementById('ver-f').value = '';
            doc.getElementById('lvl-f').value = '';
            doc.getElementById('cat-f').value = '';
            render(data);
        };

        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                popup.resizeTo(0, 0);
                popup.moveTo(window.screen.availWidth, window.screen.availHeight);
                popup.blur();
            }
            if (e.altKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                doc.getElementById('reset-btn').click();
            }
        });

        render(data);
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
})();
