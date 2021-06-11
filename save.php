<?php

header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);
ini_set('display_errors', 0);

$fileName=$_FILES['files']['name'];
$filePath = 'uploads/' . $fileName;
$base_url=$_SERVER['SERVER_NAME'];
$image='http://'.$base_url.'/webm-tomp4/uploads/video_logo.png';

move_uploaded_file($_FILES['files']['tmp_name'], $filePath );  

$command='C:\ffmpeg\bin\ffmpeg -i http://'.$base_url.'/webm-tomp4/uploads/'.$fileName.' -i '.$image.'  -filter_complex "overlay=5:5"  '.$fileName.' ';
// execute the command //
system($command,$output);

$command2='C:\ffmpeg\bin\ffmpeg -i '.$fileName.' vf drawtext="fontfile=C\\:/Windows/Fonts/arial.ttf:fontsize=20: fontcolor=red:x=100:y=100:text="HELLO"" '.$fileName.' ';
system($command2,$output);

// ffmpeg -i video.mp4 -vf drawtext="fontfile=C\\:/Windows/Fonts/arial.ttf:fontsize=20: fontcolor=red:x=10:y=10:text='HELLO'"  output.mp4

if($output==0){
    $destinationPath='uploads/'.$fileName;
    rename($fileName,$destinationPath);
}
echo "Overlay has been added";exit;
