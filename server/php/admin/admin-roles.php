<?
require_once("security.php");

switch ($_REQUEST['name']."::".$_REQUEST['cmd']) {

	case 'admin_roles::get-records':
		$sql  = "SELECT roleid, rname, rdesc, last_update, last_userid,
					(SELECT CONCAT(lname, ', ', fname) FROM sys_users USR WHERE USR.userid = sys_roles.last_userid) as last_user
				 FROM sys_roles
				 WHERE ~search~ ORDER BY ~sort~";
		$res = $w2grid->getRecords($sql, null, $_REQUEST);
		$w2grid->outputJSON($res);
		break;

	case 'admin_roles::delete-records':
		$res = $w2grid->deleteRecords("sys_roles", "roleid", $_REQUEST);
		$w2grid->outputJSON($res);
		break;

	case 'admin_role_edit::get-record':
		$sql = "SELECT roleid, rname, rdesc
				FROM sys_roles
				WHERE roleid = ".$_REQUEST['recid'];
		$res = $w2grid->getRecord($sql);
		$w2grid->outputJSON($res);
		break;

	case 'admin_role_edit::save-record':
		$members = $_REQUEST['record']['members'];
		unset($_REQUEST['record']['members']);
		$res = $w2grid->saveRecord('sys_roles', 'roleid', $_REQUEST);
		$w2grid->outputJSON($res);
		break;

	case 'admin_role_edit::get-actions':
		$search = addslashes($_REQUEST['search']);
		$sql = "SELECT serviceid, service_name FROM sys_services 
				WHERE service_name LIKE '{$search}%' 
				ORDER BY service_name";
		$res = $w2grid->getOptions($sql);
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