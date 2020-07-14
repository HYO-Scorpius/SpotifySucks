import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function MultiPlaylistTab() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setConnectedState] = useState(false);

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
    if(isConnected){ 
      socket.disconnect();
    } else {
      socket.connect();
    }
  }


  return (
    <div>
      <div>
        <input type="button" onClick={toggleConnection} value={isConnected ? "Disconnect" : "Connect"} />
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
        <button type="button">Create</button>
      </div>

      <div>
        <label for="fname">All Accessible Playlists: </label>
      </div>
    </div>
  );
}

export default MultiPlaylistTab;
