const _ = require("lodash");
const express = require("express");
const app = express();
const expressWs = require("express-ws")(app, null, {
  wsOptions: {
    clientTracking: true
  }
});

const Server = require("./src/Server");
const store = require("./src/store");

const initializeClient = require("./src/actions/initializeClient");
const removeClient = require("./src/actions/removeClient");
const setDeveloper = require("./src/actions/setDeveloper");
const setEstimation = require("./src/actions/setEstimation");

const path = require("path");
const PORT = process.env.port || 5000;

app.use(express.static("public"));

app.get("/", (request, response) => {
  const INDEX = path.join(__dirname, "public/index.html");
  response.sendFile(INDEX);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});

const webSocketServer = expressWs.getWss();
const server = new Server(webSocketServer, store);

app.ws("/", ws => {
  ws.on("close", (code, reason) => {
    console.log(`${ws.id} closed the connection with code: ${code} and reason: ${reason}`);
    store.dispatch(removeClient(ws.id));
    server.broadcastState();
  });

  ws.on("message", message => {
    console.log("receiving", message, " from client with id ", ws.id);

    const messageObject = JSON.parse(message);
    const payload = messageObject.payload;

    switch (payload.action) {
      case "initialize":
        store.dispatch(initializeClient(ws.id));
        break;
      case "requestUpdate":
        break;
      case "selectDeveloper":
        store.dispatch(setDeveloper(ws.id, payload.name));
        break;
      case "resetDeveloperSelection":
        store.dispatch(setDeveloper(ws.id, null));
        break;
      case "selectEstimation":
        store.dispatch(setEstimation(ws.id, payload.estimation));
        break;
    }

    server.broadcastState();
  });
});
