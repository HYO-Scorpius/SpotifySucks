
import React from 'react'
import './MusicPlayer.css';



function MusicPlayer(props) {
    return(
        <div> 
            <div className="footer">
                <hr />
                <img src={props.logo} className="albumImage" alt="logo" />
                <h1> Now playing {props.song} </h1>
            </div> 
        </div>

    )
    
}

export default MusicPlayer