const {createServer} = require('http');
const {Server} = require("socket.io");
const {listen} = require("./socket");
const apiServer = require("./api");


// passing express api to createServer
const httpServer = createServer(apiServer);

const socketServer = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
    console.log('Listening on port 8000')
});

listen(socketServer);
