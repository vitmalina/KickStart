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
            },

            "/home/time-sheets" : function (route, params) {
                $('#app-header').html('Home: Timesheets');
                sidebar.select('time-sheets');
                layout.html('main', w2ui.home_timesheets);
                layout.show('right', true);
                layout.set('right', { size: 450 });
                layout.html('right', '<div class="preview-msg">Select a record to view.</div>');
            },

            "/home/expenses" : function (route, params) {
                $('#app-header').html('Home: Submit Expenses');
                sidebar.select('expenses');
                layout.html('main', w2ui.home_expanses);
                layout.show('right', true);
                layout.set('right', { size: 450 });
                layout.html('right', 'preview');
            },

            "/home/time-off" : function (route, params) {
                $('#app-header').html('Home: Request Time Off');
                sidebar.select('time-off');
                layout.html('main', w2ui.home_timeoff);
                layout.show('right', true);
                layout.set('right', { size: 450 });
                layout.html('right', 'preview');
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

    function newTimesheet (recid) {
        var user = app.main.getSession();
        var form = w2ui.home_timesheet_edit;
        var grid = w2ui.home_timesheets;
        var rec  = grid.get(recid) || {};

        // pull projects
        var projects = [];
        $.ajax({
            url     : app.context + '/api/project/enum/projects',
            asynch  : false,
            success : function (data, status, xhr) {
                projects = data.items;
            }
        });
        form.formHTML = files['app/home/time-sheets/add-new.html'];
        form.projects = null;

        // open popup
        w2popup.open({
            width   : 730,
            height  : 500,
            title   : recid ? 'Edit Timesheet' : 'New Timesheet',
            body    : '<style>'+ files['app/home/time-sheets/add-new.css'] + '</style>' + 
                      '<div id="edit_timesheet" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; overflow: auto;"></div>',
            buttons : '<button class="btn btn-green" id="save" disabled>Save as Draft</button>'+
                      '<button class="btn" id="submit" disabled>Submit</button>'+
                      '<button class="btn" id="cancel" onclick="w2popup.close();">Cancel</button>',
            onOpen  : function (event) {
                event.onComplete = function () {
                    var $dsp  = $('#w2ui-popup #edit_timesheet');

                    // render form
                    form.recid           = recid || 0;
                    form.record          = {};
                    form.routeData['id'] = form.recid;
                    form.onReportAdd     = addRow;
                    form.onReportCount   = count;
                    $('#w2ui-popup #edit_timesheet').w2render('home_timesheet_edit');

                    // projects
                    var phtml = '<option></option>';
                    for (var p in projects) {
                        phtml += '<option value="' + projects[p].id + '">' + projects[p].project_name + '</option>';
                    }
                    phtml += '<option disabled>---</options>'+
                             '<option value="0">Non Billable</option>'+
                             '<option value="-1">Time Off</option>';
                    $dsp.find('select').html(phtml).on('change', addRow);

                    // counts
                    $dsp.find('.report').find('input').w2field('float', { min: 0, max: 24 });
                    $dsp.find('.report').find('input').on('change', count);

                    // save and submit buttons
                    $('#w2ui-popup #save').on('click', save);
                    $('#w2ui-popup #submit').on('click', save);

                    // allow edit only on draft and sent back
                    if (rec.status == null || ['D', 'B'].indexOf(rec.status) != -1) {
                        $('#w2ui-popup #save').prop('disabled', false);
                        $('#w2ui-popup #submit').prop('disabled', false);
                    } else {
                        $('#w2ui-popup #save').prop('disabled', true);
                        $('#w2ui-popup #submit').prop('disabled', true);
                    }

                    function addRow () {
                        var table  = $(this).parents('table');
                        var tr = $(this).parents('tr');
                        // remember project
                        tr.attr('name', this.value);
                        if (this.value == "") tr.find('input').val('').change();
                        // add new row if last
                        if (tr.next().attr('name') == 'total') { 
                            var new_tr = table.find('.template').clone();
                            new_tr.removeClass('template')
                                .find('select')
                                .html(phtml)
                                .on('change', addRow);
                            tr.after(new_tr);
                            // counts
                            new_tr.attr('name', '');
                            new_tr.find('input').w2field('float', { min: 0, max: 24 });
                            new_tr.find('input').on('change', count);
                        }
                    }

                    function count () {
                        if ($(this).prop('readonly')) return;
                        // day total
                        var total = 0;
                        $dsp.find('input[name='+ $(this).attr('name') +']').each(function (index, el) {
                            if (el.value) total += parseFloat(el.value);
                        });
                        $dsp.find('#total_'+ $(this).attr('name')).val(total);
                        // week total
                        var tr = $(this).parents('tr');
                        var total = 0;
                        tr.find('td input').each(function (index, el) {
                            if (el.name == 'total') return;
                            if (el.value) total += parseFloat(el.value);
                        });
                        tr.find('[name=total]').val(total);
                        // full total
                        var tr = $dsp.find('[name=total]');
                        var total = 0;
                        tr.each(function (index, el) {
                            if (el.value) total += parseFloat(el.value);
                        });
                        $dsp.find('#total_total').val(total);
                        form.record['hours'] = total;
                    }

                    function save () {
                        var details = [];
                        var isError = false;
                        $dsp.find('.report table tr').each(function (index, el) {
                            if ($(el).attr('name') == 'title' || $(el).attr('name') == 'total' || $(el).hasClass('template')) return;
                            var projectid = $(el).attr('name');
                            if (!projectid && $(el).find('input').not('[readonly]').filter(function () { return this.value }).length > 0) {
                                isError = true;
                                $(el).find('td:last-child input').w2tag('Please specify project (or clear hours).');
                                return;
                            }
                            if (projectid) {
                                details.push({
                                    projectid   : projectid,
                                    hours_total : parseInt($(el).find('[name=total]').val()) || 0,
                                    hours_sun   : parseInt($(el).find('[name=sun]').val()) || 0,
                                    hours_mon   : parseInt($(el).find('[name=mon]').val()) || 0,
                                    hours_tue   : parseInt($(el).find('[name=tue]').val()) || 0,
                                    hours_wed   : parseInt($(el).find('[name=wed]').val()) || 0,
                                    hours_thu   : parseInt($(el).find('[name=thu]').val()) || 0,
                                    hours_fri   : parseInt($(el).find('[name=fri]').val()) || 0,
                                    hours_sat   : parseInt($(el).find('[name=sat]').val()) || 0
                                })
                            }
                        });
                        if (!isError) {
                            form.record.userid = app.main.getSession().userid;
                            form.record.hours  = $('#w2ui-popup #total_total').val();
                            form.record.status = ($(this).attr('id') == 'submit' ? 'S' : 'D');
                            form.postData['details'] = details;
                            if ($(this).attr('id') == 'submit') {
                                w2confirm('Please confirm you want to submit your Timesheet for approval. Once submitted, you will not be able to change it unless it is sent back.', 
                                    function (btn) {
                                        if (btn == 'Yes') form.save(finish);
                                    }
                                );
                            } else {
                                form.save(finish);
                            }

                            function finish () {
                                w2popup.close();
                                w2ui.home_timesheets.reload();
                            }
                        }
                    }
                }
            }
        });     
    }

    function previewTimesheet (recid) {
        // render
        layout.html('right', '<style>' + files['app/home/time-sheets/preview.css'] + '</style>' + files['app/home/time-sheets/preview.html']);
        // bind
        $dsp = $(layout.el('right'));
        $dsp.find('#btn-edit').on('click', function () {
            newTimesheet(recid);
        });
    }
});