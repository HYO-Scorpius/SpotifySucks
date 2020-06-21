import React from "react";

function Shuffle({ playlists }) {
   return (
      <div>
      {playlists.map((track) =>{
         return (
            <h1> { track }</h1>
         );
      })}
      </div>
   );
}

export default Shuffle;
