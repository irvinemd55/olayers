
'use strict';

require('./mock-assets/mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const Profile = require('../model/profile.js');
const userMock = require('./lib/user-mocks.js');
const serverControl = require('./lib/server-control.js');
const baseURL = `http://localhost:${process.env.PORT}`;
require('../server.js');

describe('testing profile-router', function () {
  before(serverControl.startServer);
  after(serverControl.killServer);
  afterEach(done => {
    Profile.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/profile', function () {
    before(userMock.bind(this));
    it('should respond with a profile', (done) => {
      superagent.post(`${baseURL}/api/profile`)
      .send({
        name: 'Bob James',
        location: 'Seattle',
        costumesWorn: ['batman', 'neo'],
        cosplayer: true,
        vendor: true,
        fan: false,
      })
      .set('Authorization',`Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Bob James');
        expect(res.body.location).to.equal('Seattle');
        expect(res.body.costumesWorn[0]).to.equal('batman');
        expect(res.body.cosplayer).to.be.a('Boolean');
        expect(res.body.vendor).to.be.a('Boolean');
        expect(res.body.fan).to.be.a('Boolean');
        expect(Boolean(res.body.dateJoined)).to.equal(true);
        done();
      })
      .catch(done);
    });
  });
});

describe('testing GET /api/profile/:id', function() {
  beforeEach(userMock.bind(this));
  beforeEach(profileMock.bind(this));

  it('should respond with a gallery', (done) => {
    let url = `${baseURL}/api/profile/${this.tempProfile._id.toString()}`;
    superagent.get(url)
    .then(done)
    .catch(res => {
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(this.tempProfile.name);
      expect(res.body.location).to.equal(this.tempProfile.location);
      expect(res.body.costumesWorn[0]).to.equal(this.tempProfile.costumesWorn);
      expect(res.body.cosplayer).to.be.a(this.tempProfile.cosplayer);
      expect(res.body.vendor).to.be.a(this.tempProfile.vendor);
      expect(res.body.fan).to.be.a(this.tempProfile.fan);
      expect(Boolean(res.body.dateJoined)).to.equal(true);
      done();
    })
    .catch(done);
  });

  it('should resond with a 401', (done) => {
    let url = `${baseURL}/api/prolfile/${this.tempProfile._id.toString()}`;
    superagent.get(url)
    .then(done)
    .cost(res => {
      expect(res.status).to.equal(401);
      done();
    })
    .catch(done);
  });
});
