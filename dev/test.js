const BlockChain = require('./blockchain');

const bitcoin = new BlockChain();

bitcoin.createNewBlock(3646, 'HJDSSH87933BJY3UU3U3U3YU3', 'HJDFJHDF7887R674HERG674653');
bitcoin.createNewBlock(8748, 'JHSHSHJSDNBDS565E3GHHGSH', 'ADHGAGHDDSTYDS657637');
bitcoin.createNewBlock(362343446, 'GFDGDSTRTRWEYUI8998DHHG', 'JKSJSJHSHGS09S887DS');
bitcoin.createNewBlock(28773, 'NSJSHJ673BHGHGDFHGD', 'KJJHSSGHGF89BVSGGFSD');

console.log(bitcoin.getLastBlock());