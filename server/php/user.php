<?

if ($_COOKIE['SESSION_ID']){

	$sessionId = $_COOKIE['SESSION_ID'];
	$sessionFilename = substr( __FILE__, 0, -strlen("user.php") )."sessions/$sessionId";
	
	if ( file_exists($sessionFilename) ) $user = unserialize( file_get_contents($sessionFilename) );
	else $user = array(); 

} else 	$user = array();

header("Content-Type: application/json;charset=utf-8");
echo json_encode($user);

?>
