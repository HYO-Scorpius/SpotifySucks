require("dotenv").config();
const express = require("express");
const path = require('path');
const SWA = require('spotify-web-api-node'); //Node Spotify Wrapper
const FriendSync = require('./friendsync.js'); // Code for FriendSync feature
const cookieParser = require('cookie-parser'); // Module to Write Cookies
const PORT = process.env.PORT || 1337;
const HOSTNAME = '127.0.0.1';

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app
   .use(express.static(path.join('..', 'frontend', 'build')))
   .use(cookieParser());;


var scopes = ['user-read-private', 'user-read-email'],
   clientID = process.env.SPOTIFY_CLIENT_ID,
   clientSECRET = process.env.SPOTIFY_CLIENT_SECRET,
   state = 'mikeamysyedkenny';

var spotifyApi = new SWA({
   clientId: clientID,
   clientSecret: clientSECRET,
   redirectUri: 'http://localhost:1337/callback'
});

var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

app.get('/spotify/login', (req, res) => {
   console.log(authorizeURL);
   res.cookie('auth_state', state);
   res.redirect(authorizeURL);
});

app.get('/hey', (req, res) => {
   console.log("here");
   res.send('hi');
});


app.get('/callback', (req, res) => {
   spotifyApi.authorizationCodeGrant(req.query.code).then(
      (data) => {
         let a_token = data.body['access_token'];
         let r_token = data.body['refresh_token'];

         console.log('The token expires in ' + data.body['expires_in']);
         console.log('The access token is ' + a_token);
         console.log('The refresh_token is ' + data.body['refresh_token']);

         spotifyApi.setAccessToken(a_token);
         spotifyApi.setRefreshToken(r_token);

         res.cookie('api_token', a_token);
         res.cookie('refresh_token', r_token);

         res.redirect('http://localhost:3000/');
      },
      (err) => {
         console.log('backend::app.js::/callback spotifyApi.authorizationCodeGrant failed', err);
      }
   );
});


// Endpoints for friendsync feature
app.get('/friendsync/invite/:userid', function (req, res) {
    res.send(FriendSync.invite(req.params.userid));
});


app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

