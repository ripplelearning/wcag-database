(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';

    // 1. Fetch the text using a helper function to bypass common blocks
    fetch(dataUrl)
        .then(response => response.text())
        .then(jsText => {
            // 2. Create a "Blob" (a fake local file)
            const blob = new Blob([jsText], {type: 'application/javascript'});
            const blobUrl = URL.createObjectURL(blob);

            // 3. Inject the local blob URL instead of the remote GitHub URL
            const script = document.createElement('script');
            script.src = blobUrl;
            script.onload = () => {
                if (typeof window.wcagData !== 'undefined') {
                    openTool(window.wcagData);
                } else {
                    alert("Script loaded, but wcagData not found.");
                }
            };
            document.head.appendChild(script);
        })
        .catch(err => {
            alert("Still blocked! Error: " + err);
        });

    function openTool(data) {
        const popup = window.open('', 'WCAG Tool', 'width=800,height=600');
        popup.document.write('<h1>Loaded! Rendering...</h1>');
        // ... (Render your data here)
    }
})();
