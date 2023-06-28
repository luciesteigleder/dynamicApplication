//How to import the API key from the other file /!\ MAKE SURE THAT YOU HAVE TYPE=MODULE IN THE SCRIPT TAG IN HTML
import {weatherAPIKey} from './apikey.js';
import {unsplashAccessKey} from './unsplashKey.js';


let cityLabel = document.querySelector("#cityLabel")
cityLabel.value = ""
let submitForm = document.querySelector("#submitForm")
let cityList = document.querySelector(".historyList")

let cityName = document.querySelector(".cityName")
let countryName = document.querySelector(".countryName")
let weather = document.querySelector(".weather")
let temperature = document.querySelector(".temperature")
let iconWeather = document.querySelector(".iconWeather")
let humidity = document.querySelector(".humidity")
let wind = document.querySelector(".wind")
let winddirection = document.querySelector(".windDirection")
let windDirectionText = document.querySelector(".windDirectionText")
let backgroundImage = document.querySelector(".backgroundImage")

//get image from unsplash
const getImage = (name) => {

  fetch(`https://api.unsplash.com/photos/random?query=${name}&count=1&client_id=${unsplashAccessKey}`)
  .then(response => response.json())
  .then(data => {
    if (data.errors) {
      // If no photo is found with the city name keyword, try with "city" keyword
      fetch(`https://api.unsplash.com/photos/random?query=cityline&count=1&client_id=${unsplashAccessKey}`)
        .then(response => response.json())
        .then(data => {
          const photoUrl = data[0].urls.regular;
          const photoAuthor = data[0].user.name;
          const photoDescription = data[0].description || 'No description available';
          backgroundImage.style.backgroundImage = `url(${photoUrl})`

          console.log('Random Photo:');
          console.log('Photo URL:', photoUrl);
          console.log('Author:', photoAuthor);
          console.log('Description:', photoDescription);
        })
        .catch(error => {
          console.log('Error:', error);
        });
    } else {
      const photoUrl = data[0].urls.regular;
      const photoAuthor = data[0].user.name;
      const photoDescription = data[0].description || 'No description available';
      backgroundImage.style.backgroundImage = `url(${photoUrl})`

      console.log('Random Photo:');
      console.log('Photo URL:', photoUrl);
      console.log('Author:', photoAuthor);
      console.log('Description:', photoDescription);
    }
  })
  .catch(error => {
    console.log('Error:', error);
  });
}

//COLOR
//Create a random array for the colors
const arrayRandomColorFunction = () => {
    let randcolorsArray = []
    randcolorsArray.push(Math.floor(Math.random()*360))
    randcolorsArray.push(Math.floor(Math.random()*75))
    randcolorsArray.push(Math.floor(Math.random()*60))
    return randcolorsArray
}

//change the random array into a rgb
const hsla = (array) => {
    return ["hsla(",array[0],",",array[1],"%,",100-array[2],"%,0.7)"].join("");
  }

// generates a random rgb
const randomColor = () => {
    return hsla(arrayRandomColorFunction())
}

const currentRandomColor = randomColor();
document.documentElement.style.setProperty('--my-color', currentRandomColor);


//update the page information
const updatePage = (information) => {
    weather.innerText = information.weather[0].description
    temperature.innerHTML = Math.floor(information.main.temp)
    //Icon weather
    let iconWName = information.weather[0].icon
    iconWeather.src = (`https://openweathermap.org/img/wn/${iconWName}@2x.png`)
    //humidity
    humidity.innerText = information.main.humidity
    //wind
    wind.innerText = information.wind.speed
    let windDirectionDeg = information.wind.deg
    getWindDirection(windDirectionDeg)
}

//get the wind direction information
const getWindDirection = (deg) => {
    winddirection.style.transform =  `rotate(${90+deg}deg)`
    let windDirectionCodetext = ""

    if (deg >= 337.5 || deg < 22.5) {
        windDirectionCodetext = "N"
    } else if (deg >= 22.5 && deg < 67.5) {
        windDirectionCodetext = "NE"
    } else if (deg >= 67.5 && deg < 112.5) {
        windDirectionCodetext = "E"
    } else if (deg >= 112.5 && deg < 157.5) {
        windDirectionCodetext = "SE"
    } else if (deg >= 157.5 && deg < 202.5) {
        windDirectionCodetext = "S"
    } else if (deg >= 202.5 && deg < 247.5) {
        windDirectionCodetext = "SW"
    } else if (deg >= 247.5 && deg < 292.5) {
        windDirectionCodetext = "W"
    } else if (deg >= 292.5 && deg < 337.5) {
        windDirectionCodetext = "NW"
    } else {
        console.log("error wind direction");
    }
    windDirectionText.innerText = windDirectionCodetext
}


const getLocalization = (city) => {

    //get countryname and cityname

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAPIKey}`)
    .then(response => response.json())
    .then(json => {
        console.log(json)
        cityName.innerText = json[0].name
        getImage(json[0].name)
        let currentCountryCode = json[0].country 
        fetch(`https://restcountries.com/v3.1/alpha/${currentCountryCode}`)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            countryName.innerText = response[0].name.common
        })

        //get weather information

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${json[0].lat}&lon=${json[0].lon}&units=metric&appid=${weatherAPIKey}`)
        .then(response => response.json())
        .then(json => {
            console.log(json)
            console.log(json.weather[0].description)
            updatePage(json)
        })
    })
}

submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    getLocalization(cityLabel.value.toLowerCase())
})

getLocalization("brussels")
//getWindDirection(50)

//getImage("bartenheim")