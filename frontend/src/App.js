import React from 'react';
import logo from './logo.svg';
import './App.css';
import Tabs from './components-main/Tabs';
import ShuffleTab from './components-main/ShuffleTab';
import FriendSyncTab from './components-main/FriendSyncTab';
import MultiPlaylistTab from './components-main/MultiPlaylistTab';



function App() {
  return (
    <div>
      <h1>Sp0tify Sucks1</h1>
      <Tabs>
        <div label="Shuffle">
          <ShuffleTab> </ShuffleTab>
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
    </div>
  );
}

export default App;
