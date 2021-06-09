/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

/* globals MediaRecorder */

// let mediaRecorder;
// let recordedBlobs;

// const codecPreferences = document.querySelector('#codecPreferences');

// const errorMsgElement = document.querySelector('span#errorMsg');
// const recordedVideo = document.querySelector('video#recorded');
// const recordButton = document.querySelector('button#record');
// recordButton.addEventListener('click', () => {
//   if (recordButton.textContent === 'Start Recording') {
//     startRecording();
//   } else {
//     stopRecording();
//     recordButton.textContent = 'Start Recording';
//     playButton.disabled = false;
//     downloadButton.disabled = false;
//     codecPreferences.disabled = false;
//   }
// });

// const playButton = document.querySelector('button#play');
// playButton.addEventListener('click', () => {
//   const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value.split(';', 1)[0];
//   const superBuffer = new Blob(recordedBlobs, {type: mimeType});
//   recordedVideo.src = null;
//   recordedVideo.srcObject = null;
//   recordedVideo.src = window.URL.createObjectURL(superBuffer);
//   recordedVideo.controls = true;
//   recordedVideo.play();
// });

// const downloadButton = document.querySelector('button#download');
// downloadButton.addEventListener('click', () => {
//   const blob = new Blob(recordedBlobs, {type: 'video/webm'});
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.style.display = 'none';
//   a.href = url;
//   a.download = 'test.webm';
//   document.body.appendChild(a);
//   a.click();
//   setTimeout(() => {
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   }, 100);
// });

// function handleDataAvailable(event) {
//   console.log('handleDataAvailable', event);
//   if (event.data && event.data.size > 0) {
//     recordedBlobs.push(event.data);
//   }
// }

// function getSupportedMimeTypes() {
//   const possibleTypes = [
//     'video/webm;codecs=vp9,opus',
//     'video/webm;codecs=vp8,opus',
//     'video/webm;codecs=h264,opus',
//     'video/mp4;codecs=h264,aac',
//   ];
//   return possibleTypes.filter(mimeType => {
//     return MediaRecorder.isTypeSupported(mimeType);
//   });
// }

// function startRecording() {
//   recordedBlobs = [];
//   const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value;
//   const options = {mimeType};

//   try {
//     mediaRecorder = new MediaRecorder(window.stream, options);
//   } catch (e) {
//     console.error('Exception while creating MediaRecorder:', e);
//     errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
//     return;
//   }

//   console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
//   recordButton.textContent = 'Stop Recording';
//   playButton.disabled = true;
//   downloadButton.disabled = true;
//   codecPreferences.disabled = true;
//   mediaRecorder.onstop = (event) => {
//     console.log('Recorder stopped: ', event);
//     console.log('Recorded Blobs: ', recordedBlobs);
//   };
//   mediaRecorder.ondataavailable = handleDataAvailable;
//   mediaRecorder.start();
//   console.log('MediaRecorder started', mediaRecorder);
// }

// function stopRecording() {
//   mediaRecorder.stop();
// }

// function handleSuccess(stream) {
//   recordButton.disabled = false;
//   console.log('getUserMedia() got stream:', stream);
//   window.stream = stream;

//   const gumVideo = document.querySelector('video#gum');
//   gumVideo.srcObject = stream;

//   getSupportedMimeTypes().forEach(mimeType => {
//     const option = document.createElement('option');
//     option.value = mimeType;
//     option.innerText = option.value;
//     codecPreferences.appendChild(option);
//   });
//   codecPreferences.disabled = false;
// }

// async function init(constraints) {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia(constraints);
//     handleSuccess(stream);
//   } catch (e) {
//     console.error('navigator.getUserMedia error:', e);
//     errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
//   }
// }

// document.querySelector('button#start').addEventListener('click', async () => {
//   document.querySelector('button#start').disabled = true;
//   const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
//   const constraints = {
//     audio: {
//       echoCancellation: {exact: hasEchoCancellation}
//     },
//     video: {
//       width: 1280, height: 720
//     }
//   };
//   console.log('Using media constraints:', constraints);
//   await init(constraints);
// });

/** Testofy Code */
var inner = document.querySelector('.inner');
var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
if(document.domain == 'localhost') {
    workerPath = location.href.replace(location.href.split('/').pop(), '') + 'ffmpeg_asm.js';
}

function processInWebWorker() {
    var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
        type: 'application/javascript'
    }));

    var worker = new Worker(blob);
    URL.revokeObjectURL(blob);
    return worker;
}

var worker;
var finalBlob = null;
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
            var result = message.data[0];
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
            arguments: '-i video.webm -c:v mpeg4 -b:v 6400k -strict experimental output.mp4'.split(' '),
            files: [
                {
                    data: new Uint8Array(aab),
                    name: 'video.webm'
                }
            ]
        });
    };
}

function PostBlob(blob) {
    var video = document.createElement('video');
    video.controls = true;

    var source = document.createElement('source');
    source.src = URL.createObjectURL(blob);
    //source.type = 'video/mp4; codecs=mpeg4';
    video.appendChild(source);

    video.download = 'Play mp4 in VLC Player.mp4';

    inner.appendChild(document.createElement('hr'));
    var h2 = document.createElement('h2');
    h2.innerHTML = '<a href="' + source.src + '" target="_blank" download="Play mp4 in VLC Player.mp4" style="font-size:200%;color:red;">Download Converted mp4 and play in VLC player!</a>';
    inner.appendChild(h2);
    h2.style.display = 'block';
    inner.appendChild(video);

    video.tabIndex = 0;
    video.focus();
    video.play();

   // document.querySelector('#record-video').disabled = false;
}
function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
  navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}
var mediaConstraints = {
   audio: true, // record both audio/video in Firefox/Chrome
   video: true
};

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
   
document.querySelector('button#record').onclick = function() {
   this.disabled = true;
   captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
};

// document.querySelector('#stop-recording').onclick = function() {
//    this.disabled = true;
//    console.warn('Just stopped the recording');
//    mediaRecorder.stop();
//    // mediaRecorder.stream.stop();
//    //alertFunc();                                
//    document.querySelector('button#record').disabled = false;
// };
   

var mediaRecorder;

function onMediaSuccess(stream) {
 
   if($(".largeimage").length>0){
       $('.largeimage').remove();
   }

  //  var video = document.createElement('video');
  //  video.classList.add("largeimage");
  //  //var videoWidth = 200;
  //  //var videoHeight = 350;
    

  //  video = mergeProps(video, {
  //      controls: true,
  //      muted: true,
  //      //width: videoWidth,
  //      //height: videoHeight
  //  });
  //  video.srcObject = stream;
  //  video.play();
  //  videosContainer.appendChild(video);
   //videosContainer.appendChild(document.createElement('hr'));
   mediaRecorder = new MediaStreamRecorder(stream);
 
   mediaRecorder.mimeType = 'video/webm';
   mediaRecorder.stream = stream;
   var recorderType = 'MediaRecorder API';//document.getElementById('video-recorderType').value;
   if (recorderType === 'MediaRecorder API') {
       mediaRecorder.recorderType = MediaRecorderWrapper;
   }
   if (recorderType === 'WebP encoding into WebM') {
       mediaRecorder.recorderType = WhammyRecorder;
   }
   // don't force any mimeType; use above "recorderType" instead.
   // mediaRecorder.mimeType = 'video/webm'; // video/webm or video/mp4
   //mediaRecorder.videoWidth = videoWidth;
   //mediaRecorder.videoHeight = videoHeight;
   mediaRecorder.ondataavailable = function(blob) {
       //var filename=Date.now()+".webm";
       /*var file = new File([blob], 'msr-' + (new Date).toISOString().replace(/:|\./g, '-') + '.webm', {
           type: 'video/webm'
       });*/
       var uuid  = Date.now();
       var file = new File([blob], uuid + '.webm', {
           type: 'video/webm'
       });
       //console.log('webmp raw file', file);
       var filename=  file.name; 
      // console.log(filename);
       convertStreams(blob, {uuid: uuid, file: file}, function(res) {
        // console.log('res', res);
         uploadfile(res,res.name);
         //console.timeEnd();
       })
       //uploadfilename(filename);

       //uploadfile(blob,filename);    
      // console.log('final blob', finalBlob);                
   };
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
   //document.querySelector('button#record').disabled = false;
  // initialStart();
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

function uploadfile(blob,filename){
  

  // console.log('upload + filename', blob, filename);
  
  var formData = new FormData();
  formData.append('files', blob);
  formData.append('filename',filename);
  // formData.append('postfilename', filename);
  // formData.append('client', client);
  // formData.append('assessmentid', assessment);
  // formData.append('candidateid', candidatenameID);
  // formData.append('questionid', questionID);
  // console.log(formData);
  $.ajax({
      type: 'POST',
      url : 'https://testofy.localhost/assessment/index/test',
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function() {
        
      },
      success: function(res) {    
          console.log(res);
         
      },
  });

}