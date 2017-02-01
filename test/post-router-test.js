'use strict';

require('./mock-assets/mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
const Post = require('../model/post.js');
const Profile = require('../model/profile.js');
const userMock = require('./lib/user-mocks.js');
const profileMock = require('./lib/profile-mock.js');
const postMock = require('./lib/post-mock.js');
const serverControl = require('./lib/server-control.js');
const baseURL = `http://localhost:${process.env.PORT}`;

describe('testing post-router', function() {
  before(serverControl.startServer);
  after(serverControl.killServer);
  afterEach(done => {
    Promise.all([
      Post.remove({}),
      User.remove({}),
      Profile.remove({}),
    ])
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/posts', function() {
    beforeEach(userMock.bind(this));
    beforeEach(profileMock.bind(this));
    it('should respond with a post', done => {
      superagent.post(`${baseURL}/api/posts`)
      .send({
        profileID: this.tempProfile._id.toString(),
        description: 'best cosplay ever',
      })
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.description).to.equal('best cosplay ever');
        expect(Boolean(res.body.timePosted)).to.equal(true);
        expect(res.body.likes).to.equal(0);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      })
      .catch(done);
    });

    it('should respond with a 400 bad request', done => {
      superagent.post(`${baseURL}/api/posts`)
      .send({})
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    it('should respond with a 401 unauthorized', done => {
      superagent.post(`${baseURL}/api/posts`)
      .send({title: 'hack post!'})
      .set('Authorization', 'Bearer badtoken')
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET /api/posts/me/myposts', function() {
    beforeEach(userMock.bind(this));
    beforeEach(profileMock.bind(this));
    beforeEach(postMock.bind(this));
    it('should respond with user\'s posts', done => {
      superagent.get(`${baseURL}/api/posts/me/myposts`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.instanceof(Array);
        expect(res.body[0].description).to.equal(this.tempPost.description);
        expect(Boolean(res.body[0].timePosted)).to.equal(true);
        expect(res.body[0].likes).to.equal(0);
        expect(res.body[0].userID).to.equal(this.tempUser._id.toString());
        expect(res.body[0].profileID).to.equal(this.tempProfile._id.toString());
        done();
      })
      .catch(done);
    });

    it('should respond with 401 unauthorized', done => {
      superagent.get(`${baseURL}/api/posts/me/myposts`)
      .set('Authorization', `Bearer badtoken`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('should respond with 404 post not found', done => {
      superagent.get(`${baseURL}/api/posts/me/hacktheplanet`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET /api/posts/:id', function() {
    beforeEach(userMock.bind(this));
    beforeEach(profileMock.bind(this));
    beforeEach(postMock.bind(this));

    it('should respond with a post', done => {
      superagent.get(`${baseURL}/api/posts/${this.tempPost._id.toString()}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.description).to.equal(this.tempPost.description);
        expect(Boolean(res.body.timePosted)).to.equal(true);
        expect(res.body.likes).to.equal(0);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(res.body.profileID).to.equal(this.tempProfile._id.toString());
        done();
      })
      .catch(done);
    });

    it('should respond with 404 post not found', done => {
      superagent.get(`${baseURL}/api/posts/hacktheplanet`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET /api/posts', function() {
    beforeEach(userMock.bind(this));
    beforeEach(profileMock.bind(this));
    beforeEach(postMock.bind(this));

    it('should respond with all the posts', done => {
      superagent.get(`${baseURL}/api/posts`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.instanceof(Array);
        done();
      })
      .catch(done);
    });

    it('should respond with 401 unauthorized', done => {
      superagent.get(`${baseURL}/api/posts`)
      .set('Authorization', `Bearer badtoken`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('should respond with 404 not found', done => {
      superagent.get(`${baseURL}/api/post`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });
  });

  describe('testing PUT /api/posts/me/myposts/:id', function() {
    beforeEach(userMock.bind(this));
    beforeEach(profileMock.bind(this));
    beforeEach(postMock.bind(this));

    it('should respond with an updated post', done => {
      superagent.put(`${baseURL}/api/posts/me/myposts/${this.tempPost._id.toString()}`)
      .send({description: 'updated description'})
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.description).to.equal('updated description');
        expect(Boolean(res.body.timePosted)).to.equal(true);
        expect(res.body.timePosted).to.not.equal(this.tempPost.timePosted);
        expect(res.body.likes).to.equal(0);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(res.body.profileID).to.equal(this.tempProfile._id.toString());
        done();
      })
      .catch(done);
    });

    it('should respond with a 400 bad request', done => {
      superagent.put(`${baseURL}/api/posts/me/myposts/${this.tempPost._id.toString()}`)
      .send('will not update description')
      .set('Authorization', `Bearer ${this.tempToken}`)
      .set('Content-type', 'application/json')
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    it('should respond with a 401 unauthorized', done => {
      superagent.put(`${baseURL}/api/posts/me/myposts/${this.tempPost._id.toString()}`)
      .send({description: 'updated description'})
      .set('Authorization', `Bearer badtoken`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('should respond with a 404 not found', done => {
      superagent.put(`${baseURL}/api/posts/me/myposts/hacktheplanet`)
      .send({description: 'updated description'})
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });
  });
});
