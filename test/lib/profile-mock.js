'use strict';

const debug = require('debug')('olayers:profile-mock');
const Profile = require('../../model/profile.js');

module.exports = function(done) {
  debug('mock profile');
  new Profile({
    name: 'Leroy Jenkins',
    location: 'Brazil',
    costumesWorn: ['banana', 'burrito'],
    cosplayer: true,
    vendor: false,
    fan: true,
  }).save()
  .then(profile => {
    this.tempProfile = profile;
    done();
  })
  .catch(done);
};
