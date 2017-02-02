'use strict';

const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  name: {type: String, required: true},
  dateUploaded: {type: Date, required: true, default: Date.now},
  objectKey: {type: String, required: true, unique: true},
  imageURI: {type: String, required: true, unique: true},
  //event: {type: String},
  location: {type: String},
  description:{type: String},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  postID: {type: mongoose.Schema.Types.ObjectId},
  profileID: {type: mongoose.Schema.Types.ObjectId},
  //galleries: {type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('photo', photoSchema);
