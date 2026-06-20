(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';

    const openTool = () => {
        const popup = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        if (!popup) { alert("Popup blocked!"); return; }

        popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><h1>Loading Data...</h1></body></html>');

        fetch(dataUrl)
            .then(r => r.text())
            .then(jsText => {
                // Execute data in the context of the popup document
                const script = popup.document.createElement('script');
                script.textContent = jsText;
                popup.document.body.appendChild(script);

                // Delay execution slightly to ensure window.wcagData is defined
                setTimeout(() => {
                    if (popup.wcagData) {
                        initializeUI(popup, popup.wcagData);
                    } else {
                        popup.document.body.innerHTML = "<h1>Error: Failed to load data.</h1>";
                    }
                }, 500);
            });
    };

    function initializeUI(win, data) {
        const doc = win.document;
        doc.body.innerHTML = `
            <style>body{font-family:sans-serif; padding:20px;} ul{list-style-type:none; padding:0;}</style>
            <h1>WCAG Lookup Tool</h1>
            <input id="s" type="search" placeholder="Search..." style="width:90%; padding:10px;">
            <ul id="container"></ul>
        `;
        
        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            list.forEach(i => {
                const li = doc.createElement('li');
                const btn = doc.createElement('button');
                btn.textContent = `${i.name} (Level ${i.level})`;
                btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.marginTop = "10px";
                
                const details = doc.createElement('ul');
                details.style.display = 'none'; details.style.padding = "10px"; details.style.border = "1px solid #ccc";
                
                btn.onclick = () => { details.style.display = details.style.display === 'block' ? 'none' : 'block'; };
                
                const fullEntry = `Name: ${i.name}\r\n\rDescription: ${i.desc}\r\n\rFailures:\n${(i.failures||"").replace(/\|/g, '\r')}\r\n\rFixes:\n${(i.fixes||"").replace(/\|/g, '\r')}\r\n\rLink: ${i.Link}`;
                const dis = (i.disabilitie || 'N/A').replace(/\|/g, ', ');

                details.innerHTML = `
                    <li style="margin-top:15px;"><strong>Description:</strong> ${i.desc}</li>
                    <li style="margin-top:10px;"><strong>Failures:</strong></li>${(i.failures||"").split('|').map(f => `<li>${f}</li>`).join('')}
                    <li style="margin-top:10px;"><strong>Fixes:</strong></li>${(i.fixes||"").split('|').map(f => `<li>${f}</li>`).join('')}
                    <li style="margin-top:10px;"><strong>Disabilities:</strong> ${dis}</li>
                    <li style="margin-top:10px;"><a href="${i.Link}" target="_blank">W3C Doc</a></li>
                    <li style="margin-top:10px;"><strong>Copy Actions:</strong></li>
                    <li><button class="copy-trigger" data-clipboard-text="${fullEntry.replace(/"/g, '&quot;')}">Copy Full</button></li>
                    <li><button class="copy-trigger" data-clipboard-text="${(i.name||"").replace(/"/g, '&quot;')}">Copy Name</button></li>
                `;
                li.appendChild(btn); li.appendChild(details); container.appendChild(li);
            });
        };

        doc.getElementById('s').oninput = (e) => {
            const q = e.target.value.toLowerCase();
            render(data.filter(i => i.name.toLowerCase().includes(q)));
        };
        render(data);
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
