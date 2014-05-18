// ===========================================
// -- Application session functions

//app.context = 'http://w2ui.com:3000';
app.context = 'http://localhost:3000';

var loc = String(document.location);
if (loc.substr(0, 5) != 'file:' && loc.substr(0, 16) != 'http://localhost') app.context = '';

// ===========================================
// Global AJAX Error catcher

$(document).ajaxError(function (event, xhr, options) {
	var error = '';
	switch (xhr.status) {
		case 403:
			document.location = 'login.html';
			return;
			break;
		case 404: 
			error = 'File Not Found - '+ xhr.url;
			break;
	}
	setTimeout(function () { 
		if (xhr.status == 0) return; // canceled request
		w2alert('Error', xhr.status + ': '+ error);
	}, 100);
});

// ===========================================
// This function is called on start and if it returns empty object 
// the system will call app.logout()

app.session = function () {

	if ( app.server == 'none' ) { 
		// --- CLIENT ONLY CODE ---

		if (typeof sessionStorage['ks-user'] != 'undefined') {
			return $.parseJSON(sessionStorage['ks-user']);
		}

	} else {
		// --- REPLACE: SERVER SIDE GET USER INFO CODE

		var userInfo;
		$.ajax({
			url 	: app.server + '/user',
			type 	: 'post',
			async	: false,
			complete: function (xhr, status) {
				if (status != 'success') {
					app.error('Error while retrieving user information');
					return;
				}
				userInfo = $.parseJSON(xhr.responseText);
			}
		});
		return userInfo;
	}
}

// ===========================================
// This function is only called in login.html

app.login = function () {
	var login = $('#login').val().toLowerCase();
	var pass  = $('#password').val().toLowerCase();

	if ( app.server == 'none' ) { 
		// --- CLIENT ONLY CODE ---

		if (login == 'admin' && pass == 'admin') {
			app.user = {
				fname: 'Jane',
				lname: 'Doe'
			}
			sessionStorage['ks-user'] = JSON.stringify(app.user);
			document.location = 'index.html';
		} else {
			$('.login-box .login-msg').html('Incorrect Login or Password');
		}

	} else { 
		// --- REPLACE: SERVER SIDE LOGIN CODE ---

		$.ajax({
			url 	: app.server + '/login',
			type 	: 'post',
			data 	: {	login: login, pass: pass },
			complete: function (xhr, status) {
				if (status != 'success') {
					$('.login-box .login-msg').html('Cannot Login');
					return;
				}
				var data = $.parseJSON(xhr.responseText);
				if (data['status'] != 'success') {
					$('.login-box .login-msg').html('Incorrect Login or Password');
					$('#password').val('').focus();
					return;
				}
				document.location = 'index.html';
			}
		});
	}
}

// ===========================================
// This function is only called in login.html

app.logout = function () {

	
	if ( app.server == 'none' ) { 
		// --- CLIENT ONLY CODE ---

		delete sessionStorage['ks-user'];

	} else {
		// --- REPLACE: SERVER SESSION REMOVAL CODE ---

		$.ajax({ url : app.server + '/logout' });
	}

	app.user = {};
	document.location = 'login.html';
}

// ===========================================
// This function is only called in login.html

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
		onOpen	: function (event) {
			event.onComplete = function () {
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
		}
	});

}
