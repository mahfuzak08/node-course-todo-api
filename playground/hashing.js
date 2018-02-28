const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123456';

bcrypt.genSalt(10, (err, salt) =>{
  bcrypt.hash(password, salt, (err, hash) =>{
    console.log(hash);
  });
});

var hv = '$2a$10$0SarkTRe7fK55e2CkbmESeiVdDi2pQebyyEDkszb.h2S8cuJeajW6';
bcrypt.compare(password, hv, (err, res) =>{
  console.log(res);
});
// var message = 'I am user number 1';
// var hash = SHA256(message).toString();
//
// console.log(message);
// console.log(hash);

// var data = {id: 1};
// var token = jwt.sign(data, 'mahfuz');
// console.log(token);
//
// var decode = jwt.verify(token, 'mahfuz');
// console.log(decode);
