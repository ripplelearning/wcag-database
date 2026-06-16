(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';

    fetch(dataUrl)
        .then(r => r.text())
        .then(jsText => {
            (0, eval)(jsText);
            if(window.wcagData) {
                createShadowUI(window.wcagData);
            }
        });

    function createShadowUI(data) {
        // Create a host element
        const host = document.createElement('div');
        document.body.appendChild(host);
        
        // Create a Shadow DOM
        const shadow = host.attachShadow({mode: 'open'});
        
        // Add styling that won't leak or be overridden
        const style = document.createElement('style');
        style.textContent = `
            .wrapper { position:fixed; top:20px; right:20px; width:350px; background:white; z-index:2147483647; border:1px solid #000; padding:10px; font-family:sans-serif; }
        `;
        shadow.appendChild(style);

        // Build UI inside shadow
        const container = document.createElement('div');
        container.className = 'wrapper';
        container.innerHTML = `<h3>WCAG Matrix</h3><input id="search" placeholder="Search..."><div id="res"></div>`;
        shadow.appendChild(container);

        // Add internal logic
        container.querySelector('#search').oninput = (e) => {
            const res = container.querySelector('#res');
            res.innerHTML = data.filter(i => i.name.toLowerCase().includes(e.target.value.toLowerCase()))
                .map(i => `<p>${i.name}</p>`).join('');
        };
    }
})();
