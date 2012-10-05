/************************************************************************
*   Library: Web 2.0 UI for jQuery (using prototypical inheritance)
*   - Following objects defined
* 		- w2ui.w2form 	- form widget
*		- $.w2form		- jQuery wrapper
*   - Dependencies: jQuery, w2utils, w2fields
* 
************************************************************************/


(function () {
	var w2form = function(options) {
		// public properties
		this.name  	  	= null;
		this.box		= null; 	// HTML element that hold this element
		this.page 		= 0;		// 0 based because of the array
		this.pages		= [];		// html, fields
		this.options	= {};		// additional options for fields list, enum, autocomplete
		this.url		= '';
		this.recid		= 0;		// can be null or 0
		this.record		= {};
		this.original   = {};
		this.postData	= {};
		this.isLoaded   = false;

		// events
		this.onRequest  = null,
		this.onLoad     = null,
		this.onSubmit	= null,
		this.onSave		= null,
		this.onChange	= null,
		this.onRender 	= null;
		this.onRefresh	= null;
		this.onResize 	= null;
		this.onDestroy	= null;
		this.onError 	= null;

		$.extend(true, this, options);
	};
	
	// ====================================================
	// -- Registers as a jQuery plugin
	
	$.fn.w2form = function(method) {
		if (typeof method === 'object' || !method ) {
			// check required parameters
			if (!method || typeof method.name == 'undefined') {
				$.error('The parameter "name" is required but not supplied in $().w2form().');
				return;
			}
			if (typeof w2ui[method.name] != 'undefined') {
				$.error('The parameter "name" is not unique. There are other objects already created with the same name (obj: '+ method.name +').');
				return;			
			}
			// remember items
			var record 		= method.record;
			var original	= method.original;
			var options		= method.options;
			// extend items
			var object = new w2form(method);
			$.extend(object, { record: {}, original: {}, fields: [], handlers: [] });
			// reassign variables
			for (var p in record)  	object.record[p]   	= $.extend(true, {}, record[p]); 
			for (var p in original) object.original[p] 	= $.extend(true, {}, original[p]); 
			for (var p in options)  object.options[p] 	= $.extend(true, {}, options[p]); 
			// render if necessary
			if ($(this).length != 0) {
				object.init(this);
				object.render($(this)[0]);
			}
			// register new object
			w2ui[object.name] = object;
			return object;
		
		} else if (typeof $(this).data('w2name') != 'undefined') {
			var obj = w2ui[$(this).data('w2name')];
			obj[method].apply(obj, Array.prototype.slice.call(arguments, 1));
			return this;
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.w2form' );
		}    
	}		

	// ====================================================
	// -- Implementation of core functionality
	
	w2form.prototype = {

		init: function (el, page) {
			// if page is not specified, then assume there is only one page
			if (typeof page == 'undefined') page = 0;
			this.pages[page] = {
				html   : $(el).html(),
				fields : []
			}
			var obj 	= this;
			$(el).find('input, textarea, select').each(function (index, el) {
				var type  = 'text';
				var name  = (typeof $(el).attr('name') != 'undefined' ? $(el).attr('name') : $(el).attr('id'));
				if (el.type == 'checkbox')  	type = 'checkbox';
				if (el.type == 'radio')     	type = 'radio';
				if (el.type == 'password')     	type = 'password';
				if (el.tagName == 'select') 	type = 'list';
				if (el.tagName == 'textarea')	type = 'textarea';
				if (typeof $(el).attr('w2type') != 'undefined') type = $(el).attr('w2type');
				var value = (type == 'checkbox' || type == 'radio' ? ($(el).attr('checked') ? true : false) : $(el).val());

				obj.pages[page].fields.push({
					el 			: el,
					name 		: name,
					type 		: type,
					readonly	: ($(el).attr('readonly') == 'readonly' ? true : false),
					required	: (typeof $(el).attr('required') != 'undefined' ? true : false),
					value		: value
				});
				if (name == '' || typeof name == 'undefined') {
					console.log("ERROR: (w2form."+ obj.name +") the name of the field cannot be empty.");
					console.log(el);
					return;
				}
				if (typeof obj.record[name] != 'undefined') {
					console.log("ERROR: w2form."+ obj.name +" - a field with name '"+ name +"' already exists in the form.");
					console.log(el);
					return;
				}
				obj.record[name] 	= value;
				obj.original[name] 	= value;				
			});
		},

		append: function (el) {

		},

		clear: function () {
			this.record = [];
			this.refresh();
		},
		
		reset: function (page) {
			var lookIn = this.pages;
			if (typeof page != 'undefined') lookIn = [this.pages[page]];
			// reset pages
			for (var p in lookIn) {
				lookIn[p] = {
					html 	: '',
					fields	: []
				}
			}
			// refresh
			this.refresh();		
		},

		get: function (field, page) {
			var lookIn = this.pages;
			if (typeof page != 'undefined') lookIn = [this.pages[page]];
			for (var p in lookIn) {
				for (var f in lookIn.fields) {
					if (lookIn.fields[f].name == field) return lookIn.fields[f];
				}
			}
			return null;
		},

		load: function (url, callBack) {
			if (typeof url == 'undefined') {
				$.error('You need to provide url argument when calling .load() method of "'+ this.name +'" object.');
				return;
			}
			// default action
			this.isLoaded = false;
			this.request(url, callBack);
		},
	
		reload: function (callBack) {
			if (this.url != '') {
				//this.clear();
				this.isLoaded = false;
				this.request(null, callBack);
			} else {
				this.isLoaded = true;
				this.refresh();
			}
		},

		request: function (postData, url, callBack) {
			if (typeof postData == 'undefined') postData = {};
			if (typeof url == 'undefined' || url == '' || url == null) url = this.url;
			if (url == '' || url == null) return;
			if (this.recid == null || typeof this.recid == 'undefined') this.recid = 0;
			// build parameters list
			var params = {};
			// add list params
			params['cmd']  	 = 'get-record';
			params['name'] 	 = this.name;
			params['recid']  = this.recid;
			// append other params
			$.extend(params, this.postData);
			$.extend(params, postData);
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'request', target: this.name, url: url, postData: params });
			if (eventData.stop === true) { if (typeof callBack == 'function') callBack(); return false; }
			// default action
			this.record	  = {};
			this.original = {};
			// call server to get data
			var obj = this;
			this.showStatus('Refreshing ');
			$.ajax({
				type		: 'POST',
				url			: url + (url.indexOf('?') > -1 ? '&' : '?') +'t=' + (new Date()).getTime(),
				data		: String($.param(eventData.postData, false)).replace(/%5B/g, '[').replace(/%5D/g, ']'),
				dataType	: 'text',
				complete	: function (respObj, status) {
					obj.hideStatus();
					obj.isLoaded = true;
					// event before
					var eventData = obj.trigger({ phase: 'before', target: obj.name, type: 'load', data: respObj.responseText , respObj: respObj, status: status });	
					if (eventData.stop === true) {
						if (typeof callBack == 'function') callBack();
						return false;
					}
					// default action
					if (typeof eventData.data != 'undefined' && eventData.data != '') {
						var data = 'data = '+ eventData.data; 	// $.parseJSON or $.getJSON did not work because it expect perfect JSON data
						var data = eval(data);					//  where everything is in double quotes
						if (data['status'] != 'success') {
							console.log('ERROR: '+ data['message']);
						} else {
							obj.record 	 = $.extend({}, data.record);
							obj.original = $.extend({}, data.record);
						}
					}
					// event after
					obj.trigger($.extend(eventData, { phase: 'after' }));
					obj.refresh();
					// call back
					if (typeof callBack == 'function') callBack();
				}
			});
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},

		save: function (postData, url, callBack) {
			var obj = this;
			// validate before saving
			var isError = false;
			for (var p in this.pages) {
				for (var f in this.pages[p].fields) {
					var field = this.pages[p].fields[f];
					if (field.required && (this.record[field.name] == '' || typeof this.record[field.name] == 'undefined')) {
						isError = true;
						$(field.el).w2tag('Required field', 'w2form-error');
					}
					switch (field.type) {
						case 'int':
							if (this.record[field.name] != '' && !w2utils.isInt(this.record[field.name])) {
								isError = true;
								$(field.el).w2tag('Not an integer', 'w2form-error');
							} 
							break;
						case 'float':
							if (this.record[field.name] != '' && !w2utils.isFloat(this.record[field.name])) {
								isError = true;
								$(field.el).w2tag('Not a float number', 'w2form-error');
							} 
							break;
						case 'money':
							if (this.record[field.name] != '' && !w2utils.isMoney(this.record[field.name])) {
								isError = true;
								$(field.el).w2tag('Not in money format', 'w2form-error');
							} 
							break;
						case 'hex':
							if (this.record[field.name] != '' && !w2utils.isHex(this.record[field.name])) {
								isError = true;
								$(field.el).w2tag('Not a hex', 'w2form-error');
							} 
							break;
						case 'email':
							if (this.record[field.name] != '' && !w2utils.isEmail(this.record[field.name])) {
								isError = true;
								$(field.el).w2tag('Not a valid email', 'w2form-error');
							} 
							break;
						case 'checkbox':
							// convert true/false
							if (this.record[field.name] == true) this.record[field.name] = 1; else this.record[field.name] = 0; 
							break;
						case 'date':
							// format date before submit
							if (this.record[field.name] != '' && !w2utils.isDate(this.record[field.name])) {
								isError = true;
								$(field.el).w2tag('Not a valid date', 'w2form-error');
							} else {
								this.record[field.name] = w2utils.formatDate(this.record[field.name], 'yyyy-mm-dd');
							}
							break;
					}
				}
			}
			if (isError === true) return;
			// submit save
			if (typeof postData == 'undefined' || postData == null) postData = {};
			if (typeof url == 'undefined' || url == '' || url == null) url = this.url;
			if (url == '' || url == null) return;
			this.showStatus('Saving...');
			// build parameters list
			var params = {};
			// add list params
			params['cmd']  	 = 'save-record';
			params['name'] 	 = this.name;
			params['recid']  = this.recid;
			// append other params
			$.extend(params, this.postData);
			$.extend(params, postData);
			params.record = this.record;
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'submit', target: this.name, url: url, postData: params });
			if (eventData.stop === true) { if (typeof callBack == 'function') callBack(); return false; }
			// default action
			$.ajax({
				type		: 'POST',
				url			: url + (url.indexOf('?') > -1 ? '&' : '?') +'t=' + (new Date()).getTime(),
				data		: String($.param(eventData.postData, false)).replace(/%5B/g, '[').replace(/%5D/g, ']'),
				dataType	: 'text',
				complete	: function (respObj, status) {
					obj.hideStatus();
					// event before
					var eventData = obj.trigger({ phase: 'before', target: obj.name, type: 'save', data: respObj.responseText , respObj: respObj, status: status });	
					if (eventData.stop === true) {
						if (typeof callBack == 'function') callBack();
						return false;
					}
					// default action
					if (typeof eventData.data != 'undefined' && eventData.data != '') {
						var data = 'data = '+ eventData.data; 	// $.parseJSON or $.getJSON did not work because it expect perfect JSON data
						var data = eval(data);					//  where everything is in double quotes
						if (data['status'] != 'success') {
							console.log('ERROR: '+ data['message']);
						} else {
							// reset original
							obj.original = $.extend({}, obj.record);
						}
					}
					// event after
					obj.trigger($.extend(eventData, { phase: 'after' }));
					obj.refresh();
					// call back
					if (typeof callBack == 'function') callBack(data);
				}
			});
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},

		showStatus: function (status) {

		},

		hideStatus: function (status) {

		},

		resize: function (width, height) {
			// does nothing, needed for compatibility
		},

		refresh: function (page) {
			var obj = this;
			if (typeof page != 'undefined') this.page = page;
			// refresh contents of the current page
			$(this.box).html(this.pages[this.page].html);
			for (var p in this.pages) {
				for (var f in this.pages[p].fields) {
					var field = this.pages[p].fields[f];
					if (this.page != p) {
						field.el = null;
					} else {
						field.el = $(this.box).find('[name="'+ field.name +'"]')[0];
						field.el.id = field.name;
						$(field.el).on('change', function () {
							var val = this.value;
							if (this.type == 'checkbox') val = this.checked ? true : false;
							if (this.type == 'radio')    val = this.checked ? true : false;
							//if (this.type == 'password') val = this.checked ? true : false;							
							obj.record[this.name] = val;
						});
					}
				}
			}
			// init controls with record
			for (var p in this.pages) {
				for (var f in this.pages[p].fields) {
					var field = this.pages[p].fields[f];
					var value = ((this.record[field.name] != 'undefined' && this.record[field.name] != null) ? this.record[field.name] : '');

					switch (field.type) {
						case 'email':
						case 'text':
							field.el.value = value;
							break;
						case 'date':
							if (w2utils.isDate(value)) {
								field.el.value = w2utils.formatDate(value);
							} else {
								field.el.value = '';
							}
							$(field.el).w2field('date');
							break;
						case 'int':
							field.el.value = value;
							$(field.el).w2field('int');
							break;
						case 'float':
							field.el.value = value;
							$(field.el).w2field('float');
							break;
						case 'money':
							field.el.value = value;
							$(field.el).w2field('money');
							break;
						case 'hex':
							field.el.value = value;
							$(field.el).w2field('hex');
							break;
						case 'alphaNumeric':
							field.el.value = value;
							$(field.el).w2field('alphaNumeric');
							break;
						case 'checkbox':
							if (this.record[field.name] == true || this.record[field.name] == 1 || this.record[field.name] == 't') {
								$(field.el).attr('checked', true);
							} else {
								$(field.el).removeAttr('checked');
							}
							break;
						case 'password':
							// hide passwords
							field.el.value = value;
							break;
						case 'list':
							if (typeof this.options[field.name] == 'undefined') {
								console.log("ERROR: (w2form."+ obj.name +") the field "+ field.name +" defined as list but not w2form.options["+ field.name +"] provided.");
								break;
							}
							$(field.el).w2field($.extend({}, this.options[field.name], { 
								type 		: 'autocomplete',
								showOnClick : true
							}));
							break;
						case 'enum':
							if (typeof this.options[field.name] == 'undefined') {
								console.log("ERROR: (w2form."+ obj.name +") the field "+ field.name +" defined as enum but not w2form.options["+ field.name +"] provided.");
								break;
							}
							$(field.el).w2field($.extend({}, this.options[field.name], { 
								type 		: 'autocomplete',
								multiSelect : true,
								showOnClick : true
							}));
							break;
						default:
							console.log('Error: field type "'+ field.type +'" is not recognized.');
							break;						
					}
				}
			}
		},

		render: function (box) {
			if (typeof box != 'undefined') this.box = box;
			var html = '';
			if (typeof this.pages[this.page] == 'undefined' || typeof this.pages[this.page].html == 'undefined') {
				html = '<div style="padding: 5px; text-align: center">Requested page is not defined.</div>';
			} else {
				html = this.pages[this.page].html;
			}
			$(this.box).html(html);
			if (this.url != '') if (this.recid != 0) this.request(); else this.refresh();
		},

		destroy: function () { 
			// event before
			var eventData = this.trigger({ phase: 'before', target: this.name, type: 'destroy' });	
			if (eventData.stop === true) return false;
			// clean up
			if (typeof this.toolbar == 'object' && this.toolbar.destroy) this.toolbar.destroy();
			$(this.box).html('');
			delete w2ui[this.name];
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
	}
	
	$.extend(w2form.prototype, $.w2event);
})();		