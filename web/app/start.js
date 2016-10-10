$(function () {
    // module definitions
    app.define('app/modules.js');

    // load main module
    app.require('main', function () {
        // check session
        var info = app.main.getSession();
        if (info == null) document.location = 'login.html';
        // init layout and top menu
        app.main.init();
        app.route.init('/home'); // default route
    });

    // ===========================================
    // Global AJAX Error catcher

    $(document).ajaxError(function (event, xhr, options) {
        var error = '';
        switch (xhr.status) {
            case 403:
                document.location = 'login.html';
                return;
                break;
            case 404:
                error = 'File Not Found - '+ xhr.url;
                break;
        }
        setTimeout(function () {
            if (xhr.status == 0) return; // canceled request
            w2alert('Error', xhr.status + ': '+ error);
        }, 100);
    });
});