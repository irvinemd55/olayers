'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('olayers:post-router');

const Post = require('../model/post.js');
const bearerAuth = require('../lib/bearer-auth-middleware');

const postRouter = module.exports = new Router();
//route for creating a new post
postRouter.post('/api/posts', bearerAuth, jsonParser, function(req, res, next){
  debug('POST api/posts');
  if(!req.body.description)
    return next(createError(400, 'requires description'));

  new Post({
    description: req.body.description,
    timePosted: req.body.timePosted,
    likes: req.body.likes,
    //photoID: req.photo._id.toString(),
    userID: req.user._id.toString(),
  }).save()
  .then(post => res.json(post))
  .catch(next);
});

//route for finding a user's posts (does not need auth)
postRouter.get('/api/posts/:id', function(req, res, next){
  debug('GET /api/posts/:id');
  Post.findById(req.params.id)
  .then(post => res.json(post))
  .catch(() => next(createError(404, 'not found')));
});

// route for finding your own posts
postRouter.get('/api/posts/me/myposts', bearerAuth, function(req, res, next){
  debug('GET /api/posts/me/myposts');
  Post.findOne({
    userID: req.user._id.toString(),
  })
  .then(post => res.json(post))
  .catch(() => next(createError(404, 'didn\'t find the post')));
});

// route for finding post that belong to a profile
postRouter.get('/api/posts', function(req, res, next) {
  debug('GET /api/posts');
  Post.find({})
  .then(posts => res.json(posts))
  .catch(err => next(createError(404, err.message)));
});

//route for editing your own posts
postRouter.put('/api/posts/me/myposts/:id', bearerAuth, jsonParser, function(req, res, next){
  debug('PUT /api/posts/me/myposts/:id');
  Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(post => res.json(post))
  .catch(() => next(createError(404, 'didn\'t find the post')))
  .catch(next); //double check this potential 400 error
});
