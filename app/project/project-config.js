// ============================================
// -- Configuration for the main module

config = {
	
	// ==============================
	// --- Home Sidebar
	
	proj_sidebar: {
		name: 'proj_sidebar',
		nodes: [
			{ id: 'main', text: 'Current', group: true,  expanded: true, 
				nodes: [
					{ id: 'proj-overview',	text: 'Overview', icon: 'icon-newspaper', selected: true, route: '/project' },
					{ id: 'proj-tasks',		text: 'Tasks', icon: 'icon-tasks', count: 14, route: '/project/tasks' },
					{ id: 'proj-bugs',		text: 'Bugs', icon: 'icon-bug', route: '/project/bugs' },
					{ id: 'proj-reports',	text: 'Reports', icon: 'icon-map-2', route: '/project/reports' }
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
	}
}