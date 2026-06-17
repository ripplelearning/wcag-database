(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';

    fetch(dataUrl)
        .then(r => r.text())
        .then(jsText => {
            (0, eval)(jsText);
            if(window.wcagData) {
                createIframeUI(window.wcagData);
            }
        });

    function createIframeUI(data) {
        const frame = document.createElement('iframe');
        frame.style.cssText = 'position:fixed; top:20px; right:20px; width:500px; height:85vh; z-index:2147483647; border:2px solid #000; border-radius:8px; background:white;';
        document.body.appendChild(frame);

        const doc = frame.contentDocument || frame.contentWindow.document;
        doc.write(`
            <style>
                body { font-family:sans-serif; padding:15px; }
                ul { list-style-type:none; padding-left:10px; }
                li { margin-bottom:8px; }
                .accordion-btn { width:100%; text-align:left; padding:10px; margin:2px 0; cursor:pointer; }
                .content { display:none; padding:10px; border:1px solid #eee; }
                .expanded { display:block; }
            </style>
            <h1>WCAG Lookup Tool</h1>
            <h2 id="count">Found ${data.length} results</h2>
            <div id="filters">
                <select id="ver"><option value="">All Versions</option></select>
                <select id="lvl"><option value="">All Levels</option></select>
                </div>
            <div id="criteria-container"></div>
        `);
        doc.close();

        const container = doc.getElementById('criteria-container');

        function render(filteredData) {
            doc.getElementById('count').textContent = `Found ${filteredData.length} results`;
            container.innerHTML = '';
            
            ['2.2', '2.1'].forEach(version => {
                const section = filteredData.filter(i => i.ver == version);
                if (section.length === 0) return;

                const h3 = doc.createElement('h3');
                h3.textContent = `WCAG ${version} Success Criteria`;
                container.appendChild(h3);

                section.forEach((item, idx) => {
                    const btn = doc.createElement('button');
                    btn.className = 'accordion-btn';
                    btn.setAttribute('aria-expanded', 'false');
                    btn.textContent = `${item.name} (Level ${item.level})`;
                    
                    const div = doc.createElement('div');
                    div.className = 'content';
                    div.innerHTML = `
                        <ul>
                            <li><strong>Description:</strong> ${item.desc}</li>
                            <li><strong>Failures:</strong> <ul>${(item.failures||'').split('|').map(f => `<li>${f}</li>`).join('')}</ul></li>
                            <li><strong>Fixes:</strong> <ul>${(item.fixes||'').split('|').map(f => `<li>${f}</li>`).join('')}</ul></li>
                            <li><strong>Disability Categories:</strong> ${item.disabilitie.split('|').join(', ')}</li>
                            <li><a href="${item.Link}" target="_blank">Open ${item.id} on W3C website</a></li>
                        </ul>
                    `;

                    btn.onclick = () => {
                        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                        doc.querySelectorAll('.content').forEach(c => c.classList.remove('expanded'));
                        doc.querySelectorAll('.accordion-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
                        if (!isExpanded) {
                            div.classList.add('expanded');
                            btn.setAttribute('aria-expanded', 'true');
                        }
                    };
                    container.appendChild(btn);
                    container.appendChild(div);
                });
            });
        }

        render(data);
    }
})();
