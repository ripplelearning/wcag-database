(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';
    let popup;

    const openTool = () => {
        const w = window.screen.availWidth * 0.5;
        const h = window.screen.availHeight * 0.5;
        const options = `width=${w},height=${h},top=0,left=0,scrollbars=yes,resizable=yes`;
        
        if (!popup || popup.closed) {
            popup = window.open('', 'WCAG Lookup Tool', options);
            popup.document.write('<html><head><title>WCAG Lookup Tool</title></head><body><div id="root"><h1>Loading WCAG Data...</h1></div></body></html>');
            popup.document.close();

            // Fetch the data as text and parse manually to ensure stability
            fetch(dataUrl)
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok (" + response.status + ")");
                    return response.text();
                })
                .then(text => {
                    // Extract the JSON array from the file content
                    // Removes "window.wcagData =" and trailing "];"
                    const jsonString = text.trim().replace(/^window\.wcagData\s*=\s*/, '').replace(/;$/, '').replace(/];$/, ']');
                    const data = JSON.parse(jsonString);
                    setupPopup(data);
                })
                .catch(err => {
                    console.error("Fetch failed:", err);
                    if (popup && !popup.closed) {
                        popup.document.getElementById('root').innerHTML = "<h1>Error: " + err.message + "</h1>";
                    }
                });
        } else {
            popup.focus();
        }
    };

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <input id="s" type="search" placeholder="Search criteria..." style="width:90%; padding:10px;">
            <div id="count"></div>
            <ul id="container"></ul>
        `;
        // Add your filter/render logic here using 'data'
        console.log("Data loaded successfully with " + data.length + " items.");
    }

    // Trigger on Alt+Shift+A
    window.addEventListener('keydown', (e) => { 
        if (e.altKey && e.shiftKey && e.key === 'A') openTool(); 
    });
})();
