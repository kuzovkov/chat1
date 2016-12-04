var Chat = {};

Chat.users = {}

Chat.addUser = function(nicname){
    for(key in Chat.users){
        if (key == nicname){
            return false;
        }
    }
    Chat.users[nicname] = 0;
    return true;
}

Chat.refreshSocketId = function(nicname, socketId){
    Chat.users[nicname] = socketId;
}

Chat.getNicname = function(socketId){
    for (nicname in Chat.users){
        if (Chat.users[nicname] == socketId){
            return nicname;
        }
    }
    return null;
}

Chat.removeUser = function(socketId){
    for (nicname in Chat.users){
        if (Chat.users[nicname] == socketId){
            delete Chat.users[nicname];
        }
    }
}

Chat.getUsersOnline = function(){
    users = [];
    for(nicname in Chat.users){
        users.push(nicname);
    }
    return users;
}

Chat.getSocketId = function(nicname){
    if (Chat.users[nicname] != undefined){
        return Chat.users[nicname];
    }else{
        return null;
    }
}


exports.addUser = Chat.addUser;
exports.refreshSocketId = Chat.refreshSocketId;
exports.getNicname = Chat.getNicname;
exports.removeUser = Chat.removeUser;
exports.getUsersOnline = Chat.getUsersOnline;
exports.getSocketId = Chat.getSocketId;
