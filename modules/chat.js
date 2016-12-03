var users = {}

function addUser(nicname){
    for(key in users){
        if (key == nicname){
            return false;
        }
    }
    users[nicname] = 0;
    return true;
}

function refreshSocketId(nicname, socketId){
    users[nicname] = socketId;
}

function getNicname(socketId){
    for (nicname in users){
        if (users[nicname] == socketId){
            return nicname;
        }
    }
    return null;
}

function removeUser(socketId){
    for (nicname in users){
        if (users[nicname] == socketId){
            delete users[nicname];
        }
    }
}



//exports.users = users;
exports.addUser = addUser;
exports.refreshSocketId = refreshSocketId;
exports.getNicname = getNicname;
exports.removeUser = removeUser;
