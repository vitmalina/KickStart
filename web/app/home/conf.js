// ============================================
// -- Configuration for the home module

conf = {

    // ==============================
    // --- Home Sidebar

    home_sidebar: {
        name: 'home_sidebar',
        nodes: [
            { id: 'general', text: 'General', group: true, expanded: true,
                nodes: [
                    { id: 'people', text: 'People', icon: 'icon-user', route: '/home/people' },
                    { id: 'groups', text: 'Groups', icon: 'icon-users', route: '/home/groups' }
                ]
            }
        ],
        onClick: function (event) {
            if (event.object.route) {
                app.route.go(event.object.route);
            } else {
                action.call(this, event);
            }
        }
    },

    home_people: {
        name : 'home_people',
        url  : app.context + '/users',
        recid: 'userid',
        show    : {
            header   : false,
            toolbar  : true,
            footer   : true
        },
        style: 'border: 0px',
        sortData: [{ field: 'lname', direction: 'asc' }],
        searches: [
            { type: 'int', caption: 'ID', field: 'userid' },
            { type: 'text', caption: 'First Name', field: 'fname' },
            { type: 'text', caption: 'Last Name', field: 'lname' },
            { type: 'text', caption: 'Email', field: 'email' },
            { type: 'list', caption: 'Manager', field: 'manager_userid', options: { url: app.context + '/enum/users' }  },
        ],
        columns: [
            { field: 'userid', caption: 'Id', size: '60px', sortable: true, hidden: true },
            { field: 'lname', caption: 'Full Name', size: '50%', sortable: true,
                render: function (record) {
                    return record.lname + ', ' + record.fname;
                }
            },
            { field: 'email', caption: 'Email', size: '25%', sortable: true },
            { field: 'phone', caption: 'Phone', size: '25%', sortable: true },
            { field: 'manager', caption: 'Reports To', size: '160px', sortable: true,
                render: function (record) {
                    if (record.manager && record.manager.userid) {
                        return record.manager.lname + ', ' + record.manager.fname;
                    } else {
                        return '';
                    }
                }
            }
        ],
        onClick: function (event) {
            event.onComplete = function () { previewPerson(); }
        }
    },

    home_groups: {
        name : 'home_groups',
        url  : app.context + '/groups',
        recid: 'groupid',
        show    : {
            header   : false,
            toolbar  : true,
            footer   : true
        },
        style: 'border: 0px',
        sortData: [{ field: 'group_name', direction: 'asc' }],
        searches: [
            { type: 'int', caption: 'ID', field: 'groupid' },
            { type: 'text', caption: 'Group', field: 'group_name' }
        ],
        columns: [
            { field: 'groupid', caption: 'ID', size: '60px', sortable: true, hidden: true },
            { field: 'group_name', caption: 'Group', size: '100%', sortable: true },
            { field: 'owner.name', caption: 'Owner', size: '160px', sortable: true },
            { field: 'restricted', caption: 'Restricted', size: '80px', render: 'toggle', attr: 'align="center"' },
            { field: 'published', caption: 'Published', size: '80px', render: 'toggle', attr: 'align="center"' }
        ],
        onClick: function (event) {
            event.onComplete = function () { previewGroup(); }
        }
    },

    home_group_members: {
        name : 'home_group_members',
        url  : app.context + '/group/:id/members',
        show : {
            header  : false,
            toolbar : true,
            footer  : true
        },
        style: 'border: 0px',
        sortData: [{ field: 'lname', direction: 'asc' }],
        searches: [
            { type: 'int',  caption: 'Id', field: 'userid' },
            { type: 'text', caption: 'First Name', field: 'fname' },
            { type: 'text', caption: 'Last Name', field: 'lname' },
            { type: 'text', caption: 'Email', field: 'email' },
            { type: 'list', caption: 'Manager', field: 'manager_userid', options: { url: app.context + '/enum/users' }  },
        ],
        columns: [
            { field: 'userid', caption: 'Id', size: '60px', sortable: true, hidden: true },
            { field: 'lname', caption: 'Full Name', size: '150px', sortable: true,
                render: function (record) {
                    return record.lname + ', ' + record.fname;
                }
            },
            { field: 'email', caption: 'Email', size: '100%', sortable: true },
            { field: 'phone', caption: 'Phone', size: '100%', sortable: true, hidden: true },
            { field: 'manager', caption: 'Manager', size: '150px', sortable: true, hidden: true,
                render: function (record) {
                    if (record.manager.userid) {
                        return record.manager.lname + ', ' + record.manager.fname;
                    } else {
                        return '';
                    }
                }
            }
        ]
    }
}