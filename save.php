<?php

header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);
ini_set('display_errors', 0);


$fileName=$_FILES['files']['name'];
$filePath = 'uploads/' . $fileName;
$base_url=$_SERVER['SERVER_NAME'];
$image='http://'.$base_url.'/webm-tomp4/uploads/video_logo.png';

move_uploaded_file($_FILES['files']['tmp_name'], $filePath );  

$command='./usr/bin/ffmpeg -i http://'.$base_url.'/webm-tomp4/uploads/'.$fileName.' -i '.$image.'  -filter_complex "overlay=5:5" '.$fileName.' ';
// execute the command
echo $command;
system($command,$output);
if($output==0){

    $destinationPath='uploads/'.$fileName;
    rename($fileName,$destinationPath);
}
echo "Overlay has been added";exit;
