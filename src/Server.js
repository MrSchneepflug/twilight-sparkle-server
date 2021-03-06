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

    this.webSocketServer.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(messageObject))
      }
    });
  }

  broadcastResetEstimation() {
    let messageObject = {
      origin: "web-socket-server",
      action: "resetEstimation"
    };

    this.webSocketServer.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(messageObject));
      }
    });
  }
}

module.exports = Server;
