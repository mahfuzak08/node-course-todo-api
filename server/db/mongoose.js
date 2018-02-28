const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// if(process.env.PORT !== 3000){
  // mongoose.connect('mongodb://mahfuzak08:ma592321@ds249718.mlab.com:49718/todoapp');
// }else{
  mongoose.connect(process.env.MONGODB_URI);
// }

module.exports = {mongoose};
