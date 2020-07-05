import React, { useState, useEffect } from "react";
import logo from "./../logo.svg";
import "./MusicPlayer.css";

// Class components should always call base consturctor with props
function MusicPlayer({ apiToken }) {
  const [player, setPlayer] = useState(null);
  const [deviceID, setDeviceID] = useState("");
  const [token, setToken] = useState("");
  const [currentPlayback, setCurrentPlayback] = useState({duration:0,
    position:0,
    artist_name:"Artist",
    track_name:"Track Name",
    image_url:'https://via.placeholder.com/60'});

  window.onSpotifyWebPlaybackSDKReady = () => {
    let token = apiToken;
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

      // Get information from json
      const { duration, position } = state;
      const {
        current_track,
        next_tracks: [next_track],
      } = state.track_window;
      const {
        artists: [artists],
        album,
      } = state.track_window.current_track;

      let artist_name = artists.name;
      let track_name = current_track.name;
      let image_url = album.images[1].url;

      // Pass to currentPlayback to be used in html
      setCurrentPlayback({
        duration,
        position,
        artist_name,
        track_name,
        image_url,
      });

      // Testing
      console.log("TRACK NAME", track_name);
      console.log("ARTIST NAME", artist_name);
      console.log("DURATION", duration);
      console.log("SRC", image_url);
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
      console.log("Login Token Passed", apiToken);
      console.log("Token variable", token);
    });
  }

  // javascript conditional { boolean ?() : () }
  return (
    <div className="footer">
      <div className="album_info">
        <img
          src={currentPlayback.image_url}
          className="albumImage"
          alt="logo"
        />
      </div>

      <div className="track_info">
        <p> {currentPlayback.track_name}</p>
        <p> {currentPlayback.artist_name}</p>
      </div>

      <div className="player_controls">
        <p>
          <button onClick={prevTrack}> Previous Track</button>
          <button onClick={pause}>Pause</button>
          <button onClick={startUserPlayback}>Start</button>
          <button onClick={seekTrack}> Next Track</button>
        </p>
      </div>
      
    </div>
  );
}

export default MusicPlayer;
