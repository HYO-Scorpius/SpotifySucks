const express = require('express');
const path = require('path');
const app = express();


app.use(express.static(path.join('..', 'frontend', 'build')));

const hostname = '127.0.0.1';
const port =  process.env.PORT || 1337;

//app.get('/', function (req, res) {
//   res.sendFile(path.join('..', 'frontend', 'build', 'index.html')); 
//});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
