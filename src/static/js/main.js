/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var ws = null;
function connect(){
    if (window.WebSocket){
        ws = new WebSocket("ws://yurtaev.homeip.net:8888/websocket");
        ws.onopen = function() {
            console.info("Connection open...");
            $.jGrowl('Connection open...', { life: 3000, header: 'System message:' });
            ws.send("«Connect»");
            $('#status').removeClass('disconnected').addClass('connected').text('WebSocket is connected :)');
        };
        ws.onmessage = function (evt) {
            console.info(evt.data);
            var json = jQuery.parseJSON(evt.data);
            cmd(json);
            /*$('<li/>').text("[" + json.data.time + "]<"+json.data.nick + ">: " + json.data.text).appendTo('#log');
            $("body").stop(true, false).animate({
                scrollTop: $(document).height()
            }, "slow");*/
        };
        ws.onclose = function() {
            console.info("Connection closed...");
            $.jGrowl('Connection closed...', { life: 3000, header: 'System message:' });
            disconnect()
        };
        document.getElementById("btn_connect").disabled = true;
        document.getElementById("btn_disconnect").disabled = false;
    } else {
        $('#chat').show();
    }
}
function disconnect(){
    ws.send("«Disconnect»");
    ws.close();
    document.getElementById("btn_connect").disabled = false;
    document.getElementById("btn_disconnect").disabled = true;
    $('#status').removeClass('connected').addClass('disconnected').text('WebSocket is disconnected :(');
}

function send(){
    ws.send($('#data').val());
    $('#data').val('');
}

function cmd(json){
    if (json.cmd == "MsgGlobal") { addMsg(json); }
    if (json.cmd == "close") { $.jGrowl('Server disconnect', { life: 3000, header: 'System message:' }); }
}

function addMsg(json) {
    $('<li/>').text("[" + json.data.time + "]<"+json.data.nick + ">: " + json.data.text).appendTo('#log');
    $("body").stop(true, false).animate({
        scrollTop: $(document).height()
    }, "slow");
    $.jGrowl(json.data.text, { life: 3000, header: json.data.nick + ':' });
}
