var I = {};

I.app = null;
I.messages = [];

/**
 * инициализация приложения
 * @param app
 */
I.init = function(app){
    I.app = app;
    I.messages_block = document.getElementById('messages');
    I.input = document.getElementById('input');
    I.send_btn = document.getElementById('send-btn');
    I.nicname = document.getElementById('nicname');
    I.clear_btn = document.getElementById('clear-btn');
    I.send_btn.onclick = I.btnSendHandler;
    I.exit_btn = document.getElementById('exit-btn');
    I.exit_btn.onclick = I.exit;
    window.onkeypress = I.keyPressHandler;
    I.clear_btn.onclick = I.removeHistory;
    I.restoreMessages();
    I.showMessages();
    I.messages_block.scrollTop = 9999;
    I.app.nicname = document.getElementById('nicname').innerHTML;
};

/**
 * добавление сообщения в список сообщений
 * @param message
 */
I.addMessage = function(user, message){
    I.messages.push({author:user, text:message});
    I.saveMessages();
    I.showMessages();
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
        window.localStorage.setItem('messages', JSON.stringify(I.messages));
    }
}

/**
 * получение истории сохранений
 * @returns {string}
 */
I.restoreMessages = function(){
    if (window.localStorage){
        I.messages = JSON.parse(window.localStorage.getItem('messages'));
        if (I.messages == null){
            I.messages = [];
        }
    }
};

/**
 * показ списка сообщений
 */
I.showMessages = function(){
    var html = ['<ul class="messages-list">'];
    for (var i = 0; i < I.messages.length; i++){
        html.push('<li><span class="author">');
        html.push(I.messages[i]['author']);
        html.push('</span>: <span class="text">');
        html.push(I.messages[i]['text']);
        html.push('</span></li>');
    }
    html.push('</ul>');
    I.messages_block.innerHTML = html.join('');
}

/**
 * удаление истории  сообщений
 */
I.removeHistory = function(){
    window.localStorage.removeItem('messages');
    I.restoreMessages();
    I.showMessages();
};

/**
 * выход из чата
 */
I.exit = function(){
    deleteCookie('nicname');
    window.location.reload(true);
};

