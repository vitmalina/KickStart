<?
require_once("security.php");

if (isset($services[$service])) { 
	// redirect to that service
	require($services[$service]);
} else { 
	$res = Array();
	$res['status']  	= 'error';
	$res['message'] 	= 'Service: "'.$service.'" is not recognized.';
	$res['postData']	= $_REQUEST;

	header("Content-Type: application/json;charset=utf-8");
	echo json_encode($res);
}
?>