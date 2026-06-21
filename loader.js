(function() {
    // ... [All previous logic remains identical]

    function setupPopup(data) {
        const doc = popup.document;
        doc.body.style.fontFamily = "sans-serif";
        doc.body.style.padding = "20px";
        
        // This is the corrected block containing your requested paragraphs
        doc.body.innerHTML = `
            <h1>WCAG Lookup Tool</h1>
            <div id="sr-announcer" aria-live="assertive" style="position:absolute; left:-9999px;"></div>
            <label for="s">Search Criteria:</label><br>
            <input id="s" type="search" autocomplete="off" aria-controls="count" placeholder="e.g. 1.1.1, images, keyboard..." style="width:90%; padding:10px;">
            <div style="margin:15px 0;">
                <label>Version: <select id="ver-f"><option value="">All</option><option value="2.1">2.1</option><option value="2.2">2.2</option></select></label>
                <label>Level: <select id="lvl-f"><option value="">All</option><option value="A">A</option><option value="AA">AA</option><option value="AAA">AAA</option></select></label>
                <label>Category: 
                    <select id="cat-f">
                        <option value="">All</option>
                        ${Object.keys(categoryMap).sort().map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </label>
                <button id="reset-btn">Reset (Alt+Shift+D)</button>
            </div>
            <h2 id="count" aria-live="polite"></h2>
            <ul id="container" style="list-style-type:none; padding:0;"></ul>
            <hr style="margin-top:40px;">
            <details>
                <summary><h3>How to use this tool</h3></summary>
                <p>This WCAG Lookup Tool is a professional reference library designed to help accessibility testers, designers, and developers quickly locate specific success criteria from the Web Content Accessibility Guidelines (WCAG). It serves as a central hub for technical requirements, ensuring your digital products consistently meet global accessibility standards.</p>
                <p>To use the tool, enter keywords into the search input or use the version, level, and category filter controls to narrow down your results. When you find a criterion, click its title to expand the detailed view, where you can review failures, recommended remediation fixes, and relevant disability contexts. You can then use the integrated copy buttons to quickly extract data for your reports or project documentation.</p>
                <ul>
                    <li><strong>Alt+Shift+A:</strong> Restore tool</li>
                    <li><strong>Alt+Shift+D:</strong> Reset filters</li>
                    <li><strong>Escape:</strong> Close tool</li>
                </ul>
            </details>
        `;
        
        // ... [Rest of the script remains unchanged as per your stable version]
        // (Ensure the rest of the function logic follows here)
    }
    
    // ... [Rest of code]
})();
