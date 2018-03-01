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

const {
  initializeClient,
  removeClient,
  selectDeveloper,
  selectEstimation
} = require("./src/actions");

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
        store.dispatch(selectDeveloper(ws.id, payload.name));
        break;
      case "resetDeveloperSelection":
        store.dispatch(selectDeveloper(ws.id, null));
        break;
      case "selectEstimation":
        store.dispatch(selectEstimation(ws.id, payload.estimation));
        break;
    }

    server.broadcastState();
  });
});
