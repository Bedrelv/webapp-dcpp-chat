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

            chat.ws = new WebSocket(chat.option.url);

            chat.ws.onopen = function() {
                chat.events.on_system_message('Connect');
            };

            chat.ws.onmessage = function(evt) {
                chat.cmd(jQuery.parseJSON(evt.data))
            };

            chat.ws.onclose = function() {
                chat.events.on_system_message('Disconnect')
            };

            chat.ui.connect();

        } else {
            chat.events.on_system_message('Ваш браузер не поддерживается');
        }

    },

    'disconnect': function() {
        chat.ws.close();
        chat.ui.disconnect();
    },

    'cmd': function(json) {
        
        console.log(json);

        if (json.cmd == "MsgGlobal") {
            chat.ui.add_message(json);
        }

        if (json.cmd == "MsgPrivat") {
            chat.ui.add_message_privat(json);
        }

        if (json.cmd == "close") {
            chat.events.on_system_message('Сервер хаба упал...');
            chat.ui.disconnect();
        }

        if (json.cmd == "NickList") {
            chat.events.on_userslist(json);
        }
    },

    'send': function(json) {
        data = chat.stringify(json);
        chat.ws.send(data);
    },

    'get_userslist': function() {
        json = {
            'cmd': 'GetNickList'
        };
        chat.send(json);
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
        store.loadData(json);
    },

    'on_system_message': function(msg) {
        console.log(msg);
    }
};

chat.ui = {
    'add_message': function(json) {
        $("#main_log")
                .append($('<div/>', { class: 'msg'})
                    .append($('<div/>', { class: 'msg_time', text: '[' + json.data.time + ']'}))
                    .append($('<div/>', { class: 'msg_nick', text: '<' + json.data.nick + '>', dblclick: function() { chat.ui.add_nick($(this).text().slice(1, -1))}}))
                    .append($('<div/>', { class: 'msg_text', text: json.data.text}))
                );
        var temp = document.getElementById('main_log').scrollHeight;
        $("#main_log").stop(true, false).animate({ scrollTop: temp }, "slow");
    },

    'add_message_privat': function(json) {
        user = ''+json.data.from;
        
        if ($('#' + user).length == 0) {
            tabPanel.add({
                title: user,
                frame: 'true',
                closable: true,
                xtype: "container",
                autoEl: "div",
                layout: "auto",
                id: user,
                cls: 'main_log'
            });
            tabPanel.setActiveTab(user);
        };

        $("#"+user)
            .append($('<div/>', { class: 'msg'})
                .append($('<div/>', { class: 'msg_time', text: '[' + json.data.time + ']'}))
                .append($('<div/>', { class: 'msg_nick', text: '<' + json.data.nick + '>', dblclick: function() { chat.ui.add_nick($(this).text().slice(1, -1))}}))
                .append($('<div/>', { class: 'msg_text', text: json.data.text}))
            );
        var temp = document.getElementById(user).scrollHeight;
        $("#" + user).stop(true, false).animate({ scrollTop: temp }, "slow");
    },

    'on_dbclick_to_user': function(user) {
        //start a private chat
        if ($('#' + user).length == 0) {
            tabPanel.add({
                title: user,
                frame: 'true',
                closable: true,
                xtype: "container",
                autoEl: "div",
                layout: "auto",
                id: user,
                cls: 'main_log'
            });
            tabPanel.setActiveTab(user);
        } else {
            tabPanel.setActiveTab(user);
        }

    },

    'add_nick': function(nick) {
        $("#formSend_textfield").val(($("#formSend_textfield").val() + " " + nick + ": "));
        $("#formSend_textfield").focus();
    },

    'connect': function() {
        Ext.getCmp('btn_connect').disable();
        Ext.getCmp('btn_disconnect').enable();
        Ext.getCmp('formSend').enable();
        Ext.getCmp('btn_update').enable();
    },

    'disconnect': function() {
        Ext.getCmp('btn_disconnect').disable();
        Ext.getCmp('formSend').disable();
        Ext.getCmp('btn_connect').enable();
        Ext.getCmp('btn_update').disable();
    },

    'send': function() {
        active_tab = ''+tabPanel.getActiveTab().id;
        if ($('#formSend_textfield').val() == '') {
            chat.events.on_system_message('Сообщение не может быть пустым');
        }
        else {
            if (active_tab == 'main_log'){
                json = {
                    'cmd': 'MsgGlobal',
                    'data': {
                        'text': $("#formSend_textfield").val()
                    }
                };
                chat.send(json);
            } else {
                json = {
                    'cmd': 'MsgPrivat',
                    'data': {
                        'to': active_tab,
                        'text': $("#formSend_textfield").val()
                    }
                };
                chat.send(json);
            }
            $('#formSend_textfield').val('');
        }
    }
};