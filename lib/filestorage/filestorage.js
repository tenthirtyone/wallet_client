'use strict'

const fs            = require('fs');
const util          = require('../util');
const { homedir }   = require('os');
const { promisify } = require('util');


class FileStorage {
  constructor(options) {

    if (!options || !options.FileStorage) {
      throw new Error('Please set wallet fileName in the configuration file');
    }

    this.options    = util.merge(FileStorage.DEFAULTS, options.FileStorage);
    this.savePath   = `${this.options.homeDir}/${this.options.fileName}`;
    this.writeFile  = promisify(fs.writeFile);
    this.readFile   = promisify(fs.readFile);
    this.fileExists = promisify(fs.exists);
  }

  static get DEFAULTS() {
    return {
      homeDir:  homedir(),
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
      await this.writeFile(this.savePath, dataOut);
    } catch (e) {
      throw new Error('Failed to save wallet. ', e);
    }
  }

  async load() {
    let data;
    try {
      data = await this.readFile(this.savePath, 'utf8');
      data = JSON.parse(data);
    } catch (e) {
      throw new Error('Error loading wallet data from: ' + this.savePath);
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
