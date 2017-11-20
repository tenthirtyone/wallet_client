'use strict'

const fs            = require('fs');
const util          = require('../util');
const { homedir }   = require('os');
const { promisify } = require('util');

/**
 * Flat file storage for wallet data
 */
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
      fileName: 'clientwallet-default.dat'
    }
  }

  /**
   * Return the name of the current wallet file
   */
  getFileName() {
    return this.options.fileName;
  }

  /**
   * Set the name of the file
   */
  setFileName(fileName) {
    if (!fileName || !fileName instanceof String) {
      return ;
    }
    this.options.fileName = fileName;
  }

  /**
   * Save wallet data to disk
   * @param {object} data
   */
  async save(data) {
    if (!data) {
      throw new Error('Failed to save wallet. No data ');
    }

    let dataOut = {};

    try {
      dataOut = JSON.stringify(data);
      await this.writeFile(this.savePath, dataOut);
    } catch (e) {
      throw new Error('Failed to save wallet. ', e);
    }
  }

  /**
   * Load wallet data
   */
  async load() {
    let data
    try {
      data = await this.readFile(this.savePath, 'utf8');
      data = JSON.parse(data);
    } catch (e) {
      throw new Error('Error loading wallet data from: ' + this.savePath);
    }

    return data;
  }

  /**
   * Check if file exists
   */
  async exists() {
    return await this.fileExists(this.savePath);
  }
}

module.exports = FileStorage;
