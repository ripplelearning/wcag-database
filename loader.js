(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;

    const openTool = () => {
        const options = `width=800,height=600,scrollbars=yes,resizable=yes`;
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Lookup Tool', options);
            popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><div id="root"><h1>Loading...</h1></div></body></html>');
            popup.document.close();
            fetch(dataUrl).then(r => r.text()).then(jsText => { (0, eval)(jsText); setupPopup(window.wcagData); });
        } else {
            popup.focus();
        }
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <input id="s" type="search" placeholder="Search criteria..." style="width:90%; padding:10px;">
            <ul id="container" style="list-style-type:none; padding:0;"></ul>
        `;

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            list.forEach((i, idx) => {
                const li = doc.createElement('li');
                const btn = doc.createElement('button');
                const panelId = `panel-${idx}`;
                
                btn.textContent = `${i.name} (Level ${i.level})`;
                btn.setAttribute('aria-expanded', 'false');
                btn.setAttribute('aria-controls', panelId);
                btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.marginTop = "10px";
                
                const panel = document.createElement('div');
                panel.id = panelId;
                panel.style.display = 'none';
                panel.setAttribute('role', 'region');
                
                btn.onclick = () => {
                    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', !isExpanded);
                    panel.style.display = isExpanded ? 'none' : 'block';
                };

                // Structure for content
                const fullEntry = `Name: ${i.name}\r\n\rDescription: ${i.desc}`;
                panel.innerHTML = `
                    <ul style="list-style-type:none; padding:10px; border:1px solid #ccc;">
                        <li><strong>Description:</strong> ${i.desc}</li>
                        <li style="margin-top:10px;"><strong>Disabilities:</strong> ${(i.disabilitie || 'N/A').replace(/\|/g, ', ')}</li>
                        <li style="margin-top:10px;"><strong>Copy Actions:</strong></li>
                        <li style="margin-top:5px;"><button class="copy-trigger" data-clipboard-text="${fullEntry.replace(/"/g, '&quot;')}">Copy Full Entry</button></li>
                        <li style="margin-top:5px;"><button class="copy-trigger" data-clipboard-text="${(i.name||"").replace(/"/g, '&quot;')}">Copy Name</button></li>
                    </ul>
                `;
                li.appendChild(btn);
                li.appendChild(panel);
                container.appendChild(li);
            });
        };
        render(data);
    }
    
    // Final explicit initialization
    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();;
