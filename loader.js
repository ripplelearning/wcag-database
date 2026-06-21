(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;
    let appState = { q: '', v: '', l: '', c: '' };

    const categoryMap = {
        "ARIA & Live Regions": "ARIA|Live",
        "Audio & Video": "Multimedia|Audio|Video|Captions|Transcripts",
        "Buttons & Navigation": "Navigation|Link|Skip|Bypass",
        "Color & Contrast": "Color|Contrast",
        "Focus & Keyboard": "Keyboard|Focus|Tabindex|Modal",
        "Forms & Inputs": "Forms|Input|Autocomplete|Authentication",
        "Images & Graphics": "Images|Graphic|Icons|Charts",
        "Interactions": "Interactions|Pointer|Dragging|Input Modalities",
        "Language & Text": "Text|Language|Jargon|Acronym|Pronunciation",
        "Layout & Structure": "Layout|Structure|Semantics|Reading Order|Reflow|CSS",
        "Mobile & Touch": "Mobile|Orientation|Tap Targets",
        "Motion & Animation": "Animation|Reduced Motion|Seizure|Flash",
        "Notifications & Errors": "Error|Notifications|Alert|Status",
        "Time & Timeouts": "Timeouts|Refresh|Expiration",
        "Tooltips & Overlays": "Tooltips|Overlays|Popups|Dialog"
    };

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
            <div id="sr-announcer" aria-live="assertive" style="position:absolute; left:-9999px;"></div>
            <input id="s" type="search" placeholder="Search criteria..." style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <label>Version: <select id="ver-f"><option value="">All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select></label>
                <label>Level: <select id="lvl-f"><option value="">All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select></label>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite"></h2>
            <ul id="container" style="list-style-type:none; padding:0;"></ul>
            <hr>
            <details>
                <summary><h3>How to use this tool</h3></summary>
                <p>This tool is a specialized reference library for the Web Content Accessibility Guidelines (WCAG). Its purpose is to provide rapid access to success criteria, common failures, and remediation strategies to help teams build more accessible digital products.</p>
                <p>To use the tool, enter keywords into the search input or use the filter controls to narrow down the criteria. You can interact with the results list to view specific details for each criterion and utilize the copy buttons to quickly grab text for your documentation or reporting tasks.</p>
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
                btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.marginTop = "10px";
                
                const panel = doc.createElement('ul');
                panel.id = panelId;
                panel.style.display = 'none';
                panel.style.listStyleType = 'none';
                panel.style.padding = '10px';
                panel.style.border = '1px solid #ccc';
                
                btn.onclick = () => {
                    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', !isExpanded);
                    panel.style.display = isExpanded ? 'none' : 'block';
                };

                const fullEntry = `Name: ${i.name}\r\n\rDescription: ${i.desc}`;
                panel.innerHTML = `
                    <li><strong>Description:</strong> ${i.desc}</li>
                    <li style="margin-top:10px;"><strong>Disabilities:</strong> ${(i.disabilitie || 'N/A').replace(/\|/g, ', ')}</li>
                    <li style="margin-top:10px;"><strong>Copy Actions:</strong></li>
                    <li><button class="copy-trigger" data-clipboard-text="${fullEntry.replace(/"/g, '&quot;')}">Copy Full Entry</button></li>
                    <li><button class="copy-trigger" data-clipboard-text="${(i.name||"").replace(/"/g, '&quot;')}">Copy Name</button></li>
                `;
                li.appendChild(btn); li.appendChild(panel);
                container.appendChild(li);
            });
        };

        doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') popup.close(); });
        render(data);
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();;
