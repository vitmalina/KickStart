<?
session_start();
require("libs/phpTheme.php");
$page = $_REQUEST['page'];

// ======================================================================
// - If the file does not exist, it is rerouted to index.php by .htaccess
//   it also sets up $_GET parameters when it reroutes with page_name, s1,
//   s2, s3, s4 and other query string params. See examples below.
// - If file does exist then it reroutes to that file.
//
// INCOMMING parameters in $_GET[*] and	$_POST[*] OR $_REQUEST[*]
//
// URL Convertion Examples:
//      /page_name/param1 -> index.php?page=page_name&s1=param1
//      /page_name/param1/param2/param3/param4?p1=more&p5=data -> index.php?page=page_name&s1=param1&s2=param2&s3=param3&s4=param4&p1=more&p5=data

if ($page == "") $page = "home";
$page = strToLower($page);

$theme = new phpTheme();
$theme->assign("site-root", $site_root);
$theme->assign("site-name", "JavaScript UI - w2ui");

$feedback = "
<h3>User Comments</h3>
<div id=\"disqus_thread\"></div>
<script type=\"text/javascript\">
	var disqus_shortname = 'w2ui';
	(function() {
		var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	})();
</script>
<noscript>Please enable JavaScript to view the <a href=\"http://disqus.com/?ref_noscript\">comments powered by Disqus.</a></noscript>
<a href=\"http://disqus.com\" class=\"dsq-brlink\">comments powered by <span class=\"logo-disqus\">Disqus</span></a>			
";

switch ($page) {

	case "home":
		$theme->assign("page-name", 	"Home");
		$theme->assign("page-header", 	$theme->includeFile("pages/site-header.php"));
		$theme->assign("page-main", 	$theme->includeFile("pages/home-top.php"));
		$theme->append("page-main", 	$theme->includeFile("pages/home-middle.php"));
		$theme->assign("page-footer", 	$theme->includeFile("pages/site-footer.php"));
		$theme->display("index-main.html");
		break;

	case "get-started":
		$theme->assign("page-name", 	"Get Started");
		$theme->assign("page-header", 	$theme->includeFile("pages/site-header.php"));
		$theme->assign("page-main", 	$theme->includeFile("pages/get-started.php"));
		$theme->assign("page-footer", 	$theme->includeFile("pages/site-footer.php"));
		$theme->display("index-main.html");
		break;

	case "docs":
		$section = $_REQUEST["s1"];
		$part 	 = $_REQUEST["s2"];
		if ($section == '') $section = 'overview';
				
		$theme->assign("page-name", 	"Documentation");
		$theme->assign("page-header", 	$theme->includeFile("pages/site-header.php"));
		$theme->assign("page-main", 	$theme->includeFile("pages/docs.php"));
		$theme->assign("page-footer", 	$theme->includeFile("pages/site-footer.php"));
// 		$theme->append('site-head',
// 			'<link rel="stylesheet" type="text/css" href="/src/w2ui-1.2.min.css" />'.
// 			'<script type="text/javascript" src="/src/w2ui-1.2.min.js"></script>'
// 		);
		$theme->display("index-main.html");
		break;
				
	case "services":
		$theme->assign("page-name", 	"Services");
		$theme->assign("page-header", 	$theme->includeFile("pages/site-header.php"));
		$theme->assign("page-main", 	$theme->includeFile("pages/services.php"));
		$theme->assign("page-footer", 	$theme->includeFile("pages/site-footer.php"));
		$theme->display("index-main.html");
		break;

	case "404";
	default:
		$theme->assign("page-name", 	"404: Page Not Found");
		$theme->assign("page-header", 	$theme->includeFile("pages/site-header.php"));
		$theme->assign("page-main", 	$theme->includeFile("pages/404.php"));
		$theme->assign("page-footer", 	$theme->includeFile("pages/site-footer.php"));
		$theme->display("index-main.html");
		break;
}

?>