var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Users} = require('./model/users');
var {Todo} = require('./model/todo');

var app = express();

app.use(bodyParser.json());

app.post('/todo', (req, res) =>{
  // console.log(req.body.task);
  var newTodo = new Todo({
    task: req.body.task
  });
  newTodo.save().then((result) =>{
    res.send(result);
  }, (e) =>{
    res.status(400).send(e);
  });
});

app.get('/todo', (req, res) =>{
  // console.log(req.body.task);
  Todo.find().then((result) =>{
    res.send({result});
  }, (e) =>{
    res.status(400).send(e);
  });
});

app.listen(3000, () =>{
  console.log('Server is up in 3000 port.');
});

//
// var newTodo = new Todo({
//   task: 'Learning mongodb',
//   completed: false
// });
//
// newTodo.save().then((doc) =>{
//   console.log('Task save successfully.', doc);
// }, (e) =>{
//   console.log('Unable to save task');
// });


// var newUsers = new users({
//
// });
//
// newUsers.save().then((doc) =>{
//   console.log('User save successfully.', doc);
// }, (e) =>{
//   console.log('Unable to save User');
// });
