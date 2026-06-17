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
            // Immediately inject the structure so it's never "About Blank"
            popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><h1>Loading...</h1></body></html>');
            popup.document.close();
            
            fetch(dataUrl)
                .then(r => r.text())
                .then(jsText => setupPopup(JSON.parse(jsText)));
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
            <div id="sr-announcer" aria-live="polite" style="position:absolute; left:-9999px;"></div>
            <label for="s">Search Criteria:</label>
            <input id="s" type="search" placeholder="e.g. 1.1.1, images, keyboard..." style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <label for="ver-f">Version:</label>
                <select id="ver-f"><option value="">All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <label for="lvl-f">Level:</label>
                <select id="lvl-f"><option value="">All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <label for="cat-f">Category:</label>
                <select id="cat-f"><option value="">All</option><option value="Images">Images</option><option value="Multimedia">Multimedia</option><option value="UI Components">UI Components</option></select>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite">Found ${data.length} results</h2>
            <div id="container"></div>
            <hr style="margin-top:40px;">
            <footer>
                <h3>How to use this tool</h3>
                <ul>
                    <li><strong>Search:</strong> Type to filter criteria.</li>
                    <li><strong>Expand:</strong> Click button to view details.</li>
                    <li><strong>Alt+Shift+A:</strong> Restore tool.</li>
                    <li><strong>Alt+Shift+D:</strong> Reset filters (in tool).</li>
                    <li><strong>Escape:</strong> Close the tool.</li>
                </ul>
            </footer>
        `;

        // Logic continues... (Same as before)
        const sInput = doc.getElementById('s'), verF = doc.getElementById('ver-f'), 
              lvlF = doc.getElementById('lvl-f'), catF = doc.getElementById('cat-f');

        sInput.value = appState.q; verF.value = appState.v; 
        lvlF.value = appState.l; catF.value = appState.c;

        popup.handleCopy = (btn, text) => {
            navigator.clipboard.writeText(text).then(() => {
                const original = btn.textContent;
                btn.textContent = "Copied...";
                doc.getElementById('sr-announcer').textContent = "Copied to clipboard";
                setTimeout(() => { btn.textContent = original; doc.getElementById('sr-announcer').textContent = ""; }, 2000);
            });
        };

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            ['2.2', '2.1'].forEach(version => {
                const section = list.filter(i => i.ver == version);
                if (section.length > 0) {
                    const h3 = doc.createElement('h3');
                    h3.textContent = `WCAG ${version} Success Criteria`;
                    container.appendChild(h3);
                    section.forEach(i => {
                        const btn = doc.createElement('button');
                        btn.textContent = `${i.name} (Level ${i.level})`;
                        btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.marginTop = "5px";
                        btn.onclick = () => {
                            const c = btn.nextElementSibling;
                            c.style.display = c.style.display === 'block' ? 'none' : 'block';
                        };
                        container.appendChild(btn);
                        const div = doc.createElement('div');
                        div.style.display = 'none'; div.style.padding = "10px"; div.style.border = "1px solid #ccc";
                        div.innerHTML = `<ul>
                            <li><strong>Description:</strong> ${i.desc}</li>
                            <li><strong>Failures:</strong> ${(i.failures||"").split('|').join(', ')}</li>
                            <li><strong>Fixes:</strong> ${(i.fixes||"").split('|').join(', ')}</li>
                            <li><a href="${i.Link}" target="_blank" aria-label="Open ${i.name} (opens in new tab)">Official Documentation</a></li>
                        </ul>
                        <div style="margin-top:10px;">
                            <button onclick="handleCopy(this, '${i.name}')">Copy Name</button>
                            <button onclick="handleCopy(this, '${i.desc}')">Copy Description</button>
                            <button onclick="handleCopy(this, '${i.failures}')">Copy Failures</button>
                            <button onclick="handleCopy(this, '${i.fixes}')">Copy Fixes</button>
                            <button onclick="handleCopy(this, '${i.Link}')">Copy Link</button>
                        </div>`;
                        container.appendChild(div);
                    });
                }
            });
            doc.getElementById('count').textContent = `Found ${list.length} results`;
        };

        const filterData = () => {
            appState = { q: sInput.value, v: verF.value, l: lvlF.value, c: catF.value };
            const q = appState.q.toLowerCase();
            const filtered = data.filter(i => 
                (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || (i.failures||"").toLowerCase().includes(q) || (i.fixes||"").toLowerCase().includes(q)) &&
                (appState.v === "" || i.ver == appState.v) && (appState.l === "" || i.level === appState.l) && (appState.c === "" || (i.categories||"").includes(appState.c))
            );
            render(filtered);
        };

        sInput.oninput = verF.onchange = lvlF.onchange = catF.onchange = filterData;
        doc.getElementById('reset-btn').onclick = () => { appState = { q: '', v: '', l: '', c: '' }; sInput.value = verF.value = lvlF.value = catF.value = ''; render(data); };
        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') popup.close();
            if (e.altKey && e.shiftKey && e.key === 'D') doc.getElementById('reset-btn').click();
        });

        render(data);
        sInput.focus();
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
