<?
require_once("security.php");

switch ($_REQUEST['name']."::".$_REQUEST['cmd']) {

	case 'admin_services::get-records':
		$sql  = "SELECT serviceid, service_name, service_path, last_update, last_userid,
					(SELECT CONCAT(lname, ', ', fname) FROM sys_users USR WHERE USR.userid = sys_services.last_userid) as last_user
				 FROM sys_services
				 WHERE ~search~ ORDER BY ~sort~";
		$res = $w2grid->getRecords($sql, null, $_REQUEST);
		$w2grid->outputJSON($res);
		break;

	case 'admin_services::delete-records':
		$res = $w2grid->deleteRecords("sys_services", "serviceid", $_REQUEST);
		$w2grid->outputJSON($res);
		break;

	case 'admin_service_edit::get-record':
		$sql = "SELECT serviceid, service_name, service_path
				FROM sys_services
				WHERE serviceid = ".$_REQUEST['recid'];
		$res = $w2grid->getRecord($sql);
		$w2grid->outputJSON($res);
		break;

	case 'admin_service_edit::save-record':
		$res = $w2grid->saveRecord('sys_services', 'serviceid', $_REQUEST);
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