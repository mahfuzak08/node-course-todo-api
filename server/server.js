var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Users} = require('./model/users');
var {Todo} = require('./model/todo');

var app = express();
const port = process.env.PORT || 3000;

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

// GET /todo/122342
app.get('/todo/:id', (req, res) =>{
  var id = req.params.id;
  if(! ObjectID.isValid(id)){
    res.status(404).send('ID is not valid');
  }

  Todo.findById(id).then((result) =>{
    if(!result){
      res.status(404).send('No todo found by this id');
    }else{
      res.send({result});
      // res.send(result.task);
    }
  }, (e) =>{
    res.status(400).send(e);
  });
});


// DELETE /todo/122342
app.delete('/todo/:id', (req, res) =>{
  var id = req.params.id;
  if(! ObjectID.isValid(id)){
    res.status(404).send('ID is not valid');
  }

  Todo.findByIdAndRemove(id).then((result) =>{
    if(!result){
      res.status(404).send('No todo found by this id');
    }else{
      res.send({result});
    }
  }, (e) =>{
    res.status(400).send(e);
  });
});

// For update a todo
// PATCH /todo/122342
app.patch('/todo/:id', (req, res) =>{
  var id = req.params.id;
  var body = _.pick(req.body, ['task', 'completed']);

  if(! ObjectID.isValid(id)){
    res.status(404).send('ID is not valid');
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((result) =>{
    if(!result){
      res.status(404).send('No todo found by this id');
    } else {
      res.send({result});
    }
  }, (e) =>{
    res.status(400).send(e);
  });
});



app.listen(port, () =>{
  console.log(`Server is up in ${port} port.`);
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

module.exports = {app};
