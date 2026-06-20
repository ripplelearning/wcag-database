(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;

    function setupPopup(data) {
        if (!data || !Array.isArray(data)) {
            popup.document.body.innerHTML = "<h1>Error: Data not found.</h1>";
            return;
        }

        const doc = popup.document;
        doc.body.style.fontFamily = "sans-serif";
        doc.body.style.padding = "20px";
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <div id="sr-announcer" aria-live="assertive" style="position:absolute; left:-9999px;"></div>
            <input id="s" type="search" placeholder="Search..." style="width:90%; padding:10px;">
            <ul id="container" style="list-style-type:none; padding:0;"></ul>
        `;

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            list.forEach((i) => {
                const li = doc.createElement('li');
                const btn = doc.createElement('button');
                btn.textContent = `${i.name} (Level ${i.level})`;
                btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.marginTop = "10px";
                
                const details = doc.createElement('ul');
                details.style.display = 'none'; details.style.padding = "10px"; details.style.border = "1px solid #ccc"; details.style.listStyleType = "none";
                
                btn.onclick = () => { details.style.display = details.style.display === 'block' ? 'none' : 'block'; };
                
                const fullEntry = `Name: ${i.name}\r\n\rDescription: ${i.desc}\r\n\rFailures:\n${(i.failures||"").replace(/\|/g, '\r')}\r\n\rFixes:\n${(i.fixes||"").replace(/\|/g, '\r')}\r\n\rLink: ${i.Link}`;
                const disabilitiesList = (i.disabilitie || 'N/A').replace(/\|/g, ', ');

                details.innerHTML = `
                    <li style="margin-top: 15px; padding-bottom: 10px;"><strong>Description:</strong> ${i.desc}</li>
                    <li><strong>Failures:</strong></li>${(i.failures||"").split('|').map(f => `<li>${f}</li>`).join('')}
                    <li style="margin-top: 10px;"><strong>Fixes:</strong></li>${(i.fixes||"").split('|').map(f => `<li>${f}</li>`).join('')}
                    <li style="margin-top: 10px;"><strong>Disabilities:</strong> ${disabilitiesList}</li>
                    <li style="margin-top: 10px;"><a href="${i.Link}" target="_blank">Open W3C Documentation</a></li>
                    <li style="margin-top: 10px;"><strong>Copy Actions:</strong></li>
                    <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${fullEntry.replace(/"/g, '&quot;')}" style="font-weight:bold;">Copy Full Entry</button></li>
                    <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${(i.name||"").replace(/"/g, '&quot;')}">Copy Name</button></li>
                    <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${(i.desc||"").replace(/"/g, '&quot;')}">Copy Description</button></li>
                    <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${(i.failures||"").replace(/\|/g, '\r').replace(/"/g, '&quot;')}">Copy Failures</button></li>
                    <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${(i.fixes||"").replace(/\|/g, '\r').replace(/"/g, '&quot;')}">Copy Fixes</button></li>
                    <li style="margin-top: 5px;"><button class="copy-trigger" data-clipboard-text="${(i.Link||"").replace(/"/g, '&quot;')}">Copy Link</button></li>
                `;
                li.appendChild(btn); li.appendChild(details); container.appendChild(li);
            });
        };

        doc.getElementById('s').oninput = (e) => {
            const q = e.target.value.toLowerCase();
            render(data.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)));
        };
        render(data);
    }

    const openTool = () => {
        popup = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        popup.document.write('<html><body><h1>Loading WCAG Data...</h1></body></html>');
        
        fetch(dataUrl)
            .then(r => r.text())
            .then(jsText => {
                // Instead of relying on window.wcagData, we execute and define it locally
                const script = document.createElement('script');
                script.textContent = jsText + "; window.postMessage({type: 'WCAG_DATA', data: wcagData}, '*');";
                popup.document.body.appendChild(script);
            });
    };

    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'WCAG_DATA') {
            setupPopup(e.data.data);
        }
    });

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
