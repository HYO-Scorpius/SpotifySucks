import React, {useState, useEffect} from "react";
import PlaylistInner from "./PlaylistInner";
import PlaylistOuter from "./PlaylistOuter";

function Playlist({ 
   spotifyApi,
}) {
   const [pane, setPane] = useState("outer"); 
   const [selectedPlaylist, setSelectedPlaylist] = useState(null); 
   const [playlists, setPlaylists] = useState(null);
   let token = spotifyApi.getAccessToken();
   useEffect(() => {
      spotifyApi.getUserPlaylists().then(
         (data) => {
            if (data.body) {
               setPlaylists(data.body.items);
               console.log(data.body.items);
            }
         },
         (err) => {
            console.log('frontend::Playlist.js spotifyApi.getUserPlaylists() failed. Error: ', err);
         });
   }, [spotifyApi, token]);
   return (
      <div>
      {pane === "outer" && playlists && 
         <PlaylistOuter 
            playlists={playlists} 
            setPane={setPane} 
            setSelectedPlaylist = {setSelectedPlaylist}/>}

      {pane === "inner" && (
         <PlaylistInner 
            playlists = {playlists}
            setPane={setPane} 
            spotifyApi = {spotifyApi}
            selectedPlaylist = {selectedPlaylist}
         />
      )}
      </div>
   ); 
}

export default Playlist;
