<?
require_once("security.php");

switch ($_REQUEST['name']."::".$_REQUEST['cmd']) {

	case 'admin_users::get-records':
		$sql  = "SELECT userid, fname, lname, email, DATE_FORMAT(expires, '%m/%d/%Y') as expires,
					login, superuser, hidden, last_update, last_userid,
					(SELECT CONCAT(lname, ', ', fname) FROM sys_users USR WHERE USR.userid = sys_users.last_userid) as last_user
				 FROM sys_users
				 WHERE ~search~ ORDER BY ~sort~";
		$res = $w2grid->getRecords($sql, null, $_REQUEST);
		// wipe out passwords
		if (is_array($res) && isset($res['records'])) {
			foreach ($res['records'] as $k => $v) $res['records'][$k]['password'] = '';
		}
		$w2grid->outputJSON($res);
		break;

	case 'admin_users::delete-records':
		$res = $w2grid->deleteRecords("sys_users", "userid", $_REQUEST);
		$w2grid->outputJSON($res);
		break;

	case 'admin_user_edit::get-record':
		$sql = "SELECT userid, fname, lname, email, DATE_FORMAT(expires, '%m/%d/%Y') as expires,
					login, superuser, hidden
				FROM sys_users 
				WHERE userid = ".$_REQUEST['recid'];
		$res = $w2grid->getRecord($sql);
		$w2grid->outputJSON($res);
		break;

	case 'admin_user_edit::save-record':
		$res = $w2grid->saveRecord('sys_users', 'userid', $_REQUEST);
		$w2grid->outputJSON($res);
		break;

	default:
		$res = Array();
		$res['status']  = 'error';
		$res['message'] = 'Command "'.$_REQUEST['cmd'].'" is not recognized.';
		$res['postData']= $_REQUEST;
		$w2grid->outputJSON($res);
		break;
}
?>