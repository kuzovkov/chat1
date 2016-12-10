var A = {};
A.nicname = null;
A.selected_user = null;

/**
 * инициализация приложения
 **/
A.init = function(){
    A.socket = Socket;
    A.io = io;
    A.socket.init(A);
    A.files = F;
    A.files.init(A);
    A.iface = I;
    A.iface.init(A);
    A.setEventHandlers();

};

/**
 * Установка обработчиков на события рассылаемые сервером
 **/
A.setEventHandlers= function(){
    A.socket.setEventHandler('connect', A.connect);
    A.socket.setEventHandler('disconnect', A.disconnect);
    A.socket.setEventHandler('new_message', A.newMessage);
    A.socket.setEventHandler('new_user', A.newUser);
    A.socket.setEventHandler('user_disconnected', A.userLost);
    A.socket.setEventHandler('users_online', A.refreshUsersOnline);
    A.socket.setEventHandler('last_messages', A.lastMessages);
    A.socket.setEventHandler('have_file', A.haveFile);
};

/**
 * обработчик события connect
 **/
A.connect = function(){
    A.socket.send('user_connect', {nicname: A.nicname});
};

/**
 * обработчик события disconnect
 * перезагрузка страницы
 **/
A.disconnect = function(){
    window.location.reload(true);
};

/**
 * отправка сообщения в чат
 * @param message
 */
A.sendUserMessage = function(message){
    A.socket.send('user_message', {message: message, to:A.selected_user});
};

/**
 * обработка приема нового сообщения чата
 * @param data
 */
A.newMessage = function(data){
    A.iface.addMessage(data.message);
};

/**
 * обработка события присоединения нового пользователя к чату
 * @param data
 */
A.newUser = function(data){
    var mess = 'New user ' + data.user + ' was connected!';
    A.serverMessage(mess);
};

/**
 * обработка события отключения пользователя от чата
 * @param data
 */
A.userLost = function(data){
    var mess = 'User ' + data.user + ' was disconnected!';
    A.serverMessage(mess);
};

/**
 * обновление списка пользователей online
 * @param data
 */
A.refreshUsersOnline = function(data){
    console.log(data.users_online);
    A.iface.refreshUsersOnline(data.users_online);
};

/**
 * установка значения выбранного пользователя
 * @param user
 */
A.setSelectedUser = function(user){
    A.selected_user = user;
};


/**
 * показ заметки с сообщением сервера
 */
A.serverMessage = function(mess){
    A.iface.hideNote();
    A.iface.showNote(mess);
};

/**
 * запрос истории сообщений у сервера
 */
A.requestMessagesHistory = function(){
    A.socket.send('message_history', {user1:A.nicname, user2:A.selected_user, lefttime: A.iface.HISTORY_LEFTTIME});
};

/**
 * отображение полученной истории сообщений
 * @param data
 */
A.lastMessages = function(data){
    A.iface.refreshMessages(data.messages);
}

A.sendFile = function(fname, fdata){
    A.socket.send('send_file', {fname:fname, fdata: fdata,to:A.selected_user});
}

A.haveFile = function(data){
    var note = ['User ', data.from, ' send for you file ', data.fname, ' size: ', data.fsize].join('');
    A.iface.showNote(note);
}


