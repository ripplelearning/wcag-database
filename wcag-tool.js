(function(){
    const PANEL_ID = 'wcag-lookup-container';
    const DATA_URL = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/index.html';
    
    const existing = document.getElementById(PANEL_ID);
    if (existing) {
        existing.style.display = existing.style.display === 'none' ? 'flex' : 'none';
        if (existing.style.display === 'flex') document.getElementById('wcag-search-input').focus();
        return;
    }

    const container = document.createElement('div');
    container.id = PANEL_ID;
    Object.assign(container.style, {
        position: 'fixed', top: '20px', right: '20px', width: '460px', height: '85vh',
        backgroundColor: '#ffffff', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', zIndex: '2147483647',
        borderRadius: '8px', padding: '20px', boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', border: '1px solid #ccc'
    });

    const styleRule = document.createElement('style');
    styleRule.textContent = `
        .wcag-card { border: 1px solid #ddd; background: #fdfdfd; margin-bottom: 10px; border-radius: 4px; overflow: hidden; font-size: 0.9rem; }
        .wcag-trigger { width: 100%; text-align: left; border: none; background: #f4f4f4; padding: 12px; font-weight: bold; font-size: 0.95rem; color: #005a9c; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .wcag-trigger:focus { background: #e6f2fa; outline: 2px solid #005a9c; outline-offset: -2px; }
        .wcag-details { padding: 14px; border-top: 1px solid #eee; background: #ffffff; display: none; }
        .wcag-card.expanded .wcag-details { display: block; }
        
        .wcag-meta-line { display: flex; justify-content: space-between; align-items: flex-start; margin: 8px 0; line-height: 1.4; color: #222; gap: 8px; }
        .wcag-meta-content { flex-grow: 1; }
        .wcag-meta-label { font-weight: bold; color: #444; }
        
        .wcag-copy-btn { border: 1px solid #ccc; background: #f9f9f9; padding: 2px 6px; font-size: 0.75rem; border-radius: 3px; cursor: pointer; color: #333; display: inline-flex; align-items: center; white-space: nowrap; }
        .wcag-copy-btn:hover { background: #eee; border-color: #999; }
        .wcag-copy-btn:focus { outline: 2px solid #005a9c; }
        .wcag-master-copy { width: 100%; padding: 6px; margin-bottom: 12px; font-weight: bold; background: #005a9c; color: white; border: none; border-radius: 4px; cursor: pointer; text-align: center; font-size: 0.8rem; }
        .wcag-master-copy:hover { background: #004471; }
    `;
    document.head.appendChild(styleRule);

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h2 style="margin:0; font-size:1.25rem; color:#111;">WCAG Lookup Tool</h2>
            <button id="wcag-close-btn" aria-label="Close Tool" style="border:none; background:none; font-size:1.5rem; cursor:pointer;">&times;</button>
        </div>
        
        <label for="wcag-search-input" style="display:block; margin-bottom:4px; font-weight:bold; font-size:0.9rem;">Search Criteria:</label>
        <input type="search" id="wcag-search-input" autocomplete="off" placeholder="e.g., Status, 4.1.3..." style="width:100%; padding:8px; box-sizing:border-box; border:2px solid #767676; border-radius:4px; margin-bottom:12px;">
        
        <div style="display:flex; gap:10px; margin-bottom:15px;">
            <div style="flex:1;">
                <label for="wcag-version-filter" style="display:block; margin-bottom:4px; font-weight:bold; font-size:0.85rem;">Version:</label>
                <select id="wcag-version-filter" style="width:100%; padding:6px; border:2px solid #767676; border-radius:4px;">
                    <option value="">All Versions</option>
                    <option value="2.1">WCAG 2.1</option>
                    <option value="2.2">WCAG 2.2</option>
                </select>
            </div>
            <div style="flex:1;">
                <label for="wcag-level-filter" style="display:block; margin-bottom:4px; font-weight:bold; font-size:0.85rem;">Level:</label>
                <select id="wcag-level-filter" style="width:100%; padding:6px; border:2px solid #767676; border-radius:4px;">
                    <option value="">All Levels</option>
                    <option value="A">Level A</option>
                    <option value="AA">Level AA</option>
                    <option value="AAA">Level AAA</option>
                </select>
            </div>
        </div>

        <div id="wcag-live-announcer" style="position:absolute; width:1px; height:1px; overflow:hidden;" aria-live="polite"></div>
        <div id="wcag-results-wrapper" style="flex-grow:1; overflow-y:auto; padding-right:5px;" role="region" aria-label="Search Results">
            <p id="wcag-status-text" style="color:#555; font-style:italic;">Scraping table from GitHub...</p>
        </div>
        <div style="font-size:0.75rem; color:#444; margin-top:10px; border-top:1px solid #ddd; padding-top:8px;">
            <strong>Shortcuts:</strong> <kbd>Alt+Shift+A</kbd> (Toggle) | <kbd>Esc</kbd> (Close) | <kbd>&darr; / &uarr;</kbd> (Navigate Accordions)
        </div>
    `;
    document.body.appendChild(container);

    const searchInput = document.getElementById('wcag-search-input');
    const versionFilter = document.getElementById('wcag-version-filter');
    const levelFilter = document.getElementById('wcag-level-filter');
    const resultsWrapper = document.getElementById('wcag-results-wrapper');
    const liveAnnouncer = document.getElementById('wcag-live-announcer');
    const statusText = document.getElementById('wcag-status-text');
    
    let wcagData = [];

    function setTemporaryText(btn, tempText) {
        const oldText = btn.textContent;
        btn.textContent = tempText;
        setTimeout(() => { btn.textContent = oldText; }, 1200);
    }

    window.addEventListener('keydown', e => {
        if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            container.style.display = container.style.display === 'none' ? 'flex' : 'none';
            if (container.style.display === 'flex') searchInput.focus();
        }
        if (e.key === 'Escape' && container.contains(document.activeElement)) container.style.display = 'none';
    });

    document.getElementById('wcag-close-btn').addEventListener('click', () => container.style.display = 'none');

    container.addEventListener('keydown', e => {
        const triggers = Array.from(resultsWrapper.querySelectorAll('.wcag-trigger'));
        const idx = triggers.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if ((document.activeElement === searchInput || document.activeElement === versionFilter || document.activeElement === levelFilter) && triggers.length > 0) {
                triggers[0].focus();
            } else if (idx < triggers.length - 1) {
                triggers[idx + 1].focus();
            }
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (idx === 0) searchInput.focus();
            else if (idx > 0) triggers[idx - 1].focus();
        }
    });

    resultsWrapper.addEventListener('click', e => {
        const btn = e.target.closest('.wcag-trigger');
        if (btn) {
            const card = btn.closest('.wcag-card');
            const isCurrentlyExpanded = card.classList.contains('expanded');
            if (isCurrentlyExpanded) {
                card.classList.remove('expanded');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                card.classList.add('expanded');
                btn.setAttribute('aria-expanded', 'true');
            }
            return;
        }

        const copyBtn = e.target.closest('.wcag-copy-btn');
        if (copyBtn) {
            const targetText = decodeURIComponent(copyBtn.getAttribute('data-copy'));
            navigator.clipboard.writeText(targetText).then(() => {
                setTemporaryText(copyBtn, 'Copied!');
            });
            return;
        }

        const masterBtn = e.target.closest('.wcag-master-copy');
        if (masterBtn) {
            const index = masterBtn.getAttribute('data-index');
            const item = wcagData[index];
            if (!item) return;

            let fullTextStr = `Success Criterion ${item.id}: ${item.title}\n`;
            item.orderedFields.forEach(f => {
                if (f.value && f.key !== 'Link') {
                    fullTextStr += `${f.label}: ${f.value}\n`;
                }
            });
            if (item.link) fullTextStr += `Link: ${item.link}\n`;

            navigator.clipboard.writeText(fullTextStr.trim()).then(() => {
                setTemporaryText(masterBtn, 'Copied Full Profile!');
            });
        }
    });

    function renderList(items) {
        if (items.length === 0) {
            resultsWrapper.innerHTML = '<p style="color:#666; font-style:italic;">No matching criteria found.</p>';
            return;
        }

        resultsWrapper.innerHTML = items.map((item, idx) => {
            let detailsHtml = '';
            
            item.orderedFields.forEach(field => {
                if (field.key === 'Link') return; // Handled explicitly at the bottom

                if (field.value) {
                    const safeValue = encodeURIComponent(field.value);
                    detailsHtml += `
                        <div class="wcag-meta-line">
                            <div class="wcag-meta-content">
                                <span class="wcag-meta-label">${field.label}:</span> ${field.value}
                            </div>
                            <button class="wcag-copy-btn" data-copy="${safeValue}" aria-label="Copy ${field.label}">Copy</button>
                        </div>
                    `;
                }
            });

            const bottomLinkHtml = item.link ? `<div style="margin-top:12px; border-top:1px dashed #eee; padding-top:8px;"><a href="${item.link}" target="_blank" style="color:#005a9c; font-weight:bold; text-decoration:underline;">Open Official WCAG Documentation &rarr;</a></div>` : '';

            return `
                <div class="wcag-card">
                    <button class="wcag-trigger" aria-expanded="false" aria-controls="panel-${idx}">
                        <span>${item.id} ${item.title}</span>
                        <span style="font-size:0.75rem; background:#005a9c; color:#fff; padding:2px 6px; border-radius:3px; white-space:nowrap;">Level ${item.level || 'N/A'}</span>
                    </button>
                    <div id="panel-${idx}" class="wcag-details">
                        <button class="wcag-master-copy" data-index="${idx}">Copy Full Success Criteria Entry</button>
                        ${detailsHtml}
                        ${bottomLinkHtml}
                    </div>
                </div>
            `;
        }).join('');
        
        liveAnnouncer.textContent = `${items.length} criteria loaded.`;
    }

    function filterResults() {
        const textVal = searchInput.value.toLowerCase();
        const versionVal = versionFilter.value;
        const levelVal = levelFilter.value.toUpperCase();

        const filtered = wcagData.filter(item => {
            const matchesText = !textVal || 
                item.id.toLowerCase().includes(textVal) ||
                item.title.toLowerCase().includes(textVal) ||
                item.description.toLowerCase().includes(textVal) ||
                item.failures.toLowerCase().includes(textVal) ||
                item.fixes.toLowerCase().includes(textVal) ||
                item.disabilityImpact.toLowerCase().includes(textVal) ||
                item.categories.toLowerCase().includes(textVal) ||
                item.tags.toLowerCase().includes(textVal);
            
            const matchesVersion = !versionVal || (item.version && item.version.includes(versionVal));
            const matchesLevel = !levelVal || (item.level && item.level.toUpperCase() === levelVal);

            return matchesText && matchesVersion && matchesLevel;
        });
        renderList(filtered);
    }

    [searchInput, versionFilter, levelFilter].forEach(el => el.addEventListener('input', filterResults));

    fetch(DATA_URL)
        .then(res => res.text())
        .then(html => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const rows = Array.from(doc.querySelectorAll('table tr')).filter(r => r.querySelector('td'));
            
            wcagData = rows.map(r => {
                const cells = Array.from(r.querySelectorAll('td')).map(c => c.textContent.trim());
                
                const rawId = cells[0] || '';
                const rawTitle = cells[1] || '';
                const cleanTitle = rawTitle.split(/\n|\r/)[0].replace(/Level\s+[A-Z]+/gi, '').replace(rawId, '').trim();

                // Explicit 10-column spreadsheet alignment structure
                const dataObj = {
                    id: rawId,
                    title: cleanTitle,
                    level: cells[1] || '',
                    description: cells[2] || '',
                    failures: cells[3] || '',
                    fixes: cells[4] || '',
                    disabilityImpact: cells[5] || '',
                    version: cells[6] || '',
                    categories: cells[7] || '',
                    tags: cells[8] || '',
                    link: cells[9] || ''
                };

                // Ordered schema for details layout mapping
                const orderedFields = [
                    { key: 'description', label: 'Description', value: dataObj.description },
                    { key: 'failures', label: 'Failures', value: dataObj.failures },
                    { key: 'fixes', label: 'Fixes (W3C Techniques)', value: dataObj.fixes },
                    { key: 'disabilityImpact', label: 'Disability Impact', value: dataObj.disabilityImpact },
                    { key: 'version', label: 'Version', value: dataObj.version },
                    { key: 'categories', label: 'Categories', value: dataObj.categories },
                    { key: 'tags', label: 'Tags', value: dataObj.tags },
                    { key: 'link', label: 'Link', value: dataObj.link }
                ];

                return {
                    ...dataObj,
                    orderedFields: orderedFields
                };
            });
            
            statusText.remove();
            renderList(wcagData);
            searchInput.focus();
        }).catch(err => { console.error(err); statusText.textContent = "Error parsing rows from GitHub layout."; });
})();
