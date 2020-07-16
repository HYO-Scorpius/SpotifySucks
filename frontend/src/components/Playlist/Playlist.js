import React, {useState, useEffect} from "react";
import "./Playlist.css";
import PlaylistInner from "./PlaylistInner";
import PlaylistOuter from "./PlaylistOuter";

function Playlist({ 
   spotifyApi,
   user,
   currentPlayback,
   player,
   deviceID,
   token
}) {
   const [pane, setPane] = useState("outer"); 
   const [selectedPlaylist, setSelectedPlaylist] = useState(null); 
   const [playlists, setPlaylists] = useState(null);
   useEffect(() => {
      if (token) {
         spotifyApi.getUserPlaylists({limit:50}).then( (data) =>
            setPlaylists(data.items)
         )
         .catch( (err) => {
               console.log('frontend::Playlist.js spotifyApi.getUserPlaylists() failed. Error: ', err);
            }
         )         
      }
   }, [spotifyApi, token, pane]);
   return (
      <div>
      {pane === "outer" && playlists && 
         <PlaylistOuter 
            playlists={playlists} 
            setPane={setPane} 
            setSelectedPlaylist = {setSelectedPlaylist}
            spotifyApi = {spotifyApi}
            user = {user}
            token = {token}
         />
         }

      {pane === "inner" && (
         <PlaylistInner 
            playlists = {playlists}
            setPane={setPane} 
            spotifyApi = {spotifyApi}
            selectedPlaylist = {selectedPlaylist}
            user = {user}
            currentPlayback = {currentPlayback}
            player = {player}
            deviceID = {deviceID}
            token = {token}
         />
      )}
      </div>
   ); 
}

export default Playlist;
