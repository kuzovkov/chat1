var I = {};

I.app = null;
I.messages = [];
I.MAX_MESSAGES_LEN = 500;
I.NOTE_TIME = 30000; /*время показа заметки*/
I.timeout = null;
I.HISTORY_LEFTTIME = 48; /*длина истории сообщений в часах*/

/**
 * инициализация объекта интерфейса
 * @param app
 */
I.init = function(app){
    I.app = app;
    I.initElements();
    I.setInterfaceHandlers();
    if (!I.app.files.FILE_API){
        I.showNote('You browser does not supported File API!');
        I.hideElem('files_wrap');
    }
    I.showMessages();
    if (window.localStorage) I.app.selected_user = window.localStorage.getItem('selected_user');
};


I.test = function(){
    //I.showNote('test message');
    console.log(F.choosen_files);
    for (var i = 0,f; f = F.choosen_files[i]; i++){
        //console.log();
        F.readFile(f, function(f, data){
            console.log(f.name);
            console.log(data);
            I.app.sendFile(f.name, data);
        });
    }
};

I.sendFiles = function(){
    console.log(F.choosen_files);
    for (var i = 0,f; f = F.choosen_files[i]; i++){
        //console.log();
        F.readFile(f, function(f, data){
            console.log(f.name);
            console.log(data);
            I.app.sendFile(f.name, data);
        });
    }
};

/**
 * Список элементов интерфейса
 */
I.elements = {
    messages_block: 'messages',
    note_block: 'note',
    note_text: 'note-text',
    note_close: 'note-close',
    input: 'input',
    send_btn: 'send-btn',
    exit_btn: 'exit-btn',
    nicname: 'nicname',
    clear_btn: 'clear-btn',
    user_for_chat: 'user-for-chat',
    list_users_online: 'users-online',
    test: 'test',
    files_list: 'files-list',
    files_input: 'files-input',
    files_wrap: 'files-wrap',
    send_files_btn: 'send-files-btn'
};


/**
 * инициализация элементов интерфейса
 */
I.initElements = function(){
    for (var name in I.elements){
        I[name] = document.getElementById(I.elements[name]);
    }
    if (I.messages_block != null) I.messages_block.scrollTop = 9999;
    if (I.nicname != null) I.app.nicname = I.nicname.innerHTML;
};

/**
 * установка обработчиков событий элементов интерфейса
 */
I.setInterfaceHandlers = function(){
    for (var el in I.handlers){
        if (I[el] != null && I[el] != undefined){
            I[el].addEventListener(I.handlers[el]['event'], I.handlers[el]['handler'], false);
        }
    }
    window.onkeypress = I.keyPressHandler;
};



/**
 * добавление сообщения в список сообщений
 * @param message
 */
I.addMessage = function(message){
    I.messages.push(message);
    if (I.messages.length > I.MAX_MESSAGES_LEN){
        I.messages.splice(0, I.messages.length - I.MAX_MESSAGES_LEN);
    }
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
 * обновление истории сообщений
 * @param messages
 */
I.refreshMessages = function(messages){
    I.messages = messages;
    I.showMessages();
};

/**
 * обновление истории сообщений в соответствии с выбранныи пользователем
 */
I.switchUser = function(){
    if (I.messages_block == null) return;
    I.messages_block.innerHTML = '<img src="/img/preload.gif" class="preload"/>';
    I.app.requestMessagesHistory();
};

/**
 * показ списка сообщений
 */
I.showMessages = function(){
    if (I.messages_block == null) return;
    var html = ['<ul class="messages-list">'];
    for (var i = 0; i < I.messages.length; i++){
        if ((I.messages[i]['from'] != I.app.selected_user) &&
            (I.messages[i]['from'] != I.app.nicname))
                continue;
        html.push('<li><span class="created">[');
        html.push(I.timestamp2date(I.messages[i]['created']));
        html.push(']</span>')
        if (I.messages[i]['from'] == I.app.nicname){
            html.push('<span class="author-out">');
        }else{
            html.push('<span class="author-in">');
        }
        html.push(I.messages[i]['from']);
        html.push('</span>: <span class="text">');
        html.push(I.messages[i]['message']);
        html.push('</span></li>');
    }
    html.push('</ul>');
    I.messages_block.innerHTML = html.join('');
}


/**
 * выход из чата
 */
I.exit = function(){
    deleteCookie('nicname');
    I.reloadPage('/');
};

/**
 * перезагрузка страницы
 * @param url
 */
I.reloadPage = function(url){
    window.location.replace(url);
};

/**
 * заполнение списка рользовалелей online
 * @param user_list
 */
I.refreshUsersOnline = function(user_list){
    if (I.list_users_online == null) return;
    I.destroyChildren(I.list_users_online);
    if (user_list.indexOf(I.selected_user) == -1){
        I.app.selected_user = null;
    }
    for (var i = 0; i< user_list.length; i++){
        if (user_list[i] == I.app.nicname) continue;
        var li = document.createElement('li');
        li.id = 'chat-' + user_list[i];
        li.className = 'user-item';
        console.log(I.app.selected_user +':'+user_list[i]);
        if (I.app.selected_user == user_list[i]){
            li.className = 'user-item selected';
        }

        if (I.app.selected_user == null){
            li.className = 'user-item selected';
            I.app.selected_user = user_list[i];
        }
        li.innerHTML = user_list[i];
        I.list_users_online.appendChild(li);
    }
    var list = document.getElementsByClassName('user-item');
    for (var i = 0; i < list.length; i++){
        list[i].addEventListener('click', I.selectUser);
    }
    if (I.user_for_chat != null) I.user_for_chat.innerHTML = I.app.selected_user;
    I.switchUser();
};

/**
 * удаление дочерних узлов у DOM элемента
 * @param node DOM элемент
 **/
I.destroyChildren = function(node){
    if (!node) return;
    node.innerHTML = '';
    while (node.firstChild)
        node.removeChild(node.firstChild);
}

/**
 * Обработка выбора пользователя для общения
 * @param e
 */
I.selectUser = function(e){
    console.log(this.id.split('-').pop());
    var list = document.getElementsByClassName('user-item');
    for (var i = 0; i < list.length; i++){
        list[i].className = 'user-item';
    }
    this.className = 'user-item selected';
    I.app.setSelectedUser(this.id.split('-').pop());
    if (window.localStorage){
        window.localStorage.setItem('selected_user', this.id.split('-').pop());
    }
    if (I.user_for_chat != null) I.user_for_chat.innerHTML = I.app.selected_user;
    I.switchUser();
};

/**
 * показ заметки
 */
I.showNote = function(text){
    if (I.note_block == null) return;
    I.note_text.innerHTML = text;
    I.note_block.style.display = 'block';
    I.timeout = setTimeout(I.hideNote, I.NOTE_TIME);
};

/**
 * сокрытие заметки
 */
I.hideNote = function(){
    if (I.timeout != null){
        clearTimeout(I.timeout);
        I.timeout = null;
    }
    if (I.note_block == null || I.note_text == null) return;
    I.note_text.innerHTML = '';
    I.note_block.style.display = 'none';
};

/**
* преобразование timestamp в строку даты-времени
*/
I.timestamp2date = function(timestamp){
    var date = new Date(timestamp);
    return date.toLocaleString();
};

/**
 * заполнение списка выбранных файловs
 * @param list массив параметров фалов
 * @param el елемент DOM куда выводить
 */
I.fillFilesList = function(list) {
    var html = ['<table><tr><th>Name</th><th>Type</th><th>Size</th></tr>'];
    for (var i =0; i < list.length; i++){
        html.push('<tr>','<td>', list[i][0], '</td>', '<td>', list[i][1], '</td>', '<td>', list[i][2], '</td>', '</tr>');
    }
    html.push('</table>')
    if (I.files_list != null) I.files_list.innerHTML = html.join('');
}

/**
 * Список обработчиков
 */
I.handlers = {
    note_close: {event:'click', handler: I.hideNote },
    send_btn: {event:'click', handler: I.btnSendHandler},
    exit_btn: {event:'click', handler: I.exit},
    test: {event:'click', handler: I.test},
    files_input: {event:'change', handler: F.handlerFileSelect},
    send_files_btn: {event:'click', handler: I.sendFiles}
};

I.hideElem = function(el){
    if (I[el] != null && I[el] != undefined){
        I[el].style.display = 'none';
    }
};

I.showElem = function(el){
    if (I[el] != null && I[el] != undefined){
        I[el].style.display = 'block';
    }
};

