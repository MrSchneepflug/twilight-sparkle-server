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

let estimationsByDeveloper = {};

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

// const VALID_ACTIONS = [
//   "setEstimationsByDeveloper",
//   "reset"
// ];

// const exampleMessage = {
//   origin: "web-socket-server",
//   action: "setEstimationsByDeveloper",
//   payload: {
//     estimationsByDeveloper: {
//       JJ: null,
//       TK: 13
//     },
//     additionalPayload: {
//       [...]
//     }
//   }
// };

app.ws("/", (ws, request) => {
  ws.on("message", message => {
    console.log("receiving", message);

    const messageObject = JSON.parse(message);

    switch (messageObject.payload.action) {
      case "selectDeveloper":
        estimationsByDeveloper[messageObject.payload.name] = null;
        broadcast(createMessage("setEstimationsByDeveloper", { estimationsByDeveloper }));
        break;
      case "resetDeveloperSelection":
        delete estimationsByDeveloper[messageObject.payload.name];
        broadcast(createMessage("setEstimationsByDeveloper", { estimationsByDeveloper }));
        break;
      case "selectEstimation":
        estimationsByDeveloper[messageObject.payload.name] = messageObject.payload.estimation;
        broadcast(createMessage("setEstimationsByDeveloper", { estimationsByDeveloper }));
        break;
      case "reset":
        estimationsByDeveloper = {};
        broadcast(createMessage("reset"));
        break;
    }

    console.log("--> current state:", estimationsByDeveloper);
  });
});
