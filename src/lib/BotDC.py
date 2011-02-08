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
import threading

class EventsDC(object):
    """
        функций для обработки событий
    """
    def __init__(self):
        pass
    def MsgGlobal(self, nick, message):
        return
    def MsgGlobalToMe(self, nick, message):
        return
    def MsgPrivate(self, nick, message):
        return
    def close(self):
        pass
    def MyINFO(self, data):
        return
    def OpList(self, data):
        return
    def NickList(self, data):
        return

class pydcbot(threading.Thread):
    def __init__(self, config, EventsObject):
        threading.Thread.__init__(self)
        self.EventsDC = EventsObject
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

    def dispatch(self, message):
        if not message:
            print "Error: not message"
            self.close()
        datalist = message.split()
        
        if self.debugflag == 1:
            print "DEBUG:" + message


        if message[0] == '<': #обращение в глобальном чате
            if datalist[1] == self.config['nick'] + ':':
                try:
                    self.EventsDC.MsgGlobalToMe(unicode(message.split(' ',1)[0][1:-1], self.config['coding_hub']), unicode(message.split(' ',1)[1], self.config['coding_hub']))
                except:
                    print "Error: MsgGlobalToMe"

        if message[0] == '<': #сообщение в глобальном чате
            try:
                self.EventsDC.MsgGlobal(unicode(message.split(' ',1)[0][1:-1], self.config['coding_hub']), unicode(message.split(' ',1)[1], self.config['coding_hub']))
            except:
                print "Error: MsgGlobal"

        if (datalist[0] == '$To:') and (datalist[1] == self.config['nick']): #личное сообщение
            try:
                print ("*****:",(unicode(datalist[3], self.config['coding_hub']), unicode(message.split(' ', 5)[5], self.config['coding_hub'])))
                self.EventsDC.MsgPrivate(unicode(datalist[3], self.config['coding_hub']), unicode(message.split(' ', 5)[5], self.config['coding_hub']))
            except:
                print "Error: MsgPrivate: ", sys.exc_info()[0]
            pass

        try:
            if datalist[0] == '$MyINFO': #получение информаций о юзере
                self.EventsDC.MyINFO(unicode(message, self.config['coding_hub']))
        except:
            print "Error: MyINFO"

        try:
            if datalist[0] == '$OpList': #получение информаций о юзере
                self.EventsDC.OpList(unicode(datalist[1], self.config['coding_hub']))
        except:
            print "Error: OpList"

        try:
            if datalist[0] == '$NickList': #получение информаций о юзере
                self.EventsDC.NickList(unicode(datalist[1], self.config['coding_hub']))
        except:
            print 'Error: NickList'

        if datalist[0] == '$Lock':
            self.s.send('$Key ' + self.lock2key2(datalist[1]) + '|')
            self.s.send('$ValidateNick ' + self.config['nick'] + '|')
            print 'Key & ValidateNick sent'
        
        if  ((datalist[0] == '$Hello') and (datalist[1] == self.config['nick'])):
            self.loggedon = 1
            print 'Login complete ;) sending MyINFO'
            self.GetNickList()

            self.s.send('$MyINFO $ALL ' + self.config['nick']
                        + ' code.google.com/p/python-dc-bot/$ $100$yurtaev.egor@gmail.com$' + '1200000000000' + '$|')
        
        if datalist[0] == '$GetPass':
            self.s.send('$MyPass ' + self.config['password'] + '|')

    def sendmessage(self, text):
        if self.debugflag == 1:
            print time.strftime("%Y-%m-%d %H:%M:%S") + ' -> message say: ' + text.encode("cp1251")
        try:
            self.s.send('<' + self.config['nick'] + '> ' + text.encode(self.config['coding_hub']) + '|')
        except:
            print "Error: sendmessage"

    def send_privat_message(self, nick, text):
        if self.debugflag == 1:
            print time.strftime("%Y-%m-%d %H:%M:%S") + ' -> message privat say: ' + text.encode("cp1251")
        try:
            self.s.send('$To: ' + nick + ' From: '+self.config['nick']+' $<' + self.config['nick'] + '> ' + text.encode(self.config['coding_hub']) + '|')
        except:
            print "Error: send_privat_message"

    def GetNickList(self):
        try:
            self.s.send('$GetNickList |')
        except:
            print "Error: GetNickList"

    def run(self):
        try:
            self.connect(self.s)
        except:
            print ("Error: Connect to " + self.config["host"] + ":" + str(self.config["port"]))
            self.close()
        while self.flag == 1:
            try:
                self.dispatch(self.getsocketdata(self.s))
            except:
                print "Error: dispatch"
                self.close()

    def close(self):
        print "Close"
        self.flag = 0
        self.s.close()
        self.EventsDC.close()
