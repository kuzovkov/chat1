/*серверный модуль обработчиков событий при взаимодействии клиентов и сервера*/
var httpRequest = require('./httprequest');


function user_connect(socket){
    socket.on('user_connect', function(data){
        var user_id = socket.id;
        console.log(user_id);
        socket.broadcast.emit('new_user', {'user_id':user_id});
    });
}


function user_disconnect(socket){
    socket.on('disconnect', function(){
        var user_id = socket.id;
        console.log('user '+ user_id + ' was disconnected');
        socket.broadcast.emit('user_disconnected', {user_id: user_id});
    });
}

function user_message(socket){
    socket.on('user_message', function(data){
        var user_id = socket.id;
        socket.broadcast.emit('new_message', {message: [user_id,':',data.message].join('')});
        socket.emit('new_message', {message: [user_id,':',data.message].join('')});
    });
}


exports.user_connect = user_connect;
exports.user_disconnect = user_disconnect;
exports.user_message = user_message;