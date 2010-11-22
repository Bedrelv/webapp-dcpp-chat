# -*- coding:utf8 -*-

"""
    Copyright 2010 Yurtaev Egor

    This file is part of python-dc-bot.

    python-dc-bot is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    python-dc-bot is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with python-dc-bot. If not, see http://www.gnu.org/licenses/.
"""

import array
import socket
import sys
import time
#import sqlite3
import threading

#c = sqlite3.connect(database="dbChat.sqlite") # открываем базу данных
#cu = c.cursor() # выставляем курсор

class EventsDC(object):
    """
        функций для обработки событий
    """
    def MsgGlobal(self, nick, message):
        pass
    def MsgGlobalToMe(self, nick, message):
        pass
    def MsgPrivate(self, nick, message):
        pass
    def NickList(self, list):
        pass

class pydcbot(threading.Thread):
    def __init__(self, config, eventsdc):
        threading.Thread.__init__(self)
        self.EventsDC = eventsdc
        self.config = config
        self.debugflag = 0
        self.loggedon = (0)
        self.flag = 1
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def getsocketdata(self, somesocket):
        buff = ""
        counter = 0
        somesocket.settimeout(0.13)
        while True:
            try:
                while True:
                    counter += 1
                    t = somesocket.recv(1)
                    if t != '|': buff += t
                    else: return buff
                    if counter >= 4096: return buff
            except socket.timeout:
                pass    # Проверяем, не нужно ли завершить цикл?
            except socket.error, msg:
                return    # Обрабатываем ошибку сокета
        # Здесь в buff будет целый пакет, делаем с ним много всякого полезного...
        return buff
    
    def lock2key2(self, lock):
    #"Generates response to $Lock challenge from Direct Connect Servers"
        lock = array.array('B', lock)
        ll = len(lock)
        key = list('0' * ll)
        for n in xrange(1, ll):
            key[n] = lock[n] ^ lock[n-1]
        key[0] = lock[0] ^ lock[-1] ^ lock[-2] ^ 5
        for n in xrange(ll):
            key[n] = ((key[n] << 4) | (key[n] >> 4)) & 255
        result = ""
        for c in key:
            if c in (0, 5, 36, 96, 124, 126):
                result += "/%%DCN%.3i%%/" % c
            else:
                result += chr(c)
        return result
        "Generates response to $Lock challenge from Direct Connect Servers"
        lock = array.array('B', lock)
        ll = len(lock)
        key = list('0' * ll)
        for n in xrange(1, ll):
            key[n] = lock[n] ^ lock[n-1]
        key[0] = lock[0] ^ lock[-1] ^ lock[-2] ^ 5
        for n in xrange(ll):
            key[n] = ((key[n] << 4) | (key[n] >> 4)) & 255
        result = ""
        for c in key:
            if c in (0, 5, 36, 96, 124, 126):
                result += "/%%DCN%.3i%%/" % c
            else:
                result += chr(c)
        return result
    def connect(self, socket):
        self.s.connect((self.config['host'], self.config['port']))
        return
    def dispatch(self, message):
        if not message:
            print "not message"
            self.close()
        datalist = message.split();
        
        if self.debugflag == 1:
            print "DEBUG:" + message


        if message[0] == '<': #обращение в глобальном чате
            #if datalist[1] == self.config['nick'] + ':':
            if message.split(' ',1)[1] == self.config['nick'] + ':':
                self.EventsDC.MsgGlobalToMe(unicode(message.split(' ',1)[0][1:-1], self.config['coding_hub']), unicode(message.split(' ',1)[1], self.config['coding_hub']))

        if message[0] == '<': #сообщение в глобальном чате
            self.EventsDC.MsgGlobal(unicode(message.split(' ',1)[0][1:-1], self.config['coding_hub']), unicode(message.split(' ',1)[1], self.config['coding_hub']))
            self.s.send('$GetNickList|')

        if (datalist[0] == '$To:') and (datalist[1] == self.config['nick']): #личное сообщение
            self.EventsDC.MsgPrivate(unicode(datalist[3], self.config['coding_hub']), unicode(message.split(' ', 5)[5], self.config['coding_hub']))
            pass

        if datalist[0] == '$NickList': #получение списка юзеров хаба
            self.EventsDC.NickList(unicode(datalist[1], self.config['coding_hub']))

        if datalist[0] == '$Lock':
            self.s.send('$Key ' + self.lock2key2(datalist[1]) + '|')
            self.s.send('$ValidateNick ' + self.config['nick'] + '|')
            print 'Key & ValidateNick sent'
        
        if  ((datalist[0] == '$Hello') and (datalist[1] == self.config['nick'])):
            self.loggedon = 1
            print 'Login complete ;) sending MyINFO'

            self.s.send('$MyINFO $ALL ' + self.config['nick']
                        + ' code.google.com/p/python-dc-bot/$ $100$yurtaev.egor@gmail.com$' + '1200000000000' + '$|')
        
        if datalist[0] == '$GetPass':
            self.s.send('$MyPass ' + self.config['password'] + '|')
        
        return

    def sendmessage(self, text):
        print time.strftime("%Y-%m-%d %H:%M:%S") + ' -> message say: ' + text.encode("cp1251")
        self.s.send('<' + self.config['nick'] + '> ' + text.encode(self.config['coding_hub']) + '|')
        return

    def run(self):
        self.connect(self.s)
        while self.flag == 1:
            self.dispatch(self.getsocketdata(self.s))
        sys.exit(0)
	return
    def close(self):
        self.flag = 0


#config = {
#    'host': '91.144.171.226',# 91.144.171.226 dc.omzona.ru
#    'port': 411,
#    'nick': 'LogBot',#'killnews',
#    'password': 'qwerty123',
#    'coding_hub': 'cp1251'
#}
#
#pydcbot(config, EventsDC()).start()
#c.close()