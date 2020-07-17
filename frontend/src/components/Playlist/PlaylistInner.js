import React, {useState, useEffect} from "react";
import Shuffle from "./Shuffle";
import TrackList from "./TrackList";

function PlaylistInner({ 
   setPane,
   spotifyApi,
   selectedPlaylist,
   user,
   currentPlayback,
   player,
   token,
   deviceID
}) {
   const [tracks, setTracks] = useState(null); 

   useEffect(() => {
      spotifyApi.getPlaylistTracks(selectedPlaylist.id).then(
         (data) => {
            setTracks(data.items);
         }). catch((err) => {
            console.log('frontend::PlaylistInner.js spotifyApi.getPlaylistTracks() failed. Error: ', err);
         });
   },[selectedPlaylist, spotifyApi]);

   return (
      <div> 
         <div>
            <button className="back" onClick={() =>setPane("outer")}><i className="fas fa-chevron-circle-left marginIcon"></i> Go Back </button> 
         </div>
         <div>
            <Shuffle 
               spotifyApi = {spotifyApi}
               playlist = {selectedPlaylist} 
               user = {user}
               token = {token}
            />
         </div>
         <div>
         {tracks && 
            <TrackList
               tracks = {tracks} 
               playlist={selectedPlaylist} 
               spotifyApi={spotifyApi} 
               currentPlayback = {currentPlayback}
               player = {player}
               deviceID = {deviceID}
            />
         } 
         </div>
      </div>
   );
}
export default PlaylistInner;

