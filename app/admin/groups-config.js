/*********************************************
*  -- Groups Configuration
*/

configs = {
	admin_groups: { 
		name 	: 'admin_groups',
		header	: 'Groups',
		url		: 'server/admin-groups',
		show: {
			header		: false,
			toolbar		: true,
			footer		: true,
			emptyRecords: true,
			tbSearchBtn	: true
		},
		style: 'border-top: 1px solid #DBDFE5;',
		columns: [
			{ field: 'groupid', caption: 'Id', size: '60px', sortable: true },
			{ field: 'gname', caption: 'Group Name', size: '100%', sortable: true, resizable: true,
				render: function (record) { return record.gname + (record.gdesc != '' ? '<span style="color: #888"> - ' + record.gdesc + '</span>' : ''); } },
			{ field: 'last_update', caption: 'Last Update', size: '100px', sortable: true, resizable: true,
				render: function (record) { return w2utils.age(record.last_update) }
			},
			{ field: 'last_user', caption: 'Updater', size: '120px', sortable: true, resizable: true }
		],
		toolbar: {
			items: [ 
				{ type: 'add', caption: 'Add Group', img: 'icon-circle_plus' },
				{ type: 'delete', caption: 'Delete', img: 'icon-remove_2' }
			],
		},
		onAdd: function (target, data) {
			app.admin_groups.addGroup();
		},
		onDblClick: function (target, data) {
			app.admin_groups.addGroup(data.recid);
		},
		searches: [
			{ type: 'int', caption: 'Id', field: 'groupid' },
			{ type: 'text', caption: 'Group Name', field: 'gname' }
		]
	}
}