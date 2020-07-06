// Friendsync implementations go here
const SpotifyWrapper = require('spotify-web-api-node');
const Request = require('request');
const Database = require('./database.js');
const DataStructures = require('./datastructures');
const { exists } = require('../models/user.model.js');


const groupMap = new Map();





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {

    /**
     * 
     * @param {string} groupid ID of user that's creating group
     */
    add_group: function (groupid, nsp) {
        let group = new Group(groupid, nsp);


    },


    /**
    * Invites user to sync playback
    *   
    * @param {string} userid Spotify user ID of desired user
    * @returns string description of outcome. Either invite sent or error
    */
    send_invite: function (userid) {
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
    join_group: function (groupid, userid) {

    },


    /**
     * 
     * @param {string} groupid GroupID of target group
     * @param {string} command Command to perform
     */
    command_controller: function (groupid, command) {
        // get group from group map

        // group.command(command)
    },


    /**
     * 
     * @param {string} groupid GroupID of target group
     * @param {Object} queueMod Queue modification to perform
     * 
     * queueMod properties:
     * {
     *      modification: string,
     *      songid: spotifyID of song,
     *      index: in queue to modify
     * }
     * 
     * For example:
     * 
     * Add "Band on the Run" to next in queue with
     * 
     * {
     *      modification: "ADD",
     *      songid: <spotify songid of Band on the Run>,
     *      index: 0
     * }
     */
    queue_controller: function (groupid, queueMod) {
        if (groupid in namespaces.keys) {
            let group = namespaces
        }
    }

};





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CLASSES
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Group {
    
    id; // {string} groupid
    nsp; // socketio namespace object
    users = []; // list of users

    userSocketMap = new Map();

    queue = new DataStructures.Queue


    /**
    * @param {string} userid Spotify userID of the group's creator
    * @param {Object} nsp SocketIO namespace object
    */
    constructor(userid, nsp) {
        this.id = userid;
        this.add_user(userid);

        nsp.on('connection', function (socket) {
            nsp.emit(`${socket.id} connected!`);
        });

        nsp.on('PLAY', function () {
            nsp.emit('PLAY');
        });

        nsp.on('PAUSE', function () {
            nsp.emit('ctrl', 'PAUSE');
        });

        nsp.on('SKIP', function () {
            nsp.emit('ctrl', 'SKIP');
        });

        nsp.on('PREV', function () {
            nsp.emit('ctrl', 'PREV');
        });

        this.nsp = nsp;
    }


    /**
     * add user to users list
     * 
     * @param {User} user User to add
     */
    add_user(user) {
        this.users.append(user)
    }


};





class User {

    userid;
    groupid;
    socketid;

    constructor() {}

    set_userid(id) {
        this.userid = id;
    }

    set_groupid(id) {
        this.groupid = id;
    }

    set_socketid(id) {
        this.socketid = id;
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
