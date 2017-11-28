/* eslint-env node, mocha */

'use strict';

const assert      = require('assert');
const Wallet      = require('./client');
const fs          = require('fs');
const config      = require('../../config-test');

describe('Bitcore Wallet Client', ()=>{
  let wallet;

  it('Instantiates a new wallet client', ()=> {
    wallet = new Wallet(config);
  })

  it('Checks that a wallet does not exist', async()=>{
    let exists = await wallet.walletExists();
    assert.equal(exists, false);
  })

  it('Creates a new seed from random with mnemonic', () => {
    wallet.seedFromRandomWithMnemonic({
      network: 'livenet',
      passphrase: 'passphrase',
      language: 'en',
      coin: 'btc',
    });
  })

  it('Creates a new wallet', () => {
    wallet.createWallet('testWallet', 'copayerName', 1, 2, 'testnet')
  });

  it('Checks that a wallet does exist', async() => {
    let exists = await wallet.walletExists();
    assert.equal(exists, true);
  })

  it('Gets the wallet file name', () => {
    let fileName = wallet.getWalletFileName();
    assert.equal(fileName, config.FileStorage.fileName);
  })

  it('Sets a new wallet file name', () => {
    let oldName = wallet.getWalletFileName();
    let fileName = 'walletName';
    wallet.setWalletFileName(fileName);

    assert.equal(fileName, wallet.getWalletFileName());

    wallet.setWalletFileName(oldName);
  })

  after(() => {
    fs.unlink(wallet.storage.savePath, (err) => {
      if (err) {
        console.log('Error cleaning up unit tests ' + err)
      }
    });
  });
})