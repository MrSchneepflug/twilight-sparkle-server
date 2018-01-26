const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);

const path = require("path");

const PORT = process.env.port || 5000;

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

app.ws("/", (ws, request) => {
    ws.on("message", message => {
        console.log("received", message);
    });
});
