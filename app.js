var createError = require('http-errors');
var express = require('express');
var path = require('path');
var app = express();
const fs = require('fs');
const axios = require('axios').default;
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
  var year;
  var IsWinner;
  var json;
  var index = 0;
  var temp;
  var ResData = [];
  var IsOscar =[];
  let i = 0;

//                //
//                //
//      GUI       //
//                //
//                //

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
          Winner[i] = String(Data[i].winner);            
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

    json = JSON.stringify(omdb, null, 2);
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



//Response page sends the Respone.json through GUI
app.get('/response', function(req, res)
{
  //if user searches through URL, connects it with the GUI response.
  if(typeSearch != input && (input != 'empty'))
  {
    typeSearch = input;
  }
  
  //Querying the entry. Function at Line 295.
  query(typeSearch);

  //Waits for Query to finish then displays response.
  setTimeout(() => 
  { res.sendFile(__dirname + '/Response.json');}, 1000);
 
})

//                  //
//                  //
//        API       //
//                  //
//                  //

//Sends the instructions on how to use API
app.get('/api', function(req,res)
{
  res.sendFile(__dirname +'/views/Directions.html')
})

//Searching a movie through the URL.
app.get('/api/:typeSearch', function(req,res)
{
  //Grabs the Movie name from url and makes it lowercase
  typeSearch = req.params.typeSearch;
  typeSearch = typeSearch.toLowerCase();

  //Checks if movie is in dataset file
  if(Titles.includes(typeSearch))
  {
    //doing query on movie. Function at Line 295.
    query(typeSearch);
    
    //Waits for Query to finish to display response.
    setTimeout(() => 
    { res.sendFile(__dirname + '/Response.json');}, 1000);
  }

  //Goes to error page if movie isn't found. 
  else
  {
    res.redirect('/error');
  }
})



//Searches a category and year to give a list of movies.
app.get('/api/:typeSearch/:year', function(req,res)
{
  //reseting variables
  ResData = [];
  i = 0;

  //Grabs the catgeory from url and makes it lowercase
  typeSearch = req.params.typeSearch;
  typeSearch = typeSearch.toLowerCase();

  //Grabs the year and makes it into number
  year = req.params.year;
  year = Number(year);

  //checks if entries are valid
  if(year < 2018 && year > 1926 && Category.includes(typeSearch))
  {
    //getting the index of where this year occurs first.
    index = Year.indexOf(year);

    //Setting temp to whatever category is in the user entered year
    temp = Category[index];

    //Search function that returns the movies from the given year and category. Function on Line 316
    GetCatList(temp, typeSearch);

    //displaying the movie list.
    json = JSON.stringify(ResData, null, 2);
    fs.writeFileSync('Response.json', json)
    setTimeout(() => 
    { res.sendFile(__dirname + '/Response.json');}, 1000);
  }

  //Goes to error page if movie isn't found.
  else
  {
    res.redirect('/error')
  }
})



//Searches a category and year to return the oscar winning movie
app.get('/api/:typeSearch/:year/:true', function(req,res)
{
  //Reseting variables
  ResData = [];
  i = 0;

  //Grabs the Category from url and makes it lowercase.
  typeSearch = req.params.typeSearch;
  typeSearch = typeSearch.toLowerCase();

  //Grabs the year from the url and makes it a number.
  year = req.params.year;
  year = Number(year);
  
  //Grabs the true from the url and makes it lowercase.
  IsWinner = req.params.true;
  IsWInner = IsWinner.toLowerCase();

  //checks if the entries are valid
  if(year < 2018 && year > 1926 && Category.includes(typeSearch))
  {
    //getting the index of where this year occurs first.
    index = Year.indexOf(year);

    //Setting temp to whatever category is in the user entered year
    temp = Category[index];

    //Search function that returns the movies from the given year and category. Function on Line 316
    GetCatList(temp, typeSearch);

    //Resetting variable.
    i = 0;

    //Setting temp equal to true or false depending on IsOscar.
    temp = IsOscar[i];

    //Setting input equal to what movie that the function returns. Funcion on Line 337
    input = GetWinner(temp);
    
    //Querying the input. Function at Line 295.
    query(input);

    //displaying the response after query is done.
    setTimeout(() => 
    { res.sendFile(__dirname + '/Response.json');}, 1000);
  }

  //if check fails sends to error page.
  else
  {
    res.redirect('/error')
  }

})


//                            //
//                            //
//        Functions           //
//                            //
//                            //


//Query function, populates response.json
function query(info)
{
  //querys omdb api with the given info
  axios.get(OmdbURL + info + Key)
  .then((response)=>{ 
    omdb = (response.data);

    //Makes the data look nice
    json = JSON.stringify(omdb, null, 2);
    
    //resetting varibles.
    input = 'empty';

    //writing the Response.json file.
    fs.writeFileSync('Response.json', json)
  })

}

//Get the list of movies in a category for a given year.
function GetCatList(temp, typeSearch)
{
  
  //Iterate through until temp equals the category given.
  while(temp != typeSearch)
    { 
      temp = Category[index];
      index = index + 1;
    }

  //Iterate through and grab titles until Category doesn't equal given category.
  while(temp == typeSearch)
    {     
      temp = Category[index];     
      ResData[i] = (Titles[index-1]);
      IsOscar[i] = (Winner[index-1]);
      index+=1;
      i+=1;
    }
}

//Gets the winner form the given category and year.
function GetWinner(temp)
{
  //resetting varibale
  i = -1;

  //checks if the first index in array is a winner or not
  if(temp == "false")
  {
    //iterates through movies until it gets to winner.
    while(temp != "true" && i<IsOscar.length)
    {
      i+=1;
      temp = IsOscar[i];
    }
  }

  //if first index is winner sets the i variable accordingly.
  else if(temp == "true")
  {
    i+=1;
  }

  //sets input to the winning movie title
  input = ResData[i];

  //returns the winner.
  return input;
}




module.exports = app;