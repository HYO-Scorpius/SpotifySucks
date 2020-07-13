require("dotenv").config();
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const SWA = require('spotify-web-api-node'); //Node Spotify Wrapper
const FriendSync = require('./Modules/friendsync.js'); // Code for FriendSync feature
const SocketIO = require('socket.io');
const shuffle = require('./Modules/shuffle');
const cookieParser = require('cookie-parser'); // Module to Write Cookies
const PORT = process.env.PORT || 1337;
const HOSTNAME = '127.0.0.1';
const uri = process.env.ATLAS_URI;
const connection = mongoose.connection;

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
   .use(cookieParser());


//////////////////////////////////////////////////////////////////////////////////////////////////
// Spotify Authentication
//////////////////////////////////////////////////////////////////////////////////////////////////


var scopes = ['user-read-private',
   'user-read-email',
   'playlist-modify-private',
   'ugc-image-upload',
   'playlist-read-collaborative',
   'playlist-modify-private',
   'playlist-modify-public',
   'playlist-read-private',
   'user-read-playback-position',
   'user-read-recently-played',
   'user-top-read',
   'user-modify-playback-state',
   'user-read-currently-playing',
   'user-read-playback-state',
   'user-read-private',
   'user-read-email',
   'user-library-modify',
   'user-library-read',
   'user-follow-modify',
   'user-follow-read',
   "streaming"]


   clientID = process.env.SPOTIFY_CLIENT_ID,
   clientSECRET = process.env.SPOTIFY_CLIENT_SECRET,
   state = 'mikeamysyedkenny';
//TODO(kenny): make state random

var spotifyApi = new SWA({
   clientId: clientID,
   clientSecret: clientSECRET,
   redirectUri: 'http://localhost:1337/callback'
});

var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);


// Redirects to authorize URL
app.get('/spotify/login', (_, res) => {
   res.cookie('auth_state', state);
   res.redirect(authorizeURL);
});


// Spotify callback endpoint
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
         res.cookie('api_token', a_token, {maxAge: 3600000});
         res.cookie('refresh_token', r_token);

         res.redirect('http://localhost:3000/');
      },
      (err) => {
         console.log('backend::app.js::/callback spotifyApi.authorizationCodeGrant failed. Error: ', err);
      });
});


//Refresh spotify access token
app.get('/refresh', (_, res) =>{
   res.send("go away");
   spotifyApi.refreshAccessToken().then (
      (data) => {
         let a_token = data.body['access_token'];
         spotifyApi.setAccessToken(a_token);

         res.cookie('api_token', a_token, {maxAge: 3600000});
      },
      (err) => {
         console.log('backend::app.js::/refresh spotifyApi.refreshAccessToken failed. Error: ', err);
      });
});


//Logout for dev purposes for now
app.get('/logout', (_, res) =>{
   res.clearCookie('api_token');
   console.log("hit");
   res.send("hi");
});

//////////////////////////////////////////////////////////////////////////////////////////////////
// Shuffle
//////////////////////////////////////////////////////////////////////////////////////////////////
   
app.get('/api/:access_token/shuffle/types/:type/user/:userId/playlists/:playlistId/replace/:replace', (req, _) => {
   spotifyApi.setAccessToken(req.params.access_token);
   spotifyApi.getPlaylist(req.params.playlistId).then (
      (data) => {
         let URIs = shuffle(req.params.type, data.body.tracks.items);
         makePlaylist(spotifyApi, req.params.userId, data.body, URIs, req.params.replace === 'yes', req.params.type);
      },
   (err) =>{
   console.log(err);
   });
});


const makePlaylist = (api, user, playlist,  URIs, replace, type) => {
   let playlistName = playlist.name;
   let playlistDets = playlist.name;
   if (replace) {
      let replaceURIs = [];
      URIs.forEach((uri) => {
         let objRet = {};
         objRet['uri'] = uri;
         replaceURIs.push(objRet);
      });
      api.removeTracksFromPlaylist(playlist.id, replaceURIs).then(
         (_) => {
            fillPlaylist(api, URIs, playlist);
         },
         (err) => {
            console.log("server.js::makePlaylist removeTracksFromPlaylist failed error: ",err);
         }); 
   } 
   else {
      playlistName += ` [${type} shuffle]`;
      if (type != "random")
      {
         playlistDets += ` shuffled  by ${type} because Spotify Sucks (not really, their API is actually pretty cool)`;
      }
      else
      {
         playlistDets += " shuffled without bias because Spotify Sucks (not really, their API is actually pretty cool)";
      }

      api.createPlaylist(user, playlistName, {public: false, description: playlistDets}).then(
      (data) => {
         fillPlaylist(api, URIs, data.body);
      }, 
      (err) => {
         console.log("server.js::makePlaylist createPlaylist failed error: ",err);
      });
   }
}


const fillPlaylist = (api, URIs, playlist) => {
   api.addTracksToPlaylist(playlist.id, URIs).then (
      (_) => {
      },
      (err) => {
         console.log("server.js::fillPlaylist error: ",err);
      });
}
   





//////////////////////////////////////////////////////////////////////////////////////////////////
// FriendSync Endpoints
//////////////////////////////////////////////////////////////////////////////////////////////////

const io = SocketIO();


/**
 * Creates namespace and places it in FriendSync mapped to groupid
 */
app.get('/friendsync/create_group/:groupid', function (req, res) {
   console.log(`Creating group: ${groupid}`);
   const nsp = io.of(`/${groupid}`);

   nsp.on('connection', function (socket) {
      nsp.emit(`${socket.id} connected!`);
   });

   nsp.on('PLAY', function() {
      nsp.emit(`PLAY`);
   });

   nsp.on(`PAUSE`, function () {
      nsp.emit(`PAUSE`);
   });

   nsp.on(`SKIP`, function () {
      nsp.emit('SKIP');
   });

   nsp.on(`PREV`, function () {
      nsp.emit(`PREV`);
   });

   FriendSync.add_group(groupid, nsp);

   res.send(`/${groupid}`);
});


/**
 * Invites user to synchronize playback
 * 
 * @param groupid ID of group user is invited to
 * @param userid Spotify ID of user to invite
 */
app.get('/friendsync/invite/:groupid&:userid', function (req, res) {
    //res.send(FriendSync.invite(req.params.userid));
    console.log(`FriendSync invite: ${groupid}, ${userid}`);
});


/**
 * Removes user from group
 * 
 * @param groupid ID of synchronized group
 * @param userid Spotify ID of user to remove from group
 */
app.get('/friendsync/leave/:groupid&:userid', function (req, res) {
   console.log(`Friendsync leave group: ${req.params.groupid}, ${req.params.userid}`);
});







//////////////////////////////////////////////////////////////////////////////////////////////////
// Database
//////////////////////////////////////////////////////////////////////////////////////////////////

app.use(cors());
app.use(express.json());

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(err));

connection.once('open', () => {
  console.log("Mongo database connection established");
})

// Loads the routes from other files
const queueRoute = require('./routes/queue');
const usersRoute = require('./routes/users');

// Defining endpoints to use
app.use('/queue', queueRoute);
app.use('/users', usersRoute);

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

