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
    if (!options || !options.filename) {
      throw new Error('Please set wallet filename');
    }
    this.options = util.merge(FileStorage.DEFAULTS, options);
    this.savePath = `${this.options.homeDir}/${this.options.filename}`;

    this.writeFile  = promisify(fs.writeFile);
    this.readFile   = promisify(fs.readFile);
    this.fileExists = promisify(fs.exists);
  }

  static get DEFAULTS() {
    return {
      homeDir:  homedir(),
      filename: 'clientwallet-default.dat'
    }
  }

  /**
   * Return the name of the current wallet file
   */
  getName() {
    return this.filename;
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
