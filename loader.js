(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';

    fetch(dataUrl)
        .then(r => r.text())
        .then(jsText => {
            (0, eval)(jsText);
            if(window.wcagData) {
                createIframeUI(window.wcagData);
            }
        });

    function createIframeUI(data) {
        // Create an Iframe
        const frame = document.createElement('iframe');
        frame.style.cssText = 'position:fixed; top:20px; right:20px; width:400px; height:80vh; z-index:2147483647; border:2px solid #000; border-radius:8px;';
        document.body.appendChild(frame);

        // Write content inside the iframe
        const doc = frame.contentDocument || frame.contentWindow.document;
        doc.open();
        doc.write(`
            <style>body { font-family:sans-serif; padding:10px; background:#fff; }</style>
            <h3>WCAG Matrix</h3>
            <input id="s" placeholder="Search..." style="width:90%;">
            <div id="r"></div>
        `);
        doc.close();

        // Inject search logic into the Iframe's document
        doc.querySelector('#s').oninput = (e) => {
            const query = e.target.value.toLowerCase();
            const results = data.filter(i => i.name.toLowerCase().includes(query));
            doc.querySelector('#r').innerHTML = results.map(i => `<p>${i.name}</p>`).join('');
        };
    }
})();
