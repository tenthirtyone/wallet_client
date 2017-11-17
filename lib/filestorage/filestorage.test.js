/* eslint-env node, mocha */

'use strict';

const assert      = require('assert');
const fs          = require('fs');
const FileStorage = require('./filestorage');

let storage;

describe('FileStorage', () => {

  it ('inits new wallet storage', () => {
    storage = new FileStorage({
      filename: 'unitTestWallet'
    });
  })

  it ('saves wallet data', async() => {
    await storage.save({
      someData: 'test'
    });
  });

  it('checks the wallet exists on disk', async() => {
    await storage.exists();
  })

  it ('loads wallet data', async() => {
    const data = await storage.load();
    assert(data.someData, 'test');
  });

  after(async() =>{
    fs.unlink(storage.savePath, (err) => {
      if (err) {
        console.log('Error cleaning up unit tests ' + err )
      }
    });
  })
})