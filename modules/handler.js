/*серверный модуль обработчиков событий при взаимодействии клиентов и сервера*/
var httpRequest = require('./httprequest');


function user_connect(socket, chat){
    socket.on('user_connect', function(data){
        var nicname = data.nicname;
        chat.refreshSocketId(nicname, socket.id);
        var users_online = chat.getUsersOnline();
        console.log(users_online);
        socket.broadcast.emit('new_user', {'user':nicname});
        socket.broadcast.emit('users_online', {users_online:users_online});
        socket.emit('users_online', {users_online:users_online});
    });
}


function user_disconnect(socket, chat){
    socket.on('disconnect', function(){
        var nicname = chat.getNicname(socket.id);
        console.log('user '+ nicname + ' was disconnected');
        chat.removeUser(socket.id);
        socket.broadcast.emit('user_disconnected', {user: nicname});
        var users_online = chat.getUsersOnline();
        socket.emit('users_online', {users_online:users_online});
        socket.broadcast.emit('users_online', {users_online:users_online});
    });
}

function user_message(socket, chat){
    socket.on('user_message', function(data){
        console.log(data);
        var nicname = chat.getNicname(socket.id);
        var adresat_id = chat.getSocketId(data.to);
        var messageObject = chat.addMessage(nicname, data.to, data.message);
        socket.broadcast.to(adresat_id).emit('new_message', {message:messageObject});
        socket.emit('new_message', {message:messageObject});
    });
}

function message_history(socket, chat){
    socket.on('message_history', function(data){
        var messages = chat.getLastMessages(data.user1, data.user2, data.lefttime);
        socket.emit('last_messages', {messages:messages});
    });
}

function send_file(socket, chat){
    socket.on('send_file', function(data){
        var from = chat.getNicname(socket.id);
        var adresat_id = chat.getSocketId(data.to);
        chat.saveFile(from, data.to, data.fname, data.fdata, function(fsize){
            socket.broadcast.to(adresat_id).emit('have_file', {from: from, fname: data.fname, fsize: fsize});
            socket.emit('file_accepted', {to: data.to, fname: data.fname});
        });
    });
}

function request_files(socket, chat){
    socket.on('request_files', function(data){
        var nicname = chat.getNicname(socket.id);
        var files_meta = chat.getFilesMetadataByNicname(nicname);
        socket.emit('you_files', {files: files_meta});
    });
}



exports.user_connect = user_connect;
exports.user_disconnect = user_disconnect;
exports.user_message = user_message;
exports.message_history = message_history;
exports.send_file = send_file;
exports.request_files = request_files;