(function() {
    const dataUrl = 'https://cdn.jsdelivr.net/gh/ripplelearning/wcag-database@main/wcag_data.js';
    let popup;

    const openTool = () => {
        popup = window.open('', 'WCAG Lookup Tool', 'width=800,height=600,scrollbars=yes');
        popup.document.write('<html><body><h1 id="status">Loading...</h1></body></html>');
        popup.document.close();

        fetch(dataUrl)
            .then(r => r.text())
            .then(text => {
                const jsonText = text.replace(/window\.wcagData\s*=\s*/, '');
                setupPopup(JSON.parse(jsonText));
            })
            .catch(err => popup.document.getElementById('status').textContent = "Fetch Error: " + err);
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.innerHTML = '<h1>WCAG Lookup Tool</h1><div id="container"></div>';

        // Reliable Clipboard Method: Uses a hidden textarea
        const copyToClipboard = (text) => {
            const textArea = doc.createElement("textarea");
            textArea.value = text;
            doc.body.appendChild(textArea);
            textArea.select();
            try {
                doc.execCommand('copy');
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            doc.body.removeChild(textArea);
        };

        doc.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-trigger')) {
                copyToClipboard(e.target.dataset.clipboardText);
                const original = e.target.textContent;
                e.target.textContent = "Copied!";
                setTimeout(() => e.target.textContent = original, 1000);
            }
        });

        const container = doc.getElementById('container');
        data.forEach(i => {
            const btn = doc.createElement('button');
            const details = doc.createElement('div');
            
            // Populate content safely
            btn.textContent = `${i.name || "Unnamed"} (Level ${i.level || "N/A"})`;
            btn.style.cssText = "display:block; width:100%; text-align:left; padding:10px; margin-top:5px; background:#f0f0f0; border:1px solid #ccc;";
            
            details.style.display = 'none';
            details.style.padding = "10px";
            details.style.border = "1px solid #ccc";
            details.style.background = "#fff";

            details.innerHTML = `<p><strong>Desc:</strong> ${i.desc || "N/A"}</p>
                                 <p><strong>Failures:</strong> ${i.failures || "N/A"}</p>
                                 <p><strong>Fixes:</strong> ${i.fixes || "N/A"}</p>`;
            
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
                b.style.margin = "2px";
                details.append(b);
            });

            btn.onclick = () => {
                const isHidden = details.style.display === 'none';
                details.style.display = isHidden ? 'block' : 'none';
            };
            container.append(btn, details);
        });
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
