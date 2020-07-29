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
    const [playlists, setPlaylists] = useState([]);
    const [totalPlaylistsTaken, setTotalTaken] = useState(0)
    const [totalPlaylists, setTotal] = useState(1)

    useEffect(() => {
        if (token &&  (totalPlaylistsTaken < totalPlaylists)) {
            spotifyApi.getUserPlaylists({
                limit:50,
                offset: totalPlaylistsTaken
            }).then( (data) => {
                setPlaylists(state => state.concat(data.items))
                setTotalTaken(state => state+50)
                setTotal(data.total)
                console.log("one page loaded")
            }).catch( (err) => {
                if(err.status === 401) {
                   setNeedsRefresh(true);
                }
                console.log('frontend::Playlist.js spotifyApi.getUserPlaylists() failed. Error: ', err);
            })         
        }
    }, [token, spotifyApi, pane, setNeedsRefresh, totalPlaylistsTaken, totalPlaylists]);

    useEffect(() => {
        setTotalTaken(0);
        setPlaylists([]);
        console.log("reset pane")
    }, [pane])

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
                    setSelectedPlaylist = {setSelectedPlaylist}
                    token = {spotifyApi.getAccessToken()}
                    setNeedsRefresh = {setNeedsRefresh}
                />
            )}
        </div>
    ); 
}

export default Playlist;
