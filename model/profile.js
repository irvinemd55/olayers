'use strict';

const mongoose = require('mongoose');


const profileSchema = mongoose.Schema({
  name: {type: String, required: true},
  bio: {type: String},
  eventsCreated: {type: Array, required: true},
  location: {type: String, required: true},
  interests: {type: Array, required: true},
  dateJoined: {type: Date, required: true},
  costumesWorn: {type: Array, require:true},
  eventsAttended: {type: Array, required: true},
  cosplayer: {type: Boolean, required: true},
  vendor: {type: Boolean, required: true},
  fan: {type: Boolean, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('profile', profileSchema);
