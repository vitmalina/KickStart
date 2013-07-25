// ===========================================
// -- General Application Utilities

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

app.login = function () {
	var login 	 = $('#login').val();
	var password = $('#password').val();
	$.ajax({
		url 	: 'server/login',
		type 	: 'post',
		data 	: {	login: login, password: password },
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

app.logout = function () {
	// delete session
	document.location = 'login.html';
}

app.forgot = function () {
	var email = prompt('Please enter email address you signed up with.'); 
	if (email == '' || email == null) return; 
	document.location = document.location + '?email=' + email;
}