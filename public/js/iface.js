var I = {};

I.app = null;
I.messages = [];
I.MAX_MESSAGES_LEN = 500;
I.NOTE_TIME = 30000; /*время показа заметки*/
I.timeout = null;
I.HISTORY_LEFTTIME = 48; /*длина истории сообщений в часах*/
I.CHAT_ENABLE = false; /*доступна ли отправка сообщений*/
I.CAPTURE_LOCAL_VIDEO = true; /*захватывать ли видео с камеры*/

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
    user_for_videochat: 'user-for-videochat',
    list_users_online: 'users-online',
    test: 'test',
    files_list: 'files-list',
    files_input: 'files-input',
    files_wrap: 'files-wrap',
    send_files_btn: 'send-files-btn',
    files_preload: 'files-preload',
    incoming_files: 'incoming-files',
    local_video: 'local-video',
    video_wrap: 'video-wrap',
    toggle_local_video: 'toggle-local-video'
};

/**
 * инициализация объекта интерфейса
 * @param app
 */
I.init = function(app){
    I.app = app;
    I.initElements();
    I.setInterfaceHandlers();
    if (!I.app.files.FILE_API){
        I.files_wrap.innerHTML = ('<p>You browser does not supported File API</p>');
        //I.hideElem('files_wrap');
    }
    I.showMessages();
    if (window.localStorage) I.app.selected_user = window.localStorage.getItem('selected_user');
    I.showLocalVideo();
};

/**
 * тестовая функция
 */
I.test = function(){

};

/**
 * отправка выбранных файлов на сервер
 */
I.sendFiles = function(){
    if (!I.CHAT_ENABLE) return;
    //console.log(F.choosen_files);
    I.showElem(I.files_preload);
    I.files_list.innerHTML = '';
    for (var i = 0,f; f = F.choosen_files[i]; i++){
        console.log(f);
        F.readFile(f, function(f, data){
            //console.log(f.name);
            //console.log(data);
            I.app.sendFile(f.name, data);
        });
    }
    I.files_input.value = null;
};

/**
 * заполнение списка выбранных для отправки файлов
 * @param list массив параметров фалов
 * @param el елемент DOM куда выводить
 */
I.fillFilesList = function(list) {
    if (list.length == 0){
        if (I.files_list != null) I.files_list.innerHTML = '';
        return;
    }
    var html = ['<table><tr><th>Name</th><th>Type</th><th>Size</th><th>Sended</th></tr>'];
    for (var i =0; i < list.length; i++){
        html.push('<tr>','<td>', list[i][0], '</td>', '<td>', list[i][1], '</td>', '<td>', list[i][2], '</td>', '<td>', list[i][3], '</td>', '</tr>');
    }
    html.push('</table>')
    if (I.files_list != null) I.files_list.innerHTML = html.join('');
}

/**
 * обновление списка ссылок на присланные файлы
 * @param data
 */
I.refreshFilesLinks = function(data){
    var html = [];
    for (var i = 0; i < data.files.length; i++){
        var fname = data.files[i].origname;
        var secret = data.files[i].secret;
        html.push(['<li><a href="/file/', secret, '" title="Download">', fname, '</a>&nbsp;<a title="Delete" href="/file-del/', secret,'">'].join(''));
        html.push(['delete</a></li>'].join(''));
    }
    I.incoming_files.innerHTML = html.join('');
};


/**
 * обработка сообщения от сервера что отправленный файл принят
 * @param to
 * @param fname
 */
I.fileAccepted = function(to, fname){
    I.hideElem(I.files_preload);
    var note = ['File ', fname, ' to user ', to, ' was send'].join('');
    //I.showNote(note);
    var p = document.createElement('p');
    p.innerHTML = note;
    console.log(p);
    I.files_list.appendChild(p);
    console.log(I.files_list);
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
    if (!I.CHAT_ENABLE) return;
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
 * обновление истории сообщений при получении ее от серовера
 * @param messages
 */
I.refreshMessages = function(messages){
    I.messages = messages;
    I.showMessages();
};

/**
 * запрос истории сообщений у сервера в соответствии с выбранныи пользователем
 */
I.requestHistory = function(){
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
 * заполнение списка пользовалелей online
 * @param user_list
 */
I.refreshUsersOnline = function(user_list){
    if (I.list_users_online == null) return;
    I.destroyChildren(I.list_users_online);
    if (user_list.indexOf(I.app.selected_user) == -1){
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
    if (I.user_for_videochat != null) I.user_for_videochat.innerHTML = I.app.selected_user;
    if (I.app.selected_user != null){
        I.chat_enable(true);
    }else{
        I.chat_enable(false);
    }
    I.requestHistory();
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
    if (I.user_for_videochat != null) I.user_for_videochat.innerHTML = I.app.selected_user;
    I.requestHistory();
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
 * Список обработчиков
 */
I.handlers = {
    note_close: {event:'click', handler: I.hideNote },
    send_btn: {event:'click', handler: I.btnSendHandler},
    exit_btn: {event:'click', handler: I.exit},
    test: {event:'click', handler: I.test},
    files_input: {event:'change', handler: F.handlerFileSelect},
    send_files_btn: {event:'click', handler: I.sendFiles},
    toggle_local_video: {event: 'change', handler: I.showLocalVideo}
};

/**
 * сокрытие элемента интерфейса
 * @param el
 */
I.hideElem = function(el){
    if (el != null && el != undefined){
        el.style.display = 'none';
    }
};

/**
 * показ элемента интерфейса
 * @param el элемент DOM
 */
I.showElem = function(el){
    console.log(el);
    if (el != null && el != undefined){
        el.style.display = 'block';
    }
};

/**
 * управление состоянием чата (true-включен, false-выключен)
 * @param status
 */
I.chat_enable = function(status){
    I.CHAT_ENABLE = status;
    if (status){
        if (I.input.hasAttribute('disabled'))
            I.input.removeAttribute('disabled');
    }else{
        I.input.disabled = true;
    }
};

I.showLocalVideo = function(){
    if (I.CAPTURE_LOCAL_VIDEO){
        WRTC.showLocalVideo(I.local_video, function(msg){
            I.showNote(msg);
            var prev = document.getElementById('wrtc-mess');
            if (prev != null ) I.video_wrap.removeChild(prev);
            var p = document.createEvent('p');
            p.textContent = msg;p.id = 'wrtc-mess';
            p.innerText = msg;
            p.id = 'wrtc-mess';
            p.className = 'error';
            I.video_wrap.appendChild(p);
        });
    }else{
        WRTC.hideLocalVideo(I.local_video);
    }

};



