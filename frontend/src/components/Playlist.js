import React, {useState} from "react";
import PlaylistInner from "./PlaylistInner";

function Playlist({ 
   playlists,
   apiToken,
}) {
   const [pane, setPane] = useState("outer"); 
   return (
      <div>
      {pane === "outer" && (
         <div> 
            {playlists.map((playlist) =>{ 
               let type = "bla";
               let apiUrl = `/api/${apiToken}/shuffle/types/${type}/playlists/${playlist.id}`;
               return (
                  <div>
                     <button onClick={() => setPane("inner")}> { playlist.name } </button>
                  </div>

               );
            })}
         </div>
       )}

      {pane === "inner" && (
         <PlaylistInner 
            playlists = {playlists}
            apiToken = {apiToken}
         />
      )}
   </div>
   );
         
}

export default Playlist;
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

