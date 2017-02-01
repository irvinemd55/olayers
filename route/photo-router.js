'use strict';

const fs = require('fs');
const path = require('path');

const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const createError = require('http-errors');
const debug = require('debug')('olayers:photo-router');

const Router = require('express').Router;


const Photo = require('../model/photo.js');
const Profile = require('../model/profile.js');
const Post = require('../model/post.js');

const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const upload = multer({dest: dataDir});
const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;


const photoRouter = module.exports = new Router();

function s3Promise(params){
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      if (err) return reject(err);
      resolve (s3data);
    });
  });
}


//Post routing for setting up a profile photo using profile and photo models
photoRouter.post('/api/profile/:id/photo'), bearerAuth, upload.single('image'), function(req, res, next){
  debug('hit POST route /api/profile/:pid/photo');
  if(!req.file)
    return next(createError(400, 'no file'));

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: 'olayers-staging',
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path),
  };
  let tempProfile = null;
  let tempPhoto = null;
  Profile.findById(req.params.profileID)
.catch(err => Promise.reject(createError(404, err.message)))
.then(profile => {
  if(profile.userID.toString() !== req.user._id.toString()) {
    return Promise.reject(createError(401, 'User not authorized'));
  }
  tempProfile = profile;
  return s3Promise(params);
})
.catch(err => err.status ? Promise.reject(err) : Promise.reject(createError(500, err.message)))
.then(s3data => {

  del([`${dataDir}/*`]);
  let photoData = {
    name: req.body.name,
    objectKey: s3data.Key,
    imageURI: s3data.Location,
    location: req.body.location,
    dateTaken: req.body.dateTaken,
    description: req.body.description,
    userID: req.user._id.toString(),
    profileID: req.profile._id.toString(),
  };
  return new Photo(photoData).save();
})
.then(photo => {
  tempPhoto = photo;
  tempProfile.photoID = tempPhoto._id.toString();
  return tempProfile.save();
})
.then(() => res.json(tempPhoto))
.catch(err => {
  del([`${dataDir}/*`]);
  next(err);
});
};


//Posts images on user posts using post and photo models
photoRouter.post('/api/post/:id/photo'), bearerAuth, upload.single('image'), function(req, res, next){
  debug('hit POST route /api/post/:id/photo');
  if(!req.file)
    return next(createError(400, 'no file'));

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: 'olayers-staging',
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path),
  };
  let tempPost = null;
  let tempPhoto = null;
  Post.findById(req.params.postID)
.catch(err => Promise.reject(createError(404, err.message)))
.then(post => {
  if(post.userID.toString() !== req.user._id.toString()) {
    return Promise.reject(createError(401, 'User not authorized'));
  }
  tempPost = post;
  return s3Promise(params);
})
.catch(err => err.status ? Promise.reject(err) : Promise.reject(createError(500, err.message)))
.then(s3data => {

  del([`${dataDir}/*`]);
  let photoData = {
    name: req.body.name,
    objectKey: s3data.Key,
    imageURI: s3data.Location,
    location: req.body.location,
    dateTaken: req.body.dateTaken,
    description: req.body.description,
    userID: req.user._id.toString(),
    postID: req.post._id.toString(),
  };
  return new Photo(photoData).save();
})
.then(photo => {
  tempPhoto = photo;
  tempPost.photoID = tempPhoto._id.toString();
  return tempPost.save();
})
.then(() => res.json(tempPhoto))
.catch(err => {
  del([`${dataDir}/*`]);
  next(err);
});
};



//deletes individual photo by ID
photoRouter.delete('/api/photo/:id', bearerAuth, function(req, res, next){
  debug('DELETE /api/photo/:id');
  Photo.findbyId(req.params.photoID)
  .catch(err => Promise.reject(createError(404,err.message)))
  .then(photo => {
    if(photo.userID.toString() !==req.user._id.toString())
      return Promise.reject(createError(401, 'user not authorized to delete photo'));

    let params = {
      Bucket: 'olayers-staging',
      Key: photo.objectKey,
    };
    return s3.deleteObject(params).promise();
  })
  .catch(err => err.status ? Promise.reject(err) : Promise.reject(createError(500, err.message)))
  .then(() => {
    return Photo.findByIdAndRemove(req.params.photoID);
  })
  .then(() => res.sendStatus(204))
  .catch(next);
});
