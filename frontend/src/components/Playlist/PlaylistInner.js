import React, {useState, useEffect} from "react";
import Shuffle from "./Shuffle";
import TrackList from "./TrackList";

function PlaylistInner({ 
   setPane,
   spotifyApi,
   selectedPlaylist,
   user,
}) {
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
         <div>
            <button onClick={() =>setPane("outer")}> back </button> 
         </div>
         <div>
            <Shuffle 
               spotifyApi = {spotifyApi}
               playlist = {selectedPlaylist} 
               user = {user}/>
         </div>
         <div>
         {tracks && 
            <TrackList
               tracks = {tracks} />
         } 
         </div>
      </div>
   );
}
export default PlaylistInner;

