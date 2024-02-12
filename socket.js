let readyPlayers = 0;
function listen(io) {
    const pongNameSpace = io.of('/pong'); // this helps incase on same server we have different namespaces, like different games
    let room;
    pongNameSpace.on('connection', (socket) => {
        console.log('New client connected', socket.id);
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        socket.on('ready', () => {
            room = 'room' + Math.floor(readyPlayers / 2); // room0, room1, room2, etc
            socket.join(room);
            console.log('Client is ready', socket.id);
            readyPlayers++;
            if (readyPlayers % 2 === 0) {
                pongNameSpace.in(room).emit('startGame', socket.id); // will emit to all clients // passing id of the second player to be referee
            }
        });

        socket.on('paddleMove', ({xPosition}) => {
            console.log('Client moved paddle', xPosition);
            socket.to(room).broadcast.emit('opponentMove', xPosition); // will emit to all clients except the sender
        });

        socket.on('ballMove', (ballData) => {
            console.log('Client moved ball', ballData);
            socket.to(room).broadcast.emit('ballMove', ballData); // will emit to all clients except the sender
        });

        socket.on('disconnect', (reason) => { // when a player disconnects
            console.log('Client disconnected', socket.id, reason);
            socket.leave(room);
            pongNameSpace.in(room).emit('playerDisconnected', socket.id); // will emit to all clients
        });
    });
}

module.exports = {listen};