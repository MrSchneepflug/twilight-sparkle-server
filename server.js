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

// state = {
//     JJ: null,
//     ML: 13
// }

let state = {};

const broadcastState = () => {
    // `{"origin": "web-socket-server", "action": "setNumbers", "payload": {"numbers": ${JSON.stringify(numbers)}}}`;
    const broadcastPayload = {
        origin: "web-socket-server",
        action: "setState",
        state
    };

    const message = JSON.stringify(broadcastPayload);

    console.log("broadcasting", message);

    webSocketServer.clients.forEach(client => {
        client.send(message);
    });
};

app.ws("/", (ws, request) => {
    ws.on("message", message => {
        console.log("received", message);

        const messageObject = JSON.parse(message);

        switch (messageObject.payload.action) {
            case "addMember":
                console.log("addMember", messageObject.payload.name);

                if (_.has(state, messageObject.payload.name)) {
                    break;
                }

                state[messageObject.payload.name] = null;

                console.log("current state:", state);
                broadcastState();

                break;
            case "setNumber":
                console.log("setNumber", messageObject.payload.number, "name", messageObject.payload.number);

                state[messageObject.payload.name] = messageObject.payload.number;

                console.log("current state:", state);
                broadcastState();
        }
    });
});
