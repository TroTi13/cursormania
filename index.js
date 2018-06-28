const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(__dirname + '/public'));

let sockets = [];

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    sockets.push(socket.id);

    io.emit('connected', {
        id: socket.id,
        sockets,
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        sockets = sockets.filter((s) => s.id !== socket.id);
        io.emit('disconnected', {
            id: socket.id,
        });
    });

    socket.on('move', (coordinates) => {
        // console.log('move', coordinates);
        io.emit('othermove', {
            ...coordinates,
            id: socket.id,
        });
    });
});

server.listen(3000, () => console.log('listening on *:3000'));