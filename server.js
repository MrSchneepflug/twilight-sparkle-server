const express = require("express");
const SocketServer = require("ws").Server;
const path = require("path");

const PORT = process.env.port || 3000;
const INDEX = path.join(__dirname, "public/tv_index.html"); // determine by user-agent

const server = express();

server.get("/", (request, response) => {
    response.send("test");
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

//    .use((request, response) => response.sendFile(INDEX))
//    .listen(PORT, () => console.log(`listening on port ${PORT}`));

const webSocketServer = new SocketServer({server});

webSocketServer.on("connection", webSocket => {
    console.log("client connected");
    webSocket.on("close", () => console.log("client disconnected"));
});

setInterval(() => {
    webSocketServer.clients.forEach(client => {
        client.send(new Date().toTimeString());
    });
});
