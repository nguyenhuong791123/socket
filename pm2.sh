#!/bin/bash

PORT=$1
if [[ "$PORT" == "^[0-9]+$" ]]; then
  NODE_PORT=${PORT} pm2 start socket.js --name socker.io-redis-${PORT}
else
  echo "Please setting NODE_PORT !!!"
fi