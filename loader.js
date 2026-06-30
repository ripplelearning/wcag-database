async function initTool() {
    // 1. Set title immediately to avoid "Untitled"
    document.title = "WCAG Lookup Tool";
    
    const dataUrl = 'https://ripplelearning.github.io/wcag-database/wcag_data.js';
    const container = document.getElementById('container');
    // Set a label for the tool's container for screen readers
    container.setAttribute('aria-label', 'WCAG Lookup Tool');
    container.setAttribute('role', 'region');
    container.innerHTML = 'Loading criteria...';

    // ... (All previous style/categoryMap/helpers remain exactly the same) ...

    try {
        const response = await fetch(dataUrl, { cache: "no-cache" });
        const data = await response.json();

        container.innerHTML = `
            <input id="s" type="search" aria-label="Search WCAG Criteria" placeholder="Search... e.g. 1.1.1, buttons, tables" style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <select id="ver-f" aria-label="Filter by Version"><option value="">Version: All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select>
                <select id="lvl-f" aria-label="Filter by Level"><option value="">Level: All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select>
                <select id="cat-f" aria-label="Filter by Category"><option value="">Category: All</option>${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}</select>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite">Found 0 results</h2>
            <div id="list-container"></div>
            `;

        // ... (Render and ApplyFilter functions remain the same) ...

        // 2. Focused Restoring
        const restoreTool = () => {
            window.resizeTo(800, 600);
            window.focus();
            setTimeout(() => document.getElementById('s').focus(), 100);
        };

        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.shiftKey && e.key === 'A') { restoreTool(); }
            if (e.altKey && e.shiftKey && e.key === 'D') { resetTool(); }
            if (e.key === 'Escape') { window.resizeTo(200, 100); } // Minimize to a small state rather than 0
        });

        render(data);
        document.getElementById('s').focus();
    } catch (e) { container.innerHTML = 'Error loading data: ' + e.message; }
}
initTool();
