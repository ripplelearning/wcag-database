javascript:(function(){
    var url = 'https://ripplelearning.github.io/wcag-database/tool.html';
    // Using '_blank' as the target name can sometimes bypass aggressive block filters
    var win = window.open(url, '_blank', 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no');
    if (!win || win.closed || typeof win.closed == 'undefined') {
        alert('Pop-up blocked! Please check your address bar to "Always allow pop-ups" for this site.');
    } else {
        win.focus();
    }
})();
