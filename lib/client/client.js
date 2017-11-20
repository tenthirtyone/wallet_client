'use strict';

const Bitcore     = require('bitcore-wallet-client');
const FileStorage = require('../filestorage');
const read        = require('read');
const sjcl        = require('sjcl');
const util        = require('../util');


/**
 * Wallet client for command line wallet.  Bitcoin now,
 * additional clients later
 *
 * @class Client
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

  static get WALLET_ENCRYPTION_OPTS() {
    return {
      iter: 5000
    }
  }

  /**
   * Create and encrypt a wallet using a password
   *
   * @param {String} walletName
   * @param {String} copayerName
   * @param {Number} m
   * @param {Number} n
   * @param {String} network
   * @memberof Client
   */
  async createSecureWallet(walletName, copayerName, m, n, network) {
    let password;
    try {
      password = await this.getPassword();
    } catch (e) {
      console.log(e);
    }

    this.createWallet(walletName, copayerName, m, n, network, password);
  }

  /**
   * Create a new wallet
   *
   * @param {any} walletName
   * @param {any} copayerName
   * @param {any} m
   * @param {any} n
   * @param {any} network
   * @param {any} password
   * @returns
   * @memberof Client
   */
  createWallet(walletName, copayerName, m, n, network, password) {
    let bitcore = this.bitcore;
    return this.bitcore.createWallet(walletName, copayerName, m, n,
      {
        network: network
      }, async(err, secret) => {
        console.log(' * ' + network + ' Wallet Created.');

        let walletData = bitcore.export();

        if (password) {
          walletData = sjcl.encrypt(password, walletData, Client.WALLET_ENCRYPTION_OPTS);
        }

        await this.saveWallet(walletData);
        if (secret) {
          console.log('   - Secret to share:\n\t' + secret);
        }
      });
  }

  getWalletFileName() {
    return this.storage.getFileName();
  }

  setWalletFileName(fileName) {
    this.storage.setFileName(fileName);
  }

  seedFromRandomWithMnemonic(options) {
    this.bitcore.seedFromRandomWithMnemonic(options);
  }

  getPassword() {
    return new Promise((resolve, reject) => {
      read({
        prompt: 'Enter password to encrypt: ',
        silent: true
      }, (err, password) => {
        if (err) {
          reject(err);
        }

        if (!password) {
          reject('No password given');
        }

        read({
          prompt: 'Confirm password',
          silent: true
        }, (err, password2) => {
          if (err) {
            reject(err);
          }

          if (password !== password2) {
            reject('Passwords were not equal');
          }

          resolve(password);
        });
      });
    })
  }

  async saveWallet(data) {
    try {
      await this.storage.save(data);
      console.log(' * Wallet File: ' + this.storage.savePath);
    } catch (e) {
      console.log(e)
    }
  }

  async loadWallet() {
    try {
      this.walletData = await this.storage.load();
    } catch (e) {
      console.log(e);
    }
  }

  async walletExists() {
    let exists;
    try {
      exists = await this.storage.exists();
    } catch (e) {
      throw new Error('Error checking if wallet data exists: ', e);
    }
    //console.log(exists)
    return exists;
  }
}

module.exports = Client;