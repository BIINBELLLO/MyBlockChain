const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('API Started, and running successfully');
})

app.get('/blockchain', function (req, res) {
    // This will return the entire blockchain for us!!!
});

app.post('/transaction', function (req, res) {
    // This will be used to create new transactions into the blockchain
});

app.get('/mine', function (req, res) {
    // This will be used to mine new blocks into the blockchain
});
 
app.listen(3000, function () {
    console.log('Started and Listening on http://localhost:3000');
})