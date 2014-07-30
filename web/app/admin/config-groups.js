config_groups = {
    
    admin_groups: { 
        name : 'admin_groups',
        url  : {
            get     : app.context + '/api/admin/groups',
            remove  : app.context + '/api/admin/groups/delete'
        },
        show    : {
            header        : false,
            toolbar       : true,
            footer        : true,
            toolbarAdd    : true,
            toolbarDelete : true
        },
        style: 'border: 0px',
        sortData: [{ field: 'groupid', direction: 'asc' }],
        searches: [
            { type: 'int', caption: 'ID', field: 'groupid' },
            { type: 'text', caption: 'Group', field: 'group_name' }
        ],
        columns: [
            { field: 'groupid', caption: 'ID', size: '60px', sortable: true },
            { field: 'group_name', caption: 'Group', size: '100%', sortable: true },
            { field: 'owner.name', caption: 'Owner', size: '120px', sortable: true },
            { field: 'closed', caption: 'Closed', size: '80px', render: 'toggle', attr: 'align="center"' },
            { field: 'published', caption: 'Published', size: '80px', render: 'toggle', attr: 'align="center"' },
            { field: 'last_update', caption: 'Last Update', hidden: true, render: 'date', size: '100px', gridMinWidth: 800 },
            { field: 'last_user.name', caption: 'Last User', hidden: true, size: '120px', gridMinWidth: 800 }
        ],
        onAdd: function (event) {
            var form = w2ui.admin_group_edit;
            form.recid = 0;
            w2ui.admin_layout.content('main', form);
            setTimeout(function () { 
                var user = app.main.getSession();
                form.clear(); 
                form.record.owner = { id: user.userid, text: user.lname + ', ' + user.fname };
                form.record.published = true;
                if (form.tabs.click) form.tabs.click('info'); 
            }, 1); 
        },
        onDblClick: function (event) {
            var form = w2ui.admin_group_edit;
            form.recid  = event.recid;
            form.record = $.extend(true, {}, this.get(event.recid)); 
            if (form.record.owner && form.record.owner.userid) {
                form.record.owner.id   = form.record.owner.userid;
                form.record.owner.text = form.record.owner.name;
            }
            w2ui.admin_layout.content('main', form);
            setTimeout(function () { if (form.tabs.click) form.tabs.click('info'); }, 1); 
        }
    },

    admin_group_edit: { 
        name : 'admin_group_edit',
        url  : {
            save : app.context + '/api/admin/groups/save',
        },
        tabs: {
            tabs: [
                { id: 'info', caption: 'Info' },
                { id: 'members', caption: 'Members' }
            ],
            onClick: function (event) {
                var form = w2ui.admin_group_edit;
                event.onComplete = function () {
                    if (event.target == 'info') {
                        $(form.box).find('.w2ui-buttons').show();
                    }
                    if (event.target == 'members') {
                        if (w2ui.admin_group_edit.recid) {
                            w2ui.admin_group_members.routeData.id = w2ui.admin_group_edit.recid;
                            $(form.box).find('.w2ui-buttons').hide();
                            w2ui.admin_group_members.clear();
                            $(form.box).find('.w2ui-page.page-1').css('bottom', '1px').w2render('admin_group_members');
                        } else {
                            $(form.box).find('.w2ui-page.page-1').html('<div style="text-align: center; font-size: 16px; padding-top: 20px; color: gray">'+
                                'Group is not yet created.</div>');
                        }
                    }
                }
            }
        },
        fields : [
            { type: 'text', field: 'groupid',
                html: { group: 'General', caption: 'Group ID', attr: 'readonly style="width: 120px;"', span: 7, page: 0 }
            },
            { type: 'text', field: 'group_name', required: true,
                html: { caption: 'Group Name', attr: 'style="width: 300px;" maxlength="100"', span: 7, page: 0 }
            },
            { type: 'textarea', field: 'group_desc', 
                html: { caption: 'Description', attr: 'style="width: 95%; height: 90px;"', span: 7, page: 0 }
            },
            { type: 'list', field: 'owner', required: true,
                options: { url: app.context + '/api/enum/users' },
                html: { caption: 'Owner', attr: 'style="width: 200px;"', span: 7, page: 0 }
            },
            { type: 'toggle', field: 'closed',
                html: { caption: 'Closed', span: 7, page: 0 }
            },
            { type: 'toggle', field: 'published',
                html: { caption: 'Published', span: 7, page: 0 }
            }
        ],
        actions: {
            Save: function () {
                this.save(function () {
                    w2ui.admin_layout.content('main', w2ui.admin_groups);
                });
            },
            Cancel: function () {
                w2ui.admin_layout.content('main', w2ui.admin_groups);
            }
        }
    },

    admin_group_members: { 
        name : 'admin_group_members',
        url  : {
            get     : app.context + '/api/admin/group/:id/members',
            remove  : app.context + '/api/admin/group/:id/remove'
        },
        show    : {
            header        : false,
            toolbar       : true,
            footer        : true,
            toolbarAdd    : true,
            toolbarDelete : true
        },
        style: 'border: 0px; padding: 0px; margin-top: -4px;',
        sortData: [{ field: 'userid', direction: 'asc' }],
        searches: [
            { type: 'int', caption: 'Id', field: 'userid' },
            { type: 'text', caption: 'First Name', field: 'fname' },
            { type: 'text', caption: 'Last Name', field: 'lname' },
            { type: 'text', caption: 'Login', field: 'login' },
            { type: 'text', caption: 'Email', field: 'email' },
            { type: 'date', caption: 'Expires', field: 'expires' },
            { type: 'list', caption: 'Manager', field: 'manager_userid', options: { url: app.context + '/api/enum/users' }  },
        ],
        columns: [
            { field: 'userid', caption: 'Id', size: '60px', sortable: true },
            { field: 'lname', caption: 'Full Name', size: '150px', sortable: true, 
                render: function (record) {
                    return record.lname + ', ' + record.fname;
                }
            },
            { field: 'login', caption: 'Login', size: '120px', sortable: true, gridMinWidth: 800 },
            { field: 'email', caption: 'Email', size: '100%', sortable: true },
            { field: 'manager', caption: 'Manager', size: '150px', sortable: true, gridMinWidth: 800,
                render: function (record) {
                    if (record.manager.userid) {
                        return record.manager.lname + ', ' + record.manager.fname;
                    } else {
                        return '';
                    }
                }
            },
            { field: 'expires', caption: 'Expires', size: '90px', render: 'date', sortable: true },
            { field: 'super', caption: 'Super', size: '60px', attr: 'align="center"', render: 'toggle', sortable: true },
            { field: 'last_update', caption: 'Last Update', hidden: true, render: 'date', size: '100px', gridMinWidth: 800 },
            { field: 'last_user.name', caption: 'Last User', hidden: true, size: '120px', gridMinWidth: 800 }
        ],
        onDelete: function (event) {
            if (event.force) {
                this.request('delete-records', { "users": this.getSelection() });
                event.preventDefault();
            }
        },
        onAdd: function (event) {
            w2popup.message({
                width   : 920,
                height  : 620,
                html    : '<div id="grid-find-members" style="position: absolute; top: 0; left: 0; right: 0; bottom: 55px; margin: 7px;"></div>'+
                          '<div style="position: absolute; left: 0; right: 0; bottom: 0; height: 55px; padding-top: 12px; text-align: center">'+
                          '     <button class="btn btn-green" id="btn-attach">Add Selected</button>'+
                          '     <button class="btn" id="btn-close" onclick="w2popup.message()">Close</button>'+
                          '</div>',
                onOpen  : function () {
                    var grid1 = w2ui.admin_group_members;
                    var grid2 = w2ui.admin_group_find_members;
                    grid2.reset(true);
                    $('#w2ui-popup #grid-find-members').w2render(grid2.name);
                    $('#w2ui-popup #btn-attach').on('click', function () {
                        var sel = grid2.getSelection();
                        if (sel.length == 0) return;
                        $.ajax({ url: app.context + '/api/admin/group/'+ w2ui.admin_group_edit.recid +'/add', data: { users: sel }})
                            .success(function (data, status, xhr) {
                                if (data && data.status != 'error') {
                                    w2popup.message();
                                    grid1.reload(function (event) {
                                        setTimeout(function () { 
                                            grid1.status(data.effected + ' user(s) added');
                                        }, 1);
                                    });
                                } else {
                                    var msg = 'Unknown Error';
                                    if (data && data.message) msg = data.message;
                                    w2alert(msg);
                                }
                            })
                            .fail(function () {
                                w2alert('Unknown Error');
                            });
                    });
                }
            });
        },
    },   

    admin_group_find_members: { 
        name : 'admin_group_find_members',
        url  : {
            get : app.context + '/api/admin/users',
        },
        show : {
            header    : false,
            toolbar   : true,
            footer    : true
        },
        sortData: [{ field: 'userid', direction: 'asc' }],
        searches: [
            { type: 'int', caption: 'Id', field: 'userid' },
            { type: 'text', caption: 'First Name', field: 'fname' },
            { type: 'text', caption: 'Last Name', field: 'lname' },
            { type: 'text', caption: 'Login', field: 'login' },
            { type: 'text', caption: 'Email', field: 'email' },
            { type: 'date', caption: 'Expires', field: 'expires' },
            { type: 'list', caption: 'Manager', field: 'manager_userid', options: { url: app.context + '/api/enum/users' }  },
        ],
        columns: [
            { field: 'userid', caption: 'Id', size: '60px', sortable: true },
            { field: 'lname', caption: 'Full Name', size: '150px', sortable: true, 
                render: function (record) {
                    return record.lname + ', ' + record.fname;
                }
            },
            { field: 'login', caption: 'Login', size: '120px', sortable: true, gridMinWidth: 950 },
            { field: 'email', caption: 'Email', size: '100%', sortable: true },
            { field: 'manager', caption: 'Manager', size: '150px', sortable: true, gridMinWidth: 950,
                render: function (record) {
                    if (record.manager.userid) {
                        return record.manager.lname + ', ' + record.manager.fname;
                    } else {
                        return '';
                    }
                }
            },
            { field: 'expires', caption: 'Expires', size: '90px', render: 'date', sortable: true },
            { field: 'super', caption: 'Super', size: '60px', attr: 'align="center"', render: 'toggle', sortable: true },
            { field: 'last_update', caption: 'Last Update', hidden: true, render: 'date', size: '100px', gridMinWidth: 950 },
            { field: 'last_user.name', caption: 'Last User', hidden: true, size: '120px', gridMinWidth: 950 }
        ],
        onDblClick: function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #btn-attach').click();
            }
        }
    }        
}
