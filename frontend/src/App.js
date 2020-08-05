import React, { useState, useEffect } from 'react';
import SWA from 'spotify-web-api-js';
import './App.css';
import Playlist from './components/Playlist/Playlist';
import MusicPlayer from './components/MusicPlayer'
import Tabs from './components/Tabs';
import RefreshDialog from './components/RefreshDialog';
//import FriendSyncTab from './components/FriendSyncTab';
import MultiPlaylistTab from './components/MultiPlaylistTab';
import { getCookie, getHashParams} from './helper';
const spotifyApi = new SWA();
const apiServer = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}`: "http://intense-reef-77781.herokuapp.com"

function App() {
   	const [needsRefresh, setNeedsRefresh] = useState(false);
   	const [user, setUser] = useState({});
    const [refreshToken, setRefreshToken] = useState(null);


    useEffect(() => {
        //regularly get api token
        const { access_token, refresh_token } = getHashParams();
        if (access_token) {
            spotifyApi.setAccessToken(access_token);
            document.cookie = `api_token=${access_token}`;
        } else {
            const token = getCookie('api_token') || null;
            if (token) spotifyApi.setAccessToken(token);
        }

        if (refresh_token) {
            setRefreshToken(refresh_token);
            document.cookie = `refresh_token=${refresh_token}`;
        } else {
            const token = getCookie('refresh_token') || null;
            if (token) setRefreshToken(token);
        }

            

    },[needsRefresh]);

    useEffect(() => {
        //regularly get user
        spotifyApi.getMe().then(
            (data) => {
                if (data) {
                    setUser(data);
                }
            },
            (err) => {
                if (err.status === 401)
                {
                    setNeedsRefresh(true);
                }
                console.log('frontend::App.js spotifyApi.getMe() failed. Error: ', err);
            });      
    },[]);
  
    const [loading, setLoading] = useState("visible")
    const [player, setPlayer] = useState(null);
    const [deviceID, setDeviceID] = useState("");
    const [token, setToken] = useState("");
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(100)
    const [currentPlayback, setCurrentPlayback] = useState({
        duration:0,
        position:0,
        paused: true,
        shuffle: false,
        repeat_mode: 0,
        connected: false,
        uri: "",
        id: "",
        artist_name:"Artist",
        track_name:"Track Name",
        playlist: "Playlist Name",
        image_url:'https://via.placeholder.com/60'});
    
    useEffect(() => {
        setToken(spotifyApi.getAccessToken());
        if (token){
            window.onSpotifyWebPlaybackSDKReady = () => {
                const player = new window.Spotify.Player({
                    name: "Spotify Sucks",
                    getOAuthToken: (cb) => {
                        cb(token);
                  },
                });
        
                // Update state hooks
                setPlayer(player);
                setToken(token);
            
                // SDK Error handling
                player.addListener("initialization_error", ({ message }) => {
                    console.error("Init Error", message);
                });
        
                player.addListener("authentication_error", ({ message }) => {
                    setNeedsRefresh(true);
                    console.error("Auth Error", message);
                });
            
                player.addListener("account_error", ({ message }) => {
                    console.error("Acct Error", message);
                });
          
                player.addListener("playback_error", ({ message }) => {
                    console.error("Playback Error", message);
                });
        
                // Add listener for current state of the music player
                player.addListener("player_state_changed", (state) => {
                    if (state){ 
                        console.log(state); // Print out json containing track state
                  
                        const playlist = state.context.metadata.context_description
                        const uri = state.context.uri
                    
                        // Get information from json
                        const { duration, position, paused, shuffle, repeat_mode } = state;
                        const {
                            current_track,
                        } = state.track_window;
                        const {
                            artists,
                            album,
                            id
                        } = state.track_window.current_track;
                   
                        const artist_name = artists.map(artist => artist.name).join(", ")
                        const track_name = current_track.name;
                        const image_url = album.images[1].url;
                        const id_opt2 = state.track_window.current_track.linked_from.id;
                   
                        // Pass to currentPlayback to be used in html
                        setCurrentPlayback({
                            duration: duration,
                            position: position,
                            paused: paused,
                            shuffle: shuffle,
                            repeat_mode: repeat_mode,
                            connected: true,
                            uri: uri,
                            id_opt2: id_opt2,
                            id: id,
                            artist_name: artist_name,
                            track_name: track_name,
                            playlist: playlist,
                            image_url: image_url,
                        });
                   
                        setProgress(position)
                
                        // Testing
                        console.log("TRACK NAME", track_name);
                        console.log("ARTIST NAME(S)", artist_name);
                        console.log("DURATION", duration);
                        console.log("SRC", image_url);
                        console.log("PLAYLIST", playlist)
                    } else {
                        setCurrentPlayback(state => ({
                            duration: state.duration,
                            position: state.position,
                            connected: false,
                            paused: true,
                            shuffle: state.shuffle,
                            repeat_mode: state.repeat_mode,
                            uri: state.uri,
                            id_opt2: state.id_opt2,
                            id: state.id,
                            artist_name: state.artist_name,
                            track_name: state.track_name,
                            playlist: state.playlist,
                            image_url: state.image_url,
                        }));
                    }
                });
                
            
                // Ready
                player.addListener("ready", async ({ device_id }) => {
                    console.log("Ready with Device ID", device_id);
                    setDeviceID(device_id);
                    player.getVolume().then( volume => setVolume(volume*100) )
                    // get currently playing track or last played track if not playing
                    spotifyApi.getMyCurrentPlayingTrack().then(
                        data => {
                            if (data.item) {
                                const track = data.item
                                setCurrentPlayback(state => ({
                                    duration: track.duration_ms,
                                    position: data.progress_ms,
                                    connected: state.connected,
                                    paused: state.paused,
                                    shuffle: state.shuffle,
                                    repeat_mode: state.repeat_mode,
                                    uri: state.uri,
                                    id_opt2: state.id_opt2,
                                    id: track.id,
                                    artist_name: track.artists.map(artist => artist.name).join(", "),
                                    track_name: track.name,
                                    playlist: '',
                                    image_url: track.album.images[2].url,
                                }));
                            } else {
                                spotifyApi.getMyRecentlyPlayedTracks({
                                    limit: 1,
                                }).then( data => {
                                    const track = data.items[0].track
                                    setCurrentPlayback({
                                        duration: track.duration_ms,
                                        position: 0,
                                        connected: false,
                                        paused: true,
                                        shuffle: false,
                                        repeat_mode: 0,
                                        uri: null,
                                        id_opt2: null,
                                        id: track.id,
                                        artist_name: track.artists.map(artist => artist.name).join(", "),
                                        track_name: track.name,
                                        playlist: "",
                                        image_url: track.album.images[2].url,
                                    });
                                })
                            }
                        }
                    )
                    setLoading("hidden");
                });
            
                // Not Ready
                player.addListener("not_ready", ({ device_id }) => {
                    console.log("Device ID has gone offline", device_id);
                });
            
                // Connect to the player!
                player.connect();
            };
        }
    }, [token]);

    useEffect(() => {
        if (token && window.Spotify) {
            console.log(token);
            window.onSpotifyWebPlaybackSDKReady();
        }
    },[token]);

    return (
        <div>
            { needsRefresh === true && 
                <RefreshDialog
                    spotifyApi = {spotifyApi}
                    open = {needsRefresh}
                    setOpen = {setNeedsRefresh}
                    setToken = {setToken}
                    apiServer = {apiServer}
                    r_token = {refreshToken}
                />
            }
         
            <Tabs> 
                <div label="Playlist"> 
                    <Playlist
                        spotifyApi = {spotifyApi}
                        user = {user}
                        currentPlayback = {currentPlayback}
                        setCurrentPlayback = {setCurrentPlayback}
                        player = {player}
                        deviceID = {deviceID}
                        token = {token}
                        setNeedsRefresh = {setNeedsRefresh}
                        apiServer = {apiServer}
                    />
                </div>
                <div label="MultiPlaylist">
                    <MultiPlaylistTab
                        spotifyApi = {spotifyApi}
                        user = {user}                                    
                        deviceID = {deviceID}
                        token = {token}
                        setNeedsRefresh = {setNeedsRefresh}
                        apiServer = {apiServer}
                     />
                </div>
                <div label="FriendSync">
                    FriendSyncTab 
                </div>
            </Tabs>
            <MusicPlayer  
                spotifyApi = {spotifyApi}
                loading = {loading}
                deviceID = {deviceID}
                progress = {progress}
                setProgress = {setProgress}
                currentPlayback = {currentPlayback}
                setCurrentPlayback = {setCurrentPlayback}
                token = {token}
                volume = {volume}
                player = {player}
            />
        </div>
    );
}

export default App;
