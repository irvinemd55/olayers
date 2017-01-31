'use strict';

const mongoose = require('mongoose');




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
  //TODO posts array potentially needed in refactoring
});

module.exports = mongoose.model('profile', profileSchema);
