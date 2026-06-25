(function() {
    const dataUrl = 'https://cdn.jsdelivr.net/gh/ripplelearning/wcag-database@main/wcag_data.js';
    
    // Copy bridge
    window.copyToSystemClipboard = (text) => {
        navigator.clipboard.writeText(text).catch(err => console.error(err));
    };

    const openTool = () => {
        const popup = window.open('', 'WCAG Lookup Tool', 'width=800,height=600,scrollbars=yes');
        popup.document.write('<html><body><h1 id="status">Loading...</h1></body></html>');
        popup.document.close();

        fetch(dataUrl)
            .then(r => r.text())
            .then(text => {
                // AGGRESSIVE CLEANER: Find the FIRST '[' and the LAST ']'
                // This ignores everything before the array and everything after it
                const start = text.indexOf('[');
                const end = text.lastIndexOf(']');
                
                if (start === -1 || end === -1) {
                    throw new Error("Could not find valid JSON array in file.");
                }

                const jsonText = text.substring(start, end + 1);
                setupPopup(popup, JSON.parse(jsonText));
            })
            .catch(err => {
                popup.document.getElementById('status').textContent = "Error: " + err;
            });
    };

    function setupPopup(popup, data) {
        const doc = popup.document;
        doc.body.innerHTML = '<h1>WCAG Lookup Tool</h1><div id="container"></div>';

        doc.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-trigger')) {
                window.opener.copyToSystemClipboard(e.target.dataset.clipboardText);
                const original = e.target.textContent;
                e.target.textContent = "Copied!";
                setTimeout(() => e.target.textContent = original, 1000);
            }
        });

        const container = doc.getElementById('container');
        data.forEach(i => {
            const btn = doc.createElement('button');
            const details = doc.createElement('div');
            
            btn.textContent = `${i.name || "Unknown"} (Level ${i.level || "N/A"})`;
            btn.style.cssText = "display:block; width:100%; text-align:left; padding:10px; margin-top:5px; background:#f0f0f0;";
            
            details.style.display = 'none';
            details.style.padding = "10px";
            details.style.border = "1px solid #ccc";
            details.innerHTML = `<p><strong>Desc:</strong> ${i.desc || ""}</p><p><strong>Failures:</strong> ${i.failures || ""}</p><p><strong>Fixes:</strong> ${i.fixes || ""}</p>`;
            
            const actions = [
                { l: "Copy Full", v: `Name: ${i.name}\nDesc: ${i.desc}\nFailures: ${i.failures}\nFixes: ${i.fixes}\nLink: ${i.Link}` },
                { l: "Copy Name", v: i.name },
                { l: "Copy Failures", v: i.failures },
                { l: "Copy Fixes", v: i.fixes },
                { l: "Copy Link", v: i.Link }
            ];

            actions.forEach(a => {
                const b = doc.createElement('button');
                b.className = "copy-trigger";
                b.textContent = a.l;
                b.dataset.clipboardText = a.v || "";
                details.append(b);
            });

            btn.onclick = () => { details.style.display = (details.style.display === 'none') ? 'block' : 'none'; };
            container.append(btn, details);
        });
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
})();
