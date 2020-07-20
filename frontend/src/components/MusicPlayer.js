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

    var interval;
    

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
            if (progress <= 3000) {
                spotifyApi.skipToPrevious().then(() => {
    				console.log("Set to previous track!");
    			}).catch(err => console.log(err));
            } else {
                clearInterval(interval)
                setProgress(0)
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

	// seek to position in currently playing track
	function seekPosition(values) {
        spotifyApi.seek(parseInt(values[0])).then(() => {
            console.log("Seeked position " + values[0])
        }).catch(err => console.log(err));
    }

    // update progress bar while dragging slider without calling api
    function cooperatePls(values) {
        setProgress(parseInt(values[0]))
    }

    // set volume
    function changeVolume(values) {
        spotifyApi.setVolume(parseInt(values[0])).catch(err => console.log(err))
    }
    

	// update progress bar every second
	useEffect(() => {
		interval = setInterval(() => {
			if (!currentPlayback.paused) setProgress(progress => progress + 100);
		}, 100);
		return () => clearInterval(interval);
	},[token, setProgress, currentPlayback, currentPlayback.paused]);

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
                

                    <div className="bar-container">
                        <p style={{paddingRight:5}} className="progressText">{msToMinAndSec(progress)}</p>
                        <div className="progressBar">
                            <Nouislider
                                accessibility
                                connect={[true,false]}
                                start={progress}
                                onChange={seekPosition}
                                onSlide={cooperatePls}
                                onStart={clearInterval(interval)}
                                range={{
                                min: 0,
                                max: currentPlayback.duration+1
                                }}
                            />
                        </div>
                        <p style={{paddingLeft:5}} className="progressText">{msToMinAndSec(currentPlayback.duration)}</p>
                    </div>
                    
                
                </div>
                
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
