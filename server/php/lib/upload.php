<?
/***********************************************************************************
*   Class: uploads
*   Handle file uploads, image resize, etc.
*/

class upload {
	
	public $error 		= '';
	public $destFolder  = '';
	public $allowedExt  = Array();  // -- all allowed by default	
	public $jpegQuality = 85;
	
	// ==================================================
	// ----- Constructor / Destructor
	
	public function __construct($dest, $ext = null) {
		// -- allowed extentions
		if ($ext != null) {
			$tmp = explode(",", $ext);
			foreach ($tmp as $k => $v) {
				$this->allowedExt[count($this->allowedExt)] = strtolower($v);
			}
		}
		// -- destination folder
		$this->destFolder = $dest;
	}
	
	public function __descruct() {
	}
	
	// ==================================================
	// ----- Public Methods
	
	public function prepareFolder() {
		$newdir	  = $this->destFolder."/".date('Y-m');
		@mkdir($newdir, 0777);
		@chmod($newdir, 0777);	
		return $newdir;
	}
	
	public function isUploaded($fieldName) {
		return is_uploaded_file($_FILES[$fieldName]['tmp_name']);
	}
	
	public function uploadSave($fieldName, $finalName = "", $overWrite = true) {
		$this->error = '';
		$destFolder = $this->prepareFolder();
		if ($finalName == "") $finalName = $_FILES[$fieldName]['name'];
		
		// -- check if file in dest folder already exists
		if ($overWrite === false) {
			if (file_exists($this->dest."/".$finalName)) {
				$this->error = "A file with the same name \"$finalName\" already exists in the destination folder.";
				return false;
			}
		}
		
		// -- check allowed extentions
		if (count($this->allowedExt) > 0) {
			$tmp = explode(".", $finalName);
			$ext = strtolower($tmp[count($tmp)-1]);
			if (!in_array($ext, $this->allowedExt)) {
				$this->error = "Files with extention \"$ext\" are not allowed.";
				return false;				
			}
		}
		
		$flag = @move_uploaded_file($_FILES[$fieldName]['tmp_name'], $destFolder."/".$finalName);
		if ($flag === false) $this->error = 'Cannot save file into destination directory.';
		return date('Y-m')."/".$finalName;
		
	}
	
	// -----------------------------------------------------
	// -- Resize image keepeing initial ratio and save 
	// -- into $this->desFolder
	
	public function resizeSave($finalName, $apend, $size, $type='width/height') {
		ini_set('memory_limit', '512M');
		
		$this->error = '';
		$destFolder  = $this->destFolder;

		$tmp 	= getimagesize($destFolder."/".$finalName);
		$width	= $tmp[0];
		$height	= $tmp[1];
		$mime	= $tmp['mime'];
		
		$newWidth  = '';
		$newHeight = '';
		switch ($type) {
			case 'width/height':
				if ($width > $height) { $newWidth = intval($size); } else { $newHeight = intval($size); }
				break;
			case 'width':
				$newWidth = intval($size); 
				break;
			case 'height':
				$newHeight = intval($size); 
				break;
		}
		if ($newHeight == '') $newHeight = ($height / $width) * $newWidth;
		if ($newWidth  == '') $newWidth  = ($width / $height) * $newHeight;
		
		// -- create image
		$tmp = explode(".", $finalName);
		$dest = imagecreatetruecolor($newWidth, $newHeight);
		switch ($mime) {
			case 'image/jpeg':
				$src = imagecreatefromjpeg($destFolder."/".$finalName);
				imagecopyresampled($dest, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
				imagejpeg($dest, $destFolder."/".$tmp[0].$apend.".".$tmp[1], $this->jpegQuality);	
				break;
			case 'image/png':
				$src = imagecreatefrompng($destFolder."/".$finalName);
				imagealphablending($dest, false);
				imagesavealpha($dest, true);
				imagecopyresampled($dest, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
				imagepng($dest, $destFolder."/".$tmp[0].$apend.".".$tmp[1]);	
				break;
			case 'image/gif':
				$src = imagecreatefromgif($destFolder."/".$finalName);
				imagealphablending($dest, false);
				imagesavealpha($dest, true);
				imagecopyresampled($dest, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
				imagegif($dest, $destFolder."/".$tmp[0].$apend.".".$tmp[1]);	
				break;
		}
		@imagedestroy($dest);
		@imagedestroy($src);
		return true;
	}

	// -----------------------------------------------------
	// -- Resize image keepeing initial ratio and output 
	// -- with proper Content-Type header
	
	public function resizeOutput($finalName, $size, $type='width/height') {
		ini_set('memory_limit', '512M');
		
		$this->error = '';
		$destFolder  = $this->destFolder;
		
		$tmp 	= getimagesize($destFolder."/".$finalName);
		$width	= $tmp[0];
		$height	= $tmp[1];
		$mime	= $tmp['mime'];
		
		$newWidth  = '';
		$newHeight = '';
		switch ($type) {
			case 'width/height':
				if ($width > $height) { $newWidth = intval($size); } else { $newHeight = intval($size); }
				break;
			case 'width':
				$newWidth = intval($size); 
				break;
			case 'height':
				$newHeight = intval($size); 
				break;
		}
		if ($newHeight == '') $newHeight = ($height / $width) * $newWidth;
		if ($newWidth  == '') $newWidth  = ($width / $height) * $newHeight;
		
		// -- create image
		$dest = imagecreatetruecolor($newWidth, $newHeight);
		switch ($mime) {
			case 'image/jpeg':
				$src = imagecreatefromjpeg($destFolder."/".$finalName);
				imagecopyresampled($dest, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
				Header("Content-Type: image/jpeg");
				imagejpeg($dest, null, $this->jpegQuality);	
				break;
			case 'image/png':
				$src = imagecreatefrompng($destFolder."/".$finalName);
				imagealphablending($dest, false);
				imagesavealpha($dest, true);
				imagecopyresampled($dest, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
				Header("Content-Type: image/png");
				imagepng($dest, null);	
				break;
			case 'image/gif':
				$src = imagecreatefromgif($destFolder."/".$finalName);
				imagealphablending($dest, false);
				imagesavealpha($dest, true);
				imagecopyresampled($dest, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
				Header("Content-Type: image/gif");
				imagegif($dest, null);	
				break;
		}
		@imagedestroy($dest);
		@imagedestroy($src);
		return true;
	}
	
	// -----------------------------------------------------
	// -- Crop image to specific height/width keepeing initial 
	// -- ratio and save into $this->dest folder
	
	public function cropSave($finalName, $apend, $fWidth, $fHeight) {
		ini_set('memory_limit', '512M');
		
		$this->error = '';
		$destFolder  = $this->destFolder;

		$tmp 	= getimagesize($destFolder."/".$finalName);
		$width	= $tmp[0];
		$height	= $tmp[1];
		$mime	= $tmp['mime'];
				
		$ratio0 = $fWidth / $fHeight;
		$ratio1	= $width / $fWidth;
		$ratio2	= $height / $fHeight;
	
		if ($ratio1 <= $ratio2) {
			$newWidth 	= intval($width);
			$newHeight	= floor($newWidth / $ratio0);
			$newLeft	= 0;
			$newTop		= floor(abs($height - $newHeight) / 2);
		} else {
			$newHeight	= intval($height);
			$newWidth	= floor($newHeight * $ratio0);
			$newLeft	= floor(abs($width - $newWidth) / 2);
			$newTop		= 0;
		}
		
		// -- create image
		$tmp = explode(".", $finalName);
		$dest = imagecreatetruecolor($fWidth, $fHeight);
		switch ($mime) {
			case 'image/jpeg':
				$src = imagecreatefromjpeg($destFolder."/".$finalName);
				imagecopyresampled($dest, $src, 0, 0, $newLeft, $newTop, $fWidth, $fHeight, $newWidth, $newHeight);
				imagejpeg($dest, $destFolder."/".$tmp[0].$apend.".".$tmp[1], $this->jpegQuality);	
				break;
			case 'image/png':
				$src = imagecreatefrompng($destFolder."/".$finalName);
				imagealphablending($dest, false);
				imagesavealpha($dest, true);
				imagecopyresampled($dest, $src, 0, 0, $newLeft, $newTop, $fWidth, $fHeight, $newWidth, $newHeight);
				imagepng($dest, $destFolder."/".$tmp[0].$apend.".".$tmp[1]);	
				break;
			case 'image/gif':
				$src = imagecreatefromgif($destFolder."/".$finalName);
				imagealphablending($dest, false);
				imagesavealpha($dest, true);
				imagecopyresampled($dest, $src, 0, 0, $newLeft, $newTop, $fWidth, $fHeight, $newWidth, $newHeight);
				imagegif($dest, $destFolder."/".$tmp[0].$apend.".".$tmp[1]);	
				break;
		}
		@imagedestroy($dest);
		@imagedestroy($src);
		return true;
	}
	
	// -----------------------------------------------------
	// -- Crop image to specific height/width keepeing initial 
	// -- ratio and output with proper Content-Type header
	
	public function cropOutput($finalName, $fWidth, $fHeight) {
		ini_set('memory_limit', '512M');
		 
		$this->error = '';
		$destFolder  = $this->destFolder;

		$tmp 	= getimagesize($destFolder."/".$finalName);
		$width	= $tmp[0];
		$height	= $tmp[1];
		$mime	= $tmp['mime'];
				
		$ratio0 = $fWidth / $fHeight;
		$ratio1	= $width / $fWidth;
		$ratio2	= $height / $fHeight;
	
		if ($ratio1 <= $ratio2) {
			$newWidth 	= intval($width);
			$newHeight	= floor($newWidth / $ratio0);
			$newLeft	= 0;
			$newTop		= floor(abs($height - $newHeight) / 2);
		} else {
			$newHeight	= intval($height);
			$newWidth	= floor($newHeight * $ratio0);
			$newLeft	= floor(abs($width - $newWidth) / 2);
			$newTop		= 0;
		}
		
		// -- create image
		$tmp = explode(".", $finalName);
		$dest = imagecreatetruecolor($fWidth, $fHeight);
		switch ($mime) {
			case 'image/jpeg':
				$src = imagecreatefromjpeg($destFolder."/".$finalName);
				imagecopyresampled($dest, $src, 0, 0, $newLeft, $newTop, $fWidth, $fHeight, $newWidth, $newHeight);
				Header("Content-Type: image/gif");
				imagejpeg($dest, null, $this->jpegQuality);	
				break;
			case 'image/png':
				$src = imagecreatefrompng($destFolder."/".$finalName);
				imagealphablending($dest, false);
				imagesavealpha($dest, true);
				imagecopyresampled($dest, $src, 0, 0, $newLeft, $newTop, $fWidth, $fHeight, $newWidth, $newHeight);
				Header("Content-Type: image/gif");
				imagepng($dest, null);	
				break;
			case 'image/gif':
				$src = imagecreatefromgif($destFolder."/".$finalName);
				imagealphablending($dest, false);
				imagesavealpha($dest, true);
				imagecopyresampled($dest, $src, 0, 0, $newLeft, $newTop, $fWidth, $fHeight, $newWidth, $newHeight);
				Header("Content-Type: image/gif");
				imagegif($dest, null);	
				break;
		}
		@imagedestroy($dest);
		@imagedestroy($src);
		return true;
	}
}