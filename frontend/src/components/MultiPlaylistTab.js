import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function MultiPlaylistTab({ spotifyApi, user, deviceID, token }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setConnectedState] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [sub, setSub] = React.useState([
    { name: "My top 10" },
    { name: "Moody Jams" },
    { name: "My Mixtape's On Fire" },
  ]);

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

  // Retrieve all the users playlists
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
      })
      .catch(function () {
        console.log("Error with playlists");
      });
  }


  return (
    <div>
      <div>
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

      <div>
        <label for="fname">Contributors: </label>
      </div>

      <div>
        <label for="fname">Create Playlist: </label>
        <input type="text" id="fname" name="fname"></input>
        <button onClick={getUserPlaylists} type="button">
          Create
        </button>
      </div>

      <div>
        <label for="fname">
          All Accessible Playlists:
          <ul>
            {
              playlists.map((playlist) => (
                <li onClick={ () => (playlist.tracks) }>
                  <input type="checkbox" value={playlist.name} />
                  {playlist.name}
                  <div> {tracks.name}</div>
                </li>
              ))}
          </ul>
        </label>
      </div>
    </div>
  );
}

export default MultiPlaylistTab;
