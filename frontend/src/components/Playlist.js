import React, {useState} from "react";
import PlaylistInner from "./PlaylistInner";

function Playlist({ 
   playlists,
   spotifyApi,
}) {
   const [pane, setPane] = useState("outer"); 
   const [selectedPlaylist, setSelectedPlaylist] = useState(null); 
   return (
      <div>
      {pane === "outer" && (
         <div> 
            {playlists.map((playlist) =>{ 
               let type = "bla";
               let apiUrl = `/api/${spotifyApi.getAccessToken()}/shuffle/types/${type}/playlists/${playlist.id}`;
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
       )}

      {pane === "inner" && (
         <PlaylistInner 
            playlists = {playlists}
            spotifyApi = {spotifyApi}
            selectedPlaylist = {selectedPlaylist}
         />
      )}
   </div>
   );
         
}

export default Playlist;
