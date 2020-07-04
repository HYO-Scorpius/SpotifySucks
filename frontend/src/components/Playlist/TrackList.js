import React from "react";

function TrackList({
   tracks,
}) {
   return (
      <div>
      {tracks.map((trackItem) =>{ 
          return (
             <ul key={trackItem.track.id}>
                <li key={trackItem.track.id}>  { trackItem.track.name } </li>
             </ul>
          );
       })} 
      </div> 
   );
}

export default TrackList;
