import React, { useState, useEffect } from "react";
import "./MusicPlayer.css";
import {msToMinAndSec} from './../helper'
//import { act } from "react-dom/test-utils";

// Class components should always call base consturctor with props
function MusicPlayer({
	spotifyApi,
	loading,
	deviceID,
	progress,
	setProgress,
	currentPlayback,
    token
}) {

    const [devices, setDevices] = useState([])
    const [popup, setPopup] = useState(false)

    useEffect( () => {
        if (token) {
            // get available devices
            spotifyApi.getMyDevices().then(
                data =>  setDevices(data.devices)
            ).catch( err => console.log(err))
        }
    }, [token, spotifyApi, deviceID, currentPlayback])

    function togglePopup() {
        setPopup( state => (!state))
    }

	// Play song already loaded
	function startUserPlayback() {
		if (currentPlayback.connected) {
			spotifyApi.play({
				"device_id": deviceID
			}).catch(err => console.log(err));
		} else {
			spotifyApi.transferMyPlayback([deviceID], {
				play: true
			});
		}
		
	}

	// Pause the player
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

	// Skip to the next track
	function seekTrack() {
		if (currentPlayback.connected) {
			spotifyApi.skipToNext().then(() => {
				console.log("Skipped to next track!");
				console.log("Seek device id", deviceID);
			}).catch(err => console.log(err));
		}
		
	}

	// Go back to the previous track
	function prevTrack() {
		if (currentPlayback.connected) {
            if (progress < 3000) {
                spotifyApi.skipToPrevious().then(() => {
    				console.log("Set to previous track!");
    			}).catch(err => console.log(err));
            } else {
                spotifyApi.seek(0).catch(err => console.log(err));
            }
			
		}
		
	}

	// select repeat mode
	function repeatMode() {
		if (currentPlayback.connected) {
			let mode = "";
			if (currentPlayback.repeat_mode === 2) mode = "off";
			else if (currentPlayback.repeat_mode === 1) mode = "track"
			else mode = "context"
			spotifyApi.setRepeat(mode).catch(err => console.log(err));
		}
		
	}

	// Seek To Position In Currently Playing Track
	function seekPosition(value) {
		if (currentPlayback.connected) {
			spotifyApi.seek(value).then(() => {
				console.log("Seeked position " + value)
			}).catch(err => console.log(err));
		}
		
	}

	// update progress bar every second
	useEffect(() => {
		const interval = setInterval(() => {
			if (!currentPlayback.paused) setProgress(progress => progress + 1000);
		}, 1000);
		return () => clearInterval(interval);
	},[token, setProgress, currentPlayback.paused]);

	// javascript conditional { boolean ?() : () }
	return (

        <div>

            <div className="footer">
            
                <div className="loading" style={{visibility: loading}}>
                    <img alt= "loading" src={require('./img/loading.gif')} ></img>
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
                        {!currentPlayback.connected && <p style={{fontSize:10, fontWeight:"bold"}}>Disconnected - click play to connect</p> }
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
                                <img alt="repeat" src={require("./img/repeat.svg")}></img>
                            </button>}
                
                        
                        { (currentPlayback.repeat_mode === 1) &&
                            <button onClick={repeatMode} className="playerButton" style={{color: "#2FA7A4" }}>
                            <i className="fas fa-retweet"></i>
                            </button>}
                        
                        { (currentPlayback.repeat_mode === 0) &&
                            <button onClick={repeatMode} className="playerButton">
                            <i className="fas fa-retweet"></i>
                            </button>}
                
                    </p>
                
                    <div className="progressBar">
                        <p style={{paddingRight:2}} className="progressText">{msToMinAndSec(progress)}</p>
                        <input style={{margin:0}} value={progress} max={currentPlayback.duration} min="0" type="range" step="1000" onChange={e => seekPosition(e.target.value)}></input>
                        <p style={{paddingLeft:2}} className="progressText">{msToMinAndSec(currentPlayback.duration)}</p>
                    </div>
                
                </div>
                
                <div className="device">
                    <button onClick={togglePopup} className="playerButton device-button" style={{color: "white", marginLeft:"auto" }}>
                        <img alt="speaker" style={{ marginLeft:"auto" }} src={require("./img/speaker.svg")}></img>
                    </button>
                </div>    

            </div>

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

    const device_id = device.id

    function tranfer() {
        spotifyApi.transferMyPlayback([device_id]);
    }

    return(
        <p onClick={tranfer} style={{color: device.is_active? "#27918f" : "white"}}> <i className="fas fa-desktop marginIcon"></i> {device.name} </p>
    )

}

export default MusicPlayer;
