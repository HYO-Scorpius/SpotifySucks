import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function MultiPlaylistTab({ spotifyApi, user, deviceID, token }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setConnectedState] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);

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
    }).then((res) => res.json());
  }

  // Click list item to view all tracks under clicked playlist
  function getTrackList(url) {
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
        }));
        //setTracks(fetchedTracks);
        console.log(fetchedTracks);
      })
      .catch(function () {
        console.log("Could not get Tracks");
      });
  }

  // Save tracks url of the clicked playlists
  function playListBoxClicked(playlist_name, tracks_url) {
    console.log(playlist_name);
  }

  //
  function createPlaylist() {}

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
        <input type="text" id="fname" name="fname"></input>
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
            {playlists.map((playlist) => (
              <li onClick={() => getTrackList(playlist.tracks)}>
                <input
                  type="checkbox"
                  value={playlist.name}
                  onChange={playListBoxClicked(playlist.name, playlist.tracks)}
                />
                {playlist.name}
              </li>
            ))}
          </ul>
        </label>
      </div>

      <div>
        <label for="fname">Create Playlist: </label>
        <input type="text" id="fname" name="fname"></input>
        <button type="button">Create</button>
      </div>
    </div>
  );
}

export default MultiPlaylistTab;
