// ============================================
// -- Configuration for the main module

configs = {

	// ==============================
	// --- Application Top Toolbar

	app_toolbar: {
		name 	: 'app_toolbar',
		items 	: [
			{ type: 'break' },
			{ type: 'menu',   id: 'quick-actions', caption: 'Actions', hint: 'Quick actions', items: [
				{ text: 'Create...', icon: 'icon-' },
				{ text: 'Create...', icon: 'icon-' },
				{ text: 'Create...', icon: 'icon-' },
				{ text: 'Create...', icon: 'icon-' },
				{ text: 'Create...', icon: 'icon-' }
			]},
			{ type: 'spacer' },
			{ type: 'menu',  id: 'user-menu', img: '', caption: 'User Name', items: [
				{ id: 'preferences', text: 'Preferences', icon: 'icon-favorites' },
				{ id: 'log-out', text: 'Log Out', icon: 'icon-arrow-right' }
			  ], onClick: function (target, data) {
			  }
			}
		],
		onClick: app.main.appAction
	},

	// ==============================
	// --- Application Main Tabs
	
	app_tabs: {
		name 	: 'app_tabs',
		active 	: 'dashboard',
		style: 'padding 0px 3px 1px 3px;',
		tabs: [
			{ id: 'dashboard', caption: 'Dashboard' },
			{ id: 'mod1', caption: 'Module 1' },
			{ id: 'mod2', caption: 'Module 2' }
		],
		onClick: app.main.appAction
	},

	// ==============================
	// --- Application  Layout

	app_layout: {
		name: 'app_layout',
		style: 'background-color: #f5f6f7',
		panels: [
			{ type: 'top', size: '20px', overflow: 'hidden', hidden: true },
			{ type: 'left', size: '180px', minSize: 100, resizable: true, style: 'background-color: #DEE4EA; border-right: 1px solid silver;' },
			{ type: 'main', overflow: 'hidden', style: 'background-color: #DBDFE5; padding-top: 4px;' },
			{ type: 'right', size: '400px', resizable: true, hidden: true },
			{ type: 'preview', size: '50%', overflow: 'hidden', hidden: true, resizable: true  },
			{ type: 'bottom', size: '20px', hidden: true }
		]
	},

	
	// ==============================
	// --- Main Sidebar
	
	main_sidebar: {
		name: 'main_sidebar',
		img: null,
		nodes: [
			{ id: 'main', text: 'General', group: true, img: 'icon-', expanded: true, nodes: [
				{ id: 'main-list1',	text: 'List 1', img: 'icon-', selected: true },
				{ id: 'main-list2', text: 'List 2', img: 'icon-' }
			]},
			{ id: 'settings', text: 'Settings', group: true, img: 'icon-cases', expanded: true, nodes: [
				{ id: 'set-users', 	text: 'Users', 		img: 'icon-user' },
				{ id: 'set-groups', text: 'Groups', 	img: 'icon-users' }
			]},
		],
		onClick: app.main.appAction
	}	
}