'use strict';

const bcoin = require('bcoin');
const FullNode = bcoin.fullnode;
const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');


app.listen(3000);

function handler(req, res) {
  res.writeHead(200);
  res.end();
}

const node = new FullNode({
  network: 'regtest',
  dbname: 'wallet-bridge',
  dbhost: 'localhost',
  checkpoints: true,
  workers: true,
  logLevel: 'info',
  'max-inbound': 8,
  'max-outbound': 8,
  'http-port': 8332,
  nodes: '127.0.0.1:20000'
});

(async () => {
  await node.open();
  await node.connect();

  node.startSync();

  io.on('connection', (socket) => {
    console.log('connection');

    socket.on('queue:addr', async (data) => {
	console.log(data.addr)
      let coins = await node.getCoinsByAddress(data.addr);
      coins.forEach(utxo => {
        utxo.addr = data.addr;
        socket.emit('send:utxo', {
          utxo: utxo,
          addr: data.addr,
        });
      });
      socket.emit('complete');
    });
  });


})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
