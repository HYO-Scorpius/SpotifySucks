import React from "react";

function PlaylistOuter({ 
   playlists,
   setPane,
   setSelectedPlaylist,
}) {

 return (
   <div> 
      {playlists.map((playlist) =>{ 
         return (
            <div key={playlist.id}>
               <button key={playlist.id} onClick={() => {
                  setPane("inner");
                  setSelectedPlaylist(playlist);
               }}> { playlist.name } </button>
            </div>

         );
      })}
   </div>
   );
}
export default PlaylistOuter;

