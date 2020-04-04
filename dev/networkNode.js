const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

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

app.post('/register-and-broadcast-node', function(req, res) {
    // Registering a new network node on any node already in the network and broadcasting that new node's url to all the other nodes present in the network

    // get the newNodeUrl that needs to be registered
    const newNodeUrl = req.body.newNodeUrl;

    // Create an empty array that will hold all the promise that will be returned when registering the newNodeUrl on other nodes
    const regNodesPromises = [];

    // Check if node is not already in this node networkNodes then add it to it

    if(medixCoin.networkNodes.indexOf(newNodeUrl) === -1) 
        medixCoin.networkNodes.push(newNodeUrl);
    // Now loop through all the urls in the networkNodes array and send a request to them to register this newNodeUrl in their networkNodes array
    medixCoin.networkNodes.forEach(networkNodeUrl => {
        // broadcast the new node url to this url
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl},
            json: true
        };

        regNodesPromises.push(rp(requestOptions));
    });

    // Get all the promises back, then send a request to the register-nodes-bulk endpoint of the newNodeUrl so it can also register all the other nodesUrls to it's own networkNodes array

    Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                body: { allNetworkNodes: [...medixCoin.networkNodes, medixCoin.currentNodeUrl]},
                json: true
            };

            return rp(bulkRegisterOptions);
        }).then(data => {
            res.json({ note: 'New node registered in the network successfully'});
        });
});

app.post('/register-node', function(req, res) {
    // For recieving and registering any broadcasted node url on own network
    // get the newNodeUrl and check whether it already is in this nodes networkNodes array and also check if it is not the currentNode's url.
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = medixCoin.indexOf(newNodeUrl) == -1;
    const notOwnUrl = medixCoin.currentNodeUrl !== newNodeUrl;

    // Add the newNodeUrl to the networkNodes array if all the checks are passed
    if(nodeNotAlreadyPresent && notOwnUrl)
        medixCoin.networkNodes.push(newNodeUrl);
    
    // Return a success message
    res.json({note: 'New node registered successfully'});

});

app.post('/register-nodes-bulk', function(req, res) {
    // For recieving all the url of the nodes present in the network and completing the process of adding this new node to the network
});
 
app.listen(port, function () {
    console.log(`Started and Listening on http://localhost:${port}`);
})