var createError = require('http-errors');
var express = require('express');
var path = require('path');
var app = express();
const fs = require('fs');
const axios = require('axios').default;
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 
app.set('view engine', 'pug');

//Variable that stores users input.
  var input;
//Variables that store info from the DataSet file.
  var Titles = [];   
//Variables that help get info for Results page.
  var omdb;
  var title;
  var rating;
  var actors = [];
  var awards;
  var random;
//Variable that ensures the read only happens once.                         
  let TimesRan = 0;                            



//Calls the html GUI on start up.
//Reads in dataset file and stores the titles.
app.get('/', function(req, res) {

  //If statement ensures read and storing only happens once
  if(TimesRan < 1)
  {
    //Reads in the JSON dataset file.
    fs.readFile                                             
    ('DataSet.json', 'utf8',function (err, data){           

      //makes all data lowercase.
      var Data = JSON.parse(data.toLowerCase());             
      
      //for loop that stores only the titles.
      for(var i=0; i<Data.length; i++)                        
      {
          Titles[i] = (Data[i].entity);                
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




//Reads the entry and check if entry is in
//oscar nomination dataset then routes to results or error message.
app.get('/search', function(req, res){

  //Grabs the users input from the html page.
  input = req.query.searchBox; 

  //Makes the input string into lowercase.              
  input = input.toLowerCase();                 
  
  //checks if input is in the dataset
  if(Titles.includes(input) == true)            
  {
    //If yes goes to result page
    res.redirect('/results');             
  }
  else
    //If no presents an error
    res.redirect('/error');                     
});



//Results page, talks to OMDb and grabs info
//sends info to front end and displays it.
app.get('/results', function(req, res){

  //Getting the info from Omdb api.
  axios.get('https://www.omdbapi.com/?t=$' + input +'&apikey=15c1d264')
  .then((response)=>{ 
    omdb = (response.data);

  //Info for results page.
    title = omdb.Title;
    rating = omdb.Metascore;
    actors = omdb.Actors;
    awards = omdb.Awards;
    random = omdb.Year;

  //Sending the info to results page.
    res.render('Results',
      {movie: title, rating: rating, 
      actors: actors, awards: awardss, 
      random: random});
  });
});



//Error message page 
app.get('/error', function(req,res){
  res.sendFile(__dirname +'/views/ErrorPage.html');
});


module.exports = app;