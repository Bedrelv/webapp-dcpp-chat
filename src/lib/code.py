# -*- coding:utf-8 -*-

import BotLogDC

global thread_dic
thread_dic = {}

config = {
    'host': '91.144.171.226', # 91.144.171.226 dc.omzona.ru
    'port': 411,
    'nick': 'LogBot', #'killnews',
    'password': 'qwerty123',
    'coding_hub': 'cp1251'
}

class BotThread:
    def __init__(self, eventsdc):
        self.eventsdc = eventsdc
        pass
    def create_user(self, name):
        if not name in thread_dic:
            config['nick'] = name
            thread_dic[str(name)] = [BotLogDC.pydcbot(config, self.eventsdc), 1]
            thread_dic[str(name)][0].start()
        else:
            thread_dic[str(name)][1] = thread_dic[str(name)][1] + 1
    def send(self, name, text):
        thread_dic[str(name)][0].sendmessage(text)
        print thread_dic[str(name)][1]
    def close(self, name):
        if thread_dic[str(name)][1] == 1:
            thread_dic[str(name)][0].close()
            del thread_dic[str(name)]
        else:
            thread_dic[str(name)][1] = thread_dic[str(name)][1] - 1

