'use strict';

const debug = require('debug')('olayers:post-mock');
const Post = require('../../model/post.js');

module.exports = function(done) {
  debug('mock post');
  new Post({
    description: 'post' + Math.random(),
    userID: this.tempUser._id.toString(),
    profileID: this.tempProfile._id.toString(),
  }).save()
  .then(post => {
    this.tempPost = post;
    done();
  })
  .catch(done);
};
