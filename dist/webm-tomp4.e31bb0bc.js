// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"MediaStreamRecorder.min.js":[function(require,module,exports) {
var global = arguments[3];
var define;
'use strict'; // Last time updated: 2017-08-31 4:03:23 AM UTC
// __________________________
// MediaStreamRecorder v1.3.4
// Open-Sourced: https://github.com/streamproc/MediaStreamRecorder
// --------------------------------------------------
// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// --------------------------------------------------

"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function MediaStreamRecorder(mediaStream) {
  if (!mediaStream) throw "MediaStream is mandatory.";
  this.start = function (timeSlice) {
    var Recorder;
    "undefined" != typeof MediaRecorder ? Recorder = MediaRecorderWrapper : (IsChrome || IsOpera || IsEdge) && (this.mimeType.indexOf("video") !== -1 ? Recorder = WhammyRecorder : this.mimeType.indexOf("audio") !== -1 && (Recorder = StereoAudioRecorder)), "image/gif" === this.mimeType && (Recorder = GifRecorder), "audio/wav" !== this.mimeType && "audio/pcm" !== this.mimeType || (Recorder = StereoAudioRecorder), this.recorderType && (Recorder = this.recorderType), mediaRecorder = new Recorder(mediaStream), mediaRecorder.blobs = [];
    var self = this;
    mediaRecorder.ondataavailable = function (data) {
      mediaRecorder.blobs.push(data), self.ondataavailable(data);
    }, mediaRecorder.onstop = this.onstop, mediaRecorder.onStartedDrawingNonBlankFrames = this.onStartedDrawingNonBlankFrames, mediaRecorder = mergeProps(mediaRecorder, this), mediaRecorder.start(timeSlice);
  }, this.onStartedDrawingNonBlankFrames = function () {}, this.clearOldRecordedFrames = function () {
    mediaRecorder && mediaRecorder.clearOldRecordedFrames();
  }, this.stop = function () {
    mediaRecorder && mediaRecorder.stop();
  }, this.ondataavailable = function (blob) {
    this.disableLogs || console.log("ondataavailable..", blob);
  }, this.onstop = function (error) {
    console.warn("stopped..", error);
  }, this.save = function (file, fileName) {
    if (!file) {
      if (!mediaRecorder) return;
      return void ConcatenateBlobs(mediaRecorder.blobs, mediaRecorder.blobs[0].type, function (concatenatedBlob) {
        invokeSaveAsDialog(concatenatedBlob);
      });
    }

    invokeSaveAsDialog(file, fileName);
  }, this.pause = function () {
    mediaRecorder && (mediaRecorder.pause(), this.disableLogs || console.log("Paused recording.", this.mimeType || mediaRecorder.mimeType));
  }, this.resume = function () {
    mediaRecorder && (mediaRecorder.resume(), this.disableLogs || console.log("Resumed recording.", this.mimeType || mediaRecorder.mimeType));
  }, this.recorderType = null, this.mimeType = "video/webm", this.disableLogs = !1;
  var mediaRecorder;
}

function MultiStreamRecorder(arrayOfMediaStreams, options) {
  function getVideoTracks() {
    var tracks = [];
    return arrayOfMediaStreams.forEach(function (stream) {
      stream.getVideoTracks().forEach(function (track) {
        tracks.push(track);
      });
    }), tracks;
  }

  arrayOfMediaStreams = arrayOfMediaStreams || [], arrayOfMediaStreams instanceof MediaStream && (arrayOfMediaStreams = [arrayOfMediaStreams]);
  var mixer,
      mediaRecorder,
      self = this;
  options = options || {
    mimeType: "video/webm",
    video: {
      width: 360,
      height: 240
    }
  }, options.frameInterval || (options.frameInterval = 10), options.video || (options.video = {}), options.video.width || (options.video.width = 360), options.video.height || (options.video.height = 240), this.start = function (timeSlice) {
    mixer = new MultiStreamsMixer(arrayOfMediaStreams), getVideoTracks().length && (mixer.frameInterval = options.frameInterval || 10, mixer.width = options.video.width || 360, mixer.height = options.video.height || 240, mixer.startDrawingFrames()), "function" == typeof self.previewStream && self.previewStream(mixer.getMixedStream()), mediaRecorder = new MediaStreamRecorder(mixer.getMixedStream());

    for (var prop in self) {
      "function" != typeof self[prop] && (mediaRecorder[prop] = self[prop]);
    }

    mediaRecorder.ondataavailable = function (blob) {
      self.ondataavailable(blob);
    }, mediaRecorder.onstop = self.onstop, mediaRecorder.start(timeSlice);
  }, this.stop = function (callback) {
    mediaRecorder && mediaRecorder.stop(function (blob) {
      callback(blob);
    });
  }, this.pause = function () {
    mediaRecorder && mediaRecorder.pause();
  }, this.resume = function () {
    mediaRecorder && mediaRecorder.resume();
  }, this.clearRecordedData = function () {
    mediaRecorder && (mediaRecorder.clearRecordedData(), mediaRecorder = null), mixer && (mixer.releaseStreams(), mixer = null);
  }, this.addStreams = this.addStream = function (streams) {
    if (!streams) throw "First parameter is required.";
    streams instanceof Array || (streams = [streams]), arrayOfMediaStreams.concat(streams), mediaRecorder && mixer && mixer.appendStreams(streams);
  }, this.resetVideoStreams = function (streams) {
    mixer && (!streams || streams instanceof Array || (streams = [streams]), mixer.resetVideoStreams(streams));
  }, this.ondataavailable = function (blob) {
    self.disableLogs || console.log("ondataavailable", blob);
  }, this.onstop = function () {}, this.name = "MultiStreamRecorder", this.toString = function () {
    return this.name;
  };
}

function MultiStreamsMixer(arrayOfMediaStreams) {
  function drawVideosToCanvas() {
    if (!isStopDrawingFrames) {
      var videosLength = videos.length,
          fullcanvas = !1,
          remaining = [];
      videos.forEach(function (video) {
        video.stream || (video.stream = {}), video.stream.fullcanvas ? fullcanvas = video : remaining.push(video);
      }), fullcanvas ? (canvas.width = fullcanvas.stream.width, canvas.height = fullcanvas.stream.height) : remaining.length ? (canvas.width = videosLength > 1 ? 2 * remaining[0].width : remaining[0].width, canvas.height = videosLength > 2 ? 2 * remaining[0].height : remaining[0].height) : (canvas.width = self.width || 360, canvas.height = self.height || 240), fullcanvas && fullcanvas instanceof HTMLVideoElement && drawImage(fullcanvas), remaining.forEach(function (video, idx) {
        drawImage(video, idx);
      }), setTimeout(drawVideosToCanvas, self.frameInterval);
    }
  }

  function drawImage(video, idx) {
    if (!isStopDrawingFrames) {
      var x = 0,
          y = 0,
          width = video.width,
          height = video.height;
      1 === idx && (x = video.width), 2 === idx && (y = video.height), 3 === idx && (x = video.width, y = video.height), "undefined" != typeof video.stream.left && (x = video.stream.left), "undefined" != typeof video.stream.top && (y = video.stream.top), "undefined" != typeof video.stream.width && (width = video.stream.width), "undefined" != typeof video.stream.height && (height = video.stream.height), context.drawImage(video, x, y, width, height), "function" == typeof video.stream.onRender && video.stream.onRender(context, x, y, width, height, idx);
    }
  }

  function getMixedStream() {
    isStopDrawingFrames = !1;
    var mixedVideoStream = getMixedVideoStream(),
        mixedAudioStream = getMixedAudioStream();
    mixedAudioStream && mixedAudioStream.getAudioTracks().forEach(function (track) {
      mixedVideoStream.addTrack(track);
    });
    var fullcanvas;
    return arrayOfMediaStreams.forEach(function (stream) {
      stream.fullcanvas && (fullcanvas = !0);
    }), mixedVideoStream;
  }

  function getMixedVideoStream() {
    resetVideoStreams();
    var capturedStream;
    "captureStream" in canvas ? capturedStream = canvas.captureStream() : "mozCaptureStream" in canvas ? capturedStream = canvas.mozCaptureStream() : self.disableLogs || console.error("Upgrade to latest Chrome or otherwise enable this flag: chrome://flags/#enable-experimental-web-platform-features");
    var videoStream = new MediaStream();
    return capturedStream.getVideoTracks().forEach(function (track) {
      videoStream.addTrack(track);
    }), canvas.stream = videoStream, videoStream;
  }

  function getMixedAudioStream() {
    Storage.AudioContextConstructor || (Storage.AudioContextConstructor = new Storage.AudioContext()), self.audioContext = Storage.AudioContextConstructor, self.audioSources = [], self.useGainNode === !0 && (self.gainNode = self.audioContext.createGain(), self.gainNode.connect(self.audioContext.destination), self.gainNode.gain.value = 0);
    var audioTracksLength = 0;
    if (arrayOfMediaStreams.forEach(function (stream) {
      if (stream.getAudioTracks().length) {
        audioTracksLength++;
        var audioSource = self.audioContext.createMediaStreamSource(stream);
        self.useGainNode === !0 && audioSource.connect(self.gainNode), self.audioSources.push(audioSource);
      }
    }), audioTracksLength) return self.audioDestination = self.audioContext.createMediaStreamDestination(), self.audioSources.forEach(function (audioSource) {
      audioSource.connect(self.audioDestination);
    }), self.audioDestination.stream;
  }

  function getVideo(stream) {
    var video = document.createElement("video");
    return "srcObject" in video ? video.srcObject = stream : video.src = URL.createObjectURL(stream), video.muted = !0, video.volume = 0, video.width = stream.width || self.width || 360, video.height = stream.height || self.height || 240, video.play(), video;
  }

  function resetVideoStreams(streams) {
    videos = [], streams = streams || arrayOfMediaStreams, streams.forEach(function (stream) {
      if (stream.getVideoTracks().length) {
        var video = getVideo(stream);
        video.stream = stream, videos.push(video);
      }
    });
  }

  var videos = [],
      isStopDrawingFrames = !1,
      canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");
  canvas.style = "opacity:0;position:absolute;z-index:-1;top: -100000000;left:-1000000000; margin-top:-1000000000;margin-left:-1000000000;", (document.body || document.documentElement).appendChild(canvas), this.disableLogs = !1, this.frameInterval = 10, this.width = 360, this.height = 240, this.useGainNode = !0;
  var self = this,
      AudioContext = window.AudioContext;
  "undefined" == typeof AudioContext && ("undefined" != typeof webkitAudioContext && (AudioContext = webkitAudioContext), "undefined" != typeof mozAudioContext && (AudioContext = mozAudioContext));
  var URL = window.URL;
  "undefined" == typeof URL && "undefined" != typeof webkitURL && (URL = webkitURL), "undefined" != typeof navigator && "undefined" == typeof navigator.getUserMedia && ("undefined" != typeof navigator.webkitGetUserMedia && (navigator.getUserMedia = navigator.webkitGetUserMedia), "undefined" != typeof navigator.mozGetUserMedia && (navigator.getUserMedia = navigator.mozGetUserMedia));
  var MediaStream = window.MediaStream;
  "undefined" == typeof MediaStream && "undefined" != typeof webkitMediaStream && (MediaStream = webkitMediaStream), "undefined" != typeof MediaStream && ("getVideoTracks" in MediaStream.prototype || (MediaStream.prototype.getVideoTracks = function () {
    if (!this.getTracks) return [];
    var tracks = [];
    return this.getTracks.forEach(function (track) {
      track.kind.toString().indexOf("video") !== -1 && tracks.push(track);
    }), tracks;
  }, MediaStream.prototype.getAudioTracks = function () {
    if (!this.getTracks) return [];
    var tracks = [];
    return this.getTracks.forEach(function (track) {
      track.kind.toString().indexOf("audio") !== -1 && tracks.push(track);
    }), tracks;
  }), "undefined" == typeof MediaStream.prototype.stop && (MediaStream.prototype.stop = function () {
    this.getTracks().forEach(function (track) {
      track.stop();
    });
  }));
  var Storage = {};
  "undefined" != typeof AudioContext ? Storage.AudioContext = AudioContext : "undefined" != typeof webkitAudioContext && (Storage.AudioContext = webkitAudioContext), this.startDrawingFrames = function () {
    drawVideosToCanvas();
  }, this.appendStreams = function (streams) {
    if (!streams) throw "First parameter is required.";
    streams instanceof Array || (streams = [streams]), arrayOfMediaStreams.concat(streams), streams.forEach(function (stream) {
      if (stream.getVideoTracks().length) {
        var video = getVideo(stream);
        video.stream = stream, videos.push(video);
      }

      if (stream.getAudioTracks().length && self.audioContext) {
        var audioSource = self.audioContext.createMediaStreamSource(stream);
        audioSource.connect(self.audioDestination), self.audioSources.push(audioSource);
      }
    });
  }, this.releaseStreams = function () {
    videos = [], isStopDrawingFrames = !0, self.gainNode && (self.gainNode.disconnect(), self.gainNode = null), self.audioSources.length && (self.audioSources.forEach(function (source) {
      source.disconnect();
    }), self.audioSources = []), self.audioDestination && (self.audioDestination.disconnect(), self.audioDestination = null), self.audioContext = null, context.clearRect(0, 0, canvas.width, canvas.height), canvas.stream && (canvas.stream.stop(), canvas.stream = null);
  }, this.resetVideoStreams = function (streams) {
    !streams || streams instanceof Array || (streams = [streams]), resetVideoStreams(streams);
  }, this.name = "MultiStreamsMixer", this.toString = function () {
    return this.name;
  }, this.getMixedStream = getMixedStream;
}

function mergeProps(mergein, mergeto) {
  for (var t in mergeto) {
    "function" != typeof mergeto[t] && (mergein[t] = mergeto[t]);
  }

  return mergein;
}

function dropFirstFrame(arr) {
  return arr.shift(), arr;
}

function invokeSaveAsDialog(file, fileName) {
  if (!file) throw "Blob object is required.";
  if (!file.type) try {
    file.type = "video/webm";
  } catch (e) {}
  var fileExtension = (file.type || "video/webm").split("/")[1];

  if (fileName && fileName.indexOf(".") !== -1) {
    var splitted = fileName.split(".");
    fileName = splitted[0], fileExtension = splitted[1];
  }

  var fileFullName = (fileName || Math.round(9999999999 * Math.random()) + 888888888) + "." + fileExtension;
  if ("undefined" != typeof navigator.msSaveOrOpenBlob) return navigator.msSaveOrOpenBlob(file, fileFullName);
  if ("undefined" != typeof navigator.msSaveBlob) return navigator.msSaveBlob(file, fileFullName);
  var hyperlink = document.createElement("a");
  hyperlink.href = URL.createObjectURL(file), hyperlink.target = "_blank", hyperlink.download = fileFullName, navigator.mozGetUserMedia && (hyperlink.onclick = function () {
    (document.body || document.documentElement).removeChild(hyperlink);
  }, (document.body || document.documentElement).appendChild(hyperlink));
  var evt = new MouseEvent("click", {
    view: window,
    bubbles: !0,
    cancelable: !0
  });
  hyperlink.dispatchEvent(evt), navigator.mozGetUserMedia || URL.revokeObjectURL(hyperlink.href);
}

function bytesToSize(bytes) {
  var k = 1e3,
      sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (0 === bytes) return "0 Bytes";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
}

function isMediaRecorderCompatible() {
  var isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0,
      isChrome = !!window.chrome && !isOpera,
      isFirefox = "undefined" != typeof window.InstallTrigger;
  if (isFirefox) return !0;
  if (!isChrome) return !1;
  var verOffset,
      ix,
      nAgt = (navigator.appVersion, navigator.userAgent),
      fullVersion = "" + parseFloat(navigator.appVersion),
      majorVersion = parseInt(navigator.appVersion, 10);
  return isChrome && (verOffset = nAgt.indexOf("Chrome"), fullVersion = nAgt.substring(verOffset + 7)), (ix = fullVersion.indexOf(";")) !== -1 && (fullVersion = fullVersion.substring(0, ix)), (ix = fullVersion.indexOf(" ")) !== -1 && (fullVersion = fullVersion.substring(0, ix)), majorVersion = parseInt("" + fullVersion, 10), isNaN(majorVersion) && (fullVersion = "" + parseFloat(navigator.appVersion), majorVersion = parseInt(navigator.appVersion, 10)), majorVersion >= 49;
}

function MediaRecorderWrapper(mediaStream) {
  function isMediaStreamActive() {
    if ("active" in mediaStream) {
      if (!mediaStream.active) return !1;
    } else if ("ended" in mediaStream && mediaStream.ended) return !1;

    return !0;
  }

  var self = this;
  this.start = function (timeSlice, __disableLogs) {
    if (this.timeSlice = timeSlice || 5e3, self.mimeType || (self.mimeType = "video/webm"), self.mimeType.indexOf("audio") !== -1 && mediaStream.getVideoTracks().length && mediaStream.getAudioTracks().length) {
      var stream;
      navigator.mozGetUserMedia ? (stream = new MediaStream(), stream.addTrack(mediaStream.getAudioTracks()[0])) : stream = new MediaStream(mediaStream.getAudioTracks()), mediaStream = stream;
    }

    self.mimeType.indexOf("audio") !== -1 && (self.mimeType = IsChrome ? "audio/webm" : "audio/ogg"), self.dontFireOnDataAvailableEvent = !1;
    var recorderHints = {
      mimeType: self.mimeType
    };
    self.disableLogs || __disableLogs || console.log("Passing following params over MediaRecorder API.", recorderHints), mediaRecorder && (mediaRecorder = null), IsChrome && !isMediaRecorderCompatible() && (recorderHints = "video/vp8");

    try {
      mediaRecorder = new MediaRecorder(mediaStream, recorderHints);
    } catch (e) {
      mediaRecorder = new MediaRecorder(mediaStream);
    }

    "canRecordMimeType" in mediaRecorder && mediaRecorder.canRecordMimeType(self.mimeType) === !1 && (self.disableLogs || console.warn("MediaRecorder API seems unable to record mimeType:", self.mimeType)), self.ignoreMutedMedia === !0 && (mediaRecorder.ignoreMutedMedia = !0);
    var firedOnDataAvailableOnce = !1;
    mediaRecorder.ondataavailable = function (e) {
      if (e.data && e.data.size && !(e.data.size < 26800) && !firedOnDataAvailableOnce) {
        firedOnDataAvailableOnce = !0;
        var blob = self.getNativeBlob ? e.data : new Blob([e.data], {
          type: self.mimeType || "video/webm"
        });
        self.ondataavailable(blob), mediaRecorder && "recording" === mediaRecorder.state && mediaRecorder.stop(), mediaRecorder = null, self.dontFireOnDataAvailableEvent || self.start(timeSlice, "__disableLogs");
      }
    }, mediaRecorder.onerror = function (error) {
      self.disableLogs || ("InvalidState" === error.name ? console.error("The MediaRecorder is not in a state in which the proposed operation is allowed to be executed.") : "OutOfMemory" === error.name ? console.error("The UA has exhaused the available memory. User agents SHOULD provide as much additional information as possible in the message attribute.") : "IllegalStreamModification" === error.name ? console.error("A modification to the stream has occurred that makes it impossible to continue recording. An example would be the addition of a Track while recording is occurring. User agents SHOULD provide as much additional information as possible in the message attribute.") : "OtherRecordingError" === error.name ? console.error("Used for an fatal error other than those listed above. User agents SHOULD provide as much additional information as possible in the message attribute.") : "GenericError" === error.name ? console.error("The UA cannot provide the codec or recording option that has been requested.", error) : console.error("MediaRecorder Error", error)), mediaRecorder && "inactive" !== mediaRecorder.state && "stopped" !== mediaRecorder.state && mediaRecorder.stop();
    };

    try {
      mediaRecorder.start(36e5);
    } catch (e) {
      mediaRecorder = null;
    }

    setTimeout(function () {
      mediaRecorder && "recording" === mediaRecorder.state && mediaRecorder.requestData();
    }, timeSlice);
  }, this.stop = function (callback) {
    mediaRecorder && "recording" === mediaRecorder.state && (mediaRecorder.requestData(), setTimeout(function () {
      self.dontFireOnDataAvailableEvent = !0, mediaRecorder && "recording" === mediaRecorder.state && mediaRecorder.stop(), mediaRecorder = null, self.onstop();
    }, 2e3));
  }, this.pause = function () {
    mediaRecorder && ("recording" === mediaRecorder.state && mediaRecorder.pause(), this.dontFireOnDataAvailableEvent = !0);
  }, this.ondataavailable = function (blob) {
    console.log("recorded-blob", blob);
  }, this.resume = function () {
    if (this.dontFireOnDataAvailableEvent) {
      this.dontFireOnDataAvailableEvent = !1;
      var disableLogs = self.disableLogs;
      return self.disableLogs = !0, this.start(this.timeslice || 5e3), void (self.disableLogs = disableLogs);
    }

    mediaRecorder && "paused" === mediaRecorder.state && mediaRecorder.resume();
  }, this.clearRecordedData = function () {
    mediaRecorder && (this.pause(), this.dontFireOnDataAvailableEvent = !0, this.stop());
  }, this.onstop = function () {};
  var mediaRecorder;
  !function looper() {
    if (mediaRecorder) return isMediaStreamActive() === !1 ? void self.stop() : void setTimeout(looper, 1e3);
  }();
}

function StereoAudioRecorder(mediaStream) {
  this.start = function (timeSlice) {
    timeSlice = timeSlice || 1e3, mediaRecorder = new StereoAudioRecorderHelper(mediaStream, this), mediaRecorder.record(), timeout = setInterval(function () {
      mediaRecorder.requestData();
    }, timeSlice);
  }, this.stop = function () {
    mediaRecorder && (mediaRecorder.stop(), clearTimeout(timeout), this.onstop());
  }, this.pause = function () {
    mediaRecorder && mediaRecorder.pause();
  }, this.resume = function () {
    mediaRecorder && mediaRecorder.resume();
  }, this.ondataavailable = function () {}, this.onstop = function () {};
  var mediaRecorder, timeout;
}

function StereoAudioRecorderHelper(mediaStream, root) {
  function interleave(leftChannel, rightChannel) {
    for (var length = leftChannel.length + rightChannel.length, result = new Float32Array(length), inputIndex = 0, index = 0; index < length;) {
      result[index++] = leftChannel[inputIndex], result[index++] = rightChannel[inputIndex], inputIndex++;
    }

    return result;
  }

  function mergeBuffers(channelBuffer, recordingLength) {
    for (var result = new Float32Array(recordingLength), offset = 0, lng = channelBuffer.length, i = 0; i < lng; i++) {
      var buffer = channelBuffer[i];
      result.set(buffer, offset), offset += buffer.length;
    }

    return result;
  }

  function writeUTFBytes(view, offset, string) {
    for (var lng = string.length, i = 0; i < lng; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  function convertoFloat32ToInt16(buffer) {
    for (var l = buffer.length, buf = new Int16Array(l); l--;) {
      buf[l] = 65535 * buffer[l];
    }

    return buf.buffer;
  }

  var deviceSampleRate = 44100;
  ObjectStore.AudioContextConstructor || (ObjectStore.AudioContextConstructor = new ObjectStore.AudioContext()), deviceSampleRate = ObjectStore.AudioContextConstructor.sampleRate;
  var scriptprocessornode,
      volume,
      audioInput,
      context,
      leftchannel = [],
      rightchannel = [],
      recording = !1,
      recordingLength = 0,
      sampleRate = root.sampleRate || deviceSampleRate,
      mimeType = root.mimeType || "audio/wav",
      isPCM = mimeType.indexOf("audio/pcm") > -1,
      numChannels = root.audioChannels || 2;
  this.record = function () {
    recording = !0, leftchannel.length = rightchannel.length = 0, recordingLength = 0;
  }, this.requestData = function () {
    if (!isPaused) {
      if (0 === recordingLength) return void (requestDataInvoked = !1);
      requestDataInvoked = !0;
      var internalLeftChannel = leftchannel.slice(0),
          internalRightChannel = rightchannel.slice(0),
          internalRecordingLength = recordingLength;
      leftchannel.length = rightchannel.length = [], recordingLength = 0, requestDataInvoked = !1;
      var leftBuffer = mergeBuffers(internalLeftChannel, internalRecordingLength),
          interleaved = leftBuffer;

      if (2 === numChannels) {
        var rightBuffer = mergeBuffers(internalRightChannel, internalRecordingLength);
        interleaved = interleave(leftBuffer, rightBuffer);
      }

      if (isPCM) {
        var blob = new Blob([convertoFloat32ToInt16(interleaved)], {
          type: "audio/pcm"
        });
        return console.debug("audio recorded blob size:", bytesToSize(blob.size)), void root.ondataavailable(blob);
      }

      var buffer = new ArrayBuffer(44 + 2 * interleaved.length),
          view = new DataView(buffer);
      writeUTFBytes(view, 0, "RIFF"), view.setUint32(4, 44 + 2 * interleaved.length - 8, !0), writeUTFBytes(view, 8, "WAVE"), writeUTFBytes(view, 12, "fmt "), view.setUint32(16, 16, !0), view.setUint16(20, 1, !0), view.setUint16(22, numChannels, !0), view.setUint32(24, sampleRate, !0), view.setUint32(28, sampleRate * numChannels * 2, !0), view.setUint16(32, 2 * numChannels, !0), view.setUint16(34, 16, !0), writeUTFBytes(view, 36, "data"), view.setUint32(40, 2 * interleaved.length, !0);

      for (var lng = interleaved.length, index = 44, volume = 1, i = 0; i < lng; i++) {
        view.setInt16(index, interleaved[i] * (32767 * volume), !0), index += 2;
      }

      var blob = new Blob([view], {
        type: "audio/wav"
      });
      console.debug("audio recorded blob size:", bytesToSize(blob.size)), root.ondataavailable(blob);
    }
  }, this.stop = function () {
    recording = !1, this.requestData(), audioInput.disconnect(), this.onstop();
  };
  var context = ObjectStore.AudioContextConstructor;
  ObjectStore.VolumeGainNode = context.createGain();
  var volume = ObjectStore.VolumeGainNode;
  ObjectStore.AudioInput = context.createMediaStreamSource(mediaStream);
  var audioInput = ObjectStore.AudioInput;
  audioInput.connect(volume);
  var bufferSize = root.bufferSize || 2048;
  if (0 === root.bufferSize && (bufferSize = 0), context.createJavaScriptNode) scriptprocessornode = context.createJavaScriptNode(bufferSize, numChannels, numChannels);else {
    if (!context.createScriptProcessor) throw "WebAudio API has no support on this browser.";
    scriptprocessornode = context.createScriptProcessor(bufferSize, numChannels, numChannels);
  }
  bufferSize = scriptprocessornode.bufferSize, console.debug("using audio buffer-size:", bufferSize);
  var requestDataInvoked = !1;
  window.scriptprocessornode = scriptprocessornode, 1 === numChannels && console.debug("All right-channels are skipped.");
  var isPaused = !1;
  this.pause = function () {
    isPaused = !0;
  }, this.resume = function () {
    isPaused = !1;
  }, this.onstop = function () {}, scriptprocessornode.onaudioprocess = function (e) {
    if (recording && !requestDataInvoked && !isPaused) {
      var left = e.inputBuffer.getChannelData(0);

      if (leftchannel.push(new Float32Array(left)), 2 === numChannels) {
        var right = e.inputBuffer.getChannelData(1);
        rightchannel.push(new Float32Array(right));
      }

      recordingLength += bufferSize;
    }
  }, volume.connect(scriptprocessornode), scriptprocessornode.connect(context.destination);
}

function WhammyRecorder(mediaStream) {
  this.start = function (timeSlice) {
    timeSlice = timeSlice || 1e3, mediaRecorder = new WhammyRecorderHelper(mediaStream, this);

    for (var prop in this) {
      "function" != typeof this[prop] && (mediaRecorder[prop] = this[prop]);
    }

    mediaRecorder.record(), timeout = setInterval(function () {
      mediaRecorder.requestData();
    }, timeSlice);
  }, this.stop = function () {
    mediaRecorder && (mediaRecorder.stop(), clearTimeout(timeout), this.onstop());
  }, this.onstop = function () {}, this.clearOldRecordedFrames = function () {
    mediaRecorder && mediaRecorder.clearOldRecordedFrames();
  }, this.pause = function () {
    mediaRecorder && mediaRecorder.pause();
  }, this.resume = function () {
    mediaRecorder && mediaRecorder.resume();
  }, this.ondataavailable = function () {};
  var mediaRecorder, timeout;
}

function WhammyRecorderHelper(mediaStream, root) {
  function drawFrames() {
    if (isPaused) return lastTime = new Date().getTime(), void setTimeout(drawFrames, 500);

    if (!isStopDrawing) {
      if (requestDataInvoked) return setTimeout(drawFrames, 100);
      var duration = new Date().getTime() - lastTime;
      if (!duration) return drawFrames();
      lastTime = new Date().getTime(), !self.isHTMLObject && video.paused && video.play(), context.drawImage(video, 0, 0, canvas.width, canvas.height), isStopDrawing || whammy.frames.push({
        duration: duration,
        image: canvas.toDataURL("image/webp")
      }), isOnStartedDrawingNonBlankFramesInvoked || isBlankFrame(whammy.frames[whammy.frames.length - 1]) || (isOnStartedDrawingNonBlankFramesInvoked = !0, root.onStartedDrawingNonBlankFrames()), setTimeout(drawFrames, 10);
    }
  }

  function isBlankFrame(frame, _pixTolerance, _frameTolerance) {
    var localCanvas = document.createElement("canvas");
    localCanvas.width = canvas.width, localCanvas.height = canvas.height;
    var matchPixCount,
        endPixCheck,
        maxPixCount,
        context2d = localCanvas.getContext("2d"),
        sampleColor = {
      r: 0,
      g: 0,
      b: 0
    },
        maxColorDifference = Math.sqrt(Math.pow(255, 2) + Math.pow(255, 2) + Math.pow(255, 2)),
        pixTolerance = _pixTolerance && _pixTolerance >= 0 && _pixTolerance <= 1 ? _pixTolerance : 0,
        frameTolerance = _frameTolerance && _frameTolerance >= 0 && _frameTolerance <= 1 ? _frameTolerance : 0,
        image = new Image();
    image.src = frame.image, context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
    var imageData = context2d.getImageData(0, 0, canvas.width, canvas.height);
    matchPixCount = 0, endPixCheck = imageData.data.length, maxPixCount = imageData.data.length / 4;

    for (var pix = 0; pix < endPixCheck; pix += 4) {
      var currentColor = {
        r: imageData.data[pix],
        g: imageData.data[pix + 1],
        b: imageData.data[pix + 2]
      },
          colorDifference = Math.sqrt(Math.pow(currentColor.r - sampleColor.r, 2) + Math.pow(currentColor.g - sampleColor.g, 2) + Math.pow(currentColor.b - sampleColor.b, 2));
      colorDifference <= maxColorDifference * pixTolerance && matchPixCount++;
    }

    return !(maxPixCount - matchPixCount <= maxPixCount * frameTolerance);
  }

  function dropBlackFrames(_frames, _framesToCheck, _pixTolerance, _frameTolerance) {
    var localCanvas = document.createElement("canvas");
    localCanvas.width = canvas.width, localCanvas.height = canvas.height;

    for (var context2d = localCanvas.getContext("2d"), resultFrames = [], checkUntilNotBlack = _framesToCheck === -1, endCheckFrame = _framesToCheck && _framesToCheck > 0 && _framesToCheck <= _frames.length ? _framesToCheck : _frames.length, sampleColor = {
      r: 0,
      g: 0,
      b: 0
    }, maxColorDifference = Math.sqrt(Math.pow(255, 2) + Math.pow(255, 2) + Math.pow(255, 2)), pixTolerance = _pixTolerance && _pixTolerance >= 0 && _pixTolerance <= 1 ? _pixTolerance : 0, frameTolerance = _frameTolerance && _frameTolerance >= 0 && _frameTolerance <= 1 ? _frameTolerance : 0, doNotCheckNext = !1, f = 0; f < endCheckFrame; f++) {
      var matchPixCount, endPixCheck, maxPixCount;

      if (!doNotCheckNext) {
        var image = new Image();
        image.src = _frames[f].image, context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
        var imageData = context2d.getImageData(0, 0, canvas.width, canvas.height);
        matchPixCount = 0, endPixCheck = imageData.data.length, maxPixCount = imageData.data.length / 4;

        for (var pix = 0; pix < endPixCheck; pix += 4) {
          var currentColor = {
            r: imageData.data[pix],
            g: imageData.data[pix + 1],
            b: imageData.data[pix + 2]
          },
              colorDifference = Math.sqrt(Math.pow(currentColor.r - sampleColor.r, 2) + Math.pow(currentColor.g - sampleColor.g, 2) + Math.pow(currentColor.b - sampleColor.b, 2));
          colorDifference <= maxColorDifference * pixTolerance && matchPixCount++;
        }
      }

      !doNotCheckNext && maxPixCount - matchPixCount <= maxPixCount * frameTolerance || (checkUntilNotBlack && (doNotCheckNext = !0), resultFrames.push(_frames[f]));
    }

    return resultFrames = resultFrames.concat(_frames.slice(endCheckFrame)), resultFrames.length <= 0 && resultFrames.push(_frames[_frames.length - 1]), resultFrames;
  }

  this.record = function (timeSlice) {
    this.width || (this.width = 320), this.height || (this.height = 240), this.video && this.video instanceof HTMLVideoElement && (this.width || (this.width = video.videoWidth || video.clientWidth || 320), this.height || (this.height = video.videoHeight || video.clientHeight || 240)), this.video || (this.video = {
      width: this.width,
      height: this.height
    }), this.canvas && this.canvas.width && this.canvas.height || (this.canvas = {
      width: this.width,
      height: this.height
    }), canvas.width = this.canvas.width, canvas.height = this.canvas.height, this.video && this.video instanceof HTMLVideoElement ? (this.isHTMLObject = !0, video = this.video.cloneNode()) : (video = document.createElement("video"), video.src = URL.createObjectURL(mediaStream), video.width = this.video.width, video.height = this.video.height), video.muted = !0, video.play(), lastTime = new Date().getTime(), whammy = new Whammy.Video(root.speed, root.quality), console.log("canvas resolutions", canvas.width, "*", canvas.height), console.log("video width/height", video.width || canvas.width, "*", video.height || canvas.height), drawFrames();
  }, this.clearOldRecordedFrames = function () {
    whammy.frames = [];
  };
  var requestDataInvoked = !1;

  this.requestData = function () {
    if (!isPaused) {
      if (!whammy.frames.length) return void (requestDataInvoked = !1);
      requestDataInvoked = !0;
      var internalFrames = whammy.frames.slice(0);
      whammy.frames = dropBlackFrames(internalFrames, -1), whammy.compile(function (whammyBlob) {
        root.ondataavailable(whammyBlob), console.debug("video recorded blob size:", bytesToSize(whammyBlob.size));
      }), whammy.frames = [], requestDataInvoked = !1;
    }
  };

  var isOnStartedDrawingNonBlankFramesInvoked = !1,
      isStopDrawing = !1;

  this.stop = function () {
    isStopDrawing = !0, this.requestData(), this.onstop();
  };

  var video,
      lastTime,
      whammy,
      canvas = document.createElement("canvas"),
      context = canvas.getContext("2d"),
      self = this,
      isPaused = !1;
  this.pause = function () {
    isPaused = !0;
  }, this.resume = function () {
    isPaused = !1;
  }, this.onstop = function () {};
}

function GifRecorder(mediaStream) {
  function doneRecording() {
    endTime = Date.now();
    var gifBlob = new Blob([new Uint8Array(gifEncoder.stream().bin)], {
      type: "image/gif"
    });
    self.ondataavailable(gifBlob), gifEncoder.stream().bin = [];
  }

  if ("undefined" == typeof GIFEncoder) throw "Please link: https://cdn.webrtc-experiment.com/gif-recorder.js";
  this.start = function (timeSlice) {
    function drawVideoFrame(time) {
      return isPaused ? void setTimeout(drawVideoFrame, 500, time) : (lastAnimationFrame = requestAnimationFrame(drawVideoFrame), void 0 === _typeof(lastFrameTime) && (lastFrameTime = time), void (time - lastFrameTime < 90 || (video.paused && video.play(), context.drawImage(video, 0, 0, imageWidth, imageHeight), gifEncoder.addFrame(context), lastFrameTime = time)));
    }

    timeSlice = timeSlice || 1e3;
    var imageWidth = this.videoWidth || 320,
        imageHeight = this.videoHeight || 240;
    canvas.width = video.width = imageWidth, canvas.height = video.height = imageHeight, gifEncoder = new GIFEncoder(), gifEncoder.setRepeat(0), gifEncoder.setDelay(this.frameRate || this.speed || 200), gifEncoder.setQuality(this.quality || 1), gifEncoder.start(), startTime = Date.now(), lastAnimationFrame = requestAnimationFrame(drawVideoFrame), timeout = setTimeout(doneRecording, timeSlice);
  }, this.stop = function () {
    lastAnimationFrame && (cancelAnimationFrame(lastAnimationFrame), clearTimeout(timeout), doneRecording(), this.onstop());
  }, this.onstop = function () {};
  var isPaused = !1;
  this.pause = function () {
    isPaused = !0;
  }, this.resume = function () {
    isPaused = !1;
  }, this.ondataavailable = function () {}, this.onstop = function () {};
  var self = this,
      canvas = document.createElement("canvas"),
      context = canvas.getContext("2d"),
      video = document.createElement("video");
  video.muted = !0, video.autoplay = !0, video.src = URL.createObjectURL(mediaStream), video.play();
  var startTime,
      endTime,
      lastFrameTime,
      gifEncoder,
      timeout,
      lastAnimationFrame = null;
}

"undefined" != typeof MediaStreamRecorder && (MediaStreamRecorder.MultiStreamRecorder = MultiStreamRecorder);
var browserFakeUserAgent = "Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45";
!function (that) {
  "undefined" == typeof window && ("undefined" == typeof window && "undefined" != typeof global ? (global.navigator = {
    userAgent: browserFakeUserAgent,
    getUserMedia: function getUserMedia() {}
  }, that.window = global) : "undefined" == typeof window, "undefined" == typeof document && (that.document = {}, document.createElement = document.captureStream = document.mozCaptureStream = function () {
    return {};
  }), "undefined" == typeof location && (that.location = {
    protocol: "file:",
    href: "",
    hash: ""
  }), "undefined" == typeof screen && (that.screen = {
    width: 0,
    height: 0
  }));
}("undefined" != typeof global ? global : window);
var AudioContext = window.AudioContext;
"undefined" == typeof AudioContext && ("undefined" != typeof webkitAudioContext && (AudioContext = webkitAudioContext), "undefined" != typeof mozAudioContext && (AudioContext = mozAudioContext)), "undefined" == typeof window && (window = {});
var AudioContext = window.AudioContext;
"undefined" == typeof AudioContext && ("undefined" != typeof webkitAudioContext && (AudioContext = webkitAudioContext), "undefined" != typeof mozAudioContext && (AudioContext = mozAudioContext));
var URL = window.URL;
"undefined" == typeof URL && "undefined" != typeof webkitURL && (URL = webkitURL), "undefined" != typeof navigator ? ("undefined" != typeof navigator.webkitGetUserMedia && (navigator.getUserMedia = navigator.webkitGetUserMedia), "undefined" != typeof navigator.mozGetUserMedia && (navigator.getUserMedia = navigator.mozGetUserMedia)) : navigator = {
  getUserMedia: function getUserMedia() {},
  userAgent: browserFakeUserAgent
};
var IsEdge = !(navigator.userAgent.indexOf("Edge") === -1 || !navigator.msSaveBlob && !navigator.msSaveOrOpenBlob),
    IsOpera = !1;
"undefined" != typeof opera && navigator.userAgent && navigator.userAgent.indexOf("OPR/") !== -1 && (IsOpera = !0);
var IsChrome = !IsEdge && !IsEdge && !!navigator.webkitGetUserMedia,
    MediaStream = window.MediaStream;
"undefined" == typeof MediaStream && "undefined" != typeof webkitMediaStream && (MediaStream = webkitMediaStream), "undefined" != typeof MediaStream && ("getVideoTracks" in MediaStream.prototype || (MediaStream.prototype.getVideoTracks = function () {
  if (!this.getTracks) return [];
  var tracks = [];
  return this.getTracks.forEach(function (track) {
    track.kind.toString().indexOf("video") !== -1 && tracks.push(track);
  }), tracks;
}, MediaStream.prototype.getAudioTracks = function () {
  if (!this.getTracks) return [];
  var tracks = [];
  return this.getTracks.forEach(function (track) {
    track.kind.toString().indexOf("audio") !== -1 && tracks.push(track);
  }), tracks;
}), "stop" in MediaStream.prototype || (MediaStream.prototype.stop = function () {
  this.getAudioTracks().forEach(function (track) {
    track.stop && track.stop();
  }), this.getVideoTracks().forEach(function (track) {
    track.stop && track.stop();
  });
})), "undefined" != typeof location && 0 === location.href.indexOf("file:") && console.error("Please load this HTML file on HTTP or HTTPS.");
var ObjectStore = {
  AudioContext: AudioContext
};
"undefined" != typeof MediaStreamRecorder && (MediaStreamRecorder.MediaRecorderWrapper = MediaRecorderWrapper), "undefined" != typeof MediaStreamRecorder && (MediaStreamRecorder.StereoAudioRecorder = StereoAudioRecorder), "undefined" != typeof MediaStreamRecorder && (MediaStreamRecorder.StereoAudioRecorderHelper = StereoAudioRecorderHelper), "undefined" != typeof MediaStreamRecorder && (MediaStreamRecorder.WhammyRecorder = WhammyRecorder), "undefined" != typeof MediaStreamRecorder && (MediaStreamRecorder.WhammyRecorderHelper = WhammyRecorderHelper), "undefined" != typeof MediaStreamRecorder && (MediaStreamRecorder.GifRecorder = GifRecorder);

var Whammy = function () {
  function WhammyVideo(duration, quality) {
    this.frames = [], duration || (duration = 1), this.duration = 1e3 / duration, this.quality = quality || .8;
  }

  function processInWebWorker(_function) {
    var blob = URL.createObjectURL(new Blob([_function.toString(), "this.onmessage =  function (e) {" + _function.name + "(e.data);}"], {
      type: "application/javascript"
    })),
        worker = new Worker(blob);
    return URL.revokeObjectURL(blob), worker;
  }

  function whammyInWebWorker(frames) {
    function ArrayToWebM(frames) {
      var info = checkFrames(frames);
      if (!info) return [];

      for (var clusterMaxDuration = 3e4, EBML = [{
        id: 440786851,
        data: [{
          data: 1,
          id: 17030
        }, {
          data: 1,
          id: 17143
        }, {
          data: 4,
          id: 17138
        }, {
          data: 8,
          id: 17139
        }, {
          data: "webm",
          id: 17026
        }, {
          data: 2,
          id: 17031
        }, {
          data: 2,
          id: 17029
        }]
      }, {
        id: 408125543,
        data: [{
          id: 357149030,
          data: [{
            data: 1e6,
            id: 2807729
          }, {
            data: "whammy",
            id: 19840
          }, {
            data: "whammy",
            id: 22337
          }, {
            data: doubleToString(info.duration),
            id: 17545
          }]
        }, {
          id: 374648427,
          data: [{
            id: 174,
            data: [{
              data: 1,
              id: 215
            }, {
              data: 1,
              id: 29637
            }, {
              data: 0,
              id: 156
            }, {
              data: "und",
              id: 2274716
            }, {
              data: "V_VP8",
              id: 134
            }, {
              data: "VP8",
              id: 2459272
            }, {
              data: 1,
              id: 131
            }, {
              id: 224,
              data: [{
                data: info.width,
                id: 176
              }, {
                data: info.height,
                id: 186
              }]
            }]
          }]
        }]
      }], frameNumber = 0, clusterTimecode = 0; frameNumber < frames.length;) {
        var clusterFrames = [],
            clusterDuration = 0;

        do {
          clusterFrames.push(frames[frameNumber]), clusterDuration += frames[frameNumber].duration, frameNumber++;
        } while (frameNumber < frames.length && clusterDuration < clusterMaxDuration);

        var clusterCounter = 0,
            cluster = {
          id: 524531317,
          data: getClusterData(clusterTimecode, clusterCounter, clusterFrames)
        };
        EBML[1].data.push(cluster), clusterTimecode += clusterDuration;
      }

      return generateEBML(EBML);
    }

    function getClusterData(clusterTimecode, clusterCounter, clusterFrames) {
      return [{
        data: clusterTimecode,
        id: 231
      }].concat(clusterFrames.map(function (webp) {
        var block = makeSimpleBlock({
          discardable: 0,
          frame: webp.data.slice(4),
          invisible: 0,
          keyframe: 1,
          lacing: 0,
          trackNum: 1,
          timecode: Math.round(clusterCounter)
        });
        return clusterCounter += webp.duration, {
          data: block,
          id: 163
        };
      }));
    }

    function checkFrames(frames) {
      if (!frames[0]) return void postMessage({
        error: "Something went wrong. Maybe WebP format is not supported in the current browser."
      });

      for (var width = frames[0].width, height = frames[0].height, duration = frames[0].duration, i = 1; i < frames.length; i++) {
        duration += frames[i].duration;
      }

      return {
        duration: duration,
        width: width,
        height: height
      };
    }

    function numToBuffer(num) {
      for (var parts = []; num > 0;) {
        parts.push(255 & num), num >>= 8;
      }

      return new Uint8Array(parts.reverse());
    }

    function strToBuffer(str) {
      return new Uint8Array(str.split("").map(function (e) {
        return e.charCodeAt(0);
      }));
    }

    function bitsToBuffer(bits) {
      var data = [],
          pad = bits.length % 8 ? new Array(9 - bits.length % 8).join("0") : "";
      bits = pad + bits;

      for (var i = 0; i < bits.length; i += 8) {
        data.push(parseInt(bits.substr(i, 8), 2));
      }

      return new Uint8Array(data);
    }

    function generateEBML(json) {
      for (var ebml = [], i = 0; i < json.length; i++) {
        var data = json[i].data;
        "object" == _typeof(data) && (data = generateEBML(data)), "number" == typeof data && (data = bitsToBuffer(data.toString(2))), "string" == typeof data && (data = strToBuffer(data));
        var len = data.size || data.byteLength || data.length,
            zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8),
            sizeToString = len.toString(2),
            padded = new Array(7 * zeroes + 7 + 1 - sizeToString.length).join("0") + sizeToString,
            size = new Array(zeroes).join("0") + "1" + padded;
        ebml.push(numToBuffer(json[i].id)), ebml.push(bitsToBuffer(size)), ebml.push(data);
      }

      return new Blob(ebml, {
        type: "video/webm"
      });
    }

    function makeSimpleBlock(data) {
      var flags = 0;
      if (data.keyframe && (flags |= 128), data.invisible && (flags |= 8), data.lacing && (flags |= data.lacing << 1), data.discardable && (flags |= 1), data.trackNum > 127) throw "TrackNumber > 127 not supported";
      var out = [128 | data.trackNum, data.timecode >> 8, 255 & data.timecode, flags].map(function (e) {
        return String.fromCharCode(e);
      }).join("") + data.frame;
      return out;
    }

    function parseWebP(riff) {
      for (var VP8 = riff.RIFF[0].WEBP[0], frameStart = VP8.indexOf("*"), i = 0, c = []; i < 4; i++) {
        c[i] = VP8.charCodeAt(frameStart + 3 + i);
      }

      var width, height, tmp;
      return tmp = c[1] << 8 | c[0], width = 16383 & tmp, tmp = c[3] << 8 | c[2], height = 16383 & tmp, {
        width: width,
        height: height,
        data: VP8,
        riff: riff
      };
    }

    function getStrLength(string, offset) {
      return parseInt(string.substr(offset + 4, 4).split("").map(function (i) {
        var unpadded = i.charCodeAt(0).toString(2);
        return new Array(8 - unpadded.length + 1).join("0") + unpadded;
      }).join(""), 2);
    }

    function parseRIFF(string) {
      for (var offset = 0, chunks = {}; offset < string.length;) {
        var id = string.substr(offset, 4),
            len = getStrLength(string, offset),
            data = string.substr(offset + 4 + 4, len);
        offset += 8 + len, chunks[id] = chunks[id] || [], "RIFF" === id || "LIST" === id ? chunks[id].push(parseRIFF(data)) : chunks[id].push(data);
      }

      return chunks;
    }

    function doubleToString(num) {
      return [].slice.call(new Uint8Array(new Float64Array([num]).buffer), 0).map(function (e) {
        return String.fromCharCode(e);
      }).reverse().join("");
    }

    var webm = new ArrayToWebM(frames.map(function (frame) {
      var webp = parseWebP(parseRIFF(atob(frame.image.slice(23))));
      return webp.duration = frame.duration, webp;
    }));
    postMessage(webm);
  }

  return WhammyVideo.prototype.add = function (frame, duration) {
    if ("canvas" in frame && (frame = frame.canvas), "toDataURL" in frame && (frame = frame.toDataURL("image/webp", this.quality)), !/^data:image\/webp;base64,/gi.test(frame)) throw "Input must be formatted properly as a base64 encoded DataURI of type image/webp";
    this.frames.push({
      image: frame,
      duration: duration || this.duration
    });
  }, WhammyVideo.prototype.compile = function (callback) {
    var webWorker = processInWebWorker(whammyInWebWorker);
    webWorker.onmessage = function (event) {
      return event.data.error ? void console.error(event.data.error) : void callback(event.data);
    }, webWorker.postMessage(this.frames);
  }, {
    Video: WhammyVideo
  };
}();

"undefined" != typeof MediaStreamRecorder && (MediaStreamRecorder.Whammy = Whammy), function () {
  window.ConcatenateBlobs = function (blobs, type, callback) {
    function readAsArrayBuffer() {
      if (!blobs[index]) return concatenateBuffers();
      var reader = new FileReader();
      reader.onload = function (event) {
        buffers.push(event.target.result), index++, readAsArrayBuffer();
      }, reader.readAsArrayBuffer(blobs[index]);
    }

    function concatenateBuffers() {
      var byteLength = 0;
      buffers.forEach(function (buffer) {
        byteLength += buffer.byteLength;
      });
      var tmp = new Uint16Array(byteLength),
          lastOffset = 0;
      buffers.forEach(function (buffer) {
        var reusableByteLength = buffer.byteLength;
        reusableByteLength % 2 != 0 && (buffer = buffer.slice(0, reusableByteLength - 1)), tmp.set(new Uint16Array(buffer), lastOffset), lastOffset += reusableByteLength;
      });
      var blob = new Blob([tmp.buffer], {
        type: type
      });
      callback(blob);
    }

    var buffers = [],
        index = 0;
    readAsArrayBuffer();
  };
}(), "undefined" != typeof module && (module.exports = MediaStreamRecorder), "function" == typeof define && define.amd && define("MediaStreamRecorder", [], function () {
  return MediaStreamRecorder;
});
},{}],"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/when/dist/browser/when.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.when=e():"undefined"!=typeof global?global.when=e():"undefined"!=typeof self&&(self.when=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var when = module.exports = require('../when');

when.callbacks = require('../callbacks');
when.cancelable = require('../cancelable');
when.delay = require('../delay');
when.fn = require('../function');
when.guard = require('../guard');
when.keys = require('../keys');
when.nodefn = when.node = require('../node');
when.parallel = require('../parallel');
when.pipeline = require('../pipeline');
when.poll = require('../poll');
when.sequence = require('../sequence');
when.timeout = require('../timeout');

},{"../callbacks":2,"../cancelable":3,"../delay":4,"../function":5,"../guard":6,"../keys":7,"../node":26,"../parallel":27,"../pipeline":28,"../poll":29,"../sequence":30,"../timeout":31,"../when":32}],2:[function(require,module,exports){
/** @license MIT License (c) copyright 2013-2014 original author or authors */

/**
 * Collection of helper functions for interacting with 'traditional',
 * callback-taking functions using a promise interface.
 *
 * @author Renato Zannon
 * @contributor Brian Cavalier
 */

(function(define) {
define(function(require) {

	var when = require('./when');
	var Promise = when.Promise;
	var _liftAll = require('./lib/liftAll');
	var slice = Array.prototype.slice;

	var makeApply = require('./lib/apply');
	var _apply = makeApply(Promise, dispatch);

	return {
		lift: lift,
		liftAll: liftAll,
		apply: apply,
		call: call,
		promisify: promisify
	};

	/**
	 * Takes a `traditional` callback-taking function and returns a promise for its
	 * result, accepting an optional array of arguments (that might be values or
	 * promises). It assumes that the function takes its callback and errback as
	 * the last two arguments. The resolution of the promise depends on whether the
	 * function will call its callback or its errback.
	 *
	 * @example
	 *    var domIsLoaded = callbacks.apply($);
	 *    domIsLoaded.then(function() {
	 *		doMyDomStuff();
	 *	});
	 *
	 * @example
	 *    function existingAjaxyFunction(url, callback, errback) {
	 *		// Complex logic you'd rather not change
	 *	}
	 *
	 *    var promise = callbacks.apply(existingAjaxyFunction, ["/movies.json"]);
	 *
	 *    promise.then(function(movies) {
	 *		// Work with movies
	 *	}, function(reason) {
	 *		// Handle error
	 *	});
	 *
	 * @param {function} asyncFunction function to be called
	 * @param {Array} [extraAsyncArgs] array of arguments to asyncFunction
	 * @returns {Promise} promise for the callback value of asyncFunction
	 */
	function apply(asyncFunction, extraAsyncArgs) {
		return _apply(asyncFunction, this, extraAsyncArgs || []);
	}

	/**
	 * Apply helper that allows specifying thisArg
	 * @private
	 */
	function dispatch(f, thisArg, args, h) {
		args.push(alwaysUnary(h.resolve, h), alwaysUnary(h.reject, h));
		tryCatchResolve(f, thisArg, args, h);
	}

	function tryCatchResolve(f, thisArg, args, resolver) {
		try {
			f.apply(thisArg, args);
		} catch(e) {
			resolver.reject(e);
		}
	}

	/**
	 * Works as `callbacks.apply` does, with the difference that the arguments to
	 * the function are passed individually, instead of as an array.
	 *
	 * @example
	 *    function sumInFiveSeconds(a, b, callback) {
	 *		setTimeout(function() {
	 *			callback(a + b);
	 *		}, 5000);
	 *	}
	 *
	 *    var sumPromise = callbacks.call(sumInFiveSeconds, 5, 10);
	 *
	 *    // Logs '15' 5 seconds later
	 *    sumPromise.then(console.log);
	 *
	 * @param {function} asyncFunction function to be called
	 * @param {...*} args arguments that will be forwarded to the function
	 * @returns {Promise} promise for the callback value of asyncFunction
	 */
	function call(asyncFunction/*, arg1, arg2...*/) {
		return _apply(asyncFunction, this, slice.call(arguments, 1));
	}

	/**
	 * Takes a 'traditional' callback/errback-taking function and returns a function
	 * that returns a promise instead. The resolution/rejection of the promise
	 * depends on whether the original function will call its callback or its
	 * errback.
	 *
	 * If additional arguments are passed to the `lift` call, they will be prepended
	 * on the calls to the original function, much like `Function.prototype.bind`.
	 *
	 * The resulting function is also "promise-aware", in the sense that, if given
	 * promises as arguments, it will wait for their resolution before executing.
	 *
	 * @example
	 *    function traditionalAjax(method, url, callback, errback) {
	 *		var xhr = new XMLHttpRequest();
	 *		xhr.open(method, url);
	 *
	 *		xhr.onload = callback;
	 *		xhr.onerror = errback;
	 *
	 *		xhr.send();
	 *	}
	 *
	 *    var promiseAjax = callbacks.lift(traditionalAjax);
	 *    promiseAjax("GET", "/movies.json").then(console.log, console.error);
	 *
	 *    var promiseAjaxGet = callbacks.lift(traditionalAjax, "GET");
	 *    promiseAjaxGet("/movies.json").then(console.log, console.error);
	 *
	 * @param {Function} f traditional async function to be decorated
	 * @param {...*} [args] arguments to be prepended for the new function @deprecated
	 * @returns {Function} a promise-returning function
	 */
	function lift(f/*, args...*/) {
		var args = arguments.length > 1 ? slice.call(arguments, 1) : [];
		return function() {
			return _apply(f, this, args.concat(slice.call(arguments)));
		};
	}

	/**
	 * Lift all the functions/methods on src
	 * @param {object|function} src source whose functions will be lifted
	 * @param {function?} combine optional function for customizing the lifting
	 *  process. It is passed dst, the lifted function, and the property name of
	 *  the original function on src.
	 * @param {(object|function)?} dst option destination host onto which to place lifted
	 *  functions. If not provided, liftAll returns a new object.
	 * @returns {*} If dst is provided, returns dst with lifted functions as
	 *  properties.  If dst not provided, returns a new object with lifted functions.
	 */
	function liftAll(src, combine, dst) {
		return _liftAll(lift, combine, dst, src);
	}

	/**
	 * `promisify` is a version of `lift` that allows fine-grained control over the
	 * arguments that passed to the underlying function. It is intended to handle
	 * functions that don't follow the common callback and errback positions.
	 *
	 * The control is done by passing an object whose 'callback' and/or 'errback'
	 * keys, whose values are the corresponding 0-based indexes of the arguments on
	 * the function. Negative values are interpreted as being relative to the end
	 * of the arguments array.
	 *
	 * If arguments are given on the call to the 'promisified' function, they are
	 * intermingled with the callback and errback. If a promise is given among them,
	 * the execution of the function will only occur after its resolution.
	 *
	 * @example
	 *    var delay = callbacks.promisify(setTimeout, {
	 *		callback: 0
	 *	});
	 *
	 *    delay(100).then(function() {
	 *		console.log("This happens 100ms afterwards");
	 *	});
	 *
	 * @example
	 *    function callbackAsLast(errback, followsStandards, callback) {
	 *		if(followsStandards) {
	 *			callback("well done!");
	 *		} else {
	 *			errback("some programmers just want to watch the world burn");
	 *		}
	 *	}
	 *
	 *    var promisified = callbacks.promisify(callbackAsLast, {
	 *		callback: -1,
	 *		errback:   0,
	 *	});
	 *
	 *    promisified(true).then(console.log, console.error);
	 *    promisified(false).then(console.log, console.error);
	 *
	 * @param {Function} asyncFunction traditional function to be decorated
	 * @param {object} positions
	 * @param {number} [positions.callback] index at which asyncFunction expects to
	 *  receive a success callback
	 * @param {number} [positions.errback] index at which asyncFunction expects to
	 *  receive an error callback
	 *  @returns {function} promisified function that accepts
	 *
	 * @deprecated
	 */
	function promisify(asyncFunction, positions) {

		return function() {
			var thisArg = this;
			return Promise.all(arguments).then(function(args) {
				var p = Promise._defer();

				var callbackPos, errbackPos;

				if(typeof positions.callback === 'number') {
					callbackPos = normalizePosition(args, positions.callback);
				}

				if(typeof positions.errback === 'number') {
					errbackPos = normalizePosition(args, positions.errback);
				}

				if(errbackPos < callbackPos) {
					insertCallback(args, errbackPos, p._handler.reject, p._handler);
					insertCallback(args, callbackPos, p._handler.resolve, p._handler);
				} else {
					insertCallback(args, callbackPos, p._handler.resolve, p._handler);
					insertCallback(args, errbackPos, p._handler.reject, p._handler);
				}

				asyncFunction.apply(thisArg, args);

				return p;
			});
		};
	}

	function normalizePosition(args, pos) {
		return pos < 0 ? (args.length + pos + 2) : pos;
	}

	function insertCallback(args, pos, callback, thisArg) {
		if(typeof pos === 'number') {
			args.splice(pos, 0, alwaysUnary(callback, thisArg));
		}
	}

	function alwaysUnary(fn, thisArg) {
		return function() {
			if (arguments.length > 1) {
				fn.call(thisArg, slice.call(arguments));
			} else {
				fn.apply(thisArg, arguments);
			}
		};
	}
});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

},{"./lib/apply":11,"./lib/liftAll":23,"./when":32}],3:[function(require,module,exports){
/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * cancelable.js
 * @deprecated
 *
 * Decorator that makes a deferred "cancelable".  It adds a cancel() method that
 * will call a special cancel handler function and then reject the deferred.  The
 * cancel handler can be used to do resource cleanup, or anything else that should
 * be done before any other rejection handlers are executed.
 *
 * Usage:
 *
 * var cancelableDeferred = cancelable(when.defer(), myCancelHandler);
 *
 * @author brian@hovercraftstudios.com
 */

(function(define) {
define(function() {

    /**
     * Makes deferred cancelable, adding a cancel() method.
	 * @deprecated
     *
     * @param deferred {Deferred} the {@link Deferred} to make cancelable
     * @param canceler {Function} cancel handler function to execute when this deferred
	 * is canceled.  This is guaranteed to run before all other rejection handlers.
	 * The canceler will NOT be executed if the deferred is rejected in the standard
	 * way, i.e. deferred.reject().  It ONLY executes if the deferred is canceled,
	 * i.e. deferred.cancel()
     *
     * @returns deferred, with an added cancel() method.
     */
    return function(deferred, canceler) {
        // Add a cancel method to the deferred to reject the delegate
        // with the special canceled indicator.
        deferred.cancel = function() {
			try {
				deferred.reject(canceler(deferred));
			} catch(e) {
				deferred.reject(e);
			}

			return deferred.promise;
        };

        return deferred;
    };

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(); });



},{}],4:[function(require,module,exports){
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * delay.js
 *
 * Helper that returns a promise that resolves after a delay.
 *
 * @author Brian Cavalier
 * @author John Hann
 */

(function(define) {
define(function(require) {

	var when = require('./when');

    /**
	 * @deprecated Use when(value).delay(ms)
     */
    return function delay(msec, value) {
		return when(value).delay(msec);
    };

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });



},{"./when":32}],5:[function(require,module,exports){
/** @license MIT License (c) copyright 2013-2014 original author or authors */

/**
 * Collection of helper functions for wrapping and executing 'traditional'
 * synchronous functions in a promise interface.
 *
 * @author Brian Cavalier
 * @contributor Renato Zannon
 */

(function(define) {
define(function(require) {

	var when = require('./when');
	var attempt = when['try'];
	var _liftAll = require('./lib/liftAll');
	var _apply = require('./lib/apply')(when.Promise);
	var slice = Array.prototype.slice;

	return {
		lift: lift,
		liftAll: liftAll,
		call: attempt,
		apply: apply,
		compose: compose
	};

	/**
	 * Takes a function and an optional array of arguments (that might be promises),
	 * and calls the function. The return value is a promise whose resolution
	 * depends on the value returned by the function.
	 * @param {function} f function to be called
	 * @param {Array} [args] array of arguments to func
	 * @returns {Promise} promise for the return value of func
	 */
	function apply(f, args) {
		// slice args just in case the caller passed an Arguments instance
		return _apply(f, this, args == null ? [] : slice.call(args));
	}

	/**
	 * Takes a 'regular' function and returns a version of that function that
	 * returns a promise instead of a plain value, and handles thrown errors by
	 * returning a rejected promise. Also accepts a list of arguments to be
	 * prepended to the new function, as does Function.prototype.bind.
	 *
	 * The resulting function is promise-aware, in the sense that it accepts
	 * promise arguments, and waits for their resolution.
	 * @param {Function} f function to be bound
	 * @param {...*} [args] arguments to be prepended for the new function @deprecated
	 * @returns {Function} a promise-returning function
	 */
	function lift(f /*, args... */) {
		var args = arguments.length > 1 ? slice.call(arguments, 1) : [];
		return function() {
			return _apply(f, this, args.concat(slice.call(arguments)));
		};
	}

	/**
	 * Lift all the functions/methods on src
	 * @param {object|function} src source whose functions will be lifted
	 * @param {function?} combine optional function for customizing the lifting
	 *  process. It is passed dst, the lifted function, and the property name of
	 *  the original function on src.
	 * @param {(object|function)?} dst option destination host onto which to place lifted
	 *  functions. If not provided, liftAll returns a new object.
	 * @returns {*} If dst is provided, returns dst with lifted functions as
	 *  properties.  If dst not provided, returns a new object with lifted functions.
	 */
	function liftAll(src, combine, dst) {
		return _liftAll(lift, combine, dst, src);
	}

	/**
	 * Composes multiple functions by piping their return values. It is
	 * transparent to whether the functions return 'regular' values or promises:
	 * the piped argument is always a resolved value. If one of the functions
	 * throws or returns a rejected promise, the composed promise will be also
	 * rejected.
	 *
	 * The arguments (or promises to arguments) given to the returned function (if
	 * any), are passed directly to the first function on the 'pipeline'.
	 * @param {Function} f the function to which the arguments will be passed
	 * @param {...Function} [funcs] functions that will be composed, in order
	 * @returns {Function} a promise-returning composition of the functions
	 */
	function compose(f /*, funcs... */) {
		var funcs = slice.call(arguments, 1);

		return function() {
			var thisArg = this;
			var args = slice.call(arguments);
			var firstPromise = attempt.apply(thisArg, [f].concat(args));

			return when.reduce(funcs, function(arg, func) {
				return func.call(thisArg, arg);
			}, firstPromise);
		};
	}
});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });



},{"./lib/apply":11,"./lib/liftAll":23,"./when":32}],6:[function(require,module,exports){
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * Generalized promise concurrency guard
 * Adapted from original concept by Sakari Jokinen (Rocket Pack, Ltd.)
 *
 * @author Brian Cavalier
 * @author John Hann
 * @contributor Sakari Jokinen
 */
(function(define) {
define(function(require) {

	var when = require('./when');
	var slice = Array.prototype.slice;

	guard.n = n;

	return guard;

	/**
	 * Creates a guarded version of f that can only be entered when the supplied
	 * condition allows.
	 * @param {function} condition represents a critical section that may only
	 *  be entered when allowed by the condition
	 * @param {function} f function to guard
	 * @returns {function} guarded version of f
	 */
	function guard(condition, f) {
		return function() {
			var args = slice.call(arguments);

			return when(condition()).withThis(this).then(function(exit) {
				return when(f.apply(this, args))['finally'](exit);
			});
		};
	}

	/**
	 * Creates a condition that allows only n simultaneous executions
	 * of a guarded function
	 * @param {number} allowed number of allowed simultaneous executions
	 * @returns {function} condition function which returns a promise that
	 *  fulfills when the critical section may be entered.  The fulfillment
	 *  value is a function ("notifyExit") that must be called when the critical
	 *  section has been exited.
	 */
	function n(allowed) {
		var count = 0;
		var waiting = [];

		return function enter() {
			return when.promise(function(resolve) {
				if(count < allowed) {
					resolve(exit);
				} else {
					waiting.push(resolve);
				}
				count += 1;
			});
		};

		function exit() {
			count = Math.max(count - 1, 0);
			if(waiting.length > 0) {
				waiting.shift()(exit);
			}
		}
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{"./when":32}],7:[function(require,module,exports){
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author Brian Cavalier
 * @author John Hann
 */
(function(define) { 'use strict';
define(function(require) {

	var when = require('./when');
	var Promise = when.Promise;
	var toPromise = when.resolve;

	return {
		all: when.lift(all),
		map: map,
		settle: settle
	};

	/**
	 * Resolve all the key-value pairs in the supplied object or promise
	 * for an object.
	 * @param {Promise|object} object or promise for object whose key-value pairs
	 *  will be resolved
	 * @returns {Promise} promise for an object with the fully resolved key-value pairs
	 */
	function all(object) {
		var p = Promise._defer();
		var resolver = Promise._handler(p);

		var results = {};
		var keys = Object.keys(object);
		var pending = keys.length;

		for(var i=0, k; i<keys.length; ++i) {
			k = keys[i];
			Promise._handler(object[k]).fold(settleKey, k, results, resolver);
		}

		if(pending === 0) {
			resolver.resolve(results);
		}

		return p;

		function settleKey(k, x, resolver) {
			/*jshint validthis:true*/
			this[k] = x;
			if(--pending === 0) {
				resolver.resolve(results);
			}
		}
	}

	/**
	 * Map values in the supplied object's keys
	 * @param {Promise|object} object or promise for object whose key-value pairs
	 *  will be reduced
	 * @param {function(value:*, key:String):*} f mapping function which may
	 *  return either a promise or a value
	 * @returns {Promise} promise for an object with the mapped and fully
	 *  resolved key-value pairs
	 */
	function map(object, f) {
		return toPromise(object).then(function(object) {
			return all(Object.keys(object).reduce(function(o, k) {
				o[k] = toPromise(object[k]).fold(mapWithKey, k);
				return o;
			}, {}));
		});

		function mapWithKey(k, x) {
			return f(x, k);
		}
	}

	/**
	 * Resolve all key-value pairs in the supplied object and return a promise
	 * that will always fulfill with the outcome states of all input promises.
	 * @param {object} object whose key-value pairs will be settled
	 * @returns {Promise} promise for an object with the mapped and fully
	 *  settled key-value pairs
	 */
	function settle(object) {
		var keys = Object.keys(object);
		var results = {};

		if(keys.length === 0) {
			return toPromise(results);
		}

		var p = Promise._defer();
		var resolver = Promise._handler(p);
		var promises = keys.map(function(k) { return object[k]; });

		when.settle(promises).then(function(states) {
			populateResults(keys, states, results, resolver);
		});

		return p;
	}

	function populateResults(keys, states, results, resolver) {
		for(var i=0; i<keys.length; i++) {
			results[keys[i]] = states[i];
		}
		resolver.resolve(results);
	}

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

},{"./when":32}],8:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function (require) {

	var makePromise = require('./makePromise');
	var Scheduler = require('./Scheduler');
	var async = require('./env').asap;

	return makePromise({
		scheduler: new Scheduler(async)
	});

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

},{"./Scheduler":9,"./env":21,"./makePromise":24}],9:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	// Credit to Twisol (https://github.com/Twisol) for suggesting
	// this type of extensible queue + trampoline approach for next-tick conflation.

	/**
	 * Async task scheduler
	 * @param {function} async function to schedule a single async function
	 * @constructor
	 */
	function Scheduler(async) {
		this._async = async;
		this._running = false;

		this._queue = this;
		this._queueLen = 0;
		this._afterQueue = {};
		this._afterQueueLen = 0;

		var self = this;
		this.drain = function() {
			self._drain();
		};
	}

	/**
	 * Enqueue a task
	 * @param {{ run:function }} task
	 */
	Scheduler.prototype.enqueue = function(task) {
		this._queue[this._queueLen++] = task;
		this.run();
	};

	/**
	 * Enqueue a task to run after the main task queue
	 * @param {{ run:function }} task
	 */
	Scheduler.prototype.afterQueue = function(task) {
		this._afterQueue[this._afterQueueLen++] = task;
		this.run();
	};

	Scheduler.prototype.run = function() {
		if (!this._running) {
			this._running = true;
			this._async(this.drain);
		}
	};

	/**
	 * Drain the handler queue entirely, and then the after queue
	 */
	Scheduler.prototype._drain = function() {
		var i = 0;
		for (; i < this._queueLen; ++i) {
			this._queue[i].run();
			this._queue[i] = void 0;
		}

		this._queueLen = 0;
		this._running = false;

		for (i = 0; i < this._afterQueueLen; ++i) {
			this._afterQueue[i].run();
			this._afterQueue[i] = void 0;
		}

		this._afterQueueLen = 0;
	};

	return Scheduler;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],10:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	/**
	 * Custom error type for promises rejected by promise.timeout
	 * @param {string} message
	 * @constructor
	 */
	function TimeoutError (message) {
		Error.call(this);
		this.message = message;
		this.name = TimeoutError.name;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, TimeoutError);
		}
	}

	TimeoutError.prototype = Object.create(Error.prototype);
	TimeoutError.prototype.constructor = TimeoutError;

	return TimeoutError;
});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
},{}],11:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	makeApply.tryCatchResolve = tryCatchResolve;

	return makeApply;

	function makeApply(Promise, call) {
		if(arguments.length < 2) {
			call = tryCatchResolve;
		}

		return apply;

		function apply(f, thisArg, args) {
			var p = Promise._defer();
			var l = args.length;
			var params = new Array(l);
			callAndResolve({ f:f, thisArg:thisArg, args:args, params:params, i:l-1, call:call }, p._handler);

			return p;
		}

		function callAndResolve(c, h) {
			if(c.i < 0) {
				return call(c.f, c.thisArg, c.params, h);
			}

			var handler = Promise._handler(c.args[c.i]);
			handler.fold(callAndResolveNext, c, void 0, h);
		}

		function callAndResolveNext(c, x, h) {
			c.params[c.i] = x;
			c.i -= 1;
			callAndResolve(c, h);
		}
	}

	function tryCatchResolve(f, thisArg, args, resolver) {
		try {
			resolver.resolve(f.apply(thisArg, args));
		} catch(e) {
			resolver.reject(e);
		}
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));



},{}],12:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function(require) {

	var state = require('../state');
	var applier = require('../apply');

	return function array(Promise) {

		var applyFold = applier(Promise);
		var toPromise = Promise.resolve;
		var all = Promise.all;

		var ar = Array.prototype.reduce;
		var arr = Array.prototype.reduceRight;
		var slice = Array.prototype.slice;

		// Additional array combinators

		Promise.any = any;
		Promise.some = some;
		Promise.settle = settle;

		Promise.map = map;
		Promise.filter = filter;
		Promise.reduce = reduce;
		Promise.reduceRight = reduceRight;

		/**
		 * When this promise fulfills with an array, do
		 * onFulfilled.apply(void 0, array)
		 * @param {function} onFulfilled function to apply
		 * @returns {Promise} promise for the result of applying onFulfilled
		 */
		Promise.prototype.spread = function(onFulfilled) {
			return this.then(all).then(function(array) {
				return onFulfilled.apply(this, array);
			});
		};

		return Promise;

		/**
		 * One-winner competitive race.
		 * Return a promise that will fulfill when one of the promises
		 * in the input array fulfills, or will reject when all promises
		 * have rejected.
		 * @param {array} promises
		 * @returns {Promise} promise for the first fulfilled value
		 */
		function any(promises) {
			var p = Promise._defer();
			var resolver = p._handler;
			var l = promises.length>>>0;

			var pending = l;
			var errors = [];

			for (var h, x, i = 0; i < l; ++i) {
				x = promises[i];
				if(x === void 0 && !(i in promises)) {
					--pending;
					continue;
				}

				h = Promise._handler(x);
				if(h.state() > 0) {
					resolver.become(h);
					Promise._visitRemaining(promises, i, h);
					break;
				} else {
					h.visit(resolver, handleFulfill, handleReject);
				}
			}

			if(pending === 0) {
				resolver.reject(new RangeError('any(): array must not be empty'));
			}

			return p;

			function handleFulfill(x) {
				/*jshint validthis:true*/
				errors = null;
				this.resolve(x); // this === resolver
			}

			function handleReject(e) {
				/*jshint validthis:true*/
				if(this.resolved) { // this === resolver
					return;
				}

				errors.push(e);
				if(--pending === 0) {
					this.reject(errors);
				}
			}
		}

		/**
		 * N-winner competitive race
		 * Return a promise that will fulfill when n input promises have
		 * fulfilled, or will reject when it becomes impossible for n
		 * input promises to fulfill (ie when promises.length - n + 1
		 * have rejected)
		 * @param {array} promises
		 * @param {number} n
		 * @returns {Promise} promise for the earliest n fulfillment values
		 *
		 * @deprecated
		 */
		function some(promises, n) {
			/*jshint maxcomplexity:7*/
			var p = Promise._defer();
			var resolver = p._handler;

			var results = [];
			var errors = [];

			var l = promises.length>>>0;
			var nFulfill = 0;
			var nReject;
			var x, i; // reused in both for() loops

			// First pass: count actual array items
			for(i=0; i<l; ++i) {
				x = promises[i];
				if(x === void 0 && !(i in promises)) {
					continue;
				}
				++nFulfill;
			}

			// Compute actual goals
			n = Math.max(n, 0);
			nReject = (nFulfill - n + 1);
			nFulfill = Math.min(n, nFulfill);

			if(n > nFulfill) {
				resolver.reject(new RangeError('some(): array must contain at least '
				+ n + ' item(s), but had ' + nFulfill));
			} else if(nFulfill === 0) {
				resolver.resolve(results);
			}

			// Second pass: observe each array item, make progress toward goals
			for(i=0; i<l; ++i) {
				x = promises[i];
				if(x === void 0 && !(i in promises)) {
					continue;
				}

				Promise._handler(x).visit(resolver, fulfill, reject, resolver.notify);
			}

			return p;

			function fulfill(x) {
				/*jshint validthis:true*/
				if(this.resolved) { // this === resolver
					return;
				}

				results.push(x);
				if(--nFulfill === 0) {
					errors = null;
					this.resolve(results);
				}
			}

			function reject(e) {
				/*jshint validthis:true*/
				if(this.resolved) { // this === resolver
					return;
				}

				errors.push(e);
				if(--nReject === 0) {
					results = null;
					this.reject(errors);
				}
			}
		}

		/**
		 * Apply f to the value of each promise in a list of promises
		 * and return a new list containing the results.
		 * @param {array} promises
		 * @param {function(x:*, index:Number):*} f mapping function
		 * @returns {Promise}
		 */
		function map(promises, f) {
			return Promise._traverse(f, promises);
		}

		/**
		 * Filter the provided array of promises using the provided predicate.  Input may
		 * contain promises and values
		 * @param {Array} promises array of promises and values
		 * @param {function(x:*, index:Number):boolean} predicate filtering predicate.
		 *  Must return truthy (or promise for truthy) for items to retain.
		 * @returns {Promise} promise that will fulfill with an array containing all items
		 *  for which predicate returned truthy.
		 */
		function filter(promises, predicate) {
			var a = slice.call(promises);
			return Promise._traverse(predicate, a).then(function(keep) {
				return filterSync(a, keep);
			});
		}

		function filterSync(promises, keep) {
			// Safe because we know all promises have fulfilled if we've made it this far
			var l = keep.length;
			var filtered = new Array(l);
			for(var i=0, j=0; i<l; ++i) {
				if(keep[i]) {
					filtered[j++] = Promise._handler(promises[i]).value;
				}
			}
			filtered.length = j;
			return filtered;

		}

		/**
		 * Return a promise that will always fulfill with an array containing
		 * the outcome states of all input promises.  The returned promise
		 * will never reject.
		 * @param {Array} promises
		 * @returns {Promise} promise for array of settled state descriptors
		 */
		function settle(promises) {
			return all(promises.map(settleOne));
		}

		function settleOne(p) {
			// Optimize the case where we get an already-resolved when.js promise
			//  by extracting its state:
			var handler;
			if (p instanceof Promise) {
				// This is our own Promise type and we can reach its handler internals:
				handler = p._handler.join();
			}
			if((handler && handler.state() === 0) || !handler) {
				// Either still pending, or not a Promise at all:
				return toPromise(p).then(state.fulfilled, state.rejected);
			}

			// The promise is our own, but it is already resolved. Take a shortcut.
			// Since we're not actually handling the resolution, we need to disable
			// rejection reporting.
			handler._unreport();
			return state.inspect(handler);
		}

		/**
		 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
		 * input may contain promises and/or values, and reduceFunc
		 * may return either a value or a promise, *and* initialValue may
		 * be a promise for the starting value.
		 * @param {Array|Promise} promises array or promise for an array of anything,
		 *      may contain a mix of promises and values.
		 * @param {function(accumulated:*, x:*, index:Number):*} f reduce function
		 * @returns {Promise} that will resolve to the final reduced value
		 */
		function reduce(promises, f /*, initialValue */) {
			return arguments.length > 2 ? ar.call(promises, liftCombine(f), arguments[2])
					: ar.call(promises, liftCombine(f));
		}

		/**
		 * Traditional reduce function, similar to `Array.prototype.reduceRight()`, but
		 * input may contain promises and/or values, and reduceFunc
		 * may return either a value or a promise, *and* initialValue may
		 * be a promise for the starting value.
		 * @param {Array|Promise} promises array or promise for an array of anything,
		 *      may contain a mix of promises and values.
		 * @param {function(accumulated:*, x:*, index:Number):*} f reduce function
		 * @returns {Promise} that will resolve to the final reduced value
		 */
		function reduceRight(promises, f /*, initialValue */) {
			return arguments.length > 2 ? arr.call(promises, liftCombine(f), arguments[2])
					: arr.call(promises, liftCombine(f));
		}

		function liftCombine(f) {
			return function(z, x, i) {
				return applyFold(f, void 0, [z,x,i]);
			};
		}
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{"../apply":11,"../state":25}],13:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function flow(Promise) {

		var resolve = Promise.resolve;
		var reject = Promise.reject;
		var origCatch = Promise.prototype['catch'];

		/**
		 * Handle the ultimate fulfillment value or rejection reason, and assume
		 * responsibility for all errors.  If an error propagates out of result
		 * or handleFatalError, it will be rethrown to the host, resulting in a
		 * loud stack track on most platforms and a crash on some.
		 * @param {function?} onResult
		 * @param {function?} onError
		 * @returns {undefined}
		 */
		Promise.prototype.done = function(onResult, onError) {
			this._handler.visit(this._handler.receiver, onResult, onError);
		};

		/**
		 * Add Error-type and predicate matching to catch.  Examples:
		 * promise.catch(TypeError, handleTypeError)
		 *   .catch(predicate, handleMatchedErrors)
		 *   .catch(handleRemainingErrors)
		 * @param onRejected
		 * @returns {*}
		 */
		Promise.prototype['catch'] = Promise.prototype.otherwise = function(onRejected) {
			if (arguments.length < 2) {
				return origCatch.call(this, onRejected);
			}

			if(typeof onRejected !== 'function') {
				return this.ensure(rejectInvalidPredicate);
			}

			return origCatch.call(this, createCatchFilter(arguments[1], onRejected));
		};

		/**
		 * Wraps the provided catch handler, so that it will only be called
		 * if the predicate evaluates truthy
		 * @param {?function} handler
		 * @param {function} predicate
		 * @returns {function} conditional catch handler
		 */
		function createCatchFilter(handler, predicate) {
			return function(e) {
				return evaluatePredicate(e, predicate)
					? handler.call(this, e)
					: reject(e);
			};
		}

		/**
		 * Ensures that onFulfilledOrRejected will be called regardless of whether
		 * this promise is fulfilled or rejected.  onFulfilledOrRejected WILL NOT
		 * receive the promises' value or reason.  Any returned value will be disregarded.
		 * onFulfilledOrRejected may throw or return a rejected promise to signal
		 * an additional error.
		 * @param {function} handler handler to be called regardless of
		 *  fulfillment or rejection
		 * @returns {Promise}
		 */
		Promise.prototype['finally'] = Promise.prototype.ensure = function(handler) {
			if(typeof handler !== 'function') {
				return this;
			}

			return this.then(function(x) {
				return runSideEffect(handler, this, identity, x);
			}, function(e) {
				return runSideEffect(handler, this, reject, e);
			});
		};

		function runSideEffect (handler, thisArg, propagate, value) {
			var result = handler.call(thisArg);
			return maybeThenable(result)
				? propagateValue(result, propagate, value)
				: propagate(value);
		}

		function propagateValue (result, propagate, x) {
			return resolve(result).then(function () {
				return propagate(x);
			});
		}

		/**
		 * Recover from a failure by returning a defaultValue.  If defaultValue
		 * is a promise, it's fulfillment value will be used.  If defaultValue is
		 * a promise that rejects, the returned promise will reject with the
		 * same reason.
		 * @param {*} defaultValue
		 * @returns {Promise} new promise
		 */
		Promise.prototype['else'] = Promise.prototype.orElse = function(defaultValue) {
			return this.then(void 0, function() {
				return defaultValue;
			});
		};

		/**
		 * Shortcut for .then(function() { return value; })
		 * @param  {*} value
		 * @return {Promise} a promise that:
		 *  - is fulfilled if value is not a promise, or
		 *  - if value is a promise, will fulfill with its value, or reject
		 *    with its reason.
		 */
		Promise.prototype['yield'] = function(value) {
			return this.then(function() {
				return value;
			});
		};

		/**
		 * Runs a side effect when this promise fulfills, without changing the
		 * fulfillment value.
		 * @param {function} onFulfilledSideEffect
		 * @returns {Promise}
		 */
		Promise.prototype.tap = function(onFulfilledSideEffect) {
			return this.then(onFulfilledSideEffect)['yield'](this);
		};

		return Promise;
	};

	function rejectInvalidPredicate() {
		throw new TypeError('catch predicate must be a function');
	}

	function evaluatePredicate(e, predicate) {
		return isError(predicate) ? e instanceof predicate : predicate(e);
	}

	function isError(predicate) {
		return predicate === Error
			|| (predicate != null && predicate.prototype instanceof Error);
	}

	function maybeThenable(x) {
		return (typeof x === 'object' || typeof x === 'function') && x !== null;
	}

	function identity(x) {
		return x;
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],14:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */
/** @author Jeff Escalante */

(function(define) { 'use strict';
define(function() {

	return function fold(Promise) {

		Promise.prototype.fold = function(f, z) {
			var promise = this._beget();

			this._handler.fold(function(z, x, to) {
				Promise._handler(z).fold(function(x, z, to) {
					to.resolve(f.call(this, z, x));
				}, x, this, to);
			}, z, promise._handler.receiver, promise._handler);

			return promise;
		};

		return Promise;
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],15:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function(require) {

	var inspect = require('../state').inspect;

	return function inspection(Promise) {

		Promise.prototype.inspect = function() {
			return inspect(Promise._handler(this));
		};

		return Promise;
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{"../state":25}],16:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function generate(Promise) {

		var resolve = Promise.resolve;

		Promise.iterate = iterate;
		Promise.unfold = unfold;

		return Promise;

		/**
		 * @deprecated Use github.com/cujojs/most streams and most.iterate
		 * Generate a (potentially infinite) stream of promised values:
		 * x, f(x), f(f(x)), etc. until condition(x) returns true
		 * @param {function} f function to generate a new x from the previous x
		 * @param {function} condition function that, given the current x, returns
		 *  truthy when the iterate should stop
		 * @param {function} handler function to handle the value produced by f
		 * @param {*|Promise} x starting value, may be a promise
		 * @return {Promise} the result of the last call to f before
		 *  condition returns true
		 */
		function iterate(f, condition, handler, x) {
			return unfold(function(x) {
				return [x, f(x)];
			}, condition, handler, x);
		}

		/**
		 * @deprecated Use github.com/cujojs/most streams and most.unfold
		 * Generate a (potentially infinite) stream of promised values
		 * by applying handler(generator(seed)) iteratively until
		 * condition(seed) returns true.
		 * @param {function} unspool function that generates a [value, newSeed]
		 *  given a seed.
		 * @param {function} condition function that, given the current seed, returns
		 *  truthy when the unfold should stop
		 * @param {function} handler function to handle the value produced by unspool
		 * @param x {*|Promise} starting value, may be a promise
		 * @return {Promise} the result of the last value produced by unspool before
		 *  condition returns true
		 */
		function unfold(unspool, condition, handler, x) {
			return resolve(x).then(function(seed) {
				return resolve(condition(seed)).then(function(done) {
					return done ? seed : resolve(unspool(seed)).spread(next);
				});
			});

			function next(item, newSeed) {
				return resolve(handler(item)).then(function() {
					return unfold(unspool, condition, handler, newSeed);
				});
			}
		}
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],17:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function progress(Promise) {

		/**
		 * @deprecated
		 * Register a progress handler for this promise
		 * @param {function} onProgress
		 * @returns {Promise}
		 */
		Promise.prototype.progress = function(onProgress) {
			return this.then(void 0, void 0, onProgress);
		};

		return Promise;
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],18:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function(require) {

	var env = require('../env');
	var TimeoutError = require('../TimeoutError');

	function setTimeout(f, ms, x, y) {
		return env.setTimer(function() {
			f(x, y, ms);
		}, ms);
	}

	return function timed(Promise) {
		/**
		 * Return a new promise whose fulfillment value is revealed only
		 * after ms milliseconds
		 * @param {number} ms milliseconds
		 * @returns {Promise}
		 */
		Promise.prototype.delay = function(ms) {
			var p = this._beget();
			this._handler.fold(handleDelay, ms, void 0, p._handler);
			return p;
		};

		function handleDelay(ms, x, h) {
			setTimeout(resolveDelay, ms, x, h);
		}

		function resolveDelay(x, h) {
			h.resolve(x);
		}

		/**
		 * Return a new promise that rejects after ms milliseconds unless
		 * this promise fulfills earlier, in which case the returned promise
		 * fulfills with the same value.
		 * @param {number} ms milliseconds
		 * @param {Error|*=} reason optional rejection reason to use, defaults
		 *   to a TimeoutError if not provided
		 * @returns {Promise}
		 */
		Promise.prototype.timeout = function(ms, reason) {
			var p = this._beget();
			var h = p._handler;

			var t = setTimeout(onTimeout, ms, reason, p._handler);

			this._handler.visit(h,
				function onFulfill(x) {
					env.clearTimer(t);
					this.resolve(x); // this = h
				},
				function onReject(x) {
					env.clearTimer(t);
					this.reject(x); // this = h
				},
				h.notify);

			return p;
		};

		function onTimeout(reason, h, ms) {
			var e = typeof reason === 'undefined'
				? new TimeoutError('timed out after ' + ms + 'ms')
				: reason;
			h.reject(e);
		}

		return Promise;
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{"../TimeoutError":10,"../env":21}],19:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function(require) {

	var setTimer = require('../env').setTimer;
	var format = require('../format');

	return function unhandledRejection(Promise) {

		var logError = noop;
		var logInfo = noop;
		var localConsole;

		if(typeof console !== 'undefined') {
			// Alias console to prevent things like uglify's drop_console option from
			// removing console.log/error. Unhandled rejections fall into the same
			// category as uncaught exceptions, and build tools shouldn't silence them.
			localConsole = console;
			logError = typeof localConsole.error !== 'undefined'
				? function (e) { localConsole.error(e); }
				: function (e) { localConsole.log(e); };

			logInfo = typeof localConsole.info !== 'undefined'
				? function (e) { localConsole.info(e); }
				: function (e) { localConsole.log(e); };
		}

		Promise.onPotentiallyUnhandledRejection = function(rejection) {
			enqueue(report, rejection);
		};

		Promise.onPotentiallyUnhandledRejectionHandled = function(rejection) {
			enqueue(unreport, rejection);
		};

		Promise.onFatalRejection = function(rejection) {
			enqueue(throwit, rejection.value);
		};

		var tasks = [];
		var reported = [];
		var running = null;

		function report(r) {
			if(!r.handled) {
				reported.push(r);
				logError('Potentially unhandled rejection [' + r.id + '] ' + format.formatError(r.value));
			}
		}

		function unreport(r) {
			var i = reported.indexOf(r);
			if(i >= 0) {
				reported.splice(i, 1);
				logInfo('Handled previous rejection [' + r.id + '] ' + format.formatObject(r.value));
			}
		}

		function enqueue(f, x) {
			tasks.push(f, x);
			if(running === null) {
				running = setTimer(flush, 0);
			}
		}

		function flush() {
			running = null;
			while(tasks.length > 0) {
				tasks.shift()(tasks.shift());
			}
		}

		return Promise;
	};

	function throwit(e) {
		throw e;
	}

	function noop() {}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{"../env":21,"../format":22}],20:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function addWith(Promise) {
		/**
		 * Returns a promise whose handlers will be called with `this` set to
		 * the supplied receiver.  Subsequent promises derived from the
		 * returned promise will also have their handlers called with receiver
		 * as `this`. Calling `with` with undefined or no arguments will return
		 * a promise whose handlers will again be called in the usual Promises/A+
		 * way (no `this`) thus safely undoing any previous `with` in the
		 * promise chain.
		 *
		 * WARNING: Promises returned from `with`/`withThis` are NOT Promises/A+
		 * compliant, specifically violating 2.2.5 (http://promisesaplus.com/#point-41)
		 *
		 * @param {object} receiver `this` value for all handlers attached to
		 *  the returned promise.
		 * @returns {Promise}
		 */
		Promise.prototype['with'] = Promise.prototype.withThis = function(receiver) {
			var p = this._beget();
			var child = p._handler;
			child.receiver = receiver;
			this._handler.chain(child, receiver);
			return p;
		};

		return Promise;
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));


},{}],21:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/*global process,document,setTimeout,clearTimeout,MutationObserver,WebKitMutationObserver*/
(function(define) { 'use strict';
define(function(require) {
	/*jshint maxcomplexity:6*/

	// Sniff "best" async scheduling option
	// Prefer process.nextTick or MutationObserver, then check for
	// setTimeout, and finally vertx, since its the only env that doesn't
	// have setTimeout

	var MutationObs;
	var capturedSetTimeout = typeof setTimeout !== 'undefined' && setTimeout;

	// Default env
	var setTimer = function(f, ms) { return setTimeout(f, ms); };
	var clearTimer = function(t) { return clearTimeout(t); };
	var asap = function (f) { return capturedSetTimeout(f, 0); };

	// Detect specific env
	if (isNode()) { // Node
		asap = function (f) { return process.nextTick(f); };

	} else if (MutationObs = hasMutationObserver()) { // Modern browser
		asap = initMutationObserver(MutationObs);

	} else if (!capturedSetTimeout) { // vert.x
		var vertxRequire = require;
		var vertx = vertxRequire('vertx');
		setTimer = function (f, ms) { return vertx.setTimer(ms, f); };
		clearTimer = vertx.cancelTimer;
		asap = vertx.runOnLoop || vertx.runOnContext;
	}

	return {
		setTimer: setTimer,
		clearTimer: clearTimer,
		asap: asap
	};

	function isNode () {
		return typeof process !== 'undefined' &&
			Object.prototype.toString.call(process) === '[object process]';
	}

	function hasMutationObserver () {
	    return (typeof MutationObserver !== 'undefined' && MutationObserver) ||
			(typeof WebKitMutationObserver !== 'undefined' && WebKitMutationObserver);
	}

	function initMutationObserver(MutationObserver) {
		var scheduled;
		var node = document.createTextNode('');
		var o = new MutationObserver(run);
		o.observe(node, { characterData: true });

		function run() {
			var f = scheduled;
			scheduled = void 0;
			f();
		}

		var i = 0;
		return function (f) {
			scheduled = f;
			node.data = (i ^= 1);
		};
	}
});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{}],22:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return {
		formatError: formatError,
		formatObject: formatObject,
		tryStringify: tryStringify
	};

	/**
	 * Format an error into a string.  If e is an Error and has a stack property,
	 * it's returned.  Otherwise, e is formatted using formatObject, with a
	 * warning added about e not being a proper Error.
	 * @param {*} e
	 * @returns {String} formatted string, suitable for output to developers
	 */
	function formatError(e) {
		var s = typeof e === 'object' && e !== null && (e.stack || e.message) ? e.stack || e.message : formatObject(e);
		return e instanceof Error ? s : s + ' (WARNING: non-Error used)';
	}

	/**
	 * Format an object, detecting "plain" objects and running them through
	 * JSON.stringify if possible.
	 * @param {Object} o
	 * @returns {string}
	 */
	function formatObject(o) {
		var s = String(o);
		if(s === '[object Object]' && typeof JSON !== 'undefined') {
			s = tryStringify(o, s);
		}
		return s;
	}

	/**
	 * Try to return the result of JSON.stringify(x).  If that fails, return
	 * defaultValue
	 * @param {*} x
	 * @param {*} defaultValue
	 * @returns {String|*} JSON.stringify(x) or defaultValue
	 */
	function tryStringify(x, defaultValue) {
		try {
			return JSON.stringify(x);
		} catch(e) {
			return defaultValue;
		}
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],23:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function liftAll(liftOne, combine, dst, src) {
		if(typeof combine === 'undefined') {
			combine = defaultCombine;
		}

		return Object.keys(src).reduce(function(dst, key) {
			var f = src[key];
			return typeof f === 'function' ? combine(dst, liftOne(f), key) : dst;
		}, typeof dst === 'undefined' ? defaultDst(src) : dst);
	};

	function defaultCombine(o, f, k) {
		o[k] = f;
		return o;
	}

	function defaultDst(src) {
		return typeof src === 'function' ? src.bind() : Object.create(src);
	}
});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],24:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function makePromise(environment) {

		var tasks = environment.scheduler;
		var emitRejection = initEmitRejection();

		var objectCreate = Object.create ||
			function(proto) {
				function Child() {}
				Child.prototype = proto;
				return new Child();
			};

		/**
		 * Create a promise whose fate is determined by resolver
		 * @constructor
		 * @returns {Promise} promise
		 * @name Promise
		 */
		function Promise(resolver, handler) {
			this._handler = resolver === Handler ? handler : init(resolver);
		}

		/**
		 * Run the supplied resolver
		 * @param resolver
		 * @returns {Pending}
		 */
		function init(resolver) {
			var handler = new Pending();

			try {
				resolver(promiseResolve, promiseReject, promiseNotify);
			} catch (e) {
				promiseReject(e);
			}

			return handler;

			/**
			 * Transition from pre-resolution state to post-resolution state, notifying
			 * all listeners of the ultimate fulfillment or rejection
			 * @param {*} x resolution value
			 */
			function promiseResolve (x) {
				handler.resolve(x);
			}
			/**
			 * Reject this promise with reason, which will be used verbatim
			 * @param {Error|*} reason rejection reason, strongly suggested
			 *   to be an Error type
			 */
			function promiseReject (reason) {
				handler.reject(reason);
			}

			/**
			 * @deprecated
			 * Issue a progress event, notifying all progress listeners
			 * @param {*} x progress event payload to pass to all listeners
			 */
			function promiseNotify (x) {
				handler.notify(x);
			}
		}

		// Creation

		Promise.resolve = resolve;
		Promise.reject = reject;
		Promise.never = never;

		Promise._defer = defer;
		Promise._handler = getHandler;

		/**
		 * Returns a trusted promise. If x is already a trusted promise, it is
		 * returned, otherwise returns a new trusted Promise which follows x.
		 * @param  {*} x
		 * @return {Promise} promise
		 */
		function resolve(x) {
			return isPromise(x) ? x
				: new Promise(Handler, new Async(getHandler(x)));
		}

		/**
		 * Return a reject promise with x as its reason (x is used verbatim)
		 * @param {*} x
		 * @returns {Promise} rejected promise
		 */
		function reject(x) {
			return new Promise(Handler, new Async(new Rejected(x)));
		}

		/**
		 * Return a promise that remains pending forever
		 * @returns {Promise} forever-pending promise.
		 */
		function never() {
			return foreverPendingPromise; // Should be frozen
		}

		/**
		 * Creates an internal {promise, resolver} pair
		 * @private
		 * @returns {Promise}
		 */
		function defer() {
			return new Promise(Handler, new Pending());
		}

		// Transformation and flow control

		/**
		 * Transform this promise's fulfillment value, returning a new Promise
		 * for the transformed result.  If the promise cannot be fulfilled, onRejected
		 * is called with the reason.  onProgress *may* be called with updates toward
		 * this promise's fulfillment.
		 * @param {function=} onFulfilled fulfillment handler
		 * @param {function=} onRejected rejection handler
		 * @param {function=} onProgress @deprecated progress handler
		 * @return {Promise} new promise
		 */
		Promise.prototype.then = function(onFulfilled, onRejected, onProgress) {
			var parent = this._handler;
			var state = parent.join().state();

			if ((typeof onFulfilled !== 'function' && state > 0) ||
				(typeof onRejected !== 'function' && state < 0)) {
				// Short circuit: value will not change, simply share handler
				return new this.constructor(Handler, parent);
			}

			var p = this._beget();
			var child = p._handler;

			parent.chain(child, parent.receiver, onFulfilled, onRejected, onProgress);

			return p;
		};

		/**
		 * If this promise cannot be fulfilled due to an error, call onRejected to
		 * handle the error. Shortcut for .then(undefined, onRejected)
		 * @param {function?} onRejected
		 * @return {Promise}
		 */
		Promise.prototype['catch'] = function(onRejected) {
			return this.then(void 0, onRejected);
		};

		/**
		 * Creates a new, pending promise of the same type as this promise
		 * @private
		 * @returns {Promise}
		 */
		Promise.prototype._beget = function() {
			return begetFrom(this._handler, this.constructor);
		};

		function begetFrom(parent, Promise) {
			var child = new Pending(parent.receiver, parent.join().context);
			return new Promise(Handler, child);
		}

		// Array combinators

		Promise.all = all;
		Promise.race = race;
		Promise._traverse = traverse;

		/**
		 * Return a promise that will fulfill when all promises in the
		 * input array have fulfilled, or will reject when one of the
		 * promises rejects.
		 * @param {array} promises array of promises
		 * @returns {Promise} promise for array of fulfillment values
		 */
		function all(promises) {
			return traverseWith(snd, null, promises);
		}

		/**
		 * Array<Promise<X>> -> Promise<Array<f(X)>>
		 * @private
		 * @param {function} f function to apply to each promise's value
		 * @param {Array} promises array of promises
		 * @returns {Promise} promise for transformed values
		 */
		function traverse(f, promises) {
			return traverseWith(tryCatch2, f, promises);
		}

		function traverseWith(tryMap, f, promises) {
			var handler = typeof f === 'function' ? mapAt : settleAt;

			var resolver = new Pending();
			var pending = promises.length >>> 0;
			var results = new Array(pending);

			for (var i = 0, x; i < promises.length && !resolver.resolved; ++i) {
				x = promises[i];

				if (x === void 0 && !(i in promises)) {
					--pending;
					continue;
				}

				traverseAt(promises, handler, i, x, resolver);
			}

			if(pending === 0) {
				resolver.become(new Fulfilled(results));
			}

			return new Promise(Handler, resolver);

			function mapAt(i, x, resolver) {
				if(!resolver.resolved) {
					traverseAt(promises, settleAt, i, tryMap(f, x, i), resolver);
				}
			}

			function settleAt(i, x, resolver) {
				results[i] = x;
				if(--pending === 0) {
					resolver.become(new Fulfilled(results));
				}
			}
		}

		function traverseAt(promises, handler, i, x, resolver) {
			if (maybeThenable(x)) {
				var h = getHandlerMaybeThenable(x);
				var s = h.state();

				if (s === 0) {
					h.fold(handler, i, void 0, resolver);
				} else if (s > 0) {
					handler(i, h.value, resolver);
				} else {
					resolver.become(h);
					visitRemaining(promises, i+1, h);
				}
			} else {
				handler(i, x, resolver);
			}
		}

		Promise._visitRemaining = visitRemaining;
		function visitRemaining(promises, start, handler) {
			for(var i=start; i<promises.length; ++i) {
				markAsHandled(getHandler(promises[i]), handler);
			}
		}

		function markAsHandled(h, handler) {
			if(h === handler) {
				return;
			}

			var s = h.state();
			if(s === 0) {
				h.visit(h, void 0, h._unreport);
			} else if(s < 0) {
				h._unreport();
			}
		}

		/**
		 * Fulfill-reject competitive race. Return a promise that will settle
		 * to the same state as the earliest input promise to settle.
		 *
		 * WARNING: The ES6 Promise spec requires that race()ing an empty array
		 * must return a promise that is pending forever.  This implementation
		 * returns a singleton forever-pending promise, the same singleton that is
		 * returned by Promise.never(), thus can be checked with ===
		 *
		 * @param {array} promises array of promises to race
		 * @returns {Promise} if input is non-empty, a promise that will settle
		 * to the same outcome as the earliest input promise to settle. if empty
		 * is empty, returns a promise that will never settle.
		 */
		function race(promises) {
			if(typeof promises !== 'object' || promises === null) {
				return reject(new TypeError('non-iterable passed to race()'));
			}

			// Sigh, race([]) is untestable unless we return *something*
			// that is recognizable without calling .then() on it.
			return promises.length === 0 ? never()
				 : promises.length === 1 ? resolve(promises[0])
				 : runRace(promises);
		}

		function runRace(promises) {
			var resolver = new Pending();
			var i, x, h;
			for(i=0; i<promises.length; ++i) {
				x = promises[i];
				if (x === void 0 && !(i in promises)) {
					continue;
				}

				h = getHandler(x);
				if(h.state() !== 0) {
					resolver.become(h);
					visitRemaining(promises, i+1, h);
					break;
				} else {
					h.visit(resolver, resolver.resolve, resolver.reject);
				}
			}
			return new Promise(Handler, resolver);
		}

		// Promise internals
		// Below this, everything is @private

		/**
		 * Get an appropriate handler for x, without checking for cycles
		 * @param {*} x
		 * @returns {object} handler
		 */
		function getHandler(x) {
			if(isPromise(x)) {
				return x._handler.join();
			}
			return maybeThenable(x) ? getHandlerUntrusted(x) : new Fulfilled(x);
		}

		/**
		 * Get a handler for thenable x.
		 * NOTE: You must only call this if maybeThenable(x) == true
		 * @param {object|function|Promise} x
		 * @returns {object} handler
		 */
		function getHandlerMaybeThenable(x) {
			return isPromise(x) ? x._handler.join() : getHandlerUntrusted(x);
		}

		/**
		 * Get a handler for potentially untrusted thenable x
		 * @param {*} x
		 * @returns {object} handler
		 */
		function getHandlerUntrusted(x) {
			try {
				var untrustedThen = x.then;
				return typeof untrustedThen === 'function'
					? new Thenable(untrustedThen, x)
					: new Fulfilled(x);
			} catch(e) {
				return new Rejected(e);
			}
		}

		/**
		 * Handler for a promise that is pending forever
		 * @constructor
		 */
		function Handler() {}

		Handler.prototype.when
			= Handler.prototype.become
			= Handler.prototype.notify // deprecated
			= Handler.prototype.fail
			= Handler.prototype._unreport
			= Handler.prototype._report
			= noop;

		Handler.prototype._state = 0;

		Handler.prototype.state = function() {
			return this._state;
		};

		/**
		 * Recursively collapse handler chain to find the handler
		 * nearest to the fully resolved value.
		 * @returns {object} handler nearest the fully resolved value
		 */
		Handler.prototype.join = function() {
			var h = this;
			while(h.handler !== void 0) {
				h = h.handler;
			}
			return h;
		};

		Handler.prototype.chain = function(to, receiver, fulfilled, rejected, progress) {
			this.when({
				resolver: to,
				receiver: receiver,
				fulfilled: fulfilled,
				rejected: rejected,
				progress: progress
			});
		};

		Handler.prototype.visit = function(receiver, fulfilled, rejected, progress) {
			this.chain(failIfRejected, receiver, fulfilled, rejected, progress);
		};

		Handler.prototype.fold = function(f, z, c, to) {
			this.when(new Fold(f, z, c, to));
		};

		/**
		 * Handler that invokes fail() on any handler it becomes
		 * @constructor
		 */
		function FailIfRejected() {}

		inherit(Handler, FailIfRejected);

		FailIfRejected.prototype.become = function(h) {
			h.fail();
		};

		var failIfRejected = new FailIfRejected();

		/**
		 * Handler that manages a queue of consumers waiting on a pending promise
		 * @constructor
		 */
		function Pending(receiver, inheritedContext) {
			Promise.createContext(this, inheritedContext);

			this.consumers = void 0;
			this.receiver = receiver;
			this.handler = void 0;
			this.resolved = false;
		}

		inherit(Handler, Pending);

		Pending.prototype._state = 0;

		Pending.prototype.resolve = function(x) {
			this.become(getHandler(x));
		};

		Pending.prototype.reject = function(x) {
			if(this.resolved) {
				return;
			}

			this.become(new Rejected(x));
		};

		Pending.prototype.join = function() {
			if (!this.resolved) {
				return this;
			}

			var h = this;

			while (h.handler !== void 0) {
				h = h.handler;
				if (h === this) {
					return this.handler = cycle();
				}
			}

			return h;
		};

		Pending.prototype.run = function() {
			var q = this.consumers;
			var handler = this.handler;
			this.handler = this.handler.join();
			this.consumers = void 0;

			for (var i = 0; i < q.length; ++i) {
				handler.when(q[i]);
			}
		};

		Pending.prototype.become = function(handler) {
			if(this.resolved) {
				return;
			}

			this.resolved = true;
			this.handler = handler;
			if(this.consumers !== void 0) {
				tasks.enqueue(this);
			}

			if(this.context !== void 0) {
				handler._report(this.context);
			}
		};

		Pending.prototype.when = function(continuation) {
			if(this.resolved) {
				tasks.enqueue(new ContinuationTask(continuation, this.handler));
			} else {
				if(this.consumers === void 0) {
					this.consumers = [continuation];
				} else {
					this.consumers.push(continuation);
				}
			}
		};

		/**
		 * @deprecated
		 */
		Pending.prototype.notify = function(x) {
			if(!this.resolved) {
				tasks.enqueue(new ProgressTask(x, this));
			}
		};

		Pending.prototype.fail = function(context) {
			var c = typeof context === 'undefined' ? this.context : context;
			this.resolved && this.handler.join().fail(c);
		};

		Pending.prototype._report = function(context) {
			this.resolved && this.handler.join()._report(context);
		};

		Pending.prototype._unreport = function() {
			this.resolved && this.handler.join()._unreport();
		};

		/**
		 * Wrap another handler and force it into a future stack
		 * @param {object} handler
		 * @constructor
		 */
		function Async(handler) {
			this.handler = handler;
		}

		inherit(Handler, Async);

		Async.prototype.when = function(continuation) {
			tasks.enqueue(new ContinuationTask(continuation, this));
		};

		Async.prototype._report = function(context) {
			this.join()._report(context);
		};

		Async.prototype._unreport = function() {
			this.join()._unreport();
		};

		/**
		 * Handler that wraps an untrusted thenable and assimilates it in a future stack
		 * @param {function} then
		 * @param {{then: function}} thenable
		 * @constructor
		 */
		function Thenable(then, thenable) {
			Pending.call(this);
			tasks.enqueue(new AssimilateTask(then, thenable, this));
		}

		inherit(Pending, Thenable);

		/**
		 * Handler for a fulfilled promise
		 * @param {*} x fulfillment value
		 * @constructor
		 */
		function Fulfilled(x) {
			Promise.createContext(this);
			this.value = x;
		}

		inherit(Handler, Fulfilled);

		Fulfilled.prototype._state = 1;

		Fulfilled.prototype.fold = function(f, z, c, to) {
			runContinuation3(f, z, this, c, to);
		};

		Fulfilled.prototype.when = function(cont) {
			runContinuation1(cont.fulfilled, this, cont.receiver, cont.resolver);
		};

		var errorId = 0;

		/**
		 * Handler for a rejected promise
		 * @param {*} x rejection reason
		 * @constructor
		 */
		function Rejected(x) {
			Promise.createContext(this);

			this.id = ++errorId;
			this.value = x;
			this.handled = false;
			this.reported = false;

			this._report();
		}

		inherit(Handler, Rejected);

		Rejected.prototype._state = -1;

		Rejected.prototype.fold = function(f, z, c, to) {
			to.become(this);
		};

		Rejected.prototype.when = function(cont) {
			if(typeof cont.rejected === 'function') {
				this._unreport();
			}
			runContinuation1(cont.rejected, this, cont.receiver, cont.resolver);
		};

		Rejected.prototype._report = function(context) {
			tasks.afterQueue(new ReportTask(this, context));
		};

		Rejected.prototype._unreport = function() {
			if(this.handled) {
				return;
			}
			this.handled = true;
			tasks.afterQueue(new UnreportTask(this));
		};

		Rejected.prototype.fail = function(context) {
			this.reported = true;
			emitRejection('unhandledRejection', this);
			Promise.onFatalRejection(this, context === void 0 ? this.context : context);
		};

		function ReportTask(rejection, context) {
			this.rejection = rejection;
			this.context = context;
		}

		ReportTask.prototype.run = function() {
			if(!this.rejection.handled && !this.rejection.reported) {
				this.rejection.reported = true;
				emitRejection('unhandledRejection', this.rejection) ||
					Promise.onPotentiallyUnhandledRejection(this.rejection, this.context);
			}
		};

		function UnreportTask(rejection) {
			this.rejection = rejection;
		}

		UnreportTask.prototype.run = function() {
			if(this.rejection.reported) {
				emitRejection('rejectionHandled', this.rejection) ||
					Promise.onPotentiallyUnhandledRejectionHandled(this.rejection);
			}
		};

		// Unhandled rejection hooks
		// By default, everything is a noop

		Promise.createContext
			= Promise.enterContext
			= Promise.exitContext
			= Promise.onPotentiallyUnhandledRejection
			= Promise.onPotentiallyUnhandledRejectionHandled
			= Promise.onFatalRejection
			= noop;

		// Errors and singletons

		var foreverPendingHandler = new Handler();
		var foreverPendingPromise = new Promise(Handler, foreverPendingHandler);

		function cycle() {
			return new Rejected(new TypeError('Promise cycle'));
		}

		// Task runners

		/**
		 * Run a single consumer
		 * @constructor
		 */
		function ContinuationTask(continuation, handler) {
			this.continuation = continuation;
			this.handler = handler;
		}

		ContinuationTask.prototype.run = function() {
			this.handler.join().when(this.continuation);
		};

		/**
		 * Run a queue of progress handlers
		 * @constructor
		 */
		function ProgressTask(value, handler) {
			this.handler = handler;
			this.value = value;
		}

		ProgressTask.prototype.run = function() {
			var q = this.handler.consumers;
			if(q === void 0) {
				return;
			}

			for (var c, i = 0; i < q.length; ++i) {
				c = q[i];
				runNotify(c.progress, this.value, this.handler, c.receiver, c.resolver);
			}
		};

		/**
		 * Assimilate a thenable, sending it's value to resolver
		 * @param {function} then
		 * @param {object|function} thenable
		 * @param {object} resolver
		 * @constructor
		 */
		function AssimilateTask(then, thenable, resolver) {
			this._then = then;
			this.thenable = thenable;
			this.resolver = resolver;
		}

		AssimilateTask.prototype.run = function() {
			var h = this.resolver;
			tryAssimilate(this._then, this.thenable, _resolve, _reject, _notify);

			function _resolve(x) { h.resolve(x); }
			function _reject(x)  { h.reject(x); }
			function _notify(x)  { h.notify(x); }
		};

		function tryAssimilate(then, thenable, resolve, reject, notify) {
			try {
				then.call(thenable, resolve, reject, notify);
			} catch (e) {
				reject(e);
			}
		}

		/**
		 * Fold a handler value with z
		 * @constructor
		 */
		function Fold(f, z, c, to) {
			this.f = f; this.z = z; this.c = c; this.to = to;
			this.resolver = failIfRejected;
			this.receiver = this;
		}

		Fold.prototype.fulfilled = function(x) {
			this.f.call(this.c, this.z, x, this.to);
		};

		Fold.prototype.rejected = function(x) {
			this.to.reject(x);
		};

		Fold.prototype.progress = function(x) {
			this.to.notify(x);
		};

		// Other helpers

		/**
		 * @param {*} x
		 * @returns {boolean} true iff x is a trusted Promise
		 */
		function isPromise(x) {
			return x instanceof Promise;
		}

		/**
		 * Test just enough to rule out primitives, in order to take faster
		 * paths in some code
		 * @param {*} x
		 * @returns {boolean} false iff x is guaranteed *not* to be a thenable
		 */
		function maybeThenable(x) {
			return (typeof x === 'object' || typeof x === 'function') && x !== null;
		}

		function runContinuation1(f, h, receiver, next) {
			if(typeof f !== 'function') {
				return next.become(h);
			}

			Promise.enterContext(h);
			tryCatchReject(f, h.value, receiver, next);
			Promise.exitContext();
		}

		function runContinuation3(f, x, h, receiver, next) {
			if(typeof f !== 'function') {
				return next.become(h);
			}

			Promise.enterContext(h);
			tryCatchReject3(f, x, h.value, receiver, next);
			Promise.exitContext();
		}

		/**
		 * @deprecated
		 */
		function runNotify(f, x, h, receiver, next) {
			if(typeof f !== 'function') {
				return next.notify(x);
			}

			Promise.enterContext(h);
			tryCatchReturn(f, x, receiver, next);
			Promise.exitContext();
		}

		function tryCatch2(f, a, b) {
			try {
				return f(a, b);
			} catch(e) {
				return reject(e);
			}
		}

		/**
		 * Return f.call(thisArg, x), or if it throws return a rejected promise for
		 * the thrown exception
		 */
		function tryCatchReject(f, x, thisArg, next) {
			try {
				next.become(getHandler(f.call(thisArg, x)));
			} catch(e) {
				next.become(new Rejected(e));
			}
		}

		/**
		 * Same as above, but includes the extra argument parameter.
		 */
		function tryCatchReject3(f, x, y, thisArg, next) {
			try {
				f.call(thisArg, x, y, next);
			} catch(e) {
				next.become(new Rejected(e));
			}
		}

		/**
		 * @deprecated
		 * Return f.call(thisArg, x), or if it throws, *return* the exception
		 */
		function tryCatchReturn(f, x, thisArg, next) {
			try {
				next.notify(f.call(thisArg, x));
			} catch(e) {
				next.notify(e);
			}
		}

		function inherit(Parent, Child) {
			Child.prototype = objectCreate(Parent.prototype);
			Child.prototype.constructor = Child;
		}

		function snd(x, y) {
			return y;
		}

		function noop() {}

		function hasCustomEvent() {
			if(typeof CustomEvent === 'function') {
				try {
					var ev = new CustomEvent('unhandledRejection');
					return ev instanceof CustomEvent;
				} catch (ignoredException) {}
			}
			return false;
		}

		function hasInternetExplorerCustomEvent() {
			if(typeof document !== 'undefined' && typeof document.createEvent === 'function') {
				try {
					// Try to create one event to make sure it's supported
					var ev = document.createEvent('CustomEvent');
					ev.initCustomEvent('eventType', false, true, {});
					return true;
				} catch (ignoredException) {}
			}
			return false;
		}

		function initEmitRejection() {
			/*global process, self, CustomEvent*/
			if(typeof process !== 'undefined' && process !== null
				&& typeof process.emit === 'function') {
				// Returning falsy here means to call the default
				// onPotentiallyUnhandledRejection API.  This is safe even in
				// browserify since process.emit always returns falsy in browserify:
				// https://github.com/defunctzombie/node-process/blob/master/browser.js#L40-L46
				return function(type, rejection) {
					return type === 'unhandledRejection'
						? process.emit(type, rejection.value, rejection)
						: process.emit(type, rejection);
				};
			} else if(typeof self !== 'undefined' && hasCustomEvent()) {
				return (function (self, CustomEvent) {
					return function (type, rejection) {
						var ev = new CustomEvent(type, {
							detail: {
								reason: rejection.value,
								key: rejection
							},
							bubbles: false,
							cancelable: true
						});

						return !self.dispatchEvent(ev);
					};
				}(self, CustomEvent));
			} else if(typeof self !== 'undefined' && hasInternetExplorerCustomEvent()) {
				return (function(self, document) {
					return function(type, rejection) {
						var ev = document.createEvent('CustomEvent');
						ev.initCustomEvent(type, false, true, {
							reason: rejection.value,
							key: rejection
						});

						return !self.dispatchEvent(ev);
					};
				}(self, document));
			}

			return noop;
		}

		return Promise;
	};
});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],25:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return {
		pending: toPendingState,
		fulfilled: toFulfilledState,
		rejected: toRejectedState,
		inspect: inspect
	};

	function toPendingState() {
		return { state: 'pending' };
	}

	function toRejectedState(e) {
		return { state: 'rejected', reason: e };
	}

	function toFulfilledState(x) {
		return { state: 'fulfilled', value: x };
	}

	function inspect(handler) {
		var state = handler.state();
		return state === 0 ? toPendingState()
			 : state > 0   ? toFulfilledState(handler.value)
			               : toRejectedState(handler.value);
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],26:[function(require,module,exports){
/** @license MIT License (c) copyright 2013 original author or authors */

/**
 * Collection of helpers for interfacing with node-style asynchronous functions
 * using promises.
 *
 * @author Brian Cavalier
 * @contributor Renato Zannon
 */

(function(define) {
define(function(require) {

	var when = require('./when');
	var _liftAll = require('./lib/liftAll');
	var setTimer = require('./lib/env').setTimer;
	var slice = Array.prototype.slice;

	var _apply = require('./lib/apply')(when.Promise, dispatch);

	return {
		lift: lift,
		liftAll: liftAll,
		apply: apply,
		call: call,
		createCallback: createCallback,
		bindCallback: bindCallback,
		liftCallback: liftCallback
	};

	/**
	 * Takes a node-style async function and calls it immediately (with an optional
	 * array of arguments or promises for arguments). It returns a promise whose
	 * resolution depends on whether the async functions calls its callback with the
	 * conventional error argument or not.
	 *
	 * With this it becomes possible to leverage existing APIs while still reaping
	 * the benefits of promises.
	 *
	 * @example
	 *    function onlySmallNumbers(n, callback) {
	 *		if(n < 10) {
	 *			callback(null, n + 10);
	 *		} else {
	 *			callback(new Error("Calculation failed"));
	 *		}
	 *	}
	 *
	 *    var nodefn = require("when/node/function");
	 *
	 *    // Logs '15'
	 *    nodefn.apply(onlySmallNumbers, [5]).then(console.log, console.error);
	 *
	 *    // Logs 'Calculation failed'
	 *    nodefn.apply(onlySmallNumbers, [15]).then(console.log, console.error);
	 *
	 * @param {function} f node-style function that will be called
	 * @param {Array} [args] array of arguments to func
	 * @returns {Promise} promise for the value func passes to its callback
	 */
	function apply(f, args) {
		return _apply(f, this, args || []);
	}

	function dispatch(f, thisArg, args, h) {
		var cb = createCallback(h);
		try {
			switch(args.length) {
				case 2: f.call(thisArg, args[0], args[1], cb); break;
				case 1: f.call(thisArg, args[0], cb); break;
				case 0: f.call(thisArg, cb); break;
				default:
					args.push(cb);
					f.apply(thisArg, args);
			}
		} catch(e) {
			h.reject(e);
		}
	}

	/**
	 * Has the same behavior that {@link apply} has, with the difference that the
	 * arguments to the function are provided individually, while {@link apply} accepts
	 * a single array.
	 *
	 * @example
	 *    function sumSmallNumbers(x, y, callback) {
	 *		var result = x + y;
	 *		if(result < 10) {
	 *			callback(null, result);
	 *		} else {
	 *			callback(new Error("Calculation failed"));
	 *		}
	 *	}
	 *
	 *    // Logs '5'
	 *    nodefn.call(sumSmallNumbers, 2, 3).then(console.log, console.error);
	 *
	 *    // Logs 'Calculation failed'
	 *    nodefn.call(sumSmallNumbers, 5, 10).then(console.log, console.error);
	 *
	 * @param {function} f node-style function that will be called
	 * @param {...*} [args] arguments that will be forwarded to the function
	 * @returns {Promise} promise for the value func passes to its callback
	 */
	function call(f /*, args... */) {
		return _apply(f, this, slice.call(arguments, 1));
	}

	/**
	 * Takes a node-style function and returns new function that wraps the
	 * original and, instead of taking a callback, returns a promise. Also, it
	 * knows how to handle promises given as arguments, waiting for their
	 * resolution before executing.
	 *
	 * Upon execution, the orginal function is executed as well. If it passes
	 * a truthy value as the first argument to the callback, it will be
	 * interpreted as an error condition, and the promise will be rejected
	 * with it. Otherwise, the call is considered a resolution, and the promise
	 * is resolved with the callback's second argument.
	 *
	 * @example
	 *    var fs = require("fs"), nodefn = require("when/node/function");
	 *
	 *    var promiseRead = nodefn.lift(fs.readFile);
	 *
	 *    // The promise is resolved with the contents of the file if everything
	 *    // goes ok
	 *    promiseRead('exists.txt').then(console.log, console.error);
	 *
	 *    // And will be rejected if something doesn't work out
	 *    // (e.g. the files does not exist)
	 *    promiseRead('doesnt_exist.txt').then(console.log, console.error);
	 *
	 *
	 * @param {Function} f node-style function to be lifted
	 * @param {...*} [args] arguments to be prepended for the new function @deprecated
	 * @returns {Function} a promise-returning function
	 */
	function lift(f /*, args... */) {
		var args1 = arguments.length > 1 ? slice.call(arguments, 1) : [];
		return function() {
			// TODO: Simplify once partialing has been removed
			var l = args1.length;
			var al = arguments.length;
			var args = new Array(al + l);
			var i;
			for(i=0; i<l; ++i) {
				args[i] = args1[i];
			}
			for(i=0; i<al; ++i) {
				args[i+l] = arguments[i];
			}
			return _apply(f, this, args);
		};
	}

	/**
	 * Lift all the functions/methods on src
	 * @param {object|function} src source whose functions will be lifted
	 * @param {function?} combine optional function for customizing the lifting
	 *  process. It is passed dst, the lifted function, and the property name of
	 *  the original function on src.
	 * @param {(object|function)?} dst option destination host onto which to place lifted
	 *  functions. If not provided, liftAll returns a new object.
	 * @returns {*} If dst is provided, returns dst with lifted functions as
	 *  properties.  If dst not provided, returns a new object with lifted functions.
	 */
	function liftAll(src, combine, dst) {
		return _liftAll(lift, combine, dst, src);
	}

	/**
	 * Takes an object that responds to the resolver interface, and returns
	 * a function that will resolve or reject it depending on how it is called.
	 *
	 * @example
	 *	function callbackTakingFunction(callback) {
	 *		if(somethingWrongHappened) {
	 *			callback(error);
	 *		} else {
	 *			callback(null, interestingValue);
	 *		}
	 *	}
	 *
	 *	var when = require('when'), nodefn = require('when/node/function');
	 *
	 *	var deferred = when.defer();
	 *	callbackTakingFunction(nodefn.createCallback(deferred.resolver));
	 *
	 *	deferred.promise.then(function(interestingValue) {
	 *		// Use interestingValue
	 *	});
	 *
	 * @param {Resolver} resolver that will be 'attached' to the callback
	 * @returns {Function} a node-style callback function
	 */
	function createCallback(resolver) {
		return function(err, value) {
			if(err) {
				resolver.reject(err);
			} else if(arguments.length > 2) {
				resolver.resolve(slice.call(arguments, 1));
			} else {
				resolver.resolve(value);
			}
		};
	}

	/**
	 * Attaches a node-style callback to a promise, ensuring the callback is
	 * called for either fulfillment or rejection. Returns a promise with the same
	 * state as the passed-in promise.
	 *
	 * @example
	 *	var deferred = when.defer();
	 *
	 *	function callback(err, value) {
	 *		// Handle err or use value
	 *	}
	 *
	 *	bindCallback(deferred.promise, callback);
	 *
	 *	deferred.resolve('interesting value');
	 *
	 * @param {Promise} promise The promise to be attached to.
	 * @param {Function} callback The node-style callback to attach.
	 * @returns {Promise} A promise with the same state as the passed-in promise.
	 */
	function bindCallback(promise, callback) {
		promise = when(promise);

		if (callback) {
			promise.then(success, wrapped);
		}

		return promise;

		function success(value) {
			wrapped(null, value);
		}

		function wrapped(err, value) {
			setTimer(function () {
				callback(err, value);
			}, 0);
		}
	}

	/**
	 * Takes a node-style callback and returns new function that accepts a
	 * promise, calling the original callback when the promise is either
	 * fulfilled or rejected with the appropriate arguments.
	 *
	 * @example
	 *	var deferred = when.defer();
	 *
	 *	function callback(err, value) {
	 *		// Handle err or use value
	 *	}
	 *
	 *	var wrapped = liftCallback(callback);
	 *
	 *	// `wrapped` can now be passed around at will
	 *	wrapped(deferred.promise);
	 *
	 *	deferred.resolve('interesting value');
	 *
	 * @param {Function} callback The node-style callback to wrap.
	 * @returns {Function} The lifted, promise-accepting function.
	 */
	function liftCallback(callback) {
		return function(promise) {
			return bindCallback(promise, callback);
		};
	}
});

})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });




},{"./lib/apply":11,"./lib/env":21,"./lib/liftAll":23,"./when":32}],27:[function(require,module,exports){
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * parallel.js
 *
 * Run a set of task functions in parallel.  All tasks will
 * receive the same args
 *
 * @author Brian Cavalier
 * @author John Hann
 */

(function(define) {
define(function(require) {

	var when = require('./when');
	var all = when.Promise.all;
	var slice = Array.prototype.slice;

	/**
	 * Run array of tasks in parallel
	 * @param tasks {Array|Promise} array or promiseForArray of task functions
	 * @param [args] {*} arguments to be passed to all tasks
	 * @return {Promise} promise for array containing the
	 * result of each task in the array position corresponding
	 * to position of the task in the tasks array
	 */
	return function parallel(tasks /*, args... */) {
		return all(slice.call(arguments, 1)).then(function(args) {
			return when.map(tasks, function(task) {
				return task.apply(void 0, args);
			});
		});
	};

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });



},{"./when":32}],28:[function(require,module,exports){
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * pipeline.js
 *
 * Run a set of task functions in sequence, passing the result
 * of the previous as an argument to the next.  Like a shell
 * pipeline, e.g. `cat file.txt | grep 'foo' | sed -e 's/foo/bar/g'
 *
 * @author Brian Cavalier
 * @author John Hann
 */

(function(define) {
define(function(require) {

	var when = require('./when');
	var all = when.Promise.all;
	var slice = Array.prototype.slice;

	/**
	 * Run array of tasks in a pipeline where the next
	 * tasks receives the result of the previous.  The first task
	 * will receive the initialArgs as its argument list.
	 * @param tasks {Array|Promise} array or promise for array of task functions
	 * @param [initialArgs...] {*} arguments to be passed to the first task
	 * @return {Promise} promise for return value of the final task
	 */
	return function pipeline(tasks /* initialArgs... */) {
		// Self-optimizing function to run first task with multiple
		// args using apply, but subsequence tasks via direct invocation
		var runTask = function(args, task) {
			runTask = function(arg, task) {
				return task(arg);
			};

			return task.apply(null, args);
		};

		return all(slice.call(arguments, 1)).then(function(args) {
			return when.reduce(tasks, function(arg, task) {
				return runTask(arg, task);
			}, args);
		});
	};

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });



},{"./when":32}],29:[function(require,module,exports){
/** @license MIT License (c) copyright 2012-2013 original author or authors */

/**
 * poll.js
 *
 * Helper that polls until cancelled or for a condition to become true.
 *
 * @author Scott Andrews
 */

(function (define) { 'use strict';
define(function(require) {

	var when = require('./when');
	var attempt = when['try'];
	var cancelable = require('./cancelable');

	/**
	 * Periodically execute the task function on the msec delay. The result of
	 * the task may be verified by watching for a condition to become true. The
	 * returned deferred is cancellable if the polling needs to be cancelled
	 * externally before reaching a resolved state.
	 *
	 * The next vote is scheduled after the results of the current vote are
	 * verified and rejected.
	 *
	 * Polling may be terminated by the verifier returning a truthy value,
	 * invoking cancel() on the returned promise, or the task function returning
	 * a rejected promise.
	 *
	 * Usage:
	 *
	 * var count = 0;
	 * function doSomething() { return count++ }
	 *
	 * // poll until cancelled
	 * var p = poll(doSomething, 1000);
	 * ...
	 * p.cancel();
	 *
	 * // poll until condition is met
	 * poll(doSomething, 1000, function(result) { return result > 10 })
	 *     .then(function(result) { assert result == 10 });
	 *
	 * // delay first vote
	 * poll(doSomething, 1000, anyFunc, true);
	 *
	 * @param task {Function} function that is executed after every timeout
	 * @param interval {number|Function} timeout in milliseconds
	 * @param [verifier] {Function} function to evaluate the result of the vote.
	 *     May return a {Promise} or a {Boolean}. Rejecting the promise or a
	 *     falsey value will schedule the next vote.
	 * @param [delayInitialTask] {boolean} if truthy, the first vote is scheduled
	 *     instead of immediate
	 *
	 * @returns {Promise}
	 */
	return function poll(task, interval, verifier, delayInitialTask) {
		var deferred, canceled, reject;

		canceled = false;
		deferred = cancelable(when.defer(), function () { canceled = true; });
		reject = deferred.reject;

		verifier = verifier || function () { return false; };

		if (typeof interval !== 'function') {
			interval = (function (interval) {
				return function () { return when().delay(interval); };
			})(interval);
		}

		function certify(result) {
			deferred.resolve(result);
		}

		function schedule(result) {
			attempt(interval).then(vote, reject);
			if (result !== void 0) {
				deferred.notify(result);
			}
		}

		function vote() {
			if (canceled) { return; }
			when(task(),
				function (result) {
					when(verifier(result),
						function (verification) {
							return verification ? certify(result) : schedule(result);
						},
						function () { schedule(result); }
					);
				},
				reject
			);
		}

		if (delayInitialTask) {
			schedule();
		} else {
			// if task() is blocking, vote will also block
			vote();
		}

		// make the promise cancelable
		deferred.promise = Object.create(deferred.promise);
		deferred.promise.cancel = deferred.cancel;

		return deferred.promise;
	};

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

},{"./cancelable":3,"./when":32}],30:[function(require,module,exports){
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * sequence.js
 *
 * Run a set of task functions in sequence.  All tasks will
 * receive the same args.
 *
 * @author Brian Cavalier
 * @author John Hann
 */

(function(define) {
define(function(require) {

	var when = require('./when');
	var all = when.Promise.all;
	var slice = Array.prototype.slice;

	/**
	 * Run array of tasks in sequence with no overlap
	 * @param tasks {Array|Promise} array or promiseForArray of task functions
	 * @param [args] {*} arguments to be passed to all tasks
	 * @return {Promise} promise for an array containing
	 * the result of each task in the array position corresponding
	 * to position of the task in the tasks array
	 */
	return function sequence(tasks /*, args... */) {
		var results = [];

		return all(slice.call(arguments, 1)).then(function(args) {
			return when.reduce(tasks, function(results, task) {
				return when(task.apply(void 0, args), addResult);
			}, results);
		});

		function addResult(result) {
			results.push(result);
			return results;
		}
	};

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });



},{"./when":32}],31:[function(require,module,exports){
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * timeout.js
 *
 * Helper that returns a promise that rejects after a specified timeout,
 * if not explicitly resolved or rejected before that.
 *
 * @author Brian Cavalier
 * @author John Hann
 */

(function(define) {
define(function(require) {

	var when = require('./when');

    /**
	 * @deprecated Use when(trigger).timeout(ms)
     */
    return function timeout(msec, trigger) {
		return when(trigger).timeout(msec);
    };
});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });



},{"./when":32}],32:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */

/**
 * Promises/A+ and when() implementation
 * when is part of the cujoJS family of libraries (http://cujojs.com/)
 * @author Brian Cavalier
 * @author John Hann
 */
(function(define) { 'use strict';
define(function (require) {

	var timed = require('./lib/decorators/timed');
	var array = require('./lib/decorators/array');
	var flow = require('./lib/decorators/flow');
	var fold = require('./lib/decorators/fold');
	var inspect = require('./lib/decorators/inspect');
	var generate = require('./lib/decorators/iterate');
	var progress = require('./lib/decorators/progress');
	var withThis = require('./lib/decorators/with');
	var unhandledRejection = require('./lib/decorators/unhandledRejection');
	var TimeoutError = require('./lib/TimeoutError');

	var Promise = [array, flow, fold, generate, progress,
		inspect, withThis, timed, unhandledRejection]
		.reduce(function(Promise, feature) {
			return feature(Promise);
		}, require('./lib/Promise'));

	var apply = require('./lib/apply')(Promise);

	// Public API

	when.promise     = promise;              // Create a pending promise
	when.resolve     = Promise.resolve;      // Create a resolved promise
	when.reject      = Promise.reject;       // Create a rejected promise

	when.lift        = lift;                 // lift a function to return promises
	when['try']      = attempt;              // call a function and return a promise
	when.attempt     = attempt;              // alias for when.try

	when.iterate     = Promise.iterate;      // DEPRECATED (use cujojs/most streams) Generate a stream of promises
	when.unfold      = Promise.unfold;       // DEPRECATED (use cujojs/most streams) Generate a stream of promises

	when.join        = join;                 // Join 2 or more promises

	when.all         = all;                  // Resolve a list of promises
	when.settle      = settle;               // Settle a list of promises

	when.any         = lift(Promise.any);    // One-winner race
	when.some        = lift(Promise.some);   // Multi-winner race
	when.race        = lift(Promise.race);   // First-to-settle race

	when.map         = map;                  // Array.map() for promises
	when.filter      = filter;               // Array.filter() for promises
	when.reduce      = lift(Promise.reduce);       // Array.reduce() for promises
	when.reduceRight = lift(Promise.reduceRight);  // Array.reduceRight() for promises

	when.isPromiseLike = isPromiseLike;      // Is something promise-like, aka thenable

	when.Promise     = Promise;              // Promise constructor
	when.defer       = defer;                // Create a {promise, resolve, reject} tuple

	// Error types

	when.TimeoutError = TimeoutError;

	/**
	 * Get a trusted promise for x, or by transforming x with onFulfilled
	 *
	 * @param {*} x
	 * @param {function?} onFulfilled callback to be called when x is
	 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
	 *   will be invoked immediately.
	 * @param {function?} onRejected callback to be called when x is
	 *   rejected.
	 * @param {function?} onProgress callback to be called when progress updates
	 *   are issued for x. @deprecated
	 * @returns {Promise} a new promise that will fulfill with the return
	 *   value of callback or errback or the completion value of promiseOrValue if
	 *   callback and/or errback is not supplied.
	 */
	function when(x, onFulfilled, onRejected, onProgress) {
		var p = Promise.resolve(x);
		if (arguments.length < 2) {
			return p;
		}

		return p.then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Creates a new promise whose fate is determined by resolver.
	 * @param {function} resolver function(resolve, reject, notify)
	 * @returns {Promise} promise whose fate is determine by resolver
	 */
	function promise(resolver) {
		return new Promise(resolver);
	}

	/**
	 * Lift the supplied function, creating a version of f that returns
	 * promises, and accepts promises as arguments.
	 * @param {function} f
	 * @returns {Function} version of f that returns promises
	 */
	function lift(f) {
		return function() {
			for(var i=0, l=arguments.length, a=new Array(l); i<l; ++i) {
				a[i] = arguments[i];
			}
			return apply(f, this, a);
		};
	}

	/**
	 * Call f in a future turn, with the supplied args, and return a promise
	 * for the result.
	 * @param {function} f
	 * @returns {Promise}
	 */
	function attempt(f /*, args... */) {
		/*jshint validthis:true */
		for(var i=0, l=arguments.length-1, a=new Array(l); i<l; ++i) {
			a[i] = arguments[i+1];
		}
		return apply(f, this, a);
	}

	/**
	 * Creates a {promise, resolver} pair, either or both of which
	 * may be given out safely to consumers.
	 * @return {{promise: Promise, resolve: function, reject: function, notify: function}}
	 */
	function defer() {
		return new Deferred();
	}

	function Deferred() {
		var p = Promise._defer();

		function resolve(x) { p._handler.resolve(x); }
		function reject(x) { p._handler.reject(x); }
		function notify(x) { p._handler.notify(x); }

		this.promise = p;
		this.resolve = resolve;
		this.reject = reject;
		this.notify = notify;
		this.resolver = { resolve: resolve, reject: reject, notify: notify };
	}

	/**
	 * Determines if x is promise-like, i.e. a thenable object
	 * NOTE: Will return true for *any thenable object*, and isn't truly
	 * safe, since it may attempt to access the `then` property of x (i.e.
	 *  clever/malicious getters may do weird things)
	 * @param {*} x anything
	 * @returns {boolean} true if x is promise-like
	 */
	function isPromiseLike(x) {
		return x && typeof x.then === 'function';
	}

	/**
	 * Return a promise that will resolve only once all the supplied arguments
	 * have resolved. The resolution value of the returned promise will be an array
	 * containing the resolution values of each of the arguments.
	 * @param {...*} arguments may be a mix of promises and values
	 * @returns {Promise}
	 */
	function join(/* ...promises */) {
		return Promise.all(arguments);
	}

	/**
	 * Return a promise that will fulfill once all input promises have
	 * fulfilled, or reject when any one input promise rejects.
	 * @param {array|Promise} promises array (or promise for an array) of promises
	 * @returns {Promise}
	 */
	function all(promises) {
		return when(promises, Promise.all);
	}

	/**
	 * Return a promise that will always fulfill with an array containing
	 * the outcome states of all input promises.  The returned promise
	 * will only reject if `promises` itself is a rejected promise.
	 * @param {array|Promise} promises array (or promise for an array) of promises
	 * @returns {Promise} promise for array of settled state descriptors
	 */
	function settle(promises) {
		return when(promises, Promise.settle);
	}

	/**
	 * Promise-aware array map function, similar to `Array.prototype.map()`,
	 * but input array may contain promises or values.
	 * @param {Array|Promise} promises array of anything, may contain promises and values
	 * @param {function(x:*, index:Number):*} mapFunc map function which may
	 *  return a promise or value
	 * @returns {Promise} promise that will fulfill with an array of mapped values
	 *  or reject if any input promise rejects.
	 */
	function map(promises, mapFunc) {
		return when(promises, function(promises) {
			return Promise.map(promises, mapFunc);
		});
	}

	/**
	 * Filter the provided array of promises using the provided predicate.  Input may
	 * contain promises and values
	 * @param {Array|Promise} promises array of promises and values
	 * @param {function(x:*, index:Number):boolean} predicate filtering predicate.
	 *  Must return truthy (or promise for truthy) for items to retain.
	 * @returns {Promise} promise that will fulfill with an array containing all items
	 *  for which predicate returned truthy.
	 */
	function filter(promises, predicate) {
		return when(promises, function(promises) {
			return Promise.filter(promises, predicate);
		});
	}

	return when;
});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

},{"./lib/Promise":8,"./lib/TimeoutError":10,"./lib/apply":11,"./lib/decorators/array":12,"./lib/decorators/flow":13,"./lib/decorators/fold":14,"./lib/decorators/inspect":15,"./lib/decorators/iterate":16,"./lib/decorators/progress":17,"./lib/decorators/timed":18,"./lib/decorators/unhandledRejection":19,"./lib/decorators/with":20}]},{},[1])

(1)
});
;
},{"process":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js"}],"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/support/isBufferBrowser.js":[function(require,module,exports) {
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/util.js":[function(require,module,exports) {
var process = require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
  var keys = Object.keys(obj);
  var descriptors = {};

  for (var i = 0; i < keys.length; i++) {
    descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
  }

  return descriptors;
};

var formatRegExp = /%[sdj%]/g;

exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];

    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }

    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;

    switch (x) {
      case '%s':
        return String(args[i++]);

      case '%d':
        return Number(args[i++]);

      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }

      default:
        return x;
    }
  });

  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }

  return str;
}; // Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.


exports.deprecate = function (fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  } // Allow for deprecating things in the process of starting up.


  if (typeof process === 'undefined') {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;

exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = undefined || '';
  set = set.toUpperCase();

  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;

      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }

  return debugs[set];
};
/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */

/* legacy: obj, showHidden, depth, colors*/


function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  }; // legacy...

  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  } // set default options


  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
}; // Don't use 'blue' not visible on cmd.exe

inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};
  array.forEach(function (val, idx) {
    hash[val] = true;
  });
  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);

    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }

    return ret;
  } // Primitive types cannot have properties


  var primitive = formatPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  } // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  } // Some type of object without properties can be shortcutted.


  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }

    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }

    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}']; // Make Array say that they are Array

  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  } // Make functions say that they are functions


  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  } // Make RegExps say that they are RegExps


  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  } // Make dates with properties first say the date


  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  } // Make error with message first say the error


  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);
  var output;

  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }

  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];

  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }

  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || {
    value: value[key]
  };

  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }

  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }

      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }

  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }

    name = JSON.stringify('' + key);

    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
} // NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.


function isArray(ar) {
  return Array.isArray(ar);
}

exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}

exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}

exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}

exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

exports.isPrimitive = isPrimitive;
exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
} // log is just a thin wrapper to console.log that prepends a timestamp


exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */


exports.inherits = require('inherits');

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;
  var keys = Object.keys(add);
  var i = keys.length;

  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }

  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];

    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }

    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true
  });
  return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
};

exports.promisify.custom = kCustomPromisifiedSymbol;

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }

  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  } // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.


  function callbackified() {
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();

    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }

    var self = this;

    var cb = function () {
      return maybeCb.apply(self, arguments);
    }; // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)


    original.apply(this, args).then(function (ret) {
      process.nextTick(cb, null, ret);
    }, function (rej) {
      process.nextTick(callbackifyOnRejected, rej, cb);
    });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
  return callbackified;
}

exports.callbackify = callbackify;
},{"./support/isBuffer":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/support/isBufferBrowser.js","inherits":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/node_modules/inherits/inherits_browser.js","process":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/ffmpeg/lib/errors.js":[function(require,module,exports) {
var util = require('util');

// Error list with code and message
var list = {
	'empty_input_filepath'							: { 'code' : 100, 'msg' : 'The input file path can not be empty' }
  , 'input_filepath_must_be_string'					: { 'code' : 101, 'msg' : 'The input file path must be a string' }
  , 'invalid_option_name'							: { 'code' : 102, 'msg' : 'The option "%s" is invalid. Check the list of available options' }
  , 'fileinput_not_exist'							: { 'code' : 103, 'msg' : 'The input file does not exist' }
  , 'format_not_supported'							: { 'code' : 104, 'msg' : 'The format "$s" is not supported by the version of ffmpeg' }
  , 'audio_channel_is_invalid'						: { 'code' : 105, 'msg' : 'The audio channel "$s" is not valid' }
  , 'mkdir'											: { 'code' : 106, 'msg' : 'Error occurred during creation folder: $s' }
  , 'extract_frame_invalid_everyN_options'			: { 'code' : 107, 'msg' : 'You can specify only one option between everyNFrames and everyNSeconds' }
  , 'invalid_watermark'								: { 'code' : 108, 'msg' : 'The watermark "%s" does not exists' }
  , 'invalid_watermark_position'					: { 'code' : 109, 'msg' : 'Invalid watermark position "%s"' }
  , 'size_format'									: { 'code' : 110, 'msg' : 'The format "%s" not supported by the function "setSize"' }
  , 'resolution_square_not_defined'					: { 'code' : 111, 'msg' : 'The resolution for pixel aspect ratio is not defined' }
  , 'command_already_exists'						: { 'code' : 112, 'msg' : 'The command "%s" already exists' }
  , 'codec_not_supported'							: { 'code' : 113, 'msg' : 'The codec "$s" is not supported by the version of ffmpeg' }
}

/**
 * Return the error by the codename
 */
var renderError = function (codeName) {
	// Get the error object by the codename
	var params = [list[codeName].msg];
	// Get the possible arguments
	if (arguments.length > 1)
		params = params.concat(Array.prototype.slice.call(arguments, 1));
	// Call the function for replace the letter '%s' with the found arguments
	return { 'code' : list[codeName].code, 'msg' : util.format.apply(this, params) };
}

module.exports.list = list;
module.exports.renderError = renderError;
},{"util":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/util/util.js"}],"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/path-browserify/index.js":[function(require,module,exports) {
var process = require("process");
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

},{"process":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/ffmpeg/lib/utils.js":[function(require,module,exports) {
var process = require("process");
var exec	= require('child_process').exec
  , fs		= require('fs')
  , path	= require('path');

var errors	= require('./errors');

/**
 * Exec the list of commands and call the callback function at the end of the process
 */
module.exports.exec = function (commands, settings, callback) {
	// Create final command line
	var finalCommand = commands.join(" ");
	// Create the timeoutId for stop the timeout at the end the process
	var timeoutID = null;
	// Exec the command
	var process = exec(finalCommand, settings, function (error, stdout, stderr) {
		// Clear timeout if 'timeoutID' are setted
		if (timeoutID !== null) clearTimeout(timeoutID);
		// Call the callback function
		callback(error, stdout, stderr);
	});
	// Verify if the timeout are setting
	if (settings.timeout > 0) {
		// Set the timeout
		timeoutID = setTimeout(function () {
			process.kill();
		}, 100);		
	}
}

/**
 * Check if object is empty
 */
module.exports.isEmptyObj = function (obj) {
	// Scan all properties
    for(var prop in obj)
		// Check if obj has a property
        if(obj.hasOwnProperty(prop))
			// The object is not empty
            return false;
	// The object is empty
    return true;
}

/**
 * Merge obj1 into obj
 */
module.exports.mergeObject = function (obj, obj1) {
	// Check if there are options set
	if (!module.exports.isEmptyObj(obj1)) {
		// Scan all settings
		for (var key in obj1) {
			// Check if the option is valid
			if (!obj.hasOwnProperty(key))
				throw errors.renderError('invalid_option_name', key);
			// Set new option value
			obj[key] = obj1[key];
		}
	}
}

/**
 * Calculate the duration in seconds from the string retrieved by the ffmpeg info
 */
module.exports.durationToSeconds = function(duration) {
	var parts = duration.substr(0,8).split(':');
	return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
};

/**
 * Calculate the greatest common divisor
 */
module.exports.gcd = function (a, b) { 
	if (b === 0) return a;
	return module.exports.gcd(b, a % b);
}

/**
 * Offers functionality similar to mkdir -p
 */
module.exports.mkdir = function (dirpath, mode, callback, position) {
	// Split all directories
    var parts = path.normalize(dirpath).split('/');
	// If the first part is empty then remove this part
	if (parts[0] == "") 
		parts = parts.slice(1);
	
	// Set the initial configuration
    mode = mode || 0777;
    position = position || 0;
	
	// Check se current position is greater than the list of folders
	if (position > parts.length) {
		// If isset the callback then it will be invoked
		if (callback) 
			callback();
		// Exit and return a positive value
		return true;
	}

	// Build the directory path
	var directory = (dirpath.charAt(0) == '/' ? '/' : '') + parts.slice(0, position + 1).join('/');

	// Check if directory exists
	if (fs.existsSync(directory)) {
		module.exports.mkdir(dirpath, mode, callback, position + 1);
	} else {
		if (fs.mkdirSync(directory, mode)) {
			// If isset the callback then it will be invoked
			if (callback) 
				callback(errors.renderError('mkdir', directory));
			// Send the new exception
			throw errors.renderError('mkdir', directory);
		} else {
			module.exports.mkdir(dirpath, mode, callback, position + 1);
		}
	}
}

/**
 * Check if a value is present inside an array
 */
module.exports.in_array = function (value, array) {
	// Scan all element
	for (var i in array)
		// Check if value exists
		if (array[i] == value)
			// Return the position of value
			return i;
	// The value not exists
	return false;
}
},{"child_process":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/_empty.js","fs":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/_empty.js","path":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/path-browserify/index.js","./errors":"node_modules/ffmpeg/lib/errors.js","process":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/ffmpeg/lib/configs.js":[function(require,module,exports) {
/**
 * Basic configuration
 */
module.exports = function () {
	this.encoding	= 'utf8';
	this.timeout	= 0;
	this.maxBuffer	= 200 * 1024
}
},{}],"node_modules/ffmpeg/lib/presets.js":[function(require,module,exports) {
module.exports.size = {
	'SQCIF'		: '128x96'
  ,	'QCIF'		: '176x144'
  ,	'CIF'		: '352x288'
  ,	'4CIF'		: '704x576'
  ,	'QQVGA'		: '160x120'
  ,	'QVGA'		: '320x240'
  ,	'VGA'		: '640x480'
  ,	'SVGA'		: '800x600'
  ,	'XGA'		: '1024x768'
  ,	'UXGA'		: '1600x1200'
  ,	'QXGA'		: '2048x1536'
  ,	'SXGA'		: '1280x1024'
  ,	'QSXGA'		: '2560x2048'
  ,	'HSXGA'		: '5120x4096'
  ,	'WVGA'		: '852x480'
  ,	'WXGA'		: '1366x768'
  ,	'WSXGA'		: '1600x1024'
  ,	'WUXGA'		: '1920x1200'
  ,	'WOXGA'		: '2560x1600'
  ,	'WQSXGA'	: '3200x2048'
  ,	'WQUXGA'	: '3840x2400'
  ,	'WHSXGA'	: '6400x4096'
  ,	'WHUXGA'	: '7680x4800'
  ,	'CGA'		: '320x200'
  ,	'EGA'		: '640x350'
  ,	'HD480'		: '852x480'
  ,	'HD720'		: '1280x720'
  ,	'HD1080'	: '1920x1080'
}

module.exports.ratio = {
	'4:3'		: 1.33
  , '3:2'		: 1.5
  , '14:9'		: 1.56
  , '16:9'		: 1.78
  , '21:9'		: 2.33
}

module.exports.audio_channel = {
	'mono'		: 1
  ,	'stereo'	: 2
}
},{}],"node_modules/ffmpeg/lib/video.js":[function(require,module,exports) {
var fs			= require('fs')
  , path		= require('path')
  , when		= require('when');

var errors		= require('./errors')
  , presets		= require('./presets')
  , utils		= require('./utils');

module.exports = function (filePath, settings, infoConfiguration, infoFile) {
	
	// Public info about file and ffmpeg configuration
	this.file_path				= filePath;
	this.info_configuration		= infoConfiguration;
	this.metadata				= infoFile;
	
	// Commands for building the ffmpeg string conversion
	var commands		= new Array()
	  , inputs			= new Array()
	  , filtersComlpex	= new Array()
	  , output			= null;
	
	// List of options generated from setting functions
	var options			= new Object();
	
	/*****************************************/
	/* FUNCTION FOR FILL THE COMMANDS OBJECT */
	/*****************************************/
	
	/**
	 * Add a command to be bundled into the ffmpeg command call
	 */
	this.addCommand = function (command, argument) {
		// Check if exists the current command
		if (utils.in_array(command, commands) === false) {
			// Add the new command
			commands.push(command);
			// Add the argument to new command
			if (argument != undefined)
				commands.push(argument);
		} else 
			throw errors.renderError('command_already_exists', command);
	}
	
	/**
	 * Add an input stream
	 */
	this.addInput = function (argument) {
		inputs.push(argument);
	}
	
	/**
	 * Add a filter complex
	 */
	this.addFilterComplex = function (argument) {
		filtersComlpex.push(argument);
	}
	
	/**
	 * Set the output path
	 */
	var setOutput = function (path) {
		output = path;
	}
	
	/*********************/
	/* SETTING FUNCTIONS */
	/*********************/
	
	/**
	 * Disables audio encoding
	 */
	this.setDisableAudio = function () {
		if (options.audio == undefined)
			options.audio = new Object();
		// Set the new option
		options.audio.disabled = true;
		return this;
	}

	/**
	 * Disables video encoding
	 */
	this.setDisableVideo = function () {
		if (options.video == undefined)
			options.video = new Object();
		// Set the new option
		options.video.disabled = true;
		return this;
	}
	
	/**
	 * Sets the new video format
	 */
	this.setVideoFormat = function (format) {
		// Check if the format is supported by ffmpeg version
		if (this.info_configuration.encode.indexOf(format) != -1) {
			if (options.video == undefined)
				options.video = new Object();
			// Set the new option
			options.video.format = format;
			return this;
		} else 
			throw errors.renderError('format_not_supported', format);
	}
	
	/**
	 * Sets the new audio codec
	 */
	this.setVideoCodec = function (codec) {
		// Check if the codec is supported by ffmpeg version
		if (this.info_configuration.encode.indexOf(codec) != -1) {
			if (options.video == undefined)
				options.video = new Object();
			// Set the new option
			options.video.codec = codec;
			return this;
		} else 
			throw errors.renderError('codec_not_supported', codec);
	}
	
	/**
	 * Sets the video bitrate
	 */
	this.setVideoBitRate = function (bitrate) {
		if (options.video == undefined)
			options.video = new Object();
		// Set the new option
		options.video.bitrate = bitrate;
		return this;
	}
	
	/**
	 * Sets the framerate of the video
	 */
	this.setVideoFrameRate = function (framerate) {
		if (options.video == undefined)
			options.video = new Object();
		// Set the new option
		options.video.framerate = framerate;
		return this;		
	}
	
	/**
	 * Sets the start time
	 */
	this.setVideoStartTime = function (time) {
		if (options.video == undefined)
			options.video = new Object();
		
		// Check if time is a string that contain: hours, minutes and seconds
		if (isNaN(time) && /([0-9]+):([0-9]{2}):([0-9]{2})/.exec(time)) {
			time = utils.durationToSeconds(time);			
		} else if (!isNaN(time) && parseInt(time) == time) {
			time = parseInt(time, 10);			
		} else {
			time = 0;			
		}

		// Set the new option
		options.video.startTime = time;
		return this;
	}
	
	/**
	 * Sets the duration
	 */
	this.setVideoDuration = function (duration) {
		if (options.video == undefined)
			options.video = new Object();
		
		// Check if duration is a string that contain: hours, minutes and seconds
		if (isNaN(duration) && /([0-9]+):([0-9]{2}):([0-9]{2})/.exec(duration)) {
			duration = utils.durationToSeconds(duration);
		} else if (!isNaN(duration) && parseInt(duration) == duration) {
			duration = parseInt(duration, 10);			
		} else {
			duration = 0;
		}

		// Set the new option
		options.video.duration = duration;
		return this;
	}
	
	/**
	 * Sets the new aspetc ratio
	 */
	this.setVideoAspectRatio = function (aspect) {
		// Check if aspect is a string
		if (isNaN(aspect)) {
			// Check if aspet is string xx:xx
			if (/([0-9]+):([0-9]+)/.exec(aspect)) {
				var check = /([0-9]+):([0-9]+)/.exec(aspect);
				aspect = parseFloat((check[1] / check[2]));
			} else {
				aspect = this.metadata.video.aspect.value;
			}
		}
		
		if (options.video == undefined)
			options.video = new Object();
		// Set the new option
		options.video.aspect = aspect;
		return this;
	}
	
	/**
	 * Set the size of the video
	 */
	this.setVideoSize = function (size, keepPixelAspectRatio, keepAspectRatio, paddingColor) {
		if (options.video == undefined)
			options.video = new Object();
		// Set the new option
		options.video.size = size;
		options.video.keepPixelAspectRatio = keepPixelAspectRatio;
		options.video.keepAspectRatio = keepAspectRatio;
		options.video.paddingColor = paddingColor;
		return this;
	}
	
	/**
	 * Sets the new audio codec
	 */
	this.setAudioCodec = function (codec) {
		// Check if the codec is supported by ffmpeg version
		if (this.info_configuration.encode.indexOf(codec) != -1) {
			// Check if codec is equal 'MP3' and check if the version of ffmpeg support the libmp3lame function
			if (codec == 'mp3' && this.info_configuration.modules.indexOf('libmp3lame') != -1)
				codec = 'libmp3lame';
			
			if (options.audio == undefined)
				options.audio = new Object();
			// Set the new option
			options.audio.codec = codec;
			return this;
		} else 
			throw errors.renderError('codec_not_supported', codec);
	}
	
	/**
	 * Sets the audio sample frequency for audio outputs
	 */
	this.setAudioFrequency = function (frequency) {
		if (options.audio == undefined)
			options.audio = new Object();
		// Set the new option
		options.audio.frequency = frequency;
		return this;
	}
	
	/**
	 * Sets the number of audio channels
	 */
	this.setAudioChannels = function (channel) {
		// Check if the channel value is valid
		if (presets.audio_channel.stereo == channel || presets.audio_channel.mono == channel) {
			if (options.audio == undefined)
				options.audio = new Object();
			// Set the new option
			options.audio.channel = channel;
			return this;			
		} else 
			throw errors.renderError('audio_channel_is_invalid', channel);
	}
	
	/**
	 * Sets the audio bitrate
	 */
	this.setAudioBitRate = function (bitrate) {
		if (options.audio == undefined)
			options.audio = new Object();
		// Set the new option
		options.audio.bitrate = bitrate;
		return this;
	}
	
	/**
	 * Sets the audio quality
	 */
	this.setAudioQuality = function (quality) {
		if (options.audio == undefined)
			options.audio = new Object();
		// Set the new option
		options.audio.quality = quality;
		return this;
	}
	
	/**
	 * Sets the watermark
	 */
	this.setWatermark = function (watermarkPath, settings) {
		// Base settings
		var baseSettings = {
			position		: "SW"		// Position: NE NC NW SE SC SW C CE CW
		  , margin_nord		: null		// Margin nord
		  , margin_sud		: null		// Margin sud
		  , margin_east		: null		// Margin east
		  , margin_west		: null		// Margin west
		};
		
		// Check if watermark exists
		if (!fs.existsSync(watermarkPath))
			throw errors.renderError('invalid_watermark', watermarkPath);
		
		// Check if the settings are specified
		if (settings != null)
			utils.mergeObject(baseSettings, settings);
		
		// Check if position is valid
		if (baseSettings.position == null || utils.in_array(baseSettings.position, ['NE','NC','NW','SE','SC','SW','C','CE','CW']) === false)
			throw errors.renderError('invalid_watermark_position', baseSettings.position);
		
		// Check if margins are valid
		
		if (baseSettings.margin_nord == null || isNaN(baseSettings.margin_nord))
			baseSettings.margin_nord = 0;
		if (baseSettings.margin_sud == null || isNaN(baseSettings.margin_sud))
			baseSettings.margin_sud = 0;
		if (baseSettings.margin_east == null || isNaN(baseSettings.margin_east))
			baseSettings.margin_east = 0;
		if (baseSettings.margin_west == null || isNaN(baseSettings.margin_west))
			baseSettings.margin_west = 0;
		
		var overlay = '';
		
		var getSing = function (val, inverse) {
			return (val > 0 ? (inverse ? '-' : '+') : (inverse ? '+' : '-')).toString() + Math.abs(val).toString();
		}
		
		var getHorizontalMargins = function (east, west) {
			return getSing(east, false).toString() + getSing(west, true).toString();
		}
		
		var getVerticalMargins = function (nord, sud) {
			return getSing(nord, false).toString() + getSing(sud, true).toString();
		}
		
		// Calculate formula		
		switch (baseSettings.position) {
			case 'NE':
				overlay = '0' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':0' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'NC':
				overlay = 'main_w/2-overlay_w/2' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':0' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'NW':
				overlay = 'main_w-overlay_w' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':0' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'SE':
				overlay = '0' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h-overlay_h' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'SC':
				overlay = 'main_w/2-overlay_w/2' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h-overlay_h' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'SW':
				overlay = 'main_w-overlay_w' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h-overlay_h' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'CE':
				overlay = '0' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h/2-overlay_h/2' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'C':
				overlay = 'main_w/2-overlay_w/2' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h/2-overlay_h/2' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'CW':
				overlay = 'main_w-overlay_w' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h/2-overlay_h/2' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
		}
		
		// Check if the call comes from internal function
		if (arguments[2] == undefined || arguments[2] == null) {
			if (options.video == undefined)
				options.video = new Object();
			// Set the new option
			options.video.watermark = { path : watermarkPath, overlay : overlay };
			return this;
		} else if (arguments[2] != undefined && arguments[2] === true) {
			this.addInput(watermarkPath);
			this.addFilterComplex('overlay=' + overlay);
		}
	}
	
	/**
	 * Save all set commands
	 */
	this.save = function (destionationFileName, callback) {
		// Check if the 'video' is present in the options
		if (options.hasOwnProperty('video')) {
			// Check if video is disabled
			if (options.video.hasOwnProperty('disabled')) {
				this.addCommand('-vn');				
			} else {
				// Check all video property
				if (options.video.hasOwnProperty('format'))
					this.addCommand('-f', options.video.format);
				if (options.video.hasOwnProperty('codec'))
					this.addCommand('-vcodec', options.video.codec);
				if (options.video.hasOwnProperty('bitrate'))
					this.addCommand('-b', parseInt(options.video.bitrate, 10) + 'kb');
				if (options.video.hasOwnProperty('framerate'))
					this.addCommand('-r', parseInt(options.video.framerate, 10));
				if (options.video.hasOwnProperty('startTime'))
					this.addCommand('-ss', parseInt(options.video.startTime, 10));
				if (options.video.hasOwnProperty('duration'))
					this.addCommand('-t', parseInt(options.video.duration, 10));
				
				if (options.video.hasOwnProperty('watermark')) {
					this.addInput(options.video.watermark.path);
					this.addFilterComplex('overlay=' + options.video.watermark.overlay);
				}
				
				// Check if the video should be scaled
				if (options.video.hasOwnProperty('size')) {
					var newDimension = _calculateNewDimension.call(this);
					
					if (newDimension.aspect != null) {
						this.addFilterComplex('scale=iw*sar:ih, pad=max(iw\\,ih*(' + newDimension.aspect.x + '/' + newDimension.aspect.y + ')):ow/(' + newDimension.aspect.x + '/' + newDimension.aspect.y + '):(ow-iw)/2:(oh-ih)/2' + (options.video.paddingColor != null ? ':' + options.video.paddingColor : ''));
						this.addCommand('-aspect', newDimension.aspect.string);
					}
					
					this.addCommand('-s', newDimension.width + 'x' + newDimension.height);
				}
			}
		}
		// Check if the 'audio' is present in the options
		if (options.hasOwnProperty('audio')) {
			// Check if audio is disabled
			if (options.audio.hasOwnProperty('disabled')) {
				this.addCommand('-an');				
			} else {
				// Check all audio property
				if (options.audio.hasOwnProperty('codec'))
					this.addCommand('-acodec', options.audio.codec);
				if (options.audio.hasOwnProperty('frequency'))
					this.addCommand('-ar', parseInt(options.audio.frequency));
				if (options.audio.hasOwnProperty('channel'))
					this.addCommand('-ac', options.audio.channel);
				if (options.audio.hasOwnProperty('quality'))
					this.addCommand('-aq', options.audio.quality);
				if (options.audio.hasOwnProperty('bitrate'))
					this.addCommand('-ab', parseInt(options.audio.bitrate, 10) + 'k');
			}
		}
		
		setOutput(destionationFileName);
		
		return execCommand.call(this, callback);
	}
	
	/*********************/
	/* INTERNAL FUNCTION */
	/*********************/
	
	/**
	 * Reset the list of commands
	 */
	var resetCommands = function (self) {
		commands		= new Array()
		inputs			= [self.file_path];
		filtersComlpex	= new Array();
		output			= null;
		options			= new Object();
	}

	/**
	 * Calculate width, height and aspect ratio by the new dimension data
	 */
	var _calculateNewDimension = function () {
		// Check if keepPixelAspectRatio is undefined
		var keepPixelAspectRatio = typeof options.video.keepPixelAspectRatio != 'boolean' ? false : options.video.keepPixelAspectRatio;
		// Check if keepAspectRatio is undefined
		var keepAspectRatio = typeof options.video.keepAspectRatio != 'boolean' ? false : options.video.keepAspectRatio;
		
		// Resolution to be taken as a reference
		var referrerResolution = this.metadata.video.resolution;
		// Check if is need keep pixel aspect ratio
		if (keepPixelAspectRatio) {
			// Check if exists resolution for pixel aspect ratio
			if (utils.isEmptyObj(this.metadata.video.resolutionSquare))
				throw errors.renderError('resolution_square_not_defined');
			
			// Apply the resolutionSquare
			referrerResolution = this.metadata.video.resolutionSquare;
		}
		
		// Final data
		var width	= null
		  , height	= null
		  , aspect	= null;

		// Regex to check which type of dimension was specified
		var fixedWidth		= /([0-9]+)x\?/.exec(options.video.size)
		  , fixedHeight		= /\?x([0-9]+)/.exec(options.video.size)
		  , percentage		= /([0-9]{1,2})%/.exec(options.video.size)
		  , classicSize		= /([0-9]+)x([0-9]+)/.exec(options.video.size);
		  
		if (fixedWidth) {
			// Set the width dimension
			width = parseInt(fixedWidth[1], 10);			
			// Check if the video has the aspect ratio setted
			if (!utils.isEmptyObj(this.metadata.video.aspect)) {
				height = Math.round((width / this.metadata.video.aspect.x) * this.metadata.video.aspect.y);
			} else {
				// Calculte the new height
				height = Math.round(referrerResolution.h / (referrerResolution.w / parseInt(fixedWidth[1], 10)));
			}
		} else if (fixedHeight) {
			// Set the width dimension
			height = parseInt(fixedHeight[1], 10);			
			// Check if the video has the aspect ratio setted
			if (!utils.isEmptyObj(this.metadata.video.aspect)) {
				width = Math.round((height / this.metadata.video.aspect.y) * this.metadata.video.aspect.x);
			} else {
				// Calculte the new width
				width = Math.round(referrerResolution.w / (referrerResolution.h / parseInt(fixedHeight[1], 10)));
			}			
		} else if (percentage) {
			// Calculte the ratio from percentage
			var ratio = parseInt(percentage[1], 10) / 100;
			// Calculate the new dimensions
			width = Math.round(referrerResolution.w * ratio);
			height = Math.round(referrerResolution.h * ratio);
		} else if (classicSize) {
			width = parseInt(classicSize[1], 10);
			height = parseInt(classicSize[2], 10);
		} else 
			throw errors.renderError('size_format', options.video.size);
		
		// If the width or height are not multiples of 2 will be decremented by one unit
		if (width % 2 != 0) width -= 1;
		if (height % 2 != 0) height -= 1;
		
		if (keepAspectRatio) {
			// Calculate the new aspect ratio
			var gcdValue	= utils.gcd(width, height);
			
			aspect = new Object();
			aspect.x = width / gcdValue;
			aspect.y = height / gcdValue;
			aspect.string = aspect.x + ':' + aspect.y;
		}
		
		return { width : width, height : height, aspect : aspect };
	}
	
	/**
	 * Executing the commands list
	 */
	var execCommand = function (callback, folder) {
		// Checking if folder is defined
		var onlyDestinationFile = folder != undefined ? false : true;
		// Building the value for return value. Check if the callback is not a function. In this case will created a new instance of the deferred class
		var deferred = typeof callback != 'function' ? when.defer() : { promise : null };
		// Create a copy of the commands list
		var finalCommands = ['ffmpeg -i']
			.concat(inputs.join(' -i '))
			.concat(commands.join(' '))
			.concat(filtersComlpex.length > 0 ? ['-filter_complex "'].concat(filtersComlpex.join(', ')).join('') + '"' : [])
			.concat([output]);
		// Reset commands
		resetCommands(this);
		// Execute the commands from the list
		utils.exec(finalCommands, settings, function (error, stdout, stderr) {
			// Building the result
			var result = null;
			if (!error) {
				// Check if show only destination filename or the complete file list
				if (onlyDestinationFile) {
					result = finalCommands[finalCommands.length-1];
				} else {
					// Clean possible "/" at the end of the string
					if (folder.charAt(folder.length-1) == "/")
						folder = folder.substr(0, folder.length-1);
					// Read file list inside the folder
					result = fs.readdirSync(folder);
					// Scan all file and prepend the folder path
					for (var i in result)
						result[i] = [folder, result[i]].join('/')
				}
			}
			// Check if the callback is a function
			if (typeof callback == 'function') {
				// Call the callback to return the info
				callback(error, result);
			} else {
				if (error) {
					// Negative response
					deferred.reject(error);
				} else {
					// Positive response
					deferred.resolve(result);
				}
			}
		});
		// Return a possible promise instance
		return deferred.promise;
	}
	
	/*******************/
	/* PRESET FUNCTION */
	/*******************/
	
	/**
	 * Extracting sound from a video, and save it as Mp3
	 */
	this.fnExtractSoundToMP3 = function (destionationFileName, callback) {
		// Check if file already exists. In this case will remove it
		if (fs.existsSync(destionationFileName)) 
			fs.unlinkSync(destionationFileName);

		// Building the final path
		var destinationDirName		= path.dirname(destionationFileName)
		  , destinationFileNameWE	= path.basename(destionationFileName, path.extname(destionationFileName)) + '.mp3'
		  , finalPath				= path.join(destinationDirName, destinationFileNameWE);
		
		resetCommands(this);
		
		// Adding commands to the list
		this.addCommand('-vn');
		this.addCommand('-ar', 44100);
		this.addCommand('-ac', 2);
		this.addCommand('-ab', 192);
		this.addCommand('-f', 'mp3');
		
		// Add destination file path to the command list
		setOutput(finalPath);
		
		// Executing the commands list
		return execCommand.call(this, callback);
	}
	
	/**
	 * Extract frame from video file
	 */
	this.fnExtractFrameToJPG = function (/* destinationFolder, settings, callback */) {
		
		var destinationFolder	= null
		  , newSettings			= null
		  , callback			= null;
		  
		var settings = {
			start_time				: null		// Start time to recording
		  , duration_time			: null		// Duration of recording
		  , frame_rate				: null		// Number of the frames to capture in one second
		  , size					: null		// Dimension each frame
		  , number					: null		// Total frame to capture
		  , every_n_frames			: null		// Frame to capture every N frames
		  , every_n_seconds			: null		// Frame to capture every N seconds
		  , every_n_percentage		: null		// Frame to capture every N percentage range
		  , keep_pixel_aspect_ratio	: true		// Mantain the original pixel video aspect ratio
		  , keep_aspect_ratio		: true		// Mantain the original aspect ratio
		  , padding_color			: 'black'	// Padding color
		  , file_name				: null		// File name
		};
		  
		// Scan all arguments
		for (var i in arguments) {
			// Check the type of the argument
			switch (typeof arguments[i]) {
				case 'string':
					destinationFolder = arguments[i];
					break;
				case 'object':
					newSettings = arguments[i];
					break;
				case 'function':
					callback = arguments[i];
					break;
			}
		}
		
		// Check if the settings are specified
		if (newSettings !== null)
			utils.mergeObject(settings, newSettings);

		// Check if 'start_time' is in the format hours:minutes:seconds
		if (settings.start_time != null) {
			if (/([0-9]+):([0-9]{2}):([0-9]{2})/.exec(settings.start_time))
				settings.start_time = utils.durationToSeconds(settings.start_time);
			else if (!isNaN(settings.start_time))
				settings.start_time = parseInt(settings.start_time, 10);
			else
				settings.start_time = null;
		}

		// Check if 'duration_time' is in the format hours:minutes:seconds
		if (settings.duration_time != null) {
			if (/([0-9]+):([0-9]{2}):([0-9]{2})/.exec(settings.duration_time))
				settings.duration_time = utils.durationToSeconds(settings.duration_time);
			else if (!isNaN(settings.duration_time))
				settings.duration_time = parseInt(settings.duration_time, 10);
			else
				settings.duration_time = null;
		}

		// Check if the value of the framerate is number type
		if (settings.frame_rate != null && isNaN(settings.frame_rate))
			settings.frame_rate = null;

		// If the size is not settings then the size of the screenshots is equal to video size
		if (settings.size == null)
			settings.size = this.metadata.video.resolution.w + 'x' + this.metadata.video.resolution.h;

		// Check if the value of the 'number frame to capture' is number type
		if (settings.number != null && isNaN(settings.number))
			settings.number = null;

		var every_n_check = 0;

		// Check if the value of the 'every_n_frames' is number type
		if (settings.every_n_frames != null && isNaN(settings.every_n_frames)) {
			settings.every_n_frames = null;
			every_n_check++;
		}

		// Check if the value of the 'every_n_seconds' is number type
		if (settings.every_n_seconds != null && isNaN(settings.every_n_seconds)) {
			settings.every_n_seconds = null;
			every_n_check++;
		}

		// Check if the value of the 'every_n_percentage' is number type
		if (settings.every_n_percentage != null && (isNaN(settings.every_n_percentage) || settings.every_n_percentage > 100)) {
			settings.every_n_percentage = null;
			every_n_check++;
		}
		
		if (every_n_check >= 2) {
			if (callback) {
				callback(errors.renderError('extract_frame_invalid_everyN_options'));
			} else {
				throw errors.renderError('extract_frame_invalid_everyN_options');
			}
		}			
		
		// If filename is null then his value is equal to original filename
		if (settings.file_name == null) {
			settings.file_name = path.basename(this.file_path, path.extname(this.file_path));
		} else {
			// Retrieve all possible replacements
			var replacements = settings.file_name.match(/(\%[a-zA-Z]{1})/g);
			// Check if exists replacements. The scan all replacements and build the final filename
			if (replacements) {
				for (var i in replacements) {
					switch (replacements[i]) {
						case '%t':
							settings.file_name = settings.file_name.replace('%t', new Date().getTime());
							break;
						case '%s':
							settings.file_name = settings.file_name.replace('%s', settings.size);
							break;
						case '%x':
							settings.file_name = settings.file_name.replace('%x', settings.size.split(':')[0]);
							break;
						case '%y':
							settings.file_name = settings.file_name.replace('%y', settings.size.split(':')[1]);
							break;
						default:
							settings.file_name = settings.file_name.replace(replacements[i], '');
							break;
					}
				}
			}
		}
		// At the filename will added the number of the frame
		settings.file_name = path.basename(settings.file_name, path.extname(settings.file_name)) + '_%d.jpg';
		
		// Create the directory to save the extracted frames
		utils.mkdir(destinationFolder, 0777);
		
		resetCommands(this);
		
		// Adding commands to the list
		if (settings.startTime)
			this.addCommand('-ss', settings.startTime);
		if (settings.duration_time)
			this.addCommand('-t', settings.duration_time);
		if (settings.frame_rate)
			this.addCommand('-r', settings.frame_rate);

		// Setting the size and padding settings
		this.setVideoSize(settings.size, settings.keep_pixel_aspect_ratio, settings.keep_aspect_ratio, settings.padding_color);
		// Get the dimensions
		var newDimension = _calculateNewDimension.call(this);
		// Apply the size and padding commands
		this.addCommand('-s', newDimension.width + 'x' + newDimension.height);
		// CHeck if isset aspect ratio options
		if (newDimension.aspect != null) {
			this.addFilterComplex('scale=iw*sar:ih, pad=max(iw\\,ih*(' + newDimension.aspect.x + '/' + newDimension.aspect.y + ')):ow/(' + newDimension.aspect.x + '/' + newDimension.aspect.y + '):(ow-iw)/2:(oh-ih)/2' + (settings.padding_color != null ? ':' + settings.padding_color : ''));
			this.addCommand('-aspect', newDimension.aspect.string);
		}

		if (settings.number)
			this.addCommand('-vframes', settings.number);
		if (settings.every_n_frames) {
			this.addCommand('-vsync', 0);					
			this.addFilterComplex('select=not(mod(n\\,' + settings.every_n_frames + '))');
		}
		if (settings.every_n_seconds) {
			this.addCommand('-vsync', 0);
			this.addFilterComplex('select=not(mod(t\\,' + settings.every_n_seconds + '))');
		}
		if (settings.every_n_percentage) {
			this.addCommand('-vsync', 0);
			this.addFilterComplex('select=not(mod(t\\,' + parseInt((this.metadata.duration.seconds / 100) * settings.every_n_percentage) + '))');
		}
		
		// Add destination file path to the command list
		setOutput([destinationFolder,settings.file_name].join('/'));

		// Executing the commands list
		return execCommand.call(this, callback, destinationFolder);
	}

	/**
	 * Add a watermark to the video and save it
	 */
	this.fnAddWatermark = function (watermarkPath /* newFilepath , settings, callback */) {

		var newFilepath		= null
		  , newSettings		= null
		  , callback		= null;
		  
		// Scan all arguments
		for (var i = 1; i < arguments.length; i++) {
			// Check the type of the argument
			switch (typeof arguments[i]) {
				case 'string':
					newFilepath = arguments[i];
					break;
				case 'object':
					newSettings = arguments[i];
					break;
				case 'function':
					callback = arguments[i];
					break;
			}
		}
		
		resetCommands(this);

		// Call the function to add the watermark options
		this.setWatermark(watermarkPath, newSettings, true);
		
		if (newFilepath == null)
			newFilepath = path.dirname(this.file_path) + '/' + 
						  path.basename(this.file_path, path.extname(this.file_path)) + '_watermark_' + 
						  path.basename(watermarkPath, path.extname(watermarkPath)) + 
						  path.extname(this.file_path);
		
		// Add destination file path to the command list
		setOutput(newFilepath);

		// Executing the commands list
		return execCommand.call(this, callback);
	}
	
	/**
	 * Constructor
	 */
	var __constructor = function (self) {
		resetCommands(self);
	}(this);
}
},{"fs":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/_empty.js","path":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/path-browserify/index.js","when":"node_modules/when/dist/browser/when.js","./errors":"node_modules/ffmpeg/lib/errors.js","./presets":"node_modules/ffmpeg/lib/presets.js","./utils":"node_modules/ffmpeg/lib/utils.js"}],"node_modules/ffmpeg/lib/ffmpeg.js":[function(require,module,exports) {
var when		= require('when')
  , fs			= require('fs');

var errors		= require('./errors')
  , utils		= require('./utils')
  , configs		= require('./configs')
  , video		= require('./video');

var ffmpeg = function (/* inputFilepath, settings, callback */) {

	/**
	 * Retrieve the list of the codec supported by the ffmpeg software
	 */
	var _ffmpegInfoConfiguration = function (settings) {
		// New 'promise' instance 
		var deferred = when.defer();
		// Instance the new arrays for the format
		var format = { modules : new Array(), encode : new Array(), decode : new Array() };
		// Make the call to retrieve information about the ffmpeg
		utils.exec(['ffmpeg','-formats','2>&1'], settings, function (error, stdout, stderr) {
			// Get the list of modules
			var configuration = /configuration:(.*)/.exec(stdout);
			// Check if exists the configuration
			if (configuration) {
				// Get the list of modules
				var modules = configuration[1].match(/--enable-([a-zA-Z0-9\-]+)/g);
				// Scan all modules
				for (var indexModule in modules) {
					// Add module to the list
					format.modules.push(/--enable-([a-zA-Z0-9\-]+)/.exec(modules[indexModule])[1]);
				}
			}
			// Get the codec list
			var codecList = stdout.match(/ (DE|D|E) (.*) {1,} (.*)/g);
			// Scan all codec
			for (var i in codecList) {
				// Get the match value
				var match = / (DE|D|E) (.*) {1,} (.*)/.exec(codecList[i]);
				// Check if match is valid
				if (match) {
					// Get the value from the match
					var scope = match[1].replace(/\s/g,'')
					  , extension = match[2].replace(/\s/g,'');
					// Check which scope is best suited
					if (scope == 'D' || scope == 'DE')
						format.decode.push(extension);
					if (scope == 'E' || scope == 'DE')
						format.encode.push(extension);
				}
			}
			// Returns the list of supported formats
			deferred.resolve(format);
		});
		// Return 'promise' instance 
		return deferred.promise;
	}
	
	/**
	 * Get the video info
	 */
	var _videoInfo = function (fileInput, settings) {
		// New 'promise' instance 
		var deferred = when.defer();
		// Make the call to retrieve information about the ffmpeg
		utils.exec(['ffmpeg','-i',fileInput,'2>&1'], settings, function (error, stdout, stderr) {
			// Perse output for retrieve the file info
			var filename		= /from \'(.*)\'/.exec(stdout) || []
			  , title			= /(INAM|title)\s+:\s(.+)/.exec(stdout) || []
			  , artist			= /artist\s+:\s(.+)/.exec(stdout) || []
			  , album			= /album\s+:\s(.+)/.exec(stdout) || []
			  , track			= /track\s+:\s(.+)/.exec(stdout) || []
			  , date			= /date\s+:\s(.+)/.exec(stdout) || []
			  , is_synched		= (/start: 0.000000/.exec(stdout) !== null)
			  , duration		= /Duration: (([0-9]+):([0-9]{2}):([0-9]{2}).([0-9]+))/.exec(stdout) || []
			  
			  , container		= /Input #0, ([a-zA-Z0-9]+),/.exec(stdout) || []
			  , video_bitrate	= /bitrate: ([0-9]+) kb\/s/.exec(stdout) || []
			  , video_stream	= /Stream #([0-9\.]+)([a-z0-9\(\)\[\]]*)[:] Video/.exec(stdout) || []
			  , video_codec		= /Video: ([\w]+)/.exec(stdout) || []
			  , resolution		= /(([0-9]{2,5})x([0-9]{2,5}))/.exec(stdout) || []
			  , pixel			= /[SP]AR ([0-9\:]+)/.exec(stdout) || []
			  , aspect			= /DAR ([0-9\:]+)/.exec(stdout) || []
			  , fps				= /([0-9\.]+) (fps|tb\(r\))/.exec(stdout) || []
			  
			  , audio_stream	= /Stream #([0-9\.]+)([a-z0-9\(\)\[\]]*)[:] Audio/.exec(stdout) || []
			  , audio_codec		= /Audio: ([\w]+)/.exec(stdout) || []
			  , sample_rate		= /([0-9]+) Hz/i.exec(stdout) || []
			  , channels		= /Audio:.* (stereo|mono)/.exec(stdout) || []
			  , audio_bitrate	= /Audio:.* ([0-9]+) kb\/s/.exec(stdout) || []
			  , rotate			= /rotate[\s]+:[\s]([\d]{2,3})/.exec(stdout) || [];
			// Build return object
			var ret = { 
				filename		: filename[1] || ''
			  , title			: title[2] || ''
			  , artist			: artist[1] || ''
			  , album			: album[1] || ''
			  , track			: track[1] || ''
			  , date			: date[1] || ''
			  , synched			: is_synched
			  , duration		: {
					raw		: duration[1] || ''
				  , seconds	: duration[1] ? utils.durationToSeconds(duration[1]) : 0
				}
			  , video			: {
					container			: container[1] || ''
				  , bitrate				: (video_bitrate.length > 1) ? parseInt(video_bitrate[1], 10) : 0
				  , stream				: video_stream.length > 1 ? parseFloat(video_stream[1]) : 0.0
				  , codec				: video_codec[1] || ''
				  , resolution			: {
						w : resolution.length > 2 ? parseInt(resolution[2], 10) : 0
					  , h : resolution.length > 3 ? parseInt(resolution[3], 10) : 0
					}
				  , resolutionSquare	: {}
				  , aspect				: {}
				  , rotate				: rotate.length > 1 ? parseInt(rotate[1], 10) : 0
				  , fps					: fps.length > 1 ? parseFloat(fps[1]) : 0.0
				}
			  , audio			: {
					codec				: audio_codec[1] || ''
				  , bitrate				: audio_bitrate[1] || ''
				  , sample_rate			: sample_rate.length > 1 ? parseInt(sample_rate[1], 10) : 0
				  , stream				: audio_stream.length > 1 ? parseFloat(audio_stream[1]) : 0.0
				  , channels			: {
						raw		: channels[1] || ''
					  , value	: (channels.length > 0) ? ({ stereo : 2, mono : 1 }[channels[1]] || 0) : ''
					}
				}
			};
			// Check if exist aspect ratio
			if (aspect.length > 0) {
				var aspectValue = aspect[1].split(":");
				ret.video.aspect.x		= parseInt(aspectValue[0], 10);
				ret.video.aspect.y		= parseInt(aspectValue[1], 10);
				ret.video.aspect.string = aspect[1];
				ret.video.aspect.value	= parseFloat((ret.video.aspect.x / ret.video.aspect.y));
			} else {
				// If exists horizontal resolution then calculate aspect ratio
				if(ret.video.resolution.w > 0) {
					var gcdValue = utils.gcd(ret.video.resolution.w, ret.video.resolution.h);
					// Calculate aspect ratio
					ret.video.aspect.x		= ret.video.resolution.w / gcdValue;
					ret.video.aspect.y		= ret.video.resolution.h / gcdValue;
					ret.video.aspect.string = ret.video.aspect.x + ':' + ret.video.aspect.y;
					ret.video.aspect.value	= parseFloat((ret.video.aspect.x / ret.video.aspect.y));
				}
			}
			// Save pixel ratio for output size calculation
			if (pixel.length > 0) {
				ret.video.pixelString = pixel[1];
				var pixelValue = pixel[1].split(":");
				ret.video.pixel = parseFloat((parseInt(pixelValue[0], 10) / parseInt(pixelValue[1], 10)));
			} else {
				if (ret.video.resolution.w !== 0) {
					ret.video.pixelString = '1:1';
					ret.video.pixel = 1;
				} else {
					ret.video.pixelString = '';
					ret.video.pixel = 0.0;
				}
			}
			// Correct video.resolution when pixel aspectratio is not 1
			if (ret.video.pixel !== 1 || ret.video.pixel !== 0) {
				if( ret.video.pixel > 1 ) {
					ret.video.resolutionSquare.w = parseInt(ret.video.resolution.w * ret.video.pixel, 10);
					ret.video.resolutionSquare.h = ret.video.resolution.h;
				} else {
					ret.video.resolutionSquare.w = ret.video.resolution.w;
					ret.video.resolutionSquare.h = parseInt(ret.video.resolution.h / ret.video.pixel, 10);
				}
			}
			// Returns the list of supported formats
			deferred.resolve(ret);
		});
		// Return 'promise' instance 
		return deferred.promise;
	}
	
	/**
	 * Get the info about ffmpeg's codec and about file
	 */
	var _getInformation = function (fileInput, settings) {
		var deferreds = [];
		// Add promise
		deferreds.push(_ffmpegInfoConfiguration(settings));
		deferreds.push(_videoInfo(fileInput, settings));
		// Return defer
		return when.all(deferreds);
	}

	var __constructor = function (args) {
		// Check if exist at least one option
		if (args.length == 0 || args[0] == undefined)
			throw errors.renderError('empty_input_filepath');
		// Check if first argument is a string
		if (typeof args[0] != 'string')
			throw errors.renderError('input_filepath_must_be_string');
		// Get the input filepath
		var inputFilepath = args[0];
		// Check if file exist
		if (!fs.existsSync(inputFilepath))
			throw errors.renderError('fileinput_not_exist');
		
		// New instance of the base configuration
		var settings = new configs();
		// Callback to call
		var callback = null;
		
		// Scan all arguments
		for (var i = 1; i < args.length; i++) {
			// Check the type of variable
			switch (typeof args[i]) {
				case 'object' :
					utils.mergeObject(settings, args[i]);
					break;
				case 'function' :
					callback = args[i];
					break;
			}
		}
		
		// Building the value for return value. Check if the callback is not a function. In this case will created a new instance of the deferred class
		var deferred = typeof callback != 'function' ? when.defer() : { promise : null };
		
		when(_getInformation(inputFilepath, settings), function (data) {
			// Check if the callback is a function
			if (typeof callback == 'function') {
				// Call the callback function e return the new instance of 'video' class
				callback(null, new video(inputFilepath, settings, data[0], data[1]));
			} else {
				// Positive response
				deferred.resolve(new video(inputFilepath, settings, data[0], data[1]));
			}
		}, function (error) {
			// Check if the callback is a function
			if (typeof callback == 'function') {
				// Call the callback function e return the error found
				callback(error, null);
			} else {
				// Negative response
				deferred.reject(error);
			}
		});
		
		// Return a possible promise instance
		return deferred.promise;
	}

	return __constructor.call(this, arguments);
};

module.exports = ffmpeg;
},{"when":"node_modules/when/dist/browser/when.js","fs":"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/_empty.js","./errors":"node_modules/ffmpeg/lib/errors.js","./utils":"node_modules/ffmpeg/lib/utils.js","./configs":"node_modules/ffmpeg/lib/configs.js","./video":"node_modules/ffmpeg/lib/video.js"}],"node_modules/ffmpeg/index.js":[function(require,module,exports) {
module.exports = require('./lib/ffmpeg');
},{"./lib/ffmpeg":"node_modules/ffmpeg/lib/ffmpeg.js"}],"watermark.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WaterMark = WaterMark;

function WaterMark() {
  this.watermarkPath = null;
  this.outputFilePath = null;
  this.settings = null;
  this.inputVideoPath = null;

  this.setInputVideoPath = function (value) {
    this.inputVideoPath = value;
    return this;
  };

  this.setWatermarkPath = function (value) {
    this.watermarkPath = value;
    return this;
  };

  this.getWatermarkpath = function () {
    console.log(this.watermarkPath);
    return this.watermarkPath;
  };

  this.setOutputFilePath = function (value) {
    this.outputFilePath = value;
    return this;
  };

  this.setSettings = function (value) {
    this.settings = value;
    return this;
  };

  this.convert = function () {
    //    const instance = this;
    var ffmpeg = require('ffmpeg');

    console.log('input video path', this.inputVideoPath); // var process = new ffmpeg(this.inputVideoPath);
    // console.log('process', process);

    try {
      new ffmpeg(this.inputVideoPath, function (err, video) {
        if (!err) {
          console.log('The video is ready to be processed');
        } else {
          console.log('Error: ' + err);
        }
      });
    } catch (e) {
      console.log(e.code);
      console.log(e.msg);
    } // try {
    //     process.then(function (video) {
    //       console.log('The video is ready to be processed');
    //       console.log('instance', instance)
    //     //   instance.watermarkPath = 'watermark-suissa.png',
    //     //   instance.newFilepath = './video-com-watermark.mp4',
    //     //   instance.settings = {
    //     //         position        : "SE"      // Position: NE NC NW SE SC SW C CE CW
    //     //       , margin_nord     : null      // Margin nord
    //     //       , margin_sud      : null      // Margin sud
    //     //       , margin_east     : null      // Margin east
    //     //       , margin_west     : null      // Margin west
    //     //     };
    //       var callback = function (error, files) {
    //         if(error){
    //           console.log('ERROR: ', error);
    //         }
    //         else{
    //           console.log('TERMINOU', files);
    //         }
    //       }
    //       //add watermark
    //       video.fnAddWatermark(instance.watermarkPath, instance.newFilepath, instance.settings, callback)
    //     }, function (err) {
    //       console.log('Error: ' + err);
    //     });
    //   } catch (e) {
    //     console.log(e.code);
    //     console.log(e.msg);
    //   }

  };
} //new Watermark();
},{"ffmpeg":"node_modules/ffmpeg/index.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _MediaStreamRecorderMin = _interopRequireDefault(require("./MediaStreamRecorder.min.js"));

var _watermark2 = require("./watermark.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _watermark = new _watermark2.WaterMark();

var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
var worker;
var finalBlob = null;
/** Testofy Code */

var inner = document.querySelector('.inner');
var mediaRecorder;
var recordButton = document.querySelector('button#record');
var stopButton = document.querySelector('button#stop');

function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
  navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}

var mediaConstraints = {
  audio: true,
  // record both audio/video in Firefox/Chrome
  video: true
}; // ffmpeg
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

  fileReader.onload = function () {
    aab = this.result;
    postMessage();
  };

  fileReader.readAsArrayBuffer(videoBlob);

  if (!worker) {
    worker = processInWebWorker();
  }

  worker.onmessage = function (event) {
    //console.log('data', event);
    var message = event.data;

    if (message.type == "ready") {
      //console.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
      workerReady = true;
      if (buffersReady) postMessage();
    } else if (message.type == "stdout") {//console.log(message.data);
    } else if (message.type == "start") {//console.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
    } else if (message.type == "done") {
      //postMessage();
      console.log(JSON.stringify(message)); // var result = message.data[0];
      // console.log('Result = ', result);          

      var blob = new File([videoBlob], obj.uuid + '.mp4', {
        type: 'video/mp4'
      }); //console.log('webmp to mp4', blob);

      callback(blob); //PostBlob(blob);
    }
  };

  var postMessage = function postMessage() {
    posted = true;
    worker.postMessage({
      type: 'command',
      arguments: "-i ".concat(obj.inputVideoFilePath, " -i ").concat(obj.inputLogoFilePath, "  -filter_complex \"overlay=x=main_w*0.01:y=main_h*0.01\"  ").concat(obj.outputFilePath).split(' '),
      files: [{
        data: new Uint8Array(aab),
        name: "".concat(obj.uuid, ".webm")
      }]
    });
  };
} // ffmpeg


function handleDataAvailable(blob) {
  var uuid = Date.now();
  var videoBlob = new File([blob], uuid + '.mp4', {
    type: 'video/mp4'
  }); //console.log('blob', videoBlob);
  //_watermark.getWatermarkpath();
  //console.log(videoBlob);
  //uploadfile(videoBlob, videoBlob.name);

  uploadfile(videoBlob, videoBlob.name, function (res) {
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
    }); // console.log('input', res.inputVideoFilePath);
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
  }); // Yes, you can use the following command to add watermark to video:
  // -i /storage/emulated/0/Movies/Vid.mp4 -i /storage/emulated/0/Movies/logo.jpeg -filter_complex overlay=W-w-5:H-h-5 -codec:a copy -preset ultrafast -async 1 /storage/emulated/0/Movies/output.mp4
}

function onMediaSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;
  var gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
  mediaRecorder = new _MediaStreamRecorderMin.default(stream);
  mediaRecorder.mimeType = 'video/webm';
  mediaRecorder.stream = stream;
  var recorderType = 'MediaRecorder API'; //document.getElementById('video-recorderType').value;
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

  mediaRecorder.ondataavailable = handleDataAvailable; //  var timeInterval = 5;//document.querySelector('#time-interval').value;
  //  if (timeInterval) timeInterval = parseInt(timeInterval);
  //  else timeInterval = 5 * 1000;
  // get blob after specific time interval

  mediaRecorder.start(5000); //return false;
  //document.querySelector('#stop-recording').disabled = false;
}

function onMediaError(e) {
  console.error('media error', e);
}

var videosContainer = document.getElementById('videos-container');
var index = 1; // below function via: http://goo.gl/B3ae8c

function bytesToSize(bytes) {
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
} // below function via: http://goo.gl/6QNDcI


function getTimeLength(milliseconds) {
  var data = new Date(milliseconds);
  return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
}

window.onbeforeunload = function () {
  document.querySelector('button#record').disabled = false;
  initialStart();
}; // CALLL FROM TIMER.JS FILE ON START BUTTON


function initialStart() {
  // console.log('video initialize');
  $('video#recorded').trigger('click');
} // CALLL FROM SCRIPT.JS FILE ON EXAMEND FUNCTION


function stopVideo() {
  $('#stop-recording').trigger('click');
}

function stopRecording() {
  mediaRecorder.stop();
}

function uploadfile(blob, filename, callback) {
  var formData = new FormData();
  formData.append('files', blob);
  formData.append('filename', filename);
  $.ajax({
    type: 'POST',
    url: 'http://localhost/webm-tomp4/save.php',
    data: formData,
    processData: false,
    contentType: false,
    success: callback
  });
}

recordButton.addEventListener('click', function () {
  if (recordButton.textContent === 'Start Recording') {
    //recordButton.disabled = true;
    recordButton.textContent = 'Stop Recording';
    console.log('Start Recording');
    captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
  } else {
    stopRecording();
    console.log('Stop Recording');
    recordButton.textContent = 'Start Recording';
  }
}); // stopButton.addEventListener('click', () => {
//     if (stopButton.textContent === 'Stop Recording') {
//         stopButton.disabled = true;
//         stopRecording();
//         console.log('recording stop')
//         //captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
//     } 
// });
},{"./MediaStreamRecorder.min.js":"MediaStreamRecorder.min.js","./watermark.js":"watermark.js","ffmpeg":"node_modules/ffmpeg/index.js"}],"C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64826" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Arnab/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/webm-tomp4.e31bb0bc.js.map