const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../model/todo');
const {Users} = require('./../../model/users');

const u1id = new ObjectID();
const u2id = new ObjectID();

const sampleUsers = [
  {
    _id: u1id,
    name: 'Rabbi',
    email: 'rabbi@gmail.com',
    password: '123456',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: u1id, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: u2id,
    name: 'Roni',
    email: 'roni@gmail.com',
    password: '123456',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: u2id, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
];

const sampleTodos = [
  {_id: new ObjectID(), task: 'Learning nodeJS', _creator: u1id},
  {_id: new ObjectID(), task: 'Teach to other nodeJS', completed: true, completedAt: 234123, _creator: u2id}
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(sampleTodos);
  }).then(() =>done());
};

const populateUsers = (done) =>{
  Users.remove({}).then(() =>{
    var userOne = new Users(sampleUsers[0]).save();
    var userTwo = new Users(sampleUsers[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {sampleTodos, populateTodos, sampleUsers, populateUsers};
