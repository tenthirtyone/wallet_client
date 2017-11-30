'use strict';

const fs = require('fs');
const bitcore = require('bitcore-lib');

let wallet;
let utxos;
let addrFilter = {};

loadWallet();

function loadWallet() {
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

    wallet = json.wallet || [];
    loadUTXOs();
  });
}

function loadUTXOs() {
  fs.readFile('./utxos.json', (err, data) => {
    if (err) {
      throw new Error(err);
    }

    let json;
    try {
      json = JSON.parse(data)
    } catch (e) {
      throw new Error(e);
    }

    utxos = json.utxos || [];

    filterAddrs();
    createTX();
  });
}

// Without this it will try every key. Filter to keys that match
// addrs
function filterAddrs() {
  utxos.forEach(utxo => {
    addrFilter[utxo.address] = true;
  });
}

function createTX() {
  const privKeys = [];
  wallet.keys.forEach(key => {
    if (addrFilter[key.addr]) {
      let privKey = bitcore.PrivateKey.fromWIF(key.wif);
      privKeys.push(privKey);
    }
  });

  let total = utxos.reduce((a, b) => {
    return a + b.satoshis;
  }, 0)

  // Naive create txs 100 utxos at a time, no miner fee
  while (utxos.length) {
    let txUtxos = utxos.splice(0, 100);
    let txTotal = txUtxos.reduce((a, b) => {
      return a + b.satoshis;
    }, 0);
    let tx = new bitcore.Transaction();
    tx.from(txUtxos);
    tx.to('mfXzcLXsHBys6Uq8ZsbZwdT2KotVDzeNcK', txTotal);
    tx.sign(privKeys);
    console.log('Raw Tx:');
    console.log(tx.toString('hex'))
  }

  return;

}