import React, { useState, useEffect } from 'react';
import SWA from 'spotify-web-api-js';
import './App.css';
import Playlist from './components/Playlist/Playlist';
import MusicPlayer from './components/MusicPlayer'
import Tabs from './components/Tabs';
//import FriendSyncTab from './components/FriendSyncTab';
//import MultiPlaylistTab from './components/MultiPlaylistTab';
import { getCookie } from './helper';
import MultiPlaylistTab from './components/MultiPlaylistTab';
const spotifyApi = new SWA();

function App() {
   const [user, setUser] = useState({});


   useEffect(() => {
      //regularly get api token
      const token = getCookie('api_token') || null;
      if (token) {
         spotifyApi.setAccessToken(token);
      }
   },[]);

   useEffect(() => {
     //regularly get user
      let response = spotifyApi.getMe().then(
         (data) => {
            if (data) {
               setUser(data);
            }
         },
         (err) => {
            console.log('frontend::App.js spotifyApi.getMe() failed. Error: ', err);
         });      
   },[]);

   const [loading, setLoading] = useState("visible")
   const [player, setPlayer] = useState(null);
   const [deviceID, setDeviceID] = useState("");
   const [token, setToken] = useState("");
   const [progress, setProgress] = useState(0);
   const [currentPlayback, setCurrentPlayback] = useState({duration:0,
     position:0,
     paused: true,
     shuffle: false,
     repeat_mode: 0,
     uri: "",
     id: "",
     artist_name:"Artist",
     track_name:"Track Name",
     playlist: "Playlist Name",
     image_url:'https://via.placeholder.com/60'});
 
   window.onSpotifyWebPlaybackSDKReady = () => {
     let token = spotifyApi.getAccessToken();
     //const token = 'BQAPTRddtQ8P7RI2HmKA-1EZXGZ0JUdxGi4EB0NWeSVEp8Cuhchg-d-PfIoFqKsFUwKzywI_gjM6WYq0OY2FCN3Z0snUwCvBmz5m0ALTN-YJTci5wIDoUmbnVaE8V9L8z-E0ehWiLsbDlzFv_GqKDIAg6XqBa5hVT0kIA-9FNfRa0RhV0B9TLvk';
     const player = new window.Spotify.Player({
       name: "Web Playback SDK Quick Start Player",
       getOAuthToken: (cb) => {
         cb(token);
       },
     });
 
     // Update state hooks
     setPlayer(player);
     setToken(token);
 
     // SDK Error handling
     player.addListener("initialization_error", ({ message }) => {
       console.error("Init Error", message);
     });
 
     player.addListener("authentication_error", ({ message }) => {
       console.error("Auth Error", message);
     });
 
     player.addListener("account_error", ({ message }) => {
       console.error("Acct Error", message);
     });
 
     player.addListener("playback_error", ({ message }) => {
       console.error("Playback Error", message);
     });
 
     // Add listener for current state of the music player
     player.addListener("player_state_changed", (state) => {
        if (state){ 
          console.log(state); // Print out json containing track state
    
          const playlist = state.context.metadata.context_description
          const uri = state.context.uri
    
          // Get information from json
          const { duration, position, paused, shuffle, repeat_mode } = state;
          const {
            current_track,
            next_tracks: [next_track],
          } = state.track_window;
          const {
            artists,
            album,
            id
          } = state.track_window.current_track;
    
          const artist_name = artists.map(artist => artist.name).join(", ")
          const track_name = current_track.name;
          const image_url = album.images[1].url;
          const id_opt2 = state.track_window.current_track.linked_from.id;
    
          // Pass to currentPlayback to be used in html
          setCurrentPlayback({
            duration: duration,
            position: position,
            paused: paused,
            shuffle: shuffle,
            repeat_mode: repeat_mode,
            uri: uri,
            id_opt2: id_opt2,
            id: id,
            artist_name: artist_name,
            track_name: track_name,
            playlist: playlist,
            image_url: image_url,
          });
    
          setProgress(position)
    
          // Testing
          console.log("TRACK NAME", track_name);
          console.log("ARTIST NAME(S)", artist_name);
          console.log("DURATION", duration);
          console.log("SRC", image_url);
          console.log("PLAYLIST", playlist)
     }});
     
 
     // Ready
     player.addListener("ready", async ({ device_id }) => {
       console.log("Ready with Device ID", device_id);
       setDeviceID(device_id);
       spotifyApi.transferMyPlayback([device_id]);
       setLoading("hidden");
     });
 
     // Not Ready
     player.addListener("not_ready", ({ device_id }) => {
       console.log("Device ID has gone offline", device_id);
     });
 
     // Connect to the player!
     player.connect().then((success) => {
       if (success) {
         console.log("The Web Playback SDK successfully connected to Spotify!");
       }
     });
 
   };

   return (
      <div>
         <Tabs> 
            <div label="Playlist"> 
               <Playlist
                  spotifyApi = {spotifyApi}
                  user = {user}
                  currentPlayback = {currentPlayback}
                  setCurrentPlayback = {setCurrentPlayback}
                  player = {player}
                  deviceID = {deviceID}
                  token = {token}
               />
            </div>
            <div label="MultiPlaylist">
               <MultiPlaylistTab />
            </div>
            <div label="FriendSync">
               FriendSyncTab 
            </div>
            <div label="VanillaPlaylist">
               leaving empty until the other three are done
            </div>
         </Tabs>
         <MusicPlayer  
            spotifyApi = {spotifyApi}
            loading = {loading}
            deviceID = {deviceID}
            token = {token}
            progress = {progress}
            setProgress = {setProgress}
            currentPlayback = {currentPlayback}
         />
      </div>
  );
}

export default App;
