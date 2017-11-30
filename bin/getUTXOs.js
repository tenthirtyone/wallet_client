'use strict';

const socket = require('socket.io-client')('http://localhost:3000');
const fs = require('fs');
const queue = [];
const utxos = [];

let completeCounter = 0;
let addrCounter = 0;

fs.readFile('./wallet.json', (err, data) => {
  if (err) {
    throw new Error(err);
  }

  let json;
  try {
    json = JSON.parse(data)
  } catch (e) {
    throw new Error(e);
  }

  let wallet = json.wallet || [];

  wallet.keys.forEach(key => {
    console.log(key.addr);
    queue.push(key.addr);
  })

  console.log(queue.length);

  getUTXOs();
})

socket.on('complete',  () => {
  completeCounter++;

  if (addrCounter === completeCounter) {
    console.log('finished receiving utxos');
    saveUTXOs();
  }
});

// Receive a utxo from the server
socket.on('send:utxo',  (data)=> {
  let utxo = {
    'txId': data.utxo.hash,
    'outputIndex': data.utxo.index,
    'address': data.addr,
    'script': data.utxo.script,
    'satoshis': data.utxo.value
  }
  utxos.push(utxo);
  getUTXOs();
});

socket.on('disconnect',  () => { });

// Take an item from the queue and get the
function getUTXOs() {
  // Baaaaaaaaaad
  if (queue.length) {
    let addr = queue.pop();
    addrCounter++;
    socket.emit('queue:addr', {
      addr: addr
    });
  }
}

function saveUTXOs() {
  fs.writeFile('./utxos.json', JSON.stringify({ utxos: utxos }), (err) => {
    if (err) {
      throw new Error(err);
    }
    console.log('Finished writing utxos.json');
  });
  socket.close();
}
