(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;
    let appState = { q: '', v: '', l: '', c: '' };

    const openTool = () => {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        const options = `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`;
        
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Lookup Tool', options);
            popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><h1>Loading WCAG Data...</h1></body></html>');
            popup.document.close();
            
            fetch(dataUrl).then(r => r.text()).then(jsText => {
                try {
                    (0, eval)(jsText);
                    setupPopup(window.wcagData);
                } catch (e) {
                    popup.document.body.innerHTML = `<h1>Data Error</h1><p>Check console: ${e.message}</p>`;
                }
            });
        } else {
            popup.focus();
        }
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.style.fontFamily = "sans-serif";
        doc.body.style.padding = "20px";

        const catSet = new Set();
        data.forEach(item => {
            const combined = [...(item.categories || "").split('|'), ...(item.tags || "").split('|')];
            combined.forEach(val => { if (val.trim()) catSet.add(val.trim()); });
        });
        const sortedOptions = Array.from(catSet).sort((a, b) => a.localeCompare(b));

        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <div id="sr-announcer" aria-live="polite" style="position:absolute; left:-9999px;"></div>
            <label for="s">Search Criteria:</label><br>
            <input id="s" type="search" placeholder="e.g. 1.1.1, images, keyboard..." style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <label>Version: <select id="ver-f"><option value="">All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select></label>
                <label>Level: <select id="lvl-f"><option value="">All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select></label>
                <label>Cat/Tag: <select id="cat-f"><option value="">All</option>${sortedOptions.map(o => `<option value="${o}">${o}</option>`).join('')}</select></label>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite"></h2>
            <div id="container"></div>
            <hr style="margin-top:40px;">
            <footer><h3>How to use:</h3><ul><li><strong>Alt+Shift+A:</strong> Restore tool</li><li><strong>Alt+Shift+D:</strong> Reset filters</li><li><strong>Escape:</strong> Close tool</li></ul></footer>
        `;

        popup.handleCopy = (btn, text) => {
            navigator.clipboard.writeText(text).then(() => {
                const original = btn.textContent;
                btn.textContent = "Copied...";
                doc.getElementById('sr-announcer').textContent = "Copied to clipboard";
                setTimeout(() => { btn.textContent = original; }, 2000);
            });
        };

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            doc.getElementById('count').textContent = `Found ${list.length} results`;
            
            ['2.2', '2.1'].forEach((ver, vIdx) => {
                const section = list.filter(i => i.ver.toString() === ver);
                if (section.length === 0) return;

                const h3 = doc.createElement('h3');
                h3.textContent = `WCAG ${ver} Success Criteria`;
                container.appendChild(h3);

                section.forEach((i, idx) => {
                    const id = `row-${vIdx}-${idx}`;
                    const btn = doc.createElement('button');
                    btn.textContent = `${i.name} (Level ${i.level})`;
                    btn.setAttribute('aria-expanded', 'false');
                    btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.marginTop = "5px";
                    btn.onclick = () => {
                        const el = doc.getElementById(id);
                        const isExp = el.style.display === 'block';
                        el.style.display = isExp ? 'none' : 'block';
                        btn.setAttribute('aria-expanded', !isExp);
                    };
                    container.appendChild(btn);

                    const div = doc.createElement('div');
                    div.id = id; div.style.display = 'none'; div.style.padding = "10px"; div.style.border = "1px solid #ccc";
                    div.innerHTML = `
                        <p><strong>Description:</strong> ${i.desc}</p>
                        <p><strong>Failures:</strong></p><ul style="list-style-type:none; padding-left:0;">${(i.failures||"").split('|').map(f => `<li>${f}</li>`).join('')}</ul>
                        <p><strong>Fixes:</strong></p><ul style="list-style-type:none; padding-left:0;">${(i.fixes||"").split('|').map(f => `<li>${f}</li>`).join('')}</ul>
                        <p><strong>Disabilities:</strong> ${i.disabilitie || 'N/A'}</p>
                        <p><a href="${i.Link}" target="_blank" aria-label="Open ${i.name} official W3C documentation (opens in new tab)">Open ${i.name} official W3C documentation</a></p>
                        <div style="margin-top:10px;">
                            <button onclick="handleCopy(this, '${i.name}')">Copy Name</button>
                            <button onclick="handleCopy(this, '${i.desc}')">Copy Description</button>
                            <button onclick="handleCopy(this, '${i.failures}')">Copy Failures</button>
                            <button onclick="handleCopy(this, '${i.fixes}')">Copy Fixes</button>
                            <button onclick="handleCopy(this, '${i.Link}')">Copy Link</button>
                        </div>
                    `;
                    container.appendChild(div);
                });
            });
        };

        const filter = () => {
            appState = { q: doc.getElementById('s').value.toLowerCase(), v: doc.getElementById('ver-f').value, l: doc.getElementById('lvl-f').value, c: doc.getElementById('cat-f').value };
            const filtered = data.filter(i => {
                const matchesSearch = (i.name.toLowerCase().includes(appState.q) || i.desc.toLowerCase().includes(appState.q) || (i.failures||"").toLowerCase().includes(appState.q) || (i.fixes||"").toLowerCase().includes(appState.q));
                const matchesVersion = (appState.v === "" || i.ver.toString() === appState.v);
                const matchesLevel = (appState.l === "" || i.level === appState.l);
                const matchesCatTag = (appState.c === "" || (i.categories + "|" + i.tags).includes(appState.c));
                return matchesSearch && matchesVersion && matchesLevel && matchesCatTag;
            });
            render(filtered);
        };

        doc.getElementById('s').value = appState.q; doc.getElementById('ver-f').value = appState.v;
        doc.getElementById('lvl-f').value = appState.l; doc.getElementById('cat-f').value = appState.c;
        doc.getElementById('s').oninput = doc.getElementById('ver-f').onchange = doc.getElementById('lvl-f').onchange = doc.getElementById('cat-f').onchange = filter;
        doc.getElementById('reset-btn').onclick = () => { appState = { q: '', v: '', l: '', c: '' }; doc.getElementById('s').value = doc.getElementById('ver-f').value = doc.getElementById('lvl-f').value = doc.getElementById('cat-f').value = ''; render(data); doc.getElementById('s').focus(); };
        doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') popup.close(); if (e.altKey && e.shiftKey && e.key === 'D') doc.getElementById('reset-btn').click(); });
        
        render(data);
        doc.getElementById('s').focus();
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
