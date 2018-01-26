const express = require("express");
const SocketServer = require("ws").Server;
const path = require("path");

const PORT = process.env.port || 3000;

const server = express();

server.get("/", (request, response) => {
    const isMobileDevice = request.headers["user-agent"].match(/Mobile/);
    const indexPath = isMobileDevice
        ? "public/mobile_index.html"
        : "public/tv_index.html";

    const INDEX = path.join(__dirname, indexPath);

    response.sendFile(INDEX);
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

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
