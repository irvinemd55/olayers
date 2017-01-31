'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('olayers:photo');

const photoSchema = mongoose.Schema({
  name: {type: String, required: true},
  url: {type: String, required: true},
  dateTaken: {type: Date, required: true},
  //event: {type: String},
  location: {type: String},
  description:{type: String},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  postID: {type: mongoose.Schema.Types.ObjectId},
  profileID: {type: mongoose.Schema.Types.ObjectId},
  //galleries: {type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('photo', photoSchema);
