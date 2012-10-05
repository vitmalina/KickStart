/****************************************************
*  ---  Administration Users
*/

app.admin_users = (function (obj) {
	// private scope
	var configs;
	
	// public scope
	obj.addUser		= addUser;
	obj.render		= render;

	init();
	return obj;

	// implementation

	function init() {
		app.get([
		    'app/admin/users-config.js'
		 ], 
		function (files) {
			for (var i in files) eval(files[i]);
			// init application UI
			$().w2grid(configs.admin_users);
			render();
		});
	}

	function render() {
		w2ui['app_layout'].content('main', w2ui['admin_users']);
	}

	function addUser(userid) {
		$().w2popup('load', {
			url 		: 'app/admin/users-create.html',
			width 		: 610,
			height 		: 405,
			title		: (userid == null ? 'Add User' : 'Edit User'),
			showClose	: true,
			showMax 	: false,
			modal 		: true,
			onClose: function () { $().w2tag(); },
			onOpen: function () {
				$().w2destroy('admin_user_edit');
				$('#w2ui-screenPopup .w2ui-box1').w2form({ 
					name 	: 'admin_user_edit',
					url  	: 'server/admin-users',
					recid	: userid
				});
				$('#w2ui-screenPopup #btnOk').on('click', function () {
					w2ui['admin_user_edit'].save(null, null, function (data) {
						if (data['status'] == 'success') {
							w2ui['admin_users'].reload();
							$().w2popup('close');
						} else {
							app.error('Error: '+ data['message']);
						}
					})					
				});
			}
		});
	}

}) (app.admin_users || {});