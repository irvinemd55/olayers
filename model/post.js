'use strict';

const mongoose = require('mongoose');
const Profile = require('./profile.js');



const postSchema = mongoose.Schema({
  description: {type: String, required: true},
  timePosted: {type: Date, required: true, default: Date.now},
  likes: {type: Number, required: true, default: 0},
  photoID: {type: mongoose.Schema.Types.ObjectId},
  //videoID: {type: mongoose.Schema.Types.ObjectId}, TODO stretch goal
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  profileID: {type: mongoose.Schema.Types.ObjectID, required: true},
});

postSchema.pre('save', function(next) {
  Profile.findById(this.profileID)
  .then(profile => {
    profile.posts.push(this._id.toString());
    return profile.save();
  })
  .then(() => next())
  .catch(next);
});


module.exports = mongoose.model('post', postSchema);
