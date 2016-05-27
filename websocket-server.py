#!/usr/bin/env python3

from tornado.ioloop import IOLoop
from tornado.web import Application
from tornado.websocket import WebSocketHandler


class WSHandler(WebSocketHandler):

    def open(self):
        print('connection opened...')
        self.write_message("The server says: 'Hello'. Connection was accepted.")

    def on_message(self, message):
        self.write_message("The server says: " + message + " back at you")
        print('received:', message)

    def on_close(self):
        print('connection closed...')

if __name__ == "__main__":
    application = Application([
        (r'/ws', WSHandler),
    ])
    application.listen(9090)
    IOLoop.instance().start()
