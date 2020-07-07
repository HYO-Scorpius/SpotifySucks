const mongoose = require('mongoose');
const FriendSync = require('../Modules/friendsync.js');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    hostid: {type: String, required: true},
    nsp: {type: String, required: true},
    users: {type: ArrayBuffer[FriendSync.User], required: true}
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;