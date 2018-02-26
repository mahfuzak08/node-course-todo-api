// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
  if(err){
    return console.log('Unable to connect to MongoDB server.');
  }
  console.log('MongoDB server run successfully.');
  const db = client.db('TodoApp');

  // db.collection('Users').findOneAndUpdate(
  //   { _id: new ObjectID('5a939e85acbf5abdaa16aff7') },
  //   { $set: {'name': 'Dipok'} },
  //   { returnOriginal: false }
  // ).then((result) =>{
  //   console.log(result);
  // });
  db.collection('Users').findOneAndUpdate(
    { _id: new ObjectID('5a939e85acbf5abdaa16aff7') },
    { $inc: {'age': 2} },
    { returnOriginal: false }
  ).then((result) =>{
    console.log(result);
  });

});
