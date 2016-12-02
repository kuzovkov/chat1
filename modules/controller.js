/**
* модуль обработки http запросов к серверу
**/
var fs = require('fs');


/**
* обработчик GET запроса на '/'
**/
function index(req,res){
    var nicname = req.cookies.nicname;
    if ( nicname == undefined || nicname == 'undefined'){
        res.redirect('/choosenicname');
        res.end();
    }else{
        res.render('index', {nicname:nicname});
    }

}

/**
* обработчик GET запроса на '/choosenicname'
**/
function choosenicname(req, res){
    res.render('choosenicname');
}

function newUser(req,res){
    var nicname = req.body.nicname;
    global.sdata.addUser(nicname);
    res.cookie('nicname', nicname);
    res.redirect('/');
    res.end();

}

/**
* обработчик GET запроса на '/user/:id'
**/
function user(req, res){
    var location = req.params.id;
    setCookie(req,res);
    var lang = req.cookies.lang;
    if (lang == undefined) lang = 'ru';
    var dict = dicts[lang];
    var user_id = req.cookies.user_id;
    if ( global.sdata.games[location].users[user_id] == undefined ){
        res.render('join',{title:global.locations[location]['name'],dict:dict});
    }else{
        res.render('play',{title:global.locations[location]['name'], countries:global.locations[location]['countries'], dict:dict});
    }

}

/**
* установка cookie user_id если нет во входящем запросе
**/
function setCookie(req,res){
    var id = req.cookies.user_id;
    if ( id == undefined || id == 'undefined')
        res.cookie('user_id',global.helper.getRandomInt(100000000,200000000));
}



exports.index = index;
exports.user = user;
exports.choosenicname = choosenicname;
exports.newUser = newUser;

