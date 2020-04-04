const BlockChain = require('./blockchain');

const bitcoin = new BlockChain();

const prevHash = 'JHJSHJDS67SDDSBDSHGSS66S7SSBNHGSS66767S';
const blockData = [
    {
        amount: 200,
        sender: 'jjhajdajaadsbvshsdgdshgds89',
        recipient: 'hjsdhgsdhsdsdvsdbvsghsgfsdh'
    },
    {
        amount: 300,
        sender: 'hgdsghsghsghsdhgshg',
        recipient: 'ghdshgshgghsghghsdghdsgh'
    },
    {
        amount: 400,
        sender: 'hjsdhgsdhsdsdvsdbvsghsgfsdh',
        recipient: 'ghshgsdbsbvdsgfdsgfds'
    },
    {
        amount: 500,
        sender: 'jjhajdajaadsbvshsdgdshgds89',
        recipient: 'hjsdhgsdhsdsdvsdbvsghsgfsdh'
    }
];

const nonce = 76374;

console.log(bitcoin.hashBlock(prevHash, blockData, nonce));