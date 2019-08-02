const cluster = require('cluster');
const io = require('socket.io')();
const sticky = require('sticky-session');
const http = require('http');
const redis = require('socket.io-redis');
const json = require('./setting.json');

const server = http.createServer((req, res) => {
  res.end('worker: ' + cluster.worker.id);
});

const NODE_PORT = process.env.NODE_PORT || json.redis.port;
//io.adapter(redis({ host: '192.168.56.53', port: 6379 }));
io.adapter(redis({ host: json.redis.host, port:NODE_PORT, auth_pass: json.redis.pw }));
//io.adapter(redis({ host: json.redis.host, port: json.redis.port }));
io.attach(server);
isWorker = sticky.listen(server, NODE_PORT);

if (isWorker) {
  io.on('connection', (socket) => {
    console.log(`worker: ${cluster.worker.id}, connected, id: ${socket.id}`);
    //socket.broadcast.emit('hello', 'to all clients except sender');

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