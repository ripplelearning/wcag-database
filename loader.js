(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;

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
            popup.document.getElementById('s').focus();
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
        `;

        const sInput = doc.getElementById('s');
        const verF = doc.getElementById('ver-f');
        const lvlF = doc.getElementById('lvl-f');
        const catF = doc.getElementById('cat-f');

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            list.forEach(i => {
                const btn = doc.createElement('button');
                btn.setAttribute('aria-expanded', 'false');
                btn.textContent = `${i.name} (Level ${i.level})`;
                btn.style.width = "100%";
                btn.style.textAlign = "left";
                btn.style.marginTop = "5px";
                btn.onclick = () => {
                    const expanded = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', !expanded);
                    const c = btn.nextElementSibling;
                    c.style.display = expanded ? 'none' : 'block';
                };
                container.appendChild(btn);
                
                const div = doc.createElement('div');
                div.className = 'content';
                div.style.display = 'none';
                div.style.padding = "10px";
                div.style.border = "1px solid #ccc";
                div.innerHTML = `<ul>
                    <li><strong>Description:</strong> ${i.desc}</li>
                    <li><strong>Failures:</strong> ${i.failures.split('|').join(', ')}</li>
                    <li><strong>Fixes:</strong> ${i.fixes.split('|').join(', ')}</li>
                    <li><strong>Link:</strong> <a href="${i.Link}" target="_blank">W3C Page</a></li>
                </ul>`;
                container.appendChild(div);
            });
            doc.getElementById('count').textContent = `Found ${list.length} results`;
        };

        const filterData = () => {
            const q = sInput.value.toLowerCase();
            const v = verF.value;
            const l = lvlF.value;
            const c = catF.value;

            const filtered = data.filter(i => {
                const matchSearch = (i.name||"").toLowerCase().includes(q) || (i.desc||"").toLowerCase().includes(q) || (i.failures||"").toLowerCase().includes(q) || (i.fixes||"").toLowerCase().includes(q) || (i.disabilitie||"").toLowerCase().includes(q) || (i.categories||"").toLowerCase().includes(q) || (i.tags||"").toLowerCase().includes(q);
                const matchVer = v === "" || i.ver == v;
                const matchLvl = l === "" || i.level === l;
                const matchCat = c === "" || (i.categories||"").includes(c);
                return matchSearch && matchVer && matchLvl && matchCat;
            });
            render(filtered);
        };

        sInput.oninput = filterData;
        verF.onchange = filterData;
        lvlF.onchange = filterData;
        catF.onchange = filterData;
        
        doc.getElementById('reset-btn').onclick = () => { 
            sInput.value = ''; verF.value = ''; lvlF.value = ''; catF.value = ''; render(data); sInput.focus(); 
        };

        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') popup.close();
            if (e.altKey && e.shiftKey && e.key === 'd') { sInput.value = ''; verF.value = ''; lvlF.value = ''; catF.value = ''; render(data); sInput.focus(); }
        });
        
        render(data);
        sInput.focus();
    }

    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey && e.key === 'A') openTool();
    });

    openTool();
})();
