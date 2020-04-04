const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];

const medixCoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

 
app.get('/', function (req, res) {
  res.send('API Started, and running successfully');
})

app.get('/blockchain', function (req, res) {
    // This will return the entire blockchain for us!!!
    res.send(medixCoin);
});

app.post('/transaction', function (req, res) {
    // This will be used to create new transactions into the blockchain
    const blockIndex = medixCoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({"note": `Transaction will be added to block ${blockIndex}.`});

});

app.get('/mine', function (req, res) {
    // This will be used to mine new blocks into the blockchain...

    // get the last block hash by getting the last block and accessing the hash property
    const lastBlock = medixCoin.getLastBlock();
    const previousBlockHash = lastBlock.hash;

    // Prepare the current block data by creating an object with all the pending transactions and any other information we feel is relevant

    const currentBlockData = {
        transactions: medixCoin.pendingTransactions,
        index: lastBlock.index + 1
    }

    // Get the nonce, for this, we need to perform a proof of work to determine the right nonce value that will generate the correct hash

    const nonce = medixCoin.proofOfWork(previousBlockHash, currentBlockData);

    // With the nonce value gotten, the next step is to get the block hash, which is part of the needed parameter for creating a new block

    const blockHash = medixCoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    // Reward the miner, for successfully generating the block

    medixCoin.createNewTransaction(12.5, '000', nodeAddress);

    // Add the block to the blockchain

    const newBlock = medixCoin.createNewBlock(nonce, previousBlockHash, blockHash);

    // Send a response to the calling node or application

    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
});

app.post('/register-and-broadcast-node', function() {
    // Registering a new network node on any node already in the network and broadcasting that new node's url to all the other nodes present in the network
});

app.post('/register-node', function() {
    // For recieving and registering any broadcasted node url on own network
});

app.post('/register-nodes-bulk', function() {
    // For recieving all the url of the nodes present in the network and completing the process of adding this new node to the network
});
 
app.listen(port, function () {
    console.log(`Started and Listening on http://localhost:${port}`);
})