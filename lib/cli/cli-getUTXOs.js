'use strict'

const program = require('commander');
const request = require('request');
const readline = require('readline');
const fs = require('fs');
const bitcore = require('bitcore-lib');
const { createHash } = require('crypto');

let counter = 0;

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

request({
  method: 'GET',
  uri: 'http://localhost:6366/wallets/' + authkey + '/utxos',
}, (err, res) => {
  if (err) {
    console.log(err);
  }

  //  Need sync progress from bcoin
  let json;
  try {
    json = JSON.parse(res.body);
  } catch (e) {
    throw new Error(e);
  }

  console.log(json);
  console.log('json');
})