const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const queueSchema = new Schema({
  user_id: { type: String, required: true },
  track_id: { type: String, required: true },
  device_id: { type: String, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;