(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';

    const openTool = () => {
        const popup = window.open('', 'WCAGTool', 'width=600,height=400,scrollbars=yes,resizable=yes');
        popup.document.body.innerHTML = '<h1 id="status">Loading...</h1>';

        const xhr = new XMLHttpRequest();
        xhr.open('GET', dataUrl, true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                const text = xhr.responseText;
                const start = text.indexOf('[');
                const end = text.lastIndexOf(']') + 1;
                
                // Let's get the specific JSON slice
                const jsonString = text.substring(start, end);
                
                try {
                    const data = JSON.parse(jsonString);
                    popup.document.getElementById('status').innerText = "Success! " + data.length + " items.";
                } catch (e) {
                    // This is the important part:
                    popup.document.body.innerHTML = `
                        <h1>Parsing Error</h1>
                        <p>${e.message}</p>
                        <p><b>Preview of what I tried to parse:</b></p>
                        <textarea style="width:90%; height:100px;">${jsonString.substring(0, 200)}...</textarea>
                    `;
                }
            }
        };
        xhr.send();
    };

    window.addEventListener('keydown', (e) => { 
        if (e.altKey && e.shiftKey && e.key === 'A') openTool(); 
    });
})();
