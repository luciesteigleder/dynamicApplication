//How to import the API key from the other file /!\ MAKE SURE THAT YOU HAVE TYPE=MODULE IN THE SCRIPT TAG IN HTML
import { weatherAPIKey } from "./apikey.js";
import { getImage } from "./bgImage.js";
import { changeColor } from "./color.js";
import { updatePage } from "./updatePageInfo.js";
import { generateChart } from "./barChart.js";
import { getForecastInfo } from "./getForecastInfo.js";

//____________________________________________________________FIRST PART, CURRENT WEATHER___________________________________________________
let cityLabel = document.querySelector("#cityLabel");
cityLabel.value = "";
let submitForm = document.querySelector("#submitForm");

changeColor();

const getWeatherInformation = (lat, lon, key) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
  )
    .then((response) => response.json())
    .then((json) => {
      updatePage(json);
      console.log(json);
    });
};

const getLocalization = (city) => {
  //get countryname and cityname
  let cityName = document.querySelector(".cityName");
  let countryName = document.querySelector(".countryName");

  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAPIKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      cityName.innerText = json[0].name;
      getImage(json[0].name);
      let currentCountryCode = json[0].country;
      fetch(`https://restcountries.com/v3.1/alpha/${currentCountryCode}`)
        .then((response) => response.json())
        .then((response) => {
          countryName.innerText = response[0].name.common;
        });
      getWeatherInformation(json[0].lat, json[0].lon, weatherAPIKey);
    });
};

submitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  changeColor();
  getLocalization(cityLabel.value.toLowerCase());
});

//to have the default on brussels
getLocalization("brussels");

//____________________________________________________________SECOND PART, FORECAST___________________________________________________

//there's 40 samples in the 5-day forecast. (every 3h)
//we have to determine the current time, so we can start counting from tomorrow.
//the midnight timestamps are the ones that are divisible by 86400

const getforecast5Days = (city) => {
  //get city & country name
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAPIKey}`
  )
    .then((response) => response.json())
    .then((response) => {
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${response[0].lat}&lon=${response[0].lon}&units=metric&appid=${weatherAPIKey}`
      )
        .then((response) => response.json())
        .then((response) => {
          let midnightValues = [];
          for (let i = 0; i < 39; i++) {
            if (response.list[i].dt % 86400 == 0) {
              midnightValues.push(i);
            }
          }
          getForecastInfo(response.list, midnightValues);
          generateChart(response.list, midnightValues);
        });
    });
};
getforecast5Days("brussels");

//event listener
submitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  getforecast5Days(cityLabel.value.toLowerCase());
});

//fir the picture contrast/saturation thing
//make that i only get lndscapes things
