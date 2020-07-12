// Friendsync implementations go here
const SpotifyWrapper = require('spotify-web-api-node');
const Request = require('request');
const Database = require('./database.js');
const DataStructures = require('./datastructures');
const { exists } = require('../models/user.model.js');
const io = require("socket.io-emitter")({ host: "127.0.0.1", port: 2030 });


/**
 * @key hostid
 * @value Group
 */
const sessionMap = new Map();





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {

    Session,
    User,


    /**
     * 
     * @param {string} hostid ID of user that's creating group
     * @param {SocketIO.Namespace} nsp Socket namespace
     * 
     * @returns {boolean} true if success, false if already hosting
     */
    new_session: function (hostid) {
        // check if hostid already hosting
        // if so return false;

        // if not then create new room

        // create Session object with hostid and room

        // store in database

        return true;
    },


    /**
    * Invites user to sync playback
    *   
    * @param {string} to Spotify user ID of desired user
    * @param {string} from Spotify user ID of sender
    * 
    * @returns string description of outcome. Either invite sent or error
    */
    send_invite: function (to, from) {
        // check if user is active
        if (Database.user_is_active(to)) {
            // get socket.id

            // send invite
            return true;
        }
        else {
            return false;
        }
    },


    /**
     * Adds user to group
     * 
     * @param {string} userid 
     * @param {*} hostid 
     */
    join_session: function (userid, hostid) {

    },

};





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CLASSES
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Session {
    
    hostid; // {string} groupid
    nsp; // socketio namespace object
    users = []; // list of users

    userSocketMap = new Map();

    queue = new DataStructures.Queue


    /**
    * @param {string} hostid Spotify userID of the session's creator
    * @param {SocketIO.Namespace} nsp SocketIO namespace object
    */
    constructor(hostid, nsp) {
        this.hostid = hostid;
        this.add_user(userid);

        nsp.on('connection', function (socket) {
            nsp.emit(`${socket.id} connected!`);
        });

        nsp.on('PLAY', function () {
            nsp.emit('crtl','PLAY');
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


