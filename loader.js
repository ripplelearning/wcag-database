javascript:(function(){
    /* WCAG Lookup Tool Bookmarklet */
    /* Version: 2026.06.15 - Synchronized Flight Build */
    
    if (document.getElementById('wcag-lookup-side-pane')) {
        return;
    }

    const host = document.createElement('div');
    host.id = 'wcag-lookup-side-pane';
    host.style.position = 'fixed';
    host.style.top = '0';
    host.style.right = '0';
    host.style.width = '420px';
    host.style.height = '100vh';
    host.style.zIndex = '2147483647';
    host.style.boxShadow = '-4px 0 16px rgba(0,0,0,0.3)';
    host.style.backgroundColor = '#121212';
    document.body.appendChild(host);

    const shadow = host.attachShadow({mode: 'closed'});

    const style = document.createElement('style');
    style.textContent = `
        :host {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #e0e0e0;
            box-sizing: border-box;
        }
        .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            background: #121212;
            border-left: 2px solid #333;
        }
        .header {
            padding: 16px;
            background: #1f1f1f;
            border-bottom: 1px solid #333;
        }
        .header h1 {
            margin: 0 0 12px 0;
            font-size: 1.25rem;
            color: #fff;
            font-weight: 600;
        }
        .controls {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
        }
        select, input {
            background: #2a2a2a;
            border: 1px solid #444;
            color: #fff;
            padding: 8px;
            border-radius: 4px;
            font-size: 0.875rem;
        }
        select:focus, input:focus {
            outline: 2px solid #00bcd4;
            border-color: transparent;
        }
        input {
            flex-grow: 1;
        }
        .content {
            flex-grow: 1;
            overflow-y: auto;
            padding: 16px;
        }
        .criterion-card {
            background: #1f1f1f;
            border: 1px solid #333;
            border-radius: 6px;
            padding: 14px;
            margin-bottom: 16px;
        }
        .criterion-card:hover {
            border-color: #444;
        }
        .meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .id-title {
            font-weight: 700;
            color: #00bcd4;
            text-decoration: none;
        }
        .id-title:focus {
            outline: 2px solid #00bcd4;
            outline-offset: 2px;
        }
        .level {
            background: #333;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: bold;
            color: #fff;
        }
        .level.A { border-left: 3px solid #ff5722; }
        .level.AA { border-left: 3px solid #ffc107; color: #121212; background: #ffc107; }
        .level.AAA { border-left: 3px solid #4caf50; }
        .desc-block {
            margin: 0 0 12px 0;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        .section-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #888;
            margin: 8px 0 4px 0;
            font-weight: 700;
        }
        .matrix-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 6px;
        }
        .profile-tag {
            background: #252d3a;
            color: #90caf9;
            border: 1px solid #1e466e;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.75rem;
        }
        .close-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            background: transparent;
            border: none;
            color: #888;
            font-size: 1.25rem;
            cursor: pointer;
            padding: 4px 8px;
        }
        .close-btn:hover, .close-btn:focus {
            color: #fff;
            outline: 2px solid #00bcd4;
        }
    `;
    shadow.appendChild(style);

    const container = document.createElement('div');
    container.className = 'container';

    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
        <h1>WCAG Side-Pane Audit Reference</h1>
        <button class="close-btn" aria-label="Close Pane">×</button>
        <div class="controls">
            <select id="version-filter" aria-label="WCAG Version">
                <option value="2.2">WCAG 2.2</option>
                <option value="2.1">WCAG 2.1</option>
            </select>
            <input type="text" id="search-input" placeholder="Search criteria, techniques, profiles..." aria-label="Search Audit Data">
        </div>
    `;
    container.appendChild(header);

    const content = document.createElement('div');
    content.className = 'content';
    container.appendChild(content);
    shadow.appendChild(container);

    /* Immutable Synchronized Dataset From Flight Cycles */
    const criteriaData = [
        {
            id: "3.2.2",
            title: "On Input",
            level: "A",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#on-input",
            url22: "https://www.w3.org/TR/WCAG22/#on-input",
            desc: "Changing the setting of any user interface component does not automatically cause a change of context unless the user has been advised of the behavior before using the component.",
            failure: "Failure F36 occurs when an input field automatically submits its enclosing form context instantly upon modification without an explicit user action trigger.",
            technique: "Technique G80 and G13 mandate providing an explicit form submission button to execute context changes safely rather than relying on automatic element changes.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.2.3",
            title: "Consistent Navigation",
            level: "AA",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#consistent-navigation",
            url22: "https://www.w3.org/TR/WCAG22/#consistent-navigation",
            desc: "Navigational mechanisms that are repeated on multiple Web pages within a set of Web pages occur in the same relative order each time they are repeated, unless a change is initiated by the user.",
            failure: "Failure occurs when dynamic side navigation links shift their structural slots across application pages, breaking muscle memory and programmatic patterns.",
            technique: "Technique G61 ensures that components are systematically mapped using master layouts to guarantee structural consistency across the whole interface footprint.",
            profiles: ["Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities"]
        },
        {
            id: "3.2.4",
            title: "Consistent Identification",
            level: "AA",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#consistent-identification",
            url22: "https://www.w3.org/TR/WCAG22/#consistent-identification",
            desc: "Components that have the same functionality within a set of Web pages are identified consistently.",
            failure: "Failure occurs when matching functions use conflicting text strings, such as a checkmark icon indicating save on one page but complete on another.",
            technique: "Technique G197 mandates standardizing all duplicate elements with identical alternative labels and text components across the template matrix.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.2.5",
            title: "Change on Request",
            level: "AAA",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#change-on-request",
            url22: "https://www.w3.org/TR/WCAG22/#change-on-request",
            desc: "Changes of context are initiated only by user request or a mechanism is available to turn off such changes.",
            failure: "Failure occurs when automated platform redirects, unexpected popups, or layout refreshes shift the application state without an explicit user interaction.",
            technique: "Technique G110 handles context shifts safely by deploying manual trigger pathways that allow users to intentionally request all layout transformations.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.2.6",
            title: "Consistent Help",
            level: "A",
            versions: ["2.2"],
            url22: "https://www.w3.org/TR/WCAG22/#consistent-help",
            desc: "If a Web page contains any of the following help mechanisms, and those mechanisms are repeated on multiple Web pages within a set of Web pages, they occur in the same relative order: human contact details, contact mechanism, self-help option, or automated support mechanism.",
            failure: "Failure occurs when repeated support blocks shift locations across pages, such as placing a live chat widget in the footer on one layout but floating it dynamically on another.",
            technique: "Technique ensures a fixed structural anchor is used across all views to bind repeating communication blocks into an unchanging order path.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.3.1",
            title: "Error Identification",
            level: "A",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#error-identification",
            url22: "https://www.w3.org/TR/WCAG22/#error-identification",
            desc: "If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.",
            failure: "Failure occurs when errors are flagged purely via visual styling or sound chimes without providing accessible text indicators detailing the mistake.",
            technique: "Techniques G83, G85, and H89 require wrapping error feedback logs in programmatic containers bound to inputs and broadcasting them through live alert regions.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.3.2",
            title: "Labels or Instructions",
            level: "A",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#labels-or-instructions",
            url22: "https://www.w3.org/TR/WCAG22/#labels-or-instructions",
            desc: "Labels or instructions are provided when content requires user input.",
            failure: "Failure F82 occurs when disappearing placeholder strings are used as labels, causing the structural identifier to vanish as soon as data entry begins.",
            technique: "Techniques G184 and H44 mandate keeping permanent visual labels visible and providing format instructions outside the input boundaries.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.3.3",
            title: "Error Suggestion",
            level: "AA",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#error-suggestion",
            url22: "https://www.w3.org/TR/WCAG22/#error-suggestion",
            desc: "If an input error is automatically detected and suggestions for correction are known, then the suggestions are provided to the user, unless it would jeopardize the security or purpose of the content.",
            failure: "Failure occurs when an interface flags an invalid submission with generic notifications like 'Invalid Entry' without giving specific formatting instructions.",
            technique: "Techniques G177 and G84 mandate parsing input entries programmatically and rendering syntax correction hints inside the validation notice block, for example, 'Password requires 1 uppercase letter'.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.3.4",
            title: "Error Prevention (Legal, Financial, Data)",
            level: "AA",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#error-prevention-legal-financial-data",
            url22: "https://www.w3.org/TR/WCAG22/#error-prevention-legal-financial-data",
            desc: "For Web pages that cause legal commitments or financial transactions for the user to occur, that modify or delete user-controllable data in data storage systems, or that submit user test responses, the submission must be Reversible (allowing submissions to be undone), Checked (automatically evaluated for input data errors with an opportunity for user correction), or Confirmed (presented on a distinct pre-submission overview phase requiring a deliberate confirmation click).",
            failure: "Failure occurs when finalizing high-stakes tasks like online bank wire transfers or permanent account termination files instantly upon click without a secondary confirmation screen or edit dashboard view.",
            technique: "Techniques G164, G155, and G168 ensure safety by providing a final transaction verification screen featuring structured edit checks, allowing users to cancel and undo actions, or mandating an explicit pre-submission overview phase.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.3.5",
            title: "Help",
            level: "AAA",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#help",
            url22: "https://www.w3.org/TR/WCAG22/#help",
            desc: "Context-sensitive help is available.",
            failure: "Failure occurs when advanced, custom, or deeply specialized form elements offer no inline explanations, forcing users to leave the workflow to search global documentation.",
            technique: "Techniques G89, G194, and H89 ensure clarity by embedding localized tooltips, providing easily discoverable inline help links anchored to text parameters, or implementing persistent sidebar support breakdowns.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.3.6",
            title: "Error Prevention (All)",
            level: "AAA",
            versions: ["2.2"],
            url22: "https://www.w3.org/TR/WCAG22/#error-prevention-all",
            desc: "For Web pages that require the user to submit information, the submission must be Reversible (allowing submissions to be completely undone or rolled back), Checked (evaluated for input data errors with an opportunity for user correction), or Confirmed (presented on an explicit pre-submission overview phase that details all input data and requires a deliberate confirmation action before final execution).",
            failure: "Failure occurs when general form submissions process instantaneously on click without giving the user any option to review, modify, or roll back their data entries.",
            technique: "Techniques G98 and G155 implement a comprehensive validation check overlay across all fields, and integrate a native 100% data rolling mechanism to reverse any submission state modifications.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.3.7",
            title: "Redundant Entry",
            level: "A",
            versions: ["2.2"],
            url22: "https://www.w3.org/TR/WCAG22/#redundant-entry",
            desc: "Information previously entered by the user in the same session that is required to be entered again is either auto-populated or available for the user to select, except where re-entering the information is essential, required for security, or the previous data is no longer valid.",
            failure: "Failure occurs when checkout or multi-step profile setups force users to manually type long text sequences multiple times without persistence support.",
            technique: "Technique G220 dictates that systems auto-populate repeated fields using backend data models or include a functional checkbox control (e.g., 'Billing address same as shipping address') that clones inputs instantly.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.3.8",
            title: "Accessible Authentication (Minimum)",
            level: "AA",
            versions: ["2.2"],
            url22: "https://www.w3.org/TR/WCAG22/#accessible-authentication-minimum",
            desc: "A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process unless that step provides an alternative method or a mechanism to help the user complete it.",
            failure: "Failure occurs when scripts restrict users from using copy-and-paste commands into password entry controls, forcing manual code entry.",
            technique: "Technique G221 ensures password fields fully support native operating system copy-and-paste operations, enable WebAuthn biometric login sequences, or supply simple magic links via email.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "3.3.9",
            title: "Accessible Authentication (Enhanced)",
            level: "AAA",
            versions: ["2.2"],
            url22: "https://www.w3.org/TR/WCAG22/#accessible-authentication-enhanced",
            desc: "A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process unless that step provides an alternative method or a mechanism to help the user complete it or identify familiar objects.",
            failure: "Failure occurs when an authentication gate requires transcription of complex alphanumeric sequences or visual puzzle solving without passwordless biometric pathways.",
            technique: "Technique G221 mandates building authentication pathways relying exclusively on native hardware authentication mechanisms, standard copy/paste actions, or email magic link verifications.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "4.1.1",
            title: "Parsing",
            level: "A",
            versions: ["2.1"],
            url21: "https://www.w3.org/TR/WCAG21/#parsing",
            desc: "[Retired in 2.2] In content implemented using markup languages, elements have complete start and end tags, elements are nested according to their specifications, elements do not contain duplicate attributes, and any IDs are unique, except where the specifications allow these features.",
            failure: "Failure occurs when unclosed tag structures or duplicate ID layout tokens break the underlying browser tree rendering paths.",
            technique: "Technique ensures code is processed through rigorous automated system validations to guarantee accurate layout tracking by legacy assistive technology tools.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "4.1.2",
            title: "Name, Role, Value",
            level: "A",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#name-role-value",
            url22: "https://www.w3.org/TR/WCAG22/#name-role-value",
            desc: "For all user interface components (including but not limited to: form elements, links and components generated by scripts), the name and role can be programmatically determined; states, properties, and values that can be set by the user can be programmatically set; and notification of changes to these items is available to user agents, including assistive technologies.",
            failure: "Failure occurs when custom components use generic non-semantic elements without exposing their identification metadata to the underlying accessibility tree.",
            technique: "Technique mandates ensuring that all interactive elements programmatically broadcast their distinctive accessible name properties, semantic role tags, and operational states to the layout tree.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        },
        {
            id: "4.1.3",
            title: "Status Messages",
            level: "AA",
            versions: ["2.1", "2.2"],
            url21: "https://www.w3.org/TR/WCAG21/#status-messages",
            url22: "https://www.w3.org/TR/WCAG22/#status-messages",
            desc: "In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus.",
            failure: "Failure occurs when dynamic interface text changes add structural notices to layout edges silently without alerting non-visual reading tools.",
            technique: "Technique ARIA19 requires wrapping dynamic interface feedback strings within container blocks styled with explicit ARIA live regions (such as role='status', role='log', or aria-live='polite') to announce text logs automatically.",
            profiles: ["Blind Users", "Screen Reader Users", "Low Vision Users", "Motor Disabilities", "Cognitive and Learning Disabilities", "Deaf/Hard of Hearing Users"]
        }
    ];

    function render(version, searchTxt) {
        content.innerHTML = '';
        const search = searchTxt.toLowerCase().trim();

        const filtered = criteriaData.filter(item => {
            if (!item.versions.includes(version)) return false;
            if (!search) return true;

            return (
                item.id.includes(search) ||
                item.title.toLowerCase().includes(search) ||
                item.desc.toLowerCase().includes(search) ||
                item.failure.toLowerCase().includes(search) ||
                item.technique.toLowerCase().includes(search) ||
                item.profiles.some(p => p.toLowerCase().includes(search))
            );
        });

        if (filtered.length === 0) {
            content.innerHTML = '<div style="text-align:center;color:#888;margin-top:20px;">No matching synchronized criteria discovered.</div>';
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'criterion-card';

            const activeUrl = version === '2.1' ? (item.url21 || item.url22) : item.url22;

            card.innerHTML = `
                <div class="meta">
                    <a class="id-title" href="${activeUrl}" target="_blank" title="Open W3C documentation for SC ${item.id}">
                        SC ${item.id} ${item.title}
                    </a>
                    <span class="level ${item.level}">Level ${item.level}</span>
                </div>
                <p class="desc-block">${item.desc}</p>
                <div class="section-label">Common Failure Pattern</div>
                <p class="desc-block" style="color: #ff8a80;">${item.failure}</p>
                <div class="section-label">Actionable Technique / Fix</div>
                <p class="desc-block" style="color: #b2ff59;">${item.technique}</p>
                <div class="section-label">Impacted User Matrix</div>
                <div class="matrix-container">
                    ${item.profiles.map(p => `<span class="profile-tag">${p}</span>`).join('')}
                </div>
            `;
            content.appendChild(card);
        });
    }

    /* Event Listeners */
    const versionSelect = header.querySelector('#version-filter');
    const searchInput = header.querySelector('#search-input');
    const closeBtn = header.querySelector('.close-btn');

    versionSelect.addEventListener('change', () => {
        render(versionSelect.value, searchInput.value);
    });

    searchInput.addEventListener('input', () => {
        render(versionSelect.value, searchInput.value);
    });

    closeBtn.addEventListener('click', () => {
        document.body.removeChild(host);
    });

    /* Initial Render */
    render('2.2', '');
})();
