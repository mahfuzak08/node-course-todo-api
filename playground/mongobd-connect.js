const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
  if(err){
    return console.log('Unable to connect to MongoDB server.');
  }
  console.log('MongoDB server run successfully.');
  const db = client.db('TodoApp');

  // Todos collection
  db.collection('Todos').insertOne({
    text: 'Something todo', completed: false
  }, (err, result) =>{
    if(err){
      return console.log('Unable to insert one data into Todos collection');
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  // Users collection
  db.collection('Users').insertOne({
    name: 'Mahfuz', age: 32, location: 'Dhaka'
  }, (err, result) =>{
    if(err){
      return console.log('Unable to insert one data into Users collection');
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  client.close();
});
