/****************************************************
*  --- Home Module
*/

app.register('project', function (assets) {
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
		eval(assets['app/project/project-config.js']);

		// init grids
		$().w2sidebar(config.proj_sidebar);
		sidebar = w2ui.proj_sidebar;

		// define routes
		app.route.add({

			"/project*" : function (route, params) {
				// press toolbar
				toolbar.uncheck.apply(toolbar, toolbar.get());
				toolbar.check('project');
				// init layout
				layout.hide('right', true);
				if ($(layout.el('left')).attr('name') != 'proj_sidebar') layout.content('left', w2ui.proj_sidebar);
				layout.content('main', '');
			},

			"/project" : function (route, params) {
				app.header('Project Overview');
				sidebar.select('proj-overview');
				layout.content('main', '<div style="padding: 5px">Project Overview</div>');
			},

			"/project/tasks" : function (route, params) {
				app.header('Project Tasks');
				sidebar.select('proj-tasks');
				layout.content('main', '<div style="padding: 5px">Project Tasks</div>');
			}
		});
	}

	function render () {
		app.route.go('/project/overview');
	}

	function action () {
	}
});