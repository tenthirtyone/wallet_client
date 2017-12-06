## Full Node
Start Syncing:
Node 8.9+
Install Mongo 3.4+ & start mongod

git clone https://github.com/bitpay/bcoin

cd bcoin
npm install
npm run mongo

configuration for bcoin is location in mongo.js in the project root. It is already set to main network and will save to mongo's wallet-bridge collection.


## Wallet Bridge
git clone https://github.com/bitpay/walletbridge.git
cd walletbridge
npm install
npm run start


## Wallet Client
git clone https://github.com/bitpay/walletclient
cd walletclient
npm install

Configuration is in config.js in project root. It is already set to main network and will use mongo's wallet-bridge.

Drop wallet.dat in /bin & cd /bin
run ./exportBitcoindKeys.sh

node wallet-create
node wallet-import  (without a private key export from wallet.dat this is unnecessary)
node wallet-getUTXOs
node createTx

