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
    token,
    setNeedsRefresh
}) {
    const [pane, setPane] = useState("outer"); 
    const [selectedPlaylist, setSelectedPlaylist] = useState(null); 
    const [playlists, setPlaylists] = useState(null);
    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists({limit:50}).then( (data) => {
                console.log("yipyip");
                setPlaylists(data.items)
            }
            )
            .catch( (err) => {
                if(err.status === 401) {
                   setNeedsRefresh(true);
                }
                console.log('frontend::Playlist.js spotifyApi.getUserPlaylists() failed. Error: ', err);
            })         
        }
    }, [token, spotifyApi, pane, setNeedsRefresh]);
    return (
        <div>
            {pane === "outer" && playlists && 
                <PlaylistOuter 
                    playlists={playlists} 
                    setPane={setPane} 
                    setSelectedPlaylist = {setSelectedPlaylist}
                    spotifyApi = {spotifyApi}
                    user = {user}
                    token = {spotifyApi.getAccessToken()}
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
                    token = {spotifyApi.getAccessToken()}
                    setNeedsRefresh = {setNeedsRefresh}
                />
            )}
        </div>
    ); 
}

export default Playlist;
