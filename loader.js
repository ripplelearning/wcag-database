// loader.js
async function initTool() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    
    // 1. Add Escape key listener to close the window
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.close();
    });

    try {
        const response = await fetch(dataUrl, { cache: "no-cache" });
        const data = await response.json();
        
        // UI Template
        container.innerHTML = `
            <input id="s" type="search" placeholder="Search criteria..." style="width:90%; padding:10px;">
            <div id="results-count"></div>
            <div id="list-container"></div>
        `;

        const render = (list) => {
            const listContainer = document.getElementById('list-container');
            listContainer.innerHTML = '';
            document.getElementById('results-count').textContent = `Found ${list.length} results`;
            
            list.forEach(i => {
                const div = document.createElement('div');
                div.style.marginBottom = "10px";
                div.innerHTML = `
                    <button class="acc-btn" style="width:100%; text-align:left; padding:10px;">${i.name} (Level ${i.level})</button>
                    <div class="acc-content" style="display:none; padding:10px; border:1px solid #ddd;">
                        <p><strong>Description:</strong> ${i.desc}</p>
                        <p><strong>Failures:</strong> ${i.failures}</p>
                        <p><strong>Fixes:</strong> ${i.fixes}</p>
                        <button class="copy-btn" data-text="${i.name}">Copy Name</button>
                    </div>
                `;
                
                // Toggle Accordion
                div.querySelector('.acc-btn').onclick = function() {
                    const content = this.nextElementSibling;
                    const isHidden = content.style.display === 'none';
                    content.style.display = isHidden ? 'block' : 'none';
                    this.setAttribute('aria-expanded', isHidden);
                };

                // Copy Functionality
                div.querySelector('.copy-btn').onclick = function() {
                    navigator.clipboard.writeText(this.getAttribute('data-text'));
                    this.textContent = "Copied!";
                    setTimeout(() => this.textContent = "Copy Name", 2000);
                };
                
                listContainer.appendChild(div);
            });
        };

        // Filter Logic
        document.getElementById('s').oninput = (e) => {
            const val = e.target.value.toLowerCase();
            render(data.filter(i => i.name.toLowerCase().includes(val) || i.desc.toLowerCase().includes(val)));
        };

        render(data);
    } catch (e) {
        container.innerHTML = '<p>Error loading data: ' + e.message + '</p>';
    }
}

initTool();
