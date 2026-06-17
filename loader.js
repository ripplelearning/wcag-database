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
        frame.style.cssText = 'position:fixed; top:20px; right:20px; width:550px; height:85vh; z-index:2147483647; border:2px solid #000; border-radius:8px; background:white;';
        document.body.appendChild(frame);

        const doc = frame.contentDocument || frame.contentWindow.document;
        doc.write(`
            <style>
                body { font-family:sans-serif; padding:15px; }
                .accordion-btn { width:100%; text-align:left; padding:12px; margin:4px 0; cursor:pointer; font-weight:bold; }
                .content { display:none; padding:15px; border:1px solid #ccc; }
                .expanded { display:block; }
                ul { list-style:none; padding-left:0; }
                li { margin-bottom:10px; }
            </style>
            <h1>WCAG Lookup Tool</h1>
            <label for="s">Search Criteria:</label>
            <input id="s" type="search" placeholder="Enter keywords..." style="width:100%; padding:8px; margin-bottom:10px;">
            <h2 id="count">Found ${data.length} results</h2>
            <div id="criteria-container"></div>
        `);
        doc.close();

        const container = doc.getElementById('criteria-container');
        const searchInput = doc.getElementById('s');

        function copyToClipboard(text, btn) {
            navigator.clipboard.writeText(text);
            const original = btn.textContent;
            btn.textContent = 'Copied...';
            setTimeout(() => btn.textContent = original, 2000);
        }

        function render(filteredData) {
            doc.getElementById('count').textContent = `Found ${filteredData.length} results`;
            container.innerHTML = '';
            
            ['2.2', '2.1'].forEach(version => {
                const section = filteredData.filter(i => i.ver == version);
                if (section.length === 0) return;

                const h3 = doc.createElement('h3');
                h3.textContent = `WCAG ${version} Success Criteria`;
                container.appendChild(h3);

                section.forEach(item => {
                    const btn = doc.createElement('button');
                    btn.className = 'accordion-btn';
                    btn.setAttribute('aria-expanded', 'false');
                    btn.textContent = `${item.id} ${item.name} (Level ${item.level})`;
                    
                    const div = doc.createElement('div');
                    div.className = 'content';
                    
                    const fullText = `ID: ${item.id}\nName: ${item.name}\nDescription: ${item.desc}\nFailures: ${item.failures.replace(/\|/g, ', ')}\nFixes: ${item.fixes.replace(/\|/g, ', ')}\nLink: ${item.Link}`;

                    div.innerHTML = `
                        <ul>
                            <li><strong>Description:</strong> ${item.desc}</li>
                            <li><strong>Failures:</strong> <ul>${(item.failures||'').split('|').map(f => `<li>${f}</li>`).join('')}</ul></li>
                            <li><strong>Fixes:</strong> <ul>${(item.fixes||'').split('|').map(f => `<li>${f}</li>`).join('')}</ul></li>
                            <li><strong>Disability Categories:</strong> ${item.disabilitie.split('|').join(', ')}</li>
                            <li><a href="${item.Link}" target="_blank">Open ${item.id} ${item.name} on the W3C website</a></li>
                        </ul>
                        <div style="margin-top:15px; display:flex; gap:5px; flex-wrap:wrap;">
                            <button class="copy-btn">Copy Full Entry</button>
                            <button class="copy-btn">Copy Description</button>
                            <button class="copy-btn">Copy Failures</button>
                            <button class="copy-btn">Copy Fixes</button>
                            <button class="copy-btn">Copy Link</button>
                        </div>
                    `;

                    // Handle Copy Buttons
                    const btns = div.querySelectorAll('.copy-btn');
                    btns[0].onclick = (e) => copyToClipboard(fullText, e.target);
                    btns[1].onclick = (e) => copyToClipboard(item.desc, e.target);
                    btns[2].onclick = (e) => copyToClipboard(item.failures.replace(/\|/g, '\n'), e.target);
                    btns[3].onclick = (e) => copyToClipboard(item.fixes.replace(/\|/g, '\n'), e.target);
                    btns[4].onclick = (e) => copyToClipboard(item.Link, e.target);

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

        searchInput.oninput = (e) => {
            const q = e.target.value.toLowerCase();
            render(data.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)));
        };

        render(data);
    }
})();
