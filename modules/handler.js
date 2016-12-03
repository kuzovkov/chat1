/*серверный модуль обработчиков событий при взаимодействии клиентов и сервера*/
var httpRequest = require('./httprequest');


function user_connect(socket, chat){
    socket.on('user_connect', function(data){
        var nicname = data.nicname;
        chat.refreshSocketId(nicname, socket.id);
        socket.broadcast.emit('new_user', {'user':nicname});
    });
}


function user_disconnect(socket, chat){
    socket.on('disconnect', function(){
        var nicname = chat.getNicname(socket.id);
        console.log('user '+ nicname + ' was disconnected');
        chat.removeUser(socket.id);
        socket.broadcast.emit('user_disconnected', {user: nicname});
    });
}

function user_message(socket, chat){
    socket.on('user_message', function(data){
        var nicname = chat.getNicname(socket.id);
        socket.broadcast.emit('new_message', {message:data.message, user:nicname});
        socket.emit('new_message', {message:data.message, user:nicname});
    });
}


exports.user_connect = user_connect;
exports.user_disconnect = user_disconnect;
exports.user_message = user_message;