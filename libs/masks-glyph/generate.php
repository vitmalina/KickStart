<?
/**********************************
*  This file will read all the images in ./png folder and generate CSS file
*  for image mask. It will also read the size of the image and make appropriate 
*  proportions.
*/

print("<pre>");
$cnt  = 1;
$html = "<table cellpadding=\"4px\"><tr>\n";
$icons = Array();
if ($handle = opendir('png')) {
    while (false !== ($entry = readdir($handle))) {
    	if (is_dir($entry)) continue;    	
    	$tmp = getimagesize("png/".$entry);
    	$width  = round(100/32*$tmp[0]);
    	$height = round(100/32*$tmp[1]);
    	//if ($width > 100 || $height > 100) print("-->$width x $height\n");
    	$icon = str_replace('+', 'p', str_replace(".png", "", "icon-".substr($entry, 15)));
        if (isset($icons[$icon])) $icon .= "2";
        echo ".".$icon." { -webkit-mask-image: url('png/$entry'); -webkit-mask-size: $width% $height%; } \n"; 
        $html .= "<td><div class=\"icon-glyph $icon\"></div></td><td>$icon</td>\n";
        if ($cnt % 5 == 0) $html .= "</tr><tr>\n";
        $icons[$icon] = 1;
        $cnt++;
    }
    closedir($handle);
}
$html .= "</tr></table>";
print("</pre>");
print("<textarea style='width: 100%; height: 100px;'>$html</textarea>");
?>