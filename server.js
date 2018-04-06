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

const {
  logMessage,
  logCurrentState
} = require("./src/logging");

const webSocketServer = new WebSocket.Server({
  port: process.env.port || 5000
});

const server = new Server(webSocketServer, store);

webSocketServer.on("connection", ws => {
  ws.on("close", (code, reason) => {
    console.log(colors.red(`${ws.id ? `#${ws.id}` : "client"} closed the connection ${reason ? `(reason: ${reason})` : ""}`));
    store.dispatch(removeClient(ws.id));
    server.broadcastState();
  });

  ws.on("message", message => {
    const messageObject = JSON.parse(message);
    const payload = messageObject.payload;

    logMessage(ws.id, messageObject);

    switch (payload.action) {
      case "initialize":
        ws.id = store.getState().nextClientId;
        store.dispatch(initializeClient(ws.id));
        break;
      case "requestState":
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
