import React, { useState, useEffect} from 'react';
import logo from './../logo.svg';
import './MusicPlayer.css';


// Class components should always call base consturctor with props
function MusicPlayer() {

 
  const[status, changeStatus] = useState(false);
  const [player, setPlayer] = useState(null);
  

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = 'BQAnZDXp7PkpGlrc-kgkNlz1qyF-nRt-0mJ1v3vC_CTKnnagN6qqUCmE54_tvGsIndlJIHpkYPOa0x_Em7DcbpkA9UTu3vXXrnfC5TaHaZbfnM9AvuI1Udk8r37zit75Dlk-nmV6Hureg6Su9273IVpMg8BUm45WJM-fyX0dbsFPOxH1lF8';
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => { cb(token);},
      });
      setPlayer(player);

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
      	
      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      })

    }

 
  
   
    
    if(status){
      player.getCurrentState().then(state => {
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK');
          return;
        }
        console.log('Currently Playing');
        console.log('Playing Next');
        
      });

      player.getVolume().then(volume => {
        let volume_percentage = volume * 100;
        console.log(`The volume of the player is ${volume_percentage}%`);
      });

    }

 	function pause(){
  player.pause().then(() => {
    console.log('Paused!');
  });
}

function resume(){
player.resume().then(() => {
  console.log('Resumed!');
});
}
      
      
  // javascript conditional { boolean ?() : () }
  return (
    <div className="footer">
  
      <div>  
        <img src={logo} className="albumImage" alt="logo" />
        <p> It worked! </p>
        
        <p>
  <button onClick={ () => changeStatus(true) } > Status</button>

          <button onClick={ pause  }>Pause</button>

          <button onClick={ resume  }>Start</button>
        </p>
      </div>
      
    </div>
  );
}


export default MusicPlayer