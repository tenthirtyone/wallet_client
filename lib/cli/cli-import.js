'use strict'

const program = require('commander');
const request = require('request');
const readline = require('readline');
const fs = require('fs');
const bitcore = require('bitcore-lib');
const { createHash } = require('crypto');

let counter = 0;

function rmd160sha256(input) {
  return createHash('rmd160')
    .update(createHash('sha256').update(input).digest())
    .digest();
}

program
  .option('-f, --file', 'import from file')
  .usage('[options] <passphrase>')
  .parse(process.argv);

const args = program.args;

if (!args[0]) {
  program.help();
}

if (!program.file) {
  throw new Error('No import file provided');
}

let wallet = fs.readFileSync('./wallet.json');

try {
  wallet = JSON.parse(wallet).wallet;
} catch (e) {
  throw new Error('Error parsing wallet.json file');
}


let wifs = wallet.keys.map(key => {
  return key.wif
})


let keyFile = args[0];


const rl = readline.createInterface({
  input: fs.createReadStream(keyFile)
});

// Each line is a WIF key
rl.on('line', async(line) => {
  counter++;

  let key = bitcore.PrivateKey.fromWIF(line);
  let addr = key.toAddress();

  if (wifs.indexOf(line) === -1) {
    let data = {
      privKey: key.toString('hex'),
      wif: line,
      addr: addr.toString()
    }

    wallet.keys.push(data)
  } else {
    console.log('Wif: ' + line + ' already in wallet file');
  }

  if (counter % 100 === 0) {
    console.log(`Importing key #${counter}`);
  }
  //console.log(data)
});

rl.on('close', () => {
  console.log(`Imported ${counter} keys`);

  console.log('Writing wallet.json');
  // Write wallet data
  fs.writeFile('./wallet.json', JSON.stringify({ wallet: wallet }), (err) => {
    if (err) {
      throw new Error(err);
    }
    console.log('Finished writing wallet.json');
  });

  let addrs;

  wallet.keys.forEach(key => {
    addrs = (addrs  || '') + key.addr + '\n';
  });

  // Write addresses to file for API
  fs.writeFile('./addresses.txt', addrs, (err) => {
    if (err) {
      throw new Error(err);
    }

    console.log('wrote addresses to addresses.tx');

    let buff = Buffer.from(wallet.authpubkey, 'hex');

    let auth = rmd160sha256(buff).toString('hex');

    fs.createReadStream('./addresses.txt').pipe(request.put('http://localhost:6366/wallets/' + auth)).pipe(process.stdout);

  })
})

