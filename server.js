const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
var db;

MongoClient.connect('mongodb://nahid:nahidlovesliza@ds015924.mlab.com:15924/star-wars-quotes', (err, database) => {
  if(err) return console.log(err);
  db = database;
  app.listen(8888, () => {
    console.log('listening on 8888');
  })
})

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

//app.listen(8888, function(){
//  console.log('listening on 8888');
//});

app.get('/', (req, res) => {
//  res.sendFile(__dirname + '/index.html');
  db.collection('quotes').find().toArray(function(err, result){
    if(err) return console.log(err);
    res.render('index.ejs', {quotes:result});
//    console.log(result);
  });
})

app.post('/quotes', (req,res) => {
  db.collection('quotes').save(req.body, (err, result)=>{
    if(err) return console.log(err);
    console.log('saved to database');
    res.redirect('/');
  })
})

app.put('/quotes', (req,res) => {
  db.collection('quotes').findOneAndUpdate({name: 'Aristotle'},
      {
        $set: {
            name: req.body.name,
            quotes: req.body.quotes
        }
      },{
      sort: {_id: -1},
      upsert: true
  },(err, result) => {
      if(err) return res.send(err);
      res.send(result);
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name}, 
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vader quote got deleted')
  
})
})
