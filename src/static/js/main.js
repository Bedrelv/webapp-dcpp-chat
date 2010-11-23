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
            ws.send("«Connect»");
            $('#status').removeClass('disconnected').addClass('connected').text('WebSocket is connected :)');
        };
        ws.onmessage = function (evt) {
            console.info(evt.data);
            var json = jQuery.parseJSON(evt.data);
            console.info(json.msg.text);
            $('<li/>').text("[" + json.msg.time + "]<"+json.msg.nick + ">: " + json.msg.text).appendTo('#log');
            $("body").stop(true, false).animate({
                scrollTop: $(document).height()
            }, "slow");
        };
        ws.onclose = function() {
            console.info("Connection closed...");
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
