var createError = require('http-errors');
var express = require('express');
var path = require('path');
var app = express();
const fs = require('fs');
const axios = require('axios').default;
const { type } = require('os');
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 
app.set('view engine', 'pug');

//Query URL
  var OmdbURL = 'https://www.omdbapi.com/?t=$';
  var Key ='&apikey=15c1d264';
//Variable that stores users input.
  var input = 'empty';
//Variables that store info from the DataSet file.
  var Data;
  var Titles = [];
  var Category = [];
  var Year =[];
  var Winner =[];
//Variables that help get info for Results page.
  var omdb;
  var title;
  var rating;
  var actors = [];
  var awards;
  var random;
//Variable that ensures the read only happens once.                         
  let TimesRan = 0;                            
//Variables for API
  var typeSearch;
  var json;
  var index = 0;
  var temp = 0;
  var ResData = [];
  let i = 0;
  var acting;


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
      Data = JSON.parse(data.toLowerCase());             
      
      //for loop that stores only the titles.
      for(var i=0; i<Data.length; i++)                        
      {
          Titles[i] = (Data[i].entity); 
          Category[i] = (Data[i].category);
          Year[i]= Number(Data[i].year);
          Winner[i] =(Data[i].winner);            
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
  axios.get(OmdbURL + input + Key)
  .then((response)=>{ 
    omdb = (response.data);

    json = JSON.stringify(omdb);
    fs.writeFileSync('Response.json', json)

  //Info for results page.
    title = omdb.Title;
    rating = omdb.Metascore;
    actors = omdb.Actors;
    awards = omdb.Awards;
    random = omdb.Year;

  //Sending the info to results page.
    res.render('Results',
      {movie: title, rating: rating, 
      actors: actors, awards: awards, 
      random: random});
  });
});



//Error message page 
app.get('/error', function(req,res){
  res.sendFile(__dirname +'/views/ErrorPage.html');
});




app.get('/response', function(req, res)
{
  if(typeSearch != input && (input != 'empty'))
  {
    typeSearch = input;
  }


  axios.get(OmdbURL + typeSearch + Key)
  .then((response)=>{ 
    omdb = (response.data);
    json = JSON.stringify(omdb);
    
    input = 'empty';
    fs.writeFileSync('Response.json', json)
    res.sendFile(__dirname + '/Response.json');
  })
})




app.get('/api/:typeSearch', function(req,res)
{
  typeSearch = req.params.typeSearch;
  typeSearch = typeSearch.toLowerCase();


  if(Titles.includes(typeSearch))
  {
    res.redirect('/response');
  }
  else
  {
    res.redirect('/error');
  }
})

app.get('/api/:typeSearch/:year', function(req,res)
{
  ResData = [];
  i = 0;

  typeSearch = req.params.typeSearch;
  typeSearch = typeSearch.toLowerCase();

  year = req.params.year;
  year = Number(year);

 
  index = Year.indexOf(year);
  temp = Category[index];

  while(temp != typeSearch)
    { 
      if( temp == "actor in a supporting role" || temp == "actor in a leading role")
      {
        temp = 'actors';
        acting = temp;
      }
      else if(temp == "actress in a supporting role" || temp =="actress in a leading role")
      {
        temp = 'actresses';
        acting = temp;
      }
      else
      {     
        temp = Category[index];
        index = index + 1;
      }
    }
  

  while(temp == typeSearch)
    {
      temp = Category[index];

      if(temp == "actor in a supporting role" || temp == "actor in a leading role")
      {
        temp = 'actors';
      }
      else if(temp == "actress in a supporting role" || temp =="actress in a leading role")
      {
        temp = 'actresses';
      }
      else
      {
        temp = Category[index];
      }
      
      ResData[i] = (Titles[index-1]);
      index+=1;
      i+=1;
    }

    res.send(ResData);
})
 

module.exports = app;