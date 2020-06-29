// Friendsync implementations go here
const SpotifyWrapper = require('spotify-web-api-node');
const Request = require('request');
const Database = require('./database.js');
const DataStructures = require('./datastructures');


const namespaces = new Map();




//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {

    /**
     * 
     * @param {string} groupid ID of user that's creating group
     */
    add_group: function (groupid, nsp) {
        namespaces.set(groupid, nsp);
    },


    /**
    * Invites user to sync playback
    *   
    * @param {string} userid Spotify user ID of desired user
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


    /**
     * Adds user to group
     * 
     * @param {*} groupid 
     */
    accept: function () {

    },

};





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CLASS GROUP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Group {
    groupid;
    users = [];

    queue = new DataStructures.Queue

    /**
    * @param {string} userid Spotify userID of the group's creator
    */
    constructor(userid) {
        this.groupid = userid;
        this.add_user(userid);
    }

    /**
     * add user to users list
     * 
     * @param {string} userid Spotify userID of the person to add
     */
    set add_user(userid) {
        if (!this.users.includes(userid)) {
            this.users.append(userid);
        }
    }


    /**
     * add song to queue
     * 
     * @param {string} songid SpotifyID of song
     */
    set add_to_queue(songid) {
        this.queue.enqueue(songid);
    }
};





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Checks if user with userid is currently connected to this app
 * 
 * @param {string} userid Spotify user ID of desired user
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
 * @param {string} userid Spotify user ID of desired user
 * @returns true if exists, false otherwise
 */
function user_exists(userid) {
    var exists;
    SpotifyWrapper.getUser(userid).then(
        function (data) { exists = true;  },
        function (err)  { exists = false; }
    );
    return exists;
}
