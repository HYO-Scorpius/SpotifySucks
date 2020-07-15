import React, { useState, useEffect } from "react";
import {msToMinAndSec} from './../../helper'

function TrackList({
   tracks,
   playlist,
   spotifyApi,
   currentPlayback
}) {
  

   return (
      <div>
      {tracks.map((trackItem, index) => 
      <Track 
         trackItem={trackItem} 
         key={trackItem.track.id} 
         index={index} 
         playlist={playlist} 
         spotifyApi={spotifyApi}
         currentPlayback = {currentPlayback}
      />)} 
      </div> 
   );
}

function Track({trackItem,
   index, 
   playlist, 
   spotifyApi, 
   currentPlayback,
}) {

   const [hovered, setHover] = useState(false)
   
   function hoveredOver() {
      setHover(true)
   }

   function noHover() {
      setHover(false)
   }

   function startPlaying() {
      spotifyApi.play({
         "context_uri": playlist.uri,
         "offset": {
           "position": index
      }})
   }

   function stopPlaying() {
      spotifyApi.pause()
   }

   return (
      <div className="track-container" onMouseEnter={hoveredOver} onMouseLeave={noHover}>
         {/* pause button: selected song in selected playlist is playing */}
         {((currentPlayback.id === trackItem.track.id) || (currentPlayback.id_opt2 === trackItem.track.id))  
            && (currentPlayback.uri === playlist.uri) && !(currentPlayback.paused)
            && <p className="track-title" >
           <button onClick={stopPlaying}><i className="far fa-pause-circle marginIcon" style={{fontSize:13, marginRight: 5, color: "#2FA7A4"}}></i></button>
           { trackItem.track.name }
        </p>}
         {/* music icon: not hovered over, either selected song is paused or song not selected */}
        { !hovered && 
            ( (((currentPlayback.id === trackItem.track.id) || (currentPlayback.id_opt2 === trackItem.track.id))  && (currentPlayback.uri === playlist.uri) && (currentPlayback.paused)) 
            || !((currentPlayback.id === trackItem.track.id) || (currentPlayback.id_opt2 === trackItem.track.id))  )
            && <p className="track-title" >
           <i className="fas fa-music marginIcon" style={{fontSize:13, marginRight: 5}}></i>
           { trackItem.track.name }
        </p>}
        {/* play button: on hover if song is not selected / selected but not playing*/}
        { hovered &&
            ( (((currentPlayback.id === trackItem.track.id) || (currentPlayback.id_opt2 === trackItem.track.id))  && (currentPlayback.uri === playlist.uri) && (currentPlayback.paused)) 
            || !((currentPlayback.id === trackItem.track.id) || (currentPlayback.id_opt2 === trackItem.track.id))  )
            && <p className="track-title" >
           <button onClick={startPlaying}><i className="far fa-play-circle marginIcon" style={{fontSize:13, marginRight: 5}}></i></button>
           { trackItem.track.name }
        </p>}
         <p className="track-artist"> { trackItem.track.artists.map(artist => artist.name).join(", ") } </p>
         <p className="track-duration"> { msToMinAndSec(trackItem.track.duration_ms) } </p>
         <p className="popuptext track-text">{ trackItem.track.name + "  by " + trackItem.track.artists.map(artist => artist.name).join(", ") }</p>
      </div>
   );

}

export default TrackList;
