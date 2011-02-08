/**
 * Created by .
 * User: Yurtaev
 * Date: 05.02.11
 * Time: 0:58
 */

var chat = {
    'ws': null,

    'connect': function() {

        if (window.WebSocket) {

            chat.ws = new WebSocket("ws://yurtaev.homeip.net:8888/websocket");

            chat.ws.onopen = function() {
                chat.events.on_system_message('Connect');
            };

            chat.ws.onmessage = function(evt) {
                chat.cmd(jQuery.parseJSON(evt.data))
            };

            chat.ws.onclose = function() {
                chat.events.on_system_message('Disconnect')
            };

        } else {
            chat.events.on_system_message('Ваш браузер не поддерживается');
        };

    },

    'disconnect': function() {
        chat.ws.close();
    },

    'cmd': function(json){
        console.log(json)
    }
};

chat.option = {
    'url': 'ws://yurtaev.homeip.net:8888/websocket'
}

chat.events = {

    'on_global_message': function(json) {

    },

    'on_private_message': function(json) {

    },

    'on_userslist': function(json) {
        
    },

    'on_system_message': function(msg) {
        console.log(msg);
    }
};