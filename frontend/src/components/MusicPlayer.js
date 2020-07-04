import React, { useState, useEffect } from 'react';
import logo from './../logo.svg';
import './MusicPlayer.css';


// Class components should always call base consturctor with props
function MusicPlayer({
  apiToken,
}) {


  const [player, setPlayer] = useState(null);
  const [deviceID, setDeviceID] = useState("");
  const [token, setToken] = useState("");

  window.onSpotifyWebPlaybackSDKReady = () => {
    //let token = apiToken;
  //  const token = 'BQCRCPfjLP5t2LiMU7aaGIhp-DawYZlZpnhZRKdV8AChhdI9lVFJWT-Zye6CYqQuXxk4nXJyVkA52oRkYhi-fvAauqI-9SUr3nDPxKNnmn105KmSm0_4win5JMHqM9YUwGokqBwkEf6d0aNj76-mgPTE03EGQi0vMepp-YG-urf_WbwpCVNvEVk';
const token = 'BQAgf9wwdi_xQ-kvayHREPns3Bp68Vk46CJ2aqZGi5blAN1n-hBLxNW8-cMNKOtWwX-s7CQRsC9zGU79k-bXfS3v79OjZblL79kgzVYoP7vwE8rdN65XnqlUqkUyRteDYchBzEozbW6HGXsAzohZyS05DHBwNnGlsSh9A3WIjwhK3YyXzs-BQleY2MwM';
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

  useEffect(() => {
  getCurrentPlayback();
  }, []); 


  async function getCurrentPlayback(){
    fetch('https://api.spotify.com/v1/me/player/currently-playing', { 
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      }})
    .then(res => res.json())  
    .then(json => {  
      console.log("JSON",json);
    }).catch(function() {
      console.log("Error with current playback");
  });
  }

  // Chooses web app as the playback device
  async function transferUsersPlayback() {
    let request = fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceID ],
        "play": false,
      }),
    }).then(async (res) => {
      const data = await res.json();
      console.log("POST JSON", data)
    });
    console.log("TRANSFER");
    console.log("REQBODY", request.json);
    pause();
  }

  // Start the music player
  async function startUserPlayback() {
    transferUsersPlayback();

  await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_id": [ deviceID ],
      }),
    }).then(async (res) => {
      const data = await res.json();
      console.log("POST JSON", data)
    });

    console.log(`Bearer ${token}` );
    console.log("DeviceID", deviceID);
    
    getCurrentPlayback();
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
         <button onClick={transferUsersPlayback}>Start</button>
         <button onClick={seekTrack} > Next Track</button>
        </p>
      </div>

    </div>
  );
}


export default MusicPlayer