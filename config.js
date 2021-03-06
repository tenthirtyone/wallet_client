'use strict';

const mkdirp                        = require('mkdirp');
const { writeFileSync, existsSync } = require('fs');
const { homedir }                   = require('os');
const { join }                      = require('path');

const datadir = join(homedir(), '.config/walletclient');

module.exports = {
  Wallet: {
    host: '127.0.0.1',
  },
  FileStorage: {
    saveDir: homedir(),
    fileName: 'default-wallet.dat',
    doNotOverwrite: true,
  }
};

if (!existsSync(join(datadir, 'config'))) {
  mkdirp.sync(datadir);
  writeFileSync(join(datadir, 'config'), JSON.stringify(module.exports));
}
