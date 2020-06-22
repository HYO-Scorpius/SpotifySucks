import React, { useState, useEffect } from 'react';
import logo from './../logo.svg';
import './MusicPlayer.css';


// Class components should always call base consturctor with props
function MusicPlayer({
  apiToken,
}) {


  const [status, changeStatus] = useState(false);
  const [player, setPlayer] = useState(null);
  const [deviceID, setDeviceID] = useState("");
  const [token, setToken] = useState("");

  // Get token from here https://developer.spotify.com/documentation/web-playback-sdk/quick-start/ (temporary)
  window.onSpotifyWebPlaybackSDKReady = () => {
    //const token = 'BQC1T8hpf1jRL6mohpYprw6lNMorxeRJIlmMCsQwS6E8hnL9GAWkt-UEAfHXohlw9oZQVLV1lQT_3XX6OLh_6cyYM227BvU-mTzMusuYeaXJlZwI5K1OKH0ewtf04Iuqi0RbitI9_XSKbNFzpGQvn7AWxflMk3IxAGQc81nio9rNk8AG9v81PvY';
    let token = apiToken;
    const player = new window.Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); },
    });

    // Update state hooks
    setPlayer(player);
    setToken(token);

    // SDK Error handling
    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });

    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
    });

    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });

    player.addListener("playback_error", ({ message }) => {
      console.error(message);
    });

    player.addListener('player_state_changed', state => {
       console.log(state); 
    });

    // Ready
    player.addListener('ready', async ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      setDeviceID(device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });


    // Connect to the player!
    player.connect().then(success => {
      if (success) {
        console.log('The Web Playback SDK successfully connected to Spotify!');
      }
    })

  }

  // Chooses web app as the playback device
  function transferUsersPlayback() {
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceID ],
        "play": true,
      }),
    });

  }

  // Start the music player
  function startUserPlayback() {
    transferUsersPlayback();

    fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_id": [ deviceID ],
      }),
    });

    console.log(`Bearer ${token}` );
    console.log("DeviceID", deviceID);

  }


  // Skip to the next track
  function seekTrack() {
    player.nextTrack().then(() => {
      console.log('Skipped to next track!');
      console.log("Seek device id" , deviceID);
    });
  }

  // Go back to the previous track
  function prevTrack() {
    player.previousTrack().then(() => {
      console.log('Set to previous track!');
    });
  }


  // Pause the player
  function pause() {
    player.pause().then(() => {
      console.log('Paused!');
      console.log(apiToken);
      console.log(token);
    });
  }



  // javascript conditional { boolean ?() : () }
  return (
    <div className="footer">

      <div>
        <img src={logo} className="albumImage" alt="logo" />
        <p><a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify" target="_blank" > https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify </a></p>
        <p>
         <button onClick={prevTrack} > Previous Track</button>
         <button onClick={pause}>Pause</button>
         <button onClick={startUserPlayback}>Start</button>
         <button onClick={seekTrack} > Next Track</button>
        </p>
      </div>

    </div>
  );
}


export default MusicPlayer