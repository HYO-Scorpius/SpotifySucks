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
    tracks.map((user)=>user.map((data)=>{
      array.push(data.name);
    }))
    const uniqueList = [...new Set(array)]
    setFilter(uniqueList);
    console.log(uniqueList);
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
        <label for="fname">Create Playlist: </label>
        <input type="text" id="fname" name="fname"></input>
        <button type="button" onClick={() => uniqueTracksList()}>Create</button>
        <div className="filtered_tracks">{filteredTracks.map((filter) => (
                <p> {filter} </p>
                ))}</div>
      </div>
    </div>
  );
}

export default MultiPlaylistTab;
