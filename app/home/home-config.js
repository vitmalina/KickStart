// ============================================
// -- Configuration for the main module

config = {
	
	// ==============================
	// --- Home Sidebar
	
	home_sidebar: {
		name: 'home_sidebar',
		nodes: [
			{ id: 'main', text: 'Current', group: true,  expanded: true, 
				nodes: [
					{ id: 'home-grid1',	text: 'Grid 1', icon: 'icon-home', selected: true, route: '/home' },
					{ id: 'home-grid2',	text: 'Grid 2', icon: 'icon-star', route: '/home/grid2' }
				]
			}
		],
		onClick: function (event) {
			if (event.object.route) {
				app.route.go(event.object.route);
			} else {
				action.call(this, event);
			}
		}
	},

	home_grid : { 
		name: 'home_grid', 
		style: 'border: 0px',
		show: {
			lineNumbers		: true,
			footer			: true,
			toolbar			: true,
			toolbarSearch	: true
		},
		columns: [				
			{ field: 'dbname', caption: 'Database', size: '100%', sortable: true, searchable: true },
			{ field: 'encoding', caption: 'Encoding', size: '120px', sortable: true, searchable: true },
			{ field: 'owner', caption: 'Owner', size: '120px', sortable: true, searchable: true },
			{ field: 'isTemplate', caption: 'Template', size: '70px', attr: 'align=center', hidden: true,
				render: function(record) { return record.isTemplate ? 'yes' : ''; } },
			{ field: 'isOnline', caption: 'Online', size: '70px', attr: 'align=center', hidden: true,
				render: function(record) { return record.isOnline ? 'yes' : ''; } },
		]
	}, 

	home_grid2 : { 
		name	: 'home_grid2', 
		style	: 'border: 0px',
		show	: {
			header	: false,
			toolbar	: true,
			footer	: true,
		},
		columns: [				
			{ field: 'name', caption: 'Name', size: '100%', sortable: true, searchable: true }
		]
	}
}