/**
 * @author Yurtaev
 */

var store = new Ext.data.Store({
    reader: new Ext.data.JsonReader({
        root: 'data'
    }, [
        {name:'name'},
        {name:'last'}
    ])
});

var grid = new Ext.grid.GridPanel({
    anchor: '100% 100%',
    store: store,
    stripeRows: true,
    split: true,
    bbar: [{
        xtype: 'tbbutton',
        text: 'Обновить',
		disabled:'true',
        id: "btn_update",
        handler: function(){
            GetNickList();
        }
    }],
    columns:[
        {header:'Ник', dataIndex: 'name', sortable: true, width: 170}
    ]
});

var tabPanel = new Ext.TabPanel({
    activeTab: 0,
    //resizeTabs: true,
    //minTabWidth: 115,
    //tabWidth: 135,
    enableTabScroll: true,
    region: 'center',
    items: [{
        title: 'Main Chat',
        frame: 'true',
        xtype: "container",
        autoEl: "div",
        layout: "auto",
        id: 'main_log',
        cls: 'main_log'
    }, {
        title: 'Private msg',
        closable: true,
        html: '<div><p>Приватное сообщение</p></div>'
    }, {
        title: 'Хранительдлинный',
        closable: true,
        html: '<div><p>Приватное сообщение</p></div>'
    }]
});

formSend = {
    region: 'south',
    height: 40,
    layout: 'anchor',
    frame: 'true',
    id: 'formSend',
    disabled: 'True',
    items: [{
        xtype: 'textfield',
        id: 'formSend_textfield',
        anchor: '-87',
        listeners: {
			specialkey: function(f, e){
				if (e.getKey() == e.ENTER) {
					send();
				}
			}
		},
        style: {
            float: "left"
        }
    }, {
        text: 'Отправить',
        xtype: 'tbsplit',
        id: 'sendForm_btn_send',
        handler: function(){
            send();
        },
        menu: [{
            handler: function(){
                Ext.Msg.alert('Messages', ':-)');
            },
            text: ':-)'
        }, {
            handler: function(){
                Ext.Msg.alert('Messages', ':-(');
            },
            text: ':-('
        }, {
            handler: function(){
                Ext.Msg.alert('Messages', ':-P');
            },
            text: ':-P'
        }, {
            text: 'и т.д ...'
        }]
    }]
}

var topPanel = new Ext.Toolbar({
    height: 25,
    items: ['-', {
        xtype: 'tbbutton',
        id: 'btn_connect',
        handler: function(f){
            connect();
        },
        text: '&lt;Connect&gt;',
        cls: 'x-btn-text-icon',
        icon: 'static/icons/connect.png'
    }, '-', {
        xtype: 'tbbutton',
        text: '&lt;Disconnect&gt;',
		disabled:'true',
        handler: function(){
            disconnect();
        },
        id: 'btn_disconnect',
        cls: 'x-btn-text-icon',
        icon: 'static/icons/disconnect.png'
    }]
});


/*-----------------------------------------------------------------------------------*/

Ext.onReady(function(){
    var container = new Ext.Viewport({
        layout: 'border',
        items: [eastPanel, centerPanel, northPanel]
    });
});

eastPanel = {
    title: 'Список пользователей:',
    region: 'east',
    collapsible: true,
    split: true,
    margins: '0 0 0 0',
    cmargins: '0 0 0 5',
    width: 175,
    minSize: 100,
    maxSize: 250,
    layout:'anchor',
    items:[grid]
}

centerPanel = {
    region: 'center',
    margins: '0 0 0 0',
    cmargins: '0 5 0 0',
	layout: 'border',
	items:[tabPanel, formSend]
}

northPanel = {
	region:'north',
	//frame:'true',
	margins: '5 0 5 0',
    //cmargins: '10 10 10 10',
	height: 25,
	items:[topPanel]
}







function _addMsg(){
	json = {
		"cmd":"MsgGlobal",
		"data": {
			"nick":"yurtaev",
			"time":"16:05:17",
			"date":"08.12.2010",
			"text":"bla bla bla"
		}
	}
	$("#main_log").append('\
          <div class="msg">\
            <div class="msg_time">[23:11:45]</div>\
            <div class="msg_nick">&lt;yurtaev&gt;</div>\
            <div class="msg_text">test messages</div>\
          </div>\
          <div class="msg">\
            <div class="msg_time">[23:12:15]</div>\
            <div class="msg_nick">&lt;Хранитель&gt;</div>\
            <div class="msg_text">Поприветствуем нового зарегистрировавшегося пользователя ТеМнЫй_DеМоН_55_Regions!</div>\
          </div>\
          <div class="msg">\
            <div class="msg_time">[23:12:15]</div>\
            <div class="msg_nick">&lt;Хранительдлинный&gt;</div>\
            <div class="msg_text">Поприветствуем нового зарегистрировавшегося пользователя ТеМнЫй_DеМоН_55_Regions!</div>\
          </div>\
          <div class="msg">\
            <div class="msg_time">[23:11:45]</div>\
            <div class="msg_nick">&lt;yurtaev&gt;</div>\
            <div class="msg_text">test messages</div>\
          </div>\
          <div class="msg">\
            <div class="msg_time">[23:12:15]</div>\
            <div class="msg_nick">&lt;Хранитель&gt;</div>\
            <div class="msg_text">Поприветствуем нового зарегистрировавшегося пользователя ТеМнЫй_DеМоН_55_Regions!</div>\
          </div>\
          <div class="msg">\
            <div class="msg_time">['+json.data.time+']</div>\
            <div class="msg_nick">&lt;'+json.data.nick+'&gt;</div>\
            <div class="msg_text">'+json.data.text+'</div>\
          </div>');
		  //$("#main_log").stop(true, false).animate({ scrollTop: $("#main_log").scrollTop() }, "slow");
			var temp = document.getElementById('main_log').scrollHeight;
			$("#main_log").stop(true, false).animate({ scrollTop: temp }, "slow");
}