#!/usr/bin/env python3

from tornado.ioloop import IOLoop
from tornado.web import Application, RequestHandler, StaticFileHandler
from tornado.websocket import WebSocketHandler


class WSHandler(WebSocketHandler):

    def open(self):
        print('connection opened...')
        clients.append(self)
        self.write_message("The server says: 'Hello'. Connection was accepted.")

    def on_message(self, message):
        for client in clients:
            client.write_message("The server says: " + message + " back at you")
        print('received:', message)

    def on_close(self):
        print('connection closed...')
        clients.remove(self)


if __name__ == "__main__":
    settings = {
        "debug": True,
        "autoreload": True,
        "compiled_template_cache": False,
        "serve_traceback": True
    }
    application = Application([
        (r'/ws', WSHandler),
        (r'/(.*)', StaticFileHandler, {
            "path": "dist",
            "default_filename": "index.html",
        }),
    ], **settings)
    application.listen(8000)
    clients = []
    IOLoop.instance().start()
