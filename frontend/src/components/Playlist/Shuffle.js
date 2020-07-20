import React, {useState, useEffect} from "react";

function Shuffle({ 
    spotifyApi,
    playlist,
    user,
    token,
    setNeedsRefresh
}) {
    
    const [type, setType] = useState('random');
    const [followers, setFollowers] = useState(0)
 
    function followersWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    useEffect(() => {
        if (token) {
            spotifyApi.getPlaylist(playlist.id)
                .then((data) => setFollowers(followersWithCommas(data.followers.total)))
                .catch((err) => {
                    if(err.status === 401) {
                       setNeedsRefresh(true);
                    }
                    console.log(err)
                })
        }
    }, [followers, playlist, spotifyApi, user, setNeedsRefresh, token])

    let apiUrl = `/api/${spotifyApi.getAccessToken()}/shuffle/types/${type}/user/${user.id}/playlists/${playlist.id}/replace/`;
    return (
        <div> 
            <div>
                <div className="playlist-header">
                    <img alt= "playlist cover" src={playlist.images[0].url}></img>
     
                    <div className="playlist-description">
                        <h2 className="playlist-title"><i className="fab fa-spotify marginIcon"></i> {playlist.name}</h2>
                        <p className="created-by">created by {playlist.owner.display_name} </p>
                        <p className="inner-playlist-descr">{playlist.description} </p>
                        <p className="followers"> tracks: {playlist.tracks.total}  &bull; followers: {followers} </p>
                    </div>
     
                    <div className="shuffle-buttons">
     
                        <select name="options" id="options" onChange={event=>setType(event.target.value)}> 
                            <option value="random">Shuffle Randomly</option>
                            <option value="artists">Shuffle by Artist</option>
                            <option value="album">Shuffle by Album</option>
                        </select>
      
                        {(user.id === playlist.owner.id) && <button onClick={() => fetch(apiUrl + 'yes').then(console.log("shuffled playlist")).catch((err) => console.log("was not able to shuffle current playlist"))}>
                            <i className="fas fa-greater-than marginIcon"></i>  Shuffle Current Playlist 
                        </button>}
         
                        <button onClick={() => fetch(apiUrl + 'no').then(console.log("created shuffled playlist")).catch((err) => console.log("was not able to create shuffled playlist"))}>
                            <i className="fas fa-plus marginIcon"></i>  Create Shuffled Playlist 
                        </button>
         
                    </div>
                </div>
            </div>
        </div>
 
    );
         
}

export default Shuffle;
