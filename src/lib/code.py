# -*- coding:utf-8 -*-

import json, time
import BotDC

global thread_dic
thread_dic = {}

config = {
    'host': '91.144.171.226', # 91.144.171.226 dc.omzona.ru
    'port': 8889,#411,
    'nick': 'LogBot', #'killnews',
    'password': 'qwerty123',
    'coding_hub': 'cp1251'
}

class EventsDC(BotDC.EventsDC):
    def __init__(self,name):
        self.name = name
        
    def MsgGlobal(self, nick, message):
        dic = {"cmd":"MsgGlobal", "data":{"nick": nick, "text":message, "time":time.strftime("%H:%M:%S"), "data":time.strftime("%Y-%m-%d")}}
        data = json.dumps(dic)
        
        for user in thread_dic[str(self.name)][1]:
            user.write_message(data)

    def MsgPrivate(self, nick, message):
        dic = {"cmd":"MsgPrivat", "data":{"nick": nick, "text":message, "time":time.strftime("%H:%M:%S"), "data":time.strftime("%Y-%m-%d")}}
        data = json.dumps(dic)
#        for user in thread_dic[str(self.name)][1]:
#            user.write_message(data)
        for user in thread_dic[str(nick)][1]:
            user.write_message(data)
    
    def close(self):
        data = json.dumps({"cmd":"close"})
        try:
            for user in thread_dic[str(self.name)][1]:
                user.write_message(data)
                user.close()
        except:
            pass

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
        thread_dic[str(name)][0].sendmessage(text)

    def send_privat(self, name, nick, text):
        thread_dic[str(name)][0].send_privat_message(nick, text)
    
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

