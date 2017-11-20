#!/usr/bin/env node
'use strict';

const commander = require('commander');
const Client    = require('../client');
const util     = require('../util');

class CLI {
  constructor(options) {

    this.client = new Client(options);
    this.util = util;
  }

  init() {
    commander
      .version('0.1.0')
      .option('-f, --file <filename>', 'Wallet file')
      .option('-h, --host <host>', 'Bitcore Wallet Service URL (eg: http://localhost:3001/copay/api')
      .option('-v, --verbose', 'be verbose')
      .command('create <walletName> <m-n> [username]', 'creates a wallet')
      .command('join <secret> [username]', 'join a wallet')
      .command('mnemonic', 'show mnemonics from my wallet')
      .command('status', 'get wallet status')
      .command('address', 'create a new address from server')
      .command('addresses', 'list addresses')
      .command('balance', 'wallet balance')
      .command('send <address> <amount> [note]', 'send bitcoins')
      .command('sign <txpId>', 'sign a transaction proposal')
      .command('reject <txpId> [reason]', 'reject a transaction proposal')
      .command('broadcast <txpId>', 'broadcast a transaction proposal to the Bitcoin network')
      .command('rm <txpId>', 'remove a transaction proposal')
      .command('history', 'list of past incoming and outgoing transactions')
      .command('export', 'export wallet critical data')
      .command('import <backup> <passphrase>', 'import wallet critical data')
      .command('confirm', 'show copayer\'s data for confirmation')
      .command('recreate', 'recreate a wallet on a remove server given local infomation')
      .command('txproposals', 'list transactions proposals')
      .command('genkey', 'generates extended private key for later wallet usage')
      .command('airsign <file>', 'sign a list of transaction proposals from an air-gapped device')
      .command('derive <path>', 'derive using the extended private key')
      .parse(process.argv)


    if (!commander.args.length || !commander.runningCommand) {
      commander.help();
    }

  }
}

module.exports = CLI;
