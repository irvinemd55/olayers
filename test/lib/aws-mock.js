'use strict';

const AWSMock = require('aws-sdk-mock');

AWSMock.mock('S3', 'upload', function(params, callback) {
  if(params.ACL != 'public-read')
    return callback(new Error('ACL must be public read'));
  if(params.Bucket != process.env.AWS_BUCKET)
    return callback(new Error('BUCKET must be process.env.AWS_BUCKET'));
  if(!params.Key)
    return callback(new Error('Key must be set'));
  if(!params.Body)
    return callback(new Error('Body must be set'));

  callback(null, {
    Key: params.Key,
    Location: `www.thegrimheep.com/${params.Key}`,
  });
});

AWSMock.mock('S3', 'deleteObject', function(params, callback) {

  if(!params.Key)
    return callback(new Error('Key must be set'));
  if(params.Bucket !== 'olayers-staging')
    return callback(new Error('Bucket must be olayers-staging'));
  callback();
});
