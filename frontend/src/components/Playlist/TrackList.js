import React, { useState } from "react";
import {msToMinAndSec} from './../../helper'

function TrackList({
   tracks,
}) {

   return (
      <div>
      {tracks.map((trackItem) => <Track trackItem={ trackItem} key={trackItem.track.id}/>)} 
      </div> 
   );
}

function Track({trackItem}) {

   const [hovered, setHover] = useState(false)

   function hoveredOver() {
      setHover(true)
   }

   function noHover() {
      setHover(false)
   }

   return (
      <div className="track-container" onMouseEnter={hoveredOver} onMouseLeave={noHover}>
        {!hovered && <p className="track-title" >
           <i className="fas fa-music marginIcon" style={{fontSize:13, marginRight: 5}}></i>
           { trackItem.track.name }
        </p>}
        {hovered && <p className="track-title" >
           <i className="far fa-play-circle marginIcon" style={{fontSize:13, marginRight: 5}}></i>
           { trackItem.track.name }
        </p>}
         <p className="track-artist"> { trackItem.track.artists.map(artist => artist.name).join(", ") } </p>
         <p className="track-duration"> { msToMinAndSec(trackItem.track.duration_ms) } </p>
         <p className="popuptext track-text">{ trackItem.track.name + "  by " + trackItem.track.artists.map(artist => artist.name).join(", ") }</p>
      </div>
   );

}

export default TrackList;
