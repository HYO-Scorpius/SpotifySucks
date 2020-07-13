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
            <option value="random">Shuffle Randomly</option>
            <option value="artists">Shuffle by Artist</option>
            <option value="album">Shuffle by Album</option>
        </select>
        <div>
            <div className="shuffle-buttons">
               {(user.id === playlist.owner.id) && <button onClick={() => fetch(apiUrl + 'yes')}><i className="fas fa-greater-than marginIcon"></i>  Shuffle Current Playlist </button>}
               <button onClick={() => fetch(apiUrl + 'no')}><i className="fas fa-plus marginIcon"></i>  Create Shuffled Playlist </button>
            </div>
        </div>
        <h3 className="playlist-title"><i class="fab fa-spotify marginIcon"></i> {playlist.name}</h3>
      </div>

    );
         
}

export default Shuffle;

