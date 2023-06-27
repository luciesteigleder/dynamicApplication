//How to import the API key from the other file /!\ MAKE SURE THAT YOU HAVE TYPE=MODULE IN THE SCRIPT TAG IN HTML
import {weatherAPIKey} from './apikey.js';

let cityLabel = document.querySelector("#cityLabel")
cityLabel.value = ""
let submitForm = document.querySelector("#submitForm")
let cityList = document.querySelector(".historyList")

let cityName = document.querySelector(".cityName")
let countryName = document.querySelector(".countryName")
let weather = document.querySelector(".weather")
let temperature = document.querySelector(".temperature")


const updatePage = (information) => {
    weather.innerText = information.weather[0].description
    temperature.innerHTML = Math.floor(information.main.temp)
    //HERE -> CONTINUE TO UPDATE THE PAGE
}


const getLocalization = (city) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAPIKey}`)
    .then(response => response.json())
    .then(json => {
        console.log(json)
        cityName.innerText = json[0].name
        countryName.innerText = json[0].state
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${json[0].lat}&lon=${json[0].lon}&units=metric&appid=${weatherAPIKey}`)
        .then(response => response.json())
        .then(json => {
            console.log(json)
            console.log(json.weather[0].description)
            updatePage(json)
        })
        // currentCity.lat = json[0].lat
        // currentCity.lon = json[0].lon
        // console.log(currentCity);
        // cityHistory.push(currentCity)
        // console.log(cityHistory)
    })
}

submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    getLocalization(cityLabel.value.toLowerCase())
})