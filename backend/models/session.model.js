const mongoose = require('mongoose');
const FriendSync = require('../Modules/friendsync.js');

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    hostid: {type: String, required: true},
    nsp: {type: String, required: true},
    users: {type: ArrayBuffer[FriendSync.User], required: true}
});

const Session = mongoose.model('Group', groupSchema);

module.exports = Session;