/**
 * Created by .
 * User: Yurtaev
 * Date: 05.02.11
 * Time: 0:58
 */

var chat = {

    'ws': null,

    /* json object to string */
    'stringify': function(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    },

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
        }

    },

    'disconnect': function() {
        chat.ws.close();
    },

    'cmd': function(json) {
        console.log(json)
    },

    'send': function(json) {
        data = chat.stringify(json);
        chat.ws.send(data);
    }
    
};

chat.option = {
    'url': 'ws://yurtaev.homeip.net:8888/websocket'
};

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