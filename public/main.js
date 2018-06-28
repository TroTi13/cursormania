(() => {
    const cursormania = {
        settings: {
            animId: null,
            sockets: [],
        },
        init: () => {
            const s = cursormania.settings;

            s.socket = io();

            s.$canvas = document.getElementById('canvas');
            s.context = canvas.getContext('2d');
            s.$canvas.width = window.innerWidth;
            s.$canvas.height = window.innerHeight;

            s.socket.on('connect', () => {
                s.sockets.push({
                    id: s.socket.id,
                    x: 0,
                    y: 0,
                });
            });

            s.socket.on('connected', ({ id }) => {
                console.log('other connected', s.sockets, id, s.socket.id);

                if(id !== s.socket.id) {
                    s.sockets.push({
                        id,
                        x: 0,
                        y: 0,
                    });
                }
            });
            s.socket.on('disconnected', ({ id }) => {
                s.sockets = s.sockets.filter((socket) => socket.id !== id);
            });

            s.socket.on('othermove', ({ id, x, y }) => {
                if (!s.sockets.filter((socket) => socket.id === id).length) {
                    s.sockets.push({
                        id,
                        x,
                        y,
                    });
                }
                s.sockets = s.sockets.map((socket) => {
                    if (socket.id === id) {
                        socket.x = x;
                        socket.y = y;
                    }

                    return socket;
                });
            });

            s.$canvas.addEventListener('mousemove', (e) => {
                console.log('move', s.sockets);

                s.socket.emit('move', {
                    x: e.pageX,
                    y: e.pageY,
                });
            });

            cursormania.loop();
        },
        loop: () => {
            const s = cursormania.settings;

            cursormania.draw();

            s.animId = requestAnimationFrame(cursormania.loop);
        },
        stop: () => {
            const s = cursormania.settings;

            cancelAnimationFrame(s.animId);
        },
        draw: () => {
            const s = cursormania.settings;

            s.context.clearRect(0, 0, s.$canvas.width, s.$canvas.height);

            s.sockets.forEach((socket) => {
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