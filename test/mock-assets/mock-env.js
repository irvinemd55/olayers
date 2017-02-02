'use strict';

process.env.PORT=4000;
process.env.MONGODB_URI='mongodb://localhost/testing';
process.env.APP_SECRET='thomasUsesTooManyEmojis';
process.env.AWS_BUCKET='thiscanbeanything';
process.env.AWS_ACCESS_KEY_ID='thisalsocanbeanything';
process.env.AWS_SECRET_ACCESS_KEY='thisshouldbecool';

require('../lib/aws-mock.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
