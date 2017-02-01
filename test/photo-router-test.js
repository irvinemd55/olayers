'use strict';

require('./mock-assets/mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const Photo = require('../model/photo.js');
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
    Photo.remove({})
    .then(() => done())
    .catch(done);
  });

  // describe('testing POST /api/profile/:id/photo', function () {
  //   before(userMock.bind(this));
  //   before(profileMock.bind(this));
  //   it.only('should respond with a photo', (done) => {
  //     superagent.post(`${baseURL}/api/profile/${this.tempProfile._id.toString()}/photo`)
  //     .send({
  //       name: 'taco tuesday',
  //       url: 'someurlstring.com',
  //       dateTaken: new Date(),
  //       userID: this.tempUser._id.toString(),
  //     })
  //     .set('Authorization',`Bearer ${this.tempToken}`)
  //     .then(res => {
  //       expect(res.status).to.equal(200);
  //       expect(res.body.name).to.equal('taco tuesday');
  //       expect(res.body.url).to.equal('someurlstring.com');
  //
  //       done();
  //     })
  //     .catch(done);
  //   });
  // });

  describe('testing POST /api/profile/:id/photo', function(){
    beforeEach(userMock.bind(this));
    beforeEach(profileMock.bind(this));
    it.only('should return a photo model', (done) => {
      superagent.post(`${baseURL}/api/profile/${this.tempProfile._id.toString()}/photo`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .field('profileID', this.tempProfile._id.toString())
      .field('name', 'dog')
      .attach('file', `${__dirname}/mock-assets/dog.jpg`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('dog');
        expect(res.body.profileID).to.equal(this.tempProfile._id.toString());
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(Boolean(res.body.url)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });




  describe('testing DELETE /api/photos', function(){
    beforeEach(userMock.bind(this));
    beforeEach(profileMock.bind(this));
    beforeEach(photoMock.bind(this));

    it('should delete a photo', (done) => {
      superagent.delete(`${baseURL}/api/profile/${this.tempProfile._id.toString()}/photo`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then( res => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });
  });
});
