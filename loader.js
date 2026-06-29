async function initTool() {
    // 1. Restore/Size the window upon loading
    window.resizeTo(800, 600);
    
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    const announcer = document.getElementById('sr-announcer') || (() => {
        const div = document.createElement('div');
        div.id = 'sr-announcer';
        div.setAttribute('aria-live', 'polite');
        div.style.cssText = "position:absolute; left:-9999px;";
        document.body.appendChild(div);
        return div;
    })();

    const categoryMap = { /* ... your map ... */ };

    try {
        const response = await fetch(dataUrl, { cache: "no-cache" });
        const data = await response.json();

        // UI setup...
        
        const render = (list) => {
            const listContainer = document.getElementById('list-container');
            listContainer.innerHTML = '';
            list.forEach(i => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <button class="acc-btn" aria-expanded="false">${i.name} (Level ${i.level})</button>
                    <div class="acc-content" style="display:none;">
                        <p>${i.desc}</p>
                        <button class="copy-btn" data-text="${i.name.replace(/\|/g, '\n\n')}">Copy</button>
                    </div>
                `;
                const btn = div.querySelector('.acc-btn');
                btn.onclick = () => {
                    const exp = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', !exp);
                    div.querySelector('.acc-content').style.display = exp ? 'none' : 'block';
                };
                listContainer.appendChild(div);
            });
            announcer.textContent = `Showing ${list.length} criteria.`;
        };

        const applyFilters = () => {
            const c = document.getElementById('cat-f').value;
            const filtered = data.filter(i => 
                !c || (i.tags && i.tags.some(t => new RegExp(categoryMap[c], 'i').test(t)))
            );
            render(filtered);
        };

        document.getElementById('cat-f').onchange = applyFilters;

        // Shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.shiftKey && e.key === 'A') { window.resizeTo(800, 600); window.focus(); }
            if (e.altKey && e.shiftKey && e.key === 'D') { window.location.reload(); }
            if (e.key === 'Escape') { window.resizeTo(0, 0); }
        });

        render(data);
    } catch (e) { /* ... */ }
}
initTool();
