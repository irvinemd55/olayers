'use strict';

require('./mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');
//const userMock = require('./lib/user-mocks.js');
const serverControl = require('./lib/server-control.js');
const baseURL = `http://localhost:${process.env.PORT}`;
require('../server.js');

describe('testing user-router', function() {
  before(serverControl.startServer);
  after(serverControl.killServer);
  afterEach(done => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/signup', function() {
    it('should respond with a user', done => {
      superagent.post(`${baseURL}/api/signup`)
      .send({
        username: 'tonythebrony',
        email: 'myemail@email.com',
        password: '1234',
      })
      .then(res => {
        console.log('token:', res.text);
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });

    it('a missing field should respond with 400 status', done => {
      superagent.post(`${baseURL}/api/signup`)
      .send({username: 'justname'})
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    it('bad endpoint should respond with 404 status', done => {
      superagent.post(`${baseURL}/api/sing`)
      .send({})
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });

    describe('POST username or email already taken', function() {
      before(done => {
        superagent.post(`${baseURL}/api/signup`)
        .send({
          username: 'Doc Ock',
          password: 'spideysux',
          email: 'dr8@email.com',
        })
        .then(() => done())
        .catch(done);
      });
      it('should respond with 409 status', done => {
        superagent.post(`${baseURL}/api/signup`)
        .send({
          username: 'J. Jonah Jameson',
          password: 'bugle',
          email: 'dr8@email.com',
        })
        .then(done)
        .catch(err => {
          expect(err.status).to.equal(409);
          done();
        })
        .catch(done);
      });
    });
  });





});
