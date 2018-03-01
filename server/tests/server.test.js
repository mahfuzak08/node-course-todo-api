const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {Users} = require('./../model/users');
const {sampleTodos, populateTodos, sampleUsers, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todo/:id', () =>{
  it('should update the todo', (done) =>{
    var hexId = sampleTodos[0]._id.toHexString();
    var task = 'This come from patch test';

    request(app)
      .patch(`/todo/${hexId}`)
      .send({completed: true, task})
      .expect(200)
      .expect((res) =>{
        expect(res.body.result.task).toBe(task);
        expect(res.body.result.completed).toBe(true);
        expect(res.body.result.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) =>{
    var hexId = sampleTodos[1]._id.toHexString();
    var task = 'should clear';

    request(app)
      .patch(`/todo/${hexId}`)
      .send({completed: false, task, completedAt: null})
      .expect(200)
      .expect((res) =>{
        expect(res.body.result.task).toBe(task);
        expect(res.body.result.completed).toBe(false);
        expect(res.body.result.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET /user/me', () =>{
  it('should return user if authenticate', (done) =>{
    request(app)
      .get('/user/me')
      .set('x-auth', sampleUsers[0].tokens[0].token)
      .expect(200)
      .expect((res) =>{
        expect(res.body._id).toBe(sampleUsers[0]._id.toHexString());
        expect(res.body.email).toBe(sampleUsers[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticate', (done) =>{
    request(app)
      .get('/user/me')
      .set('x-auth', 'asasdfasdfasd fasdfasdfasdfasdfasdfasdfasd fasd fasdfasdfasdfasdf')
      .expect(401)
      .expect((res) =>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /user', () =>{
  it('should create a user', (done) =>{
    var name = 'example';
    var email = 'example@example.com';
    var password = 'abc!123';

    request(app)
      .post('/user')
      .send({name, email, password})
      .expect(200)
      .expect((res) =>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) =>{
        if(err) return done(err);

        Users.findOne({email}).then((user) =>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation error if request invalid', (done) =>{
    var name = 'example';
    var email = 'examplexample.com';
    var password = 'abc23';

    request(app)
      .post('/user')
      .send({name, email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) =>{
    var email = 'rabbi@gmail.com';

    request(app)
      .post('/user')
      .send({email})
      .expect(400)
      .end(done);
  });

});

describe('POST /user/login', () =>{
  it('should login user and return auth token', (done) =>{
    request(app)
      .post('/user/login')
      .send({
        email: sampleUsers[1].email,
        password: sampleUsers[1].password
      })
      .expect(200)
      .expect((res) =>{
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) =>{
        if(err){
          return done(err);
        }

        Users.findById(sampleUsers[1]._id).then((user) =>{
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) =>{
    request(app)
      .post('/user/login')
      .send({
        email: sampleUsers[1].email,
        password: sampleUsers[1].password +1
      })
      .expect(400)
      .expect((res) =>{
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) =>{
        if(err){
          return done(err);
        }

        Users.findById(sampleUsers[1]._id).then((user) =>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });

});

describe('DELETE /user/me/token', () =>{
  it('should remove auth token on Logout', (done) =>{
    request(app)
      .delete('/user/me/token')
      .set('x-auth', sampleUsers[0].tokens[0].token)
      .expect(200)
      .end((err, res) =>{
        if(err) return done(err);

        Users.findById(sampleUsers[0]._id).then((user) =>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) =>done(e));
      })
  });
});
