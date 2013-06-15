// ===========================================
// -- Login page script

function login (event) {
	var login 	 = $('#login').val();
	var password = $('#password').val();
	$.ajax({
		url 	: 'server/login',
		type 	: 'post',
		data 	: {	login: login, password: password },
		complete: function (xhr, status) {
			if (status != 'success') {
				$('#message').html('Cannot Login');
				return;
			}
			var data = $.parseJSON(xhr.responseText);
			if (data['status'] != 'success') {
				$('#message').html('Incorrect Login or Password');
				$('#password').val('').focus();
				return;
			}
			document.location = 'index.html';
		}
	});
}