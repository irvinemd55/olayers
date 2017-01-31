'use strict';

const createError = require('http-errors');
const debug = require('debug')('olayers:profile-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const Profile = require('../model/profile.js');

const bearerAuth = require('../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = new Router();

profileRouter.post('/api/profile', bearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/profile');
  if(!req.body.name)
    return next(createError(400, 'requires name'));

  new Profile({
    name: req.body.name,
    bio: req.body.bio,
    eventsCreated: req.body.eventsCreated,
    location: req.body.location,
    interests: req.body.interests,
    dateJoined: req.body.dateJoined,
    costumesWorn: req.body.costumesWorn,
    eventsAttended: req.body.eventsAttended,
    cosplayer: req.body.cosplayer,
    vendor: req.body.vendor,
    fan: req.body.fan,
    userID: req.user._id.toString(),

  }).save()
  .then(profile => {
    res.json(profile);
  })
  .catch(next);
});

profileRouter.get('/api/profile/:id', bearerAuth, function(req, res, next){
  debug('GET /api/profile/:id');
  Profile.findOne({
    userID: req.user._id.toString(),
    _id: req.params.id,
  })
  .then(profile => res.json(profile))
  .catch(() => next(createError(404, 'didn\'t find the profile')));
});

profileRouter.get('/api/profile/me', bearerAuth, function(req, res, next){
  debug('GET /api/profile/me');
  Profile.findOne({
    userID: req.user._id.toString(),
    _id: req.user.id,
  })
  .then(profile => res.json(profile))
  .catch(() => next(createError(404, 'didn\'t find the profile')));

});
