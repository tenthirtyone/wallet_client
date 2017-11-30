#!/usr/bin/env node
'use strict'

const program = require('commander');
const fs = require('fs');
const readline = require('readline');
const bitcore = require('bitcore-lib');
let hdKey = new bitcore.HDPrivateKey();
const request = require('request');

let wallet = {
  name: '',
  xprivkey: '',
  xpubkey: '',
  keys: [],
}

program
  .usage('<walletName> <passphrase>')
  .parse(process.argv);

if (program.args.length === 0) {
  program.help();
}

const args = program.args;
const walletName = args[0];
const passphrase = args[1];

wallet.name = walletName;
wallet.xprivkey = hdKey.toString('hex');
wallet.xpubkey = hdKey.xpubkey;
wallet.authpubkey = hdKey.publicKey.toString('hex');

if (passphrase)  {
  // Encrypt here
}

console.log('Writing wallet.json');
fs.writeFile('./wallet.json', JSON.stringify({ wallet: wallet }), (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log('Finished writing wallet.json');

  request({
    method: 'POST',
    uri: 'http://localhost:6366/wallets',
    json: {
      name: wallet.name,
      authpubkey: wallet.authpubkey,
    }
  }, (err) => {
    if (err) {
      console.log(err);
    }
  })
});


