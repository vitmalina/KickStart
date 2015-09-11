config_roles = {

    admin_roles: { 
        name : 'admin_roles',
        url  : {
            get     : app.context + '/admin/roles',
            remove  : app.context + '/admin/roles/delete'
        },
        show    : {
            header        : false,
            toolbar       : true,
            footer        : true,
            toolbarAdd    : true,
            toolbarDelete : true
        },
        style: 'border: 0px',
        sortData: [{ field: 'roleid', direction: 'asc' }],
        searches: [
            { type: 'int', caption: 'ID', field: 'roleid' },
            { type: 'text', caption: 'Role', field: 'role_name' }
        ],
        columns: [
            { field: 'roleid', caption: 'ID', size: '60px', sortable: true },
            { field: 'role_name', caption: 'Role', size: '100%', sortable: true },
            { field: 'last_update', caption: 'Last Update', hidden: true, render: 'date', size: '100px', gridMinWidth: 800 },
            { field: 'last_user.name', caption: 'Last User', hidden: true, size: '120px', gridMinWidth: 800 }
        ],
        onAdd: function (event) {
            var form = w2ui.admin_role_edit;
            form.recid = 0;
            w2ui.admin_layout.content('main', form);
            setTimeout(function () { form.clear(); if (form.tabs.click) form.tabs.click('info'); }, 1); 
        },
        onDblClick: function (event) {
            var form = w2ui.admin_role_edit;
            form.recid  = event.recid;
            form.record = $.extend(true, {}, this.get(event.recid)); 
            w2ui.admin_layout.content('main', form);
            setTimeout(function () { if (form.tabs.click) form.tabs.click('info'); }, 1); 
        }
    },

    admin_role_edit: { 
        name : 'admin_role_edit',
        url  : {
            save : app.context + '/admin/roles/save',
        },
        tabs: {
            tabs: [
                { id: 'info', caption: 'Info' },
                { id: 'members', caption: 'Members' },
                { id: 'services', caption: 'Services' }
            ],
            onClick: function (event) {
                var form = w2ui.admin_role_edit;
                event.onComplete = function () {
                    if (event.target == 'info') {
                        $(form.box).find('.w2ui-buttons').show();
                    }
                    if (event.target == 'members') {
                        if (w2ui.admin_role_edit.recid) {
                            w2ui.admin_role_members.routeData.id = w2ui.admin_role_edit.recid;
                            $(form.box).find('.w2ui-buttons').hide();
                            w2ui.admin_role_members.clear();
                            $(form.box).find('.w2ui-page.page-1').css('bottom', '1px').w2render('admin_role_members');
                        } else {
                            $(form.box).find('.w2ui-page.page-1').html('<div style="text-align: center; font-size: 16px; padding-top: 20px; color: gray">'+
                                'Role is not yet created.</div>');
                        }
                    }
                    if (event.target == 'services') {
                        if (w2ui.admin_role_edit.recid) {
                            w2ui.admin_role_services.routeData.id = w2ui.admin_role_edit.recid;
                            $(form.box).find('.w2ui-buttons').hide();
                            w2ui.admin_role_services.clear();
                            $(form.box).find('.w2ui-page.page-2').css('bottom', '1px').w2render('admin_role_services');
                        } else {
                            $(form.box).find('.w2ui-page.page-2').html('<div style="text-align: center; font-size: 16px; padding-top: 20px; color: gray">'+
                                'Role is not yet created.</div>');
                        }
                    }
                }
            }
        },
        fields : [
            { type: 'text', field: 'roleid',
                html: { group: 'General', caption: 'Group ID', attr: 'readonly style="width: 120px;"', span: 7, page: 0 }
            },
            { type: 'text', field: 'role_name', required: true,
                html: { caption: 'Role Name', attr: 'style="width: 300px;" maxlength="100"', span: 7, page: 0 }
            },
            { type: 'textarea', field: 'role_desc', 
                html: { caption: 'Description', attr: 'style="width: 95%; height: 90px;"', span: 7, page: 0 }
            }
        ],
        actions: {
            Save: function () {
                this.save(function () {
                    w2ui.admin_layout.content('main', w2ui.admin_roles);
                });
            },
            Cancel: function () {
                w2ui.admin_layout.content('main', w2ui.admin_roles);
            }
        }
    },

    admin_role_members: { 
        name : 'admin_role_members',
        url  : {
            get     : app.context + '/admin/role/:id/members',
            remove  : app.context + '/admin/role/:id/remove'
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
            { type: 'list', caption: 'Manager', field: 'manager_userid', options: { url: app.context + '/enum/users' }  },
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
                width   : -5,
                height  : -10,
                html    : '<div id="grid-find-members" style="position: absolute; top: 0; left: 0; right: 0; bottom: 56px; margin: 0px;"></div>'+
                          '<div style="position: absolute; left: 0; right: 0; bottom: 0; height: 55px; padding-top: 12px; text-align: center">'+
                          '     <button class="w2ui-btn w2ui-btn-blue" id="btn-attach">Add Selected</button>'+
                          '     <button class="w2ui-btn" id="btn-close" onclick="w2popup.message()">Close</button>'+
                          '</div>',
                onOpen  : function () {
                    var grid1 = w2ui.admin_role_members;
                    var grid2 = w2ui.admin_role_find_members;
                    grid2.reset(true);
                    $('#w2ui-popup #grid-find-members').w2render(grid2.name);
                    $('#w2ui-popup #btn-attach').on('click', function () {
                        var sel = grid2.getSelection();
                        if (sel.length == 0) return;
                        $.ajax({ url: app.context + '/admin/role/'+ w2ui.admin_role_edit.recid +'/add', data: { users: sel }})
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

    admin_role_find_members: { 
        name : 'admin_role_find_members',
        url  : {
            get : app.context + '/admin/users',
        },
        show : {
            header    : false,
            toolbar   : true,
            footer    : true
        },
        style: 'border: 0px; border-bottom: 1px solid silver;',
        sortData: [{ field: 'userid', direction: 'asc' }],
        searches: [
            { type: 'int', caption: 'Id', field: 'userid' },
            { type: 'text', caption: 'First Name', field: 'fname' },
            { type: 'text', caption: 'Last Name', field: 'lname' },
            { type: 'text', caption: 'Login', field: 'login' },
            { type: 'text', caption: 'Email', field: 'email' },
            { type: 'date', caption: 'Expires', field: 'expires' },
            { type: 'list', caption: 'Manager', field: 'manager_userid', options: { url: app.context + '/enum/users' }  },
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
    },

    admin_role_services: { 
        name : 'admin_role_services',
        url  : {
            get     : app.context + '/admin/role/:id/services',
            remove  : app.context + '/admin/role/:id/revoke'
        },
        show    : {
            header        : false,
            toolbar       : true,
            footer        : true,
            toolbarAdd    : true,
            toolbarDelete : true
        },
        style: 'border: 0px; padding: 0px; margin-top: -4px;',
        sortData: [{ field: 'module', direction: 'asc' }],
        searches: [
            { type: 'text', caption: 'Module', field: 'module' },
            { type: 'text', caption: 'Service', field: 'service' },
        ],
        columns: [
            { field: 'module', caption: 'Module', size: '150px', sortable: true },
            { field: 'service', caption: 'Service', size: '100%', sortable: true },
            { field: 'last_update', caption: 'Last Update', hidden: true, render: 'date', size: '100px', gridMinWidth: 800 },
            { field: 'last_user.name', caption: 'Last User', hidden: true, size: '120px', gridMinWidth: 800 }
        ],
        onDelete: function (event) {
            if (event.force) {
                var sel = this.getSelection(true);
                var services = [];
                for (var s in sel) services.push(this.records[sel[s]].service);
                this.request('delete-records', { "services": services });
                event.preventDefault();
            }
        },
        onAdd: function (event) {
            w2popup.message({
                width   : -5,
                height  : -10,
                html    : '<div id="grid-find-services" style="position: absolute; top: 0; left: 0; right: 0; bottom: 56px; margin: 0px;"></div>'+
                          '<div style="position: absolute; left: 0; right: 0; bottom: 0; height: 55px; padding-top: 12px; text-align: center">'+
                          '     <button class="w2ui-btn w2ui-btn-blue" id="btn-attach">Add Selected</button>'+
                          '     <button class="w2ui-btn" id="btn-close" onclick="w2popup.message()">Close</button>'+
                          '</div>',
                onOpen  : function () {
                    var grid1 = w2ui.admin_role_services;
                    var grid2 = w2ui.admin_role_find_services;
                    grid2.reset(true);
                    grid2.onReload();
                    $('#w2ui-popup #grid-find-services').w2render(grid2.name);
                    $('#w2ui-popup #btn-attach').on('click', function () {
                        var sel = grid2.getSelection(true);
                        if (sel.length == 0) return;
                        var services = [];
                        for (var s in sel) services.push(grid2.records[sel[s]].service);
                        $.ajax({ url: app.context + '/admin/role/'+ w2ui.admin_role_edit.recid +'/grant', data: { services: services }})
                            .success(function (data, status, xhr) {
                                if (data && data.status != 'error') {
                                    w2popup.message();
                                    grid1.reload(function (event) {
                                        setTimeout(function () { 
                                            grid1.status(data.effected + ' services(s) added');
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

    admin_role_find_services: { 
        name : 'admin_role_find_services',
        show : {
            header    : false,
            toolbar   : true,
            footer    : true
        },
        style: 'border: 0px; border-bottom: 1px solid silver;',
        sortData: [{ field: 'module', direction: 'asc' }],
        searches: [
            { type: 'text', caption: 'Module', field: 'module' },
            { type: 'text', caption: 'Service', field: 'service' },
        ],
        columns: [
            { field: 'module', caption: 'Module', size: '120px', sortable: true },
            { field: 'service', caption: 'Service', size: '40%', sortable: true },
            { field: 'desc', caption: 'Description', size: '60%' },
        ],
        onDblClick: function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #btn-attach').click();
            }
        },
        onReload: function () {
            var grid = this;
            grid.clear();
            grid.load('api', function (services) {
                var records = [];
                for (var s in services.details) {
                    records.push({
                        recid   : s,
                        module  : services.details[s].module,
                        service : s,
                        desc    : services.details[s].desc
                    });
                }
                grid.add(records);
            });
        }
    },        
}