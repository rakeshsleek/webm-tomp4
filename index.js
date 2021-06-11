import MediaStreamRecorder from './MediaStreamRecorder.min.js'
import { WaterMark } from './watermark.js';
var _watermark = new WaterMark();
var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
var worker;
var finalBlob = null;

/** Testofy Code */
var inner = document.querySelector('.inner');
var mediaRecorder;

const recordButton = document.querySelector('button#record');
const stopButton = document.querySelector('button#stop');



function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
  navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}
var mediaConstraints = {
   audio: true, // record both audio/video in Firefox/Chrome
   video: true
};

// ffmpeg

// if(document.domain == 'localhost') {
//     workerPath = location.href.replace(location.href.split('/').pop(), '') + 'ffmpeg_asm.js';
// }
function processInWebWorker() {
    var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
        type: 'application/javascript'
    }));

    var worker = new Worker(blob);
    URL.revokeObjectURL(blob);
    return worker;
}
function convertStreams(videoBlob, obj, callback) {
    var aab;
    var buffersReady;
    var workerReady;
    var posted;

    var fileReader = new FileReader();
    fileReader.onload = function() {
        aab = this.result;
        postMessage();
    };
    fileReader.readAsArrayBuffer(videoBlob);

    if (!worker) {
        worker = processInWebWorker();
    }

    worker.onmessage = function(event) {
      //console.log('data', event);
        var message = event.data;
        if (message.type == "ready") {
            //console.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
            workerReady = true;
            if (buffersReady)
                postMessage();
        } else if (message.type == "stdout") {
            //console.log(message.data);
        } else if (message.type == "start") {
            //console.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
        } else if (message.type == "done") {
            //postMessage();
            console.log(JSON.stringify(message));
            // var result = message.data[0];
            // console.log('Result = ', result);          

            var blob = new File([videoBlob], obj.uuid + '.mp4', {
                type: 'video/mp4'
            });
            //console.log('webmp to mp4', blob);
            callback(blob);
            //PostBlob(blob);
        }
    };
    var postMessage = function() {
        posted = true;

        worker.postMessage({
            type: 'command',
            arguments: `-i ${obj.inputVideoFilePath} -i ${obj.inputLogoFilePath} \ -filter_complex "overlay=x=main_w*0.01:y=main_h*0.01" \ ${obj.outputFilePath}`.split(' '),
            files: [
                {
                    data: new Uint8Array(aab),
                    name: `${obj.uuid}.webm`
                }
            ]
        });
    };
}
// ffmpeg
function handleDataAvailable(blob) {
    
    var uuid  = Date.now();
    var videoBlob = new File([blob], uuid + '.mp4', {
        type: 'video/mp4'
    });
    //console.log('blob', videoBlob);
    
    //_watermark.getWatermarkpath();
    //console.log(videoBlob);
    //uploadfile(videoBlob, videoBlob.name);
    uploadfile(videoBlob, videoBlob.name, function(res) {
        //console.log(res);
        // convertStreams(videoBlob, {
        //     inputVideoFilePath: res.inputVideoFilePath,
        //     inputLogoFilePath: res.inputLogoFilePath,
        //     outpoutputFilePathut: res.outputFilePath,
        // }, function() {
        //     console.log('Response = ', res);
           
        // })
        var ffmpeg = require('ffmpeg');
        new ffmpeg(res.inputVideoFilePath, function (err, video) {
            if (!err) {
                console.log('The video is ready to be processed');
            } else {
                console.log('Error: ' + err);
            }
        });
        // console.log('input', res.inputVideoFilePath);
        // _watermark.setInputVideoPath(res.inputVideoFilePath);
        // _watermark.setWatermarkPath('./logo.png');
        // _watermark.setOutputFilePath(res.outputFilePath)
        // _watermark.setSettings({
        //     position        : "SE"      // Position: NE NC NW SE SC SW C CE CW
        //     , margin_nord     : null      // Margin nord
        //     , margin_sud      : null      // Margin sud
        //     , margin_east     : null      // Margin east
        //     , margin_west     : null      // Margin west
        // })
        // _watermark.convert();
    });

    
    // Yes, you can use the following command to add watermark to video:
    // -i /storage/emulated/0/Movies/Vid.mp4 -i /storage/emulated/0/Movies/logo.jpeg -filter_complex overlay=W-w-5:H-h-5 -codec:a copy -preset ultrafast -async 1 /storage/emulated/0/Movies/output.mp4
}

function onMediaSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;
    const gumVideo = document.querySelector('video#gum');
    gumVideo.srcObject = stream;
    mediaRecorder = new MediaStreamRecorder(stream);
 
    mediaRecorder.mimeType = 'video/webm';
    mediaRecorder.stream = stream;
    var recorderType = 'MediaRecorder API';//document.getElementById('video-recorderType').value;
//    if (recorderType === 'MediaRecorder API') {
//        mediaRecorder.recorderType = MediaRecorderWrapper;
//    }
//    if (recorderType === 'WebP encoding into WebM') {
//        mediaRecorder.recorderType = WhammyRecorder;
//    }
   // don't force any mimeType; use above "recorderType" instead.
   // mediaRecorder.mimeType = 'video/webm'; // video/webm or video/mp4
   //mediaRecorder.videoWidth = videoWidth;
   //mediaRecorder.videoHeight = videoHeight;
   mediaRecorder.ondataavailable = handleDataAvailable
  //  var timeInterval = 5;//document.querySelector('#time-interval').value;
  //  if (timeInterval) timeInterval = parseInt(timeInterval);
  //  else timeInterval = 5 * 1000;
   // get blob after specific time interval
   mediaRecorder.start(5000);
   //return false;
   //document.querySelector('#stop-recording').disabled = false;
 }

function onMediaError(e) {
   console.error('media error', e);
}

var videosContainer = document.getElementById('videos-container');
var index = 1;
// below function via: http://goo.gl/B3ae8c
function bytesToSize(bytes) {
   var k = 1000;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes === 0) return '0 Bytes';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// below function via: http://goo.gl/6QNDcI
function getTimeLength(milliseconds) {
   var data = new Date(milliseconds);
   return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
}

window.onbeforeunload = function() {
   document.querySelector('button#record').disabled = false;
  initialStart();
};

 // CALLL FROM TIMER.JS FILE ON START BUTTON
 function initialStart(){
  // console.log('video initialize');
 $('video#recorded').trigger('click');
}

// CALLL FROM SCRIPT.JS FILE ON EXAMEND FUNCTION

function stopVideo(){
  $('#stop-recording').trigger('click');
}
function stopRecording() {
    mediaRecorder.stop();
  }
function uploadfile(blob,filename, callback){
  var formData = new FormData();
  formData.append('files', blob);
  formData.append('filename',filename);
  $.ajax({
      type: 'POST',
      url : 'http://localhost/webm-tomp4/save.php',
      data: formData,
      processData: false,
      contentType: false,
      success: callback,
  });
}
recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Start Recording') {
        //recordButton.disabled = true;
        recordButton.textContent = 'Stop Recording';
        console.log('Start Recording')
        captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
    } else {
        stopRecording();
        
        console.log('Stop Recording')
        recordButton.textContent = 'Start Recording'
    }
});
// stopButton.addEventListener('click', () => {
//     if (stopButton.textContent === 'Stop Recording') {
//         stopButton.disabled = true;
//         stopRecording();
//         console.log('recording stop')
//         //captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
//     } 
// });