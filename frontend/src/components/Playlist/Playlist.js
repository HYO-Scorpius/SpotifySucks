import React, {useState, useEffect} from "react";
import PlaylistInner from "./PlaylistInner";
import PlaylistOuter from "./PlaylistOuter";
import RefreshDialog from "../RefreshDialog";

function Playlist({ 
   spotifyApi,
   user,
}) {
   const [pane, setPane] = useState("outer"); 
   const [refresh, setRefresh] = useState(false);
   const [selectedPlaylist, setSelectedPlaylist] = useState(null); 
   const [playlists, setPlaylists] = useState(null);
   let token = spotifyApi.getAccessToken();
   useEffect(() => {
      if (token) {
         spotifyApi.getUserPlaylists().then(
            (data) => {
               setPlaylists(data.body.items);
            },
            (err) => {
               if (err.statusCode == 401) {
                  setRefresh(true);
               }
               console.log('frontend::Playlist.js spotifyApi.getUserPlaylists() failed. Error: ', err);
            });
      }
   }, [spotifyApi, token, pane]);
   return (
      <div>
      {refresh && 
         <RefreshDialog 
            spotifyApi={spotifyApi} />}

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
            user = {user}
         />
      )}
      </div>
   ); 
}

export default Playlist;
