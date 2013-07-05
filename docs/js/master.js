$(function () {
	console.log('ready');
	web_hash_change();
});

function initCode() {
	$("textarea.javascript").each(function (index, el) {
		var obj = this;
		// resize to context
		var ta = $(this);
		$(ta).height(ta.scrollHeight + 2);
		// init Code Mirror
		var codeMirror = CodeMirror(
			function (elt) {
		  		obj.parentNode.replaceChild(elt, obj);
			}, {
				value		: $.trim($(obj).val()),
				mode		: "javascript",
				readOnly	: true,
				gutter		: true,
				lineNumbers	: true
			}
		);
	});
}

function loadPage(url) {
	$.ajax({
		url	: url,
		complete: function (xhr, status) {
			if (status != 'success') {
				$('#main').html('<div class="container"><div class="span12"><div class="alert alert-error">ERROR: '+ xhr.statusText + '</div></div></div>');
				return;
			}
			$('#main').html(xhr.responseText);
			initCode();
		}
	});

}

// -- HASH CHANGE ---

function web_hash_change () {
	var hash = String(document.location.hash).replace(/\/{2,}/g, '/');
	var path = [];
	if (hash.length > 0) hash = hash.substr(1);
	if (hash.length > 0 && hash.substr(0, 1) == '/') hash = hash.substr(1);
	path = hash.split('/');
	// ---
	$('#top-menu li').removeClass('active');
	switch (hash) {
		case '':
		case 'overview':
			$('#top-menu li.overview').addClass('active');
			loadPage('pages/overview.html');
			break;

		case 'overview/app-layout':
			$('#top-menu li.overview').addClass('active');
			loadPage('pages/layout.html');
			break;

		case 'overview/app-tabs':
			$('#top-menu li.overview').addClass('active');
			loadPage('pages/tabs.html');
			break;

		case 'overview/app-toolbar':
			$('#top-menu li.overview').addClass('active');
			loadPage('pages/toolbar.html');
			break;

		case 'overview/app-sidebar':
			$('#top-menu li.overview').addClass('active');
			loadPage('pages/sidebar.html');
			break;

		case 'overview/app-core':
			$('#top-menu li.overview').addClass('active');
			loadPage('pages/core.html');
			break;

		case 'modules':
			$('#top-menu li.modules').addClass('active');
			loadPage('pages/modules.html');
			break;

		case 'modules/model':
			$('#top-menu li.modules').addClass('active');
			loadPage('pages/model.html');
			break;

		case 'modules/view':
			$('#top-menu li.modules').addClass('active');
			loadPage('pages/view.html');
			break;

		case 'routes':
			$('#top-menu li.routes').addClass('active');
			loadPage('pages/routes.html');
			break;
	}
}
$(window).on('hashchange', web_hash_change);