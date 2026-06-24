(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup = null;
    let appState = { q: '', v: '', l: '', c: '', expandedPanels: [] };

    const categoryMap = {
        "ARIA & Live Regions": "ARIA|Live",
        "Audio & Video": "Multimedia|Audio|Video|Captions|Transcripts",
        "Buttons & Navigation": "Navigation|Link|Skip|Bypass|Button",
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
            popup.document.body.style.display = "block";
            popup.focus();
            popup.document.getElementById('s').focus();
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
            <input id="s" type="search" placeholder="Search..." style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <select id="ver-f"><option value="">All Versions</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <select id="lvl-f"><option value="">All Levels</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <select id="cat-f"><option value="">All Categories</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <div id="container"></div>
        `;

        const container = doc.getElementById('container');
        // Pre-build the entire list so expansion state is never lost during filtering
        data.forEach(i => {
            const wrapper = doc.createElement('div');
            wrapper.className = "item-wrapper";
            wrapper.dataset.name = i.name;
            wrapper.dataset.ver = i.ver;
            wrapper.dataset.lvl = i.level;
            wrapper.dataset.cat = (i.categories + "|" + i.tags);
            wrapper.dataset.search = (i.name + i.desc + i.failures + i.fixes).toLowerCase();
            
            wrapper.innerHTML = `<h3>WCAG ${i.ver} Success Criteria</h3><button class="btn">${i.name}</button><div class="details" style="display:none;">${i.desc}</div>`;
            wrapper.querySelector('button').onclick = (e) => {
                const det = e.target.nextElementSibling;
                det.style.display = det.style.display === 'none' ? 'block' : 'none';
            };
            container.appendChild(wrapper);
        });

        const filter = () => {
            const q = doc.getElementById('s').value.toLowerCase();
            const v = doc.getElementById('ver-f').value;
            const l = doc.getElementById('lvl-f').value;
            const c = doc.getElementById('cat-f').value;
            
            doc.querySelectorAll('.item-wrapper').forEach(el => {
                const match = (el.dataset.search.includes(q)) && (v === "" || el.dataset.ver == v) && (l === "" || el.dataset.lvl === l) && (c === "" || el.dataset.cat.includes(categoryMap[c].split('|')[0]));
                el.style.display = match ? 'block' : 'none';
            });
        };

        doc.getElementById('s').oninput = filter;
        ['ver-f', 'lvl-f', 'cat-f'].forEach(id => doc.getElementById(id).onchange = filter);
        
        doc.getElementById('reset-btn').onclick = () => {
            ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => doc.getElementById(id).value = '');
            doc.querySelectorAll('.item-wrapper').forEach(el => el.style.display = 'block');
            doc.getElementById('s').focus();
        };

        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                doc.body.style.display = "none";
                popup.resizeTo(0, 0);
                popup.moveTo(window.screen.availWidth, window.screen.availHeight);
            }
            if (e.altKey && e.shiftKey && e.key === 'D') doc.getElementById('reset-btn').click();
        });

        doc.getElementById('s').focus();
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
