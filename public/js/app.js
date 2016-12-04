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
    A.iface = I;
    A.iface.init(A);
    A.setEventHandlers();

};

/**
 * Установка обработчиков на события рассылаемые сервером
 **/
A.setEventHandlers = function(){
    A.socket.setEventHandler('connect', A.connect);
    A.socket.setEventHandler('disconnect', A.disconnect);
    A.socket.setEventHandler('new_message', A.newMessage);
    A.socket.setEventHandler('new_user', A.newUser);
    A.socket.setEventHandler('user_disconnected', A.userLost);
    A.socket.setEventHandler('users_online', A.refreshUsersOnline);
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
    A.iface.addMessage(data.user, data.message);
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


