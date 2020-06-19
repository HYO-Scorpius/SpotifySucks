const express = require('express');
const path = require('path');
const SWA = require('spotify-web-api-node'); //Node Spotify Wrapper

const FriendSync = require('./friendsync.js'); // Code for FriendSync feature

const app = express();

var spotifyApi = new SWA({
   clientId: process.env.SPOTIFY_CLIENT_ID,
   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
   redirectUri: 'http://localhost:8888/callback'
});

app.use(express.static(path.join('..', 'frontend', 'build')));

const hostname = '127.0.0.1';
const port =  process.env.PORT || 1337;

/**
app.get('/', function (req, res) {
   res.sendFile(path.join('..', 'frontend', 'public', 'index.html')); 
});
*/



// Endpoints for friendsync feature
app.get('/friendsync/invite/:userid', function (req, res) {
    res.send(FriendSync.invite(req.params.userid));
});





// Run server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
