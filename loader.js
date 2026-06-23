(function() {
    const dataUrl = 'https://raw.githubusercontent.com/ripplelearning/wcag-database/refs/heads/main/wcag_data.js';

    // The official list
    const officialCriteria = [
        "1.1.1 Non-text Content", "1.2.1 Audio-only and Video-only (Prerecorded)", "1.2.2 Captions (Prerecorded)", "1.2.3 Audio Description or Media Alternative (Prerecorded)", "1.2.4 Captions (Live)", "1.2.5 Audio Description (Prerecorded)", "1.2.6 Sign Language (Prerecorded)", "1.2.7 Extended Audio Description (Prerecorded)", "1.2.8 Media Alternative (Prerecorded)", "1.2.9 Audio-only (Live)", "1.3.1 Info and Relationships", "1.3.2 Meaningful Sequence", "1.3.3 Sensory Characteristics", "1.3.4 Orientation", "1.3.5 Identify Input Purpose", "1.3.6 Identify Purpose", "1.4.1 Use of Color", "1.4.2 Audio Control", "1.4.3 Contrast (Minimum)", "1.4.4 Resize Text", "1.4.5 Images of Text", "1.4.6 Contrast (Enhanced)", "1.4.7 Low or No Background Audio", "1.4.8 Visual Presentation", "1.4.9 Images of Text (No Exception)", "1.4.10 Reflow", "1.4.11 Non-text Contrast", "1.4.12 Text Spacing", "1.4.13 Content on Hover or Focus", "2.1.1 Keyboard", "2.1.2 No Keyboard Trap", "2.1.3 Keyboard (No Exception)", "2.1.4 Character Key Shortcuts", "2.2.1 Timing Adjustable", "2.2.2 Pause, Stop, Hide", "2.2.3 No Timing", "2.2.4 Interruptions", "2.2.5 Re-authenticating", "2.2.6 Timeouts", "2.3.1 Three Flashes or Below Threshold", "2.3.2 Three Flashes", "2.3.3 Animation from Interactions", "2.4.1 Bypass Blocks", "2.4.2 Page Titled", "2.4.3 Focus Order", "2.4.4 Link Purpose (In Context)", "2.4.5 Multiple Ways", "2.4.6 Headings and Labels", "2.4.7 Focus Visible", "2.4.8 Location", "2.4.9 Link Purpose (Link Only)", "2.4.10 Section Headings", "2.4.11 Focus Not Obscured (Minimum)", "2.4.12 Focus Not Obscured (Enhanced)", "2.4.13 Focus Appearance", "2.5.1 Pointer Gestures", "2.5.2 Pointer Cancellation", "2.5.3 Label in Name", "2.5.4 Motion Actuation", "2.5.5 Target Size (Enhanced)", "2.5.6 Concurrent Input Mechanisms", "2.5.7 Dragging Movements", "2.5.8 Target Size (Minimum)", "3.1.1 Language of Page", "3.1.2 Language of Parts", "3.1.3 Unusual Words", "3.1.4 Abbreviations", "3.1.5 Reading Level", "3.1.6 Pronunciation", "3.2.1 On Focus", "3.2.2 On Input", "3.2.3 Consistent Navigation", "3.2.4 Consistent Identification", "3.2.5 Change on Request", "3.2.6 Consistent Help", "3.2.7 Visible Controls", "3.3.1 Error Identification", "3.3.2 Labels or Instructions", "3.3.3 Error Suggestion", "3.3.4 Error Prevention (Legal, Financial, Data)", "3.3.5 Help", "3.3.6 Error Prevention (All)", "3.3.7 Redundant Entry", "3.3.8 Accessible Authentication (Minimum)", "3.3.9 Accessible Authentication (Enhanced)", "4.1.1 Parsing", "4.1.2 Name, Role, Value", "4.1.3 Status Messages"
    ];

    // Helper function to "normalize" names (removes casing and hyphens/spaces to compare accurately)
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const openTool = () => {
        const popup = window.open('', 'WCAGTool', 'width=800,height=600,scrollbars=yes,resizable=yes');
        if (!popup) { alert("Popup blocked!"); return; }

        popup.document.open();
        popup.document.write(`<html><body><h1>Checking Data...</h1><div id="root"></div></body></html>`);
        popup.document.close();

        const xhr = new XMLHttpRequest();
        xhr.open('GET', dataUrl, true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                const text = xhr.responseText;
                const data = JSON.parse(text.substring(text.indexOf('['), text.lastIndexOf(']') + 1));
                
                // Map the loaded items to a set of normalized names
                const loadedNames = new Set(data.map(i => normalize(i.name)));
                
                // Compare using normalized names
                const missing = officialCriteria.filter(name => !loadedNames.has(normalize(name)));

                popup.document.getElementById('root').innerHTML = `
                    <h3>Missing Criteria (Total: ${missing.length}):</h3>
                    <ul style="color: red;">${missing.map(m => `<li>${m}</li>`).join('')}</ul>
                `;
            }
        };
        xhr.send();
    };

    window.addEventListener('keydown', (e) => { 
        if (e.altKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            openTool();
        }
    });
})();
