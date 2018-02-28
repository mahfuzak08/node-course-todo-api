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
      token: jwt.sign({_id: u1id, access: 'auth'}, 'mahfuz123').toString()
    }]
  },
  {
    _id: u2id,
    name: 'Roni',
    email: 'roni@gmail.com',
    password: '123456'
  }
];

const sampleTodos = [
  {_id: new ObjectID(), task: 'Learning nodeJS'},
  {_id: new ObjectID(), task: 'Teach to other nodeJS', completed: true, completedAt: 234123}
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
