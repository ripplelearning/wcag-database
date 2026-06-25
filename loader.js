(function() {
    // UPDATED URL
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';
    let popup;

    const openTool = () => {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        const options = `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`;
        
        popup = window.open('', 'WCAG Lookup Tool', options);
        popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><h1>Loading data...</h1></body></html>');
        popup.document.close();

        const script = popup.document.createElement('script');
        script.src = dataUrl;
        
        script.onload = () => {
            if (popup.window.wcagData) {
                setupPopup(popup.window.wcagData);
            } else {
                popup.document.body.innerHTML = '<h1>Error: Data not found in the loaded file.</h1>';
            }
        };
        
        script.onerror = () => {
            popup.document.body.innerHTML = '<h1>Error: Failed to load data script.</h1>';
        };

        popup.document.head.appendChild(script);
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.innerHTML = '<h1>WCAG Lookup Tool</h1><div id="container"></div>';
        
        // Keyboard Navigation and Escape to Close
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
            
            btn.textContent = `${i.name} (Level ${i.level})`;
            btn.style.cssText = "display:block; width:100%; text-align:left; padding:10px; margin-top:5px;";
            btn.setAttribute('aria-expanded', 'false');
            
            details.style.display = 'none';
            details.style.padding = "10px";
            details.style.border = "1px solid #ccc";

            const pDesc = doc.createElement('p'); pDesc.innerHTML = `<strong>Desc:</strong> ${i.desc}`;
            const pFail = doc.createElement('p'); pFail.innerHTML = `<strong>Failures:</strong> ${i.failures}`;
            const pFix = doc.createElement('p'); pFix.innerHTML = `<strong>Fixes:</strong> ${i.fixes}`;
            details.append(pDesc, pFail, pFix);

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
                if (!isOpen) {
                    details.style.display = 'block';
                    btn.setAttribute('aria-expanded', 'true');
                }
            };
            container.append(btn, details);
        });
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
