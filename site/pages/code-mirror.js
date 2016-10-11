// Code Mirror

$(function () {

	// javascript
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

	// html
	$("textarea.html").each(function (index, el) {
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
				mode		: "text/html",
				readOnly	: true,
				gutter		: true,
				lineNumbers	: true
			}
		);
	});

	// css
	$("textarea.css").each(function (index, el) {
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
				mode		: "css",
				readOnly	: true,
				gutter		: true,
				lineNumbers	: true
			}
		);
	});
});