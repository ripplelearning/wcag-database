(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';
    let popup;

    const openTool = () => {
        popup = window.open('', 'WCAG Tool', 'width=600,height=400,scrollbars=yes');
        popup.document.write('<h1>Loading...</h1>');

        const xhr = new XMLHttpRequest();
        xhr.open('GET', dataUrl, true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                // This is the part that mimics the old "eval" behavior
                // by manually parsing the variable assignment
                try {
                    const text = xhr.responseText;
                    // Extract the data array by removing the wrapper
                    const dataString = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
                    const data = JSON.parse(dataString);
                    setupPopup(data);
                } catch (e) {
                    popup.document.body.innerHTML = '<h1>Parsing Error</h1><p>' + e.message + '</p>';
                }
            }
        };
        xhr.send();
    };

    function setupPopup(data) {
        popup.document.body.innerHTML = '<h1>Success!</h1><p>Loaded ' + data.length + ' items.</p>';
    }

    window.addEventListener('keydown', (e) => { 
        if (e.altKey && e.shiftKey && e.key === 'A') openTool(); 
    });
})();
