var mongoose = require('mongoose');

var Users = mongoose.model('Users', {
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email:{
    type: String,
    required: true,
    trim: true,
    minlength: 5
  }
});

module.exports = {Users};
