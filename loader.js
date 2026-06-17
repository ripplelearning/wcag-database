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
            <input id="s" type="search" placeholder="Search..." style="width:90%; padding:10px;">
            <div id="container"></div>
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
            // Group by version
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
                        btn.onclick = (e) => {
                            const detailDiv = e.target.nextElementSibling;
                            detailDiv.style.display = detailDiv.style.display === 'block' ? 'none' : 'block';
                        };
                        container.appendChild(btn);
                        
                        const div = doc.createElement('div');
                        div.style.display = 'none'; div.style.padding = "10px"; div.style.border = "1px solid #ccc";
                        div.innerHTML = `
                            <p><strong>Description:</strong> ${i.desc}</p>
                            <p><strong>Failures:</strong> ${i.failures}</p>
                            <p><strong>Fixes:</strong> ${i.fixes}</p>
                            <div class="copy-bar">
                                <button onclick="handleCopy(this, '${i.name}')">Copy Name</button>
                                <button onclick="handleCopy(this, '${i.desc}')">Copy Description</button>
                                <button onclick="handleCopy(this, '${i.failures}')">Copy Failures</button>
                                <button onclick="handleCopy(this, '${i.fixes}')">Copy Fixes</button>
                                <button onclick="handleCopy(this, '${i.Link}')">Copy Link</button>
                            </div>
                        `;
                        container.appendChild(div);
                    });
                }
            });
        };

        render(data);
    }
    
    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
