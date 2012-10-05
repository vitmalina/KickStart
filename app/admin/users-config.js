/*********************************************
*  -- Users Configuration
*/

configs = {
	admin_users: { 
		name 	: 'admin_users',
		header	: 'Users',
		url		: 'server/admin-users',
		show: {
			header		: false,
			toolbar		: true,
			footer		: true,
			emptyRecords: true,
			tbSearchBtn	: true
		},
		style: 'border-top: 1px solid #DBDFE5;',
		columns: [
			{ field: 'userid', caption: 'Id', size: '60px', sortable: true },
			{ field: 'lname', caption: 'Last Name', size: '160px', sortable: true, resizable: true },
			{ field: 'fname', caption: 'First Name', size: '160px', sortable: true, resizable: true },
			{ field: 'login', caption: 'Login', size: '120px', sortable: true, resizable: true },
			{ field: 'email', caption: 'Email', size: '100%', sortable: true, resizable: true },
			{ field: 'expires', caption: 'Expires', size: '100px', sortable: true, resizable: true,
				render: function (record) { return w2utils.date(record.expires) }
			},
			{ field: 'superuser', caption: 'Admin', size: '60px', sortable: true, resizable: true, attr: 'align="center"',
				render: function (record) { return (record.superuser == 1 ? 'Yes' : '') } 
			},
			{ field: 'last_update', caption: 'Last Update', size: '100px', sortable: true, resizable: true,
				render: function (record) { return w2utils.age(record.last_update) + ' ago' }
			},
			{ field: 'last_user', caption: 'Updater', size: '120px', sortable: true, resizable: true }
		],
		toolbar: {
			items: [ 
				{ type: 'add', caption: 'Add User', img: 'icon-circle_plus' },
				{ type: 'delete', caption: 'Delete', img: 'icon-remove_2' }
			],
		},
		onAdd: function (target, data) {
			app.admin_users.addUser();
		},
		onDblClick: function (target, data) {
			app.admin_users.addUser(data.recid);
		},
		searches: [
			{ type: 'int', caption: 'Id', field: 'userid' },
			{ type: 'text', caption: 'Last Name', field: 'lname' },
			{ type: 'text', caption: 'First Name', field: 'fName' },
			{ type: 'text', caption: 'Login', field: 'login' },
			{ type: 'text', caption: 'Email', field: 'email' },
			{ type: 'date', caption: 'Expires', field: 'expires' },
		]
	}
}