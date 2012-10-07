/************************************************************************
*   Library: Web 2.0 UI for jQuery (using prototypical inheritance)
*   - Following objects defined
* 		- w2ui.w2field 	- various field controls
*		- $.w2field		- jQuery wrapper
*   - Dependencies: jQuery, w2utils
* 
************************************************************************/

(function ($) {

	// ====================================================
	// -- Registers as a jQuery plugin
	
	$.fn.w2field = function(method) {
		// Method calling logic
		if (w2field[method]) {
			return w2field[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object') {
			return w2field.init.apply( this, arguments );
		} else if ( typeof method === 'string') {
			return w2field.init.apply( this, [{ type: method }] );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.w2field' );
		}    
	};
	
	// ====================================================
	// -- Implementation of core functionality
	
	var w2field = {
		// CONTEXT: this - is jQuery object
		init: function (options) { 		
			var obj = w2field;
			return $(this).each(function (field, index) {
				switch (options.type.toLowerCase()) {
					case 'clear': // removes any previously applied type
						break;
					case 'int':
						$(this).on('keypress', function (evnt) {	
							if (evnt.metaKey || evnt.ctrlKey || evnt.altKey) return;
							var char = String.fromCharCode(evnt.keyCode);
							if (!w2utils.isInt(char) && char != '-') {
								evnt.stopPropagation();
								return false;
							}
						});
						$(this).on('blur', function (evnt)  { 
							if (!w2utils.isInt(this.value)) { this.value = ''; } 
						});
						break;
						
					case 'float':
						$(this).on('keypress', function (evnt) {	
							if (evnt.metaKey || evnt.ctrlKey || evnt.altKey) return;
							var char = String.fromCharCode(evnt.keyCode);
							if (!w2utils.isInt(char) && char != '.' && char != '-') {
								evnt.stopPropagation();
								return false;
							}
						});
						$(this).on('blur', function (evnt)  { 
							if (!w2utils.isFloat(this.value)) { this.value = ''; } 
						});
						break;
						
					case 'money':
						$(this).on('keypress', function (evnt) {	
							if (evnt.metaKey || evnt.ctrlKey || evnt.altKey) return;
							var char = String.fromCharCode(evnt.keyCode);
							if (!w2utils.isInt(char) && char != '.' && char != '-' && char != '$' && char != '€' && char != '£' && char != '¥') {
								evnt.stopPropagation();
								return false;
							}
						});
						$(this).on('blur', function (evnt)  { 
							if (!w2utils.isMoney(this.value)) { this.value = ''; } 
						});
						break;
						
					case 'hex':
						$(this).on('keypress', function (evnt) {	
							if (evnt.metaKey || evnt.ctrlKey || evnt.altKey) return;
							var char = String.fromCharCode(evnt.keyCode);
							if (!w2utils.isHex(char)) {
								evnt.stopPropagation();
								return false;
							}
						});
						$(this).on('blur', function (evnt)  { 
							if (!w2utils.isHex(this.value)) { this.value = ''; } 
						});
						break;
						 
					case 'alphaNumeric':
						$(this).on('keypress', function (evnt) {	
							if (evnt.metaKey || evnt.ctrlKey || evnt.altKey) return;
							var char = String.fromCharCode(evnt.keyCode);
							if (!w2utils.isAlphaNumeric(char)) {
								evnt.stopPropagation();
								return false;
							}
						});
						$(this).on('blur', function (evnt)  { 
							if (!w2utils.isAlphaNumeric(this.value)) { this.value = ''; } 
						});
						break;
						
					case 'date':
						var obj = this;
						// -- insert div for calendar
						if ($(this).length == 0 || $('#'+$(this)[0].id).length != 1) {
							console.error('The date field must have a unique id in w2field(\'date\').');
							return;
						}
						$(this).data("options", options)
							.on('focus', function () {
								if ($('#global_calendar_div').data('no-refresh') == 'yes') {
									$('#global_calendar_div').data('no-refresh', null);
									return;
								}
								clearTimeout($('#global_calendar_div').data('timer'));
								var top  = parseInt($(obj).offset().top) + parseInt(obj.offsetHeight);
								var left = parseInt($(obj).offset().left);
								$('#global_calendar_div').remove();
								$('body').append('<div id="global_calendar_div" name="'+ $(obj).attr('id') +'" style="position: absolute; z-index: 1600; display: none;'+
									'		top: '+ (top + parseInt(obj.offsetHeight)) +'px; left: '+ left +'px;" '+
									' class="w20-calendar" '+
									' onclick="event.stopPropagation(); event.preventDefault(); var id=\''+ $(obj).attr('id') +'\'; clearTimeout($(\'#global_calendar_div\').data(\'timer\')); $(\'#\'+id)[0].focus();"></div>');
								$('#global_calendar_div').html( $().w2field('calendar_get', obj.value, options) ).css({
									left: left + 'px',
									top: top + 'px'
								}).show().data('no-hide', 'yes');
								// monitors
								var mtimer = setInterval(function () { 
									// monitor if moved
									if ($('#global_calendar_div').data('position') != ($(obj).offset().left) + 'x' + ($(obj).offset().top  + obj.offsetHeight)) {
										$('#global_calendar_div').css({
											'-webkit-transition': '.2s',
											left: ($(obj).offset().left) + 'px',
											top : ($(obj).offset().top + obj.offsetHeight) + 'px'
										}).data('position', ($(obj).offset().left) + 'x' + ($(obj).offset().top + obj.offsetHeight));
									}
									// monitor if destroyed
									if ($(obj).length == 0 || ($(obj).offset().left == 0 && $(obj).offset().top == 0)) {
										clearInterval(mtimer);
										$('#global_calendar_div').remove();
										return;
									}
								}, 100);
								$(obj).data('mtimer', mtimer);
							})
							.on('blur', function () {
								var obj = this;
								var tmp = setTimeout(function () {
									$('#global_calendar_div').remove();
								}, 200);
								$('#global_calendar_div').data('timer', tmp);
							})
							.on('keypress', function () {
								var obj = this;
								setTimeout(function () {
									$('#global_calendar_div').html( $().w2field('calendar_get', obj.value, options) );
								}, 100);
							});
						break;
						
					case 'time':
						break;
						
					case 'color':
						break;

					case 'enum':
						var defaults = {
							url			: '',
							items		: [],
							maxHeight 	: 65, 	// max height for input control to grow
							maxSelection: 0,	// maximum number of items that can be selected 0 for unlim
							cacheMax 	: 500,	// number items to cache
							render 		: null
						}
						var obj		 = this;
						var settings = $.extend({}, defaults, options);

						$(this).data('settings', settings)
							.on('click', function (event) {
								// insert global div
								if ($('#w2ui-global-items').length == 0) {
									$('body').append('<div id="w2ui-global-items" class="w2ui-items" '+
										'style="position: absolute; z-index: 1200; display: none; -moz-box-sizing: border-box; -webkit-box-sizing: border-box;">'+
										'</div>');
								} else {
									// ignore second click
									$('#w2ui-global-items').data('ignoreClick', true);
									return;	
								}
								var div = $('#w2ui-global-items');
								div.css({
										display : 'block',
										left 	: ($(obj).offset().left) + 'px',
										top 	: ($(obj).offset().top + obj.offsetHeight) + 'px'
									})
									.width(w2utils.getSize(obj, 'width'))
									.data('position', ($(obj).offset().left) + 'x' + ($(obj).offset().top + obj.offsetHeight))
									.data('ignoreClick', true)
									.on('click', function () { div.data('ignoreClick', true); });

								// show drop content
								w2field.list_render.call(obj);

								// monitors
								var mtimer = setInterval(function () { 
									// monitor if moved
									if (div.data('position') != ($(obj).offset().left) + 'x' + ($(obj).offset().top  + obj.offsetHeight)) {
										div.css({
											'-webkit-transition': '.2s',
											left: ($(obj).offset().left) + 'px',
											top : ($(obj).offset().top + obj.offsetHeight) + 'px'
										})
										.data('ignoreClick', true)
										.data('position', ($(obj).offset().left) + 'x' + ($(obj).offset().top + obj.offsetHeight));
										// if moved then resize
										setTimeout(function () {
											w2field.list_render.call(obj, $(obj).data('last_search'));
										}, 200);
									}
								}, 100);
								$(obj).data('mtimer', mtimer);

								// click anywhere else hides the drop down
								var hide = function () {
									var div = $('#w2ui-global-items');
									if (div.data('ignoreClick') === true) {
										div.data('ignoreClick', false);
										return;
									}
									div.remove();
									$(document).off('click', hide);
								}
								$(document).on('click', hide);
							})
							.on('keypress', function (event) { event.stopPropagation(); event.preventDefault(); })
							.on('focus', function () {
								$(this).trigger('click');
								setTimeout(function () {
									$('#w2ui-global-items input').focus();
								}, 1);
							});

						// add methods
						this.add = function (item) {
							var selected = $(this).data('selected');
							if (!$.isArray(selected)) selected = [];
							if (settings.maxSelection != 0 && settings.maxSelection <= selected.length) {
								// if max reached, replace last
								selected.splice(selected.length - 1, 1);
							}
							selected.push(item);
							$(this).data('selected', selected);
							$(this).data('last_del', null);
						}
						this.refresh = function () {
							var obj = this;
							// remove all items
							$($(this).data('selected-div')).remove();
							// rebuild it
							var html = '<div class="w2ui-list" style="position: absolute; padding: 2px; min-height: 26px; overflow: auto; border: 1px solid silver; border-radius: 3px; '+
									   '	width: '+ (w2utils.getSize(this, 'width') - 1) +'px"><ul style="list-style-type: none">';
							var selected = $(this).data('selected');
							for (var s in selected) {
								html += '<li class="w2ui-list-item" style="'+ ($(this).data('last_del') == s ? 'opacity: 0.5' : '') +'">'+
										selected[s].text +
										'<div title="Remove" index="'+ s +'" class="w2ui-search-clear">&nbsp;&nbsp;</div>'+
										'</li>';
							}
							html += '</ul></div>';
							$(this).before(html);
							var div = $(this).prev();
							$(this).data('selected-div', div);
							var cntHeight = w2utils.getSize(div, 'height');
							if (cntHeight < 26) cntHeight = 26;
							if (cntHeight > settings.maxHeight) cntHeight = settings.maxHeight;
							$(div).height(cntHeight);
							if (div.length > 0) div[0].scrollTop = 1000;
							$(this).height(cntHeight);

							$(div).on('click', function (event) {
								var el = event.target;
								if (el.title == 'Remove') {
									$(obj).data('selected').splice($(el).attr('index'), 1);
									$(el.parentNode).fadeOut('fast');
									setTimeout(function () { 
										obj.refresh(); 
									}, 300);
									w2field.list_render.call(obj);
									event.stopPropagation();
									$(obj).trigger('click');
									$('#w2ui-global-items').data('ignoreClick', true)
									return;
								}
								obj.focus();
								$('#w2ui-global-items').data('ignoreClick', true)
							});
						}
						break;
						
					case 'autocomplete': 
						var defaults = {
							url			: '',
							items		: [],
							multiSelect	: false,
							delay		: 300,
							minHeight	: 22,
							maxHeight	: 200,
							cacheMax	: 1000,
							showMax		: 50,
							showOnClick	: (typeof showOnClick != 'undefined' ? showOnClick : false),
							showAll		: (typeof showAll != 'undefined' ? showAll : false),
							render		: null,
							onSelect	: null 
						}
						var settings = $.extend({}, defaults, options);
						var obj		 = this;
						
						// insert global div
						if ($('#w2ui-global-items').length == 0) {
							$('body').append('<div id="w2ui-global-items" class="w2ui-items" '+
								'style="position: absolute; overflow: auto; z-index: 1200; display: none; -moz-box-sizing: border-box; -webkit-box-sizing: border-box;">'+
								'</div>');
						}
						if ($.isArray(settings.items)) { $(this).data('items', settings.items); }
						$(this).data('settings', settings)
							.on('click', function (event) {
								var settings  = $(this).data('settings');
								if ($(this).data('items').length > 0 && settings && settings['showOnClick'] == true) {
									this.findItems();
								}
							})
							.on('keydown', function (event) {
								if (event.keyCode == 38 || event.keyCode == 40) {
									var selected = $(this).data('selected');
									var items	 = $(this).data('items');
									if (typeof selected == 'undefined') selected = 0;
									if (event.keyCode == 38) selected--;
									if (event.keyCode == 40) selected++;
									if (selected < 1) selected = 1;
									if (selected > items.length) selected = items.length;
									$('#w2ui-global-items ul li').removeClass('selected');
									var op = $('#w2ui-global-items ul li:nth-child('+ selected +')')
									op.addClass('selected');
									if (op.length > 0 && op[0].scrollIntoView) op[0].scrollIntoView(false);									
									$(this).data('selected', selected);
									// stop default
									event.stopPropagation();
									event.preventDefault();
									$(this).data('stop', true);
								}
								if (event.keyCode == 13) {
									var selected = $(this).data('selected');
									if (typeof selected == 'undefined') return;
									$('#w2ui-global-items ul li:nth-child('+ selected +')').trigger('click');
									// -- next in grid
									var obj = this;
									setTimeout(function () {
										var id 		= obj.id;
										var line 	= parseInt($(obj).attr('line'));
										var column	= parseInt($(obj).attr('column'));
										var newEl = $('#'+ id.replace('_'+ line +'_'+ column, '') +'_'+ (line) +'_'+ (column+1));
										if (newEl.length > 0) newEl.trigger('focus').trigger('click');
									}, 100);
								}
							})
							.on('keyup', function (event) {
								if (event.keyCode == 38 || event.keyCode == 40) return;
								var settings  = $(this).data('settings');
								this.findItems(); // populate items if needed
								if ($(this).data('items').length > 0) {
									this.showItems();
								}
							})
							.on('focus', function (event) {
								var settings = $(this).data('settings');
								if (settings.type == 'list' || settings.type == 'menu') $(this).addClass('w2ui-tb-down');
							})
							.on('blur', function (event) {
								this.hideItems();
							})
							.on('mouseover', function (evetn) {
								if ($('#w2ui-global-items').data('field') == obj) {
									$('#w2ui-global-items').data('mousein', 1);
								}
							});
						
						// methods
						this.showItems = function () {
							var settings = $(obj).data('settings');
							$('#w2ui-global-items')
								.width(w2utils.getSize(obj, 'width'))
								.css({ 
									'left'	: $(obj).offset().left + 'px', 
									'top'	: ($(obj).offset().top + w2utils.getSize(obj, 'height') -1) + 'px',
									'height': '20px'
								})
								.data('field', obj)
								.data('mousein', 0)
								.on('mouseover', function() {
									$('#w2ui-global-items').data('mousein', 1);
								 })
								.on('mouseout', function() { 	
									$('#w2ui-global-items').data('mousein', 0);
									obj.hideItems();
								 })
								.show();
							$($('#w2ui-global-items').data('field')).data('selected', 0)
							setTimeout(function() {
								// screen height
								if (window.innerHeight == undefined) {
									var sheight = document.documentElement.offsetHeight;
								} else {
									var sheight = window.innerHeight;
								}
								var height = $('#w2ui-global-items ul').height() + 5;
								if (height < settings['minHeight']) height = settings['minHeight'];
								if (height > settings['maxHeight']) height = settings['maxHeight'];
								if (height > sheight - $('#w2ui-global-items').offset().top -10) {
									height = sheight - $('#w2ui-global-items').offset().top -10;
								}
								$('#w2ui-global-items').css({ height: height }).scrollTop(1); // if 0 then does not work
							}, 1);
							// monitors
							var mtimer = setInterval(function () { 
								// monitor if moved
								if ($('#w2ui-global-items').data('position') != ($(obj).offset().left) + 'x' + ($(obj).offset().top  + obj.offsetHeight)) {
									$('#w2ui-global-items').css({
										'-webkit-transition': '.2s',
										left: ($(obj).offset().left) + 'px',
										top : ($(obj).offset().top + obj.offsetHeight) + 'px'
									}).data('position', ($(obj).offset().left) + 'x' + ($(obj).offset().top + obj.offsetHeight));
								}
								// monitor if destroyed
								if ($(obj).length == 0 || ($(obj).offset().left == 0 && $(obj).offset().top == 0)) {
									clearInterval(mtimer);
									$('#w2ui-global-items').remove();
									return;
								}
							}, 100);
							$(obj).data('mtimer', mtimer);
						};					
						this.hideItems = function (delay) {
							if (String(delay) == 'undefined') delay = 300;
							if (delay == 0) $('#w2ui-global-items').hide();
							setTimeout(function() {
								if ($('#w2ui-global-items').data('field') != obj) {
									$(obj).removeClass('w2ui-tb-down');
									return;
								}
								if ($('#w2ui-global-items').data('mousein') != 0) {
									$('#w2ui-global-items').data('mousein', 2)
								} else {
									$($('#w2ui-global-items').data('field')).removeClass('w2ui-tb-down');
									$('#w2ui-global-items').hide();
								}
							}, delay);
						};
						this.findItems = function () {
							w2field.list_findItems.call(obj);
						};
						this.getItems = function () {
							w2field.list_getItems.call(obj);
						};
						break;
				}
			});
		},
		
		// ******************************************************
		// -- Menu and AutoComplete
		
		list_getItems: function () {
			var items	 = $(this).data('items');
			var settings = $(this).data('settings');	
			var obj		 = this;
			
			if (settings['lastSearch'] == this.value) { 
				this.findItems.call(this); 
				return; 
			}
			if (settings['lastSearchLength'] < String(this.value).length && settings['lastCount'] < settings['cacheMax'] ) { 
				this.findItems.call(this); 
				return; 
			}
		
			settings['lastSearch'] = this.value;
			settings['lastLength'] = String(this.value).length;
			settings['lastCount']  = 0;
			
			$.getJSON(settings['url'], { s: this.value, t: new Date().getTime() }, 
				function (data) {
					var tmp = [], i = 0; 
					for (var d in data) { 
						if (i > settings['cacheMax']) break; 
						if (data[d] == null || data[d] == '' || $.isEmptyObject(data[d])) continue;
						tmp[i] = data[d]; i++; 
					}
					items = tmp; 
					settings['lastCount'] = items.length;
					obj.findItems(); 
				}
			);
		},
		
		list_findItems: function () {
			var items	 = $(this).data('items');
			var settings = $(this).data('settings');
			
			// update items from server if needed
			if (settings['url'] != '') { this.getItems(); }
			
			var html = '<ul>';
			var i    = 0;
			for (var a in items) {
				if (items[a] == '') continue;
				if (typeof items[a] == 'object') {
					var txt = String(items[a].text);
					if (txt == null && typeof items[a].caption != 'undefined') txt = items[a].caption;
					var id  = items[a].id;
					if (id == null && typeof items[a].value != 'undefined') id = items[a].value;
					if (id == null || String(id) == 'undefined' || id == '') id = txt;
				}
				if (typeof items[a] == 'string') {
					var id  = items[a];
					var txt = items[a];
				}
				var txt1 = String(this.value).toLowerCase();
				var txt2 = txt.toLowerCase();
				if ((i < parseInt(settings['showMax']) && txt1.length <= txt2.length && txt2.substr(0, txt1.length) == txt1) || settings.showAll) {
					if (typeof settings['render'] == 'function') {
						txt = settings['render'](items[a]);
					}
					html += '\n<li style="display: block" value="'+ id +'" class="'+ (i % 2 ? 'w2ui-item-even' : 'w2ui-item-odd')+ '">'+ txt +'</li>';
					i++;
				}
			}
			html += '\n</ul>';			
			$('#w2ui-global-items').html(html).attr('scrollTop', '0px').css({ overflow: 'auto' });
			// event handler
			$('#w2ui-global-items ul').on('click', function (event) {
				if (event.target.tagName != 'LI') return;
				var el = $('#w2ui-global-items').data('field');
				var settings = $(el).data('settings');
				if (typeof settings['onSelect'] == 'function') settings.onSelect($(event.target).val());
				$(el).data('value', event.target.getAttribute('value'));
				$(el).val(event.target.innerHTML);
				el.hideItems(0);
				$(el).trigger('change');
				$(el).trigger('blur');
			});
			if (i > 0) this.showItems(); else this.hideItems(0);
		},

		list_render: function (search) {
			var obj 	 = this;
			var div 	 = $('#w2ui-global-items');
			var settings = $(this).data('settings');
			var selected = $(this).data('selected');

			//console.log($.data($(this).get(0)) ); // return all data

			// build overall html
			if (typeof search == 'undefined') {
				var html 	 = '';
				html += '<div style="border-radius: 4px; background-color: white; padding: 3px;">'+
						'	<div class="list_serach" style="padding: 2px;">'+
						'		<div class="w2ui-icon icon-search" style="position: absolute; left: 5px;"></div>'+
						'		<input type="text" style="width: 100%; border: 1px solid #999; padding: 3px 3px 4px 20px; border-radius: 3px;">'+
						'	</div>'+
						'	<div class="list_items" style="padding-top: 3px;"></div>'+
						'</div>';
				div.html(html);
				search = '';
			}
			$(this).data('last_search', search);
			if (typeof $(obj).data('last_index') == 'undefined' || $(obj).data('last_index') == null) $(obj).data('last_index', 0);

			// pull items from url
			if (typeof settings.last_total == 'undefined') settings.last_total = -1;
			if (typeof settings.last_search_len == 'undefined') settings.last_search_len = 0;
			if (typeof settings.last_search_match == 'undefined') settings.last_search_match = -1;
			if (settings.url != '' && ( 
					   (settings.items.length == 0 && settings.last_total != 0) 
					|| (search.length > settings.last_search_len && settings.last_total > settings.cacheMax)
					|| (search.length < settings.last_search_match && search.length != settings.last_search_len)
				)
			) {
				var match = false;
				if (settings.last_total < settings.cacheMax) match = true;
				$.ajax({
					dataType: 'text',
					url : settings.url + (String(settings.url).indexOf('?') > 0 ? '&' : '?') + 'search='+ search +'&max='+ settings.cacheMax,
					complete: function (xhr, status) {
						settings.last_total = 0;
						if (status == 'success') {
							var data = $.parseJSON(xhr.responseText);
							if (match == false && data.total < settings.cacheMax) { console.log('--> match'); settings.last_search_match = search.length; }
							settings.last_search_len = search.length;
							settings.last_total = data.total
							settings.items      = data.options;
							w2field.list_render.call(obj, search);
						}
					}
				});
			}
			
			// build items
			var i = 0;
			var items = settings.items;
			var ihtml = '<ul>';
			// get ids of all selected items
			var ids	  = [];
			for (var a in selected) ids.push(selected[a].id)
			// build list
			for (var a in items) {
				if (items[a] == '') continue;
				if (typeof items[a] == 'object') {
					var txt = String(items[a].text);
					if (txt == null && typeof items[a].caption != 'undefined') txt = items[a].caption;
					var id  = items[a].id;
					if (id == null && typeof items[a].value != 'undefined') id = items[a].value;
					if (id == null || String(id) == 'undefined' || id == '') id = txt;
				}
				if (typeof items[a] == 'string') {
					var id  = items[a];
					var txt = items[a];
				}
				// if already selected
				if ($.inArray(id, ids) != -1) continue;
				// check match with search
				var txt1 = String(search).toLowerCase();
				var txt2 = txt.toLowerCase();
				if (txt1.length <= txt2.length && txt2.substr(0, txt1.length) == txt1) {
					if (typeof settings['render'] == 'function') {
						txt = settings['render'](items[a]);
					}
					ihtml += '\n<li style="display: block; -webkit-transition: 0.2s" index="'+ a +'" value="'+ id +'" '+
							 '  onmousedown="$(this).parent().find(\'li\').removeClass(\'selected\'); $(this).addClass(\'selected\'); "'+
							 '	class="'+ (i % 2 ? 'w2ui-item-even' : 'w2ui-item-odd') + (i == $(obj).data('last_index') ? " selected" : "") +'">'+ 
							 txt +'</li>';
					if (i == $(obj).data('last_index')) $(obj).data('last_item', items[a]);
					i++;
				}
			}
			ihtml += '</ul>';
			div.find('.list_items').html(ihtml);
			$(this).data('last_max', i-1);		

			// scroll selected into view
			if (div.find('li.selected').length > 0) div.find('li.selected')[0].scrollIntoView(false);

			// if menu goes off screen - add scrollbar
			div.css({ '-webkit-transition': '0s', height : 'auto' }); 
			var max_height = parseInt($(document).height()) - parseInt(div.offset().top) - 8;
			if (parseInt(div.height()) > max_height) {
				div.css({ 
					height 	: (max_height - 5) + 'px', 
					overflow: 'show' 
				});
				$(div).find('.list_items').css({
					height 	: (max_height - 45) + 'px', 
					overflow: 'auto' 
				});
			}
			$('#w2ui-global-items input').focus();

			// add events
			div.find('ul').off('click').on('click', function (event) {
				var id 	 = $(event.target).attr('index');
				var item = settings.items[id];
				obj.add(item);
				$(obj).data('last_index', 0);
				obj.refresh();
				w2field.list_render.call(obj, search);
			});
			div.find('input').off('keyup').on('keyup', function (event) {
				var inp = this;
				setTimeout(function () { 
					var curr = $(obj).data('last_index');
					switch (event.keyCode) {
						case 38: // up
							curr--;
							if (curr < 0) curr = 0;
							$(obj).data('last_index', curr);
							event.preventDefault();
							break;
						case 40: // down
							curr++;
							if (curr > $(obj).data('last_max')) curr = $(obj).data('last_max');
							$(obj).data('last_index', curr);
							event.preventDefault();
							break;
						case 13: // enter
							if (typeof $(obj).data('last_item') == 'undefined' || $(obj).data('last_item') == null) break;
							var selected = $(obj).data('selected'); 
							obj.add($(obj).data('last_item'));
							// select next
							if (curr > $(obj).data('last_max') - 1) curr = $(obj).data('last_max')-1;
							$(obj).data('last_index', curr);
							$(obj).data('last_item', null);
							// refrech
							obj.refresh();
							w2field.list_render.call(obj, search);
							event.preventDefault();
							break;
						case 8: // backspace
							if (inp.value == '') {
								if (typeof $(obj).data('last_del') == 'undefined' || $(obj).data('last_del') == null) {
									// mark for deletion
									var selected = $(obj).data('selected'); 
									if (!$.isArray(selected)) selected = [];
									$(obj).data('last_del', selected.length-1);
									// refrech
									obj.refresh();
								} else {
									// delete marked one
									var selected = $(obj).data('selected'); 
									if (!$.isArray(selected)) selected = [];
									if (selected.length > 0) {
										selected.splice(selected.length-1, 1);
									}
									$(obj).data('selected', selected);
									$(obj).data('last_del', null);
									// refrech
									obj.refresh();
									w2field.list_render.call(obj, search);
								}
							}
							break;
						default: 
							$(obj).data('last_index', 0);
							$(obj).data('last_del', null);
							break;
					}
					obj.refresh();
					w2field.list_render.call(obj, inp.value); 
				}, 10);
			})
		},
		
		// ******************************************************
		// -- Calendar
		
		calendar_get: function (date, options) {
			var td = new Date();
			var today = (Number(td.getMonth())+1) + '/' + td.getDate() + '/' + (String(td.getYear()).length > 3 ? td.getYear() : td.getYear() + 1900);
			if (date == '' || String(date) == 'undefined') date = today; 
			if (!w2utils.isDate(date)) date = today;
			
			var tmp  = date.split('/')
			var html =  '<table cellpadding="0" cellspacing="0" style=""><tr>' +
						'<td>'+ $().w2field('calendar_month', tmp[0], tmp[2], options) +'</td>'+
						'<!--td valign="top" style="background-color: #f4f4fe; padding: 8px; padding-bottom: 0px; padding-top: 22px; border: 1px solid silver; border-left: 0px;">'+
						'	Jan <br> Feb <br> Mar <br> Apr <br> May <br> Jun <br> Jul <br> Aug <br> Sep <br> Oct <br> Nov <br> Dec'+
						'</td>'+
						'<td valign="top" style="background-color: #f4f4fe; padding: 6px; padding-bottom: 0px; padding-top: 22px; border: 1px solid silver; border-left: 0px;">'+
						'	2001 <br> 2002 <br> 2003 <br> 2004'+
						'</td-->'+
						'</tr></table>';
			return html;
		},
		
		calendar_next: function(date, calendar) {
			var tmp = String(date).split('/');
			var month = tmp[0];
			var year  = tmp[1];
			if (parseInt(month) < 12) {
				month = parseInt(month) + 1;
			} else {
				month = 1;
				year  = parseInt(year) + 1;
			}
			options = $('#'+$(calendar).attr('name')).data('options');
			$(calendar).data('no-refresh', 'yes');
			$(calendar).html( $().w2field('calendar_get', month+'/1/'+year, options) );
		},
		
		calendar_previous: function(date, calendar) {
			var tmp = String(date).split('/');
			var month = tmp[0];
			var year  = tmp[1];
			if (parseInt(month) > 1) {
				month = parseInt(month) - 1;
			} else {
				month = 12;
				year  = parseInt(year) - 1;
			}
			options = $('#'+$(calendar).attr('name')).data('options');
			$(calendar).data('no-refresh', 'yes');
			$(calendar).html( $().w2field('calendar_get', month+'/1/'+year, options) );
		},
		
		calendar_month: function(month, year, options) {
			// options = { blocked: {'4/11/2011': 'yes'}, colored: {'4/11/2011': 'red:white'} }
			var td = new Date();
			var months 		= ['January', 'February', 'March', 'April', 'May', 'June', 'July',	'August', 'September', 'October', 'November', 'December'];
			var days  		= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var daysCount   = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
			var today		= (Number(td.getMonth())+1) + '/' + td.getDate() + '/' + (String(td.getYear()).length > 3 ? td.getYear() : td.getYear() + 1900);
			
			year  = Number(year);
			month = Number(month);
			if (year  === null || year  === '') year  = String(td.getYear()).length > 3 ? td.getYear() : td.getYear() + 1900;
			if (month === null || month === '') month = Number(td.getMonth())+1;
			if (month > 12) { month = month - 12; year++; }
			if (month < 1 || month == 0)  { month = month + 12; year--; }
			if (year/4 == Math.floor(year/4)) { daysCount[1] = '29'; } else { daysCount[1] = '28'; }
			if (year  == null) { year  = td.getYear(); }
			if (month == null) { month = td.getMonth()-1; }
			
			// start with the required date
			var td = new Date();
			td.setDate(1);
			td.setMonth(month-1);
			td.setYear(year);
			var weekDay = td.getDay();
			
			var html  = 
				'<div class="w2ui-calendar-title">'+
				'	<div style="float: left" class="w2ui-calendar-previous" onclick="$().w2field(\'calendar_previous\', \''+ month +'/'+ year +'\', $(this).parents(\'div.w20-calendar\')[0]);"> <- </div>'+
				'	<div style="float: right" class="w2ui-calendar-next" onclick="$().w2field(\'calendar_next\', \''+ month +'/'+ year +'\', $(this).parents(\'div.w20-calendar\')[0]);"> -> </div> '+ 
						months[month-1] +', '+ year + 
				'</div>'+
				'<table class="w2ui-calendar-days" onclick="" cellspacing="0">'+
				'	<tr class="w2ui-day-title"><td>M</td> <td>T</td> <td>W</td> <td>T</td> <td>F</td> <td>S</td> <td>S</td></tr>'+
				'	<tr>';
					
			var day = 1;
			for (var ci=1; ci<43; ci++) {
				if (weekDay == 0 && ci == 1) {
					for (var ti=0; ti<6; ti++) html += '<td class="w2ui-day-empty">&nbsp;</td>';
					ci += 6;
				} else {
					if (ci < weekDay || day > daysCount[month-1]) {
						html += '<td class="w2ui-day-empty">&nbsp;</td>';
						if ((ci)%7 == 0) html += '</tr><tr>';
						continue;
					}
				}
				var dt  = month + '/' + day + '/' + year;
				
				var className = ''; 
				if (dt == today) className = 'w2ui-today';
				if (ci % 7 == 6) className = 'w2ui-saturday';
				if (ci % 7 == 0) className = 'w2ui-sunday';
				
				var dspDay 	= day;			
				var col 	= '';
				var bgcol 	= '';
				var blocked = '';
				if (options.colored) if (options.colored[dt] != undefined) { // if there is predefined colors for dates
					tmp   = options.colored[dt].split(':');
					bgcol = 'background-color: ' + tmp[0] + ';';
					col   = 'color: ' + tmp[1] + ';';
				}
				var noSelect = false;
				if (options.blocked) if (options.blocked[dt] != undefined) {
					blocked  = ' w2ui-blocked-date';
					noSelect = true;
				} 
				html += '<td class="'+ className + blocked +'" style="'+ col + bgcol + '" id="'+ this.name +'_date_'+ dt +'" date="'+ dt +'"';
				if (noSelect === false) {
					html += 'onclick="var id = $(this).parents(\'div.w20-calendar\').attr(\'name\'); $(\'#\'+id).val(\''+ dt +'\').trigger(\'change\').trigger(\'blur\'); '+
							'		  event.stopPropagation(); return false;"';
				}
				html +=	'>'+ dspDay + '</td>';
				if (ci % 7 == 0 || (weekDay == 0 && ci == 1)) html += '</tr><tr>';
				day++;
			}
			html += '</tr></table>';
			return html;
		}
	}

}) (jQuery);