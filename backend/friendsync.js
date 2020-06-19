// Friendsync implementations go here
const SpotifyWrapper = require('spotify-web-api-node');
const Request = require('request');
const Database = require('./database.js')


module.exports = {

    /**
    * Invites user to sync playback
    *   
    * @argument userid Spotify user ID of desired user
    * @returns string description of outcome. Either invite sent or error
    */
    invite: function (userid) {
        var sessionid;

        if (is_active(userid)) { sessionid = Database.get_sessionid(userid); }

        if (sessionid == undefined) {
            return "User does not exist or is inactive";
        }
        else {
            // send sync invite to target
            return "Invite sent"
        }
    },




    // MEDIA CONTROLS

    /** 
     * Begins playback
     * 
     * @param groupid ID of synchronized group
     */
    play: function (groupid) {
        return "play";
    },





    /**
     * Pauses playback
     * 
     * @param groupid ID of synchronized group
     */
    pause: function (groupid) {
        return "pause";
    },





    /**
     * Skips song
     * 
     * @param groupid ID of synchronized group
     */
    skip: function (groupid) {
        return "skip";
    },





    /**
     * Restart song, or skip backwards
     * 
     * @param groupid ID of synchronized group
     */
    back: function (groupid) {
        return "back";
    },





    /**
     * Add song to queue
     * 
     * @param groupid ID of synchronized group
     * @param songid  Spotify songid
     */
    add_to_queue: function (groupid, songid) {
        return "Add to queue";
    }

};







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS





/**
 * Checks if user with userid is currently connected to this app
 * 
 * @argument userid Spotify user ID of desired user
 * @returns sessionid of user if active, null otherwise
 */
function is_active(userid) {
    // check spotify API for userid
    // check database for active users
    return user_exists(userid) && Database.test_true;
}





/**
 * Checks spotify is username is valid
 * 
 * @param userid Spotify user ID of desired user
 * @returns true if exists, false otherwise
 */
function user_exists(userid) {
    Request(`https://api.spotify.co/v1/users/${userid}`, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            return true;
        }
    });
    return false;
}
