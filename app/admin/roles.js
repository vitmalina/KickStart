/****************************************************
*  ---  Administration Roles
*/

app.admin_roles = (function (obj) {
	// private scope
	var configs;
	
	// public scope
	obj.addRole		= addRole;
	obj.render		= render;

	init();
	return obj;

	// implementation

	function init() {
		app.get([
		    'app/admin/roles-config.js'
		 ], 
		function (files) {
			for (var i in files) eval(files[i]);
			// init application UI
			$().w2grid(configs.admin_roles);
			render();
		});
	}

	function render() {
		w2ui['app_layout'].content('main', w2ui['admin_roles']);
	}

	function addRole(roleid) {
		$().w2popup('load', {
			url 		: 'app/admin/roles-create.html',
			width 		: 610,
			height 		: 405,
			title		: (roleid == null ? 'Add Role' : 'Edit Role'),
			showClose	: true,
			showMax 	: false,
			modal 		: true,
			onClose: function () { $().w2tag(); },
			onOpen: function () {
				$().w2destroy('admin_role_edit');
				$('#w2ui-screenPopup .w2ui-box1').w2form({ 
					name 	: 'admin_role_edit',
					url  	: 'server/admin-roles',
					recid	: roleid,
					options	: {
						'services': {
							url: 'server/admin-roles?cmd=get-actions&name=admin_role_edit'
						}
					}					
				});
				$('#w2ui-screenPopup #btnOk').on('click', function () {
					w2ui['admin_role_edit'].save(null, null, function (data) {
						if (data['status'] == 'success') {
							w2ui['admin_roles'].reload();
							$().w2popup('close');
						} else {
							app.error('Error: '+ data['message']);
						}
					})					
				});
			}
		});
	}

}) (app.admin_roles || {});