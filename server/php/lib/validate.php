<?
/***********************************************************************************
*   Class: validate
*   This class provide validate functionality for forms
*/

class validate {
	public $vars 	= Array();
	public $rules	= Array();
	public $errors	= Array();	

	public function __construct() {}
	public function __destruct() {}
	
	// -- add validation rule

	public function addRule($var, $type, $required=false, $min=0, $max=0, $cut=false, $msg='') {
		// --- possible types: str, int, float, email, date, ip
		
		$newRule = array('type'=>$type, 'required'=>$required, 'min'=>$min, 'max'=>$max, 'msg'=>$msg, 'cut'=>$cut);
		$this->rules[$var] = $newRule;	
	}

	// -- run validation
	
	public function validate($vars) {
		// --- by default no errors
		$this->errors = Array();
		
		foreach ($this->rules as $varname => $data) {
			$isError = false;

			// -- trim all incoming variables (outgoing not trimmed)
			if ($this->trim) $vars[$varname] = trim($vars[$varname]);
			
			// --- check if required
			if ($data['required'] == true && $vars[$varname] == '') {
				$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is required but not defined.";
			}

			// -- check all by type
			switch (strtolower($data['type'])) {
			
				case 'str':
					if (strlen($vars[$varname]) > $data['max'] && $data['cut'] && $data['max'] != 0) {
						$vars[$varname] = substr($vars[$varname], 0, $data['max']);
					}
					if ($data['min'] != 0 && strlen($vars[$varname]) < $data['min']) {
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is too short (min=".$data['min'].").";
					}
					if ($data['max'] != 0 && strlen($vars[$varname]) > $data['max']) {
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is too long (max=".$data['max'].").";
					}
					break;
					
				case 'int':
					if ($vars[$varname] != strval(intval($vars[$varname]))) {
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is not an integer.";
						break;
					}
					if ($data['min'] != 0 && intval($vars[$varname]) < $data['min']) {
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is too small (min=".$data['min'].").";
					}
					if ($data['max'] != 0 && intval($vars[$varname]) > $data['max']) {
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is too large (max=".$data['max'].").";
					}
					break;
					
				case 'float':
					if ($vars[$varname] != strval(floatval($vars[$varname]))) {
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is not a float number.";
					}
					if ($data['min'] != 0 && floatval($vars[$varname]) < $data['min']) {
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is too small (min=".$data['min'].").";
					}
					if ($data['max'] != 0 && floatval($vars[$varname]) > $data['max']) {
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is too large (max=".$data['max'].").";
					}
					break;
					
				case 'email':
					if (!preg_match('/^[^@]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$/', $vars[$varname])) {
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is not a valid email address.";
					}
					break;
					
				case 'date':
					// date format must be mm/dd/yyyy
					$tmp = explode("/", $vars[$varname]);
					if (!checkdate($tmp[0], $tmp[1], $tmp[2])){
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is not a valid date.";
					}					
					break;
					
				case 'ip':
					if (!preg_match("/^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$/", $vars[$varname])) {
						$isError = true;
						$this->errors[] = "Variable '".($data['msg'] != '' ? $data['msg'] : $varname)."' is not a valid ip address.";
					}
					break;

				default: 
					$isError = true;
					$this->errors[] = "Variable '".$varname."' is of unknown variable type '".strtolower($data['type'])."'";
					break;
			}
			// if no error then remember the variable
			if ($isError == false) {
				if ($data['type'] == 'str') $vars[$varname] = addslashes($vars[$varname]);
				$this->vars[$varname] = $vars[$varname];
			}			
		}
		if (count($this->errors) == 0) return true; else return false;
	}

	public function clear() {
		// reset all incomming variables
		$_POST 		= Array();
		$_GET 		= Array();
		$_REQUEST 	= Array();
	}
	
	public function cleanUTF8($data, $replace = "") {
		// this reqular expression cleans all non-UTF-8 charectors
		$data = preg_replace('/[\x00-\x08\x10\x0B\x0C\x0E-\x19\x7F]'.
			 '|[\x00-\x7F][\x80-\xBF]+|([\xC0\xC1]|[\xF0-\xFF])[\x80-\xBF]*|[\xC2-\xDF]((?![\x80-\xBF])|[\x80-\xBF]{2,})'.
			 '|[\xE0-\xEF](([\x80-\xBF](?![\x80-\xBF]))|(?![\x80-\xBF]{2})|[\x80-\xBF]{3,})/S',
			 $replace, $data);
		return $data;
	}
	
	public function addError($msg) {
		$this->errors[] = $msg;
	}

	public function errorsToJSON() {
		$array = "";
		foreach ($this->errors as $key => $value) {
			if ($array != "") $array .= ", ";
			$array .=  "\"$value\"";
		}
		header("Content-Type: application/json;charset=utf-8");
		print("{ \"status\": \"error\", \"errors\": [ $array ] }");		
	}
}
?>