'use strict';

require('./mock-assets/mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const Photo = require('../model/photo.js');
const Post = require('../model/post.js');
const User = require('../model/user.js');
const Profile = require('../model/profile.js');
const postMock = require('./lib/post-mock.js');
const userMock = require('./lib/user-mocks.js');
const profileMock = require('./lib/profile-mock.js');
const photoMock = require('./lib/photo-mock.js');
const serverControl = require('./lib/server-control.js');
const baseURL = `http://localhost:${process.env.PORT}`;
require('../server.js');

describe('testing photo-router', function () {
  before(serverControl.startServer);
  after(serverControl.killServer);
  afterEach(done => {
    Promise.all([
      Post.remove({}),
      User.remove({}),
      Photo.remove({}),
      Profile.remove({}),
    ])
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/profiles/:id/photo', function() {
    beforeEach(userMock.bind(this));
    beforeEach(profileMock.bind(this));
    beforeEach(postMock.bind(this));
    it('should return a photo model', (done) => {
      superagent.post(`${baseURL}/api/profiles/${this.tempProfile._id.toString()}/photos`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .field('profileID', this.tempProfile._id.toString())
      .field('name', 'dog')
      .attach('file', `${__dirname}/mock-assets/dog.jpg`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('dog');
        expect(Boolean(res.body.dateUploaded)).to.equal(true);
        expect(res.body.profileID).to.equal(this.tempProfile._id.toString());
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(Boolean(res.body.imageURI)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });

  describe('testing POST /api/posts/:id/photo', function(){
    beforeEach(userMock.bind(this));
    beforeEach(profileMock.bind(this));
    beforeEach(postMock.bind(this));
    it('should return a photo model', (done) => {
      superagent.post(`${baseURL}/api/posts/${this.tempPost._id.toString()}/photos`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .field('postID', this.tempPost._id.toString())
      .field('name', 'dog')
      .attach('file', `${__dirname}/mock-assets/dog.jpg`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('dog');
        expect(res.body.postID).to.equal(this.tempPost._id.toString());
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(Boolean(res.body.imageURI)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });

  describe('testing DELETE /api/photos/:id', function() {
    beforeEach(userMock.bind(this));
    beforeEach(profileMock.bind(this));
    beforeEach(postMock.bind(this));
    beforeEach(photoMock.bind(this));

    it('should delete a photo', (done) => {
      console.log(`${baseURL}/api/photos/${this.tempPhoto._id.toString()}`);

      superagent.delete(`${baseURL}/api/photos/${this.tempPhoto._id.toString()}`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then( res => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });
  });
});
