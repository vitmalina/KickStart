<?
/************************************************
*  Main File: redirect to the proper end point
*  after it verifies if user has access to that
*  end
**/

require("conf.php");
require("libs/dbConn.php");
require('libs/w2lib.php');

$db = new dbConnection('mysql');
$db->connect($db_ip, $db_user, $db_pass, $db_name, $db_port);

// Find out access path, serves as service_path
$tmp = explode("?", $_SERVER['REQUEST_URI']);
$tmp = explode('/server/', $tmp[0]);
$service = preg_replace("/\/+/", "/", "/server/".$tmp[1]);

session_start();

// --- Session timeout

if (isset($_SESSION['last_update']) && (time() - $_SESSION['last_update'] > 1800)) { // 30 minutes
    session_unset();
    session_destroy();
}
$_SESSION['last_update'] = time(); // update last activity time stamp

/************************************************
* 	SYSTEM LEVEL Services
*		/server/login 	- login, password as parameters
*		/server/logout	- no parameters
*		/server/user 	- no parameters, if logged in, returns user info
**/

// ======================================
// --- No Login Services

// do login
if ($service == '/server/login') {
	// try to login
	$sql = "SELECT * FROM sys_users 
			WHERE login = '".addslashes($_REQUEST["login"])."' 
				AND (password = '".md5($_REQUEST["password"])."' OR password = '".addslashes($_REQUEST["password"])."')
			LIMIT 1";
	$rs  = $db->execute($sql);
	if ($rs->EOF) {
		$res = Array();
		$res['status'] 	= 'error';
		$res['message']	= 'Incorrect user name or password';
		// output
		header("Content-Type: application/json;charset=utf-8");
		echo json_encode($res);
		die();
	}
	$user = Array();
	foreach ($rs->fields as $k => $v) {
		if (intval($k) > 0 || $k == "0") continue;
		if ($k == 'password') continue;
		$user[$k] = $v;
	}

	$userInfo = getUserInfo($user);

	$_SESSION['user'] 		= $user;
	$_SESSION['groups']		= $userInfo['groups'];
	$_SESSION['roles']		= $userInfo['roles'];
	$_SESSION['services']	= $userInfo['services'];
	session_write_close();

	$res = Array();
	$res['status'] 	= 'success';
	$res['user'] 	= $user;
	$res['groups']	= $userInfo["groups"];
	$res['roles']	= $userInfo["roles"];
	$res['services']= $userInfo["services"];
	// output
	header("Content-Type: application/json;charset=utf-8");
	echo json_encode($res);
	die();
}

// do logout
if ($service == '/server/logout') {
    session_unset();
    session_destroy();
	$res = Array();
	$res['status'] 	= 'success';
	// output
	header("Content-Type: application/json;charset=utf-8");
	echo json_encode($res);
	die();
}

// do check
if ($service == '/server/user') {
	$res = Array();
	if (!isset($_SESSION["user"]) || $_SESSION["user"] == null) {
		$res['status'] 	= 'error';
		$res['message']	= 'User is not logged in';
	} else {
		$res['status'] 	= 'success';
		$res['user'] 	= $_SESSION["user"];
		$res['groups']	= $_SESSION["groups"];
		$res['roles']	= $_SESSION["roles"];
		$res['services']= $_SESSION["services"];
	}
	// output
	header("Content-Type: application/json;charset=utf-8");
	echo json_encode($res);
	die();
}

// ======================================
// --- SERVICES THAT REQUIER LOGIN

if (!isset($_SESSION["user"]) || isset($_SESSION["user"]) == null) {
	header('HTTP/1.1 403 Forbidden');
	$res = Array();
	$res['status'] 	= 'error';
	$res['message']	= "Access Denied";
	header("Content-Type: application/json;charset=utf-8");
	echo json_encode($res);
	die();
}

// --- Some useful functions

function getUserInfo ($user) {
	global $db;
	$userInfo = Array();

	// get user groups
	$sql = "SELECT * FROM sys_groups 
			WHERE groupid IN (SELECT groupid FROM sys_user_groups WHERE userid = {$user[userid]})";
	$rs  = $db->execute($sql);
	$groups   = Array();
	$groupids = Array();
	while ($rs && !$rs->EOF) {
		$groups[$rs->fields["groupid"]] = $rs->fields["gname"];
		$groupids[]	= intval($rs->fields["groupid"]);
		$rs->moveNext();
	}
	$groups['ids'] = $groupids;

	// get user roles
	$sql = "SELECT * FROM sys_roles
			WHERE roleid IN (SELECT roleid FROM sys_user_roles WHERE userid = {$user[userid]})";
	$rs  = $db->execute($sql);
	$roles   = Array();
	$roleids = Array();
	while ($rs && !$rs->EOF) {
		$roles[$rs->fields["roleid"]] = $rs->fields["rname"];
		$roleids[]	= intval($rs->fields["roleid"]);
		$rs->moveNext();
	}
	$roles['ids'] = $roleids;

	// get services
	$sql = "SELECT * FROM sys_services 
			WHERE serviceid IN (SELECT serviceid FROM sys_role_services WHERE roleid IN (".(count($roleids) == 0 ? "0" : implode(',', $roleids))."))";
	$rs  = $db->execute($sql);
	$services = Array();
	while ($rs && !$rs->EOF) {
		$services[] = $rs->fields["service_path"];
		$rs->moveNext();
	}

	$userInfo['groups']  = $groups;
	$userInfo['roles'] 	 = $roles;
	$userInfo['services']= $services;	

	return $userInfo;
}

/*
header("Content-Type: application/json;charset=utf-8");
echo json_encode($_SESSION);
die();
//*/
?>