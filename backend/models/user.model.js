const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: { type: String, required: true, unique: true, trim: true },
  device_id: { type: String, required: true, unique: true, trim: true },
  first_name: { type: String, required: true, trim: true },
},{
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;