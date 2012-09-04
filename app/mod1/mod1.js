/****************************************************
*  ---  Module 1
*/

app.mod1 = (function (obj) {
	// private scope
	var configs;
	var model;
	
	// public scope
	obj.render		= render;

	init();
	return obj;

	// implementation

	function init() {
		app.get([
		    'app/mod1/mod1-config.js',
		    'app/mod1/mod1-model.js'
		 ], 
		function (files) {
			for (var i in files) eval(files[i]);
			// init application UI
			$().w2grid(configs.grid1);
			render();
		});
	}

	function render() {
		w2ui['app_layout'].content('main', w2ui['grid1']);
	}

}) (app.mod1 || {});