<?
// ================================================
// DB Configuration

$db_ip		= 'localhost';
$db_port	= 3306;
$db_user	= 'root';
$db_pass	= '';
$db_name	= 'kickstart';

// ================================================
// This should have ALL POSSIBLE END POINTS
// All allowed End Points are based on roles. 
// See sys_roles, sys_actions, sys_role_action tables

$services = Array();
$services["/server/admin-services"]	= "admin/admin-services.php";
$services["/server/admin-groups"]	= "admin/admin-groups.php";
$services["/server/admin-roles"]	= "admin/admin-roles.php";
$services["/server/admin-users"]	= "admin/admin-users.php";
?>