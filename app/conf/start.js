// ===========================================
// -- This function is called on start

app.start = function () {
	// overwrite default buttons
	var btn = w2obj.grid.prototype.buttons;
	btn['reload'].icon 	= 'icon-repeat';
	btn['columns'].icon = 'icon-layers';

	// update user name
	w2ui.app_toolbar.set('user', { 
		caption : app.user.fname + ' ' + app.user.lname 
	});
	
	// go to route
	if (app.route.get() == '') {
		app.route.go('/home');
	} else {
		app.route.process();
	}
}