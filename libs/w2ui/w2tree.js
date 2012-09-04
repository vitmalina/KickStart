/************************************************************************
*   Library: Web 2.0 UI for jQuery (using prototypical inheritance)
*   - Following objects defined
* 		- w2tree 	- tree widget
*		- $.w2tree	- jQuery wrapper
*   - Dependencies: jQuery, w2utils
* 
************************************************************************/

(function () {
	var w2tree = function (options) {
		this.name			= null;
		this.box 			= null;
		this.tree 			= null;
		this.parent 		= null;
		this.img 			= null;
		this.style	 		= '';
		this.selected 		= null;	// current selected node (readonly)
		this.nodes	 		= []; 	// Tree Child Nodes
		this.onClick		= null;	// Fire when user click on Node Text
		this.onDblClick		= null;	// Fire when user dbl clicks
		this.onContextMenu	= null;	
		this.onOpen			= null;	// Fire when node Expands
		this.onClose		= null;	// Fire when node Colapses
		this.onRefresh		= null;
		this.onResize 		= null;
		this.onRender 		= null;
		this.onDestroy	 	= null;
	
		$.extend(true, this, options);
	}
	
	// ====================================================
	// -- Registers as a jQuery plugin
	
	$.fn.w2tree = function(method) {
		if (typeof method === 'object' || !method ) {
			// check required parameters
			if (!method || typeof method.name == 'undefined') {
				$.error('The parameter "name" is required but not supplied in $().w2tree().');
				return;
			}
			if (typeof w2ui[method.name] != 'undefined') {
				$.error('The parameter "name" is not unique. There are other objects already created with the same name (obj: '+ method.name +').');
				return;			
			}
			// extend items
			var nodes  = method.nodes;
			var object = new w2tree(method); 
			$.extend(object, { handlers: [], nodes: [] });
			if (typeof nodes != 'undefined') {
				object.add(object, nodes); 
			}
			if ($(this).length != 0) {
				$(this).data('w2name', object.name);
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
			$.error( 'Method ' +  method + ' does not exist on jQuery.w2tree' );
		}    
	};
	
	// ====================================================
	// -- Implementation of core functionality
	
	w2tree.prototype = {
		node: {
			id	 			: null,
			text	   		: '',
			count			: '',
			img 			: null,
			parent	 		: null,		// node object
			tree 			: null,
			nodes	  		: [],
			style 			: '',
			selected 		: false,
			expanded 		: false,
			hidden			: false,
			group			: false, 	// if true, it will build as a group
			// events
			onClick			: null,
			onDblClick		: null,
			onContextMenu	: null,
			onOpen			: null,
			onClose			: null,
			
			// some functions
			add: function (options) {
				return this.tree.add(this, options);		
			},
			insert: function (id, options) {
				return this.tree.insert(this, id, options);		
			},
			remove: function (id) {
				return this.tree.remove(this, id);
			}
		},
		
		add: function (parent, options) {
			// append to the end
			return this.insert(parent, null, options);
		},
		
		insert: function (parent, id, options) {
			if (!$.isArray(options)) options = [options];
			for (var o in options) {
				if (typeof options[o].id == 'undefined') { 
					$.error('Cannot insert node "'+ options[o].text +'" because it has no id.'); 
					continue;
				}
				if (this.get(this, options[o].id) != null) { 
					$.error('Cannot insert node with id='+ options[o].id +' (text: '+ options[o].text + ') because another node with the same id already exists.'); 
					continue;
				}
				var tmp = $.extend({}, w2tree.prototype.node, options[o]);
				tmp.tree   = this;
				tmp.parent = parent;
				var nd = tmp.nodes;
				tmp.nodes  = []; // very important to re-init empty nodes array
				if (id == null) { // append to the end
					parent.nodes.push(tmp);	
				} else {
					var ind = this.getIndex(p, id);
					if (ind == null) {
						$.error('Cannot insert node "'+ options[o].text +'" because cannot find node "'+ id +'" to insert before.'); 
						return null; 
					}
					parent.nodes.splice(ind, 0, tmp);
				}
				if (typeof nd != 'undefined' && nd.length > 0) { this.insert(tmp, null, nd); }
			}
			return tmp;
		},
		
		remove: function (parent, id) { // can be just called remove(id)
			if (typeof id == 'undefined') {
				id = parent;
				parent = this;
			}
			var tmp = this.get(parent, id);
			if (tmp == null) return false;
			var ind  = this.getIndex(tmp.parent, id);
			if (ind == null) return false;
			tmp.parent.nodes.splice(ind, 1);
			return true;
		},
		
		set: function (parent, id, options) { // can be just called get(id)
			if (typeof options == 'undefined') {
				options = id;
				id 		= parent;
				parent 	= this;
			}
			// searches all nested nodes
			this._tmp = null;
			if (parent.nodes == null) return null;
			for (var i=0; i < parent.nodes.length; i++) {
				if (parent.nodes[i].id == id) {
					// make sure nodes inserted correctly
					var nodes  = options.nodes;
					$.extend(parent.nodes[i], options, { nodes: [] });
					if (typeof nodes != 'undefined') {
						this.add(parent.nodes[i], nodes); 
					}					
					this.refresh(id);
					return true;
				} else {
					this._tmp = this.set(parent.nodes[i], id, options);
					if (this._tmp) return true;
				}
			}
			return false;
		},
		
		get: function (parent, id) { // can be just called get(id)
			if (typeof id == 'undefined') {
				id = parent;
				parent = this;
			}
			// searches all nested nodes
			this._tmp = null;
			if (parent.nodes == null) return null;
			for (var i=0; i < parent.nodes.length; i++) {
				if (parent.nodes[i].id == id) {
					return parent.nodes[i];
				} else {
					this._tmp = this.get(parent.nodes[i], id);
					if (this._tmp) return this._tmp;
				}
			}
			return this._tmp;
		},
		
		getIndex: function (parent, id) { 
			// only searches direct descendands
			for (var i=0; i < parent.nodes.length; i++) {
				if (parent.nodes[i].id == id) {
					return i;
				}
			}
			return null;
		},
	
		select: function (id) {
			if (this.selected == id) return false;
			this.unselect(this.selected);
			var new_node = this.get(id);
			if (!new_node) return false;
			$('#tree_'+ this.name +' #node_'+id.replace(/\./, '\\.')).addClass('w2ui-selected');
			new_node.selected = true;
			this.selected = id;
		},
		
		unselect: function (id) {
			var current = this.get(id);
			if (!current) return false;
			current.selected = false;
			$('#tree_'+ this.name +' #node_'+id.replace(/\./, '\\.')).removeClass('w2ui-selected');
			if (this.selected == id) this.selected = null;
			return true;
		},
		
		doClick: function (id, event) {
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'click', target: id, event: event });	
			if (eventData.stop === true) return false;
			// default action
			var obj = this;
			$('#tree_'+ this.name +' .w2ui-node').each(function (index, field) {
				var nid = String(field.id).replace('node_', '');
				var nd  = obj.get(nid);
				if (nd && nd.selected) {
					nd.selected = false;
					$(field).removeClass('w2ui-selected');
				}
			});
			$('#tree_'+ this.name +' #node_'+id.replace(/\./, '\\.')).addClass('w2ui-selected');
			this.get(id).selected = true;
			this.selected = id;
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
	
		doDblClick: function (id, event) {
			if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection 
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'dblClick', target: id, event: event });	
			if (eventData.stop === true) return false;
			// default action
			var nd = this.get(id);
			if (nd.nodes.length > 0) this.doToggle(id, event);
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
	
		doContextMenu: function (id, event) {
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'contextMenu', target: id, event: event });	
			if (eventData.stop === true) return false;
			
			// default action
			// -- no actions
			
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
		
		doToggle: function(id, event) {
			if (this.get(id).expanded) this.doClose(id, event); else this.doOpen(id, event);
		},
	
		doOpen: function (id, event) {
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'open', target: id, event: event });	
			if (eventData.stop === true) return false;
			// default action
			var nd = this.get(id);
			if (nd.nodes.length == 0) return;
			// expand
			$('#tree_'+ this.name +' #node_'+ id.replace(/\./, '\\.') +'_sub').show();
			$('#tree_'+ this.name +' #node_'+ id.replace(/\./, '\\.') +' .w2ui-node-dots:first-child').html('-');
			nd.expanded = true;
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
		
		doClose: function (id, event) {
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'close', target: id, event: event });	
			if (eventData.stop === true) return false;
			// default action
			$('#tree_'+ this.name +' #node_'+ id.replace(/\./, '\\.') +'_sub').hide();		
			$('#tree_'+ this.name +' #node_'+ id.replace(/\./, '\\.') +' .w2ui-node-dots:first-child').html('+');
			this.get(id).expanded = false;
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
		
		render: function (box) {
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'render', target: this.name, box: box });	
			if (eventData.stop === true) return false;
			// default action
			if (typeof box != 'undefined' && box != null) { 
				$(this.box).html(''); 
				this.box = box;
			}
			if (!this.box) return;
			$(this.box).html('<div id="tree_'+ this.name +'" class="w2ui-tree" style="'+ this.style +'"></div>');
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
			// ---
			this.refresh();
		},
		
		refresh: function (id) {
			if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection 
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'refresh', target: (typeof id != 'undefined' ? id : this.name) });	
			if (eventData.stop === true) return false;
			// default action
			var obj = this;
			if (typeof id == 'undefined') {
				var node = this;
				var nm 	 = '#tree_'+ this.name;
			} else {
				var node = this.get(id);
				var nm 	 = '#tree_'+ this.name +' #node_'+ node.id.replace(/\./, '\\.') + '_sub';
			}
			if (node != this) {
				var tmp = '#tree_'+ this.name +' #node_'+ node.id.replace(/\./, '\\.');
				var nodeHTML = getNodeHTML(node);
				$(tmp).before('<div id="tree_'+ this.name + '_tmp"></div>');
				$(tmp).remove();
				$(nm).remove();
				$('#tree_'+ this.name + '_tmp').before(nodeHTML);
				$('#tree_'+ this.name + '_tmp').remove();
			}
			// refresh sub nodes
			$(nm).html('');
			for (var i=0; i < node.nodes.length; i++) {
				var nodeHTML = getNodeHTML(node.nodes[i]);
				$(nm).append(nodeHTML);
				if (node.nodes[i].nodes.length != 0) { this.refresh(node.nodes[i].id); }
			}
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
			
			function getNodeHTML(nd) {
				var html = '';
				var img  = nd.img;
				if (typeof img == 'undefined') img = this.img;
				// -- find out level
				var tmp   = nd.parent;
				var level = 0;
				while (tmp && tmp.parent != null) {
					if (tmp.group) level--;
					tmp = tmp.parent;
					level++;
				}	
				if (nd.group) {
					html = 
						'<div class="w2ui-node-group"  id="node_'+ nd.id +'"'+
						'		onclick="w2ui[\''+ obj.name +'\'].doDblClick(\''+ nd.id +'\', event); /* event.stopPropagation(); */'+
						'				 var sp=$(this).find(\'span:nth-child(1)\'); if (sp.html() == \'Hide\') sp.html(\'Show\'); else sp.html(\'Hide\');"'+
						'		onmouseout="$(this).find(\'span:nth-child(1)\').css(\'color\', \'transparent\')" '+
						'		onmouseover="$(this).find(\'span:nth-child(1)\').css(\'color\', \'gray\')">'+
						'	<span style="float: right; color: transparent">Hide</span>'+
						'	<span>'+ nd.text +'</span>'+
						'</div>'+
						'<div class="w2ui-node-sub" id="node_'+ nd.id +'_sub" style="'+ nd.style +';'+ (!nd.hidden && nd.expanded ? '' : 'display: none;') +'"></div>';
				} else {
					if (nd.selected) obj.selected = nd.id;
					html = 
					'<div class="w2ui-node '+ (nd.selected ? 'w2ui-selected' : '') +'" id="node_'+ nd.id +'" style="'+ (nd.hidden ? 'display: none;' : '') +'"'+
						'	ondblclick="w2ui[\''+ obj.name +'\'].doDblClick(\''+ nd.id +'\', event); /* event.stopPropagation(); */"'+
						'	oncontextmenu="w2ui[\''+ obj.name +'\'].doContextMenu(\''+ nd.id +'\', event); /* event.stopPropagation(); */ event.preventDefault();"'+
						'	onClick="w2ui[\''+ obj.name +'\'].doClick(\''+ nd.id +'\', event); /* event.stopPropagation(); */">'+
						'<div class="w2ui-node-count" style="width: auto; padding: 2px 5px; float: right">'+ (typeof nd.count != 'undefined' && nd.count != null ? nd.count : '') +'</div>'+
						'<table cellpadding="0" cellspacing="0" style="margin-left:'+ (level*18) +'px"><tr>'+
						'<td class="w2ui-node-dots" nowrap onclick="w2ui[\''+ obj.name +'\'].doToggle(\''+ nd.id +'\', event);">'+ 
							(nd.nodes.length > 0 ? (nd.expanded ? '-' : '+') : '') +
						'</td>'+
						'<td class="w2ui-node-data" nowrap>'+ 
							(typeof img != 'undefined' && img != null ? '<div class="w2ui-node-image w2ui-icon '+ img +'" style="float: left"></div>' : '') +
							'<div class="w2ui-node-caption" style="float: left;">'+ nd.text +'</div>'+
						'</td>'+
						'</tr></table>'+
					'</div>'+
					'<div class="w2ui-node-sub" id="node_'+ nd.id +'_sub" style="'+ nd.style +';'+ (!nd.hidden && nd.expanded ? '' : 'display: none;') +'"></div>';
				}
				return html;
			}
		},
	
		resize: function (width, height) {
			if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection 
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'resize', target: this.name, width: width, height: height });
			if (eventData.stop === true) return false;
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));
		},
		
		destroy: function () { 
			// event before
			var eventData = this.trigger({ phase: 'before', type: 'destroy', target: this.name });	
			if (eventData.stop === true) return false;
			// clean up
			$(this.box).html('');
			delete w2ui[this.name];
			// event after
			this.trigger($.extend(eventData, { phase: 'after' }));	
		}				
	}
	
	$.extend(w2tree.prototype, $.w2event);
})();