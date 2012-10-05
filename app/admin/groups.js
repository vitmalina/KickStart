/****************************************************
*  ---  Administration Groups
*/

app.admin_groups = (function (obj) {
	// private scope
	var configs;
	
	// public scope
	obj.addGroup	= addGroup;
	obj.render		= render;

	init();
	return obj;

	// implementation

	function init() {
		app.get([
		    'app/admin/groups-config.js'
		 ], 
		function (files) {
			for (var i in files) eval(files[i]);
			// init application UI
			$().w2grid(configs.admin_groups);
			render();
		});
	}

	function render() {
		w2ui['app_layout'].content('main', w2ui['admin_groups']);
	}

	function addGroup(groupid) {
		$().w2popup('load', {
			url 		: 'app/admin/groups-create.html',
			width 		: 610,
			height 		: 405,
			title		: (groupid == null ? 'Add Group' : 'Edit Group'),
			showClose	: true,
			showMax 	: false,
			modal 		: true,
			onClose: function () { $().w2tag(); },
			onOpen: function () {
				$().w2destroy('admin_group_edit');
				$('#w2ui-screenPopup .w2ui-box1').w2form({ 
					name 	: 'admin_group_edit',
					url  	: 'server/admin-groups',
					recid	: groupid,
					options	: {
						'members' : {
							items: [
								{ id: 'BY', text: 'Belarus' },
								{ id: 'BA', text: 'Bangladesh' },
								{ id: 'RU', text: 'Russia' },
								{ id: 'UA', text: 'Ukrain' },
								{ id: 'US', text: 'United States' },
								{ id: 'UK', text: 'United Kingdom' },
								{ id: 'UG', text: 'Uganda' }
							]
						}
					}
				});
				$('#w2ui-screenPopup #btnOk').on('click', function () {
					w2ui['admin_group_edit'].save(null, null, function (data) {
						if (data['status'] == 'success') {
							w2ui['admin_groups'].reload();
							$().w2popup('close');
						} else {
							app.error('Error: '+ data['message']);
						}
					})					
				});
			}
		});
	}

}) (app.admin_groups || {});