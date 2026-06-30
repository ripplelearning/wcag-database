async function initTool() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    container.innerHTML = 'Loading criteria...';

    const style = document.createElement('style');
    style.innerHTML = `
        .acc-content ul { list-style-type: none; padding-left: 0; margin: 0; } 
        .acc-content ul li { margin-bottom: 5px; }
        .acc-content p { margin: 0 0 10px 0; }
        .acc-content strong { display: block; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    const formatAsList = (val) => {
        const text = (val || '').toString();
        if (!text) return '<ul><li>N/A</li></ul>';
        return `<ul>${text.split('|').map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
    };

    const formatAsCommaList = (val) => (val || '').toString().replace(/\|/g, ', ') || 'N/A';

    const formatParagraphs = (val) => {
        const text = (val || '').toString();
        return text ? text.split('|').map(p => `<p>${p.trim()}</p>`).join('') : '';
    };

    const cleanForCopy = (val) => (val || '').toString().replace(/\|/g, '\n');

    try {
        const response = await fetch(dataUrl, { cache: "no-cache" });
        const data = await response.json();

        container.innerHTML = `
            <input id="s" type="search" placeholder="Search..." style="width:90%; padding:10px;">
            <div id="list-container"></div>
        `;

        const render = (list) => {
            const listContainer = document.getElementById('list-container');
            listContainer.innerHTML = '';
            ['2.2', '2.1'].forEach(ver => {
                const filteredVer = list.filter(i => i.ver == ver);
                if (filteredVer.length === 0) return;
                
                const h3 = document.createElement('h3');
                h3.textContent = `WCAG ${ver} Success Criteria`;
                listContainer.appendChild(h3);
                
                filteredVer.forEach(i => {
                    const div = document.createElement('div');
                    const desc = formatParagraphs(i.desc);
                    const failsList = formatAsList(i.failures);
                    const fixesList = formatAsList(i.fixes);
                    const disab = formatAsCommaList(i.disabilitie);
                    
                    const fullEntry = `Name: ${i.name}\n\nDescription:\n${cleanForCopy(i.desc)}\n\nFailures:\n${cleanForCopy(i.failures)}\n\nFixes:\n${cleanForCopy(i.fixes)}\n\nDisabilities: ${disab}\n\nLink: ${i.Link}`;
                    
                    div.innerHTML = `
                        <button class="acc-btn" aria-expanded="false" style="width:100%; text-align:left; padding:10px;">${i.name} (Level ${i.level})</button>
                        <div class="acc-content" style="display:none; padding:10px; border:1px solid #eee;">
                            <strong>Description:</strong>${desc}
                            <strong>Failures:</strong>${failsList}
                            <strong>Fixes:</strong>${fixesList}
                            <p><strong>Disabilities:</strong> ${disab}</p>
                            <a href="${i.Link}" target="_blank">View on W3C</a>
                            <div style="margin-top:10px;">
                                <button class="copy-btn" data-text="${fullEntry}">Copy Full Entry</button>
                                <button class="copy-btn" data-text="${cleanForCopy(i.name)}">Copy Name</button>
                                <button class="copy-btn" data-text="${cleanForCopy(i.desc)}">Copy Desc</button>
                                <button class="copy-btn" data-text="${cleanForCopy(i.failures)}">Copy Failures</button>
                                <button class="copy-btn" data-text="${cleanForCopy(i.fixes)}">Copy Fixes</button>
                                <button class="copy-btn" data-text="${i.Link || ''}">Copy Link</button>
                            </div>
                        </div>
                    `;
                    div.querySelector('.acc-btn').onclick = function() {
                        const exp = this.getAttribute('aria-expanded') === 'true';
                        this.setAttribute('aria-expanded', !exp);
                        div.querySelector('.acc-content').style.display = exp ? 'none' : 'block';
                    };
                    div.querySelectorAll('.copy-btn').forEach(b => {
                        b.onclick = () => {
                            navigator.clipboard.writeText(b.getAttribute('data-text'));
                            const original = b.textContent;
                            b.textContent = "Copied!";
                            setTimeout(() => b.textContent = original, 2000);
                        };
                    });
                    listContainer.appendChild(div);
                });
            });
        };

        render(data);
    } catch (e) { container.innerHTML = 'Error loading data: ' + e.message; }
}
initTool();
