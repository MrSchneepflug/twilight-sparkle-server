const _ = require("lodash");

class Server {
  constructor(webSocketServer, store) {
    this.webSocketServer = webSocketServer;
    this.store = store;

    webSocketServer.on("connection", client => {
      client.id = store.getState().nextClientId;
    });
  }

  broadcastState() {
    const messageObject = {
      origin: "web-socket-server",
      action: "update",
      state: this.store.getState().clients
    };

    const message = JSON.stringify(messageObject);
    console.log(`broadcasting ${message}`);

    this.webSocketServer.clients.forEach(client => client.send(message));
  }
}

module.exports = Server;
