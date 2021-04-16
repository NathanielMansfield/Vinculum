var createError = require('http-errors');
var express = require('express');
var path = require('path');
var app = express();
const fs = require('fs');
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 




//Titles array that stores all and only the titles.
  var Titles = [];      
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
          Titles[i] = Titles[i].replace(/\s/g,'');            //Getting rid of all spaces in the titles.
      }
    })
    TimesRan += 1;
  }

  //Sending the html file that dsiplays homepage.
  res.sendFile(__dirname +'/HomePage.html');
  
});


//Once the user presses submit button or enterkey 
//this will read the entry and check if entry is in
//oscar nomination dataset then put out results or error message.
app.get('/search', function(req, res){

  var input = req.query.searchBox;            //Grabs the users input from the html page.
  input = input.toLowerCase();                //Makes the input string into lowercase.
  input = input.replace(/\s/g,'');            //Gets rid of all spaces in the string.
  
  if(Titles.includes(input) == true)          //checks if input is in the dataset
    res.redirect('/results');                 //If yes goes to result page
  else
    res.redirect('/error');                   //If no presents an error
});



//Future results page, will talk to IMDb and grab info from there
//it will then send info to html then call the html file and 
//send that to website to display to user.
app.get('/results', function(req, res){
  res.send('Future results page.');
});



//Error message page most likely will get rid of and
//display error message on homepage.Just used for testing.
app.get('/error', function(req,res){
  res.send('Future Error message page?')
});


module.exports = app;