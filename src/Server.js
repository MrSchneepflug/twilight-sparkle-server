const _ = require("lodash");

let id = 0;

class Server {
  constructor(webSocketServer, store) {
    this.webSocketServer = webSocketServer;
    this.store = store;

    webSocketServer.on("connection", client => {
      client.id = ++id;
    });
  }

  broadcastState() {
    const messageObject = {
      origin: "web-socket-server",
      action: "update",
      state: this.store.getState()
    };

    const message = JSON.stringify(messageObject);
    console.log(`broadcasting ${message}`);

    this.webSocketServer.clients.forEach(client => client.send(message));
  }
}

module.exports = Server;
