'use strict';

const debug = require('debug')('olayers:photo-mock');
const Photo = require('../../model/photo.js');

module.exports = function(done){
  debug('mock photo');
  new Photo({
    name: 'taco tuesday',
    dateTaken: new Date(),
    url: 'http://fdsaf.jpg',
    userID: this.tempUser._id.toString(),
    profileID: this.tempProfile._id.toString(),
  }).save()
  .then(photo => {
    this.tempPhoto = photo;
    done();
  })
  .catch(done);
};
