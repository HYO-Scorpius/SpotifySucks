import React, {useState, useEffect} from "react";
import Playlist from "./Playlist";

function PlaylistInner({ 
   playlists,
   spotifyApi,
   selectedPlaylist,
}) {
   const [type, setType] = useState('random'); 
   const [pane, setPane] = useState("inner"); 
   const [tracks, setTracks] = useState(null); 

   useEffect(() => {
      spotifyApi.getPlaylistTracks(selectedPlaylist.id).then(
         (data) => {
            setTracks(data.body.items);
         },
         (err) => {
            console.log('frontend::PlaylistInner.js spotifyApi.getPlaylistTracks() failed. Error: ', err);
         });
   },[selectedPlaylist, spotifyApi]);

   return (
      <div>
         {pane === "inner" && (
            <div> 
               <button onClick={() =>setPane("outer")}> back </button> 
               <select name="options" id="options" onChange={event=>setType(event.target.value)}> 
                  <option value="random" >Shuffle Randomly</option>
                  <option value="genre">Shuffle by Genre</option>
                  <option value="artists">Shuffle by Artist</option>
                  <option value="album">Shuffle by Album</option>
              </select> 
               <div>
                  <h1> { type } </h1> 
               {tracks && ( 
                  <div>
                  {tracks.map((trackItem) =>{ 
                      return (
                         <ul key={trackItem.track.id}>
                            <li key={trackItem.track.id}>  { trackItem.track.name } </li>
                         </ul>
                      );
                   })} 
                  </div>
               )}


               </div>
            </div>
         )}

         {pane === "outer" && (
            <Playlist
               playlists = {playlists}
               spotifyApi = {spotifyApi} />
         )}
      </div>
    );
                     //let apiUrl = `/api/${apiToken}/shuffle/types/${type}/playlists/${playlist.id}`;
         
}
export default PlaylistInner;

