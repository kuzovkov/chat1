/**
 * Created by user1 on 14.12.16.
 */
var WRTC = {};
WRTC.default_src = '/video/default.webm';
WRTC.localStream = null;
WRTC.captureOptions = {audio: true, video: true};
WRTC.localVideo = null;
WRTC.remoteVideo = null;
WRTC.error = null;
WRTC.callback = null;

/**
 * старт захвата медиа потоков
 * @param callback
 */
WRTC.startCaptureMedia = function(callback){
    WRTC.callback = callback;
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia(WRTC.captureOptions, WRTC.gotStream, WRTC.captureError);
    }else{
        WRTC.error = 'Error: getUserMedia does not supported';
    }
};

/**
 * останов захвата медиа потоков
 */
WRTC.stopCaptureMedia = function(){
    WRTC.callback = null;
    if (WRTC.localStream != null){
        WRTC.localStream.getVideoTracks().forEach(function (track) {
            track.stop();
        });

        WRTC.localStream.getAudioTracks().forEach(function (track) {
            track.stop();
        });
    }
};

/**
 * обработчик ошибок захвата медиа
 * @param error
 */
WRTC.captureError = function(error) {
    console.log("navigator.getUserMedia error: " + error);
    WRTC.error = "navigator.getUserMedia error: " + error;
    WRTC.callback(WRTC.error);
};

/**
 * обработчик успешного получения потоков
 * @param stream
 */
WRTC.gotStream = function(stream){
    WRTC.error = null;
    WRTC.localStream = stream;
    WRTC.bindLocalStream();
    WRTC.setMutedLocal(false);
};

/**
 * привязка потоков к элементу video
 */
WRTC.bindLocalStream = function(){
    var myURL = window.URL || window.webkitURL;
    if ( !myURL ){
        WRTC.localVideo.src = WRTC.localStream;
    }else{
        WRTC.localVideo.src = myURL.createObjectURL(WRTC.localStream);
    }
};

/**
 * привязка к элементу video видеоролика по умолчанию
 */
WRTC.unbindLocalStream = function(){
    WRTC.localVideo.src = WRTC.default_src;
};

/**
 * включение/выключение звука
 * @param muted
 */
WRTC.setMutedLocal = function(muted){
    if (WRTC.localVideo != null && WRTC.localVideo != undefined)
        WRTC.localVideo.muted = muted;
};

/**
 * отображение локального видео
 * @param el
 * @param errorCallback
 */
WRTC.showLocalVideo = function(el, errorCallback){
    WRTC.localVideo = el;
    WRTC.startCaptureMedia(errorCallback);
};

/**
 * выключение отображения локального видео
 */
WRTC.hideLocalVideo = function(){
    if (WRTC.localVideo == null) return;
    WRTC.stopCaptureMedia();
    WRTC.unbindLocalStream();
    WRTC.setMutedLocal(true);
};






