// ============================================
// -- Main Action Loop

app.action = function (target, data) {
	switch(target) {
		case 'home':
			app.route.set('home');
			app.load('home');
			break;

		default:
			app.header(target);
			w2ui['app_layout'].content('main', '<div style="text-align: center; padding: 40px; font-size: 16px; color: #999;">Under Constructions</div>');
			console.log('No event handler for '+ target +'.');
			break;
	}
}