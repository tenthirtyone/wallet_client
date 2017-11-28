'use strict'

const program = require('commander');

const readline = require('readline');
const fs = require('fs');
const bitcore = require('bitcore-lib');

let counter = 0;

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

let keyFile = args[0];

const rl = readline.createInterface({
  input: fs.createReadStream(keyFile)
});

// Each line is a WIF key
rl.on('line', async(line) => {
  counter++;

  let key = bitcore.PrivateKey.fromWIF(line);
  let addr = key.toAddress();

  let data = {
    privKey: key.toString('hex'),
    wif: line,
    addr: addr.toString()
  }

  wallet.keys.push(data)

  if (counter % 100 === 0) {
    console.log(`Importing key #${counter}`);
  }
  //console.log(data)
});

rl.on('close', () => {
  console.log(`Imported ${counter} keys`);

  console.log('Writing wallet.json');
  fs.writeFile('./wallet.json', JSON.stringify({ wallet: wallet }), (err) => {
    if (err) {
      throw new Error(err);
    }
    console.log('Finished writing wallet.json');
  })
})

