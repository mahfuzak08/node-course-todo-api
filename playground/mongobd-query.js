// const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Users} = require('./../server/model/users');

var id = '5a93e63c8d874c25dc96e427';

Users.findById(id).then((user) =>{
  if(! user){
    return console.log('Unable to find user');
  }
  console.log(JSON.stringify(user, undefined, 2));
}, (e) =>{
  console.log(e);
});
