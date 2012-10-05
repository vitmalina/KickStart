/*********************************************
*  -- Roles Configuration
*/

configs = {
	admin_roles: { 
		name 	: 'admin_roles',
		header	: 'Roles',
		url		: 'server/admin-roles',
		show: {
			header		: false,
			toolbar		: true,
			footer		: true,
			emptyRecords: true,
			tbSearchBtn	: true
		},
		style: 'border-top: 1px solid #DBDFE5;',
		columns: [
			{ field: 'roleid', caption: 'Id', size: '60px', sortable: true },
			{ field: 'rname', caption: 'Role Name', size: '100%', sortable: true, resizable: true,
				render: function (record) { return record.rname + (record.rdesc != '' ? '<span style="color: #888"> - ' + record.rdesc + '</span>' : ''); } },
			{ field: 'last_update', caption: 'Last Update', size: '100px', sortable: true, resizable: true,
				render: function (record) { return w2utils.age(record.last_update) }
			},
			{ field: 'last_user', caption: 'Updater', size: '120px', sortable: true, resizable: true }
		],
		toolbar: {
			items: [ 
				{ type: 'add', caption: 'Add Role', img: 'icon-circle_plus' },
				{ type: 'delete', caption: 'Delete', img: 'icon-remove_2' }
			],
		},
		onAdd: function (target, data) {
			app.admin_roles.addRole();
		},
		onDblClick: function (target, data) {
			app.admin_roles.addRole(data.recid);
		},
		searches: [
			{ type: 'int', caption: 'Id', field: 'roleid' },
			{ type: 'text', caption: 'Role Name', field: 'rname' }
		]
	}
}