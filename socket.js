const cluster = require('cluster');
const io = require('socket.io')();
const sticky = require('sticky-session');
const http = require('http');
const redis = require('socket.io-redis');
const redisClient = require('redis');

require('date-utils');
const json = require('./setting.json');

//io.set('heartbeat interval', 5000);
//io.set('heartbeat timeout', 15000);

const server = http.createServer((req, res) => {
  res.end('worker: ' + cluster.worker.id);
});

const NODE_PORT = process.env.NODE_PORT || json.redis.port;
//io.adapter(redis({ host: '192.168.56.53', port: 6379 }));
//io.adapter(redis({ host: json.redis.host, port:NODE_PORT, auth_pass: json.redis.pw }));
io.adapter(redis({ host: json.redis.host, port: json.redis.port }));
io.attach(server);
isWorker = sticky.listen(server, NODE_PORT);

const redisClientConnect = redisClient.createClient({ host: json.redis.host, port: 6379 });

if (isWorker) {
  io.on('connection', (socket) => {
    // var query = socket.handshake.query;
    // const room = "rooms:" + query.cId + "-" + query.gId;
    // socket.join(room);

    // console.log(`worker: ${cluster.worker.id}, connected, id: ${socket.id}, connected, id: ${room}`);
    socket.on('login', () => {
      console.log(`disconnected, id: ${socket.id}`);
    });

    socket.on('join room', (roomId, cId) => {
      const room = "rooms:" + roomId + "-" + cId;
      socket.join(room);
    });

    socket.on('chat message', (roomId, cId, gId, uId, message) => {
      //let now = new Date().toFormat("YYYY年MM月DD日 HH24時MI分SS秒");
      let dk = new Date().toFormat("YYYYMMDDHH24MISS");
      let date = new Date().toFormat("YYYY年MM月DD日 HH24時MI分");
      const room = "rooms:" + roomId + "-" + cId;
      data = `{ "date": "${date}", "group": "${gId}", "user": "${uId}", "msg": "${message}" }`;
      console.log(data);
      redisClientConnect.hset("rooms:" + roomId + "-" + cId, dk, data);
      socket.broadcast.to(room).emit('chat message', data);
    });

    socket.on('disconnect', () => {
      console.log(`disconnected, id: ${socket.id}`);
    });
  });
}