/****************************************************
*  ---  Main Module: general staff
*/

app.register('main', function (files) {
    // private
    var config;
    var userInfo;
    
    // init
    eval(files['app/main/config.js']);
    app.context = config.context;
    var loc = String(document.location);
    if (loc.substr(0, 5) != 'file:' && loc.substr(0, 16) != 'http://localhost') app.context = '';

    // public
    return {
        init        : init,
        action      : action,
        getSession  : getSession,
        login       : login,
        logout      : logout,
        forget      : forget
    }

    function init () {
        // init
        $('#app-toolbar').w2toolbar(config.app_toolbar);
        $('#app-tabs').w2tabs(config.app_tabs);
        $('#app-main').w2layout(config.app_layout);
        // display
        $('#app-container').fadeIn(200);
        if (typeof app.start == 'function') app.start();
        // user name
        w2ui.app_toolbar.set('user', { text: userInfo.fname + ' ' + userInfo.lname });
    }

    function action (event) {
        // other main events are handled through routes
        switch (event.target) {            
            
            case 'user:prefs':
                app.require('profile', function () {
                    app.profile.open();
                });
                break;

            case 'user:admin':
                app.require('admin', function () {
                    app.admin.open();
                });
                break;

            case 'user:logout':
                app.main.logout();
                document.location = 'login.html';
                break;
        }
    }

    function getSession (force) {
        // if already logged in
        if (userInfo != null && force !== true) {
            return userInfo;
        }
        // login
        $.ajax({
            url   : app.context + '/session',
            type  : 'post',
            async : false,
            complete: function (xhr, status) {
                if (status != 'success') {
                    w2alert('Error', 'Error while retrieving user information');
                    return;
                }
                var tmp = $.parseJSON(xhr.responseText);
                if (tmp.status == 'success') {
                    userInfo = tmp.user;
                    userInfo.groups   = tmp.groups;
                    userInfo.roles    = tmp.roles;
                    userInfo.services = tmp.services;
                    // update toolbar name
                    if (w2ui.app_toolbar) {
                        w2ui.app_toolbar.set('user', { text: userInfo.fname + ' ' + userInfo.lname });
                    }
                }
            }
        });
        return userInfo;
    }

    function login (login, pass) {
        var success = false;
        if (login == null) login = $('#login').val().toLowerCase();
        if (pass  == null) pass  = $('#password').val().toLowerCase();
        $('#submit').html('<div class="w2ui-spinner" style="position: absolute; width: 16px; height: 16px; margin-left: -5px;"></div>&nbsp;');
        $.ajax({
            url   : app.context + '/login',
            type  : 'post',
            async : false,
            data  : {    login: login, pass: pass },
            complete: function (xhr, status) {
                $('#submit').html('Login');
                if (status != 'success') {
                    success = false;
                    return;
                }
                var data = $.parseJSON(xhr.responseText);
                if (data['status'] != 'success') {
                    success = false;
                    return;
                }
                success = true;
            }
        });
        return success;
    }

    function logout () {
        $.ajax({ 
            url : app.context + '/logout', 
            async: false 
        });
        return true;
    }

    function forget () {
        $().w2popup({
            title   : 'Reset Password',
            body    : '<div style="padding-top: 30px; text-align: center">'+
                      '        Type your email address <div style="height: 12px;"></div>'+
                      '        <input type="text" id="email" size="50" style="padding: 4px; font-size: 13px; border-radius: 4px; border: 1px solid silver;">'+
                      '</div>',
            buttons : '<button class="btn" onclick="$().w2popup(\'close\')">Cancel</button>'+
                      '<button class="btn btn-green" id="request">Request</button>',
            width   : 450,
            height  : 230,
            onOpen  : function (event) {
                event.onComplete = function () {
                    $('#w2ui-popup #email')[0].focus();
                    $('#w2ui-popup #request').on('click', function () {
                        var email = $('#w2ui-popup #email').val();
                        if (email == '' || email == null) {
                            $('#w2ui-popup #email').w2tag('Cannot be empty')[0].focus();
                            return; 
                        }
                        $().w2popup('close');

                        // --- REPLACE: REQUEST PASSWORD RESET ---

                        console.log('Request password reset for '+ email);
                    });
                }
            }
        });        
    }
});