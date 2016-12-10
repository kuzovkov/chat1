#!/usr/bin/env node

/*сервер*/
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 8000;
var Helper = require('./modules/helper');
var chat = require('./modules/chat');
global.chat = chat;
global.io = io;
var controller = require('./modules/controller');
var Handler = require('./modules/handler');
var cons = require('consolidate');


server.listen(port,function(){
    console.log('Server start at port '+port+ ' ' + Helper.getTime());
});

/* настройки для рендеринга шаблонов*/
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views',__dirname+'/public/views');

/* подключение каталога статических файлов, cookies, bodyParser */
app.use(express.static(__dirname+'/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

/*основной маршрут*/
app.get('/', controller.index );
app.get('/choosenicname', controller.choosenicname);
app.post('/choosenicname', controller.newUser);


io.on('connection', function(socket){
    Handler.user_connect(socket, chat);
    Handler.user_disconnect(socket, chat);
    Handler.user_message(socket, chat);
    Handler.message_history(socket, chat);
    Handler.send_file(socket, chat);
});

