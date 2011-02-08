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
    bbar: [
        {
            xtype: 'tbbutton',
            text: 'Обновить',
            disabled:'true',
            id: "btn_update",
            handler: function() {
                chat.get_userslist();
            }
        }
    ],
    columns:[
        {header:'Ник', dataIndex: 'name', sortable: true, width: 160}
    ]
});

var tabPanel = new Ext.TabPanel({
    activeTab: 0,
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
					chat.ui.send();
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
            chat.ui.send();
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
            chat.connect();
        },
        text: '&lt;Connect&gt;',
        cls: 'x-btn-text-icon',
        icon: 'static/icons/connect.png'
    }, '-', {
        xtype: 'tbbutton',
        text: '&lt;Disconnect&gt;',
		disabled:'true',
        handler: function(){
            chat.disconnect();
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
	margins: '5 0 5 0',
	height: 25,
	items:[topPanel]
}
