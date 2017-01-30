'use strict';

const mongoose = require('mongoose');


const profileSchema = mongoose.Schema({
  bio: {type: String},
  eventsCreated: {type: Array},
});
