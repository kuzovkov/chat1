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
        navigator.getUserMedia(WRTC.captureOptions, WRTC.gotLocalStream, WRTC.captureError);
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
WRTC.gotLocalStream = function(stream){
    WRTC.error = null;
    WRTC.localStream = stream;
    WRTC.attachStream(WRTC.localVideo, WRTC.localStream);
    WRTC.setMuted(WRTC.localVideo, false);
};

/**
 * привязка потоков к элементу video
 */
WRTC.attachStream = function(el, stream){
    var myURL = window.URL || window.webkitURL;
    if ( !myURL ){
        el.src = stream;
    }else{
        el.src = myURL.createObjectURL(stream);
    }
};

/**
 * привязка к элементу video видеоролика по умолчанию
 */
WRTC.deattachStream = function(el){
    el.src = WRTC.default_src;
};

/**
 * включение/выключение звука
 * @param muted
 */
WRTC.setMuted = function(el, muted){
    if (el != null && el != undefined)
        el.muted = muted;
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
    WRTC.deattachStream(WRTC.localVideo);
    WRTC.setMuted(WRTC.localVideo, true);
};






