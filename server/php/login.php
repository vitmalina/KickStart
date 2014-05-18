<?
if ($_POST['login'] == 'admin' && $_POST['pass'] == 'admin'){

	$user = array();
	$user['fname']	= 'John'; // Jane is client only
	$user['lname']	= 'Doe';

	$sessionId = $_POST['login'];
	$sessionFilename = substr(__FILE__, 0, -strlen("login.php"))."sessions/$sessionId";
	setcookie( 'SESSION_ID', $sessionId ); 
	file_put_contents($sessionFilename, serialize($user));
	chmod($sessionFilename, 0666);

	$res= $user;
	$res['status']	= 'success';

} else {

	$res = array();
	$res['status']	= 'error';
	$res['message']	= 'Incorrect Login or Password';
	$res['post'] 	= $_POST;

}
header("Content-Type: application/json;charset=utf-8");
echo json_encode($res);

?>
