/**
 * Created by user1 on 10.12.16.
 */

F = {};
F.app = null;
F.FILE_API = false;

F.init = function(app){
    F.app = app;
    if (window.File && window.FileReader && window.FileList && window.Blob){
        F.FILE_API = true;
        console.log('File API is supported');
    }else{
        F.FILE_API = false;
    }
}


F.handlerFileSelect = function(ev){
    var files = ev.target.files;
    var output = [];
    for (var i =0,f; f = files[i]; i++){
        output.push([escape(f.name), f.type || 'n/a', f.size]);
    }
    F.app.iface.fillFilesList(output);
};

