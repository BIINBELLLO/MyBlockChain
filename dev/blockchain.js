function BlockChain() {
    this.chain = [];
    this.pendingTransactions = [];
}

BlockChain.prototype.createNewBlock = function (nonce, previousHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousHash: previousHash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

BlockChain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
}

BlockChain.prototype.createNewTransaction = function (amount, sender, recepient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recepient: recepient
    };

    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock().index + 1;
};


module.exports = BlockChain;