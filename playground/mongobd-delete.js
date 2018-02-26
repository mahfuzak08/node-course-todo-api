// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
  if(err){
    return console.log('Unable to connect to MongoDB server.');
  }
  console.log('MongoDB server run successfully.');
  const db = client.db('TodoApp');

  // delete many
  // db.collection('Users').deleteMany({name: 'Sujon'}).then((result) =>{
  //   console.log(result);
  // });

  // delete one
  // db.collection('Users').deleteOne({name: 'Sujon'}).then((result) =>{
  //     console.log(result);
  // });


  // find one and delete
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5a93d1d3acbf5abdaa16affe')}).then((result) =>{
      console.log(result);
  });

});
