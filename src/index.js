import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic

function getWeather(city) {
  let request = new XMLHttpRequest();
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&weather&zip={zip code},{country code}&appid=${process.env.API_KEY}&units=imperial`;

  request.addEventListener("readystatechange", function() {
    console.log(this.readyState);
  });

  function getForecast(lat, lon) {
    let request2 = new XMLHttpRequest();
    const pollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`;

    request2.addEventListener("readystatechange", function(){
      console.log(this.readyState);
    });

    request2.addEventListener("loadend", function() {
      const response = JSON.parse(this.responseText);
      console.log(response);
      if (this.status === 200) {
        printForecast(response);
      } else {
        console.log("Error loading forecast data");
      }
    });

    request2.open("GET", pollutionUrl, true);
    request2.send();
  }
  
  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    console.log(response);
    if (this.status === 200) {
      const lat = response.coord.lat;
      const lon = response.coord.lon;
      getForecast(lat, lon);
      printElements(response, city);
    } else {
      // there's a new argument
      printError(this, response, city);
      printForecast(this, response, city);
    }
  });

  request.open("GET", url, true);
  request.send();
}

  
 

// UI Logic

function printError(request, apiResponse, city) {
  document.querySelector('#showResponse').innerText = `There was an error accessing the weather data for ${city}: ${request.status} ${request.statusText}: ${apiResponse.message}`;
}

function printForecast(apiResponse) {
  // Display the forecast data on the webpage
  // You can modify this code to display the data however you want
  const forecastList = document.createElement("ul");
  apiResponse.list.forEach((forecast) => {
    const forecastItem = document.createElement("li");
    forecastItem.innerText = `Pollution level at:${forecast.main.aqi}`;
    forecastList.appendChild(forecastItem);
  });
  document.querySelector('#showForecast').innerHTML = "";
  document.querySelector('#showForecast').appendChild(forecastList);
}

function printElements(apiResponse, city,) {
  const weatherDescription = apiResponse.weather[0].description;
  document.querySelector('#showResponse').innerText = `The humidity in ${city} is ${apiResponse.main.humidity}%.
  The temperature in Fahrenheit is ${apiResponse.main.temp} degrees. Expect: ${weatherDescription}`;
}

function handleFormSubmission(event) {
  event.preventDefault();
  const city = document.querySelector('#location').value;
  document.querySelector('#location').value = null;
  getWeather(city);
}

window.addEventListener("load", function() {
  document.querySelector('form').addEventListener("submit", handleFormSubmission);
});