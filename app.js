var createError = require('http-errors');
var express = require('express');
var path = require('path');
var app = express();


var csv = require('csv-parser');
var fs = require('fs');
const { resolveSoa } = require('dns');
const Titles = [];
let TimesRan = 0;

app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 

//Calls the html GUI on start up
//Will also read the dataset on start up still working on it
app.get('/', function(req, res) {

  //CSV reader still in the works
  if(TimesRan < 1)
    fs.createReadStream('DataSet.csv')
    .pipe(
      csv({
       delimiter:','
    }))
    .on('data', (data) => Titles.push(data))
    .on('end', ()=> {
      console.log(Titles)
  TimesRan +=1;
  })

  //html file GUI
  res.sendFile(__dirname +'/HomePage.html');
  
});

//IDEALLY when done, once the user presses submit button this will read the entry
//and compare the entry to oscar nomination dataset then put out result or error message.
//As of right now it only reads in the input of user and directs page back to home.
app.get('/search', function(req, res){
  var input = req.query.searchBox;
  if(input == 'hi')
  res.redirect('/results');
  else
  res.redirect('/error');
})

app.get('/results', function(req, res){
  res.send('Future results page.');
})

app.get('/error', function(req,res){
  res.send('Future Error message page?')
})
module.exports = app;
