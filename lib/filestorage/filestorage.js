'use strict'

const fs            = require('fs');
const util          = require('../util');
const { homedir }   = require('os');
const { promisify } = require('util');


/**
 * FileStorage
 *
 * @class FileStorage
 */
class FileStorage {
  constructor(options) {

    if (!options || !options.FileStorage) {
      console.log('No options provided, using defaults');
    }

    this.options    = util.merge(FileStorage.DEFAULTS, options.FileStorage);
    this.writeFile  = promisify(fs.writeFile);
    this.readFile   = promisify(fs.readFile);
    this.fileExists = promisify(fs.exists);
    this.setSavePath();
  }

  static get DEFAULTS() {
    return {
      saveDir:  homedir(),
      fileName: 'clientwallet-default.dat',
      doNotOverwrite: true,
    }
  }

  getFileName() {
    return this.options.fileName;
  }

  setFileName(fileName) {
    if (!fileName || !fileName instanceof String) {
      return ;
    }
    this.options.fileName = fileName;
    this.setSavePath();
  }

  getSavePath() {
    return this.savePath;
  }

  setSavePath(path) {
    this.savePath = path || `${this.options.saveDir}/${this.options.fileName}`;
  }

  async save(data) {
    if (!data) {
      throw new Error('Failed to save wallet. No data ');
    }

    if (await this.exists() && this.options.doNotOverwrite) {
      throw new Error('Failed to save, Wallet file already exists at: ' + this.savePath);
    }

    let dataOut = {};

    try {
      dataOut = JSON.stringify(data);
      await this.writeFile(this.getSavePath(), dataOut);
    } catch (e) {
      throw new Error('Failed to save wallet. ', e);
    }
  }

  async load(path=this.getSavePath()) {
    let data;
    try {
      data = await this.readFile(path, 'utf8');
      data = JSON.parse(data);
    } catch (e) {
      throw new Error('Error loading wallet data from: ' + path);
    }

    return data;
  }

  async exists() {
    let exists;
    try {
      exists = await this.fileExists(this.savePath);
    } catch (e) {
      throw new Error('Error checking if wallet data exists: ', e);
    }
    return exists;
  }
}

module.exports = FileStorage;
