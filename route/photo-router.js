'use strict';

const createError = require('http-errors');
const debug = require('debug')('olayers:photo-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const Photo = require('../model/photo.js');

const bearerAuth = require('../lib/bearer-auth-middleware.js');

const photoRouter = module.exports = new Router();

photoRouter.post('/api/photo', bearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/photo');
  if(!req.body.name)
    return next(createError(400, 'requires name'));

  new Photo({
    name: req.body.name,
    location: req.body.location,
    dateTaken: req.body.dateTaken,
    //event: req.body.event,
    description: req.body.description,
    userID: req.user._id.toString(),
    postID: req.post._id.toString(),
    profileID: req.profile._id.toString(),


  }).save()
  .then(photo => {
    res.json(photo);
  })
  .catch(next);
});

photoRouter.get('/api/profile/photo', bearerAuth, function(req, res, next){
  debug('GET /api/photo/:id');
  Photo.findOne({
    postID: req.post._id.toString(),
    _id: req.params.id,
  })
  .then(photo => res.json(photo))
  .catch(() => next(createError(404, 'didn\'t find the photo')));
});

photoRouter.get('/api/post/photo', bearerAuth, function(req, res, next){
  debug('GET /api/photo/:id');
  Photo.findOne({
    profileID: req.profile._id.toString(),
    _id: req.params.id,
  })
  .then(photo => res.json(photo))
  .catch(() => next(createError(404, 'didn\'t find the photo')));
});

 photoRouter.delete('/api/photo/:id', bearerAuth, functino(req, res, next){
   debug('DELETE /api/photo/:id');
   Photo.findOneAndRemove({
     userID: req.user._id.toString(),
     _id: req.params.id,
   })
   .then(() => res.status(204).send())
   .catch(() => next(createError(404, 'didn\t find the phot')));
 });
