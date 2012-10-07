/************************************************************************
*   Library: Web 2.0 UI for jQuery (using prototypical inheritance)
*   - Following objects defined
* 		- w2ui.w2grid 	- grid widget
*		- $.w2grid		- jQuery wrapper
*   - Dependencies: jQuery, w2utils, w2toolbar, w2fields
*
*   == NICE TO HAVE
*       - Column and Search Objects
* 		- hidden search fields (but still searchable from js)
* 		- select/unselect function to mark records as selected and unselected
* 		- doSelect - selects if not selected, otherwise unselects also shift and ctrl keys
* 
************************************************************************/

(function () {
	var w2grid = function(options) {
	
		// public properties
		this.name  	  			= null;
		this.box				= null; 	// HTML element that hold this element
		this.header				= '';
		this.url				= '';
		this.columns			= []; 		// { field, caption, size, attr, render, hidden, minWidth, [editable: {type, inTag, outTag, style, items}] }
		this.columnGroups		= [];		// { span: int, caption: 'string', master: true/false }
		this.records			= [];		// { recid: int(requied), field1: 'value1', ... fieldN: 'valueN', style: 'string', editable: true/false, summary: true/false }
		this.searches			= [];		// { type, caption, field, inTag, outTag, default, items }
		this.searchData			= [];
		this.sortData			= [];
		this.postData			= {};
		this.toolbar			= {}; 		// if not empty object; then it is toolbar object
		
		this.show = {
			header			: false,
			toolbar			: false,
			search			: false,
			footer			: false,
			columnHeaders	: true,
			lineNumbers		: false,
			expandColumn	: false,
			selectColumn	: false,
			emptyRecords	: true,
			toolbarReload	: true,
			toolbarColumns	: true,
			toolbarSearch	: true
		},
		
		this.fixedBody			= true;		// if false; then grid grows with data
		this.fixedRecord		= true;		// if false; then record height grows with data
		this.multiSearch		= true;
		this.multiSelect		= true;
		this.multiSort			= true;
		this.keyboard			= true;		// if user clicks on the list; it will bind all events from the keyboard for that list
	
		this.total				= 0;		// total number of records
		this.page				= 0; 		// current page
		this.recordsPerPage		= 50; 
		this.style				= '';
		this.isLoaded			= false;
		this.width				= null;		// read only
		this.height				= null;		// read only
	
		this.msgDelete			= 'Are you sure you want to delete selected record(s)?';
		this.msgNoData			= 'There is no data.';
	
		// ----- still to review --
		this.layout				= 'table'; 	// can be 'table' or 'div'
		this.tmpl				= '';
		this.tmpl_start			= '';
		this.tmpl_end			= '';
		this.tmpl_group			= '';
		this.tmpl_empty			= '<div style="padding: 8px;">~msg~</div>';
		// ------ 
	
		// events
		this.onLoad				= null;
		this.onRequest			= null;		// called on any server event
		this.onAdd				= null;
		this.onDelete			= null;
		this.onSelect			= null;
		this.onUnselect 		= null;
		this.onClick 			= null;
		this.onDblClick 		= null;
		this.onSort 			= null;
		this.onChange 			= null;		// called when editable record is changed
		this.onExpand 			= null;
		this.onRender 			= null;
		this.onRefresh 			= null;
		this.onResize 			= null;
		this.onDestroy 			= null;
		this.onError 			= null;
	
		// internal
		this.recid				= null; 	// might be used by edit class to set sublists ids
		this.searchOpened		= false;
		this.searchApplied		= false;
		this.last_search		= '';
		this.last_field			= 'all';
		this.last_logic			= 'OR';
		this.last_scrollTop		= 0;
		this.last_scrollLeft	= 0;
		this.last_selected		= [];
		this.last_sortData		= null;
		this.last_showSearch	= null;
		this.last_sortCount		= 0;
		this.transition			= false;
			
		this.isIOS = (navigator.userAgent.toLowerCase().indexOf('iphone') != -1 || 
			navigator.userAgent.toLowerCase().indexOf('ipod') != -1 ||
			navigator.userAgent.toLowerCase().indexOf('ipad') != -1) ? true : false;
				  
		$.extend(true, this, options);
	};
	
	// ====================================================
	// -- Registers as a jQuery plugin
	
	$.fn.w2grid = function(method) {
		if (typeof method === 'object' || !method ) {
			// check required parameters
			if (!method || typeof method.name == 'undefined') {
				$.error('The parameter "name" is required but not supplied in $().w2grid().');
				return;
			}
			if (typeof w2ui[method.name] != 'undefined') {
				$.error('The parameter "name" is not unique. There are other objects already created with the same name (obj: '+ method.name +').');
				return;			
			}
			// remember items
			var columns		= method.columns;
			var columnGroups= method.columnGroups;
			var records		= method.records;
			var searches	= method.searches;
			var searchData	= method.searchData;
			var sortData	= method.sortData;
			var postData 	= method.postData;
			var toolbar		= method.toolbar;
			// extend items
			var object = new w2grid(method);
			$.extend(object, { postData: {}, records: [], columns: [], searches: [], toolbar: {}, sortData: [], searchData: [], handlers: [] });
			if (object.onExpand != null) object.show.expandColumn = true;
			$.extend(true, object.toolbar, toolbar);
			// reassign variables
			for (var p in columns)    	object.columns[p]    	= $.extend({}, columns[p]); 
			for (var p in columnGroups) object.columnGroups[p] 	= $.extend({}, columnGroups[p]); 
			for (var p in searches)   	object.searches[p]   	= $.extend({}, searches[p]); 
			for (var p in searchData) 	object.searchData[p] 	= $.extend({}, searchData[p]); 
			for (var p in sortData)    	object.sortData[p]  	= $.extend({}, sortData[p]); 
			for (var p in postData)   	object.postData[p]   	= $.extend({}, postData[p]); 
			// check if there are records without recid
			for (var r in records) {
				if (records[r].recid == null || typeof records[r].recid == 'undefined') {
					$.error('Cannot add records without recid. (obj: '+ object.name +')');
					return;
				}
				object.records[r] = $.extend({}, records[r]);
			}
			if (object.records.length > 0) object.total = object.records.length;
			// init toolbar
			object.initToolbar(); 
			// render if necessary
			if ($(this).length != 0) {
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
			$.error( 'Method ' +  method + ' does not exist on jQuery.w2grid' );
		}    
	}
	
	// ====================================================
	// -- Implementation of core functionality
	
	w2grid.prototype = {
	
		addColumn: function (options) {
			if (!$.isArray(options)) options = [options];
			for (var o in options) this.columns.push(options[o]);
			this.refresh();
		},
		
		removeColumn: function (field) {
			var removed = 0;
			for (var a in arguments) {
				var field = arguments[a];
				var ind = null
				for (var c in this.columns) {
					if (this.columns[c].field == field) ind = c;
				}
				if (ind != null) { this.columns.splice(ind, 1); removed++; }
			}
			this.refresh();
			return removed;
		},
		
		getColumn: function (field) {
 			for (var i=0; i<this.columns.length; i++) {
				if (this.columns[i].field == field) return this.columns[i];
			}
			return null;
		},	

		addSearch: function (options) {
			if (!$.isArray(options)) options = [options];
			for (var o in options) this.searches.push(options[o]);
		},
	
		removeSearch: function (field) {
			var removed = 0;
			for (var a in arguments) {
				var field = arguments[a];
				var ind = null
				for (var s in this.searches) {
					if (this.searches[s].field == field) ind = s;
				}
				if (ind != null) { this.searches.splice(ind, 1); removed++; }
			}
			return removed;
		},
		
		getSearch: function (field) {
 			for (var i=0; i<this.searches.length; i++) {
				if (this.searches[i].field == field) return this.searches[i];
			}
			return null;
		},	

		add: function (options) { 
			if (!$.isArray(options)) options = [options];
			for (var o in options) {
				if (options[o].recid == null || typeof options[o].recid == 'undefined') {
					$.error('Cannot add record without recid. (obj: '+ this.name +')');
					continue;
				}
				this.records.push(options[o]);
			}
			this.total = this.records.length;
			if (this.url == '') {
				this.localSearch();
				this.localSort();
			}
			this.refresh();
		},
		
		remove: function (recid) { // NICE TO HAVE: input array
			var removed = 0;
			for (var a in arguments) {
				for (var r = this.records.length-1; r >= 0; r--) {
					if (this.records[r].recid == arguments[a]) { this.records.splice(r, 1); removed++; }
				}
			}
			if (this.url == '') {
				this.total = this.records.length;
				this.localSearch();
				this.localSort();
			}
			this.refresh();
			return removed;
		},
		
		clear: function () {
			this.records = [];
			this.total   = 0;
			this.refresh();
		},
		
		reset: function() {
			// move to first page
			this.page 	= 0;
			this.width	= null;
			this.height = null;
			this.isLoaded = false;
			// reset last remembered state
			this.searchOpened		= false;
			this.searchApplied		= false;
			this.searchData			= [];
			this.last_search		= '';
			this.last_field			= 'all';
			this.last_logic			= 'OR';
			this.last_scrollTop		= 0;
			this.last_scrollLeft	= 0;
			this.last_selected		= [];
			this.last_sortCount		= 0;
			// initial search panel
			if (this.last_sortData != null ) this.sortData	 = this.last_sortData;
			if (this.show.search != null )  this.show.search = this.last_showSearch;
			// select none without refresh
			for (var i=0; i<this.records.length; i++) { 
				this.records[i].selected = false; 
				this.records[i].hidden	 = false;
			}
			// refresh
			this.refresh();		
		},
		
		set: function (recid, record) { // does not delete existing, but overrides on top of it
			var ind = this.getIndex(recid);
			var record;
			$.extend(this.records[ind], record);
			// refresh only that record
			var tr = $('#grid_'+ this.name +'_rec_'+recid);
			if (tr.length != 0) {
				var line = tr.attr('line');
				var j = 0;
				while (true) {
					var col = this.columns[j];
					if (col.hidden) { j++; if (typeof this.columns[j] == 'undefined') break; else continue; }
					var field = '';
					if (String(col.field).indexOf('.') > -1) {
						var tmp = String(col.field).split('.');
						field = this.records[ind][tmp[0]];
						if (typeof field == 'object' && field != null) {
							field = field[tmp[1]];
						}							
					} else {
						field = this.records[ind][col.field];
					}
					if (typeof col.render != 'undefined') {
						if (typeof col.render == 'function') field = col.render.call(this, this.records[ind], ind);
						if (typeof col.render == 'object')   field = col.render[this.records[ind][col.field]];
					}
					if (field == null || typeof field == 'undefined') field = '';
					// common render functions
					if (typeof col.render == 'string') {
						switch (col.render.toLowerCase()) {
						case 'url':
							var pos = field.indexOf('/', 8);
							field = '<a href="'+ field +'" target="_blank">'+ field.substr(0, pos) +'</a>';
							break;
			
						case 'repeat':
							if (ind > 0 && this.records[ind][col.field] == this.records[ind-1][col.field] && this.records[ind][col.field] != '') {
								field = '-- // --';
							}
							break;
						}
					}		
					$(tr).find('#grid_'+ this.name +'_cell_'+ line + '_'+ j +' > div').html(field);
					// field
					j++;
					if (typeof this.columns[j] == 'undefined') break;
				}
			}
		},
		
		get: function (recid) {
			for (var i=0; i<this.records.length; i++) {
				if (this.records[i].recid == recid) return this.records[i];
			}
			return null;
		},
		
		getIndex: function (recid) {
			for (var i=0; i<this.records.length; i++) {
				if (this.records[i].recid == recid) return i;
			}
			return null;
		},
		
		find: function (obj) { // NICE TO HAVE: multiple object input
			if (typeof obj == 'undefined' || obj == null) obj = {};
			var recs = [];
			for (var i=0; i<this.records.length; i++) {
				var flag = true;
				for (var o in obj) if (obj[o] != this.records[i][o]) flag = false;
				if (flag) recs.push(this.records[i].recid);
			}
			return recs;
		},
		
		localSort: function () {
				var obj = this;
			this.records.sort(function (a, b) {
				// summary records
				if (a.summary && b.summary) {
					if (a.recid > b.recid)  return 1;
					if (a.recid <= b.recid) return -1;
				}				
				var ret = 0;
				for (var s in obj.sortData) {
					var aa = a[obj.sortData[s].field];
					var bb = b[obj.sortData[s].field];
					if (typeof aa == 'string') aa = $.trim(aa.toLowerCase());
					if (typeof bb == 'string') bb = $.trim(bb.toLowerCase());
					if (aa > bb) ret = (obj.sortData[s].direction == 'asc' ? 1 : -1);
					if (aa < bb) ret = (obj.sortData[s].direction == 'asc' ? -1 : 1);
					if (typeof aa != 'object' && typeof bb == 'object') ret = -1;
					if (typeof bb != 'object' && typeof aa == 'object') ret = 1;
					if (ret != 0) break;
				}
				return ret;
			});
			this.last_sortCount = this.records.length;
		},
		
		localSearch: function () {
			// local search
			var obj = this;
			this.total = this.records.length;
			// mark all records as shown
			for (var r in this.records) { this.records[r].hidden = false; }
			// hide records that did not match
			if (this.searchData.length > 0) {
				this.total = 0;
				for (var r in this.records) {
					var rec = this.records[r];
					var fl  = 0;
					for (var s in this.searches) {
						var search 	= this.searches[s];
						var sdata  	= findSearch(search.field);
						if (sdata == null) continue;
						var val1 	= String(rec[search.field]).toLowerCase();
						if (typeof sdata.value != 'undefined') {
							var val2 = String(sdata.value).toLowerCase();
						} else {
							var val2 = sdata.valueStart;
							var val3 = sdata.valueEnd;
						}
						switch (sdata.operator) {
							case 'is':
								if (rec[search.field] == sdata.value) fl++; // do not hide record
								if (search.type == 'text' && val1 == val2) fl++;
								if (search.type == 'date') {
									var da = new Date(val1);
									var db = new Date(val2);
									d0 = Date.UTC(da.getFullYear(), da.getMonth(), da.getDate());
									d1 = Date.UTC(db.getFullYear(), db.getMonth(), db.getDate());
									if (d0 == d1) fl++;
								}
								break;
							case 'between':
								if (search.type == 'int' && parseInt(rec[search.field]) >= parseInt(val2) && parseInt(rec[search.field]) <= parseInt(val3)) fl++;
								if (search.type == 'float' && parseFloat(rec[search.field]) >= parseFloat(val2) && parseFloat(rec[search.field]) <= parseFloat(val3)) fl++;
								if (search.type == 'date') {
									var da = new Date(val1);
									var db = new Date(val2);
									var dc = new Date(val3);
									d0 = Date.UTC(da.getFullYear(), da.getMonth(), da.getDate());
									d1 = Date.UTC(db.getFullYear(), db.getMonth(), db.getDate());
									d2 = Date.UTC(dc.getFullYear(), dc.getMonth(), dc.getDate());
									if (d0 >= d1 && d0 <= d2) fl++;
								}
								break;
							case 'begins with':
								if (val1.indexOf(val2) == 0) fl++; // do not hide record
								break;
							case 'contains':
								if (val1.indexOf(val2) >= 0) fl++; // do not hide record
								break;
							case 'ends with':
								if (val1.indexOf(val2) == val1.length - val2.length) fl++; // do not hide record
								break;
						}
					}
					if (this.last_logic == 'OR')  rec.hidden = (fl == 0 ? true : false);
					if (this.last_logic == 'AND') rec.hidden = (fl != this.searchData.length ? true : false);
					if (rec.hidden !== true) this.total++;
				}
			}
			
			function findSearch(field) {
				for (var s in obj.searchData) {
					if (obj.searchData[s].field == field) return obj.searchData[s];					
				}
				return null;
			}
		},
	
		select: function (recid, flag) {
			var record = this.get(recid);
			if (record == null) return;
			// force? select/unselect
			if (flag != undefined && flag != null) {
				if (record.selected == flag) return;
				record.selected = !flag;
			}
			// event before
			var eventData = this.trigger({ phase: 'before', type: record.selected ? 'unselect' : 'select', target: this.name, recid: recid });	
			if (eventData.stop === true) return false;
			// default action
			var i = this.getIndex(recid);
			if (record.selected) {
				record.selected = false
				$('#grid_'+this.name +'_rec_'+ record.recid).removeClass('w2ui-selected').data('selected', '');
				if ($('#grid_'+this.name +'_rec_'+ record.recid).length != 0) {
					$('#grid_'+this.name +'_rec_'+ record.recid)[0].style.cssText = $('#grid_'+this.name +'_rec_'+ record.recid).attr('custom_style');
				}
				$('#grid_'+ this.name +'_cell_'+ i +'_select_check').removeAttr('checked');
			} else {
				record.selected = true;
				$('#grid_'+this.name +'_rec_'+ record.recid).addClass('w2ui-selected').data('selected', 'yes');
				$('#grid_'+ this.name +'_cell_'+ i +'_select_check').attr('checked', true);
			}
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
	
		selectAll: function () {
			if (this.multiSelect === false) return;
			for (var i=0; i<this.records.length; i++) { 
				if (this.records[i].hidden) continue;
				this.select(this.records[i].recid, true); 
			}
			if (this.getSelection().length > 0) this.toolbar.enable('delete-selected'); else this.toolbar.disable('delete-selected'); 
		},
	
		selectNone: function () {
			for (var i=0; i<this.records.length; i++) { 
				if (this.records[i].selected !== true) continue;
				this.select(this.records[i].recid, false); 
			}
			this.last_selected = [];
		},
	
		getSelection: function () {
			var recs = [];
			for (var i in this.records) {
				if (this.records[i].selected === true) {
					recs.push(this.records[i].recid);
				}
			}
			return recs;
		},
	
		goto: function (newPage) {
			var totalPages = Math.floor(this.total / this.recordsPerPage);
			if (this.total % this.recordsPerPage != 0 || totalPages == 0) totalPages++;
			if (totalPages < 0) totalPages = 1;
			if (newPage < 0) newPage = 0;
			if (newPage >= totalPages) newPage = totalPages - 1;
			// reset scrolling position
			this.last_scrollTop		= 0;
			this.last_scrollLeft	= 0;
			this.last_selected		= [];
			// refresh items
			this.isLoaded = false;
			this.page = newPage; 
			this.reload();
		},
		
		load: function (url, callBack) {
			if (typeof url == 'undefined') {
				$.error('You need to provide url argument when calling .load() method of "'+ this.name +'" object.');
				return;
			}
			// default action
			this.isLoaded = false;
			this.request('get-records', {}, url, callBack);
		},
	
		reload: function (callBack) {
			if (this.url != '') {
				//this.clear();
				this.isLoaded = false;
				this.request('get-records', {}, null, callBack);
			} else {
				this.isLoaded = true;
				this.refresh();
			}
		},
		
		search: function (field, value) {
			this.searchData  = [];
			// can submit entire search structure
			if ($.isArray(field)) {
				this.searchData = field;
				field = null;
			} else {
				// reset search
				if (value == '') { 
					this.searchReset(); 
					return; 
				} 
			}
			if (field == '') field = this.last_field;
			// reset scrolling position
			this.last_scrollTop		= 0;
			this.last_scrollLeft	= 0;
			this.last_selected		= [];
			// -- build searches
			if (typeof field == 'undefined' || field == null) {
				this.last_field  = '';
				this.last_search = '';
				this.last_logic  = 'AND';
				// advanced search
				for (var s in this.searches) {
					var search 	 = this.searches[s];
					var operator = $('#grid_'+ this.name + '_operator_'+s).val();
					var value1   = $('#grid_'+ this.name + '_field_'+s).val();
					var value2   = $('#grid_'+ this.name + '_field2_'+s).val();
					if ((value1 != '' && value1 != null) || (typeof value2 != 'undefined' && value2 != '')) {
						var tmp = {
							field		: search.field,
							dataType	: search.type,
							operator	: operator,				
						};
						if (operator == 'between') {
							$.extend(tmp, {
								valueStart	: value1,
								valueEnd	: value2
							});
						} else {
							$.extend(tmp, { value: value1 });
						}
						this.searchData.push(tmp);
					}
				}
			} else {
				this.last_field  = field;
				this.last_search = value;
				this.last_logic	 = 'OR';
				// loop through all searches and see if it applies
				for (var s in this.searches) {
					var search 	 = this.searches[s];
					if (field != 'all' && search.field == field) {
						var tmp = {
							field		: search.field,
							dataType	: search.type,
							operator	: (search.type == 'text' ? 'begins with' : 'is'),
							value		: value
						};
						this.searchData.push(tmp);
					}
					if (field == 'all') {
						if (search.type == 'text' || (search.type == 'int' && w2utils.isInt(value)) || (search.type == 'float' && w2utils.isFloat(value)) 
								|| (search.type == 'money' && w2utils.isMoney(value)) || (search.type == 'hex' && w2utils.isHex(value)) 
								|| (search.type == 'date' && w2utils.isDate(value)) || (search.type == 'alphaNumeric' && w2utils.isAlphaNumeric(value)) ) {
							var tmp = {
								field		: search.field,
								dataType	: search.type,
								operator	: (search.type == 'text' ? 'begins with' : 'is'),
								value		: value
							};
							this.searchData.push(tmp);
						}
					}
				}
			}
			// -- clear all search field
			this.searchApplied = true;		
			this.searchOpen(false);
			// apply search
			if (this.url != '') {
				this.isLoaded = false;
				this.page = 0;
				this.reload();
			} else {
				// local search
				this.localSearch();
				this.goto(0);			
			}
		},
		
		searchOpen: function (flag) {
			if (!this.box) return;
			if (typeof flag == 'undefined') flag = !this.searchOpened;
			var obj = this;
			this.searchOpened = !flag;
			if (this.searches.length == 0) return;
			// slide down
			if (this.searchOpened) {
				this.searchOpened = false;
				$('#w2ui-global-searches').css('box-shadow', '0px 0px 0px white');
				$('#w2ui-global-searches > div').css({
					'-webkit-transform': 'translate3d(0px, -'+ $('#w2ui-global-searches').height() +'px, 0px)'
				});				
				setTimeout(function () {
					$('#w2ui-global-searches').hide();
					$('#w2ui-global-searches > div').html('');
				}, 300);
			} else {
				this.searchOpened = true;
				if ($('#w2ui-global-searches').length == 0) {
					$('body').append('<div id="w2ui-global-searches"> <div style=""></div> </div>');
				}
				$('#w2ui-global-searches').css({
					left 	: $('#grid_'+ this.name +'_search_all').offset().left + 'px',
					top 	: ($('#grid_'+ this.name +'_search_all').offset().top 
							   + w2utils.getSize($('#grid_'+ this.name +'_search_all'),  'height') 
							  ) + 'px'
				}).show().data('grid-name', this.name);
				$('#w2ui-global-searches > div').html(this.getSearchesHTML())
				$('#w2ui-global-searches > div').css({
					'-webkit-transform': 'translate3d(0px, -'+ $('#w2ui-global-searches').height() +'px, 0px)'
				});
				setTimeout(function () {
					$('#w2ui-global-searches > div').css({
						'-webkit-transition': '.3s',
						'-webkit-transform': 'translate3d(0px, 0px, 0px)'
					});
					if (obj.last_logic == 'OR') obj.searchData = [];
					obj.initSearches();
				}, 10);
				setTimeout(function () { 
					$('#w2ui-global-searches').css({ 'box-shadow': '0px 2px 10px #777' });	
				}, 350);
			}
		},
	
		searchReset: function () {
			this.searchData  	= [];
			this.last_search 	= '';
			this.last_field  	= 'all';
			this.last_logic		= 'OR';
			$('#w2ui-global-searches *[rel=search]').val(null);
			this.search();
			this.searchApplied 	= false;
			this.show.search   	= false;
			this.refresh();
		},
		
		request: function (cmd, add_params, url, callBack) {
			if (typeof add_params == 'undefined') add_params = {};
			if (typeof url == 'undefined' || url == '' || url == null) url = this.url;
			if (url == '' || url == null) return;
			// build parameters list
			var params = {};
			// add list params
			params['cmd']  	 		= cmd;
			params['name'] 	 		= this.name;
			params['limit']  		= this.recordsPerPage;
			params['offset'] 		= this.page * this.recordsPerPage;
			params['selected'] 		= this.getSelection();
			params['search']  		= this.searchData;
			params['search-logic'] 	= this.last_logic;
			params['sort'] 	  		= (this.sortData.length != 0 ? this.sortData : '');
			// if there is a recid (some some edit connections)
			if (this.recid != null) params['recid'] = this.recid;
			// append other params
			$.extend(params, this.postData);
			$.extend(params, add_params);
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'request', target: this.name, url: url, postData: params, cmd: cmd });
			if (eventData.stop === true) { if (typeof callBack == 'function') callBack(); return false; }
			// default action
			if (cmd == 'get-records') this.records = [];
			// call server to get data
			var obj = this;
			this.showStatus('Refreshing ');
			$.ajax({
				type		: 'POST',
				url			: url + (url.indexOf('?') > -1 ? '&' : '?') +'t=' + (new Date()).getTime(),
				data		: String($.param(eventData.postData, false)).replace(/%5B/g, '[').replace(/%5D/g, ']'),
				dataType	: 'text',
				complete	: function (xhr, status) {
					obj.hideStatus();
					obj.isLoaded = true;
					// event before
					var eventData = obj.trigger({ phase: 'before', target: obj.name, type: 'load', data: xhr.responseText , xhr: xhr, status: status });	
					if (eventData.stop === true) {
						if (typeof callBack == 'function') callBack();
						return false;
					}
					// default action
					if (typeof eventData.data != 'undefined' && eventData.data != '') {
						var data = 'data = '+ eventData.data; 	// $.parseJSON or $.getJSON did not work because it expect perfect JSON data
						var data = eval(data);					//  where everything is in double quotes
						if (data['status'] != 'success') {
							if (xhr['status'] == 403) {
								document.location = 'login.html'
								return;
							}
							// need a time out because message might be already up
							setTimeout(function () {
								$().w2popup('open', {
									width 	: 400,
									height 	: 180,
									showMax : false,
									title 	: 'Error',
									body 	: '<div style="padding: 15px 5px; text-align: center;">'+ data['message'] +'</div>',
									buttons : '<input type="button" value="Ok" onclick="$().w2popup(\'close\');" style="width: 60px; margin-right: 5px;">'
								});
							}, 300);
						} else {
							if (cmd == 'get-records') $.extend(obj, data);
							if (cmd == 'delete-records') { obj.reload(); return; }
						}
					}
					// event after
					if (obj.url == '') {
						obj.localSearch();
						obj.localSort();
					}
					obj.trigger($.extend(eventData, { phase: 'after' }));
					obj.refresh();
					// call back
					if (typeof callBack == 'function') callBack();
				}
			});
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
	
		getChanged: function () {
			// build new edits
			var saveData = [];
			var flag = false;
			for (var i=0; i<this.records.length; i++) {
				var record 	= this.records[i];
				var tmp 	= {};
				for (var j=0; j<this.columns.length; j++) {
					var col = this.columns[j];
					if (col.hidden || col.field == 'recid' || $('#grid_'+ this.name +'_edit_'+ i +'_'+ j).length == 0) continue;				
					var newValue = $('#grid_'+ this.name +'_edit_'+ i +'_'+ j).val();
					var oldValue = record[col.field];
					if (typeof oldValue == 'undefined') oldValue = '';
					if (newValue != oldValue) {
						flag = true;
						tmp[col.field] = newValue;
					}
				}
				if (!$.isEmptyObject(tmp)) {
					saveData.push($.extend({}, { recid: this.records[i].recid }, tmp));
				}
			}
			return saveData;
		},
		
		// ===================================================
		// --  Action Handlers
	
		doAdd: function () {
			// event before
			var eventData = this.trigger({ phase: 'before', target: this.name, type: 'add', recid: null });	
			if (eventData.stop === true) return false;
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));	
		},
	
		doSave: function () {
			var changed = this.getChanged();
			// event before
			var eventData = this.trigger({ phase: 'before', target: this.name, type: 'save', changed: changed });	
			if (eventData.stop === true) return false;
			if (this.url != '') {
				this.request('save-records', { 'changed' : changed }, null, function () {
					// event after
					this.trigger($.extend(eventData, { phase: 'after' }));	
				});
			} else {
				for (var c in changed) {
					var record = this.get(changed[c].recid);
					for (var s in changed[c]) {
						if (s == 'recid') continue;
						record[s] = changed[c][s];
					}
				}				
				$('#grid_'+ this.name + ' .w2ui-editable').removeClass('changed');
				this.selectNone();
				// event after
				this.trigger($.extend(eventData, { phase: 'after' }));	
			}
		},
	
		doEdit: function (type, el, event) {
			var recid  = $(el).attr('recid');
			var record = this.get(recid);
			if (!record.selected) {
				this.selectNone();
				this.select(recid);
			}
			
			switch (type) {
				case 'click':
					event.stopPropagation();
					event.preventDefault();
					break;
				case 'focus':
					$(el).addClass('active');
					break;
					
				case 'blur': 
					$(el).removeClass('active');
					var oldValue = record[$(el).attr('field')];
					if (typeof oldValue == 'undefined') oldValue = '';
					if ($(el).val() != oldValue) {
						var eventData = this.trigger({ phase: 'before', type: 'change', target: el.id, recid: recid });	
						if (eventData.stop === true) return false;
						$(el).addClass('changed'); 
						this.trigger($.extend(eventData, { phase: 'after' }));
					} else {
						$(el).removeClass('changed');
					}
					break;
					
				case 'keyup': 					
					if ($(el).data('stop') === true) {
						$(el).data('stop', false);
						break;					
					}
					if (event.keyCode == 40 || event.keyCode == 13) { 
						var newEl = $('#grid_'+ this.name + '_edit_'+ (parseInt($(el).attr('line')) + 1) +'_'+ $(el).attr('column'));
						if (newEl.length > 0) {
							newEl[0].select(); 
							newEl[0].focus(); 
						}
					} 
					if (event.keyCode == 38) { 
						var newEl = $('#grid_'+ this.name + '_edit_'+ (parseInt($(el).attr('line')) - 1) +'_'+ $(el).attr('column'));
						if (newEl.length > 0) {
							newEl[0].select(); 
							newEl[0].focus(); 
						}
					}
					break;
			}
		},
		
		doDelete: function (force) {
			// event before
			var eventData = this.trigger({ phase: 'before', target: this.name, type: 'delete' });	
			if (eventData.stop === true) return false;
			// default action
			var recs = this.getSelection();
			if (recs.length == 0) return;
			if (this.msgDelete != '' && !force) {
				$().w2popup({
					width 	: 400,
					height 	: 160,
					showMax : false,
					title 	: 'Delete Confirmation',
					body 	: '<div style="padding: 20px 5px; text-align: center;">'+ this.msgDelete +'</div>',
					buttons : '<input type="button" value="No" onclick="$().w2popup(\'close\');" style="width: 60px; margin-right: 5px;">'+
							  '<input type="button" value="Yes" onclick="w2ui[\''+ this.name +'\'].doDelete(true); $().w2popup(\'close\');" style="width: 60px;">'
				});
				return;
			}
			// call delete script
			if (this.url != '') {
				this.request('delete-records');
			} else {
				this.remove.apply(this, recs);
			}
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));	
		},
	
		doClick: function (recid, line, event) {
			// event before
			var eventData = this.trigger({ phase: 'before', target: this.name, type: 'click', recid: recid, line: line, event: event });	
			if (eventData.stop === true) return false;
			// default action
			$('#grid_'+ this.name +'_check_all').removeAttr('checked');
			if (this.searchOpened) this.searchOpen(false); // hide search if it is open
			var record = this.get(recid);
			if (record) var tmp_previous = record.selected;
			// clear other if necessary
			if ((!event.ctrlKey && !event.shiftKey && !event.metaKey) || !this.multiSelect) {
				this.selectNone();
			} else {
				window.setTimeout("var doc = w2ui['"+ this.name +"'].box.ownerDocument; if (doc.selection) doc.selection.empty(); "+
					"else doc.defaultView.getSelection().removeAllRanges();", 10);
			}		
			if (event.shiftKey) {
				var cnt = 0; 
				var firsti = null;
				for (var i=0; i<this.records.length; i++) { if (this.records[i].selected) { cnt++; if (!firsti) firsti = i; } }
				if (cnt >  1) {
					this.selectNone();
				}
				if (cnt == 1) {
					var ind = this.getIndex(recid);
					if (ind > firsti) {
						for (var i=firsti; i<=ind; i++) { this.select(this.records[i].recid, true); }
					} else {
						for (var i=ind; i<=firsti; i++) { this.select(this.records[i].recid, true); }
					}
					this.trigger($.extend(eventData, { phase: 'after' }));
					// remember last selected
					this.last_selected	 = this.getSelection();
					return;
				}
			}
			// select new
			if ((record && !tmp_previous) || event.ctrlKey || event.metaKey) {
				this.select(record.recid);
			}
			// bind up/down arrows
			if (this.keyboard) {
				// enclose some vars
				var that = this;
				var grid_keydown = function (event) {
					var obj = that;
					if (event.target.tagName.toLowerCase() == 'body') {
						if (event.keyCode == 65 && (event.metaKey || event.ctrlKey)) {
							obj.selectAll();
							event.preventDefault();
						}
						if (event.keyCode == 8) {
							obj.doDelete();
							event.preventDefault();
						}
						var sel = obj.getSelection();
						if (sel.length == 1) {
							var recid = sel[0];
							var ind   = obj.getIndex(recid);
							var sTop    = parseInt($('#grid_'+ obj.name +'_records').prop('scrollTop'));
							var sHeight = parseInt($('#grid_'+ obj.name +'_records').height());
							if (event.keyCode == 38) { // up
								if (ind > 0) {
									ind--;
									while (ind > 0 && obj.records[ind].hidden === true) ind--;
									obj.selectNone();								
									obj.doClick(obj.records[ind].recid, ind, event);
									// scroll into view
									var rTop 	= parseInt($('#grid_'+ obj.name +'_rec_'+ obj.records[ind].recid)[0].offsetTop);
									var rHeight = parseInt($('#grid_'+ obj.name +'_rec_'+ obj.records[ind].recid).height());
									if (rTop < sTop) {
										$('#grid_'+ obj.name +'_records').prop('scrollTop', rTop - rHeight * 0.7);
										obj.last_scrollTop = $('#grid_'+ obj.name +'_records').prop('scrollTop');
									}
								}
								event.preventDefault();
							}
							if (event.keyCode == 40) { // down
								if (ind + 1 < obj.records.length) {
									ind++;
									while (ind + 1 < obj.records.length && obj.records[ind].hidden === true) ind++;
									obj.selectNone();								
									obj.doClick(obj.records[ind].recid, ind, event);
									// scroll into view
									var rTop 	= parseInt($('#grid_'+ obj.name +'_rec_'+ obj.records[ind].recid)[0].offsetTop);
									var rHeight = parseInt($('#grid_'+ obj.name +'_rec_'+ obj.records[ind].recid).height());
									if (rTop + rHeight > sHeight + sTop) {
										$('#grid_'+ obj.name +'_records').prop('scrollTop', -(sHeight - rTop - rHeight) + rHeight * 0.7);
										obj.last_scrollTop = $('#grid_'+ obj.name +'_records').prop('scrollTop');
									}
								}
								event.preventDefault();
							}
						}
					}
				}
				$(window).off('keydown').on('keydown', grid_keydown);
			}
			if (this.getSelection().length > 0) this.toolbar.enable('delete-selected'); else this.toolbar.disable('delete-selected'); 
			// remember last selected
			this.last_selected	 = this.getSelection();
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
	
		doDblClick: function (recid, line, event) {
			if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection 
			// event before
			var eventData = this.trigger({ phase: 'before', target: this.name, type: 'dblClick', recid: recid, line: line, event: event });	
			if (eventData.stop === true) return false;
			// default action
			var record = this.get(recid);
			clearTimeout(this._click_timer);
			// make sure it is selected		
			this.selectNone();
			this.select(recid, true);
			// remember last scroll if any
			this.last_selected	 = this.getSelection();
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));	
		},
		
		doExpand: function (recid) {
			var expanded = $('#grid_'+this.name +'_rec_'+ recid).attr('expanded');
			if (expanded != 'yes') {
				var tmp = 1 + (this.show.lineNumbers ? 1 : 0) + (this.show.selectColumn ? 1 : 0);
				var addClass = ($('#grid_'+this.name +'_rec_'+ recid).hasClass('w2ui-odd') ? 'w2ui-odd' : 'w2ui-even');
				$('#grid_'+this.name +'_rec_'+ recid).after(
						'<tr id="grid_'+this.name +'_rec_'+ recid +'_expaned_row" style="display: none" class="'+ addClass +'">'+ 
						'<td class="w2ui-grid-data" colspan="'+ tmp +'"></td>'+
						'<td colspan="100" class="w2ui-subgrid"><div id="grid_'+ this.name +'_rec_'+ recid +'_expaned" style="height: auto;">&nbsp;</div></td>'+
						'</tr>');
			}
			// event before		
			var eventData = this.trigger({ phase: 'before', type: 'expand', target: this.name, recid: recid, 
										   expanded: (expanded == 'yes' ? true : false), box_id: 'grid_'+ this.name +'_rec_'+ recid +'_expaned' });	
			if (eventData.stop === true) { 	$('#grid_'+this.name +'_rec_'+ recid +'_expaned_row').remove(); return false; }
			// default action
			if (expanded == 'yes') {
				$('#grid_'+this.name +'_rec_'+ recid).attr('expanded', '');
				$('#grid_'+this.name +'_rec_'+ recid +'_expaned_row').remove();
				$('#grid_'+this.name +'_cell_'+ this.getIndex(recid) +'_expand div').html('+');
			} else {
				$('#grid_'+this.name +'_rec_'+ recid).attr('expanded', 'yes')
				$('#grid_'+this.name +'_cell_'+ this.getIndex(recid) +'_expand div').html('-');
				$('#grid_'+this.name +'_rec_'+ recid +'_expaned_row').show();
			}
			this.trigger($.extend(eventData, { phase: 'after' }));	
			this.resize();
		},
		
		doSort: function (field, direction, event) {
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'sort', target: this.name, field: field, direction: direction, event: event });	
			if (eventData.stop === true) return false;
			// check if needed to quit
			if (typeof field == 'undefined') {
				this.trigger($.extend(eventData, { phase: 'after' }));	
				return;
			}
			// default action
			var sortIndex = this.sortData.length;
			for (var s in this.sortData) {
				if (this.sortData[s].field == field) { sortIndex = s; break; }
			}
			if (typeof direction == 'undefined' || direction == null) {
				if (typeof this.sortData[sortIndex] == 'undefined') {
					direction = 'asc';
				} else {
					switch (String(this.sortData[sortIndex].direction)) {
						case 'asc'	: direction = 'desc'; break;					
						case 'desc'	: direction = '';  break;
						default		: direction = 'asc';  break;
					}
				}
			}
			if (this.multiSort === false) { this.sortData = []; sortIndex = 0; }
			if (!event.ctrlKey && !event.metaKey) { this.sortData = []; sortIndex = 0; }
			// set new sort
			if (typeof this.sortData[sortIndex] == 'undefined') this.sortData[sortIndex] = {};
			this.sortData[sortIndex].field 	   = field;
			this.sortData[sortIndex].direction = direction;
			// if local
			if (this.url == '') this.localSort();	
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));	
			this.reload();
		},
		
		// ==================================================
		// --- Common functions
		
		resizeBoxes: function () {
			// elements
			var main 		= $('#grid_'+ this.name);
			var header 		= $('#grid_'+ this.name +'_header');
			var toolbar 	= $('#grid_'+ this.name +'_toolbar');
			var summary		= $('#grid_'+ this.name +'_summary');
			var footer		= $('#grid_'+ this.name +'_footer');
			var body		= $('#grid_'+ this.name +'_body');
			var columns 	= $('#grid_'+ this.name +'_columns');
			var records 	= $('#grid_'+ this.name +'_records');			
			
			// resizing
			main.width(this.width).height(this.height);
			
			if (this.show.header) {
				header.css({
					top:   '0px',
					left:  '0px',
					right: '0px'			
				});
			}
			
			if (this.show.toolbar) {
				toolbar.css({
					top:   ( 0 + (this.show.header ? w2utils.getSize(header, 'height') : 0) ) + 'px',
					left:  '0px',
					right: '0px'			
				});
			}
			if (this.show.footer) {
				footer.css({ 
					bottom: '0px',
					left:  '0px',
					right: '0px'			
				});
			}
			if (this.summary != '') {
				summary.css({ 
					bottom: ( 0 + (this.show.footer ? w2utils.getSize(footer, 'height') : 0) ) + 'px',
					left:  '0px',
					right: '0px'			
				});
			}
			body.css({
				top: ( 0 + (this.show.header ? w2utils.getSize(header, 'height') : 0) + (this.show.toolbar ? w2utils.getSize(toolbar, 'height') : 0) ) + 'px',
				bottom: ( 0 + (this.show.footer ? w2utils.getSize(footer, 'height') : 0) + (this.summary != '' ? w2utils.getSize(summary, 'height') : 0) ) + 'px',
				left:   '0px',
				right:  '0px'
			});	
		},
		
		resizeRecords: function () {
			var obj = this;
			// remove empty records
			$('.grid_'+ this.name + '_empty_record').remove();
			// -- Calculate Column size in PX
			var box			= $(this.box);
			var grid		= $('#grid_'+ this.name);
			var header 		= $('#grid_'+ this.name +'_header');
			var toolbar		= $('#grid_'+ this.name +'_toolbar');
			var summary 	= $('#grid_'+ this.name +'_summary');
			var footer 		= $('#grid_'+ this.name +'_footer');
			var body 		= $('#grid_'+ this.name +'_body');
			var columns 	= $('#grid_'+ this.name +'_columns');
			var records 	= $('#grid_'+ this.name +'_records');			
			
			// body might be expanded by data
			if (!this.fixedBody) {
				// calculate body height by content
				var calculatedHeight = $('#grid_'+ this.name +'_records > table:first-child').height() + columns.height();
				this.height = calculatedHeight + w2utils.getSize(grid, '+height')
					+ (this.show.header ? w2utils.getSize(header, 'height') : 0)
					+ (this.show.toolbar ? w2utils.getSize(toolbar, 'height') : 0)
					+ (summary.css('display') != 'none' ? w2utils.getSize(summary, 'height') : 0)
					+ (this.show.footer ? w2utils.getSize(footer, 'height') : 0);
				grid.height(this.height);
				body.height(calculatedHeight);
				box.height(w2utils.getSize(grid, 'height'));
			} else {
				// fixed body height
				var calculatedHeight =  grid.height()  
					- (this.show.header ? w2utils.getSize(header, 'height') : 0)
					- (this.show.toolbar ? w2utils.getSize(toolbar, 'height') : 0)
					- (summary.css('display') != 'none' ? w2utils.getSize(summary, 'height') : 0)
					- (this.show.footer ? w2utils.getSize(footer, 'height') : 0);
				body.height(calculatedHeight);
			}

			// check overflow
			if (body.height() < $(records).find(':first-child').height()) var bodyOverflowY = true; else bodyOverflowY = false;
			if (body.width() < $(records).find(':first-child').width())   var bodyOverflowX = true; else bodyOverflowX = false;
			if (bodyOverflowX || bodyOverflowY) {
				records.css({ top: ((this.columnGroups.length > 0 ? 1 : 0) + w2utils.getSize(columns, 'height')) +'px', 
					"overflow-x": (bodyOverflowX ? 'auto' : 'hidden'), "overflow-y": (bodyOverflowY ? 'auto' : 'hidden') });
				$('#grid_'+ this.name +'_cell_header_last').show();
			} else {
				records.css({ top: ((this.columnGroups.length > 0 ? 1 : 0) + w2utils.getSize(columns, 'height')) +'px', overflow: 'hidden' });
				$('#grid_'+ this.name +'_cell_header_last').hide();
				// show empty records
			}
			if (this.show.emptyRecords && !bodyOverflowY) {
				// find only records that are shown
				var total = 0;
				for (var r in this.records) if (this.records[r].hidden !== true) total++;
				// apply empty records
				var html  = '';
				for (var di = total; di < 100; di++) {
					html += '<tr class="grid_'+ this.name + '_empty_record '+ (di % 2 ? 'w2ui-even' : 'w2ui-odd') + '">';
					if (this.show.lineNumbers)  html += '<td class="w2ui-number"><div style="width: 24px;"></div></td>';
					if (this.show.selectColumn) html += '<td class="w2ui-grid-data"><div style="width: 23px;"></div></td>';
					if (this.show.expandColumn) html += '<td class="w2ui-grid-data"><div style="width: 23px;"></div></td>';
					var j = 0;
					while (true) {
						var col   = this.columns[j];
						if (col.hidden) { j++; if (typeof this.columns[j] == 'undefined') break; else continue; }
						html += '<td class="w2ui-grid-data" '+( di == this.records.length ? 'id="grid_'+ this.name +'_cell_'+ di +'_'+ j +'"' : '') +
									(typeof col.attr != 'undefined' ? col.attr : '') +'><div></div></td>';
						j++;
						if (typeof this.columns[j] == 'undefined') break;
					}
					html += '</tr>';
				}
				$('#grid_'+ this.name +'_records > table').append(html);
			}
			if (body.length > 0) {	
				var width_max = parseInt(body.width()) 
					- (bodyOverflowY ? (String(navigator.userAgent).indexOf('AppleWebKit') > 0 ? 16 : 17) : 0)
					- (this.show.lineNumbers ? 25 : 0)
					- (this.show.selectColumn ? 25 : 0)
					- (this.show.expandColumn ? 25 : 0);
				var width_box = width_max;		
				var percent = 0;
				// minWidth processiong
				var restart = false;
				for (var i=0; i<this.columns.length; i++) {
					var col = this.columns[i];
					if (typeof col.minWidth != 'undefined') {
						if (col.minWidth > width_box && col.hidden !== true) { 
							col.hidden = true; 
							restart = true;
						}
						if (col.minWidth < width_box && col.hidden === true) { 
							col.hidden = false; 
							restart = true;
						}
					}
				}
				if (restart === true) {
					this.refresh();
					return; 
				}
				// assign PX column s
				for (var i=0; i<this.columns.length; i++) {
					var col = this.columns[i];
					if (col.hidden) continue;
					if (String(col.size).substr(String(col.size).length-2).toLowerCase() == 'px') {
						width_max -= parseInt(col.size) + 1; // count in cell border
						this.columns[i].sizeCalculated = col.size;
					} else {
						percent += parseInt(col.size); 
						delete col.sizeCorrected;
					}				
				}
				// if sum != 100% -- reassign proportionally
				if (percent != 100) {
					for (var i=0; i<this.columns.length; i++) {
						var col = this.columns[i];
						if (col.hidden) continue;
						if (String(col.size).substr(String(col.size).length-2).toLowerCase() != 'px') {
							col.sizeCorrected = Math.round(parseInt(col.size) * 100 / percent) + '%';
						}
					}
				}
				// calculate % columns
				for (var i=0; i<this.columns.length; i++) {
					var col = this.columns[i];
					if (col.hidden) continue;
					if (String(col.size).substr(String(col.size).length-2).toLowerCase() != 'px') {
						if (typeof this.columns[i].sizeCorrected != 'undefined') {
							this.columns[i].sizeCalculated = Math.round(width_max * parseInt(col.sizeCorrected) / 100 - 1) + 'px'; // count in cell border
						} else {
							this.columns[i].sizeCalculated = Math.round(width_max * parseInt(col.size) / 100 - 1) + 'px'; // count in cell border
						}
					}
				}			
			}
			// calculate last column
			/*
			var twidth = 1;
			for (var i=0; i<this.columns.length-1; i++) {
				var col = this.columns[i];
				if (col.hidden) continue;
				twidth += parseInt(col.sizeCalculated) + 1; // border
			}
			var lwidth = parseInt(this.width) - parseInt(twidth);
			if (parseInt(this.columns[this.columns.length - 1].sizeCalculated) < lwidth) this.columns[this.columns.length - 1].sizeCalculated = lwidth + 'px';
			*/
			// resize HTML table
			for (var i=0; i<this.columns.length; i++) {
				var col = this.columns[i];
				if (col.hidden) continue;
				$('#grid_'+ this.name +'_cell_header_'+ i + ' > div:first-child').width(col.sizeCalculated);
				var startRecord = 0;
				if (this.url == '') startRecord = this.page * this.recordsPerPage;
				for (var j=startRecord; j<1000; j++) {
					if (this.records[j] && this.records[j].hidden) { continue; }
					var cell = $('#grid_'+ this.name+'_cell_'+ j +'_'+ i + ' > div:first-child');
					if (cell.length == 0) break;
					cell.width(col.sizeCalculated);
				}
			}
			this.initResize();
			// apply last scroll if any
			var columns = $('#grid_'+ this.name +'_columns');
			var records = $('#grid_'+ this.name +'_records');
			if (this.last_scrollTop != '' && records.length > 0) {
				columns.prop('scrollLeft', this.last_scrollLeft);
				records.prop('scrollTop',  this.last_scrollTop);
				records.prop('scrollLeft', this.last_scrollLeft);
			}
		},
	
		resize: function (width, height) {
			var tmp_time = (new Date()).getTime();
			var obj = this;
			if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection 
			// make sure render records w2name
			if (!this.box || $(this.box).data('w2name') != this.name) return; 
			// determine new width and height
			this.width  = typeof width != 'undefined' && width != null ? parseInt(width) : $(this.box).width();
			this.height = typeof height != 'undefined' && height != null ? parseInt(height) : $(this.box).height();
			$(this.box).width(width).height(height);
			// if blank
			if (this.width == 0 || this.height == 0) return;
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'resize', target: this.name, width: this.width, height: this.height });	
			if (eventData.stop === true) return false;
			obj.resizeBoxes(); obj.resizeRecords();
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
	
		refresh: function () {
			var obj = this;
			var tmp_time = (new Date()).getTime();
	
			if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection 
			if (!this.box) return;
			// event before
			var eventData = this.trigger({ phase: 'before', target: this.name, type: 'refresh' });	
			if (eventData.stop === true) return false;
			// -- advanced search - hide it
			if (this.searchOpened) this.searchOpen(false);
			// -- header
			if (this.show.header) {
				$('#grid_'+ this.name +'_header').html(this.header +'&nbsp;').show();
			} else {
				$('#grid_'+ this.name +'_header').hide();
			}
			// -- toolbar
			if (this.show.toolbar) {
				$('#grid_'+ this.name +'_toolbar').show();
				// refresh toolbar only once
				if (typeof this.toolbar == 'object') {
					this.toolbar.refresh();
					$('#grid_'+ this.name +'_search_all').val(this.last_search); 
				}	
			} else {
				$('#grid_'+ this.name +'_toolbar').hide();
			}
	
			// search placeholder
			if (this.searches.length == 0) this.last_field = 'No Search Fields';
			if (!this.multiSearch && this.last_field == 'all') this.last_field = this.searches[0].field;
			var search_ph = this.last_field;
			for (var s in this.searches) {
				if (this.searches[s].field == this.last_field) search_ph = this.searches[s].caption; 
			}
			$('#grid_'+ this.name +'_search_all').attr('placeholder', search_ph);
			
			// focus search if last searched
			if (this._focus_when_refreshed === true) {
				setTimeout(function () { 
					var s = $('#grid_'+ obj.name +'_search_all'); 
					if (s.length > 0) s[0].focus(); 
					setTimeout(function () { delete obj._focus_when_refreshed; }, 500);
				}, 10);
			}
					
			// -- body
			var bodyHTML = '';
			if (this.layout == 'table') {
			   bodyHTML +=  '<div id="grid_'+ this.name +'_records" class="w2ui-grid-records" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;" '+
							'	onscroll="var obj = w2ui[\''+ this.name + '\']; obj.last_scrollTop = this.scrollTop; obj.last_scrollLeft = this.scrollLeft; '+
							'		$(\'#grid_'+ this.name +'_columns\')[0].scrollLeft = this.scrollLeft">'+
							'<table cellpadding="0" cellspacing="0" style="table-layout: fixed;">'+
								this.getRecordsHTML() +
							'</table>'+
							'</div>'+
							'<div id="grid_'+ this.name +'_columns" class="w2ui-grid-columns" style="overflow: hidden; position: absolute; left: 0px; top: 0px; right: 0px;">'+
							'<table cellpadding="0" cellspacing="0" style="table-layout: fixed; height: auto;">'+
								this.getColumnsHTML() +
							'</table>'+
							'</div>'; // Columns need to be after to be able to overlap
			}
			if (this.layout == 'div') {
			   bodyHTML += '<div id="grid_'+ this.name +'_body">'+
								this.tmpl_start +
								this.getColumnsHTML() +
								this.getRecordsHTML() +
								this.tmpl_end +
						   '</div>';
			}
			$('#grid_'+ this.name +'_body').html(bodyHTML);
			// init editable
			$('#grid_'+ this.name + '_records .w2ui-editable').each(function (index, el) {
				var column = obj.columns[$(el).attr('column')];
				$(el).w2field(column.editable);
			}); 
			
			// -- summary
			if (this.summary != '') {
				$('#grid_'+ this.name +'_summary').html(this.summary).show();
			} else {
				$('#grid_'+ this.name +'_summary').hide();
			}
	
			// -- footer
			if (this.show.footer) {
				var pages = this.getFooterHTML();
				var last = (this.page * this.recordsPerPage + this.recordsPerPage);
				if (last > this.total) last = this.total;
				var pageCountDsp = (this.page * this.recordsPerPage + 1) +'-'+ last +' of '+ this.total;
				if (this.page == 0 && this.total == 0) pageCountDsp = '0-0 of 0';
				$('#grid_'+ this.name +'_footerR').html(pageCountDsp);
				$('#grid_'+ this.name +'_footerC').html(pages);
				$('#grid_'+ this.name +'_footer').show();
			} else {
				$('#grid_'+ this.name +'_footer').hide();
			}
			// select last selected record
			if (this.last_selected.length > 0) for (var s in this.last_selected) {
				if (this.get(this.last_selected[s]) != null) {
					this.select(this.get(this.last_selected[s]).recid, true);
				}
			}
			// show/hide clear search link
			if (this.searchApplied || this.last_search != '') {
				$('#grid_'+ this.name +'_searchClear').show();
			} else {
				$('#grid_'+ this.name +'_searchClear').hide();
			}
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
			this.resize(null, null, true);
		},
	
		render: function (box) {
			var tmp_time = (new Date()).getTime();

			if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection 
			if (typeof box != 'undefined' && box != null) { 
				$(this.box).html(''); 
				this.box = box;
			}
			if (!this.box) return;		
			$('#w2ui-global-searches').remove(); // show searches from previous grid
			if (this.last_sortData == null) this.last_sortData = this.sortData;
			if (this.last_showSearch == null) this.last_showSearch = this.show.search;
			// event before
			var eventData = this.trigger({ phase: 'before', target: this.name, type: 'render', box: box });	
			if (eventData.stop === true) return false;
			// insert Elements
			$(this.box).data('w2name', this.name).html(
				'<div id="grid_'+ this.name +'" class="w2ui-grid" style="position: absolute; overflow: hidden; '+ this.style +'">'+
				'	<div id="grid_'+ this.name +'_header" class="w2ui-grid-header" style="position: absolute; '+ (!this.show.header ? 'display: none;' : '') +'"></div>'+
				'	<div id="grid_'+ this.name +'_toolbar" class="w2ui-grid-toolbar" style="position: absolute; '+ (!this.show.toolbar ? 'display: none;' : '') +'"></div>'+
				'	<div id="grid_'+ this.name +'_body" class="w2ui-grid-body" style="position: absolute; overflow: hidden;"></div>'+
				'	<div id="grid_'+ this.name +'_summary" class="w2ui-grid-body w2ui-grid-summary" style="position: absolute; '+ (this._summary == ''  ? 'display: none;' : '') +'">sum</div>'+
				'	<div id="grid_'+ this.name +'_footer" class="w2ui-grid-footer" style="position: absolute; '+ (!this.show.footer ? 'display: none;' : '') +'"></div>'+
				'</div>');
			// init toolbar
			this.initToolbar();
			if (this.toolbar != null) this.toolbar.render($('#grid_'+ this.name +'_toolbar')[0]);
			// init footer
			$('#grid_'+ this.name +'_footer').html(
				'<div style="width: 100%; height: 24px;">'+
				'	<div id="grid_'+ this.name +'_footerL" style="float: left;"></div>'+
				'	<div id="grid_'+ this.name +'_footerR" style="float: right;"></div>'+
				'	<div id="grid_'+ this.name +'_footerC" style="text-align: center;"></div>'+
				'</div>');
			// refresh
			
			this.refresh();
			this.reload();
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));	
			// attach to resize event
			var obj = this;
			$(window).bind('resize', function (event) {
				w2ui[obj.name].resize();
			});
			setTimeout(function () { obj.resize(); }, 150); // need timer because resize is on timer
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
		
		// ===========================================
		// --- Internal Functions
		
		initToolbar: function () {
			// -- if toolbar is true
			if (typeof this.toolbar['render'] == 'undefined') {
				var obj = this;
				for (var i in this.toolbar.items) {
					if (this.toolbar.items[i].type == 'add') {
						delete this.toolbar.items[i].type;
						this.toolbar.items[i] = $.extend(
							{ type: 'button', id: 'add', caption: 'Add New', hint: 'Add new record', img: 'icon-add' }, 
							this.toolbar.items[i]
						);
					}
					if (this.toolbar.items[i].type == 'delete') {
						delete this.toolbar.items[i].type;
						this.toolbar.items[i] = $.extend(
							{ type: 'button', id: 'delete-selected', caption: 'Delete', hint: 'Delete selected records', img: 'icon-delete', disabled: true }, 
							this.toolbar.items[i]
						);
					}
					if (this.toolbar.items[i].type == 'save') {
						delete this.toolbar.items[i].type;
						this.toolbar.items[i] = $.extend(
							{ type: 'button', id: 'save-changed', caption: 'Save', hint: 'Save changed records', img: 'icon-save' }, 
							this.toolbar.items[i]
						);
					}
				}
				this.toolbar = $().w2toolbar($.extend({}, this.toolbar, { name: this.name +'_toolbar' }));
				
				// =============================================
				// ------ Toolbar Generic buttons
				
				if (this.show.toolbarSearch) {
					this.toolbar.items.splice(0, 0, { type: 'break',  id: 'break1' });
					if (this.multiSearch && this.searches.length > 0) {
						this.toolbar.items.splice(0, 0, { type: 'button', id: 'search-advanced', caption: 'Search...', hint: 'Open Search Fields' });
					}
					var html = 
						'<table cellpadding=0 cellspacing=0><tr>'+
						'	<td><div class="w2ui-icon icon-search" style="position: absolute; margin-top: -7px !important; margin-left: 5px;"></div>'+
						'	</td>'+
						'	<td>'+
						'		<input id="grid_'+ this.name +'_search_all" class="w2ui-search-all" value="'+ this.last_search +'"'+
						"			onkeyup=\"if (event.keyCode == 13) w2ui['"+ this.name +"'].search('all', this.value); w2ui['"+ this.name +"']._focus_when_refreshed = true;\">"+
						'	</td>'+
						'	<td>'+
						'		<div title="Clear Search" class="w2ui-search-clear" id="grid_'+ this.name +'_searchClear"  '+
						'			 onclick="var obj = w2ui[\''+ this.name +'\']; obj.searchReset();" '+
						'		>&nbsp;&nbsp;</div>'+
						'	</td>'+
						'</tr></table>';
					this.toolbar.items.splice(0, 0, { type: 'html',   id: 'search', html: html });
				}
				if (this.show.toolbarReload || this.show.toolbarColumn) {
					this.toolbar.items.splice(0, 0, { type: 'break', id: 'break0' });
				}
				if (this.show.toolbarColumns) {
					var col_html = "<table cellspacing=\"0\" style=\"padding: 5px 0px;\">";
					for (var c in this.columns) { 
						col_html += "<tr style=\"cursor: default;\" "+
							"	onmouseover=\"$(this).addClass('w2ui-selected');\" onmouseout=\"$(this).removeClass('w2ui-selected');\">"+
							"<td style='padding: 3px 3px 3px 6px'>"+
							"	<input id=\"grid_"+ this.name +"_column_"+ c +"_check\" type=\"checkbox\""+
							"	onclick=\"var obj = w2ui['"+ this.name +"']; "+
							"			  var col = obj.columns['"+ c +"']; "+
							"			  if (this.checked) {  "+
							"				delete col.minWidth; "+
							"				delete col.hidden; "+
							"			  } else { "+
							"				delete col.minWidth; "+
							"				col.hidden = true; "+
							"			  } "+
							"			  obj.refresh(); event.stopPropagation(); \">"+
							"</td>"+
							"<td style='padding: 3px 10px 3px 3px'><label style=\"display: block;\" for=\"grid_"+ this.name +"_column_"+ c +"_check\">"+ 
								(this.columns[c].caption == '' ? '- column '+ (c+1) +' -' : this.columns[c].caption) +"</label></td>"+
							"</tr>";
					}	
					col_html += "</table>";
					this.toolbar.items.splice(0, 0, { type: 'drop', id: 'select-columns', img: 'icon-columns', hint: 'Show/hide columns', arrow: false, html: col_html });
				}
				if (this.show.toolbarReload) {
					this.toolbar.items.splice(0, 0, { type: 'button', id: 'refresh', img: 'icon-reload', hint: 'Reload data in the list' });
				}

				// =============================================
				// ------ Toolbar onClick processing
				
				this.toolbar.on('click', function (id, choice) {
					switch (id) {
						case 'refresh':
							obj.reload();
							break;
						case 'select-columns':
							for (var c in obj.columns) {
								if (obj.columns[c].hidden) {
									$("#grid_"+ obj.name +"_column_"+ c + "_check").removeAttr('checked');
								} else {
									$("#grid_"+ obj.name +"_column_"+ c + "_check").attr('checked', true);
								}
							}
							// restore sizes
							for (var c in obj.columns) {
								if (typeof obj.columns[c].sizeOriginal != 'undefined') {
									obj.columns[c].size = obj.columns[c].sizeOriginal;
								}
							}
							obj.initResize();
							obj.resize();
							break;
						case 'add':
							obj.doAdd();
							break;
						case 'search-advanced':
							obj.searchOpen();
							break;
						case 'add-new':
							obj.doAdd();
							break;
						case 'delete-selected':
							obj.doDelete();
							break;
						case 'save-changed':
							obj.doSave();
							break;
						default: 
							if (id.substr(0, 7) == 'choice-' && typeof choice != 'object') { // this is done for choices
								obj.toolbar.set(id, { caption: obj.toolbar.get(id).prepend + choice })
								if (typeof obj.toolbar.get(id).param == 'function') {
									obj.toolbar.get(id).param(id, choice);
								}
								if (typeof obj.toolbar.get(id).onClick == 'function') {
									obj.toolbar.get(id).onClick(id, choice);
								}
							}
							break;
					}
				});
			} 
			return;
		},
	
		getSearchesHTML: function () {
			var html = '<table cellspacing="0">';
			for (var i = 0; i < this.searches.length; i++) {
				var btn = '';
				if (i == 0) {	
					btn = '<input type="button" value="X" style="width: 22px; text-align: center;" '+
						  '		onclick="obj = w2ui[\''+ this.name +'\']; if (obj) { obj.searchOpen(false); }">';
				}
				var s = this.searches[i];
				if (typeof s.inTag   == 'undefined') s.inTag 	= '';
				if (typeof s.outTag  == 'undefined') s.outTag 	= '';
				if (typeof s.type    == 'undefined') s.type 	= 'text';
				if (s.type == 'text') {
					var operator =  '<select id="grid_'+ this.name +'_operator_'+i+'">'+
						'	<option value="is">is</option>'+
						'	<option value="begins with">begins with</option>'+
						'	<option value="contains">contains</option>'+
						'	<option value="ends with">ends with</option>'+
						'</select>';
				}
				if (s.type == 'int' || s.type == 'float' || s.type == 'date') {
					var operator =  '<select id="grid_'+ this.name +'_operator_'+i+'" onchange="var el = $(\'#grid_'+ this.name + '_range_'+ i +'\'); '+
						'					if ($(this).val() == \'is\') el.hide(); else el.show();">'+
						'	<option value="is">is</option>'+
						'	<option value="between">between</option>'+
						'</select>';
				}
				if (s.type == 'list') {
					var operator =  'is <input type="hidden" value="is" id="grid_'+ this.name +'_operator_'+i+'">';
				}
				html += '<tr>'+
						'	<td width="20px" style="padding-right: 20px">'+ btn +'</td>' +
						'	<td class="caption" style="border-right1: 0px">'+ s.caption +'</td>' +
						'	<td class="caption" style="text-align: left; padding: 0px 10px;">'+ operator +'</td>'+
						'	<td class="value">';
						
				switch (s.type) {
					case 'alphaNumeric':
					case 'text': 
						html += '<input rel="search" type="text" size="40" id="grid_'+ this.name +'_field_'+i+'" name="'+ s.field +'" '+ s.inTag +'>';
						break;
						
					case 'int':
					case 'float':
					case 'hex':
					case 'money':
					case 'date':
						html += '<input rel="search" type="text" size="12" id="grid_'+ this.name +'_field_'+i+'" name="'+ s.field +'" '+ s.inTag +'>'+
								'<span id="grid_'+ this.name +'_range_'+i+'" style="display: none">'+
								'&nbsp;-&nbsp;&nbsp;<input rel="search" type="text" size="12" id="grid_'+ this.name +'_field2_'+i+'" name="'+ s.field +'" '+ s.inTag +'>'+
								'</span>';
						break;
						
					case 'list': 
						html += '<select rel="search" id="grid_'+ this.name +'_field_'+i+'" name="'+ s.field +'" '+ s.inTag +'></select>';
						break;
						
				}
				html +=			s.outTag +
						'	</td>' +
						'</tr>';
			}
			html += '<tr>'+
					'	<td colspan="4" class="caption" style="border-right: 0px; padding: 15px 0px 5px 0px !important; text-align: center;">'+
					'		<input type="button" onclick="obj = w2ui[\''+ this.name +'\']; if (obj) { obj.searchReset(); }" style="width: 60px; margin: 0px 2px;" value="Reset">'+
					'		<input type="button" onclick="obj = w2ui[\''+ this.name +'\']; if (obj) { obj.search(); }" style="width: 60px; margin: 0px 2px;" value="Search">'+
					'	</td>'+
					'</tr></table>';
			return html; 
		},
		
		initSearches: function () {
			var obj = this;
			// init searches
			for (var s in this.searches) {
				var search = this.searches[s];
				var sdata  = findSearch(search.field);
				// init types
				switch (search.type) {
					case 'alphaNumeric':
					case 'text':
						$('#grid_'+ this.name +'_operator_'+s).val('begins with');
						break;

					case 'int':
					case 'float':
					case 'hex':
					case 'money':
					case 'date':
						$('#grid_'+ this.name +'_field_'+s).w2field(search.type);
						$('#grid_'+ this.name +'_field2_'+s).w2field(search.type);
						break;
						
					case 'list':
						// build options
						var options = '<option value="">--</option>';
						for (var i in search.items) {
							if ($.isPlainObject(search.items[i])) {
								var val = search.items[i].id;
								var txt = search.items[i].text;
								if (typeof val == 'undefined' && typeof search.items[i].value != 'undefined')   val = search.items[i].value;
								if (typeof txt == 'undefined' && typeof search.items[i].caption != 'undefined') txt = search.items[i].caption;
								if (val == null) val = '';
								options += '<option value="'+ val +'">'+ txt +'</option>';
							} else {
								options += '<option value="'+ search.items[i] +'">'+ search.items[i] +'</option>';
							}
						}
						$('#grid_'+ this.name +'_field_'+s).html(options);
						break;
				}
				if (sdata != null) {
					$('#grid_'+ this.name +'_operator_'+ s).val(sdata.operator).trigger('change');
					if (typeof sdata.value != 'udefined') $('#grid_'+ this.name +'_field_'+ s).val(sdata.value).trigger('change');
					if (typeof sdata.valueStart != 'undefined') {					
						$('#grid_'+ this.name +'_field_'+ s).val(sdata.valueStart).trigger('change');
						$('#grid_'+ this.name +'_field2_'+ s).val(sdata.valueEnd).trigger('change');
					}
				}				
			}
			
			function findSearch(field) {
				for (var s in obj.searchData) {
					if (obj.searchData[s].field == field) return obj.searchData[s];					
				}
				return null;
			}
		},
	
		getColumnsHTML: function () {
			var html = '';
			switch (this.layout) {
				case 'table':
					if (this.show.columnHeaders) {
						// -- COLUMN Groups
						if (this.columnGroups.length > 0) {
							html += '<tr>';
							if (this.show.lineNumbers) {
								html += '<td id="grid_'+ this.name +'_cell_header_number" class="w2ui-head">'+
										'	<div style="cursor: default; overflow: hidden; width: 24px; text-align: center;"></div>'+
										'</td>';
							}
							if (this.show.selectColumn) {
								html += '<td id="grid_'+ this.name +'_cell_header_select" class="w2ui-head">'+
										'<div style="cursor: default; text-align: center; overflow: hidden; width: 23px;"></div>'+
										'</td>';
							}
							if (this.show.expandColumn) {
								html += '<td id="grid_'+ this.name +'_cell_header_expand" class="w2ui-head">'+
										'<div style="cursor: default; overflow: hidden; width: 23px;"></div></td>';
							}
							var ii = 0;
							for (var i=0; i<this.columnGroups.length; i++) {
								var colg = this.columnGroups[i];
								var col  = this.columns[ii];
								if (typeof colg.span == 'undefined' || colg.span != parseInt(colg.span)) colg.span = 1;
								if (typeof colg.colspan != 'undefined') colg.span = colg.colspan;
								if (colg.master === true) {
									var sortStyle = '';
									for (var si in this.sortData) { 
										if (this.sortData[si].field == col.field) {
											if (this.sortData[si].direction == 'asc')  sortStyle = 'w2ui-sort-down';
											if (this.sortData[si].direction == 'desc') sortStyle = 'w2ui-sort-up';
										}
									}									
									var resizer = "";
									if (col.resizable == true) {
										resizer = '<div class="w2ui-resizer" name="'+ ii +'" style="position: absolute; width: 6px; height: 12px; '+
												  '		background-color: transparent; cursor: col-resize; padding: 0px; margin: 0px;"></div>';
									}
									html += '<td id="grid_'+ this.name +'_cell_header_'+ ii +'" class="w2ui-head '+ sortStyle +'" rowspan="2"'+
													(col.sortable ? 'onclick="w2ui[\''+ this.name +'\'].doSort(\''+ col.field +'\', null, event);"' : '') +
											'		style="height: auto !important; '+ (ii == this.columns.length -1 ? 'border-right: 1px solid transparent;' : '') +'">'+ 
											'<div style="height: auto !important; text-align: center; cursor: default; width: 100%; overflow: hidden;">'+ 
												col.caption +'</div>'+ resizer +'</td>';
								} else {
									html += '<td id="grid_'+ this.name +'_cell_group_header_'+ ii +'" class="w2ui-head" '+
											'		colspan="'+ (colg.span + (i == this.columnGroups.length-1 ? 1 : 0) ) +'" '+
											'		style="height: auto !important; text-align: center; '+ (i == this.columns.length -1 ? 'border-right: 1px solid transparent;' : '') +'">'+ 
											'<div style="height: auto !important; cursor: default; width: 100% !important; overflow: hidden;">'+ 
												colg.caption +'</div></td>';
								}
								ii += colg.span;
							}
							html += '</tr>';
						}
						
						// COLUMNS
						html += '<tr>';
						if (this.show.lineNumbers) {
							html += '<td id="grid_'+ this.name +'_cell_header_number" class="w2ui-head">'+
									'	<div style="cursor: default; overflow: hidden; width: 24px; text-align: center;">#</div>'+
									'</td>';
						}
						if (this.show.selectColumn) {
							html += '<td id="grid_'+ this.name +'_cell_header_select" class="w2ui-head" onclick="event.stopPropagation();">'+
									'<div style="cursor: default; text-align: center; overflow: hidden; width: 23px; padding-bottom: 0px;">'+
									'	<input type="checkbox" id="grid_'+ this.name +'_check_all" '+
									'		onclick="if (this.checked) w2ui[\''+ this.name +'\'].selectAll(); '+
									'				 else w2ui[\''+ this.name +'\'].selectNone(); event.stopPropagation();" '+
									'		style="position: relative; display: inline-block; margin-top: 4px;">'+
									'</div>'+
									'</td>';
						}
						if (this.show.expandColumn) {
							html += '<td id="grid_'+ this.name +'_cell_header_expand" class="w2ui-head">'+
									'<div style="cursor: default; overflow: hidden; width: 23px;"></div></td>';
						}
						var ii = 0;
						var id = 0;
						for (var i=0; i<this.columns.length; i++) {
							var col  = this.columns[i];
							var colg = {};
							if (i == id) {
								id = id + (typeof this.columnGroups[ii] != 'undefined' ? parseInt(this.columnGroups[ii].span) : 0);
								ii++;
							}
							if (typeof this.columnGroups[ii-1] != 'undefined') var colg = this.columnGroups[ii-1]; 
							if (col.hidden) continue;	
							var sortStyle = '';
							for (var si in this.sortData) { 
								if (this.sortData[si].field == col.field) {
									if (this.sortData[si].direction == 'asc')  sortStyle = 'w2ui-sort-down';
									if (this.sortData[si].direction == 'desc') sortStyle = 'w2ui-sort-up';
								}
							}	
							if (colg['master'] !== true) { // grouping of columns
								var resizer = "";
								if (col.resizable == true) {
									resizer = '<div class="w2ui-resizer" name="'+ i +'" style="position: absolute; width: 6px; height: 12px; '+
											  '		background-color: transparent; cursor: col-resize; padding: 0px; margin: 0px;"></div>';
								}
								html += '<td id="grid_'+ this.name +'_cell_header_'+ i +'" class="w2ui-head '+ sortStyle +'" '+
												(col.sortable ? 'onclick="w2ui[\''+ this.name +'\'].doSort(\''+ col.field +'\', null, event);"' : '') +
										'		style="height: auto !important; '+ (i == this.columns.length -1 ? 'border-right: 1px solid transparent;' : '') +'">'+ 
										'<div style="height: auto !important; cursor: default; width: 100%; overflow: hidden;">'+  col.caption +'</div>'+ resizer +'</td>';
							}
						}
						html += '<td id="grid_'+ this.name +'_cell_header_last" class="w2ui-head" style="border-right: 0px; display: none;">'+
								'	<div style="width: 2000px; overflow: hidden;">&nbsp;</div></td>';
						html += '</tr>';
					}
					break;
				case 'div':
					break;
			}
			return html;
		},
		
		initResize: function () {
			var obj = this;
			//if (obj.resizing === true) return;
			$('#grid_'+ this.name + ' .w2ui-resizer')
				.off('mousedown')
				.off('click')
				.each(function (index, el) {
					var td  = $(el).parent();
					$(el).css({
						"height" 		: td.height(),
						"margin-top" 	: '-' + td.height() + 'px',
						"margin-left" 	: (td.width() - 3) + 'px',
					})
				})
				.on('mousedown', function (event) {				
					if (!event) event = window.event;
					if (!window.addEventListener) { window.document.attachEvent('onselectstart', function() { return false; } ); }
					obj.resizing = true;
					obj.tmp_x = event.screenX;
					obj.tmp_y = event.screenY;
					obj.tmp_col = $(this).attr('name');
					event.stopPropagation();
					event.preventDefault();
					// fix sizes
					for (var c in obj.columns) {
						if (typeof obj.columns[c].sizeOriginal == 'undefined') obj.columns[c].sizeOriginal = obj.columns[c].size;
						obj.columns[c].size = obj.columns[c].sizeCalculated;
					}
					// set move event				
					var mouseMove = function (event) {
						if (obj.resizing != true) return;
						if (!event) event = window.event;
						obj.tmp_div_x = (event.screenX - obj.tmp_x); 
						obj.tmp_div_y = (event.screenY - obj.tmp_y); 
						obj.columns[obj.tmp_col].size = (parseInt(obj.columns[obj.tmp_col].size) + obj.tmp_div_x) + 'px';
						if (parseInt(obj.columns[obj.tmp_col].size) < 15) obj.columns[obj.tmp_col].size = '15px';
						obj.resizeRecords();
						// reset 
						obj.tmp_x = event.screenX;
						obj.tmp_y = event.screenY;
					}
					var mouseUp = function (event) {
						delete obj.resizing;
						$(window).off('mousemove', mouseMove);
						$(window).off('mouseup', mouseUp);
						obj.resizeRecords();
					}
					$(window).on('mousemove', mouseMove);
					$(window).on('mouseup', mouseUp);
				})
				.on('click', function (event) { event.stopPropagation(); event.preventDefault; });
		},

		getRecordsHTML: function () {
			var html    = '';
			var summary = '';
			var sum_cnt = 0;
			switch (this.layout) {
				case 'table':
					if (this.records.length == 0 && this.isLoaded && !this.show.emptyRecords) {
						html += '<tr><td colspan=100 style="padding: 10px; border: 0px;">'+ this.msgNoData + '</div>';
					} else {
						var startRecord = (this.url == '' ? (this.page * this.recordsPerPage) : 0);
						for (var i = startRecord, di = 0, ri = 0; ri < this.recordsPerPage && i < this.records.length; i++) {
							var record 	= this.records[i];
							if (!record || record.hidden === true) continue;
							var rec_html = '';
							ri++; // actual records counter
							// set text and bg color if any
							var	tmp_color = '';
							if (typeof record['style'] != 'undefined') {
								tmp_color += record['style'];
							}
							if (record.selected) {
								rec_html += '<tr id="grid_'+ this.name +'_rec_'+ record.recid +'" recid="'+ record.recid +'" line="'+ i +'" class="w2ui-selected" ' +
										(this.isIOS ? 
											'    onclick 	 = "w2ui[\''+ this.name +'\'].doDblClick(\''+ record.recid +'\', '+ i +', event);" '
											:
											'    onclick     = "var obj = w2ui[\''+ this.name +'\']; var evnt = event; '+
											'					clearTimeout(obj._click_timer); '+
											'					obj._click_timer = setTimeout(function () { obj.doClick(\''+ record.recid +'\', '+ i +', evnt); }, 1);"'+
											'    ondblclick  = "w2ui[\''+ this.name +'\'].doDblClick(\''+ record.recid +'\', '+ i +', event);" '
										 )+
										(tmp_color != '' ? 'custom_style="'+ tmp_color +'"' : '')+
										'>';
							} else {
								rec_html += '<tr id="grid_'+ this.name +'_rec_'+ record.recid +'" recid="'+ record.recid +'" line="'+ i +'" class="'+ (di%2 == 0 ? 'w2ui-odd' : 'w2ui-even') + '" ' + 
										(this.isIOS ? 
											'    onclick  	 = "w2ui[\''+ this.name +'\'].doDblClick(\''+ record.recid +'\', '+ i +', event);" '
											:
											'    onclick     = "var obj = w2ui[\''+ this.name +'\']; var evnt = event; '+
											'					clearTimeout(obj._click_timer); '+
											'					obj._click_timer = setTimeout(function () { obj.doClick(\''+ record.recid +'\', '+ i +', evnt); }, 1);"'+
											'    ondblclick  = "w2ui[\''+ this.name +'\'].doDblClick(\''+ record.recid +'\', '+ i +', event);" '
										 )+
										(tmp_color != '' ? 'custom_style="'+ tmp_color +'" style="'+ tmp_color +'"' : '')+
										'>';
							}
							var num = (parseInt(this.page) * parseInt(this.recordsPerPage)) + parseInt(i+1);
							if (this.show.lineNumbers) {
								rec_html += '<td id="grid_'+ this.name +'_cell_'+ i +'_number" class="w2ui-number">'+
										'	<div style="width: 24px; cursor: default; overflow: hidden;">'+ (startRecord + ri) +'</div>'+
										'</td>';
							}
							if (this.show.selectColumn) {
								rec_html += '<td id="grid_'+ this.name +'_cell_'+ i +'_select" class="w2ui-grid-data" onclick="event.stopPropagation();">'+
										'<div style="text-align: center; cursor: default; width: 23px; overflow: hidden; padding-bottom: 0px;">'+
										'	<input id="grid_'+ this.name +'_cell_'+ i +'_select_check" type="checkbox" '+
										'		style="position: relative; display: inline-block; margin-top: 4px;" '+ (record.selected ? 'checked="checked"' : '') +
										'		onclick="var obj = w2ui[\''+ this.name +'\']; if (!obj.multiSelect) { obj.selectNone(); }'+
										'		obj.select(\''+ record.recid + '\', this.checked); event.stopPropagation();">'+
										'</div>'+
										'</td>';
							}				
							if (this.show.expandColumn) {
								rec_html += '<td id="grid_'+ this.name +'_cell_'+ i +'_expand" class="w2ui-grid-data">'+
										'	<div ondblclick="event.stopPropagation()" '+
										'		 onclick="w2ui[\''+ this.name +'\'].doExpand('+ record.recid +', event); event.stopPropagation();" '+
										'		 style="width: 23px; cursor: pointer; text-align: center; overflow: hidden; font-weight: bold;"> + </div>'+
										'</td>';
							}
							var j = 0;
							while (true) {
								var col   = this.columns[j];
								if (col.hidden) { j++; if (typeof this.columns[j] == 'undefined') break; else continue; }
								var field = '';
								if (String(col.field).indexOf('.') > -1) {
									var tmp = String(col.field).split('.');
									field = record[tmp[0]];
									if (typeof field == 'object' && field != null) {
										field = field[tmp[1]];
									}							
								} else {
									field = record[col.field];
								}
								if (typeof col.render != 'undefined') {
									if (typeof col.render == 'function') field = col.render.call(this, this.records[i], i);
									if (typeof col.render == 'object')   field = col.render[this.records[i][col.field]];
								}
								if (field == null || typeof field == 'undefined') field = '';
								// common render functions
								if (typeof col.render == 'string') {
									switch (col.render.toLowerCase()) {
									case 'url':
										var pos = field.indexOf('/', 8);
										field = '<a href="'+ field +'" target="_blank">'+ field.substr(0, pos) +'</a>';
										break;
	
									case 'repeat':
										if (i > 0 && this.records[i][col.field] == this.records[i-1][col.field] && this.records[i][col.field] != '') {
											field = '-- // --';
										}
										break;
									}
								}
							
								// prepare cell
								rec_html += '<td class="w2ui-grid-data" valign="top" id="grid_'+ this.name +'_cell_'+ i +'_'+ j +'" '+
											'	style="cursor: default; padding: 0px; margin: 0px; '+ (typeof col.style != 'undefined' ? col.style : '') +'" '+ 
											(typeof col.attr != 'undefined' ? col.attr : '') +'>';
								if (this.fixedRecord) {
									// this is for editable controls
									if ($.isPlainObject(col.editable)) {
										var edit = col.editable;
										if (typeof edit.inTag   == 'undefined') edit.inTag   = '';
										if (typeof edit.outTag  == 'undefined') edit.outTag  = '';
										if (typeof edit.style   == 'undefined') edit.style   = '';
										if (typeof edit.items   == 'undefined') edit.items   = [];
										// output the field
										if (typeof record['editable'] == 'undefined' || record['editable'] === true) {
											rec_html +=	'<div style="width: 100%; overflow: hidden; margin: 0px; padding: 0px;">'+
													'<input id="grid_'+ this.name +'_edit_'+ i +'_'+ j +'" value="'+ field +'" type="text" class="w2ui-editable" style="'+ edit.style +'" '+
													'	field="'+ col.field +'" recid="'+ record.recid +'" line="'+ i +'" column="'+ j +'" '+
													'	onclick = "w2ui[\''+ this.name + '\'].doEdit(\'click\', this, event);" '+
													'	onkeyup = "w2ui[\''+ this.name + '\'].doEdit(\'keyup\', this, event);" '+
													'	onfocus = "w2ui[\''+ this.name + '\'].doEdit(\'focus\', this, event);" '+
													'	onblur  = "w2ui[\''+ this.name + '\'].doEdit(\'blur\', this, event);" '+
													edit.inTag + ' >' + edit.outTag
													'</div>';
										} else {
											rec_html +=	'<div style="width: 100%; overflow: hidden;">'+ field +'</div>';
										}
									} else {
										rec_html +=	'<div style="width: 100%; overflow: hidden;" title="'+ String(field).replace(/"/g, "''") +'">'+ field +'</div>';
									}							
								} else {
									rec_html +=	'<div style="width: 100%; height: auto; overflow: visible;">'+ field +'</div>';
								}
								rec_html += '</td>';
								j++;
								if (typeof this.columns[j] == 'undefined') break;
							}
							rec_html += '</tr>';
							// save into either summary or regular
							if (record.summary === true) {
								if (sum_cnt % 2) {
									summary += String(rec_html).replace('w2ui-odd', 'w2ui-even') ;
								} else {
									summary += String(rec_html).replace('w2ui-even', 'w2ui-odd') ;
								}
								sum_cnt++;
							} else {
								html += rec_html;
							}
							di++;
						}
					}
					break;
				/*
				case 'div':
					if (this.records.length == 0 && this.isLoaded) {
						if (this.records.length == 0) html += this.tmpl_empty.replace('~msg~', this.msgNoData);
					}
					var tmp_last_grp = '';
					for (i=0; i<this.records.length; i++) {
						var item = this.records[i];
						// prepare group section
						var tmp  = this.tmpl_group;
						while (tmp.indexOf('~field0~') > 0) { tmp = tmp.replace('~field0~', this.records[i].recid); }
						while (tmp.indexOf('~FIELD0~') > 0) { tmp = tmp.replace('~FIELD0~', this.records[i].recid); }
						while (tmp.indexOf('~class~') > 0)  { tmp = tmp.replace('~class~', (i % 2 == 0 ? 'w2ui-odd' : 'w2ui-even')); }
						while (tmp.indexOf('~CLASS~') > 0)  { tmp = tmp.replace('~CLASS~', (i % 2 == 0 ? 'w2ui-odd' : 'w2ui-even')); }
						for (var k=0; k<item.length; k++) {
							while (tmp.indexOf('~field'+(k+1)+'~') > 0) { tmp = tmp.replace('~field'+(k+1)+'~', item[k]); }
							while (tmp.indexOf('~FIELD'+(k+1)+'~') > 0) { tmp = tmp.replace('~FIELD'+(k+1)+'~', item[k]); }
						}
						if (tmp != tmp_last_grp) { html += tmp; tmp_last_grp = tmp; }
						// prepare repeatable section
						var tmp  = this.tmpl;
						while (tmp.indexOf('~field0~') > 0) { tmp = tmp.replace('~field0~', this.records[i].recid); }
						while (tmp.indexOf('~FIELD0~') > 0) { tmp = tmp.replace('~FIELD0~', this.records[i].recid); }
						while (tmp.indexOf('~class~') > 0)  { tmp = tmp.replace('~class~', (i % 2 == 0 ? 'w2ui-odd' : 'w2ui-even')); }
						while (tmp.indexOf('~CLASS~') > 0)  { tmp = tmp.replace('~CLASS~', (i % 2 == 0 ? 'w2ui-odd' : 'w2ui-even')); }
						for (var k=0; k<item.length; k++) {
							while (tmp.indexOf('~field'+(k+1)+'~') > 0) { tmp = tmp.replace('~field'+(k+1)+'~', item[k]); }
							while (tmp.indexOf('~FIELD'+(k+1)+'~') > 0) { tmp = tmp.replace('~FIELD'+(k+1)+'~', item[k]); }
						}
						html += tmp;
					}
					break;
				*/
			}
			if (summary != '') {
				this.summary = '<table cellpadding="0" cellspacing="0" style="table-layout: fixed;">'+ summary +'</table>';
			} else {
				this.summary = '';
			}
			return html;
		},
		
		getFooterHTML: function () {
			var totalPages = Math.floor(this.total / this.recordsPerPage);
			if (this.total % this.recordsPerPage != 0 || totalPages == 0) totalPages++;
			if (totalPages < 0) totalPages = 1;
				pages = "<div style=\"width: 120px; margin-left: auto; margin-right: auto; text-align: center\" class=\"w2ui-footer-nav\">"+
					 "		<input type=\"button\" value=\"<<\" class=\"sText\" style=\"width: 30px\" "+
					 "  		onclick=\"w2ui[\'"+ this.name +"\'].goto(w2ui[\'"+ this.name +"\'].page - 1)\" "+ (this.page == 0 ? 'disabled' : '') +
					 "		>"+
					 "		<input type=\"text\" size=\"4\" class=\"sText\" value=\""+ (this.page+1) +"\" "+
					 "			onclick=\"this.select();\" style=\"padding: 1px 2px 2px 2px; text-align: center;\" "+
					 "			onkeyup=\"if (event.keyCode != 13) return;  "+
					 "					  if (this.value < 1) this.value = 1; "+
					 "					  w2ui[\'"+ this.name +"\'].goto(parseInt(this.value-1)); \"> "+
					 "		<input type=\"button\" value=\">>\" class=\"sText\" style=\"width: 30px\" "+
					 "  		onclick=\"w2ui[\'"+ this.name +"\'].goto(w2ui[\'"+ this.name +"\'].page + 1)\" "+ (this.page == totalPages-1 || totalPages == 0 ? 'disabled' : '') +
					 "		>"+
					 "</div>";
			return pages;			
		},
		
		showStatus: function (status) {
			var obj = this;
			$('#grid_'+ this.name).append(
				'<div id="grid_'+ this.name +'_lock" class="w2ui-grid-lock" style="position: absolute; display: none;"></div>'+
				'<div id="grid_'+ this.name +'_status" class="w2ui-grid-status" style="position: absolute; display: none;"></div>'
			);
			setTimeout(function () {	
				var lock 	= $('#grid_'+ obj.name +'_lock');
				var status 	= $('#grid_'+ obj.name +'_status');
				status.data('old_opacity', status.css('opacity')).css('opacity', '0').show();
				lock.data('old_opacity', lock.css('opacity')).css('opacity', '0').show();
				setTimeout(function () {
					var left 	= ($(obj.box).width()  - w2utils.getSize(status, 'width')) / 2;
					var top 	= ($(obj.box).height() * 0.9 - w2utils.getSize(status, 'height')) / 2;
					lock.css({
						opacity : lock.data('old_opacity'),
						left 	: '0px',
						top 	: '0px',
						width 	: '100%',
						height 	: '100%'
					});
					status.html('Refreshing...').css({ 
						opacity : status.data('old_opacity'),
						left	: left + 'px', 
						top		: top + 'px'
					});
				}, 10);
			}, 10);
		},
		
		hideStatus: function (immediate) {
			var obj = this;
			setTimeout(function () {
				$('#grid_'+ obj.name +'_lock').remove();
				$('#grid_'+ obj.name +'_status').remove();
			}, 25);
		}
	}
	
	$.extend(w2grid.prototype, $.w2event);
})();