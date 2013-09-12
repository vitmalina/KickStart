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
			{ type: 'left', size: '200px', minSize: 100, resizable: true, style: 'border-right: 1px solid silver' },
			{ type: 'main', overflow: 'hidden', style: 'background-color: white;' },
			{ type: 'right', size: '400px', resizable: true, hidden: true, style: 'border-left: 1px solid silver' },
			{ type: 'preview', size: '200px', overflow: 'hidden', hidden: true, resizable: true, style: 'border-top: 1px solid silver' },
			{ type: 'bottom', size: '40px', hidden: true, style: 'border-top: 1px solid silver' }
		]
	},

	// --- Application Top Toolbar (if any)
	app_toolbar: {
		name 	: 'app_toolbar',
		items 	: [
			{ id: 'home', caption: 'Home', type: 'radio', icon: 'icon-home', checked: true },
			{ id: 'invoices', caption: 'Invoices', type: 'radio', icon: 'icon-dollar' },
			{ id: 'projects', caption: 'Projects', type: 'radio', icon: 'icon-tasks' },
			{ id: 'customers', caption: 'Customers', type: 'radio', icon: 'icon-flag' },
			{ id: 'spacer1', type: 'spacer' },
			{ id: 'user', caption: '--', type: 'button' },
			{ id: 'br1', type: 'break' },
			{ id: 'logout', caption: 'Logout', type: 'button', icon: 'icon-switch' }
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
