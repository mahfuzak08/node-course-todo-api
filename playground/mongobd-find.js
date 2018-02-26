// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
  if(err){
    return console.log('Unable to connect to MongoDB server.');
  }
  console.log('MongoDB server run successfully.');
  const db = client.db('TodoApp');

  db.collection('Users').find({name: 'Dipok'}).toArray().then((docs) =>{
    console.log('Users collection');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) =>{
    console.log('Unable to fatch Users collection', err);
  })

  client.close();
});
