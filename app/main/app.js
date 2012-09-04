/****************************************************
*  --- Application Object
*/

var app = { 
	isLoaded: {},

	// ===========================================
	// -- Loads modules or calls .render()
	// -- if module was previously loaded

	load: function (mod_name, mod_url) {
		// check if was loaded before 
		if (app.isLoaded.hasOwnProperty(mod_name)) {
			if (typeof app[mod_name].render == 'undefined') {
				$.error('Loader: module "'+ mod_name + '" has no render() method.');
			} else {
				app[mod_name].render();
			}
		} else {
			app.ajax({ 
				url 	: mod_url, 
				dataType: "script", 
				success	: function (data, status, respObj) {
					app.isLoaded[mod_name] = true;
				},
				error 	: function (respObj, err, errData) {
					if (err == 'error') {
						$.error('Loader: module "'+ mod_name +'" failed to load ('+ mod_url +').');
					} else {
						app.isLoaded[mod_name] = true;
						$.error('Loader: module "'+ mod_name + '" is loaded ('+ mod_url +'), but with a parsing error(s) in line '+ errData.line +': '+ errData.message);
					}
				} 
			});		
		}
	},
	
	// ===========================================
	// -- Loads a set of files and returns 
	// -- its contents to the callBack function

	get: function (files, callBack) {
		var bufferObj = {};
		var bufferLen = files.length;
		
		for (var i in files) {
			// need a closure
			(function () {
				var index = i;
				var path  = files[i];
				app.ajax({
					url: path,
					dataType: 'text',
					success: function (data, success, responseObj) {
						if (success != 'success') {
							$.error('Loader: error while getting a file '+ path +'.');
							return;
						}
						bufferObj[index] = responseObj.responseText;
						loadDone();

					},
					error: function (data, err, errData) {
						if (err == 'error') {
							$.error('Loader: failed to load '+ files[i] +'.');
						} else {
							$.error('Loader: file "'+ files[i] + '" is loaded, but with a parsing error(s) in line '+ errData.line +': '+ errData.message);
							bufferObj[index] = responseObj.responseText;
							loadDone();
						}
					}
				});
			})();
		}
		// internal counter
		function loadDone() {
			bufferLen--;
			if (bufferLen <= 0) callBack(bufferObj);
		}
	},

	// ===========================================
	// -- Common place for all AJAX calls

	ajax: function (url, options) {
		if (typeof options == 'undefined') options = url; else $.extend(options, { url: url });
		if (typeof options.error != 'undefined') options._error_ = options.error; 
		// custom error handler
		options.error = function (respObj, status, error) {
			switch (respObj.status) {
				case 404: 
					error = 'File Not Found - '+ this.url;
					break;
			}
			app.error(respObj.status + ': '+ error);
		}
		options.cache = false;
		// submit through jquery
		$.ajax(options);
	},

	// ===========================================
	// -- Error dialog

	error: function (msg, title) {
		// if popup is open
		if ($('#w2ui-screenPopup').length > 0) {
			alert('Error: '+ msg);
			return;
		}
		// open in as a popup
		$().w2popup('open', {
			width 	: 450,
			height 	: 180,
			showMax : false,
			title 	: (typeof title != 'undefined' ? title : 'Error'),
			body 	: '<div style="padding: 15px 10px; text-align: center">'+ msg +'</div>',
			buttons : '<input type="button" value="Ok" onclick="$().w2popup(\'close\')" style="width: 60px">',
			type: 'errorMessage'
		});
		
	}
};

// ===========================================
// -- Load main module
$().ready(function () {
	app.load('main', 'app/main/main.js');
})
