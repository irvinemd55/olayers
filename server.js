
const cors = require('cors');
const morgan = require('morgan');
const bluebird = require('bluebird');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('cfgram:server');

const app = express();

'use strict';

require('dotevn').load();

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('olayers:server');

const app = express();

mongoose.Promise = require('bluebird');
mongoose.connect = (process.env.MONGODB_URI);
app.use(cors());
app.use(morgan('dev'));
app.use(require('./route/user-router.js'));
app.use(function(err, req, res, next) {
  if(err.status) {
    res.status(err.status).send();
    return;
  }
  if(err.name === 'ValidationError') {
    res.status(400).send();
    return;
  }
  if(err.name === 'MongoError' && err.code == '11000') {
    res.status(409).send();
    return;
  }
  res.status(500).send();
});

const server = app.listen(process.env.PORT , () => {
  console.log('server oLayers is on!', process.env.PORT);
});

server.isRunning = true;
module.exports = server;

