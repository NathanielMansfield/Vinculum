var createError = require('http-errors');
var express = require('express');
var path = require('path');
var app = express();
const fs = require('fs');
const { render } = require('express/lib/response');
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 
app.set('view engine', 'pug');

//Variable that stores users input.
  var input;
//Variables that store info from the DataSet file.
  var Titles = [];   
  var Winner = [];
//Variables that help get info for Results page.
  var InputIndex = 0;
  var title;
  var rating;
  var review;
  var winner;
  var links;
//Variable that ensures the read only happens once.                         
  let TimesRan = 0;                            

//Calls the html GUI on start up.
//Reads in dataset file and stores the titles.
app.get('/', function(req, res) {

  //If statement ensures read and storing only happens once
  if(TimesRan < 1)
  {
    fs.readFile                                             
    ('DataSet.json', 'utf8',function (err, data){             //Reads in the JSON dataset file.

      var Data = JSON.parse(data.toLowerCase());              //makes all data lowercase.
      
      for(var i=0; i<Data.length; i++)                        //for loop that stores only the titles.
      {
          Titles[i] = (Data[i].entity); 
          Winner[i] = (Data[i].winner);                 
      }
    })
    TimesRan += 1;
  }

  //Sending the html file that dsiplays homepage.
  res.redirect('/home');
});

//Sends homepage after JSON file is completely read.
app.get('/home', function(req,res){
  setTimeout(() => 
  {res.sendFile(__dirname +'/views/HomePage.html');}, 200);
})

//Once the user presses submit button or enterkey 
//this will read the entry and check if entry is in
//oscar nomination dataset then put out results or error message.
app.get('/search', function(req, res){

  input = req.query.searchBox;                  //Grabs the users input from the html page.
  input = input.toLowerCase();                  //Makes the input string into lowercase.
  
  if(Titles.includes(input) == true)            //checks if input is in the dataset
  {
    res.redirect('/home/results');              //If yes goes to result page
  }
  else
    res.redirect('/error');                     //If no presents an error
});



//Future results page, will talk to OMDb and grab info from there
//it will then send info to html then call the html file and 
//send that to website to display to user.
app.get('/home/results', function(req, res){
  InputIndex = Titles.indexOf(input);
  winner = Winner[InputIndex];

  if(winner = false)
    winner = 'No';
  else
    winner = 'Yes';
    
  res.render('Results',{movie: input, 
                        rating: 'data', 
                        actors: 'data',
                        OscarWinner: winner, 
                        links: 'data'});
});



//Error message page most likely will get rid of and
//display error message on homepage.Just used for testing.
app.get('/error', function(req,res){
  res.sendFile(__dirname +'/views/ErrorPage.html');
});


module.exports = app;