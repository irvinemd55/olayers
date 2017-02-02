'use strict';

const debug = require('debug')('olayers:photo-mock');
const Photo = require('../../model/photo.js');

module.exports = function(done){
  debug('mock photo');
  new Photo({
    name: 'taco tuesday',
    imageURI: 'http://fdsaf.jpg',
    objectKey: 'whatever',
    userID: this.tempUser._id.toString(),
    profileID: this.tempProfile._id.toString(),
    postID: this.tempPost._id.toString(),
  }).save()
  .then(photo => {
    this.tempPhoto = photo;
    done();
  })
  .catch(done);
};
