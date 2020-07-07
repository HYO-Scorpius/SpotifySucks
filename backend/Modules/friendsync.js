// Friendsync implementations go here
const SpotifyWrapper = require('spotify-web-api-node');
const Request = require('request');
const Database = require('./database.js');
const DataStructures = require('./datastructures');
const { exists } = require('../models/user.model.js');


/**
 * @key hostid
 * @value Group
 */
const groupMap = new Map();





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {

    Group,
    User,


    /**
     * 
     * @param {string} hostid ID of user that's creating group
     * @param {SocketIO.Namespace} nsp Socket namespace
     */
    new_session: function (hostid, nsp) {
        //create new group
        //group will assign nsp signal handlers
        let session = new Session(hostid, nsp);

        //store group in database
        //Database.new_group(group);
    },


    /**
    * Invites user to sync playback
    *   
    * @param {string} userid Spotify user ID of desired user
    * @returns string description of outcome. Either invite sent or error
    */
    send_invite: function (userid) {
        // check for active users in database
        // Database.get_active_users();


    },


    /**
     * Adds user to group
     * 
     * @param {*} hostid 
     */
    join_session: function (hostid, userid) {

    }

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


