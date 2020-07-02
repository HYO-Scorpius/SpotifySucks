import React, { useState, useEffect } from 'react';
import SWA from 'spotify-web-api-node';
import './App.css';
import Playlist from './components/Playlist';
import MusicPlayer from './components/MusicPlayer'
import Tabs from './components/Tabs';
import FriendSyncTab from './components/FriendSyncTab';
import MultiPlaylistTab from './components/MultiPlaylistTab';
import { getCookie } from './helper';
const spotifyApi = new SWA();

function App() {
   const [apiToken, setApiToken] = useState(null);
   const [user, setUser] = useState({});
   const [playlists, setPlaylists] = useState([]);


   useEffect(() => {
      //regularly get api token
      const token = getCookie('api_token') || null;
      if (token) {
         setApiToken(token);
         spotifyApi.setAccessToken(token);
      }
    },[]);

   useEffect(() => {
     //regularly get user
      spotifyApi.getMe().then(
         (data) => {
            if (data.body) {
               setUser(data.body);
            }
         },
         (err) => {
            console.log('frontend::App.js spotifyApi.getMe() failed. Error: ', err);
         });

      //regularly get user playlist
      spotifyApi.getUserPlaylists().then(
         (data) => {
            if (data.body) {
               setPlaylists(data.body.items);
               console.log(data.body.items);
            }
         },
         (err) => {
            console.log('frontend::App.js spotifyApi.getUserPlaylists() failed. Error: ', err);
         });

   },[]);


  return (
     <div>
      <Tabs> 
        <div label="Shuffle"> 
           <Playlist
              playlists = {playlists} 
              apiToken = {apiToken}
           />
        </div>
        <div label="MultiPlaylist">
        <MultiPlaylistTab />
        </div>
        <div label="Friendsync">
        <FriendSyncTab />
        </div>
        <div label="VanillaPlaylist">
          leaving empty until the other three are done
        </div>
      </Tabs>
        <MusicPlayer apiToken = {apiToken}/>
    </div>
  );
}

export default App;
