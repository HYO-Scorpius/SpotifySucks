import React, { useState } from 'react';
import logo from './../logo.svg';
import './MusicPlayer.css';


// Class components should always call base consturctor with props
function MusicPlayer() {

  // current state and function that updates it
  const token = 'BQD0BNprYY-tOBYnO6Y4CjC2w1zfM5ZSyz7lWxDmp_lefAuiorz5gSZmBSuEbz_RDY3mRqJtIaVSRORco687974KFsCAME5AzJrKZyfgC0jVMzU9KUvZfIYTY5YWwh0JCY25WQeAQZpjTEYGyk8iAJfLXAMwDfpNbvI8pj53uTW5mQmuCz4';
  //const [token, setToken] = useState('');
  //const [loggedIn, setLogin] = useState(false);
 
  


  
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => { cb(token);
        },
      });

      // SDK Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
          
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
    
      });
      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error(message);
      });
      player.addListener('player_state_changed', state => { console.log(state); });

        // Ready
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

    // Connect to the player!
      player.connect();
    }
  
 
      
      
  // javascript conditional { boolean ?() : () }
  return (
    <div className="footer">
  
      <div>  
        <img src={logo} className="albumImage" alt="logo" />
        <p> It worked! </p>
        
        <p>
          <button>Previous</button>
         
          <button>Next</button>
        </p>
      </div>
      
    </div>
  );
}


export default MusicPlayer