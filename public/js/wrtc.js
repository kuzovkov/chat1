/**
 * Created by user1 on 14.12.16.
 */
var WRTC = {};
WRTC.default_src = '/video/default.webm';
WRTC.localStream = null;


WRTC.showLocalVideo = function(elVideo, error){
    //navigator.getUserMedia  = false;
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true, video: true}, function(stream){
            WRTC.localStream = stream;
            var myURL = window.URL || window.webkitURL;
            if ( !myURL ){
                elVideo.src = WRTC.localStream;
            }else{
                elVideo.src = myURL.createObjectURL(WRTC.localStream);
            }
        }, errorCallback);
    } else {
        elVideo.src = WRTC.default_src; // fallback.
    }

    function errorCallback(error) {
        console.log("navigator.getUserMedia error: " + error);
        error("navigator.getUserMedia error: " + error);
    }
};

WRTC.hideLocalVideo = function(elVideo){
    elVideo.src = WRTC.default_src; // fallback.
    if (WRTC.localStream != null){
        WRTC.localStream.getVideoTracks().forEach(function (track) {
            track.stop();
        });
    }
};



