'use strict';

const createError = require('http-errors');
const debug = require('debug')('olayers:post-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const Post = require('../model/post.js');

const bearerAuth = require('../lib/bearer-auth-middleware.js');

const postRouter = module.exports = new Router();

postRouter.post('/api/post', bearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/post');
  if(!req.body.name)
    return next(createError(400, 'requires content'));

  new Post ({
    timePosted: req.body.timePosted,
    likes: req.body.likes,
    photoID: req.body.photoID,
    videoID: req.body.videoID,
    description: req.body.description,
    userID: req.user._id.toString(),
  }).save()
    .then(post => res.json(post))
    .catch(next);

});
