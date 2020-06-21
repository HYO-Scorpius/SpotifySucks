import React, { useState, useEffect } from 'react';
import './App.css';
import Shuffle from './components/Shuffle';
import MusicPlayer from './components/MusicPlayer'
import Tabs from './components/Tabs';
import FriendSyncTab from './components/FriendSyncTab';
import MultiPlaylistTab from './components/MultiPlaylistTab'

function App() {
   const [playlists, setPlaylists] = useState([]);

  return (
     <div>
      <Tabs>
        <div label="Shuffle">
          <Shuffle
           playlists = {["kenny", "syed", "amy", "mike"]}/>
        </div>
        <div label="MultiPlaylist">
        <MultiPlaylistTab>
          </MultiPlaylistTab>
        </div>
        <div label="Friendsync">
        <FriendSyncTab>
          </FriendSyncTab>
        </div>
        <div label="VanillaPlaylist">
          leaving empty until the other three are done
        </div>
      </Tabs>
        <MusicPlayer />
    </div>
  );
}

export default App;
