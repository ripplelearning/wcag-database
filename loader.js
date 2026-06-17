(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;
    let appState = { q: '', v: '', l: '', c: '' };

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

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            list.forEach(i => {
                const btn = doc.createElement('button');
                btn.textContent = `${i.name}`;
                btn.onclick = () => {
                    const c = btn.nextElementSibling;
                    c.style.display = c.style.display === 'block' ? 'none' : 'block';
                };
                container.appendChild(btn);
                
                const div = doc.createElement('div');
                div.style.display = 'none';
                div.innerHTML = `
                    <p>${i.desc}</p>
                    <div class="copy-bar">
                        <button onclick="handleCopy(this, '${i.name}')">Copy Name</button>
                        <button onclick="handleCopy(this, '${i.desc}')">Copy Description</button>
                        </div>
                `;
                container.appendChild(div);
            });
        };

        // Inject the handleCopy function into the popup window scope
        popup.handleCopy = (btn, text) => {
            navigator.clipboard.writeText(text).then(() => {
                const original = btn.textContent;
                btn.textContent = "Copied...";
                doc.getElementById('sr-announcer').textContent = "Copied to clipboard";
                setTimeout(() => {
                    btn.textContent = original;
                    doc.getElementById('sr-announcer').textContent = "";
                }, 2000);
            });
        };

        render(data);
    }
    
    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
