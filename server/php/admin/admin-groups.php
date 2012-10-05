<?
require_once("security.php");

switch ($_REQUEST['name']."::".$_REQUEST['cmd']) {

	case 'admin_groups::get-records':
		$sql  = "SELECT groupid, gname, gdesc, last_update, last_userid,
					(SELECT CONCAT(lname, ', ', fname) FROM sys_users USR WHERE USR.userid = sys_groups.last_userid) as last_user
				 FROM sys_groups
				 WHERE ~search~ ORDER BY ~sort~";
		$res = $w2grid->getRecords($sql, null, $_REQUEST);
		$w2grid->outputJSON($res);
		break;

	case 'admin_groups::delete-records':
		$res = $w2grid->deleteRecords("sys_groups", "groupid", $_REQUEST);
		$w2grid->outputJSON($res);
		break;

	case 'admin_group_edit::get-record':
		$sql = "SELECT groupid, gname, gdesc
				FROM sys_groups
				WHERE groupid = ".$_REQUEST['recid'];
		$res = $w2grid->getRecord($sql);
		$w2grid->outputJSON($res);
		break;

	case 'admin_group_edit::save-record':
		$members = $_REQUEST['record']['members'];
		unset($_REQUEST['record']['members']);
		$res = $w2grid->saveRecord('sys_groups', 'groupid', $_REQUEST);
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