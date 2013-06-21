// ============================================
// -- Application Configuration

config = {

	// --- General settings
	show: {
		toolbar : true,
		tabs 	: false,
		header 	: true
	},

	// --- Application  Layout
	app_layout: {
		name: 'app_layout',
		style: 'background-color: #bbb;',
		panels: [
			{ type: 'top', size: '20px', overflow: 'hidden', hidden: true },
			{ type: 'left', size: '200px', minSize: 100, resizable: true },
			{ type: 'main', overflow: 'hidden', style: 'background-color: white;' },
			{ type: 'right', size: '400px', resizable: true, hidden: true },
			{ type: 'preview', size: '50%', overflow: 'hidden', hidden: true, resizable: true  },
			{ type: 'bottom', size: '40px', hidden: true }
		]
	},

	// --- Application Top Toolbar (if any)
	app_toolbar: {
		name 	: 'app_toolbar',
		items 	: [
			{ id: 'home', caption: 'Home', type: 'radio', icon: 'fa-home', checked: true },
			{ id: 'customers', caption: 'Customers', type: 'radio', icon: 'fa-flag' },
			{ id: 'invoices', caption: 'Invoices', type: 'radio', icon: 'fa-dollar' },
			{ id: 'projects', caption: 'Projects', type: 'radio', icon: 'fa-bar-chart' },
			{ type: 'spacer' },
			{ id: 'admin', caption: 'Admin', type: 'button' },
			{ type: 'break', id: 'br1' },
			{ type: 'menu',  id: 'user-menu', img: '', caption: 'User Name', overlay: { left: 20 },
				items: [
					{ id: 'prefs', text: 'Preferences', icon: 'icon-favorites' },
					{ id: 'log-out', text: 'Log Out', icon: 'icon-arrow-right' }
				]
			}
		],
		onClick: app.action
	},

	// --- Application Main Tabs (if any)	
	app_tabs: {
		name 	: 'app_tabs',
		active	: 'home',
		style	: 'padding 0px 3px 1px 3px;',
		tabs	: [
			{ id: 'home', caption: 'Home' }
		],
		onClose : function () { this.doClick('home'); },		
		onClick : app.action
	}
}
