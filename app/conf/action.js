// ============================================
// -- Main Action Loop for app layout, toolbar, tabs

app.action = function (target, info) {

	switch(target) {
		case 'home':
			app.route.set('home');
			app.load('home');
			break;

		case 'user-menu':
			if (info.subItem && info.subItem.id == 'prefs') {
				w2alert('User preferences');
			}
			if (info.subItem && info.subItem.id == 'logout') {
				app.logout();
			}
			break;

		default:
			app.header(target);
			w2ui['app_layout'].content('main', '<div style="text-align: center; width: 100%; padding: 40px; font-size: 16px; color: #999;">Under Constructions</div>');
			console.log('No event handler for '+ target +'.');
			break;
	}
}