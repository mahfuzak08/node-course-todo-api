const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

// var message = 'I am user number 1';
// var hash = SHA256(message).toString();
//
// console.log(message);
// console.log(hash);

var data = {id: 1};
var token = jwt.sign(data, 'mahfuz');
console.log(token);

var decode = jwt.verify(token, 'mahfuz');
console.log(decode);
