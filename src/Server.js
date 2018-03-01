const _ = require("lodash");

let id = 0;

class Server {
  constructor(webSocketServer) {
    this.state = [];
    this.webSocketServer = webSocketServer;

    webSocketServer.on("connection", client => {
      client.id = ++id;
    });
  }

  initializeClient(id) {
    this.state.push({
      id,
      developer: null,
      estimation: null
    });
  }

  removeClient(id) {
    _.remove(this.state, client => client.id === id)
  }

  getClientById(id) {
    return _.find(this.state, client => client.id === id);
  }

  setDeveloper(id, developer) {
    let client = this.getClientById(id);
    client.developer = developer;
  }

  setEstimation(id, estimation) {
    let client = this.getClientById(id);
    client.estimation = estimation;
  }

  broadcastState() {
    const messageObject = {
      origin: "web-socket-server",
      action: "update",
      state: this.state
    };

    const message = JSON.stringify(messageObject);
    console.log(`broadcasting ${message}`);

    this.webSocketServer.clients.forEach(client => client.send(message));
  }
}

module.exports = Server;
