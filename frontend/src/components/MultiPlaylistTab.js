import React, { useEffect, useState } from "react";
import "./multiplaylist.css";
import io from "socket.io-client";
import {CopyToClipboard} from 'react-copy-to-clipboard';

function MultiPlaylistTab({ user, deviceID, token }) {
    let textInput = React.createRef();
    //const [socket, setSocket] = useState(null);
    //const [isConnected, setConnectedState] = useState(false);
    //const [playlists, setPlaylists] = useState([]);
    
    const [privatePlaylist, setPrivatePlaylist] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [indexTrack, setIndexTrack] = useState([]);
    const [input, setInput] = useState("");
    const [uniqueTracks, setUniqueTracks] = useState([]);
    const [playlistURI, setPlaylistsURI] = useState([]);
    const [playlistTitle, setPlaylistTitle] = useState("");
    const [userID, setUserID] = useState("");
    const [displayText, setDisplayText] = useState(false);
    
    /** Playing around with socket connection
    
    // After render, establish socket and set instance
    useEffect(() => {
        setSocket(io("http://localhost:1337"));
    }, []);
    
    
    useEffect(() => {
        if (!socket) return;
        
        console.log("Socket is connected");
        socket.on("connect", () => {
            setConnectedState(socket.connected); // True
            socket.emit("isClicked", "true"); // Send back to the server
        });
        
        socket.on("disconnect", () => {
            setConnectedState(socket.connected); // False
        });
    }, [socket]);
    
    function toggleConnection() {
        if (isConnected) {
            socket.disconnect();
        } else {
            socket.connect();
        }
    }
    **/
    
    // Get a playlist based on the Spotufy UserID
    function getPrivatePlaylists(user_id) {
        if (user_id == "") {
            alert("Invalid user id");
            return;
        }
        fetch("https://api.spotify.com/v1/users/" + user_id + "/playlists", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.json())
        .then((json) => {
            console.log("Playlists JSON", json);
            //Gets playlist name, tracks url, and index of each playlist
            let fetchPrivatePlaylist = json.items.map((item, index) => ({
                name: item.name,
                tracks: item.tracks.href,
                index: (index = index + 1),
            }));
        
            // Populate const array for playlist info
            setPrivatePlaylist(fetchPrivatePlaylist);
            console.log("fetchPrivatePlaylist", fetchPrivatePlaylist);
            
            // Populate const array for all tracks within a playlist
            fetchPrivatePlaylist.map((play) =>
                getTrackList(play.tracks, play.name)
            );
        });
    }

    // Gets all the tracks for each playlist using url and playlist name
    function getTrackList(url, playlist) {
        fetch(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.json())
        .then((json) => {
            // Each track has name, id, url and the playlist it belongs to
            let fetchedTracks = json.items.map((item) => ({
                name: item.track.name,
                id: item.track.id,
                uri: item.track.uri,
                playlist: playlist,
            }));
            
            //Concatenate tracks for all playlists into a const array
            setTracks((tracks) => [...tracks, fetchedTracks]);
        })
        .catch(function () {
            console.log("Could not get Tracks");
        });
    }

    /* With all the tracks from the different playlists,
    * this will filter out the same tracks and only
    * keep unique tracks */
    function uniqueTracksList() {
        const array = [];
        const uri = [];
        tracks.map((track) =>
            track.map((data) => {
                array.push(data.name);
                uri.push(data.uri);
            })
        );
        // Unique track names (for display)
        const uniqueList = [...new Set(array)];
        // Unique urls (for playlist creation)
        const uriList = [...new Set(uri)];
        setUniqueTracks(uniqueList);
        setPlaylistsURI(uriList);
    }

    // Creates an empty playlist based on Spotify User ID
    function createPlaylist() {
        
        if (playlistTitle == "") {
            alert("Enter a playlist title!");
            return;
        }
        
        // Make POST req and get PlaylistID for created playlist
        let playlist_id = "";
        fetch("https://api.spotify.com/v1/users/" + user.id + "/playlists", {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: playlistTitle,
                public: false,
            }),
        })
        .then((res) => res.json())
        .then((json) => {
            playlist_id = json.id;
            console.log("Playlist ID", playlist_id);
            postTracksToPlaylist(playlist_id);
        });
    }

    // Using PlaylistID returned back, add tracks to it
    function postTracksToPlaylist(playlist_id) {
        fetch("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks", {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uris: playlistURI,
            }),
        })
        .then(console.log("Added tracks to playlist", playlistURI))
        .then(alert("Successfully created a new playlist!"))
        .catch((err) => {
            console.log("Adding track Error", err);
        });
    }


    return (

        <div className="section">

            {/* Left half of the screen displaying forms*/}
            
            <div className="left">
            
                <div className="left-container">
                    <label>
                        Enter friends' Spotify User ID:
                        <input
                            ref={textInput}
                            type="text"
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </label>

                    <div className="button-row">
                
                        <button
                            className="button idDisplay"
                            onClick={() => {setUserID(user.id); setDisplayText(state => !state);} }
                            type="button"
                        >
                            { !displayText && "Display My Spotify ID"}
                            { displayText && "Hide My Spotify ID"}
                        </button>
                    
                        <button
                            className="button primary"
                            onClick={() => getPrivatePlaylists(input)}
                            type="button"
                        >
                            Get Playlists
                        </button>

                        { displayText && 
                        <CopyToClipboard text={userID} onCopy={() => alert("Copied to clipboard!")}>
                            <label className="uid_label">My Spotify User ID: {userID}</label>
                        </CopyToClipboard>}

                    </div>
                
                    {/* Display friends Spotify UserID that was entered*/}
                    <label>Contributors: </label>
                
                    <div className="playlist_display">
                        <label>All Accessible Playlists:</label>
                        <ul>
                            {/* Each playlist was added to the array with an index starting
                                a 1 in getPrivatePlaylists(). The [playlist.index - 1]
                            correpsonds to its track list.     */}
                            {privatePlaylist.map((playlist) => (
                                <select
                                    value={playlist.name}
                                    onClick={() => setIndexTrack(tracks[playlist.index - 1])}
                                >
                                    <option>
                                        {"--"}
                                        {playlist.name}
                                        {"--"}
                                    </option>
                                    {indexTrack.map((track) => (
                                        <option> {track.name} </option>
                                    ))}
                                </select>
                            ))}
                        </ul>
                    </div>

                    <div className="create-playlist"> 

                        <h3>Create A New Playlist</h3>
                        <label>
                            Title:
                            <input
                                type="text"
                                onChange={(e) => setPlaylistTitle(e.target.value)}
                            />
                        </label>

                        <div className="button-row">
                            <button
                                className="button idDisplay"
                                type="button"
                                onClick={() => uniqueTracksList()}
                            >
                                Display New Tracks
                            </button>
                            
                            <button
                                className="button primary"
                                type="button"
                                onClick={() => createPlaylist()}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>

                </div>
                        
            </div>
                    
                    
            {/* Right half of the screen displaying tracks*/}
            <div className="right">
                <p> {playlistTitle} </p>
                <div className="filtered_tracks">
                    {uniqueTracks.map((filter) => (
                        <p className="track-container2">
                            <i className="fas fa-music marginIcon smallicon2"></i>
                            {filter} 
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
            
export default MultiPlaylistTab;
            