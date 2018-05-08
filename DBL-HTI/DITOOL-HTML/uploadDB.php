<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

$target_dir = 'DB-Files/';
$target_file = $target_dir. basename($_FILES["fileToUpload"]["name"]);
echo $target_file;
echo "</br>";
$uploadOk = 1;
$databaseFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
echo $databaseFileType;
echo "</br>";

$tmp_name = $_FILES["fileToUpload"]["tmp_name"];
echo $tmp_name;
echo "</br>";

// Check if file already exists
if (file_exists($target_file)) {
    echo "Sorry, file already exists. </br>";
    $uploadOk = 0;
}

// Allow certain file formats
if($databaseFileType != "msql" && $databaseFileType != "dbd" && $databaseFileType != "tre" ) {
    echo "Sorry, only msql,tre or dbd files are allowed </br>.";
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($tmp_name, $target_file)) {
        echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded. </br>";
    } else{
   $html_body = '<h1>File upload error!</h1>';
   switch ($_FILES['fileToUpload']['error']) {
   case 1:
      $html_body .= 'The file is bigger than this PHP installation allows';
      break;
   case 2:
      $html_body .= 'The file is bigger than this form allows';
      break;
   case 3:
      $html_body .= 'Only part of the file was uploaded';
      break;
   case 4:
      $html_body .= 'No file was uploaded';
      break;
   default:
      $html_body .= 'unknown errror';
   } 
   echo ($html_body);
    }

}



?>