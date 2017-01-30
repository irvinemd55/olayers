const cors = require('cors');
const morgan = require('morgan');
const bluebird = require('bluebird');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('cfgram:server');

const app = express();
