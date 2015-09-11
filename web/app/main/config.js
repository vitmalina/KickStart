// ============================================
// -- Application Configuration

config = {
    context : '../api/json',
    // context : 'http://localhost:3000/api',

    // --- Application  Layout
    app_layout: {
        name: 'app_layout',
        style: 'background-color: #bbb;',
        panels: [
            { type: 'top', size: '20px', overflow: 'hidden', hidden: true },
            { type: 'left', size: '160px', minSize: 100, resizable: true, style: 'border-right: 1px solid silver' },
            { type: 'main', overflow: 'hidden', style: 'background-color: white;' },
            { type: 'right', size: '400px', resizable: true, hidden: true, style: 'border-left: 1px solid silver' },
            { type: 'preview', size: '200px', overflow: 'hidden', hidden: true, resizable: true, style: 'border-top: 1px solid silver' },
            { type: 'bottom', size: '40px', hidden: true, style: 'border-top: 1px solid silver' }
        ]
    },

    // --- Application Top Toolbar (if any)
    app_toolbar: {
        name  : 'app_toolbar',
        items : [
            { id: 'home', caption: 'Home', type: 'radio', icon: 'icon-home', route: '/home' },
            { id: 'project', caption: 'Projects', type: 'radio', icon: 'icon-flag', route: '/projects' },
            { id: 'helpdesk', caption: 'HelpDesk', type: 'radio', icon: 'icon-bug', route: '/helpdesk' },
            { id: 'spacer1', type: 'spacer' },
            { id: 'user', caption: '--', type: 'menu', 
                items: [
                    { id: 'admin', text: 'Administration', icon: 'icon-users' },
                    { id: 'prefs', text: 'Preferences', icon: 'icon-cog' },
                    { id: 'break', text: '--' },
                    { id: 'logout', text: 'Logout', icon: 'icon-off' },
                ] 
            }
        ],
        onClick: action
    }
}