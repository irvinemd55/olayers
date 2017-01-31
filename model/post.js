'use strict';

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  profileID: {type: String, required: true},
  timePosted: {type: Date, required: true},
  likes: {type: Number},
  photoID: {type: mongoose.Schema.Types.ObjectId},
  videoID: {type: mongoose.Schema.Types.ObjectId},
  description: {type: String, required: true},
});

module.exports = mongoose.model('post', postSchema);
