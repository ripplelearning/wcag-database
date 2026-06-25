(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let popup;

    const categoryMap = {
        "ARIA & Live Regions": "ARIA|Live|Region|Role|State",
        "Audio & Video": "Multimedia|Audio|Video|Captions|Transcripts|Media",
        "Buttons & Navigation": "Navigation|Link|Skip|Bypass|Button|Menu|Interaction",
        "Color & Contrast": "Color|Contrast|Luminance|Foreground|Background",
        "Focus & Keyboard": "Keyboard|Focus|Tabindex|Modal|Operable",
        "Forms & Inputs": "Forms|Input|Autocomplete|Authentication|Labels",
        "Images & Graphics": "Images|Graphic|Icons|Charts|Alt Text",
        "Interactions": "Interactions|Pointer|Dragging|Input Modalities|Gestures",
        "Language & Text": "Text|Language|Jargon|Acronym|Pronunciation|Readability",
        "Layout & Structure": "Layout|Structure|Semantics|Reading Order|Reflow|CSS|Grouping",
        "Mobile & Touch": "Mobile|Orientation|Tap Targets|Touch|Sensors",
        "Motion & Animation": "Animation|Reduced Motion|Seizure|Flash|Blinking",
        "Notifications & Errors": "Error|Notifications|Alert|Status|Validation",
        "Time & Timeouts": "Timeouts|Refresh|Expiration|Interruptions",
        "Tooltips & Overlays": "Tooltips|Overlays|Popups|Dialog|Hover|Focus"
    };

    const openTool = () => {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        const options = `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`;
        
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Lookup Tool', options);
            popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><div id="root"><h1>Loading WCAG Data...</h1></div></body></html>');
            popup.document.close();
            
            const script = popup.document.createElement('script');
            script.src = dataUrl;
            script.onload = () => setupPopup(popup.window.wcagData);
            popup.document.head.appendChild(script);
        } else { popup.focus(); }
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.style.cssText = "font-family:sans-serif; padding:20px;";
        
        doc.body.innerHTML = `<h1>WCAG Lookup Tool</h1><div id="container"></div>`;

        // SAFELY HANDLE CLIPS: Use dataset instead of string interpolation for quotes
        doc.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-trigger')) {
                const text = e.target.dataset.clipboardText;
                navigator.clipboard.writeText(text).then(() => {
                    const original = e.target.textContent;
                    e.target.textContent = "Copied!";
                    setTimeout(() => e.target.textContent = original, 2000);
                });
            }
        });

        // Navigation for Ctrl+Up/Down
        doc.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                e.preventDefault();
                const btns = Array.from(doc.querySelectorAll('#container button[aria-expanded]'));
                const idx = btns.indexOf(doc.activeElement);
                let next = e.key === 'ArrowDown' ? (idx + 1) : (idx - 1 + btns.length);
                btns[next % btns.length].focus();
            }
        });

        const render = (list) => {
            const container = doc.getElementById('container');
            container.innerHTML = '';
            list.forEach((i) => {
                const btn = doc.createElement('button');
                const details = doc.createElement('div');
                
                btn.textContent = `${i.name} (Level ${i.level})`;
                btn.style.cssText = "display:block; width:100%; text-align:left; padding:10px; margin-top:5px;";
                btn.setAttribute('aria-expanded', 'false');
                
                // Helper to create safe buttons
                const createBtn = (label, val) => {
                    const b = doc.createElement('button');
                    b.className = "copy-trigger";
                    b.textContent = label;
                    b.dataset.clipboardText = val; // SAFE: No escaping issues
                    return b;
                };

                details.style.display = 'none';
                details.append(createBtn("Copy Full", `Name: ${i.name}\nDesc: ${i.desc}\nFailures: ${i.failures}\nFixes: ${i.fixes}\nLink: ${i.Link}`));
                details.append(createBtn("Copy Name", i.name));
                details.append(createBtn("Copy Failures", i.failures));
                details.append(createBtn("Copy Fixes", i.fixes));
                details.append(createBtn("Copy Link", i.Link));

                btn.onclick = () => {
                    const isExp = details.style.display === 'block';
                    doc.querySelectorAll('#container div').forEach(d => d.style.display = 'none');
                    doc.querySelectorAll('#container button[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
                    if (!isExp) { details.style.display = 'block'; btn.setAttribute('aria-expanded', 'true'); }
                };
                container.append(btn, details);
            });
        };
        render(data);
    }

    window.addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.key === 'A') openTool(); });
    openTool();
})();
