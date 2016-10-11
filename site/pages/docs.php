<?
global $site_root, $theme, $section, $part;
$theme->append('site-head', "<script src=\"".$site_root."/pages/code-mirror.js\"></script>");

echo '<div class="container" style="margin-top: 25px;"></div>';

switch ($section.":".$part) {
    case 'overview:':
        include("docs/overview.html");
        break;
    case 'overview:main':
        include("docs/overview-main.html");
        break;
	case 'overview:layout':
		include("docs/overview-layout.html");
		break;
	case 'overview:toolbar':
		include("docs/overview-toolbar.html");
		break;
    case 'modules:':
	case 'modules:overview':
		include("docs/modules.html");
		break;
	case 'modules:config':
		include("docs/modules-view.html");
        break;
    case 'routes:':
		include("docs/routes.html");
		break;
}
?>
<script>
$(function () {
	$('div.left-menu a').each(function () {
		var link = $(this).attr('href');
		if (link.substr(0, 1) == '#') { link = link.replace('#', '/kickstart/docs'); }
		$(this).attr('href', link);
	});
});
</script>