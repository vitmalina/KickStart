// ===========================================
// -- General Application Utilities

app.session = function () {

	// --- CLIENT ONLY CODE ---

	if (typeof sessionStorage['ks-user'] != 'undefined') {
		return $.parseJSON(sessionStorage['ks-user']);
	}

	// --- REPLACE: SERVER SIDE GET USER INFO CODE
}

app.login = function () {
	var login = $('#login').val().toLowerCase();
	var pass  = $('#password').val().toLowerCase();

	// --- CLIENT ONLY CODE ---

	if (login == 'admin' && pass == 'admin') {
		app.core.user = {
			fname: 'Jane',
			lname: 'Doe'
		}
		sessionStorage['ks-user'] = JSON.stringify(app.core.user);
		document.location = 'index.html';
	} else {
		$('.login-box .login-msg').html('Incorrect Login or Password');
	}

	// --- REPLACE: SERVER SIDE LOGIN CODE ---

	// $.ajax({
	// 	url 	: 'server/login',
	// 	type 	: 'post',
	// 	data 	: {	login: login, pass: pass },
	// 	complete: function (xhr, status) {
	// 		if (status != 'success') {
	// 			$('.login-box .login-msg').html('Cannot Login');
	// 			return;
	// 		}
	// 		var data = $.parseJSON(xhr.responseText);
	// 		if (data['status'] != 'success') {
	// 			$('.login-box .login-msg').html('Incorrect Login or Password');
	// 			$('#password').val('').focus();
	// 			return;
	// 		}
	// 		document.location = 'index.html';
	// 	}
	// });
}

app.logout = function () {

	// --- REPLACE: SERVER SESSION REMOVAL CODE ---

	app.core.user = {};
	delete sessionStorage['ks-user'];
	document.location = 'login.html';
}

app.forgot = function () {
	$().w2popup({
		title	: 'Reset Password',
		body 	: '<div style="padding-top: 30px; text-align: center">'+
				  '		Type your email address <div style="height: 12px;"></div>'+
				  '		<input type="text" id="email" size="50" style="padding: 4px; font-size: 13px; border-radius: 4px; border: 1px solid silver;">'+
				  '</div>',
		buttons	: '<input type="button" value="Cancel" onclick="$().w2popup(\'close\')">'+
				  '<input type="button" value="Request" id="request">',
		width	: 450,
		height 	: 220,
		onOpen	: function () {
			$('#w2ui-popup #email')[0].focus();
			$('#w2ui-popup #request').on('click', function () {
				var email = $('#w2ui-popup #email').val();
				if (email == '' || email == null) {
					$('#w2ui-popup #email').w2tag('Cannot be empty')[0].focus();
					return; 
				}
				$().w2popup('close');

				// --- REPLACE: REQUEST PASSWORD RESET ---

				console.log('Request password reset for '+ email);
			});
		}
	});

}

app.ajaxError = function (xhr, status, error) {
	switch (xhr.status) {
		case 403:
			document.location = 'login.html';
			return;
			break;
		case 404: 
			error = 'File Not Found - '+ xhr.url;
			break;
	}
	app.error(xhr.status + ': '+ error);
}