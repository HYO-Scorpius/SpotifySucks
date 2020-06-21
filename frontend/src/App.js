import React, { useState, useEffect } from 'react';
import Shuffle from './components/Shuffle';
import MusicPlayer from './components/MusicPlayer'

function App() {
   const [playlists, setPlaylists] = useState([]);
  return (
    <div className="App">
     <Shuffle 
     playlists = {["abc", "123", "abc", "abc", "abc"]}/>
    <MusicPlayer />
    </div>
  );
}

export default App;
