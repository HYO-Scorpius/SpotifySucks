import React, { useState, useEffect } from "react";
import "./MusicPlayer.css";
import {msToMinAndSec} from './../helper'

// Class components should always call base consturctor with props
function MusicPlayer({
  spotifyApi,
  loading,
  deviceID,
  progress,
  currentPlayback,
  setProgress
}) {

  // Play song already loaded
  function startUserPlayback() {
    spotifyApi.play();
  }

  // Pause the player
  function pause() {
    spotifyApi.pause().then(() => {
      console.log("Paused!");
    });
  }

  // toggle shuffle
  function toggleShuffle() {
    spotifyApi.setShuffle(!currentPlayback.shuffle);
  }

  // Skip to the next track
  function seekTrack() {
    spotifyApi.skipToNext().then(() => {
      console.log("Skipped to next track!");
      console.log("Seek device id", deviceID);
    });
  }

  // Go back to the previous track
  function prevTrack() {
    spotifyApi.skipToPrevious().then(() => {
      console.log("Set to previous track!");
    });
  }

  // select repeat mode
  function repeatMode() {
    let mode = "";
    if (currentPlayback.repeat_mode === 2) mode = "off";
    else if (currentPlayback.repeat_mode === 1) mode = "track"
    else mode = "context"
    spotifyApi.setRepeat(mode)
  }

  // Seek To Position In Currently Playing Track
  function seekPosition(value) {
    spotifyApi.seek(value).then(() => {
      console.log("Seeked position " + value)
    })
  }

  // update progress bar every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentPlayback.paused) setProgress(progress => progress + 1000);
    }, 1000);
    return () => clearInterval(interval);
  });

  // javascript conditional { boolean ?() : () }
  return (
    <div className="footer">

      <div className="loading" style={{visibility: loading}}>
        <img src={require('./img/loading.gif')} ></img>
      </div>

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
          {/* shuffle and repeat buttons not working yet */}
          <button className="playerButton" onClick={toggleShuffle} style={{color: currentPlayback.shuffle ? "#2FA7A4" : "white"}}>
            <i className="fas fa-random"></i>
          </button>

          <button className="playerButton" onClick={prevTrack}>
            <i className="fas fa-step-backward"></i>
          </button>

          {!currentPlayback.paused && <button className="playerButton" onClick={pause}><i className="far fa-pause-circle"></i></button>}
          {currentPlayback.paused && <button className="playerButton" onClick={startUserPlayback}><i className="far fa-play-circle"></i></button>}

          <button className="playerButton" onClick={seekTrack}>
            <i className="fas fa-step-forward"></i>
          </button>

          {(currentPlayback.repeat_mode === 2) &&
            <button onClick={repeatMode} className="playerButton"> 
              <img src={require("./img/repeat.svg")}></img>
            </button>}

          
          { (currentPlayback.repeat_mode === 1) &&
            <button onClick={repeatMode} className="playerButton" style={{color: "#2FA7A4" }}>
            <i className="fas fa-retweet"></i>
            </button>}
          
          { (currentPlayback.repeat_mode === 0) &&
            <button onClick={repeatMode} className="playerButton" style={{color: "white" }}>
            <i className="fas fa-retweet"></i>
            </button>}

        </p>

        <div className="progressBar">
          <p style={{paddingRight:2}} className="progressText">{msToMinAndSec(progress)}</p>
          <input style={{margin:0}} value={progress} max={currentPlayback.duration} min="0" type="range" step="1000" onChange={e => seekPosition(e.target.value)}></input>
          <p style={{paddingLeft:2}} className="progressText">{msToMinAndSec(currentPlayback.duration)}</p>
        </div>

      </div>
      
    </div>
  );
}

export default MusicPlayer;
