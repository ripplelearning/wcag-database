(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;

    const openTool = () => {
        const options = `width=800,height=600,scrollbars=yes,resizable=yes`;
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Lookup Tool', options);
            popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><div id="root"><h1>Loading WCAG Data...</h1></div></body></html>');
            popup.document.close();
            fetch(dataUrl).then(r => r.text()).then(jsText => { (0, eval)(jsText); setupPopup(window.wcagData); });
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
            <input id="s" type="search" placeholder="Search criteria..." style="width:90%; padding:10px;">
            <ul id="container" style="list-style-type:none; padding:0;"></ul>
            <hr style="margin-top:40px;">
            <details>
                <summary><h3>How to use this tool</h3></summary>
                <p>This WCAG Lookup Tool is a professional reference library built to help accessibility testers, designers, and developers quickly locate specific success criteria from the Web Content Accessibility Guidelines (WCAG). It centralizes technical requirements to ensure your digital products adhere to global accessibility standards.</p>
                <p>To use the tool, search by keyword or use the version filters. Clicking a criterion title expands its technical details, where you can find failures, recommended fixes, and disability contexts. You can then use the specialized copy buttons to extract individual data points or the full criterion text for your reports or project documentation.</p>
                <ul>
                    <li><strong>Alt+Shift+D:</strong> Reset filters</li>
                    <li><strong>Escape:</strong> Close tool</li>
                </ul>
            </details>
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
                btn.style.display = "block";
                btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.marginTop = "10px";
                
                const panel = doc.createElement('ul');
                panel.id = panelId;
                panel.hidden = true;
                panel.style.listStyleType = 'none';
                panel.style.padding = '10px';
                panel.style.border = '1px solid #ccc';
                
                btn.onclick = () => {
                    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', !isExpanded);
                    panel.hidden = isExpanded;
                };

                const fullEntry = `Name: ${i.name}\r\n\rDescription: ${i.desc}`;
                panel.innerHTML = `
                    <li><strong>Description:</strong> ${i.desc}</li>
                    <li style="margin-top:10px;"><strong>Disabilities:</strong> ${(i.disabilitie || 'N/A').replace(/\|/g, ', ')}</li>
                    <li style="margin-top:10px;"><strong>Copy Actions:</strong></li>
                    <li style="margin-top:5px;"><button class="copy-trigger" data-clipboard-text="${fullEntry.replace(/"/g, '&quot;')}">Copy Full Entry</button></li>
                    <li style="margin-top:5px;"><button class="copy-trigger" data-clipboard-text="${(i.name||"").replace(/"/g, '&quot;')}">Copy Name</button></li>
                    <li style="margin-top:5px;"><button class="copy-trigger" data-clipboard-text="${(i.desc||"").replace(/"/g, '&quot;')}">Copy Description</button></li>
                `;
                li.appendChild(btn); 
                li.appendChild(panel);
                container.appendChild(li);
            });
        };

        doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') popup.close(); });
        render(data);
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();;
