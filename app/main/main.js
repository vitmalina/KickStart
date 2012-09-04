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
			render();
		});
	}

	function render() {
		w2ui['app_layout'].content('left', w2ui['main_sidebar']);
		// click first element in first group
		w2ui['main_sidebar'].doClick(w2ui['main_sidebar'].nodes[0].nodes[0].id);
	}

	function appAction(target, data) {
		switch (target) {
			case 'main-list1':
				$('#app-header').html('Module 1');
				app.load('mod1', 'app/mod1/mod1.js');
				break;

			default:
				$('#app-header').html(target);
				w2ui['app_layout'].content('main', '<div style="text-align: center; padding: 40px; font-size: 16px; color: #999;">Under Constructions</div>');
				console.log('No event handler for '+ target +'.');
				break;
		}
	}

}) (app.main || {});