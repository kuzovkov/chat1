/**
 * Created by user1 on 14.12.16.
 */
var WRTC = {};
WRTC.default_src = '/video/default.webm';
WRTC.stream = null;


WRTC.showLocalVideo = function(elVideo, error){
    //navigator.getUserMedia  = false;
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true, video: true}, function(stream){
            WRTC.stream = stream;
            var myURL = window.URL || window.webkitURL;
            if ( !myURL ){
                elVideo.src = WRTC.stream;
            }else{
                elVideo.src = myURL.createObjectURL(WRTC.stream);
            }
        }, errorCallback);
    } else {
        elVideo.src = WRTC.default_src; // fallback.
    }

    function errorCallback(error) {
        error("navigator.getUserMedia error: " + error);
    }

};

WRTC.hideLocalVideo = function(elVideo){
    elVideo.src = WRTC.default_src; // fallback.
    if (WRTC.stream != null){
        WRTC.stream.getVideoTracks().forEach(function (track) {
            track.stop();
        });
    }
};



