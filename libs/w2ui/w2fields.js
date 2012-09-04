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
						
					case 'menu':
					case 'list':
						var showOnClick = true;
						var showAll		= true;
						$(this).attr('readOnly', true);
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
						var cnt		 = this;
						
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
								if ($('#w2ui-global-items').data('field') == cnt) {
									$('#w2ui-global-items').data('mousein', 1);
								}
							});
						
						// methods
						this.showItems = function () {
							var settings = $(cnt).data('settings');
							$('#w2ui-global-items')
								.width(w2utils.getSize(cnt, 'width'))
								.css({ 
									'left'	: $(cnt).offset().left + 'px', 
									'top'	: ($(cnt).offset().top + w2utils.getSize(cnt, 'height') -1) + 'px',
									'height': '20px'
								})
								.data('field', cnt)
								.data('mousein', 0)
								.on('mouseover', function() {
									$('#w2ui-global-items').data('mousein', 1);
								 })
								.on('mouseout', function() { 	
									$('#w2ui-global-items').data('mousein', 0);
									cnt.hideItems();
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
						};					
						this.hideItems = function (delay) {
							if (String(delay) == 'undefined') delay = 300;
							if (delay == 0) $('#w2ui-global-items').hide();
							setTimeout(function() {
								if ($('#w2ui-global-items').data('field') != cnt) {
									$(cnt).removeClass('w2ui-tb-down');
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
							w2field.list_findItems.call(cnt);
						};
						this.getItems = function () {
							w2field.list_getItems.call(cnt);
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
				$(el).val(event.target.getAttribute('value'));
				el.hideItems(0);
				$(el).trigger('change');
				$(el).trigger('blur');
			});
			if (i > 0) this.showItems(); else this.hideItems(0);
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