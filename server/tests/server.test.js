const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');

const sampleTodos = [
  {task: 'Learning nodeJS'},
  {task: 'Teach to other nodeJS'}
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
