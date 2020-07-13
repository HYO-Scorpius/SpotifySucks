import React from "react";
import {msToMinAndSec} from './../../helper'

function TrackList({
   tracks,
}) {
   return (
      <div>
      {tracks.map((trackItem) =>{ 
          return (
             <div className="track-container" key={trackItem.track.id}>
                <p className="track-title"><i className="fas fa-music marginIcon"></i> { trackItem.track.name } </p>
                <p className="track-artist"> { trackItem.track.artists.map(artist => artist.name).join(", ") } </p>
                <p className="track-duration"> { msToMinAndSec(trackItem.track.duration_ms) } </p>
                <p className="popuptext track-text">{ trackItem.track.name + "  by " + trackItem.track.artists.map(artist => artist.name).join(", ") }</p>
             </div>
          );
       })} 
      </div> 
   );
}

export default TrackList;
