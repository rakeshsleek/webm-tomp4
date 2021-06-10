export function WaterMark() {
   
    this.watermarkPath  = null;
    this.outputFilePath    = null;
    this.settings       = null;
    this.inputVideoPath       = null;

    this.setInputVideoPath = function(value) {
        this.inputVideoPath = value;
        return this;
    }
    this.setWatermarkPath = function(value) {
        this.watermarkPath = value;
        return this;
    }
    this.getWatermarkpath  = function() {
        console.log(this.watermarkPath);
        return this.watermarkPath;
    }
    this.setOutputFilePath = function(value) {
        this.outputFilePath = value;
        return this;
    }
    this.setSettings = function(value) {
        this.settings = value;
        return this;
    }
    this.convert = function() {
    //    const instance = this;
        var ffmpeg = require('ffmpeg');
        console.log('input video path', this.inputVideoPath);
        // var process = new ffmpeg(this.inputVideoPath);
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
        }
        // try {
          
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
    }
    
}
//new Watermark();