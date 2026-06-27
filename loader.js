(function() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
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

    async function openTool() {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.6;
        popup = window.open('', 'WCAG Lookup Tool', `width=${w},height=${h},scrollbars=yes,resizable=yes`);
        popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><div id="root"><h1>Loading...</h1></div></body></html>');
        popup.document.close();
        
        try {
            const response = await fetch(dataUrl);
            const data = await response.json();
            setupPopup(data);
        } catch (e) {
            popup.document.getElementById('root').innerHTML = '<h1>Error</h1><p>Check console for JSON issues.</p>';
        }
    }

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.style.cssText = "font-family:sans-serif; padding:20px;";
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <div id="sr-announcer" aria-live="assertive" style="position:absolute; left:-9999px;"></div>
            <label for="s">Search Criteria:</label><br>
            <input id="s" type="search" style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <select id="ver-f"><option value="">Version: All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <select id="lvl-f"><option value="">Level: All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <select id="cat-f"><option value="">Category: All</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count"></h2>
            <div id="container"></div>
            <footer><details><summary>How to use this tool</summary><p>Alt+Shift+A: Open | Alt+Shift+D: Reset | Escape: Close</p></details></footer>
        `;

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            doc.getElementById('count').textContent = `Found ${list.length} results`;
            
            ['2.2', '2.1'].forEach(ver => {
                const section = list.filter(i => i.ver == ver);
                if (!section.length) return;
                container.appendChild(doc.createElement('h3')).textContent = `WCAG ${ver}`;
                const ul = container.appendChild(doc.createElement('ul'));
                
                section.forEach(i => {
                    const li = ul.appendChild(doc.createElement('li'));
                    const btn = li.appendChild(doc.createElement('button'));
                    btn.textContent = `${i.name} (${i.level})`;
                    btn.setAttribute('aria-expanded', 'false');
                    const details = li.appendChild(doc.createElement('div'));
                    details.style.display = 'none';
                    details.innerHTML = `<p><strong>Desc:</strong> ${i.desc}</p><p><strong>Failures:</strong> ${i.failures}</p><p><strong>Fixes:</strong> ${i.fixes}</p><button class="copy-btn" data-text="${i.name}">Copy Name</button>`;
                    
                    btn.onclick = () => {
                        const isExp = details.style.display === 'block';
                        details.style.display = isExp ? 'none' : 'block';
                        btn.setAttribute('aria-expanded', !isExp);
                    };
                });
            });
        };

        const filter = () => {
            const q = doc.getElementById('s').value.toLowerCase();
            const v = doc.getElementById('ver-f').value;
            const l = doc.getElementById('lvl-f').value;
            const c = doc.getElementById('cat-f').value;
            render(data.filter(i => (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)) && (v === "" || i.ver == v) && (l === "" || i.level === l)));
        };

        ['s', 'ver-f', 'lvl-f', 'cat-f'].forEach(id => doc.getElementById(id).onchange = filter);
        doc.getElementById('reset-btn').onclick = () => { location.reload(); };
        doc.addEventListener('keydown', (e) => { if(e.key === 'Escape') popup.close(); });
        render(data);
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
