(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let lastFocusedElement;

    // Listen for Alt+Shift+A to restore/toggle
    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey && e.key === 'A') {
            const f = document.getElementById('wcag-iframe');
            if (f) {
                f.style.display = f.style.display === 'none' ? 'block' : 'none';
                if (f.style.display === 'block') f.contentWindow.document.getElementById('s').focus();
            }
        }
    });

    fetch(dataUrl)
        .then(r => r.text())
        .then(jsText => {
            (0, eval)(jsText);
            if(window.wcagData) createIframeUI(window.wcagData);
        });

    function createIframeUI(data) {
        const frame = document.createElement('iframe');
        frame.id = 'wcag-iframe';
        frame.style.cssText = 'position:fixed; top:20px; right:20px; width:550px; height:85vh; z-index:2147483647; border:2px solid #000; border-radius:8px; background:white;';
        document.body.appendChild(frame);

        const doc = frame.contentDocument || frame.contentWindow.document;
        doc.write(`
            <style>body { font-family:sans-serif; padding:15px; } .content { display:none; padding:10px; border:1px solid #ccc; } .expanded { display:block; }</style>
            <h1>WCAG Lookup Tool</h1>
            <label for="s">Search Criteria:</label>
            <input id="s" type="search" style="width:100%; padding:8px;">
            <div id="filters" style="margin:10px 0;">
                <select id="ver"><option value="">Version</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <button id="reset-btn">Reset (Alt+Shift+r)</button>
            </div>
            <h2 id="count" aria-live="polite">Found ${data.length} results</h2>
            <div id="criteria-container"></div>
        `);
        doc.close();

        const container = doc.getElementById('criteria-container');
        const sInput = doc.getElementById('s');
        
        // Focus search on load
        sInput.focus();
        lastFocusedElement = document.activeElement;

        function render(list) {
            doc.getElementById('count').textContent = `Found ${list.length} results`;
            container.innerHTML = '';
            ['2.2', '2.1'].forEach(v => {
                const sec = list.filter(i => i.ver == v);
                if (!sec.length) return;
                container.innerHTML += `<h3>WCAG ${v} Success Criteria</h3>`;
                sec.forEach(i => {
                    const id = i.name.split(' ')[0];
                    const btn = doc.createElement('button');
                    btn.className = 'accordion-btn';
                    btn.textContent = `${id} ${i.name.replace(id+' ','')} (Level ${i.level})`;
                    const div = doc.createElement('div');
                    div.className = 'content';
                    div.innerHTML = `<ul>
                        <li><strong>Description:</strong> ${i.desc}</li>
                        <li><strong>Failures:</strong> <ul>${(i.failures||'').split('|').map(f => `<li>${f}</li>`).join('')}</ul></li>
                        <li><strong>Fixes:</strong> <ul>${(i.fixes||'').split('|').map(f => `<li>${f}</li>`).join('')}</ul></li>
                        <li><strong>Categories:</strong> ${i.categories}</li>
                        <li><a href="${i.Link}" target="_blank">Open ${i.name} on the W3C website</a></li>
                    </ul>`;
                    btn.onclick = () => { /* Logic for expansion */ };
                    container.appendChild(btn); container.appendChild(div);
                });
            });
        }

        // Close logic
        const closeTool = () => {
            frame.style.display = 'none';
            if (lastFocusedElement) lastFocusedElement.focus();
        };
        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeTool();
            if (e.altKey && e.shiftKey && e.key === 'r') { /* Reset logic */ }
        });

        render(data);
    }
})();
