conf = {
    admin_layout: {
        name    : 'admin_layout',
        panels  : [
            { type: 'left', size: 150, minSize: 100, resizable: true, style: 'border-right: 1px solid silver' },
            { type: 'main', minSize: 350, overflow: 'hidden' }
        ]
    },

    admin_sidebar: {
        name    : 'admin_sidebar',
        nodes   : [ 
            { id: 'admin', text: 'General', group: true, expanded: true, 
                nodes: [
                    { id: 'users', text: 'Users', icon: 'icon-user' },
                    { id: 'groups', text: 'Groups', icon: 'icon-users' },
                    { id: 'roles', text: 'Roles', icon: 'icon-profile' }
                ]
            }
        ],
        onClick: function (event) {
            app.admin.action(event);
        }
    },

    admin_users: { 
        name : 'admin_users',
        url  : {
            get     : app.context + '/admin/users',
            remove  : app.context + '/admin/users/delete'
        },
        show    : {
            header        : false,
            toolbar       : true,
            footer        : true,
            toolbarAdd    : true,
            toolbarDelete : true
        },
        style: 'border: 0px',
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
        onAdd: function (event) {
            var form = w2ui.admin_user_edit;
            form.recid = 0;
            form.clear(true);
            w2ui.admin_layout.content('main', form);
        },
        onDblClick: function (event) {
            var form = w2ui.admin_user_edit;
            form.recid  = event.recid;
            form.record = $.extend(true, {}, this.get(event.recid)); 
            if (form.record.manager && form.record.manager.userid) {
                form.record.manager.id   = form.record.manager.userid;
                form.record.manager.text = form.record.manager.lname + ', ' + form.record.manager.fname;
            }
            w2ui.admin_layout.content('main', form);
        }
    },

    admin_user_edit: { 
        name : 'admin_user_edit',
        url  : {
            save : app.context + '/admin/users/save',
        },
        fields : [
            { type: 'text', field: 'userid',
                html: { group: 'General', caption: 'User ID', attr: 'readonly style="width: 120px;"', span: 7 }
            },
            { type: 'text', field: 'fname', required: true,
                html: { caption: 'First Name', attr: 'style="width: 200px;" maxlength="50"', span: 7 }
            },
            { type: 'text', field: 'lname', required: true,
                html: { caption: 'Last Name', attr: 'style="width: 200px;" maxlength="50"', span: 7 }
            },
            { type: 'text', field: 'login', required: true, 
                html: { caption: 'Login', attr: 'style="width: 200px;" maxlength="32"', span: 7 }
            },
            { type: 'text', field: 'email', required: true,
                html: { caption: 'Email', attr: 'style="width: 200px;" maxlength="75"', span: 7, 
                        text: '&nbsp;&nbsp;<button class="w2ui-btn" href="mailto:">Email Temp Password</button>' }
            },
            { type: 'list', field: 'manager', required: true,
                options: { url: app.context + '/enum/users' },
                html: { caption: 'Manager', attr: 'style="width: 200px;"', span: 7 }
            },
            { type: 'date', field: 'expires',
                html: { caption: 'Account Expires', attr: 'style="width: 90px;"', span: 7 }
            },
            { type: 'toggle', field: 'super',
                html: { caption: 'Super User', span: 7 }
            },
            { type: 'text', field: 'email_alt',
                html: { group: 'Contact Info', caption: 'Email (other)', attr: 'style="width: 200px;" maxlength="75"', span: 7 }
            },
            { type: 'text', field: 'phone',
                html: { caption: 'Phone (official)', attr: 'style="width: 200px;" maxlength="75"', span: 7 }
            },
            { type: 'text', field: 'phone_alt', 
                html: { caption: 'Phone (mobile)', attr: 'style="width: 200px;" maxlength="75"', span: 7 }
            },
            { type: 'text', field: 'im', 
                html: { caption: 'IM', attr: 'style="width: 200px;" maxlength="75"', span: 7 }
            },
            { type: 'text', field: 'im_alt',
                html: { caption: 'IM (other)', attr: 'style="width: 200px;" maxlength="75"', span: 7 }
            },
            { type: 'textarea', field: 'address',
                html: { caption: 'Address', attr: 'style="width: 200px; height: 55px; resize: none" maxlength="500"', span: 7 }
            },
            { type: 'textarea', field: 'notes',
                html: { group: 'Notes & Comments', caption: '&nbsp;', attr: 'style="width: 96%; height: 100px; resize: none"', span: 1 }
            }
        ],
        actions: {
            Save: function () {
                this.save(function () {
                    w2ui.admin_layout.content('main', w2ui.admin_users);
                });
            },
            Cancel: function () {
                w2ui.admin_layout.content('main', w2ui.admin_users);
            }
        }
    }
}
