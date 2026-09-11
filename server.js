const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

const server = new WebSocket.Server({
    port: PORT
});

const players = {};

server.on("connection", (socket) => {

    const id = Math.random()
        .toString(36)
        .substring(2, 9);

    players[id] = {
        x: 0,
        y: 0,
        z: 0
    };

    socket.send(JSON.stringify({
        type: "welcome",
        id: id
    }));

    socket.on("message", (message) => {

        try {
            const data = JSON.parse(message);

            if (data.type === "position") {

                players[id] = {
                    x: data.x,
                    y: data.y,
                    z: data.z
                };

            }

        } catch (error) {
            console.log("Invalid message");
        }

    });

    socket.on("close", () => {
        delete players[id];
    });

});

setInterval(() => {

    const message = JSON.stringify({
        type: "players",
        players: players
    });

    server.clients.forEach((client) => {

        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }

    });

}, 50);

console.log("Moscow Apocalypse server started");
