var Chat = {};

Chat.users = {}; /*объект для хранения ников и id сокетов*/
Chat.messages = []; /*массив для хранения сообщений*/
Chat.MAX_COUNT_MESS = 1000; /*максимальное количество хранимых сообщений*/
Chat.MSEC_IN_HOUR = 3600000; /*миллисекунд в часах*/

/**
 * добавление нового пользователя к чату
 * @param nicname
 * @returns {boolean}
 */
Chat.addUser = function(nicname){
    for(key in Chat.users){
        if (key == nicname){
            return false;
        }
    }
    Chat.users[nicname] = 0;
    return true;
}

/**
 * обновление socket id при переподключениии пользователя
 * @param nicname
 * @param socketId
 */
Chat.refreshSocketId = function(nicname, socketId){
    Chat.users[nicname] = socketId;
}

/**
 * получение ника по socket id
 * @param socketId
 * @returns {*}
 */
Chat.getNicname = function(socketId){
    for (nicname in Chat.users){
        if (Chat.users[nicname] == socketId){
            return nicname;
        }
    }
    return null;
}

/**
 * удаление пользователя с заданным socket id из чата
 * @param socketId
 */
Chat.removeUser = function(socketId){
    for (nicname in Chat.users){
        if (Chat.users[nicname] == socketId){
            delete Chat.users[nicname];
        }
    }
}

/**
 * получение массива ников подключенных к чату пользователей
 * @returns {Array}
 */
Chat.getUsersOnline = function(){
    users = [];
    for(nicname in Chat.users){
        users.push(nicname);
    }
    return users;
}

/**
 * получение socket id по нику пользователяs
 * @param nicname
 * @returns {*}
 */
Chat.getSocketId = function(nicname){
    if (Chat.users[nicname] != undefined){
        return Chat.users[nicname];
    }else{
        return null;
    }
}

/**
 * добавление сообщения в массив
 * @param from
 * @param to
 * @param message
 */
Chat.addMessage = function(from, to, message){
    var timestamp = (new Date()).getTime();
    var message = {created: timestamp, from:from,to:to,message:message};
    Chat.messages.push(message);
    if (Chat.messages.length > Chat.MAX_COUNT_MESS){
        Chat.splice(0, Chat.messages.length - Chat.MAX_COUNT_MESS)
    }
    return message;
};

/**
 * получение массива сообщений между двумя пользователями
 * @param user1
 * @param user2
 * @param lefttime ширина временного интервала сообщений в часах
 * @returns {Array}
 */
Chat.getLastMessages = function(user1, user2, lefttime){
    var messages = [];
    var now = (new Date).getTime();
    for (var i = 0; i < Chat.messages.length; i++){
        if (Chat.messages[i]['created'] < (now - lefttime * Chat.MSEC_IN_HOUR)) continue;
        if (
            (Chat.messages[i]['from'] == user1 && Chat.messages[i]['to'] == user2) ||
            (Chat.messages[i]['from'] == user2 && Chat.messages[i]['to'] == user1)
        ){
            messages.push(Chat.messages[i]);
        }
    }
    return messages;
}


exports.addUser = Chat.addUser;
exports.refreshSocketId = Chat.refreshSocketId;
exports.getNicname = Chat.getNicname;
exports.removeUser = Chat.removeUser;
exports.getUsersOnline = Chat.getUsersOnline;
exports.getSocketId = Chat.getSocketId;
exports.addMessage = Chat.addMessage;
exports.getLastMessages = Chat.getLastMessages;