(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';
    let popup;

    const openTool = () => {
        popup = window.open('', 'WCAG Lookup Tool', 'width=800,height=600,scrollbars=yes');
        popup.document.write('<html><body><h1>Loading...</h1></body></html>');
        popup.document.close();

        fetch(dataUrl)
            .then(r => r.text())
            .then(jsText => {
                // Force the data to attach to the POPUP's window object
                const scriptContent = jsText + "; window.wcagData = wcagData;";
                popup.eval(scriptContent); 
                setupPopup(popup.wcagData);
            })
            .catch(err => popup.document.body.innerHTML = '<h1>Error:</h1>' + err);
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.innerHTML = '<h1>WCAG Lookup Tool</h1><div id="container"></div>';

        // Keyboard & Copy logic...
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

        doc.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-trigger')) {
                navigator.clipboard.writeText(e.target.dataset.clipboardText);
                const original = e.target.textContent;
                e.target.textContent = "Copied!";
                setTimeout(() => e.target.textContent = original, 1000);
            }
        });

        const container = doc.getElementById('container');
        data.forEach((i) => {
            const btn = doc.createElement('button');
            const details = doc.createElement('div');
            
            btn.textContent = `${i.name} (Level ${i.level})`;
            btn.style.cssText = "display:block; width:100%; text-align:left; padding:10px; margin-top:5px; cursor:pointer;";
            btn.setAttribute('aria-expanded', 'false');
            
            details.style.display = 'none';
            details.style.padding = "10px";
            details.style.border = "1px solid #ccc";

            details.append(
                Object.assign(doc.createElement('p'), {innerHTML: `<strong>Desc:</strong> ${i.desc}`}),
                Object.assign(doc.createElement('p'), {innerHTML: `<strong>Failures:</strong> ${i.failures}`}),
                Object.assign(doc.createElement('p'), {innerHTML: `<strong>Fixes:</strong> ${i.fixes}`})
            );

            const copyActions = [
                { l: "Copy Full", v: `Name: ${i.name}\nDesc: ${i.desc}\nFailures: ${i.failures}\nFixes: ${i.fixes}\nLink: ${i.Link}` },
                { l: "Copy Name", v: i.name },
                { l: "Copy Failures", v: i.failures },
                { l: "Copy Fixes", v: i.fixes },
                { l: "Copy Link", v: i.Link }
            ];

            copyActions.forEach(action => {
                const b = doc.createElement('button');
                b.className = "copy-trigger";
                b.textContent = action.l;
                b.dataset.clipboardText = action.v;
                b.style.margin = "2px";
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
})();
