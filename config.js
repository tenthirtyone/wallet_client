'use strict';

const mkdirp = require('mkdirp');
const { writeFileSync, existsSync } = require('fs');
const { homedir } = require('os');
const { join } = require('path');
const datadir = join(homedir(), '.config/walletclient');


module.exports = {


};

if (!existsSync(join(datadir, 'config'))) {
  mkdirp.sync(datadir);
  writeFileSync(join(datadir, 'config'), ini.stringify(module.exports));
}
