import React from "react";
/* Playlist json format
 {
         "collaborative":false,
         "description":"",
         "external_urls":{
            "spotify":"https://open.spotify.com/playlist/7qyJCAZ3xrFydyvjXZYZ5j"
         },
         "href":"https://api.spotify.com/v1/playlists/7qyJCAZ3xrFydyvjXZYZ5j",
         "id":"7qyJCAZ3xrFydyvjXZYZ5j",
         "images":[ { "height":640, "url":"<url of above size>", "width":640 }, { "height":300, "url":"<url of above size>", "width":300 }, { "height":60, "url":"<url of above size>", "width":60 } ],
         "name":"MORNING EPs",
         "owner":{
            "display_name":"Kenny",
            "external_urls":{
               "spotify":"https://open.spotify.com/user/nfscny9k0324ybonfy4u6xu4z"
            },
            "href":"https://api.spotify.com/v1/users/nfscny9k0324ybonfy4u6xu4z",
            "id":"nfscny9k0324ybonfy4u6xu4z",
            "type":"user",
            "uri":"spotify:user:nfscny9k0324ybonfy4u6xu4z"
         },
         "primary_color":null,
         "public":true,
         "snapshot_id":"MTksYjMzOTAyZDA5ODBmNGQ5ZjRjYTQ0YmUzZWZjZTdhYzZkMTQzOWE3Zg==",
         "tracks":{
            "href":"https://api.spotify.com/v1/playlists/7qyJCAZ3xrFydyvjXZYZ5j/tracks",
            "total":62
         },
         "type":"playlist",
         "uri":"spotify:playlist:7qyJCAZ3xrFydyvjXZYZ5j"
      },
 */
function Shuffle({ playlists }) {
         return (
      <div>
        <select name="options" id="options">
          <option value="mood">Shuffle by Mood</option>
          <option value="genre">Shuffle by Genre</option>
          <option value="artist">Shuffle by Artist</option>
        </select>

       <div>
            {playlists.map((playlist) =>{ 
               return (
                  <div>
                     <button type="button"> { playlist.name } </button>
                  </div>

               );
            })}
         </div>
      </div>

    );
         
}

export default Shuffle;
