let readyPlayers = 0;
function listen(io) {
    const pongNameSpace = io.of('/pong'); // this helps incase on same server we have different namespaces, like different games
    pongNameSpace.on('connection', (socket) => {
        console.log('New client connected', socket.id);
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        socket.on('ready', () => {
            console.log('Client is ready', socket.id);
            readyPlayers++;
            if (readyPlayers % 2 === 0) {
                pongNameSpace.emit('startGame', socket.id); // will emit to all clients // passing id of the second player to be referee
            }
        });

        socket.on('paddleMove', ({xPosition}) => {
            console.log('Client moved paddle', xPosition);
            socket.broadcast.emit('opponentMove', xPosition); // will emit to all clients except the sender
        });

        socket.on('ballMove', (ballData) => {
            console.log('Client moved ball', ballData);
            socket.broadcast.emit('ballMove', ballData); // will emit to all clients except the sender
        });

        socket.on('disconnect', (reason) => { // when a player disconnects
            console.log('Client disconnected', socket.id, reason);
            readyPlayers--;
            pongNameSpace.emit('playerDisconnected', socket.id); // will emit to all clients
        });
    });
}

module.exports = {listen};