import React, { useState, useEffect } from "react";
import "./MusicPlayer.css";
import {msToMinAndSec} from './../helper'
import Nouislider from "nouislider-react";
import "./nouisliderModified.css";
//import { act } from "react-dom/test-utils";

// Class components should always call base consturctor with props
function MusicPlayer({
    spotifyApi,
    loading,
    deviceID,
    progress,
    setProgress,
    currentPlayback,
    token,
    volume
}) {
    
    const [devices, setDevices] = useState([])
    const [popup, setPopup] = useState(false)
    
    // get available devices
    useEffect( () => {
        if (token) {
            spotifyApi.getMyDevices().then(
                    data =>  setDevices(data.devices)
            ).catch( err => console.log(err))
        }
    }, [token, spotifyApi, deviceID, currentPlayback])
        
    // toggle device popup
    function togglePopup() {
        setPopup( state => (!state))
    }
    
    // play song
    function startUserPlayback() {
        if (currentPlayback.connected) {
            // if player already connected, play already loaded song
            spotifyApi.play({
                device_id: deviceID
            }).catch(err => console.log(err));
        } else {
            // else transfer playback
            spotifyApi.transferMyPlayback([deviceID], {
                play: true
            });
        }
    }
    
    // pause the player
    function pause() {
        spotifyApi.pause().then(() => {
            console.log("Paused!");
        }).catch(err => console.log(err));
    }
    
    // toggle shuffle
    function toggleShuffle() {
        if (currentPlayback.connected) {
            spotifyApi.setShuffle(!currentPlayback.shuffle).catch(err => console.log(err));
        }
    }
        
    // skip to the next track
    function seekTrack() {
        if (currentPlayback.connected) {
            spotifyApi.skipToNext().then(() => {
                console.log("Skipped to next track!");
            }).catch(err => console.log(err));
        }
        
    }
        
    // function associated to "previous" button
    function prevTrack() {
        if (currentPlayback.connected) {
            // if progress less or equal to 3s then go to previous track
            // else go back to beginning of current track
            if (progress <= 3000) {
                spotifyApi.skipToPrevious().then(() => {
                    console.log("Set to previous track!");
                }).catch(err => console.log(err));
            } else {
                setProgress(0)
                spotifyApi.seek(0).catch(err => console.log(err));
            }
            
        }
    }
        
    // select repeat mode
    function repeatMode() {
        if (currentPlayback.connected) {
            let mode = ""
            // if current is repeating track, turn repeat off
            if (currentPlayback.repeat_mode === 2) mode = "off"
            // if current is repeating context, repeat track
            else if (currentPlayback.repeat_mode === 1) mode = "track"
            // if repeat is currently off, repeat context
            else mode = "context" 
            spotifyApi.setRepeat(mode).catch(err => console.log(err));
        }
        
    }
        
    // seek to position determined by slider in currently playing track
    function seekPosition(values) {
        spotifyApi.seek(parseInt(values[0])).then(() => {
            console.log("Seeked position " + values[0])
        }).catch(err => console.log(err));
    }
    
    // update progress bar while dragging slider without calling api
    function dragSlider(values) {
        setProgress(parseInt(values[0]))
    }
    
    // set volume of player
    function changeVolume(values) {
        spotifyApi.setVolume(parseInt(values[0])).catch(err => console.log(err))
    }
        
        
    // update progress bar every 100 ms if playback not paused
    useEffect(() => {
        const interval = setInterval(() => {
            if (!currentPlayback.paused) setProgress(progress => progress + 100);
        }, 100);
        return () => clearInterval(interval);
    },[token, setProgress, currentPlayback]);
        
    return (
        
        <div>
        
            <div className="footer">
            
                {/* loading screen until player is ready */}
                <div className="loading" style={{visibility: loading}}>
                    <img alt= "loading" src={require('./img/loading.gif')} />
                </div>
                
                {/* song info */}
                <div className="info">
                    <div className="album_info">
                        <img
                        src={currentPlayback.image_url}
                        className="albumImage"
                        alt="logo"
                        />
                    </div>
                
                    <div className="track_info popup">
                        {!currentPlayback.connected && <p style={{fontSize:10, fontWeight:"bold"}}>Disconnected - click play to connect</p> }
                        <p> {currentPlayback.track_name}</p>
                        <span className="popuptext" id="myPopup">{currentPlayback.track_name} <br></br> {"by " + currentPlayback.artist_name} <br></br> {"from " + currentPlayback.playlist} </span>
                        <p style={{fontSize:12}}> {currentPlayback.artist_name}</p>
                        <p style={{fontSize:10, fontWeight:"bold", color:"#2FA7A4"}}> {currentPlayback.playlist}</p>
                    </div>
                </div>
                
                {/* buttons to control player: shuffle, play/pause, repeat */}
                <div className="player">
                
                    <p className="player_controls">
                    
                        <button className="playerButton" onClick={toggleShuffle} style={{color: currentPlayback.shuffle ? "#2FA7A4" : "white"}}>
                            <i className="fas fa-random"/>
                        </button>
                        
                        <button className="playerButton" onClick={prevTrack}>
                            <i className="fas fa-step-backward"/>
                        </button>
                        
                        {!currentPlayback.paused && <button className="playerButton" onClick={pause}><i className="far fa-pause-circle"/></button>}
                        {currentPlayback.paused && <button className="playerButton" onClick={startUserPlayback}><i className="far fa-play-circle"/></button>}
                        
                        <button className="playerButton" onClick={seekTrack}>
                            <i className="fas fa-step-forward"/>
                        </button>
                    
                        {(currentPlayback.repeat_mode === 2) &&
                            <button onClick={repeatMode} className="playerButton"> 
                                <img alt="repeat" src={require("./img/repeat.svg")}/>
                            </button>
                        }
                        
                        
                        { (currentPlayback.repeat_mode === 1) &&
                            <button onClick={repeatMode} className="playerButton" style={{color: "#2FA7A4" }}>
                                <i className="fas fa-retweet"/>
                            </button>
                        }
                            
                        { (currentPlayback.repeat_mode === 0) &&
                            <button onClick={repeatMode} className="playerButton">
                                <i className="fas fa-retweet"/>
                            </button>
                        }
                        
                    </p>
                            
                            
                    {/* current position, progress bar, duration */}
                    <div className="bar-container">
                        <p style={{paddingRight:5}} className="progressText">{msToMinAndSec(progress)}</p>
                        <div className="progressBar">
                            <Nouislider
                                accessibility
                                connect={[true,false]}
                                start={progress}
                                onChange={seekPosition}
                                onSlide={dragSlider}
                                range={{
                                    min: 0,
                                    max: currentPlayback.duration+1
                                }}
                            />
                        </div>
                        <p style={{paddingLeft:5}} className="progressText">{msToMinAndSec(currentPlayback.duration)}</p>
                    </div>
                            
                            
                </div>
                            
                {/* volume slider + device icon */}
                <div className="device">
                    <div className="volume-bar">
                        <i className="fas fa-volume-down playerButton"/>
                        <div className="volume-progress">
                            <Nouislider
                                accessibility
                                connect={[true,false]}
                                start={volume}
                                onChange={changeVolume}
                                step={10}
                                range={{
                                    min: 0,
                                    max: 100
                                }}
                            />
                        </div>
                        <i className="fas fa-volume-up playerButton"/>
                    </div>
                    <button onClick={togglePopup} className="playerButton device-button" style={{color: "white", marginLeft:"auto" }}>
                        <img alt="speaker" style={{ marginLeft:"auto" }} src={require("./img/speaker.svg")}/>
                    </button>
                </div>    
                    
            </div>
                    
            {/* device selection popup triggered by device icon */}
            { popup &&
                <div className="devices-available">
                    {devices.map(device => 
                        <Device key={device.id} device={device} spotifyApi={spotifyApi} />
                    )}
                    <div className="arrow"></div>
                </div> 
            }
            
        </div>

    );
}
                        
function Device({device, spotifyApi}) {
    
    function tranfer() {
        spotifyApi.transferMyPlayback([device.id]);
    }
    
    return(
        <p onClick={tranfer} style={{color: device.is_active? "#27918f" : "white"}}> <i className="fas fa-desktop marginIcon"></i> {device.name} </p>
    )
        
}
    
export default MusicPlayer;
                            