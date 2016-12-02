/*сервер*/
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 8000;
var Helper = require('./modules/helper');
var sdata = require('./modules/sdata');
global.sdata = sdata;
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
app.post('/', controller.newUser);

io.on('connection', function(socket){

    Handler.user_connect(socket);
    Handler.user_disconnect(socket);
    Handler.user_message(socket);

});

/*установка обработчика на url /location/:loc*/
/*
for ( var key in locations){
    app.get('/user/:id', controller.user);

    /*обработчики событий модуля socket.io*/
    /*
    io.of('/user/'+key).on('connection',function(socket){
        Handler.get_game(socket, sdata);
        Handler.join_user(socket, sdata);
        Handler.data_from_client(socket, sdata);
        Handler.getnearestnode(socket, sdata);
        Handler.getroute(socket, sdata);
        Handler.add_unit(socket, sdata);
        Handler.del_unit(socket, sdata);
    });

}
*/
