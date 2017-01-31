'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('olayers:profile');



const profileSchema = mongoose.Schema({
  name: {type: String, required: true},
  bio: {type: String},
  eventsCreated: {type: Array},
  location: {type: String, required: true},
  interests: {type: Array},
  dateJoined: {type: Date, required: true, default: Date.now},
  costumesWorn: {type: Array},
  eventsAttended: {type: Array},
  cosplayer: {type: Boolean, required: true},
  vendor: {type: Boolean, required: true},
  fan: {type: Boolean, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('profile', profileSchema);
