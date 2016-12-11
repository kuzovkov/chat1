/**
* модуль обработки http запросов к серверу
**/
var fs = require('fs');


/**
* обработчик GET запроса на '/'
**/
function index(req,res){
    var nicname = req.cookies.nicname;
    if ( nicname == undefined || nicname == 'undefined'){
        res.redirect('/choosenicname');
        res.end();
    }else{
        var userlist = global.chat.getUsersOnline();
        res.render('index', {nicname:nicname, userlist: userlist});
    }

}

/**
* обработчик GET запроса на '/choosenicname'
**/
function choosenicname(req, res){
    res.render('choosenicname');
}

/**
 * обработчик POST запроса на '/choosenicname'
 *  @param req
 * @param res
 */
function newUser(req,res){
    var nicname = req.body.nicname;
    if (!global.chat.addUser(nicname)){
        var message = 'This NicName is busy';
        res.render('choosenicname', {message:message});
    }else{
        res.cookie('nicname', nicname);
        res.redirect('/');
        res.end();
    }
}

/**
* обработчик GET запроса на '/file/:secret'
**/
function download_file(req, res){
    var secret = req.params.secret;
    var file_meta = global.chat.getFileMetadataBySecret(secret);
    if (file_meta != null){
        var path = global.chat.USERS_FILES_DIR + '/' + file_meta.encname;
        res.sendFile(path);
        res.redirect('/');
        res.end();
    }else{
        res.redirect('/');
        res.end();
    }
}

/**
 * обработчик GET запроса на '/file-del/:secret'
 **/
function remove_file(req, res){
    var secret = req.params.secret;
    var file_meta = global.chat.getFileMetadataBySecret(secret);
    if (file_meta != null){
        var path = global.chat.USERS_FILES_DIR + '/' + file_meta.encname;
        res.sendfile(path);
        res.end();
    }else{
        res.redirect('/');
        res.end;
    }
}



exports.index = index;
exports.download_file = download_file;
exports.remove_file = remove_file;
exports.choosenicname = choosenicname;
exports.newUser = newUser;

