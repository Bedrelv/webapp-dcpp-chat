# -*- coding:utf8 -*-

"""
    комментарий
"""

import os

import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.websocket
from lib import BotLogDC
from lib import code

LISTENERS = []

class EventsDC(BotLogDC.EventsDC):
    def MsgGlobal(self, nick, message):
        for element in LISTENERS:
            element.write_message(nick + " => " + message)
        pass

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("first_name")

class IndexMsgHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class ChatMsgHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        uid = self.get_secure_cookie("uid")
        avatar_mini = self.get_secure_cookie("photo_rec")
        self.render("chat.html", uid=uid, avatar_mini=avatar_mini)

class LoginMsgHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("login.html")

class AuthMsgHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_secure_cookie("uid", self.get_argument("uid"))
        self.set_secure_cookie("first_name", self.get_argument("first_name").encode("utf8"))
        self.set_secure_cookie("last_name", self.get_argument("last_name").encode("utf8"))
        self.set_secure_cookie("photo", self.get_argument("photo"))
        self.set_secure_cookie("photo_rec", self.get_argument("photo_rec"))
        self.set_secure_cookie("hash", self.get_argument("hash"))
        self.redirect("/")
        pass

class WebsocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print "Connect " + self.request.remote_ip + " uid: " + self.get_secure_cookie("uid")
        LISTENERS.append(self)
        bots.create_user(self.get_secure_cookie("uid"))

    def on_message(self, message):
#        for element in LISTENERS:
#            element.write_message(self.request.remote_ip + " => " + message)
        bots.send(self.get_secure_cookie("uid"), message)

    def on_close(self):
        print "Disconnect " + self.request.remote_ip
        bots.close(self.get_secure_cookie("uid"))
        LISTENERS.remove(self)


settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    "cookie_secret": "91oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
    "login_url": "/login",
}

application = tornado.web.Application([
                                      (r'/', IndexMsgHandler),
                                      (r'/chat', ChatMsgHandler),
                                      (r'/login', LoginMsgHandler),
                                      (r'/auth/', AuthMsgHandler),
                                      (r'/websocket', WebsocketHandler),
                                      ], **settings)

bots = code.BotThread(EventsDC())


if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888, address = "yurtaev.homeip.net")
    tornado.ioloop.IOLoop.instance().start()