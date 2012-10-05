/****************************************************
*  ---  Administration Services
*/

app.admin_services = (function (obj) {
	// private scope
	var configs;
	
	// public scope
	obj.addService	= addService;
	obj.render		= render;

	init();
	return obj;

	// implementation

	function init() {
		app.get([
		    'app/admin/services-config.js'
		 ], 
		function (files) {
			for (var i in files) eval(files[i]);
			// init application UI
			$().w2grid(configs.admin_services);
			render();
		});
	}

	function render() {
		w2ui['app_layout'].content('main', w2ui['admin_services']);
	}

	function addService(serviceid) {
		$().w2popup('load', {
			url 		: 'app/admin/services-create.html',
			width 		: 610,
			height 		: 405,
			title		: (serviceid == null ? 'Add Service' : 'Edit Service'),
			showClose	: true,
			showMax 	: false,
			modal 		: true,
			onClose: function () { $().w2tag(); },
			onOpen: function () {
				$().w2destroy('admin_service_edit');
				$('#w2ui-screenPopup .w2ui-box1').w2form({ 
					name 	: 'admin_service_edit',
					url  	: 'server/admin-services',
					recid	: serviceid
				});
				$('#w2ui-screenPopup #btnOk').on('click', function () {
					w2ui['admin_service_edit'].save(null, null, function (data) {
						if (data['status'] == 'success') {
							w2ui['admin_services'].reload();
							$().w2popup('close');
						} else {
							app.error('Error: '+ data['message']);
						}
					})					
				});
			}
		});
	}

}) (app.admin_services || {});