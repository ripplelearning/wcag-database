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
        const frame = document.createElement('iframe');
        frame.style.cssText = 'position:fixed; top:20px; right:20px; width:450px; height:80vh; z-index:2147483647; border:2px solid #000; border-radius:8px; background:white;';
        document.body.appendChild(frame);

        const doc = frame.contentDocument || frame.contentWindow.document;
        doc.write(`
            <style>body { font-family:sans-serif; padding:15px; } .card { border:1px solid #ccc; margin:5px 0; padding:5px; cursor:pointer; } </style>
            <h3>WCAG Matrix</h3>
            <input id="s" placeholder="Search criteria..." style="width:100%;">
            <button id="reset">Reset</button>
            <p id="count" aria-live="polite"></p>
            <div id="r"></div>
        `);
        doc.close();

        const render = (list) => {
            doc.querySelector('#count').textContent = `Found ${list.length} results`;
            doc.querySelector('#r').innerHTML = list.map(i => `
                <div class="card" tabindex="0" onclick="alert('${i.desc}')">
                    <strong>${i.name}</strong> (${i.ver})
                </div>
            `).join('');
        };

        render(data);

        doc.querySelector('#s').oninput = (e) => {
            const q = e.target.value.toLowerCase();
            // Search name, tags, or description
            render(data.filter(i => 
                i.name.toLowerCase().includes(q) || 
                (i.tags && i.tags.toLowerCase().includes(q)) ||
                (i.desc && i.desc.toLowerCase().includes(q))
            ));
        };

        doc.querySelector('#reset').onclick = () => {
            doc.querySelector('#s').value = '';
            render(data);
        };
    }
})();
