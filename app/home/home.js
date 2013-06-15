/****************************************************
*  --- Home Module
*/

app.home = (function (obj) {
	// private scope
	var config;
	var model;
	
	// public scope
	obj.render	= render;
	obj.action 	= action;

	init();
	return obj;

	// implementation

	function init () {
		app.get(['app/home/home-config.js'], function (files) {
			for (var i in files) eval(files[i]);
			// init application UI
			$().w2sidebar(config.home_sidebar);
			$().w2grid(config.home_grid);
			render();
		});
	}

	function render () {
		action('home-grid1', {});
	}

	function action (target, data) {
		switch (target) {
			case 'home-grid1':
				app.header('Home Grid');
				app.route.set('home');
				w2ui['app_layout'].content('left', w2ui['home_sidebar']);
				w2ui['app_layout'].content('main', w2ui['home_grid']);
				break;
			default:
				app.header(target);
				w2ui['app_layout'].content('main', '<div style="text-align: center; padding: 40px; font-size: 16px; color: #999;">Under Constructions</div>');
				console.log('No event handler for '+ target +'.');
				break;
		}
	}

}) (app.home || {});