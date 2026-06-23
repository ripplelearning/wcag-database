(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';
    let popup;

    const openTool = () => {
        const options = 'width=600,height=400,scrollbars=yes,resizable=yes';
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Tool', options);
            popup.document.write('<h1>Loading...</h1>');
            
            fetch(dataUrl)
                .then(r => {
                    if (!r.ok) throw new Error("HTTP " + r.status);
                    return r.text();
                })
                .then(text => {
                    // Diagnostic step: log the first 50 chars to see what we actually got
                    console.log("Raw file preview:", text.substring(0, 50));
                    
                    const clean = text.trim().replace(/^window\.wcagData\s*=\s*/, '').replace(/;$/, '').replace(/];$/, ']');
                    const data = JSON.parse(clean);
                    popup.document.write('<h1>Data Loaded!</h1>');
                    // setupPopup(data); // We'll trigger this after we confirm the fetch works
                })
                .catch(err => {
                    console.error("DEBUG ERROR:", err);
                    popup.document.body.innerHTML = `<h1>Debug Error:</h1><p>${err.message}</p><p>Check Console (F12) for more.</p>`;
                });
        }
    };

    window.addEventListener('keydown', (e) => { 
        if (e.altKey && e.shiftKey && e.key === 'A') openTool(); 
    });
})();
