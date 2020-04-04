function BlockChain() {
    this.chain = [];
    this.newTransactions = [];
}

BlockChain.prototype.createNewBlock = function (nonce, previousHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.newTransactions,
        nonce: nonce,
        hash: hash,
        previousHash: previousHash
    };

    this.newTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

BlockChain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
}


module.exports = BlockChain;