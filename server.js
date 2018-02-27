const express = require("express");
const app = express();
const expressWs = require("express-ws")(app, null, {
  wsOptions: {
    clientTracking: true
  }
});
const _ = require("lodash");

const path = require("path");
const PORT = process.env.port || 5000;

app.use(express.static("public"));

app.get("/", (request, response) => {
  const isMobileDevice = request.headers["user-agent"].match(/Mobile/);
  const indexPath = isMobileDevice
    ? "public/mobile_index.html"
    : "public/tv_index.html";

  const INDEX = path.join(__dirname, indexPath);

  response.sendFile(INDEX);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});

const webSocketServer = expressWs.getWss();

const broadcast = (payload) => {
  const message = JSON.stringify(payload);

  console.log("--> broadcasting", message);

  webSocketServer.clients.forEach(client => {
    client.send(message);
  });
};

const createMessage = (action, payload = {})  => {
  return {
    origin: "web-socket-server",
    action,
    payload: {
      ...payload
    }
  };
};

let state = {};

function heartbeat() {
  console.log("client is alive ...");
  this.isAlive = true;
}

webSocketServer.on("connection", client => {
  client.isAlive = true;
  client.on("pong", heartbeat);
});

const interval = setInterval(() => {
  webSocketServer.clients.forEach(client => {
    if (client.isAlive === false) {
      return client.terminate();
    }

    client.isAlive = false;
    client.ping(() => {});
  });
}, 1000);

app.ws("/", (ws, request) => {
  ws.on("message", message => {
    console.log("receiving", message);

    const messageObject = JSON.parse(message);
    const payload = messageObject.payload;

    switch (payload.action) {
      case "requestUpdate":
        broadcast(createMessage("update", { state }));
        break;
      case "selectDeveloper":
        state[payload.name] = null;
        broadcast(createMessage("update", { state }));
        break;
      case "resetDeveloperSelection":
        delete state[payload.name];
        broadcast(createMessage("update", { state }));
        break;
      case "selectEstimation":
        state[payload.name] = payload.estimation;
        broadcast(createMessage("update", { state }));
        break;
      case "reset":
        state = {};
        broadcast(createMessage("reset"));
        break;
    }

    console.log("--> current state:", state);
  });
});
