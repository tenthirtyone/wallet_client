/* eslint-env node, mocha */

'use strict';

const assert      = require('assert');
const fs          = require('fs');
const FileStorage = require('./filestorage');
const config      = require('../../config-test');

let storage;

const testData = 'test';
const walletData = {
  someData: testData
}

let savedData;
let newFileName = 'newFileName';
let oldFileName;

describe('FileStorage', () => {

  it('inits new wallet storage', () => {
    storage = new FileStorage(config);
  })

  it('changes the filename', () => {
    oldFileName = storage.getFileName();
    storage.setFileName(newFileName);

    assert.equal(storage.getFileName(), newFileName);
    assert.notEqual(oldFileName, newFileName);
    storage.setFileName(oldFileName);
  });

  it ('saves wallet data', async() => {
    await storage.save(walletData);
  });

  it('checks the wallet exists on disk', async() => {
    await storage.exists();
  })

  it('loads wallet data', async() => {
    savedData = await storage.load();
    assert(savedData.someData, 'test');
  });

  it('saved data matches data in memory', () => {
    assert.deepStrictEqual(savedData, walletData);
  });



  after(() =>{
    fs.unlink(storage.savePath, (err) => {
      if (err) {
        console.log('Error cleaning up unit tests ' + err )
      }
    });
  });
})