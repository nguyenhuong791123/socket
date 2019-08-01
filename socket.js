const cluster = require('cluster');
const io = require('socket.io')();
const sticky = require('sticky-session');
const http = require('http');
const redis = require('socket.io-redis');

const server = http.createServer((req, res) => {
  res.end('worker: ' + cluster.worker.id);
});

io.adapter(redis({ host: '192.168.10.6', port: 6379, auth_pass: "redis080" }));
io.attach(server);
const NODE_PORT = process.env.NODE_PORT;
//isWorker = sticky.listen(server, 3000);
isWorker = sticky.listen(server, NODE_PORT);

if (isWorker) {
  io.on('connection', (socket) => {
    console.log(`worker: ${cluster.worker.id}, connected, id: ${socket.id}`);

    socket.on('chat message', (user, message) => {
      data = `${message} from ${user}`;
      console.log(data);
      socket.broadcast.emit('chat message', data);
    });

    socket.on('disconnect', () => {
      console.log(`disconnected, id: ${socket.id}`);
    });
  });
}