const express = require("express");
const app = express();
const expressWs = require("express-ws")(app, null, {
    wsOptions: {
        clientTracking: true
    }
});

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

let members = [];

app.ws("/", (ws, request) => {
    const webSocketServer = expressWs.getWss();

    ws.on("message", message => {
        console.log("received", message);

        const messageObject = JSON.parse(message);

        switch (messageObject.payload.action) {
            case "addMember":
                console.log("addMember", messageObject.payload.name);
                members.push(messageObject.payload.name)
                console.log("current members:", members);

                webSocketServer.clients.forEach(client => {
                    client.send(`{"origin": "web-socket-server", "payload": {"members": [${JSON.stringify(members)}}]`);
                });

                break;
        }
    });
});
