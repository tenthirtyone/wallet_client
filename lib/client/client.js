'use strict';

const Bitcore     = require('bitcore-wallet-client');
const FileStorage = require('../filestorage');
const util        = require('../util');

/**
 * Wallet CLI client
 */
class Client {
  constructor(options) {

    if (!options || !options.Wallet) {
      throw new Error('Please set client options in the configuration file');
    }

    this.storage = new FileStorage(options);
    this.options = util.merge(Client.DEFAULTS, options.Wallet);
    this.bitcore = new Bitcore(this.options);
  }

  static get DEFAULTS() {
    return {
      host: '127.0.0.1',
      path: '/bws/api',
      verbose: true,
      supportStaffWalletId: false
    }
  }

  createWallet(walletName, copayerName, m, n, network) {
    let bitcore = this.bitcore;
    return this.bitcore.createWallet(walletName, copayerName, m, n,
      {
        network: network
      }, (err, secret) => {
        console.log(err);
        console.log(secret);
        console.log(' * ' + network + ' Wallet Created.');
        console.log(bitcore)
      });
  }

  getWalletName() {
    return this.storage.getFileName();
  }

  setWalletName(fileName) {
    this.storage.setFileName(fileName);
  }

  seedFromRandomWithMnemonic(options) {
    this.bitcore.seedFromRandomWithMnemonic(options);
  }

  async loadWallet() {
    try {
      this.walletData = await this.storage.load();
    } catch (e) {
      console.log(e);
    }

    console.log(this.walletData);
  }
}

module.exports = Client;