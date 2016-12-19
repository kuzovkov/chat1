#!/usr/bin/env node

/*сервер*/

var fs = require('fs');
var options = {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
};
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var server = https.createServer(options, app);
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

/*обработка запросов*/
app.get('/', controller.index );
app.get('/choosenicname', controller.choosenicname);
app.post('/choosenicname', controller.newUser);
app.get('/file/:secret', controller.download_file);
app.get('/file-del/:secret', controller.remove_file);
app.get('/test', controller.test);


io.on('connection', function(socket){
    Handler.user_connect(socket, chat);
    Handler.user_disconnect(socket, chat);
    Handler.user_message(socket, chat);
    Handler.message_history(socket, chat);
    Handler.send_file(socket, chat);
    Handler.request_files(socket, chat);
    Handler.wrtc_message(socket, chat);
});

