(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;
    let appState = { q: '', v: '', l: '', c: '' };

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
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        const options = `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`;
        
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Lookup Tool', options);
            popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><div id="root"><h1>Loading WCAG Data...</h1></div></body></html>');
            popup.document.close();
            
            fetch(dataUrl).then(r => r.text()).then(jsText => {
                (0, eval)(jsText);
                setupPopup(window.wcagData);
            });
        } else {
            popup.focus();
        }
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.style.fontFamily = "sans-serif";
        doc.body.style.padding = "20px";
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <div id="sr-announcer" aria-live="assertive" style="position:absolute; left:-9999px;"></div>
            <label for="s">Search Criteria:</label><br>
            <input id="s" type="search" autocomplete="off" aria-controls="count" placeholder="e.g. 1.1.1, images, keyboard..." style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <label>Version: <select id="ver-f"><option value="">All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select></label>
                <label>Level: <select id="lvl-f"><option value="">All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select></label>
                <label>Category: 
                    <select id="cat-f">
                        <option value="">All</option>
                        ${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </label>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite"></h2>
            <ul id="container" style="list-style-type:none; padding:0;"></ul>
            <hr style="margin-top:40px;">
            <details>
                <summary><h3>How to use this tool</h3></summary>
                <ul>
                    <li><strong>Alt+Shift+A:</strong> Restore tool</li>
                    <li><strong>Alt+Shift+D:</strong> Reset filters</li>
                    <li><strong>Escape:</strong> Close tool</li>
                </ul>
            </details>
        `;

        doc.addEventListener('click', (e) => {
            const btn = e.target.closest('.copy-trigger');
            if (!btn) return;
            const rawText = btn.getAttribute('data-clipboard-text');
            const formattedText = rawText.replace(/\|/g, '\r');
            const originalText = btn.textContent;
            popup.focus();

            const finishCopy = (success) => {
                if (success) {
                    btn.textContent = "Copied...";
                    btn.setAttribute('aria-label', 'Copied to clipboard');
                    doc.getElementById('sr-announcer').textContent = "Copied to clipboard";
                } else {
                    btn.textContent = "Error!";
                }
                btn.disabled = true;
                setTimeout(() => { 
                    btn.textContent = originalText; 
                    btn.removeAttribute('aria-label');
                    btn.disabled = false;
                }, 2000);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(formattedText)
                    .then(() => finishCopy(true))
                    .catch(() => fallbackCopy(formattedText, finishCopy));
            } else {
                fallbackCopy(formattedText, finishCopy);
            }
        });

        function fallbackCopy(text, callback) {
            const textArea = doc.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            doc.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = doc.execCommand('copy');
            doc.body.removeChild(textArea);
            callback(success);
        }

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

                section.forEach((i, idx) => {
                    const li = doc.createElement('li');
                    const btn = doc.createElement('button');
                    btn.textContent = `${i.name} (Level ${i.level})`;
                    btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.marginTop = "10px";
                    
                    const details = doc.createElement('ul');
                    details.style.display = 'none'; details.style.padding = "10px"; details.style.border = "1px solid #ccc"; details.style.listStyleType = "none";
                    
                    btn.onclick = () => {
                        const isExp = details.style.display === 'block';
                        details.style.display = isExp ? 'none' : 'block';
                    };
                    
                    const fullEntry = `Name: ${i.name}\r\n\rDescription: ${i.desc}\r\n\rFailures:\n${(i.failures||"").replace(/\|/g, '\r')}\r\n\rFixes:\n${(i.fixes||"").replace(/\|/g, '\r')}\r\n\rLink: ${i.Link}`;
                    const disabilitiesList = (i.disabilitie || 'N/A').replace(/\|/g, ', ');

                    details.innerHTML = `
                        <li style="margin-top: 15px; padding-bottom: 10px;"><strong>Description:</strong> ${i.desc}</li>
                        <li><strong>Failures:</strong></li>${(i.failures||"").split('|').map(f => `<li>${f}</li>`).join('')}
                        <li style="margin-top: 10px;"><strong>Fixes:</strong></li>${(i.fixes||"").split('|').map(f => `<li>${f}</li>`).join('')}
                        <li style="margin-top: 10px;"><strong>Disabilities:</strong> ${disabilitiesList}</li>
                        <li style="margin-top: 10px;"><a href="${i.Link}" target="_blank">Open W3C Documentation</a></li>
                        <li style="margin-top: 10px;"><strong>Copy Actions:</strong></li>
                        <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${fullEntry.replace(/"/g, '&quot;')}" style="font-weight:bold;">Copy Full Entry</button></li>
                        <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${(i.name||"").replace(/"/g, '&quot;')}">Copy Name</button></li>
                        <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${(i.desc||"").replace(/"/g, '&quot;')}">Copy Description</button></li>
                        <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${(i.failures||"").replace(/\|/g, '\r').replace(/"/g, '&quot;')}">Copy Failures</button></li>
                        <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${(i.fixes||"").replace(/\|/g, '\r').replace(/"/g, '&quot;')}">Copy Fixes</button></li>
                        <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${(i.Link||"").replace(/"/g, '&quot;')}">Copy Link</button></li>
                    `;
                    li.appendChild(btn);
                    li.appendChild(details);
                    container.appendChild(li);
                });
            });
        };

        const filter = () => {
            appState = { q: doc.getElementById('s').value, v: doc.getElementById('ver-f').value, l: doc.getElementById('lvl-f').value, c: doc.getElementById('cat-f').value };
            const q = appState.q.toLowerCase();
            const mapEntry = categoryMap[appState.c] || "";
            const filtered = data.filter(i => 
                (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || (i.failures||"").toLowerCase().includes(q) || (i.fixes||"").toLowerCase().includes(q) || (i.disabilitie||"").toLowerCase().includes(q) || (i.categories||"").toLowerCase().includes(q)) &&
                (appState.v === "" || i.ver == appState.v) && 
                (appState.l === "" || i.level === appState.l) && 
                (appState.c === "" || mapEntry.split('|').some(k => (i.categories + "|" + i.tags).includes(k)))
            );
            render(filtered);
        };

        doc.getElementById('s').value = appState.q; doc.getElementById('ver-f').value = appState.v;
        doc.getElementById('lvl-f').value = appState.l; doc.getElementById('cat-f').value = appState.c;
        doc.getElementById('s').oninput = doc.getElementById('ver-f').onchange = doc.getElementById('lvl-f').onchange = doc.getElementById('cat-f').onchange = filter;
        doc.getElementById('reset-btn').onclick = () => { appState = { q: '', v: '', l: '', c: '' }; doc.getElementById('s').value = doc.getElementById('ver-f').value = doc.getElementById('lvl-f').value = doc.getElementById('cat-f').value = ''; render(data); doc.getElementById('s').focus(); };
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
