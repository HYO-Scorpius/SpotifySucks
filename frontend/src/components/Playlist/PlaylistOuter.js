import React from "react";

function PlaylistOuter({ 
    playlists,
    setPane,
    setSelectedPlaylist
}) {
    
    return (
        <div className="playlist-grid"> 
            {playlists.map((playlist) =>{ 
                return (
                    <div key={playlist.id}>
                        <div className="playlist-info popup-play" onClick={() => {
                            setPane("inner");
                            setSelectedPlaylist(playlist);
                        }}> 
                            <img alt= "playlist cover" src={playlist.images[0].url}></img>
                            <span className="playlist-name">{ playlist.name }</span> 
                            <span className="popuptext playlist-text">{ playlist.name }</span> 
                        </div>
                    </div>
                    
                );
            })}
        </div>
    );
}
        
export default PlaylistOuter;
        
        
