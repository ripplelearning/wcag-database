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
            // This method works because it executes the script directly in the popup context
            fetch(dataUrl).then(r => r.text()).then(jsText => {
                // Re-enabling the eval method that we know works for your environment
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
            <div id="sr-announcer" aria-live="polite" style="position:absolute; left:-9999px;"></div>
            <label for="s">Search:</label>
            <input id="s" type="search" placeholder="Search..." style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <label for="ver-f">Version:</label>
                <select id="ver-f"><option value="">All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <label for="lvl-f">Level:</label>
                <select id="lvl-f"><option value="">All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite">Found ${data.length} results</h2>
            <div id="container"></div>
        `;

        popup.handleCopy = (btn, text) => {
            navigator.clipboard.writeText(text).then(() => {
                const orig = btn.textContent;
                btn.textContent = "Copied...";
                doc.getElementById('sr-announcer').textContent = "Copied!";
                setTimeout(() => { btn.textContent = orig; }, 2000);
            });
        };

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            ['2.2', '2.1'].forEach(version => {
                const section = list.filter(i => i.ver == version);
                if (section.length > 0) {
                    container.innerHTML += `<h3>WCAG ${version} Success Criteria</h3>`;
                    section.forEach(i => {
                        const btn = doc.createElement('button');
                        btn.textContent = `${i.name} (Level ${i.level})`;
                        btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.marginTop = "5px";
                        btn.onclick = (e) => {
                            const next = e.target.nextElementSibling;
                            next.style.display = next.style.display === 'block' ? 'none' : 'block';
                        };
                        container.appendChild(btn);
                        const div = doc.createElement('div');
                        div.style.display = 'none'; div.style.padding = "10px"; div.style.border = "1px solid #ccc";
                        div.innerHTML = `<p><strong>Desc:</strong> ${i.desc}</p>
                            <button onclick="handleCopy(this, '${i.name}')">Copy Name</button>
                            <button onclick="handleCopy(this, '${i.desc}')">Copy Desc</button>
                            <button onclick="handleCopy(this, '${i.failures}')">Copy Failures</button>
                            <button onclick="handleCopy(this, '${i.fixes}')">Copy Fixes</button>
                            <button onclick="handleCopy(this, '${i.Link}')">Copy Link</button>`;
                        container.appendChild(div);
                    });
                }
            });
        };

        const s = doc.getElementById('s'), vF = doc.getElementById('ver-f'), lF = doc.getElementById('lvl-f');
        s.value = appState.q; vF.value = appState.v; lF.value = appState.l;

        const filter = () => {
            appState = { q: s.value, v: vF.value, l: lF.value };
            render(data.filter(i => 
                (i.name.toLowerCase().includes(appState.q.toLowerCase())) &&
                (appState.v === "" || i.ver == appState.v) && 
                (appState.l === "" || i.level === appState.l)
            ));
        };

        s.oninput = vF.onchange = lF.onchange = filter;
        doc.getElementById('reset-btn').onclick = () => { appState = { q: '', v: '', l: '' }; s.value = vF.value = lF.value = ''; render(data); };
        doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') popup.close(); if (e.altKey && e.shiftKey && e.key === 'D') doc.getElementById('reset-btn').click(); });
        render(data);
    };

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
