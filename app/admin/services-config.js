/*********************************************
*  -- Services Configuration
*/

configs = {
	admin_services: { 
		name 	: 'admin_services',
		header	: 'Services',
		url		: 'server/admin-services',
		show: {
			header		: false,
			toolbar		: true,
			footer		: true,
			emptyRecords: true,
			tbSearchBtn	: true
		},
		style: 'border-top: 1px solid #DBDFE5;',
		columns: [
			{ field: 'serviceid', caption: 'Id', size: '60px', sortable: true },
			{ field: 'service_name', caption: 'Service Name', size: '30%', sortable: true, resizable: true },
			{ field: 'service_path', caption: 'Service Path', size: '70%', sortable: true, resizable: true },
			{ field: 'last_update', caption: 'Last Update', size: '100px', sortable: true, resizable: true,
				render: function (record) { return w2utils.age(record.last_update) }
			},
			{ field: 'last_user', caption: 'Updater', size: '120px', sortable: true, resizable: true }
		],
		toolbar: {
			items: [ 
				{ type: 'add', caption: 'Add Service', img: 'icon-circle_plus' },
				{ type: 'delete', caption: 'Delete', img: 'icon-remove_2' }
			],
		},
		onAdd: function (target, data) {
			app.admin_services.addService();
		},
		onDblClick: function (target, data) {
			app.admin_services.addService(data.recid);
		},
		searches: [
			{ type: 'int', caption: 'Id', field: 'serviceid' },
			{ type: 'text', caption: 'Service Name', field: 'service_name' },
			{ type: 'text', caption: 'Service Path', field: 'service_path' }
		]
	}
}