import React, { useState, useEffect } from "react";
import logo from "./../logo.svg";
import "./MusicPlayer.css";

// Class components should always call base consturctor with props
function MusicPlayer({spotifyApi}) {
  const [player, setPlayer] = useState(null);
  const [deviceID, setDeviceID] = useState("");
  const [token, setToken] = useState("");
  const [progress, setSeconds] = useState(0);
  const [currentPlayback, setCurrentPlayback] = useState({duration:0,
    position:0,
    paused: true,
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
      console.log(state); // Print out json containing track state

      let playlist = state.context.metadata.context_description

      // Get information from json
      const { duration, position, paused} = state;
      const {
        current_track,
        next_tracks: [next_track],
      } = state.track_window;
      const {
        artists,
        album,
      } = state.track_window.current_track;

      let artist_name = artists.map(artist => artist.name).join(", ")
      let track_name = current_track.name;
      let image_url = album.images[1].url;

      // Pass to currentPlayback to be used in html
      setCurrentPlayback({
        duration,
        position,
        paused,
        artist_name,
        track_name,
        playlist,
        image_url,
      });

      setSeconds(position)

      // Testing
      console.log("TRACK NAME", track_name);
      console.log("ARTIST NAME(S)", artist_name);
      console.log("DURATION", duration);
      console.log("SRC", image_url);
      console.log("PLAYLIST", playlist)
    });

    // Ready
    player.addListener("ready", async ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      setDeviceID(device_id);
      
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

  function getCurrentPlayback() {
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("JSON", json);
      })
      .catch(function () {
        console.log("Error with current playback");
      });
  }

  // Chooses web app as the playback device
  function transferUsersPlayback() {
    let request = fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_ids: [deviceID],
        play: true,
      }),
    });
  }

  // Start the music player
  function startUserPlayback() {
    transferUsersPlayback();
  }

  // Skip to the next track
  function seekTrack() {
    player.nextTrack().then(() => {
      console.log("Skipped to next track!");
      console.log("Seek device id", deviceID);
    });
  }

  // Go back to the previous track
  function prevTrack() {
    player.previousTrack().then(() => {
      console.log("Set to previous track!");
    });
  }

  // Pause the player
  function pause() {
    player.pause().then(() => {
      console.log("Paused!");
    });
  }

  // update progress bar every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentPlayback.paused) setSeconds(progress => progress + 1000);
    }, 1000);
    return () => clearInterval(interval);
  });


  // javascript conditional { boolean ?() : () }
  return (
    <div className="footer">

      <div className="info">
        <div className="album_info">
          <img
            src={currentPlayback.image_url}
            className="albumImage"
            alt="logo"
          />
        </div>
  
        <div className="track_info popup">
          <p> {currentPlayback.track_name}</p>
          <span className="popuptext" id="myPopup">{currentPlayback.track_name} <br></br> {"by " + currentPlayback.artist_name} <br></br> {"from " + currentPlayback.playlist} </span>
          <p style={{fontSize:12}}> {currentPlayback.artist_name}</p>
          <p style={{fontSize:10, fontWeight:"bold", color:"#2FA7A4"}}> {currentPlayback.playlist}</p>
        </div>
      </div>
      

      <div className="player">
        <p className="player_controls">
          <button className="playerButton" onClick={prevTrack}><i className="fas fa-step-backward"></i></button>
          {!currentPlayback.paused && <button className="playerButton" onClick={pause}><i className="far fa-pause-circle"></i></button>}
          {currentPlayback.paused && <button className="playerButton" onClick={startUserPlayback}><i className="far fa-play-circle"></i></button>}
          <button className="playerButton" onClick={seekTrack}><i className="fas fa-step-forward"></i></button>
        </p>
      <ProgressBar currentPlayback={currentPlayback} progress={progress} />
      </div>
      
    </div>
  );
}

function ProgressBar({currentPlayback, progress}) {

  function msToMinAndSec(s) {
    s = (s - s % 1000) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    return mins + ':' + ((Math.log(secs) * Math.LOG10E + 1 | 0) > 1 ? secs : "0" + secs);
  }

  return(
    <div className="progressBar">
      <p style={{paddingRight:2}} className="progressText">{msToMinAndSec(progress)}</p>
      <input style={{margin:0}} value={progress} max={currentPlayback.duration} min="0" step="1000" type="range" disabled></input>
      <p style={{paddingLeft:2}} className="progressText">{msToMinAndSec(currentPlayback.duration)}</p>
    </div>
    
  )

}

export default MusicPlayer;
