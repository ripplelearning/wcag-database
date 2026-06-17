(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;
    // Persistent state stored in the host page scope
    let appState = { q: '', v: '', l: '', c: '' };

    const openTool = () => {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        const options = `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`;
        
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Lookup Tool', options);
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
        doc.title = "WCAG Lookup Tool";
        doc.body.style.fontFamily = "sans-serif";
        doc.body.style.padding = "20px";
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <label for="s">Search Criteria:</label>
            <p id="s-desc" style="font-size:0.8em; color:#555;">Search by ID, name, description, failures, fixes, categories, or tags.</p>
            <input id="s" type="search" aria-describedby="s-desc" placeholder="e.g. 1.1.1, images, keyboard..." style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <label for="ver-f">Version:</label>
                <select id="ver-f"><option value="">All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <label for="lvl-f">Level:</label>
                <select id="lvl-f"><option value="">All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <label for="cat-f">Category:</label>
                <select id="cat-f"><option value="">All</option><option value="Images">Images</option><option value="Multimedia">Multimedia</option><option value="UI Components">UI Components</option></select>
                <button id="reset-btn" title="Reset (Alt+Shift+d)">Reset (Alt+Shift+d)</button>
            </div>
            <h2 id="count" aria-live="polite">Found ${data.length} results</h2>
            <div id="container"></div>
            <hr style="margin-top:40px;">
            <footer>
                <h3>How to use this tool</h3>
                <ul>
                    <li><strong>Search/Filter:</strong> Use the fields above to narrow down results.</li>
                    <li><strong>Expand:</strong> Click on any criterion button to show details.</li>
                    <li><strong>Alt+Shift+A:</strong> Re-open/restore the tool from the main page.</li>
                    <li><strong>Alt+Shift+D:</strong> Reset filters (when inside tool).</li>
                    <li><strong>Escape:</strong> Close the tool.</li>
                </ul>
            </footer>
        `;

        const sInput = doc.getElementById('s'), verF = doc.getElementById('ver-f'), 
              lvlF = doc.getElementById('lvl-f'), catF = doc.getElementById('cat-f');

        // Apply saved state
        sInput.value = appState.q; verF.value = appState.v; 
        lvlF.value = appState.l; catF.value = appState.c;

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
                        btn.setAttribute('aria-expanded', 'false');
                        btn.textContent = `${i.name} (Level ${i.level})`;
                        btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.marginTop = "5px";
                        btn.onclick = () => {
                            const exp = btn.getAttribute('aria-expanded') === 'true';
                            btn.setAttribute('aria-expanded', !exp);
                            btn.nextElementSibling.style.display = exp ? 'none' : 'block';
                        };
                        container.appendChild(btn);
                        const div = doc.createElement('div');
                        div.style.display = 'none'; div.style.padding = "10px"; div.style.border = "1px solid #ccc";
                        div.innerHTML = `<ul>
                            <li><strong>Description:</strong> ${i.desc}</li>
                            <li><strong>Failures:</strong> ${i.failures.split('|').join(', ')}</li>
                            <li><strong>Fixes:</strong> ${i.fixes.split('|').join(', ')}</li>
                            <li><a href="${i.Link}" target="_blank" aria-label="Open ${i.name} official W3C documentation (opens in new tab)">Open ${i.name} official W3C documentation</a></li>
                        </ul>`;
                        container.appendChild(div);
                    });
                }
            });
            doc.getElementById('count').textContent = `Found ${list.length} results`;
        };

        const filterData = () => {
            appState = { q: sInput.value, v: verF.value, l: lvlF.value, c: catF.value };
            const filtered = data.filter(i => 
                (i.name.toLowerCase().includes(appState.q.toLowerCase()) || i.desc.toLowerCase().includes(appState.q.toLowerCase()) || i.failures.toLowerCase().includes(appState.q.toLowerCase()) || i.fixes.toLowerCase().includes(appState.q.toLowerCase()) || i.disabilitie.toLowerCase().includes(appState.q.toLowerCase()) || i.categories.toLowerCase().includes(appState.q.toLowerCase()) || i.tags.toLowerCase().includes(appState.q.toLowerCase())) &&
                (appState.v === "" || i.ver == appState.v) && (appState.l === "" || i.level === appState.l) && (appState.c === "" || i.categories.includes(appState.c))
            );
            render(filtered);
        };

        const resetAll = () => {
            appState = { q: '', v: '', l: '', c: '' };
            sInput.value = verF.value = lvlF.value = catF.value = '';
            render(data);
            sInput.focus();
        };

        sInput.oninput = verF.onchange = lvlF.onchange = catF.onchange = filterData;
        doc.getElementById('reset-btn').onclick = resetAll;

        // LOCAL Listeners inside the popup
        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') popup.close();
            if (e.altKey && e.shiftKey && e.key === 'D') resetAll();
        });

        filterData();
        sInput.focus();
    }

    // GLOBAL Listener on main page
    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey && e.key === 'A') openTool();
    });

    openTool();
})();
