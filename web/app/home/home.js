/****************************************************
*  --- Home Module
*/

app.register('home', function (files) {
    // private 
    var config;
    var model;
    var sidebar;
    var layout  = w2ui.app_layout;
    var toolbar = w2ui.app_toolbar;

    init();
    return {};

    // implementation

    function init () {
        // process files
        eval(files['app/home/config.js']);
        
        // init grids
        $().w2sidebar(config.home_sidebar);
        $().w2grid(config.home_people);
        $().w2grid(config.home_groups);
        $().w2grid(config.home_group_members);
        sidebar = w2ui.home_sidebar;

        // define routes
        app.route.add({

            "/home*" : function (route, params) {
                // press toolbar
                toolbar.uncheck.apply(toolbar, toolbar.get());
                toolbar.check('home');
                // init layout
                layout.hide('right', true);
                layout.set('right', { size: 450 });
                layout.html('left', w2ui.home_sidebar);
            },

            "/home" : function (route, params) {
                $('#app-header').html('Home');
                sidebar.select('home');
                layout.show('right', true);
                layout.html('main', 'In progress...');
                layout.html('right', '');
            },

            "/home/approvals" : function (route, params) {
                $('#app-header').html('Home: Approvals');
                sidebar.select('approvals');
                layout.html('main', w2ui.home_approvals);
                layout.show('right', true);
                layout.set('right', { size: 450 });
                layout.html('right', 'preview');
            },

            "/home/people" : function (route, params) {
                $('#app-header').html('Home: People');
                sidebar.select('people');
                layout.html('main', w2ui.home_people);
                layout.show('right', true);
                layout.set('right', { size: 450 });
                previewPerson();
            },

            "/home/groups" : function (route, params) {
                $('#app-header').html('Home: Groups');
                sidebar.select('groups');
                layout.html('main', w2ui.home_groups);
                layout.show('right', true);
                layout.set('right', { size: 450 });
                previewGroup();
            }
        });
    }

    function previewPerson () {
        var grid = w2ui.home_people;
        var sel  = grid.getSelection();
        if (sel.length != 1) {
            layout.html('right', sel.length == 0 ? '<div class="preview-msg">Select a user to view.</div>' : '<div class="preview-msg">Select only one user.</div>');
        } else {
            layout.html('right', '<style>' + files['app/home/user/view.css'] + '</style>' + files['app/home/user/view.html']);
            var user = grid.get(sel[0]);
            $dsp = $(layout.el('right'));
            $dsp.find('#name').html(user.fname + ' ' + user.lname);
            $dsp.find('#email').html('<a href="mailto:'+ user.email +'">'+ user.email +'</a>');
            $dsp.find('#userid').val(user.userid);
            $dsp.find('#login').val(user.login);
            $dsp.find('#photo').attr('src', app.context + '/api/user/'+ user.userid +'/photo');
            if (user.manager_userid) addDetail('Reports To', user.manager.name);
            if (user.email_alt) addDetail('Email (other)', '<a href="mailto:'+ user.email_alt +'">'+ user.email_alt +'</a>');
            if (user.phone)     addDetail('Phone (primary)', user.phone);
            if (user.phone_alt) addDetail('Phone (mobile)', user.phone_alt);
            if (user.im)        addDetail('IM', user.im);
            if (user.im_alt)    addDetail('IM (other)', user.im_alt);
            if (user.address)   addDetail('Address', user.address.replace(/\n/g, '<br>'));
            var groups = '';
            for (var g in user.groups) groups += user.groups[g] + '<br>';
            if (groups) addDetail('User Groups', groups);
            var roles = '';
            for (var g in user.roles) roles += user.roles[g] + '<br>';
            if (roles) addDetail('Assigned Roles', roles);
        }
        function addDetail (caption, body) {
            if (body == null || body == '') body = '&nbsp;';
            var html = '<div class="w2ui-field w2ui-span7">'+
                       '     <label>'+ caption +'</label>'+
                       '    <div id="groups" class="prof-details">'+ body +'</div>'+
                       '</div>';
            $dsp.find('#details').append(html);
        }
    }

    function previewGroup () {
        var grid = w2ui.home_groups;
        var sel  = grid.getSelection();
        if (sel.length != 1) {
            if (sel.length < 1) layout.html('right', '<div class="preview-msg">Select a group to view.</div>');
            if (sel.length > 1) layout.html('right', '<div class="preview-msg">Select only one group.</div>');
        } else {
            layout.html('right', '<style>' + files['app/home/group/view.css'] + '</style>' + files['app/home/group/view.html']);
            var group = grid.get(sel[0]);
            $dsp = $(layout.el('right'));
            $dsp.find('#group-name').html(group.group_name);
            $dsp.find('#group-owner').html(group.owner.name);
            $dsp.find('#group-closed').html(group.closed ? 'No' : 'Yes');
            $dsp.find('#group-published').html(group.published ? 'Published' : 'Not Published');
            $dsp.find('#group-details').html(group.group_desc || '--');
            // members list
            if (group.published === true) {
                w2ui.home_group_members.routeData = { id: group.groupid };
                $dsp.find('#group-members').w2render('home_group_members');
            } else {
                $dsp.find('#group-members').html('<div class="preview-msg">Group membership is private.</div>');
            }
            // join or leave
            var user = app.main.getSession();
            if (group.closed) {
                $dsp.find('#btn-join').html('Join').prop('disabled', true); // can join
            } else {
                if (user.groups.hasOwnProperty(group.groupid)) {
                    $dsp.find('#btn-join')
                        .html('Leave')
                        .removeClass('btn-green')
                        .prop('disabled', false);
                } else { 
                    $dsp.find('#btn-join')
                        .html('Join')
                        .removeClass('btn-red')
                        .addClass('btn-green')
                        .prop('disabled', false);
                }
            }
            $dsp.find('#btn-join').on('click', function () {
                var btn = $(this).html();
                if (btn == 'Leave') {
                    $.ajax({
                        url: app.context + '/api/group/'+ group.groupid + '/leave',
                        complete: function () {
                            app.main.getSession(true);
                            previewGroup();
                        }
                    });
                }
                if (btn == 'Join') {
                    $.ajax({
                        url: app.context + '/api/group/'+ group.groupid + '/join',
                        complete: function () {
                            app.main.getSession(true);
                            previewGroup();
                        }
                    });
                }
            });
        }
    }
});