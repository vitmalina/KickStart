// ============================================
// -- Application Configuration

config = {
    // context : 'http://w2ui.com:3000',
    context : 'http://localhost:3000',

    // --- General settings
    show: {
        toolbar : true,
        tabs    : false,
        header  : true
    },

    fail: function (mod) {
        w2alert('Failed to load module '+ mod.name, 'Error');
        console.log('ERROR: Failed to load module');
        console.log(mod);
    },

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
    },

    // --- Application Main Tabs (if any)    
    app_tabs: {
        name   : 'app_tabs',
        active : 'home',
        style  : 'padding 0px 3px 1px 3px;',
        tabs   : [
            { id: 'home', caption: 'Home' }
        ],
        onClose : function () { this.doClick('home'); },        
        onClick : action
    }
}
