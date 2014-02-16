/****************************************************
*  --- Home Module
*/

app.register('home', function (assets) {
	// private 
	var config;
	var model;
	var sidebar;
	var data; 

	var layout  = w2ui.app_layout;
	var toolbar = w2ui.app_toolbar;

	init();
	return {
		action 	: action
	};

	// implementation

	function init () {
		// process assets
		eval(assets['app/home/home-config.js']);

		// init grids
		$().w2sidebar(config.home_sidebar);
		$().w2grid(config.home_grid);
		$().w2grid(config.home_grid2);
		sidebar = w2ui.home_sidebar;

		// define routes
		app.route.add({

			"/home*" : function (route, params) {
				// press toolbar
				toolbar.uncheck.apply(toolbar, toolbar.get());
				toolbar.check('home');
				// init layout
				layout.hide('right', true);
				if ($(layout.el('left')).attr('name') != 'home_sidebar') layout.content('left', w2ui.home_sidebar);
				layout.content('main', '');
			},

			"/home" : function (route, params) {
				app.header('Home');
				sidebar.select('home-grid1');
				layout.content('main', w2ui.home_grid);
			},

			"/home/grid2" : function (route, params) {
				app.header('Second Grid');
				sidebar.select('home-grid2');
				layout.content('main', w2ui.home_grid2);
			}
		});
	}

	function render () {
		app.route.go('/home');
	}

	function action () {
	}
});