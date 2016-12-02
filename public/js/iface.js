var I = {};

I.app = null;

/**
 * инициализация приложения
 * @param app
 */
I.init = function(app){
    I.app = app;
    I.messages = document.getElementById('messages');
    I.input = document.getElementById('input');
    I.send_btn = document.getElementById('send-btn');
    I.div_id = document.getElementById('user_id');
    I.send_btn.onclick = I.btnSendHandler;
    window.onkeypress = I.keyPressHandler;
    I.restoreMessages();
    I.messages.scrollTop = 9999;
};

/**
 * добавление сообщения в список сообщений
 * @param message
 */
I.addMessage = function(message){
    I.messages.innerHTML = I.messages.innerHTML + '<br/>' + message;
    I.messages.scrollTop = 9999;
    I.saveMessages();
};

/**
 * обработка нажатия кнопки Send
 */
I.btnSendHandler = function(){
    I.app.sendUserMessage(I.input.value);
    I.input.value = '';
};

/**
 * Обработка нажатий клавиш
 * @param e
 */
I.keyPressHandler = function(e){
    if (e.keyCode == 13){
        I.btnSendHandler();
    }
};

/**
 * сохранение истории сообщений
 */
I.saveMessages = function(){
    if (window.localStorage){
        window.localStorage.setItem('messages', I.messages.innerHTML);
    }
}

/**
 * получение истории сохранений
 * @returns {string}
 */
I.restoreMessages = function(){
    if (window.localStorage){
        I.messages.innerHTML = window.localStorage.getItem('messages');
    }
};

I.showId = function(id){
    I.div_id.innerHTML = id;
}
