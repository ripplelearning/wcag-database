// loader.js
async function initTool() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    const announcer = document.getElementById('sr-announcer');

    try {
        const response = await fetch(dataUrl, { cache: "no-cache" });
        const data = await response.json();

        // UI Template with accessibility hooks
        container.innerHTML = `
            <label for="s">Search Criteria:</label><br>
            <input id="s" type="search" style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <select id="ver-f"><option value="">Version: All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <select id="lvl-f"><option value="">Level: All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite">Found 0 results</h2>
            <div id="list-container"></div>
            <footer style="margin-top: 40px; border-top: 1px solid #ccc;">
                <details>
                    <summary style="font-weight:bold; cursor:pointer;">How to use this tool</summary>
                    <ul>
                        <li><strong>Alt+Shift+A:</strong> Restore Tool</li>
                        <li><strong>Alt+Shift+D:</strong> Reset Filters</li>
                        <li><strong>Escape:</strong> Minimize/Hide Tool</li>
                    </ul>
                </details>
            </footer>
        `;

        const render = (list) => {
            const listContainer = document.getElementById('list-container');
            listContainer.innerHTML = '';
            const msg = `Found ${list.length} results`;
            document.getElementById('count').textContent = msg;
            if(announcer) announcer.textContent = msg;

            ['2.2', '2.1'].forEach(ver => {
                const section = list.filter(i => i.ver == ver);
                if (!section.length) return;

                const h3 = document.createElement('h3');
                h3.textContent = `WCAG ${ver} Success Criteria`;
                listContainer.appendChild(h3);

                section.forEach(i => {
                    const div = document.createElement('div');
                    div.style.marginBottom = "5px";
                    div.innerHTML = `
                        <button class="acc-btn" aria-expanded="false" style="width:100%; text-align:left; padding:10px;">${i.name} (Level ${i.level})</button>
                        <div class="acc-content" style="display:none; padding:10px; border:1px solid #eee;">
                            <p><strong>Description:</strong> ${i.desc}</p>
                            <p><strong>Failures:</strong> ${i.failures}</p>
                            <p><strong>Fixes:</strong> ${i.fixes}</p>
                            <a href="${i.Link}" target="_blank">View on W3C</a>
                            <div style="margin-top:10px;">
                                <button class="copy-btn" data-text="${i.name}">Copy Name</button>
                                <button class="copy-btn" data-text="${i.failures}">Copy Failures</button>
                                <button class="copy-btn" data-text="${i.fixes}">Copy Fixes</button>
                                <button class="copy-btn" data-text="${i.Link}">Copy Link</button>
                                <button class="copy-btn" data-text="Name: ${i.name}\nDesc: ${i.desc}\nFailures: ${i.failures}\nFixes: ${i.fixes}\nLink: ${i.Link}">Copy Full</button>
                            </div>
                        </div>
                    `;
                    
                    // Accordion Logic (Single Open)
                    div.querySelector('.acc-btn').onclick = function() {
                        const content = this.nextElementSibling;
                        const isHidden = content.style.display === 'none';
                        document.querySelectorAll('.acc-content').forEach(el => el.style.display = 'none');
                        document.querySelectorAll('.acc-btn').forEach(el => el.setAttribute('aria-expanded', 'false'));
                        if(isHidden) { content.style.display = 'block'; this.setAttribute('aria-expanded', 'true'); }
                    };

                    // Copy Logic
                    div.querySelectorAll('.copy-btn').forEach(btn => {
                        btn.onclick = function() {
                            navigator.clipboard.writeText(this.getAttribute('data-text'));
                            const originalText = this.textContent;
                            this.textContent = "Copied!";
                            setTimeout(() => this.textContent = originalText, 2000);
                        };
                    });
                    listContainer.appendChild(div);
                });
            });
        };

        const applyFilters = () => {
            const q = document.getElementById('s').value.toLowerCase();
            const v = document.getElementById('ver-f').value;
            const l = document.getElementById('lvl-f').value;
            render(data.filter(i => 
                (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)) &&
                (v === "" || i.ver == v) && (l === "" || i.level === l)
            ));
        };

        // Event Listeners
        ['s', 'ver-f', 'lvl-f'].forEach(id => document.getElementById(id).onchange = applyFilters);
        document.getElementById('s').oninput = applyFilters;
        document.getElementById('reset-btn').onclick = () => { window.location.reload(); };
        
        // Escape to shrink
        document.addEventListener('keydown', (e) => { 
            if (e.key === 'Escape') { window.resizeTo(0, 0); window.blur(); } 
        });

        render(data);
        document.getElementById('s').focus();
    } catch (e) {
        container.innerHTML = 'Error loading data: ' + e.message;
    }
}
initTool();
