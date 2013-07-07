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

}

app.logout = function () {
	
}