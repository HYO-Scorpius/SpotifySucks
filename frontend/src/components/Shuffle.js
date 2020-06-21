import React from "react";

function Shuffle({ playlists }) {
         return (
      <div>
        <select name="options" id="options">
          <option value="mood">Shuffle by Mood</option>
          <option value="genre">Shuffle by Genre</option>
          <option value="artist">Shuffle by Artist</option>
        </select>

        <div>
            {playlists.map((track) =>{ 
               return (
               <button type="button"> { track } </button>
               );
            })}
         </div>
      </div>

    );
         
}

export default Shuffle;
