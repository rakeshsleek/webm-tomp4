<?php

header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);
ini_set('display_errors', 0);
session_start();

$fileName=$_FILES['files']['name'];
$base_url=$_SERVER['SERVER_NAME'];
$image='http://'.$base_url.'/webm-tomp4/uploads/video_logo.png';
$output_file='output'.$fileName.'.mp4';
$customer_id=$_REQUEST['customer_id'];


if($_SESSION['customer_id']==""){
    $_SESSION['customer_id']=$customer_id;
    mkdir('uploads/'.$customer_id);
}else{
    $customer_id=$_SESSION['customer_id'];
}



////////////////////// static data//////////////////////

$data['assessment_user_name']='Arnab Nath';
$data['device']='Computer';
$data['ipaddress']='127.0.2.1';
$vtime=strtotime(date('Y-m-d H:i:s'));

///////////////////////// Upload file specific folder/////////////////////////

$filePath = 'uploads/' .$customer_id.'/'.$fileName;
move_uploaded_file($_FILES['files']['tmp_name'], $filePath );  

///////////////////////// Upload file specific folder/////////////////////////

//////////////////////// execute the command  first for logo added then the text on the video////////////////////////////

$command='C:\ffmpeg\bin\ffmpeg -i http://'.$base_url.'/webm-tomp4/uploads/'.$customer_id.'/'.$fileName.' -i '.$image.'  -filter_complex "overlay=5:5"  '.$output_file.' ';
system($command,$output);

$command2='C:\ffmpeg\bin\ffmpeg -i '.$output_file.' -vf "[in]drawtext=fontsize=16:fontcolor=yellow:fontfile=\'fonts/truetype/ttf-dejavu/DejaVuSerif-Italic.ttf\':text=\''.$data['assessment_user_name'].'\':x=10:y=H-th-100:box=1:boxcolor=black@0.4,drawtext=fontsize=16:fontcolor=yellow:fontfile=\'fonts/truetype/ttf-dejavu/DejaVuSerif-Italic.ttf\':text=\''.$data['device'].'\':x=10:y=H-th-80:box=1:boxcolor=black@0.4,drawtext=fontsize=16:fontcolor=yellow:fontfile=\'fonts/truetype/ttf-dejavu/DejaVuSerif-Italic.ttf\':text='.$data['ipaddress'].':x=10:y=H-th-60:box=1:boxcolor=black@0.4,drawtext=fontsize=16:fontcolor=yellow:fontfile=\'fonts/truetype/ttf-dejavu/DejaVuSerif-Italic.ttf\':text=\'%{pts\:gmtime\:'.$vtime.'}\':x=10:y=H-th-40:box=1:boxcolor=black@0.4 [out]"  '.$fileName.' ';
system($command2,$output2);

//////////////////////// execute the command ////////////////////////////////////

//////////////////////// unlink the output file and uploiad the final file to main folder ////////////////////////////

unlink($output_file);

if($output2==0){
    $destinationPath='uploads/'.$customer_id.'/'.$fileName;
    rename($fileName,$destinationPath);
}

//////////////////////// unlink the output file and uploiad the final file to main folder ////////////////////////////

echo "Overlay has been added";exit;
