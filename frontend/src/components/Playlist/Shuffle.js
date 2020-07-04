import React, {useState} from "react";

function Shuffle({ 
   spotifyApi,
   playlist,
   user,
}) {
   const [type, setType] = useState('random');

   let apiUrl = `/api/${spotifyApi.getAccessToken()}/shuffle/types/${type}/user/${user.id}/playlists/${playlist.id}/replace/`;
   return (
      <div> 
         <select name="options" id="options" onChange={event=>setType(event.target.value)}> 
            <option value="random" >Shuffle Randomly</option>
            <option value="artists">Shuffle by Artist</option>
            <option value="album">Shuffle by Album</option>
        </select>
        <div>
            <h1> { type } </h1>
            <div>
               <button onClick={() => fetch(apiUrl + 'yes')}> Shuffle Current Playlist </button>
               <button onClick={() => fetch(apiUrl + 'no')}> Create Shuffled Playlist </button>
            </div>
        </div>
      </div>

    );
         
}

export default Shuffle;

