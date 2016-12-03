var A = {};
A.nicname = null;

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

A.sendUserMessage = function(message){
    A.socket.send('user_message', {message: message});
};

A.newMessage = function(data){
    A.iface.addMessage(data.user, data.message);
};

A.newUser = function(data){
    var mess = 'New user ' + data.user + ' was connected!';
    A.iface.addMessage('Server', mess);
};

A.userLost = function(data){
    var mess = 'User ' + data.user + ' was disconnected!';
    A.iface.addMessage('Server', mess);
};


