const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');

const sampleTodos = [
  {_id: new ObjectID(), task: 'Learning nodeJS'},
  {_id: new ObjectID(), task: 'Teach to other nodeJS'}
]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(sampleTodos);
  }).then(() =>done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var task = 'Test todo text 13';

    request(app)
      .post('/todo')
      .send({task})
      .expect(200)
      .expect((res) => {
        expect(res.body.task).toBe(task);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({task}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].task).toBe(task);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todo')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todo', () =>{
  it('should get all todos', (done) =>{
    request(app)
      .get('/todo')
      .expect(200)
      .expect((res) =>{
        expect(res.body.result.length).toBe(2);
      })
      .end(done);
  })
});


describe('GET /todo/:id', () =>{
  it('should return todo doc', (done) =>{
    request(app)
      .get(`/todo/${sampleTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) =>{
        expect(res.body.result.task).toBe(sampleTodos[0].task);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) =>{
    var id = new ObjectID();
    request(app)
      .get(`/todo/${id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) =>{
    var id = 123;
    request(app)
      .get(`/todo/${id}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todo/:id', () =>{
  it('should remove a todo', (done) =>{
    var hexId = sampleTodos[1]._id.toHexString();
    request(app)
      .delete(`/todo/${hexId}`)
      .expect(200)
      .expect((res) =>{
        expect(res.body.result._id).toBe(hexId);
      })
      .end((err, res) =>{
        if(err){
          return done(err);
        }

        Todo.findById(hexId).then((todo) =>{
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) =>{
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todo/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) =>{
    var id = 123;
    request(app)
      .delete(`/todo/${id}`)
      .expect(404)
      .end(done);
  });
});
