<?
/**************************************************
*	This class helps streamline w2ui requests
*/

$w2grid = new w2grid_class();

class w2grid_class {
	// constructor/destructor
	public function __consturct() {}
	public function __descruct() {}

	public function getRecords($sql, $cql, $request) {
		global $db;

		// prepare search
		$str = "";
		if (isset($request['search']) && is_array($request['search'])) {
			foreach ($request['search'] as $s => $search) {
				if ($str != "") $str .= " ".$request['search-logic']." ";
				$operator = "=";
				$value    = "'$value'";
				switch (strtolower($search['operator'])) {

					case 'begins with':
						$operator = "LIKE";
						$value 	  = "'".$search['value']."%'";
						break;

					case 'ends with':
						$operator = "LIKE";
						$value 	  = "'%".$search['value']."'";
						break;

					case 'contains':
						$operator = "LIKE";
						$value 	  = "'%".$search['value']."%'";
						break;

					case 'is':
						$operator = "=";
						$value 	  = "'".$search['value']."'";
						break;

					case 'between':
						$operator = "BETWEEN";
						$value 	  = "'".$search['valueStart']."' AND '".$search['valueEnd']."'";
						break;

					case 'in':
						$operator = "IN";
						$value 	  = "[".$search['value']."]";
						break;
				}
				$str .= $search['field']." ".$operator." ".$value;
			}
		}
		if ($str == "") $str = " 1=1 ";

		// prepare sort
		$str2 = "";
		if (isset($request['sort']) && is_array($request['sort'])) {
			foreach ($request['sort'] as $s => $sort) {
				if ($str2 != "") $str2 .= ", ";
				$str2 .= $sort['field']." ".$sort['direction'];
			}
		}
		if ($str2 == "") $str2 = " 1=1 ";

		// build sql
		$sql = str_replace("~search~", $str, $sql);
		$sql = str_replace("~sort~", $str2, $sql);

		// build cql (for counging)
		if ($cql == null || $cql == "") {
			$cql = "SELECT count(1) FROM ($sql) as grid_list_1";
		}
		if (!isset($request['limit']))  $request['limit']  = 50;
		if (!isset($request['offset'])) $request['offset'] = 0;

		$sql .= " LIMIT ".$request['limit']." OFFSET ".$request['offset'];

		$data = Array();		

		// count records
		$rs = $db->execute($cql);
		$data['status'] = 'success';
		$data['total']  = $rs->fields[0];
		$data['page']   = 0;

		// execute sql
		$rs = $db->execute($sql);

		// check for error
		if ($db->res_errMsg != '') {
			$data = Array();
			$data['status'] = 'error';
			$data['message'] = $db->res_errMsg;
			return $data;
		}
		$data['records'] = array();

		$len = 0;
		while($rs && !$rs->EOF) {
			$data['records'][$len] = Array();
			$data['records'][$len]['recid'] = $rs->fields[0];
			foreach ($rs->fields as $k => $v) {
				if (intval($k) > 0 || $k == "0") continue;
				$data['records'][$len][$k] = $v;
			}
			$len++;
			$rs->moveNext();
		}
		return $data;
	}

	public function deleteRecords($table, $keyField, $data) {
		global $db;
		$res = Array();

		$recs = "";
		foreach ($data['selected'] as $k => $v) {
			if ($recs != "") $recs .= ", ";
			$recs .= "'".addslashes($v)."'";
		}
		$sql = "DELETE FROM $table WHERE $keyField IN ($recs)";
		$rs = $db->execute($sql);
		// check for error
		if ($db->res_errMsg != '') {
			$res['status'] = 'error';
			$res['message'] = $db->res_errMsg;
			return $res;
		}
		$res['status']  = 'success';
		$res['message'] = '';
		return $res;
	}

	public function getRecord($sql) {
		global $db;
		$data = Array();

		// execute sql
		$rs = $db->execute($sql);
		// check for error
		if ($db->res_errMsg != '') {
			$data = Array();
			$data['status'] = 'error';
			$data['message'] = $db->res_errMsg;
			return $data;
		}

		$len = 0;
		$data['status'] = 'success';
		$data['record']	= Array();
		while ($rs && !$rs->EOF) {
			foreach ($rs->fields as $k => $v) {
				if (intval($k) > 0 || $k == "0") continue;
				$data['record'][$k] = $v;
			}
			$len++;
			break;
		}
		return $data;
	}

	public function saveRecord($table, $keyField, $data) {
		global $db;

		if ($data['recid'] == '' || $data['recid'] == '0') {
			$fields = "";
			$values = "";
			foreach ($data['record'] as $k => $v) {
				if ($k == $keyField) continue; // key field should not be here
				if ($fields != '') $fields .= ", ";
				if ($values != '') $values .= ", ";
				$fields .= addslashes($k);
				$values .= ($v == "" ? "null" : "'".addslashes($v)."'");
			}
			$sql = "INSERT INTO $table($fields) VALUES($values)";
		} else {
			$values = "";
			foreach ($data['record'] as $k => $v) {
				if ($k == $keyField) continue; // key field should not be here
				if ($k == $keyField) continue;
				if ($values != '') $values .= ", ";
				$values .= addslashes($k)." = ".($v == "" ? "null" : "'".addslashes($v)."'");
			}
			$sql = "UPDATE $table SET $values WHERE $keyField = ".addslashes($data['recid']);
		}		
		// execute sql
		$rs = $db->execute($sql);
		// check for error
		if ($db->res_errMsg != '') {
			$res = Array();
			$res['status'] = 'error';
			$res['message'] = $db->res_errMsg;
			return $res;
		}

		$res = Array();
		$res['status']  = 'success';
		$res['message'] = '';
		return $res;
	}

	public function outputJSON($data) {
		header("Content-Type: application/json;charset=utf-8");
		echo json_encode($data);
	}
}
?>