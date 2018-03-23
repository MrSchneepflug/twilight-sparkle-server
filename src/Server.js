const _ = require("lodash");

class Server {
  constructor(webSocketServer, store) {
    this.webSocketServer = webSocketServer;
    this.store = store;
  }

  broadcastState() {
    const messageObject = {
      origin: "web-socket-server",
      action: "update",
      state: this.store.getState().clients
    };

    this.webSocketServer.clients.forEach(client => client.send(JSON.stringify(messageObject)));
  }
}

module.exports = Server;
