require('./config/config.js');

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Users} = require('./model/users');
var {Todo} = require('./model/todo');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todo', authenticate, (req, res) =>{
  // console.log(req.body.task);
  var newTodo = new Todo({
    task: req.body.task,
    _creator: req.user._id
  });
  newTodo.save().then((result) =>{
    res.send(result);
  }, (e) =>{
    res.status(400).send(e);
  });
});

app.get('/todo', authenticate, (req, res) =>{
  // console.log(req.body.task);
  Todo.find({_creator: req.user._id}).then((result) =>{
    res.send({result});
  }, (e) =>{
    res.status(400).send(e);
  });
});

// GET /todo/122342
app.get('/todo/:id', authenticate, (req, res) =>{
  var id = req.params.id;
  if(! ObjectID.isValid(id)){
    res.status(404).send('ID is not valid');
  }

  Todo.findOne({_id: id, _creator: req.user._id}).then((result) =>{
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
app.delete('/todo/:id', authenticate, async (req, res) =>{
  var id = req.params.id;
  if(! ObjectID.isValid(id)){
    res.status(404).send('ID is not valid');
  }

  try{
    var result = await Todo.findOneAndRemove({_id: id, _creator: req.user._id});
    if(!result){
      res.status(404).send('No todo found by this id');
    }else{
      res.send({result});
    }
  } catch (e) {
    res.status(400).send(e);
  }
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

app.post('/user', async (req, res) =>{
  try{
    var body = _.pick(req.body, ['name', 'email', 'password']);
    var newUser = new Users(body);
    await newUser.save();
    var token = await newUser.generateAuthToken();
    res.header('x-auth', token).send(newUser);
  } catch (e) {
    res.status(400).send(e);
  }

  // newUser.save().then(() =>{
  //   return newUser.generateAuthToken();
  // }).then((token) =>{
  //   res.header('x-auth', token).send(newUser);
  // }).catch((e) =>{
  //   res.status(400).send(e);
  // });
});

app.get('/user/me', authenticate, (req, res) =>{
  res.send(req.user);
})

app.post('/user/login', async (req, res) =>{
  try{
    var body = _.pick(req.body, ['email', 'password']);
    var user = await Users.findByCredentials(body.email, body.password);
    var token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send();
  }

  // Users.findByCredentials(body.email, body.password).then((user) =>{
  //   return user.generateAuthToken().then((token) =>{
  //     res.header('x-auth', token).send(user);
  //   });
  // }).catch((e) =>{
  //   res.status(400).send();
  // })
});

app.delete('/user/me/token', authenticate, async (req, res) =>{
  try{
    await req.user.removeToken(req.token);
    res.status(200).send('Logout Successfull...');
  } catch(e) {
    res.status(400).send(e);
  }

  // req.user.removeToken(req.token).then(() =>{
  //   res.status(200).send('Logout Successfull...');
  // }, (e) =>{
  //   res.status(400).send(e);
  // })
});

app.listen(port, () =>{
  console.log(`Server is up in ${port} port.`);
});

module.exports = {app};
