import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function MultiPlaylistTab({ spotifyApi, user, deviceID, token }) {
  let textInput = React.createRef();
  const [socket, setSocket] = useState(null);
  const [isConnected, setConnectedState] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [privatePlaylist, setPrivatePlaylist] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [indexTrack, setIndexTrack] = useState([]);
  const [input, setInput] = useState("");
  const [filteredTracks, setFilter] = useState([]);
  const [playlistURI, setPlaylistsURI] = useState([]);
  const [playlistTitle, setPlaylistTitle] = useState("");

  // After render, establish socket and set instance
  useEffect(() => {
    setSocket(io("http://localhost:1337"));
  }, []);

  // Testing out socket
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

  // Retrieve current users playlists
  function getUserPlaylists() {
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("Playlist Json ", json.items);
        let fetchedPlaylists = json.items.map((item) => ({
          name: item.name,
          tracks: item.tracks.href,
        }));
        setPlaylists(fetchedPlaylists);
        //console.log(fetchedPlaylists);
      })
      .catch(function () {
        console.log("Error with playlists");
      });
  }

  function getPrivatePlaylists(user_id) {
    fetch("https://api.spotify.com/v1/users/" + user_id + "/playlists", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json())
    .then((json) => {
      console.log("PRIVATE" ,json);
      let fetchPrivatePlaylist = json.items.map((item, index) => ({
        name: item.name,
        tracks: item.tracks.href,
        index: index = index + 1
      }));
      setPrivatePlaylist(fetchPrivatePlaylist);
      console.log("TRACKS", fetchPrivatePlaylist);
      fetchPrivatePlaylist.map((play) => (getTrackList(play.tracks, play.name)) )
    });
  }

  // Click list item to view all tracks under clicked playlist
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
        //console.log(url);
        //console.log("Track Json ", json.items);
        let fetchedTracks = json.items.map((item) => ({
          name: item.track.name,
          id: item.track.id,
          uri: item.track.uri,
          playlist: playlist
        }));

        //concatenate the tracks
        setTracks(tracks => [...tracks, fetchedTracks]);
        console.log(fetchedTracks);
      })
      .catch(function () {
        console.log("Could not get Tracks");
      });
  }



  //Create unique tracks list
  function uniqueTracksList() {
    const array = [];
    const uri = [];
    tracks.map((user)=>user.map((data)=>{
      array.push(data.name);
      uri.push(data.uri);
    }))
    const uniqueList = [...new Set(array)]
    const uriList = [...new Set(uri)]
    setFilter(uniqueList);
    setPlaylistsURI(uriList);
    console.log(uri);
  }

  function createPlaylist(){

    if(input==""){alert("Invalid user id"); return;}
    if(playlistTitle==""){alert("Enter a playlist title!");return;}
    let playlist_id = "";
    fetch("https://api.spotify.com/v1/users/"+ input + "/playlists", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "name": playlistTitle,
        "public": false,
      }),
    }).then((res) => res.json())
    .then((json) => {
      playlist_id = json.id;
      console.log("Playlist ID", playlist_id);
      postTracksToPlaylist(playlist_id);
    });
  
  }

  function postTracksToPlaylist(playlist_id) {
    fetch("https://api.spotify.com/v1/playlists/"+playlist_id+"/tracks", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: playlistURI,
      }),
    }).then(console.log("Added tracks to playlist"))
    .then(console.log("Track ARRAY", playlistURI))
    .catch(err => {
      console.log('Adding track Error', err);
    });
  }

  

  return (
    <div>
      <div>
        {/* Testing socket connection */}
        <input
          type="button"
          onClick={toggleConnection}
          value={isConnected ? "Disconnect" : "Connect"}
        />
      </div>
      <div>
        <label for="fname">Add Friend: </label>
        <input ref={textInput} type="text" onChange={e => setInput(e.target.value)} name="fname"></input>
        <button onClick={() => getPrivatePlaylists(input)} type="button"> Private </button> 
      </div>

      {/*Gets all the playlists requested by friends */}
      <div>
        <button onClick={getUserPlaylists} type="button">
          Request
        </button>
      </div>

      <div>
        <label for="fname">Contributors: </label>
      </div>

      <div>
        <label for="fname">
          All Accessible Playlists:
          <ul>
            {privatePlaylist.map((playlist) => (
              <select value={playlist.name} onClick={() => setIndexTrack(tracks[playlist.index-1])}>
                <option>{"--"}{playlist.name}{"--"}</option>
                {indexTrack.map((track) => (
                <option> {track.name} </option>
                ))}
              </select>
             
            ))}
          </ul>
        </label>
      </div>

      <div>
        <label for="fname">Create a Playlist </label>
        <input type="text" onChange={e => setPlaylistTitle(e.target.value)}></input>
        <button type="button" onClick={() => uniqueTracksList()}>Unique!</button>
        <div className="filtered_tracks">
        <p> {playlistTitle} </p>  
        {filteredTracks.map((filter) => (
                <p> {filter} </p>
                ))}</div>
      </div>
      <button type="button" onClick={() => createPlaylist()}> Create </button>
    </div>
  );
}

export default MultiPlaylistTab;
