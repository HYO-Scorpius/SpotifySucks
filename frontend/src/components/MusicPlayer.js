import React, { useState, useEffect } from 'react';
import logo from './../logo.svg';
import './MusicPlayer.css';


// Class components should always call base consturctor with props
function MusicPlayer() {


  const [status, changeStatus] = useState(false);
  const [player, setPlayer] = useState(null);
  const [deviceID, setDeviceID] = useState("");
  const [token, setToken] = useState("");

  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQCBuSWC5qIePgRH_rQxG1gnaU7seLT2m4nT429WEdzo2Z_rbuZZQhho76xyA2nR2_CBv_BJ536pwd30orJTW3osX7vhZCjH0qkPCnGP3j2fSuLoFddTlospr2k57JpDLj7D2c0iJSqaCz-s5W1v2oyMCGccIbFODYqQnpWM1KqSqtQodhWBZdE';
    const player = new window.Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); },
    });
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
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      setDeviceID(device_id);

      //transferUsersPlayback(device_id);
     // skipUserPlayback(device_id);
     // startUserPlayback(device_id);
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

  function startUserPlayback() {

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
  }

  function skipUserPlayback() {
    fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_id": [ deviceID ],
      }),
    });
  }


  function seekTrack() {
    player.nextTrack().then(() => {
      console.log('Skipped to next track!');
    });
  }


  function pause() {
    player.pause().then(() => {
      console.log('Paused!');
    });
  }

  function resume() {
    player.resume().then(() => {
      console.log('Resumed!');
    });
  }


  // javascript conditional { boolean ?() : () }
  return (
    <div className="footer">

      <div>
        <img src={logo} className="albumImage" alt="logo" />
        <p> It worked! </p>

        <p>
          <button onClick={seekTrack} > nextTrack</button>
          <button onClick={pause}>Pause</button>
          <button onClick={resume}>Start</button>\
        </p>
      </div>

    </div>
  );
}


export default MusicPlayer