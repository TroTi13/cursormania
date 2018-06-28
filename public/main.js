(function () {
    const cursormania = {
        settings: {
            animId: null,
            sockets: [],
        },
        init: function () {
            const s = cursormania.settings;

            s.socket = io();

            s.$canvas = document.getElementById('canvas');
            s.context = canvas.getContext('2d');
            s.$canvas.width = window.innerWidth;
            s.$canvas.height = window.innerHeight;

            s.socket.on('connect', function () {
                s.sockets.push({
                    id: s.socket.id,
                    x: 0,
                    y: 0,
                });
            });

            s.socket.on('connected', function (data) {
                console.log('other connected', s.sockets, data.id, s.socket.id);

                if(data.id !== s.socket.id) {
                    s.sockets.push({
                        id: data.id,
                        x: 0,
                        y: 0,
                    });
                }
            });
            s.socket.on('disconnected', function (data) {
                s.sockets = s.sockets.filter(function (socket) { return socket.id !== data.id; });
            });

            s.socket.on('othermove', function (data) {
                if (!s.sockets.filter(function(socket) { return socket.id === data.id}).length) {
                    s.sockets.push({
                        id: data.id,
                        x: data.x,
                        y: data.y,
                    });
                }
                s.sockets = s.sockets.map(function (socket) {
                    if (socket.id === data.id) {
                        socket.x = data.x;
                        socket.y = data.y;
                    }

                    return socket;
                });
            });

            s.$canvas.addEventListener('mousemove', function(e) {
                console.log('move', s.sockets);

                s.socket.emit('move', {
                    x: e.pageX,
                    y: e.pageY,
                });
            });

            cursormania.loop();
        },
        loop: function() {
            const s = cursormania.settings;

            cursormania.draw();

            s.animId = requestAnimationFrame(cursormania.loop);
        },
        stop: function() {
            const s = cursormania.settings;

            cancelAnimationFrame(s.animId);
        },
        draw: function() {
            const s = cursormania.settings;

            s.context.clearRect(0, 0, s.$canvas.width, s.$canvas.height);

            s.sockets.forEach(function(socket) {
                s.context.save();
                if (socket.id === s.socket.id) {
                    s.context.fillStyle = 'green';
                } else {
                    s.context.fillStyle = 'red';
                }
                s.context.fillRect(socket.x - 5, socket.y - 5, 10, 10);
                s.context.restore();
            });
        },
    };

    document.addEventListener('DOMContentLoaded', cursormania.init);
})();