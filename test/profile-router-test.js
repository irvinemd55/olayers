'use strict';

require('./mock-assets/mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/profile.js');
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
    it('should respond with a profile', (done) => {
      superagent.post(`${baseURL}/api/`)
    })
  })
})
