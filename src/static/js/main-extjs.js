/**
 * @author Yurtaev
 */

var ws = null;
function connect() {
    if (window.WebSocket) {
        ws = new WebSocket("ws://yurtaev.homeip.net:8888/websocket");
        ws.onopen = function() {
            console.info("Connection open...");
            $.jGrowl('Connection open...', { life: 3000, header: 'System message:' });
            ws.send('{"cmd":"«Connect»"}');
            $('#status').removeClass('disconnected').addClass('connected').text('WebSocket is connected :)');
        };
        ws.onmessage = function (evt) {
            var json = jQuery.parseJSON(evt.data);
            cmd(json);
        };
        ws.onclose = function() {
            console.info("Connection closed...");
            $.jGrowl('Connection closed...', { life: 3000, header: 'System message:' });
            disconnect()
        };
        Ext.getCmp('btn_connect').disable();
        Ext.getCmp('btn_disconnect').enable();
        Ext.getCmp('formSend').enable();
        Ext.getCmp('btn_update').enable();
    } else {
        Ext.Msg.alert('System massege', 'Ваш браузер не поддерживается...');
    }
}
function disconnect() {
    ws.send('{"cmd":"«Disconnect»"');
    ws.close();
    Ext.getCmp('btn_disconnect').disable();
    Ext.getCmp('formSend').disable();
    Ext.getCmp('btn_connect').enable();
    Ext.getCmp('btn_update').disable();
    $('#status').removeClass('connected').addClass('disconnected').text('WebSocket is disconnected :(');
}

function send() {
    if ($('#formSend_textfield').val() == '') {
        Ext.Msg.alert('Messages', 'Сообщение не может быть пустым...');
    }
    else {
        data = ('{"cmd": "MsgGlobal", "data": {"text": "' + $("#formSend_textfield").val() + '"}}')
        ws.send(data);
        $('#formSend_textfield').val('');
    }

}

function cmd(json) {
    if (json.cmd == "MsgGlobal") {
        addMsg(json);
    }
    if (json.cmd == "close") {
        $.jGrowl('Server disconnect', {
            life: 3000,
            header: 'System message:'
        });
        Ext.Msg.alert('Messages', 'Сервер хаба упал...');
    }
    if (json.cmd == "NickList") {
        console.log(json.data);
        store.loadData(json);

    }
}

function GetNickList(){
    data = ('{"cmd": "GetNickList"}')
    ws.send(data);
}

function addMsg(json) {
    $.jGrowl(json.data.text, { life: 3000, header: json.data.nick + ':' });
    $("#main_log")
            .append($('<div/>', { class: 'msg'})
            .append($('<div/>', { class: 'msg_time', text: '[' + json.data.time + ']'}))
            .append($('<div/>', { class: 'msg_nick', text: '<' + json.data.nick + '>', dblclick: function(){addNick($(this).text().slice(1,-1))}}))
            .append($('<div/>', { class: 'msg_text', text: json.data.text}))
            );
    var temp = document.getElementById('main_log').scrollHeight;
    $("#main_log").stop(true, false).animate({ scrollTop: temp }, "slow");
}

function addNick(nick){
    $("#formSend_textfield").val(($("#formSend_textfield").val() + " " + nick + ": "));
    $("#formSend_textfield").focus();
}
