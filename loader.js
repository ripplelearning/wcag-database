(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;

    // This function will be called by the remote data file itself
    window.initWCAGTool = (data) => {
        if (!popup || popup.closed) return;
        setupPopup(data);
    };

    const openTool = () => {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        const options = `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`;
        
        popup = window.open('', 'WCAG Lookup Tool', options);
        popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><h1>Loading data...</h1></body></html>');
        popup.document.close();

        // Inject script
        const script = popup.document.createElement('script');
        script.src = dataUrl;
        popup.document.head.appendChild(script);
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.innerHTML = '<h1>WCAG Lookup Tool</h1><div id="container"></div>';
        
        // Fix for Escape key: The listener must be on the popup's document
        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') popup.close();
            if (e.ctrlKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                e.preventDefault();
                const btns = Array.from(doc.querySelectorAll('#container button[aria-expanded]'));
                const idx = btns.indexOf(doc.activeElement);
                let next = e.key === 'ArrowDown' ? (idx + 1) : (idx - 1 + btns.length);
                btns[next % btns.length].focus();
            }
        });

        // Copy Handler
        doc.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-trigger')) {
                navigator.clipboard.writeText(e.target.dataset.clipboardText);
                const orig = e.target.textContent;
                e.target.textContent = "Copied!";
                setTimeout(() => e.target.textContent = orig, 1000);
            }
        });

        const container = doc.getElementById('container');
        data.forEach((i) => {
            const btn = doc.createElement('button');
            const details = doc.createElement('div');
            btn.textContent = `${i.name} (${i.level})`;
            btn.style.cssText = "display:block; width:100%; text-align:left; margin-top:5px;";
            btn.setAttribute('aria-expanded', 'false');
            
            details.style.display = 'none';
            details.innerHTML = `<p><strong>Desc:</strong> ${i.desc}</p>`;
            
            ['Copy Full', 'Copy Name', 'Copy Failures', 'Copy Fixes', 'Copy Link'].forEach((label, idx) => {
                const b = doc.createElement('button');
                b.className = "copy-trigger";
                b.textContent = label;
                const vals = [
                    `Name: ${i.name}\nDesc: ${i.desc}\nFailures: ${i.failures}\nFixes: ${i.fixes}\nLink: ${i.Link}`,
                    i.name, i.failures, i.fixes, i.Link
                ];
                b.dataset.clipboardText = vals[idx];
                details.appendChild(b);
            });

            btn.onclick = () => {
                const open = details.style.display === 'block';
                doc.querySelectorAll('#container > div').forEach(d => d.style.display = 'none');
                doc.querySelectorAll('#container > button').forEach(b => b.setAttribute('aria-expanded', 'false'));
                if (!open) { details.style.display = 'block'; btn.setAttribute('aria-expanded', 'true'); }
            };
            container.append(btn, details);
        });
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
