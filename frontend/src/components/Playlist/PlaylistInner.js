import React, {useState, useEffect} from "react";
import Shuffle from "./Shuffle";
import TrackList from "./TrackList";

function PlaylistInner({ 
	setPane,
	spotifyApi,
	selectedPlaylist,
	user,
	currentPlayback,
	player,
	token,
	deviceID,
   	setNeedsRefresh
}) {
	const [tracks, setTracks] = useState([]); 
	const [totalTaken, setTotalTaken] = useState(0);
	const [totalTracks, setTotal] = useState(1)

	useEffect(() => {
		if ( totalTaken < totalTracks ) {
			spotifyApi.getPlaylistTracks(selectedPlaylist.id, {
				offset: totalTaken
			}).then(
			(data) => {
				setTracks(state => state.concat(data.items))
				setTotalTaken(state => state+100)
				setTotal(data.total)
			}).catch((err) => {
                if(err.status === 401) {
                   setNeedsRefresh(true);
                }
               console.log('frontend::PlaylistInner.js spotifyApi.getPlaylistTracks() failed. Error: ', err);
			});
		}
	},[selectedPlaylist, spotifyApi, setNeedsRefresh, totalTaken, totalTracks]);

	return (
		<div> 
			<div>
				<button className="back" onClick={() =>setPane("outer")}><i className="fas fa-chevron-circle-left marginIcon"></i> Go Back </button> 
			</div>
			<div>
				<Shuffle 
					spotifyApi = {spotifyApi}
					playlist = {selectedPlaylist} 
					user = {user}
					token = {token}
               		setNeedsRefresh = {setNeedsRefresh}
				/>
			</div>
			<div>
     			{tracks && 
     				<TrackList
     					tracks = {tracks} 
     					playlist={selectedPlaylist} 
     					spotifyApi={spotifyApi} 
     					currentPlayback = {currentPlayback}
     					player = {player}
     					deviceID = {deviceID}
     				/>
     			} 
			</div>
		</div>
	);
}
export default PlaylistInner;

