const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(__dirname + '/public'));

var sockets = [];

io.on('connection', function (socket) {
    console.log('a user connected', socket.id);

    sockets.push(socket.id);

    io.emit('connected', {
        id: socket.id,
        sockets: sockets,
    });

    socket.on('disconnect', function () {
        console.log('user disconnected', socket.id);
        sockets = sockets.filter(function(s) { return s.id !== socket.id; });
        io.emit('disconnected', {
            id: socket.id,
        });
    });

    socket.on('move', function (coordinates) {
        // console.log('move', coordinates);
        io.emit('othermove', {
            x: coordinates.x,
            y: coordinates.y,
            id: socket.id,
        });
    });
});

server.listen(3000, function () { console.log('listening on *:3000'); });