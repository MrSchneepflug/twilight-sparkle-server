const WebSocket = require("ws");
const colors = require("colors/safe");

const Server = require("./src/Server");
const store = require("./src/store");

const {
  initializeClient,
  removeClient,
  selectDeveloper,
  selectEstimation
} = require("./src/actions");

const webSocketServer = new WebSocket.Server({
  port: process.env.port || 5000
});

const server = new Server(webSocketServer, store);

webSocketServer.on("connection", ws => {
  ws.on("close", (code, reason) => {
    console.log(`${ws.id} closed the connection with code: ${code} and reason: ${reason}`);
    store.dispatch(removeClient(ws.id));
    server.broadcastState();
  });

  ws.on("message", message => {
    const messageObject = JSON.parse(message);
    const payload = messageObject.payload;

    logMessage(ws.id, messageObject);

    switch (payload.action) {
      case "initialize":
        store.dispatch(initializeClient(ws.id));
        break;
      case "requestUpdate":
        break;
      case "selectDeveloper":
        store.dispatch(selectDeveloper(ws.id, payload.name));
        break;
      case "resetDeveloperSelection":
        store.dispatch(selectDeveloper(ws.id, null));
        break;
      case "selectEstimation":
        store.dispatch(selectEstimation(ws.id, payload.estimation));
        break;
    }

    logCurrentState(store.getState());

    server.broadcastState();
  });

  ws.on("error", error => {
    console.error(error);
  });
});

function logMessage(id, messageObject) {
  const actionMap = {
    initialize: colors.green("initialize"),
    requestUpdate: colors.blue("requestUpdate"),
    selectDeveloper: colors.yellow("selectDeveloper"),
    resetDeveloperSelection: colors.yellow("resetDeveloperSelection"),
    selectEstimation: colors.magenta("selectEstimation")
  };

  const client = colors.white(`client ${id ? `#${id} ` : ""}(${messageObject.origin}):`);
  console.log(`${client} ${actionMap[messageObject.payload.action]}`);
}

function logCurrentState(state) {
  const clients = state.clients;

  const developerList = clients.filter(client => client.developer !== null).map(client => {
    return colors.bold(`${client.developer} ${client.estimation ? `(${client.estimation})` : ""}`);
  }).join(", ");

  console.log(`-- next client-id: ${state.nextClientId}`);
  console.log(`-- connected clients: ${clients.length}`);
  console.log(`-- developers: ${developerList.length === 0 ? "none" : developerList}`);
}
