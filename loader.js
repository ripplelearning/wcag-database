async function initTool() {
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    
    const style = document.createElement('style');
    // CSS for spacing without blank lines
    style.innerHTML = `
        .acc-content ul { list-style-type: none; padding-left: 0; } 
        .acc-content ul li { margin-bottom: 5px; }
        .acc-content p { margin-bottom: 10px; margin-top: 0; }
    `;
    document.head.appendChild(style);

    // ... (rest of your categoryMap, announcer, and helper functions)

    const formatText = (text) => (text ? text.toString().replace(/\|/g, '<br><br>') : '');
    const formatAsList = (text) => {
        if (!text) return '<ul><li>N/A</li></ul>';
        return `<ul>${text.toString().split('|').map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
    };
    const formatAsCommaList = (text) => text ? text.toString().replace(/\|/g, ', ') : 'N/A';

    // ... (rest of the logic)

    const render = (list) => {
        // ... (inside the loop)
        const desc = formatText(i.desc);
        const failsList = formatAsList(i.failures);
        const fixesList = formatAsList(i.fixes);
        const disab = formatAsCommaList(i.disabilitie);
        
        // Single newlines for copy text to avoid empty blank lines
        const fullEntry = `Name: ${i.name}\nDescription:\n${i.desc.replace(/\|/g, '\n')}\nFailures:\n${i.failures.replace(/\|/g, '\n')}\nFixes:\n${i.fixes.replace(/\|/g, '\n')}\nDisabilities: ${disab}\nLink: ${i.Link}`;
        
        div.innerHTML = `
            <button class="acc-btn" aria-expanded="false" style="width:100%; text-align:left; padding:10px;">${i.name} (Level ${i.level})</button>
            <div class="acc-content" style="display:none; padding:10px; border:1px solid #eee;">
                <p><strong>Description:</strong><br>${desc}</p>
                <p><strong>Failures:</strong></p>${failsList}
                <p><strong>Fixes:</strong></p>${fixesList}
                <p><strong>Disabilities:</strong> ${disab}</p>
                <a href="${i.Link}" target="_blank">View on W3C</a>
                <div style="margin-top:10px;">
                    <button class="copy-btn" data-text="${fullEntry}">Copy Full Entry</button>
                    </div>
            </div>
        `;
        // ... (rest of the code)
    };
    // ... (rest of the code)
}
initTool();
