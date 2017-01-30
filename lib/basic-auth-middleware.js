'use strict';

const debug = require('debug')('olayers:basic-auth-middleware');
const createError = require('http-errors');
const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('basic authorization middleware');
  let Authorization = req.headers.Authorization;
  if(!Authorization)
    return  next(createError(401, 'Authorization header not forwarded'));
  if(!Authorization.starsWith('Basic '))
    return next(createError(401, 'Basic authorization not forwarded'));
  let basic64 = Authorization.split('Basic ')[1];
  let usernameAndPassword = new Buffer(basic64, 'basic64').toString().split(':');
  let username = usernameAndPassword[0];
  let password = usernameAndPassword[1];
  User.findOne({username: username})
  .then(user => {
    return user.comparePasswordHash(password);
  })
  .then(user => {
    req.user = user;
    next()
    .catch(err => {
      createError(401, err.message);
    });
  });

};
