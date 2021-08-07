const server = require('ws').Server;
const ws = new server({ port: 8081 });

ws.on('connection', socket => {
    console.log("connected.");

    socket.on('message', message => {
        console.log("Received: " + message);
        ws.clients.forEach(client => {
            client.send(message+"");
        });
    });

    socket.on('close', () => {
        console.log('good bye.');
    });
});
