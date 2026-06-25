(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;

    const openTool = () => {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        const options = `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`;
        
        popup = window.open('', 'WCAG Lookup Tool', options);
        popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><h1>Loading data...</h1></body></html>');
        popup.document.close();

        // Use a standard script tag for maximum compatibility
        const script = popup.document.createElement('script');
        script.src = dataUrl;
        script.onload = () => setupPopup(popup.window.wcagData);
        popup.document.head.appendChild(script);
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.innerHTML = '<h1>WCAG Lookup Tool</h1><div id="container"></div>';
        
        // --- Event Listeners ---
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
        
        // --- Render Logic ---
        data.forEach((i) => {
            const btn = doc.createElement('button');
            const details = doc.createElement('div');
            
            btn.textContent = `${i.name} (${i.level})`;
            btn.style.cssText = "display:block; width:100%; text-align:left; margin-top:5px; padding:10px;";
            btn.setAttribute('aria-expanded', 'false');
            
            details.style.display = 'none';
            details.style.padding = "10px";
            details.style.border = "1px solid #ccc";

            // Helper for structured text
            const pDesc = doc.createElement('p'); pDesc.innerHTML = `<strong>Desc:</strong> ${i.desc}`;
            const pFail = doc.createElement('p'); pFail.innerHTML = `<strong>Failures:</strong> ${i.failures}`;
            const pFix = doc.createElement('p'); pFix.innerHTML = `<strong>Fixes:</strong> ${i.fixes}`;
            details.append(pDesc, pFail, pFix);

            // Copy Buttons
            const copyActions = [
                { l: "Copy Full", v: `Name: ${i.name}\nDesc: ${i.desc}\nFailures: ${i.failures}\nFixes: ${i.fixes}\nLink: ${i.Link}` },
                { l: "Copy Name", v: i.name },
                { l: "Copy Failures", v: i.failures },
                { l: "Copy Fixes", v: i.fixes },
                { l: "Copy Link", v: i.Link }
            ];

            copyActions.forEach(action => {
                const b = doc.createElement('button');
                b.textContent = action.l;
                b.style.margin = "2px";
                b.onclick = () => {
                    navigator.clipboard.writeText(action.v);
                    const old = b.textContent;
                    b.textContent = "Copied!";
                    setTimeout(() => b.textContent = old, 1000);
                };
                details.append(b);
            });

            btn.onclick = () => {
                const isOpen = details.style.display === 'block';
                doc.querySelectorAll('#container > div').forEach(d => d.style.display = 'none');
                doc.querySelectorAll('#container > button').forEach(b => b.setAttribute('aria-expanded', 'false'));
                if (!isOpen) {
                    details.style.display = 'block';
                    btn.setAttribute('aria-expanded', 'true');
                }
            };
            container.append(btn, details);
        });
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
})();
