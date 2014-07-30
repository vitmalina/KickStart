/****************************************************
*  --- Administration Module
*/

app.register('admin', function (files) {
    // private 
    var config;
    var config_groups;
    var config_roles;
    var sidebar;
    var layout  = w2ui.app_layout;
    var toolbar = w2ui.app_toolbar;

    init();
    return {
        open    : open,
        action  : action
    };

    function init () {
        eval(files['app/admin/config.js']);
        eval(files['app/admin/config-groups.js']);
        eval(files['app/admin/config-roles.js']);

        $().w2layout(config.admin_layout);
        $().w2sidebar(config.admin_sidebar);
        // users
        $().w2grid(config.admin_users);
        $().w2form(config.admin_user_edit);
        // groups
        $().w2grid(config_groups.admin_groups);
        $().w2form(config_groups.admin_group_edit);
        $().w2grid(config_groups.admin_group_members);
        $().w2grid(config_groups.admin_group_find_members);
        // roles
        $().w2grid(config_roles.admin_roles);
        $().w2form(config_roles.admin_role_edit);
        $().w2grid(config_roles.admin_role_members);
        $().w2grid(config_roles.admin_role_find_members);
        $().w2grid(config_roles.admin_role_services);
        $().w2grid(config_roles.admin_role_find_services);
    }

    function open (name) {
        if (typeof name == 'undefined') name = 'users';
        if (['users', 'groups', 'roles'].indexOf(name) == -1) {
            console.log('ERROR: Wrong argument (name='+ arguments[0] +'). The method admin.open(name) takes one argument name = users|groups|roles.');
            name = 'users';
        }
        w2popup.open({
            title   : 'Administration',
            width   : 950,
            height  : 700,
            showMax : true,
            body      : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
            onOpen  : function (event) {
                event.onComplete = function () {
                    w2ui.admin_layout.content('left', w2ui.admin_sidebar);
                    w2ui.admin_layout.content('main', '');
                    $('#w2ui-popup #main').w2render('admin_layout');
                    setTimeout(function () { w2ui.admin_sidebar.click(name); }, 1);
                }
            },
            onToggle: function (event) { 
                event.onComplete = function () {
                    setTimeout(function () { 
                        w2ui.admin_layout.resize(); 
                        w2ui.admin_group_edit.resize(); 
                        w2ui.admin_group_members.resize(); 
                        w2ui.admin_role_edit.resize(); 
                        w2ui.admin_role_members.resize(); 
                        w2ui.admin_role_services.resize(); 
                    }, 100);
                }
            }        
        });
    }

    function action (event) {
        switch (event.target) {
            case 'users':
                w2ui.admin_layout.content('main', w2ui.admin_users);
                break;
            case 'groups':
                w2ui.admin_layout.content('main', w2ui.admin_groups);
                break;
            case 'roles':
                w2ui.admin_layout.content('main', w2ui.admin_roles);
                break;
        }        
    }
});