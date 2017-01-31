'use strict';

const mongoose = require('mongoose');



const postSchema = mongoose.Schema({
  description: {type: String, required: true},
  timePosted: {type: Date, required: true, default: Date.now},
  likes: {type: Number, required: true, default: 0},
  photoID: {type: mongoose.Schema.Types.ObjectId},
  //videoID: {type: mongoose.Schema.Types.ObjectId}, TODO stretch goal
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  //TODO additional profileID may be needed in refactoring
});

module.exports = mongoose.model('post', postSchema);
