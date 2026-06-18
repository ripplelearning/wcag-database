function setupPopup(data) {
        const doc = popup.document;
        doc.body.style.fontFamily = "sans-serif";
        doc.body.style.padding = "20px";
        
        // 1. Generate unique, sorted options for the combined filter
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
        `;

        // ... [rest of the helper functions: handleCopy, etc.] ...

        const filter = () => {
            appState = { 
                q: doc.getElementById('s').value.toLowerCase(), 
                v: doc.getElementById('ver-f').value, 
                l: doc.getElementById('lvl-f').value, 
                c: doc.getElementById('cat-f').value 
            };
            
            const filtered = data.filter(i => {
                const matchesSearch = (i.name.toLowerCase().includes(appState.q) || i.desc.toLowerCase().includes(appState.q));
                // Version comparison: convert data number to string to match select value
                const matchesVersion = (appState.v === "" || i.ver.toString() === appState.v);
                const matchesLevel = (appState.l === "" || i.level === appState.l);
                const matchesCatTag = (appState.c === "" || (i.categories + "|" + i.tags).includes(appState.c));
                
                return matchesSearch && matchesVersion && matchesLevel && matchesCatTag;
            });
            render(filtered);
        };

        // ... [rest of your event listeners and initialization] ...
    }
