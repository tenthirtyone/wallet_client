#!/usr/bin/env node
'use strict'

const CLI = require('./cli');
const config = require('../../config');
const program = require('commander');

const wallet = new CLI(config);

program
  .option('-t, --testnet', 'Create a Testnet Wallet')
  .option('-p, --password', 'Encrypt wallet. Will ask password interactively')
  .option('-c, --coin <coin>', 'coin (btc/bch)')
  .usage('[options] <walletName> <m-n> [copayerName] <passphrase>')
  .parse(process.argv);

if (program.args.length !== 4) {
  program.help();
}

const args = program.args;
const walletName = args[0];
const copayerName = args[2] || process.env.USER;
const passphrase = args[3];
const network = program.testnet ? 'testnet' : 'livenet';
const coin = program.coin ? program.coin : 'btc';

let mn;
try {
  mn = wallet.util.parseMN(args[1]);
} catch (e) {
  console.log(e);
}
// Returns if null or undefined
wallet.client.setWalletName(args.file || process.env['WALLET_FILE']);

wallet.client.seedFromRandomWithMnemonic({
  network: network,
  passphrase: passphrase,
  language: 'en',
  coin: coin,
});

wallet.client.createWallet(walletName, copayerName, mn[0], mn[1], network);
