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
* обработчик GET запроса на '/chat/:nicname'
**/
function chat(req, res){
    var nicname = req.params.nicname;
    var userlist = global.chat.getUsersOnline();
    global.io.of('/chat' + nicname).on('connection', function(socket){
        Handler.user_connect(socket, chat);
        Handler.user_disconnect(socket, chat);
        Handler.user_message(socket, chat);
    });
    res.render('chat', {nicname:nicname, userlist:userlist});

}



exports.index = index;
exports.chat = chat;
exports.choosenicname = choosenicname;
exports.newUser = newUser;

