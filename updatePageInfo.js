//get the date of today
function getFormattedDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return date.toLocaleDateString('en-US', options);
}

//get the wind direction information
const getWindDirection = (deg) => {
    let winddirection = document.querySelector(".windDirection")
    winddirection.style.transform =  `rotate(${90+deg}deg)`
    let windDirectionText = document.querySelector(".windDirectionText")
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

//update the page information
const updatePage = (information) => {
    //date of the day
    let todayNameText = document.querySelector(".todayNameText")
    todayNameText.innerText = getFormattedDate(information.dt)
    //weather and temperature
    let weather = document.querySelector(".weather")
    let temperature = document.querySelector(".temperature")
    weather.innerText = information.weather[0].description
    temperature.innerHTML = Math.floor(information.main.temp)
    //Icon weather
    let iconWeather = document.querySelector(".iconWeather")
    let iconWName = information.weather[0].icon
    iconWeather.src = (`https://openweathermap.org/img/wn/${iconWName}@2x.png`)
    //humidity
    let humidity = document.querySelector(".humidity")
    humidity.innerText = information.main.humidity
    //wind
    let wind = document.querySelector(".wind")
    wind.innerText = information.wind.speed
    let windDirectionDeg = information.wind.deg
    getWindDirection(windDirectionDeg)
}

export {updatePage}