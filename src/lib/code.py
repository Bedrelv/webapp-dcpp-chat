# -*- coding:utf-8 -*-

import json, time, urllib
import BotDC

global thread_dic
thread_dic = {}

config = {
    'host': '91.144.171.226', # 91.144.171.226 dc.omzona.ru
    'port': 411,
    'nick': 'LogBot', #'killnews',
    'password': 'qwerty123',
    'coding_hub': 'cp1251'
}

class EventsDC(BotDC.EventsDC):
    def __init__(self,name):
        self.name = name
        
    def MsgGlobal(self, nick, message):
        # экранирование
        #message = unicode(urllib.quote(str(message)), "utf8")
        #message = urllib.quote(str(message))
        # /экранирование
        dic = {"cmd":"MsgGlobal", "data":{"nick": nick, "text":message, "time":time.strftime("%H:%M:%S"), "data":time.strftime("%Y-%m-%d")}}
        data = json.dumps(dic)
        
        for user in thread_dic[str(self.name)][1]:
            user.write_message(data)
        pass
    
    def close(self):
        data = json.dumps({"cmd":"close"})
        """for user in thread_dic[str(self.name)][1]:
            user.write_message(data)
#            user.on_close()
            user.close()"""
        try:
            for user in thread_dic[str(self.name)][1]:
                user.write_message(data)
                user.close()
        except:
            pass
            #thread_dic[str(self.name)][1].remove(user)
        #bots.close(self.get_secure_cookie("uid"), self)
        #del thread_dic[str(self.name)]
    def NickList(self, data):
        try:
            temp = []
            for i in data.split("$$")[:-1]:
                temp.append({'name':i})
            dic = json.dumps({"cmd":"NickList", "data": temp})
            for user in thread_dic[str(self.name)][1]:
                user.write_message(dic)
        except:
            print "Error: EventsDC.NickList"
        

class BotThread:
    """
        класс для работы с ботами DC
    """
    def __init__(self):
        pass
    
    def create_user(self, name, wsuser):
        if not name in thread_dic.keys():
            config['nick'] = name
            thread_dic[str(name)] = [BotDC.pydcbot(config, EventsDC(name)), [wsuser]]
            thread_dic[str(name)][0].start()
        else:
            thread_dic[str(name)][1].append(wsuser)
    
    def send(self, name, text):
        # экранирование
        #text = unicode(urllib.unquote(str(text)), "utf-8")
        #text = urllib.unquote_plus(text)
        # /экранирование
        thread_dic[str(name)][0].sendmessage(text)
        #print len(thread_dic[str(name)][1])
        #print type(thread_dic[str(name)][1])
    
    def close(self, name, wsuser):
        if len(thread_dic[str(name)][1]) == 1:
            try:
                thread_dic[str(name)][0].close()
            except:
                print "Bot is off"
            del thread_dic[str(name)]
        else:
            (thread_dic[str(name)][1]).remove(wsuser)

    def GetNickList(self, name):
        try:
            thread_dic[str(name)][0].GetNickList()
        except:
            print "Error: BotThread.GetNickList"

