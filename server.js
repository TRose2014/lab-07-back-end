'use strict';

//Load Environment Vairables from the .env file
require('dotenv').config();

//Application Dependencies
const express = require('express');
const cors  = require('cors');
const superagent =  require('superagent');

//Application Setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

//--------------Handle Errors-------------------//
let handleError = (err, response) => {
  console.error(err);
  if(response) response.status(500).send('Status: 500. So sorry, something went wrong');

};

//---------------Constructor Functions----------------------//

//Refactor
function Location(query, data){
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;

}

function Weather(day){
  console.log(day);
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);

}
//----------------Callbacks----------------//
let searchToLatLong = (request, response) => {
  // const data = request.query.data;
  const geoData = require('./data/geo.json'); //geoCode API goes here
  let location =  new Location(request.query, geoData.results[0]);

  response.send(location);


  // return superagent.get(url)
  //   .then(result => {
  //     response.send(new Location(data, result.body.results[0]));
  //   })
  //   .catch(error => handleError(error, response));
};

let getWeather = (request, response) => {
  const data = request.query;
  const darkSky = require('./data/darksky.json'); //darkSky API goes here

  console.log(darkSky.daily.data[0]);
  let weather = new Weather(darkSky.daily.data[0]);  
  //This was not working due to bad directions. So in the future, the source 
  //file needs to be paid close attention when structuring a get. Key names, item names, etc. MATTER!
  //Ex. Jane Doe, 123 Main St, Anytown, USA 99999 - you cannot find Jane at 546 Skippy Street, Anytown USA, 99999
  //She can only be found at 123 Main St. So darksky.json does not have an address of result or body therefore
  //they cannot be used in new Weather(darksky.daily.data[0]).

  response.send(weather);

  // return superagent.get(darkSky)
  //   .then(result => {
  //     const weatherSummaries = result.body.daily.data.map(day => {
  //       return new Weather(day);
  //     });
  //     response.send(weatherSummaries);
  //   })
  //   .catch(error => handleError(error, response));
};


//-------------------API Routes-------------------///
app.get('/location', searchToLatLong);
app.get('/weather', getWeather);



//Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
