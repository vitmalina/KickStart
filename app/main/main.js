/****************************************************
*  --- Main Module
*/

app.main = (function (obj) {
	// private scope
	var configs;
	var model;
	
	// public scope
	obj.appAction	= appAction;
	obj.render		= render;

	init();
	return obj;

	// implementation

	function init() {
		app.get(['app/main/main-config.js'], function (files) {
			for (var i in files) eval(files[i]);
			// init application UI
			$('#app-toolbar').w2toolbar(configs.app_toolbar);
			$('#app-tabs').w2tabs(configs.app_tabs);
			$('#app-main').w2layout(configs.app_layout);
			$().w2tree(configs.main_sidebar);
			// set user
			var mn = w2ui['app_toolbar'].get('user-menu');
			mn.caption = app.session['user'].fname + ' ' + app.session['user'].lname;
			w2ui['app_toolbar'].refresh();
			render();
		});
	}

	function render() {
		w2ui['app_layout'].content('left', w2ui['main_sidebar']);
		// click first element in first group
		//w2ui['main_sidebar'].doClick(w2ui['main_sidebar'].nodes[0].nodes[0].id);
		w2ui['main_sidebar'].doClick('admin-groups');
	}

	function appAction(target, data) {
		switch (target) {
			case 'quick-actions':
				break;

			case 'user-menu':
				console.log(data);
				if (data.subItem == null) break;
				if (data.param == 'log-out') {
					$.ajax({
						url 	: 'server/logout',
						complete: function (xhr, status) { document.location = 'login.html'; }
					});
				}
				break;

			case 'admin-users':
				$('#app-header').html('Administration: Users');
				app.load('admin_users', 'app/admin/users.js');
				break;

			case 'admin-groups':
				$('#app-header').html('Administration: User Groups');
				app.load('admin_groups', 'app/admin/groups.js');
				break;

			case 'admin-roles':
				$('#app-header').html('Administration: Roles');
				app.load('admin_roles', 'app/admin/roles.js');
				break;

			case 'admin-services':
				$('#app-header').html('Administration: Services');
				app.load('admin_services', 'app/admin/services.js');
				break;

			default:
				$('#app-header').html(target);
				w2ui['app_layout'].content('main', '<div style="text-align: center; padding: 40px; font-size: 16px; color: #999;">Under Constructions</div>');
				console.log('No event handler for '+ target +'.');
				break;
		}
	}

}) (app.main || {});