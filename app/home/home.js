/****************************************************
*  --- Home Module
*/

app.register('home', function (assets, params) {

	// private scope
	var config;
	var model;

	// initialization
	for (var a in assets) eval(assets[a]);
	$().w2sidebar(config.home_sidebar);
	$().w2grid(config.home_grid);

	// public scope
	return {
		render	: render,
		action	: action
	}

	/***********************************
	/*  -- IMPLEMENTATION
	*/

	function render () {
		action('home-grid1', {});
	}

	function action (target, data) {
		switch (target) {
			case 'home-grid1':
				app.header('Home Grid');
				w2ui['app_layout'].content('left', w2ui['home_sidebar']);
				w2ui['app_layout'].content('main', w2ui['home_grid']);
				break;
			default:
				app.header(target);
				w2ui['app_layout'].content('main', 
					'<div style="text-align: center; padding: 40px; width: 100%; font-size: 16px; color: #999;">Under Constructions</div>');
				console.log('No event handler for '+ target +'.');
				break;
		}
	}
});