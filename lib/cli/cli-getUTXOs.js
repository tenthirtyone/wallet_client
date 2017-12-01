'use strict'

const program = require('commander');
const request = require('request');
const readline = require('readline');
const fs = require('fs');
const bitcore = require('bitcore-lib');
const { createHash } = require('crypto');
const split = require('split');
const stream = require('stream');

let counter = 0;
let utxos = [];

function rmd160sha256(input) {
  return createHash('rmd160')
    .update(createHash('sha256').update(input).digest())
    .digest();
}

program
  .usage('<passphrase>')
  .parse(process.argv);

const args = program.args;

let wallet = fs.readFileSync('./wallet.json');

try {
  wallet = JSON.parse(wallet).wallet;
} catch (e) {
  throw new Error('Error parsing wallet.json file');
}

let authkey = rmd160sha256(Buffer.from(wallet.authpubkey, 'hex')).toString('hex');
let balance = 0;

request({
  method: 'GET',
  uri: 'http://localhost:6366/wallets/' + authkey + '/utxos',
}).pipe(split()).pipe(new stream.Transform({
  transform: (data, nc, cb) => {
    try {
      balance += JSON.parse(data).value;
    } catch (e) {
      return cb();
    }
    return cb(null, data);
  }
})).on('data', (data) => {

  try {
    data = JSON.parse(data);
  } catch (e) {
    throw new Error(e);
  }

  let utxo = {
    'txId': data.mintTxid,
    'outputIndex': data.mintIndex,
    'address': data.address,
    'script': data.script,
    'satoshis': data.value
  }
  utxos.push(utxo);

})
  .on('end', () => {
    process.stdout.write(JSON.stringify(utxos));
  })
