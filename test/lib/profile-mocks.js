'use strict';

const debug = require('debug')('olayers:user-mocks');
const Profile = require('../../model/profile.js');

module.exports = function(done) {
  debug('mock profile');
  new Profile({
    username: 'user' + Math.random(),
    email: 'name@email.com' + Math.random(),
  })
  .generatePasswordHash('1234')
  .then(user => user.save())
  .then(user => {
    this.tempUser = user;
    return user.generateToken();
  })
  .then(token => {
    this.tempToken = token;
    done();
  })
  .catch(done);
};
