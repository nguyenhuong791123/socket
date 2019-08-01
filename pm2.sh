#! /bin/bash
RUN=$1
PORT=0

#### 引数の長さが 0 でなければ、
#### PARAM_1 にそれをセット
if [ ! -z $2 ]; then
    PORT=$2
fi
#### PARAM_1 に + 1 をし、その戻り値を RET に保存
expr $PORT + 1 > /dev/null 2>&1
RET=$?
#### 戻り値をもとに数字が正しいか判定
echo "戻り値 : $RET"
#### 戻り値を使って正常か異常か判定
if [ $RET -lt 2 ]; then
    echo "$PORT : 数字です"
else
    echo "$PORT : 数字ではありません"
  exit 0
fi

if [ $RUN == 'stop' -o $RUN == 'status' -o $RUN == 'delete' ]; then
  pm2 $RUN socker.io-redis-${PORT}
fi

if [ $RUN == 'start' ]; then
  NODE_PORT=${PORT} pm2 start socket.js --name socker.io-redis-${PORT}
fi

if [ $RUN == 'restart' ]; then
  pm2 $RUN socker.io-redis-${PORT}
fi
