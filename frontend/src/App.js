import React, { useState, useEffect } from 'react';
import Shuffle from './components/Shuffle';
import './App.css';

function App() {
   const [playlists, setPlaylists] = useState([]);
  return (
     <Shuffle 
     playlists = {["abc", "123", "abc", "abc", "abc"]}/>
  );
}

export default App;
