(() => {
    const cursormania = {
        settings: {},
        init: () => {
            const s = cursormania.settings;
            const socket = io();
            const $me = document.querySelector('#me');

            document.body.addEventListener('mousemove', (e) => {
                socket.emit('move', {
                    x: e.pageX,
                    y: e.pageY,
                });

                $me.style.left = e.pageX + 'px';
                $me.style.top = e.pageY + 'px';
            });

            socket.on('connected', (data) => {
                const $cursor = document.createElement('div');
                $cursor.classList.add('cursor');
                $cursor.id = data.id;

                document.body.appendChild($cursor);
            });
            socket.on('disconnected', (data) => {
                const $cursor = document.querySelector('#' + data.id);

                if ($cursor) {
                    $cursor.parentElement.removeChild($cursor);
                }
            });

            socket.on('othermove', (data) => {
                const $cursor = document.querySelector('#' + data.id);

                if ($cursor) {
                    $cursor.style.left = data.x + 'px';
                    $cursor.style.top = data.y + 'px';
                    console.log('move other', data);
                }
            });
        },
    };

    document.addEventListener('DOMContentLoaded', cursormania.init);
})();