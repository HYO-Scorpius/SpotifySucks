const express = require('express');

const app = express();

const hostname = '127.0.0.1';
const port = 1337;

app.get('/', function (req, res) {
    res.send("Hello world")
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
