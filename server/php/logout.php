<?
if ($_COOKIE['SESSION_ID']){

	$sessionId = $_COOKIE['SESSION_ID'];
	$sessionFilename = substr( __FILE__, 0, -strlen("logout.php") )."sessions/$sessionId";
	if file_exists($sessionFilename) unlink( $sessionFilename );
	setcookie( 'SESSION_ID', '' ); 

}

header("Content-Type: application/json;charset=utf-8");
echo json_encode(Array('status'=>'success'));

?>
