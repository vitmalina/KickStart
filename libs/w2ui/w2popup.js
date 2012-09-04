/************************************************************************
*   Library: Web 2.0 UI for jQuery (using prototypical inheritance)
*   - Following objects defined
* 		- w2popup 	- tree widget
*		- $.w2popup	- jQuery wrapper
*   - Dependencies: jQuery, w2utils
* 
************************************************************************/

(function () {

	// ====================================================
	// -- Registers as a jQuery plugin
	
	$.fn.w2popup = function(method, options) {	
		if (typeof method  == 'undefined') {
			options = {};
			method  = 'open';
		}
		if ($.isPlainObject(method)) {
			options = method;		
			method  = 'open';
		}
		if (typeof options == 'undefined') options = {};
		// load options from markup
		var dlgOptions = {};
		if ($(this).length > 0 ) {
			if ($(this).find('div[rel=title]').length > 0) 		dlgOptions['title'] 	= $(this).find('div[rel=title]').html();
			if ($(this).find('div[rel=body]').length > 0) 		dlgOptions['body'] 		= $(this).find('div[rel=body]').html();
			if ($(this).find('div[rel=buttons]').length > 0) 	dlgOptions['buttons'] 	= $(this).find('div[rel=buttons]').html();
			if (parseInt($(this).css('width')) != 0)  dlgOptions['width']  = parseInt($(this).css('width'));
			if (parseInt($(this).css('height')) != 0) dlgOptions['height'] = parseInt($(this).css('height'));
			if (String($(this).css('overflow')) != 'undefined') dlgOptions['overflow'] = $(this).css('overflow');
			}
		// show popup
		window.w2popup[method]($.extend({}, dlgOptions, options));
	};
	
	// ====================================================
	// -- Implementation of core functionality
	
	window.w2popup = {	
		defaults: {
			title			: '',
			body			: '',
			buttons			: '',
			overflow		: 'auto',
			color			: '#000',
			opacity			: 0.4,
			speed			: 0.3,
			modal			: false,
			width			: 500,
			height			: 300,
			showClose		: true,
			showMax			: false,
			transition		: null,
			onUnlock		: null,
			onOpen			: null,
			onChange		: null, 
			onBeforeClose	: null,
			onClose			: null,
			onMax			: null
		},
		
		open: function (options) {
			// get old options and merge them
			var old_options = $('#w2ui-screenPopup').data('options');
			var options = $.extend({}, this.defaults, {
				body: '',
				renderTime: 0,
				onOpen: null,
				onChange: null,
				onBeforeClose: null,
				onClose: null
			}, old_options, options);
	
			if (window.innerHeight == undefined) {
				var width  = document.documentElement.offsetWidth;
				var height = document.documentElement.offsetHeight;
				if (w2utils.engine == 'IE7') { width += 21; height += 4; }
			} else {
				var width  = window.innerWidth;
				var height = window.innerHeight;
			}
			if (parseInt(width)  - 10 < parseInt(options.width))  options.width  = parseInt(width)  - 10;
			if (parseInt(height) - 10 < parseInt(options.height)) options.height = parseInt(height) - 10;
			var top  = ((parseInt(height) - parseInt(options.height)) / 2) * 0.8;
			var left = (parseInt(width) - parseInt(options.width)) / 2;
			
			// check if message is already displayed
			if ($('#w2ui-screenPopup').length == 0) {
				// output message
				window.w2popup.lock($.extend({}, options, {
					onMouseDown: options.modal ? function () {
						$('#w2ui-screenLock').css({ 
							'-webkit-transition': '.1s', 
							'-moz-transition': '.1s', 
							'-ms-transition': '.1s', 
							'-o-transition': '.1s', 
							'opacity': '0.6',
						});			
						if (window.getSelection) window.getSelection().removeAllRanges();
					} : null,
					onMouseUp: options.modal ? function () {
						setTimeout(function () {
							$('#w2ui-screenLock').css({ 
								'-webkit-transition': '.1s', 
								'-moz-transition': '.1s', 
								'-ms-transition': '.1s', 
								'-o-transition': '.1s', 
								'opacity': options.opacity,
							});
						}, 100);
						if (window.getSelection) window.getSelection().removeAllRanges();
					} : function () { 
						$().w2popup('close'); 
					}
				}));
			
				var msg = '<div id="w2ui-screenPopup" class="w2ui-message" style="position: '+(w2utils.engine == 'IE5' ? 'absolute' : 'fixed')+';'+
								'z-Index: 1001; width: '+ parseInt(options.width) +'px; height: '+ parseInt(options.height) +'px; opacity: 0; '+
								'-webkit-transform: scale(0.8); -moz-transform: scale(0.8); -ms-transform: scale(0.8); -o-transform: scale(0.8); '+
								'left: '+ left +'px; top: '+ top +'px;">';
				if (options.title != '') { 
					msg +='<div class="w2ui-msg-title">'+
						  (options.showClose ? '<div class="w2ui-msg-button w2ui-msg-close" onclick="$().w2popup(\'close\')">Close</div>' : '')+ 
						  (options.showMax ? '<div class="w2ui-msg-button w2ui-msg-max" onclick="$().w2popup(\'max\')">Max</div>' : '') + 
							  options.title +
						  '</div>'; 
				}
				msg += '<div class="w2ui-box1" style="'+(options.title == '' ? 'top: 0px !important;' : '')+(options.buttons == '' ? 'bottom: 0px !important;' : '')+'">';
				msg += '<div class="w2ui-msg-body'+ (!options.title != '' ? ' w2ui-msg-no-title' : '') + (!options.buttons != '' ? ' w2ui-msg-no-buttons' : '') +'" style="overflow: '+ options.overflow +'">'+ options.body +'</div>';
				msg += '</div>';
				msg += '<div class="w2ui-box2" style="'+(options.title == '' ? 'top: 0px !important;' : '')+(options.buttons == '' ? 'bottom: 0px !important;' : '')+'">';
				msg += '<div class="w2ui-msg-body'+ (!options.title != '' ? ' w2ui-msg-no-title' : '') + (!options.buttons != '' ? ' w2ui-msg-no-buttons' : '') +'" style="overflow: '+ options.overflow +'"></div>';
				msg += '</div>';
				if (options.buttons != '') { 
					msg += '<div class="w2ui-msg-buttons">'+ options.buttons +'</div>'; 
				}
				msg += '</div>';
				$('body').append(msg);
				// allow element to render
				setTimeout(function () {
					$('#w2ui-screenPopup .w2ui-box2').hide();
					$('#w2ui-screenPopup').css({ 
						'-webkit-transition': options.speed +'s opacity, '+ options.speed +'s -webkit-transform', 
						'-webkit-transform': 'scale(1)',
						'-moz-transition': options.speed +'s opacity, '+ options.speed +'s -moz-transform', 
						'-moz-transform': 'scale(1)',
						'-ms-transition': options.speed +'s opacity, '+ options.speed +'s -ms-transform', 
						'-ms-transform': 'scale(1)',
						'-o-transition': options.speed +'s opacity, '+ options.speed +'s -o-transform', 
						'-o-transform': 'scale(1)',
						'opacity': '1'
					});
				}, 1);
				// clean transform
				setTimeout(function () {
					$('#w2ui-screenPopup').css({
						'-webkit-transform': '',
						'-moz-transform': '',
						'-ms-transform': '',
						'-o-transform': ''
					});
					if (typeof options.onOpen == 'function') { setTimeout(function () { options.onOpen(); }, 1); }
				}, options.speed * 1000);
			} else {
				// check if size changed
				if (typeof old_options == 'undefined' || old_options['width'] != options['width'] || old_options['height'] != options['height']) {
					$('#w2ui-screenPanel').remove();
					window.w2popup.resize(options.width, options.height);
				}
				// show new items
				$('#w2ui-screenPopup .w2ui-box2 > .w2ui-msg-body').html(options.body).css('overflow', options.overflow);
				$('#w2ui-screenPopup .w2ui-msg-buttons').html(options.buttons);
				$('#w2ui-screenPopup .w2ui-msg-title').html(
					  (options.showClose ? '<div class="w2ui-msg-button w2ui-msg-close" onclick="$().w2popup(\'close\')">Close</div>' : '')+ 
					  (options.showMax ? '<div class="w2ui-msg-button w2ui-msg-max" onclick="$().w2popup(\'max\')">Max</div>' : '') + 
					  options.title);
				// transition
				var div_old = $('#w2ui-screenPopup .w2ui-box1')[0];
				var div_new = $('#w2ui-screenPopup .w2ui-box2')[0];
				w2utils.transition(div_old, div_new, options.transition);
				div_new.className = 'w2ui-box1';
				div_old.className = 'w2ui-box2';	
				$(div_new).addClass('w2ui-current-box');		
				// remove max state
				$('#w2ui-screenPopup').data('prev-size', null);
				// call event onChange
				setTimeout(function () {
					if (typeof options.onChange == 'function') options.onChange();
				}, 1);
			}		
			// save new options
			$('#w2ui-screenPopup').data('options', options);	
			
			this.initMove();			
			return this;		
		},
		
		close: function (options) {
			var options = $.extend({}, $('#w2ui-screenPopup').data('options'), options);
			if (typeof options.onBeforeClose == 'function') {
				if (options.onBeforeClose() === false) return;
			}
			$('#w2ui-screenPopup, #w2ui-screenPanel').css({ 
				'-webkit-transition': options.speed +'s opacity, '+ options.speed +'s -webkit-transform', 
				'-webkit-transform': 'scale(0.9)',
				'-moz-transition': options.speed +'s opacity, '+ options.speed +'s -moz-transform', 
				'-moz-transform': 'scale(0.9)',
				'-ms-transition': options.speed +'s opacity, '+ options.speed +'s -ms-transform', 
				'-ms-transform': 'scale(0.9)',
				'-o-transition': options.speed +'s opacity, '+ options.speed +'s -o-transform', 
				'-o-transform': 'scale(0.9)',
				'opacity': '0'
			});		
			window.w2popup.unlock({
				opacity: 0,
				onFinish: options.onFinish ? options.onFinish : null			
			});
			setTimeout(function () {
				$('#w2ui-screenPopup').remove();
				$('#w2ui-screenPanel').remove();
			}, options.speed * 1000);				
			if (typeof options.onClose == 'function') {
				options.onClose();
			}
		},
		
		lock: function (options) {
			if ($('#w2ui-screenLock').length > 0) return false;
			var options = $.extend({}, { 'onUnlock': null, 'onMouseDown': null, 'onMouseUp': null }, options);
			// show element
			$('body').append('<div id="w2ui-screenLock" style="position: '+(w2utils.engine == 'IE5' ? 'absolute' : 'fixed')+'; padding: 0px; margin: 0px;'+
				'z-Index: 1000; left: 0px; top: 0px; background-color: '+ options.color +'; width: 100%; height: 100%; opacity: 0;"></div>');	
			// lock screen
			setTimeout(function () {
				$('#w2ui-screenLock').css({ 
					'-webkit-transition': options.speed +'s opacity', 
					'-moz-transition': options.speed +'s opacity', 
					'-ms-transition': options.speed +'s opacity', 
					'-o-transition': options.speed +'s opacity', 
					'opacity': options.opacity 
				});
				$('body, body *').css({
					//'text-shadow': '0px 0px 5px rgb(0,0,0)',
					//'color': 'transparent'
				});	
			}, 1);
			$('body').data('_old_overflow', $('body').css('overflow')).css({ 'overflow': 'hidden' });		
			// lock events
			if (typeof options.onMouseDown == 'function') { 
				$('#w2ui-screenLock').bind('mousedown', options.onMouseDown); 
			}
			if (typeof options.onMouseUp == 'function') { 
				$('#w2ui-screenLock').bind('mouseup', options.onMouseUp); 
			}
			return true;
		},
		
		unlock: function (options) {
			if ($('#w2ui-screenLock').length == 0) return false;	
			var options = $.extend({}, $('#w2ui-screenPopup').data('options'), options);		
			$('#w2ui-screenLock').css({ 
				'-webkit-transition': options.speed +'s opacity', 
				'-moz-transition': options.speed +'s opacity', 
				'-ms-transition': options.speed +'s opacity', 
				'-o-transition': options.speed +'s opacity', 
				'opacity': options.opacity 
			});
			$('body, body *').css({
				//'text-shadow': '',
				//'color': ''
			});
			$('body').css({ 'overflow': $('body').data('_old_overflow') });		
			setTimeout(function () { 
				$('#w2ui-screenLock').remove(); 
				if (typeof options.onUnlock == 'function') {  options.onUnlock(); }
			}, options.speed * 1000); 
			return true;
		},
	
		max: function () {
			var options = $('#w2ui-screenPopup').data('options');
			// if panel is out - remove it
			$('#w2ui-screenPanel').remove();
			// resize
			if ($('#w2ui-screenPopup').data('prev-size')) {
				var size = String($('#w2ui-screenPopup').data('prev-size')).split(':');
				$('#w2ui-screenPopup').data('prev-size', null);
				window.w2popup.resize(size[0], size[1], function () {
					if (typeof options.onMax == 'function') options.onMax();
				});
			} else {
				$('#w2ui-screenPopup').data('prev-size', $('#w2ui-screenPopup').css('width')+':'+$('#w2ui-screenPopup').css('height'));
				window.w2popup.resize(10000, 10000, function () {
					if (typeof options.onMax == 'function') options.onMax();
				});
			}
		},
		
		set: function (options) {
			$('#w2ui-screenPopup').data('options', $.extend({}, $('#w2ui-screenPopup').data('options'), options));
		},
		
		get: function () {
			return $('#w2ui-screenPopup').data('options');
		},
		
		clear: function() {
			$('#w2ui-screenPopup .w2ui-msg-title').html('');
			$('#w2ui-screenPopup .w2ui-msg-body').html('');
			$('#w2ui-screenPopup .w2ui-msg-buttons').html('');
		},
		
		resize: function (width, height, callBack) {
			var options = $('#w2ui-screenPopup').data('options');
			// calculate new position
			if (parseInt($(window).width())  - 10 < parseInt(width))  width  = parseInt($(window).width())  - 10;
			if (parseInt($(window).height()) - 10 < parseInt(height)) height = parseInt($(window).height()) - 10;
			var top  = ((parseInt($(window).height()) - parseInt(height)) / 2) * 0.8;
			var left = (parseInt($(window).width()) - parseInt(width)) / 2;		
			// resize there
			$('#w2ui-screenPopup').css({
				'-webkit-transition': options.speed + 's width, '+ options.speed + 's height, '+ options.speed + 's left, '+ options.speed + 's top',
				'-moz-transition': options.speed + 's width, '+ options.speed + 's height, '+ options.speed + 's left, '+ options.speed + 's top',
				'-ms-transition': options.speed + 's width, '+ options.speed + 's height, '+ options.speed + 's left, '+ options.speed + 's top',
				'-o-transition': options.speed + 's width, '+ options.speed + 's height, '+ options.speed + 's left, '+ options.speed + 's top',
				'top': top,
				'left': left,
				'width': width,
				'height': height
			});
			if (typeof callBack == 'function') {
				setTimeout(function () {
					callBack();
				}, options.speed * 1000);
			}
		},
		
		load: function (options) {
			if (String(options.url) == 'undefined') {
				$.error('The url parameter is empty.');
				return;
			}
			var tmp = String(options.url).split('#');
			var url = tmp[0];
			var selector = tmp[1];
			if (String(options) == 'undefined') options = {};
			// load url
			var html = $('#w2ui-screenPopup').data(url);
			if (typeof html != 'undefined') {
				popup(html, selector);
			} else {
				$.post(url, function (data, status, obj) {
					popup(obj.responseText, selector);
					$('#w2ui-screenPopup').data(url, obj.responseText); // remember for possible future purposes
				});
			}
			function popup(html, selector) {
				$('body').append('<div id="w2ui-tmp" style="display: none">'+ html +'</div>');
				if (typeof selector != 'undefined' && $('#w2ui-tmp #'+selector).length > 0) {
					$('#w2ui-tmp #'+ selector).w2popup(options);
				} else {
					$('#w2ui-tmp div:first-child').w2popup(options);
				}
				$('#w2ui-tmp').remove();
			}
		},
		
		panel: function (options) {
			// if popup is not open
			if ($('#w2ui-screenPopup').length == 0 || !$.isPlainObject(options)) {
				$.error('Popup is not currently open OR options parameter is not defined.');
				return;
			}
			if (typeof options.type == 'undefined') options.type = 'left';
			
			// if panel is already open
			if ($('#w2ui-screenPanel').length != 0) {
				var options = $('#w2ui-screenPanel').data('options');
				var popup = $('#w2ui-screenPopup');
				var pos = {
					top: 	popup.position().top,
					left: 	popup.position().left,
					width: 	popup.width(),
					height: popup.height()
				}
				// ===== Close panel
				$('#w2ui-screenPanel').css({
					'left' : (parseInt($('#w2ui-screenPanel').css('left')) - $('#w2ui-screenPanel').data('div_x')) + 'px',
					'-webkit-transition': '.2s',
					'-moz-transition': '.2s',
					'-ms-transition': '.2s',
					'-o-transition': '.2s',
					'-webkit-transform':  'translate3d(0px, 0px, 0px)',
					'-moz-transform':  'translate(0px, 0px)',
					'-ms-transform':  'translate(0px, 0px)',
					'-o-transform':  'translate(0px, 0px)'
				});
				setTimeout(function () {
					var pwidth = popup.data('options').width;
					if (window.innerHeight == undefined) {
						var width  = document.documentElement.offsetWidth;
						var height = document.documentElement.offsetHeight;
						if (w2utils.engine == 'IE7') { width += 21; height += 4; }
					} else {
						var width  = window.innerWidth;
						var height = window.innerHeight;
					}
					// remove from screen
					$('#w2ui-screenPanel').remove();
					// callback if any
					setTimeout(function () { 
						if (typeof options.onClose == 'function') options.onClose(); 
					}, 250);
				}, 250);
				return;
			}
			
			// ====== Open the panel
			var options = $.extend({}, {
				onOpen: null,
				onClose: null,
				type: 'right',
				width: 200
			}, options);
			var popup = $('#w2ui-screenPopup');
			var pos = {
				top: 	popup.position().top,
				left: 	popup.position().left,
				width: 	popup.width(),
				height: popup.height()
			}
			// do not open in max state
			if (popup.data('prev-size')) return;
			popup.before('<div id="w2ui-screenPanel" class="w2ui-message-panel" style="position: '+ (w2utils.engine == 'IE5' ? 'absolute' : 'fixed') +'; z-index: 1001; '+
							(options.type == 'right' ? "border-top-left-radius: 0px; border-bottom-left-radius: 0px;" : "border-top-right-radius: 0px; border-bottom-right-radius: 0px;") +
						' 	top: '+ (pos.top + 15) +'px; '+
						'	left: '+ (options.type == 'right' ? (pos.left + pos.width - parseInt(options.width)) : (pos.left + 2) ) + 'px;' +
						'	height: '+ (pos.height - 25) +'px; width: '+ parseInt(options.width) +'px;">'+ options.body +'</div>');
			setTimeout(function () {
				$('#w2ui-screenPanel').css({
					'-webkit-transition': '.2s',
					'-moz-transition': '.2s',
					'-ms-transition': '.2s',
					'-o-transition': '.2s',
					'-webkit-transform': (options.type == 'right' ? 
										 'translate3d(' + (options.width - 1) + 'px, 0px, 0px)' : 
										 'translate3d(-'+ (parseInt(options.width) + 1) + 'px, 0px, 0px)'),
					'-moz-transform': (options.type == 'right' ? 
										 'translate(' + (options.width - 1) + 'px, 0px)' : 
										 'translate(-'+ (parseInt(options.width) + 1) + 'px, 0px)'),
					'-ms-transform': (options.type == 'right' ? 
										 'translate(' + (options.width - 1) + 'px, 0px)' : 
										 'translate(-'+ (parseInt(options.width) + 1) + 'px, 0px)'),
					'-o-transform': (options.type == 'right' ? 
										 'translate(' + (options.width - 1) + 'px, 0px)' : 
										 'translate(-'+ (parseInt(options.width) + 1) + 'px, 0px)')
				}).data('options', options);
			}, 1);
			// callback if any
			setTimeout(function () { 
				if (typeof options.onOpen == 'function') options.onOpen(); 					
				var div_x = String($('#w2ui-screenPanel').css('-webkit-transform')).split(',')[4];
				if (typeof div_x == 'undefined') div_x = String($('#w2ui-screenPanel').css('-moz-transform')).split(',')[4];
				if (typeof div_x == 'undefined') div_x = String($('#w2ui-screenPanel').css('-ms-transform')).split(',')[4];
				if (typeof div_x == 'undefined') div_x = String($('#w2ui-screenPanel').css('-o-transform')).split(',')[4];
				$('#w2ui-screenPanel').css({
					'-webkit-transition': 'none',
					'-webkit-transform' : 'translate3d(0px, 0px, 0px)',
					'-moz-transition': 'none',
					'-moz-transform' : 'translate(0px, 0px)',
					'-ms-transition': 'none',
					'-ms-transform' : 'translate(0px, 0px)',
					'-o-transition': 'none',
					'-o-transform' : 'translate(0px, 0px)',
					'left' : (parseInt($('#w2ui-screenPanel').css('left')) + parseInt(div_x)) + 'px'
				}).data('div_x', div_x);
			}, 250);
		},
		
		// --- INTERNAL FUNCTIONS
		
		initMove: function () {
			var obj = this;
			$('#w2ui-screenPopup .w2ui-msg-title')
				.on('mousedown', function () { obj.startMove.apply(obj, arguments); })
				.on('mousemove', function () { obj.doMove.apply(obj, arguments); })
				.on('mouseup',   function () { obj.stopMove.apply(obj, arguments); });
			$('#w2ui-screenPopup .w2ui-msg-body')
				.on('mousemove', function () { obj.doMove.apply(obj, arguments); })
				.on('mouseup',   function () { obj.stopMove.apply(obj, arguments); });
			$('#w2ui-screenLock')
				.on('mousemove', function () { obj.doMove.apply(obj, arguments); })
				.on('mouseup',   function () { obj.stopMove.apply(obj, arguments); });
		},
	
		startMove: function (evnt) {
			if (!evnt) evnt = window.event;
			if (!window.addEventListener) { window.document.attachEvent('onselectstart', function() { return false; } ); }
			this.resizing = true;
			this.tmp_x = evnt.screenX;
			this.tmp_y = evnt.screenY;
			evnt.stopPropagation();
			evnt.preventDefault();
		},
		
		doMove: function (evnt) {
			if (this.resizing != true) return;
			if (!evnt) evnt = window.event;
			this.tmp_div_x = (evnt.screenX - this.tmp_x); 
			this.tmp_div_y = (evnt.screenY - this.tmp_y); 
			$('#w2ui-screenPopup').css({
				'-webkit-transition': 'none',
				'-webkit-transform': 'translate3d('+ this.tmp_div_x +'px, '+ this.tmp_div_y +'px, 0px)',
				'-moz-transition': 'none',
				'-moz-transform': 'translate('+ this.tmp_div_x +'px, '+ this.tmp_div_y +'px)',
				'-ms-transition': 'none',
				'-ms-transform': 'translate('+ this.tmp_div_x +'px, '+ this.tmp_div_y +'px)',
				'-o-transition': 'none',
				'-o-transform': 'translate('+ this.tmp_div_x +'px, '+ this.tmp_div_y +'px)'
			});
			$('#w2ui-screenPanel').css({
				'-webkit-transition': 'none',
				'-webkit-transform': 'translate3d('+ this.tmp_div_x +'px, '+ this.tmp_div_y +'px, 0px)',
				'-moz-transition': 'none',
				'-moz-transform': 'translate('+ this.tmp_div_x +'px, '+ this.tmp_div_y +'px)',
				'-ms-transition': 'none',
				'-ms-transform': 'translate('+ this.tmp_div_x +'px, '+ this.tmp_div_y +'px',
				'-o-transition': 'none',
				'-o-transform': 'translate('+ this.tmp_div_x +'px, '+ this.tmp_div_y +'px)'
			});
		},
	
		stopMove: function (evnt) {
			if (this.resizing != true) return;
			if (!evnt) evnt = window.event;
			this.tmp_div_x = (evnt.screenX - this.tmp_x); 
			this.tmp_div_y = (evnt.screenY - this.tmp_y); 			
			$('#w2ui-screenPopup').css({
				'-webkit-transition': 'none',
				'-webkit-transform': 'translate3d(0px, 0px, 0px)',
				'-moz-transition': 'none',
				'-moz-transform': 'translate(0px, 0px)',
				'-ms-transition': 'none',
				'-ms-transform': 'translate(0px, 0px)',
				'-o-transition': 'none',
				'-o-transform': 'translate(0px, 0px)',
				'left': (parseInt($('#w2ui-screenPopup').css('left')) + parseInt(this.tmp_div_x)) + 'px',
				'top':	(parseInt($('#w2ui-screenPopup').css('top'))  + parseInt(this.tmp_div_y)) + 'px'
			});
			$('#w2ui-screenPanel').css({
				'-webkit-transition': 'none',
				'-webkit-transform': 'translate3d(0px, 0px, 0px)',
				'-moz-transition': 'none',
				'-moz-transform': 'translate(0px, 0px)',
				'-ms-transition': 'none',
				'-ms-transform': 'translate(0px, 0px)',
				'-o-transition': 'none',
				'-o-transform': 'translate(0px, 0px)',
				'left': (parseInt($('#w2ui-screenPanel').css('left')) + parseInt(this.tmp_div_x)) + 'px',
				'top':	(parseInt($('#w2ui-screenPanel').css('top'))  + parseInt(this.tmp_div_y)) + 'px'
			});
			delete this.resizing;
		}		
	}
	
})();