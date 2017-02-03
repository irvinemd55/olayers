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

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});


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
photoRouter.post('/api/profiles/:id/photos', bearerAuth, upload.single('file'), function(req, res, next){
  debug('hit POST route /api/profiles/:id/photos');
  if(!req.file)
    return next(createError(400, 'no file'));

  let tempProfile = null;
  let tempPhoto = null;
  Profile.findById(req.params.id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(profile => {
    if(profile.userID.toString() !== req.user._id.toString()) {
      return Promise.reject(createError(401, 'User not authorized'));
    }
    tempProfile = profile;
    return s3Promise({
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
      Body: fs.createReadStream(req.file.path),
    });
  })
  .catch(err => err.status ? Promise.reject(err) : Promise.reject(createError(500, err.message)))
  .then(s3data => {

    del([`${dataDir}/*`]);
    let photoData = {
      name: req.body.name,
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      location: req.body.location,
      dateUploaded: req.body.dateUploaded,
      description: req.body.description,
      userID: req.user._id.toString(),
      profileID: req.body.profileID.toString(),
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
});


//Posts images on user posts using post and photo models
photoRouter.post('/api/posts/:id/photos', bearerAuth, upload.single('file'), function(req, res, next){
  debug('hit POST route /api/posts/:id/photos');
  if(!req.file)
    return next(createError(400, 'no file'));

  let tempPost = null;
  let tempPhoto = null;
  Post.findById(req.params.id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(post => {
    if(post.userID.toString() !== req.user._id.toString()) {
      return Promise.reject(createError(401, 'User not authorized'));
    }
    tempPost = post;
    return s3Promise({
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
      Body: fs.createReadStream(req.file.path),
    });
  })
  .catch(err => err.status ? Promise.reject(err) : Promise.reject(createError(500, err.message)))
  .then(s3data => {

    del([`${dataDir}/*`]);
    let photoData = {
      name: req.body.name,
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      location: req.body.location,
      dateUploaded: req.body.dateUploaded,
      description: req.body.description,
      userID: req.user._id.toString(),
      postID: req.body.postID.toString(),
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
});

//deletes individual photo by ID
photoRouter.delete('/api/photos/:id', bearerAuth, function(req, res, next){
  debug('DELETE /api/photos/:id');
  Photo.findById(req.params.id)
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
