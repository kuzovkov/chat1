/**
 * Created by user1 on 14.12.16.
 */
var WRTC = {};
WRTC.default_src = '/video/default.mp4';


WRTC.showLocalVideo = function(elVideo, error){
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true, video: true}, successCallback, errorCallback);
    } else {
        elVideo.src = WRTC.default_src; // fallback.
    }

    function successCallback(stream){
        var myURL = window.URL || window.webkitURL;
        if ( !myURL ){
            elVideo.src = stream;
        }else{
            elVideo.src = myURL.createObjectURL(stream);
        }
    }

    function errorCallback(error) {
        error("navigator.getUserMedia error: " + error);
    }

};

WRTC.hideLocalVideo = function(elVideo){
    elVideo.src = WRTC.default_src; // fallback.
    var myURL = window.URL || window.webkitURL;
    if ( !myURL ){
        elVideo.src = stream;
    }else{
        elVideo.src = myURL.createObjectURL(stream);
    }

};



