import React from "react";
import {msToMinAndSec} from './../../helper'

function TrackList({
   tracks,
}) {
   return (
      <div>
      {tracks.map((trackItem) =>{ 
          return (
             <div class="track-container" key={trackItem.track.id}>
                <p className="track-title" key={trackItem.track.id}><i className="fas fa-music marginIcon"></i> { trackItem.track.name } </p>
                <p className="track-artist"> { trackItem.track.artists.map(artist => artist.name).join(", ") } </p>
                <p className="track-duration"> { msToMinAndSec(trackItem.track.duration_ms) } </p>
             </div>
          );
       })} 
      </div> 
   );
}

export default TrackList;
