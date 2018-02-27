const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
if(process.env.PORT){
  mongoose.connect('mongodb://mahfuzak08:ma592321@ds249718.mlab.com:49718/todoapp');
}else{
  mongoose.connect('mongodb://localhost:27017/TodoApp');
}

module.exports = {mongoose};
