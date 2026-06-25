(function() {
    const dataUrl = 'https://cdn.jsdelivr.net/gh/ripplelearning/wcag-database@main/wcag_data.js';
    let popup;

    const openTool = () => {
        popup = window.open('', 'WCAG Lookup Tool', 'width=800,height=600,scrollbars=yes');
        popup.document.write('<html><body><h1 id="status">Loading data...</h1></body></html>');
        popup.document.close();

        // Bypass script execution blocks by using fetch
        fetch(dataUrl)
            .then(r => r.text())
            .then(text => {
                // Remove variable declaration if present to make it valid JSON
                const jsonText = text.replace(/window\.wcagData\s*=\s*/, '');
                const data = JSON.parse(jsonText);
                setupPopup(data);
            })
            .catch(err => {
                popup.document.getElementById('status').textContent = "Error: " + err;
            });
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.innerHTML = '<h1>WCAG Lookup Tool</h1><div id="container"></div>';

        // Copy Handler
        doc.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-trigger')) {
                navigator.clipboard.writeText(e.target.dataset.clipboardText);
                const original = e.target.textContent;
                e.target.textContent = "Copied!";
                setTimeout(() => e.target.textContent = original, 1000);
            }
        });

        // Navigation
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

        const container = doc.getElementById('container');
        data.forEach(i => {
            const btn = doc.createElement('button');
            const details = doc.createElement('div');
            
            btn.textContent = `${i.name} (Level ${i.level})`;
            btn.style.cssText = "display:block; width:100%; text-align:left; padding:10px; margin-top:5px;";
            btn.setAttribute('aria-expanded', 'false');
            
            details.style.display = 'none';
            details.style.padding = "10px";
            details.style.border = "1px solid #ccc";

            details.innerHTML = `<p><strong>Desc:</strong> ${i.desc}</p><p><strong>Failures:</strong> ${i.failures}</p><p><strong>Fixes:</strong> ${i.fixes}</p>`;
            
            const copyActions = [
                { l: "Copy Full", v: `Name: ${i.name}\nDesc: ${i.desc}\nFailures: ${i.failures}\nFixes: ${i.fixes}\nLink: ${i.Link}` },
                { l: "Copy Name", v: i.name },
                { l: "Copy Failures", v: i.failures },
                { l: "Copy Fixes", v: i.fixes },
                { l: "Copy Link", v: i.Link }
            ];

            copyActions.forEach(a => {
                const b = doc.createElement('button');
                b.className = "copy-trigger";
                b.textContent = a.l;
                b.dataset.clipboardText = a.v;
                details.append(b);
            });

            btn.onclick = () => {
                const isOpen = details.style.display === 'block';
                doc.querySelectorAll('#container > div').forEach(d => d.style.display = 'none');
                doc.querySelectorAll('#container > button').forEach(b => b.setAttribute('aria-expanded', 'false'));
                if (!isOpen) { details.style.display = 'block'; btn.setAttribute('aria-expanded', 'true'); }
            };
            container.append(btn, details);
        });
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
