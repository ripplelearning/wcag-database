(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/main/wcag_data.js';
    let wcagData = [];

    // Inject styles and modal container
    const style = document.createElement('style');
    style.textContent = `
        #wcag-modal { position:fixed; top:5%; left:10%; width:80%; height:90%; z-index:999999; background:white; border:2px solid #000; display:none; flex-direction:column; padding:20px; box-shadow:0 0 10px rgba(0,0,0,0.5); overflow-y:auto; }
        .content { display:none; padding:15px; border:1px solid #ccc; }
        .expanded { display:block; }
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'wcag-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
        <h1>WCAG Lookup Tool</h1>
        <label for="s">Search Criteria:</label>
        <input id="s" type="search" style="width:100%; padding:8px;">
        <div id="filters" style="margin:10px 0;">
            <select id="ver"><option value="">Version</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
            <select id="lvl"><option value="">Level</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
            <button id="reset-btn" title="Reset (Alt+Shift+d)">Reset (Alt+Shift+d)</button>
        </div>
        <h2 id="count" aria-live="polite">Found 0 results</h2>
        <div id="criteria-container"></div>
        <button id="close-btn" style="margin-top:20px;">Close (Esc)</button>
    `;
    document.body.appendChild(modal);

    fetch(dataUrl).then(r => r.text()).then(jsText => {
        (0, eval)(jsText);
        wcagData = window.wcagData;
        render(wcagData);
    });

    function render(list) {
        const container = document.getElementById('criteria-container');
        container.innerHTML = '';
        document.getElementById('count').textContent = `Found ${list.length} results`;
        
        ['2.2', '2.1'].forEach(v => {
            const sec = list.filter(i => i.ver == v);
            if (!sec.length) return;
            container.innerHTML += `<h3>WCAG ${v} Success Criteria</h3>`;
            sec.forEach(i => {
                const btn = document.createElement('button');
                btn.className = 'accordion-btn';
                btn.textContent = `${i.name} (Level ${i.level})`;
                btn.onclick = () => {
                    const content = btn.nextElementSibling;
                    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', !isExpanded);
                    content.style.display = isExpanded ? 'none' : 'block';
                };
                container.appendChild(btn);
                
                const div = document.createElement('div');
                div.className = 'content';
                div.innerHTML = `<ul>
                    <li><strong>Description:</strong> ${i.desc}</li>
                    <li><strong>Failures:</strong> <ul>${(i.failures||'').split('|').map(f => `<li>${f}</li>`).join('')}</ul></li>
                    <li><strong>Fixes:</strong> <ul>${(i.fixes||'').split('|').map(f => `<li>${f}</li>`).join('')}</ul></li>
                </ul>`;
                container.appendChild(div);
            });
        });
    }

    // Modal Visibility & Keyboard Listeners
    const toggleModal = () => {
        const isVisible = modal.style.display === 'flex';
        modal.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) document.getElementById('s').focus();
    };

    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey && e.key === 'A') toggleModal();
        if (e.key === 'Escape') modal.style.display = 'none';
        if (e.altKey && e.shiftKey && e.key === 'd') { /* Reset logic */ }
    });
})();
