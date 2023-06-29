//How to import the API key from the other file /!\ MAKE SURE THAT YOU HAVE TYPE=MODULE IN THE SCRIPT TAG IN HTML
import {weatherAPIKey} from './apikey.js';
import {unsplashAccessKey} from './unsplashKey.js';

//____________________________________________________________FIRST PART, CURRENT WEATHER___________________________________________________
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

let pictureName = document.querySelector(".pictureName")
let pictureUrl = document.querySelector(".pictureUrl")

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
          pictureName.innerText = photoAuthor
          pictureUrl.href = photoUrl

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
      pictureName.innerText = photoAuthor
      pictureUrl.href = photoUrl

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
    randcolorsArray.push(Math.floor(Math.random()*50))
    return randcolorsArray
}

//change the random array into a rgb
const hsla = (array) => {
    return ["hsla(",array[0],",",array[1],"%,",100-array[2],"%,0.9)"].join("");
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



//____________________________________________________________SECOND PART, FORECAST___________________________________________________

//there's 40 samples in the 5-day forecast. (every 3h)
//we have to determine the current time, so we can start counting from tomorrow.
//the midnight timestamps are the ones that are divisible by 86400 

let day1MaxTempValue = document.querySelector(".day1MaxTempValue")
let day1MinTempValue = document.querySelector(".day1MinTempValue")
let day2MaxTempValue = document.querySelector(".day2MaxTempValue")
let day2MinTempValue = document.querySelector(".day2MinTempValue")
let day3MaxTempValue = document.querySelector(".day3MaxTempValue")
let day3MinTempValue = document.querySelector(".day3MinTempValue")
let day4MaxTempValue = document.querySelector(".day4MaxTempValue")
let day4MinTempValue = document.querySelector(".day4MinTempValue")
let day5MaxTempValue = document.querySelector(".day5MaxTempValue")
let day5MinTempValue = document.querySelector(".day5MinTempValue")

let nameOfTheWeek1 = document.querySelector(".nameOfTheWeek1")
let nameOfTheWeek2 = document.querySelector(".nameOfTheWeek2")
let nameOfTheWeek3 = document.querySelector(".nameOfTheWeek3")
let nameOfTheWeek4 = document.querySelector(".nameOfTheWeek4")
let nameOfTheWeek5 = document.querySelector(".nameOfTheWeek5")

let day1Icon = document.querySelector(".day1Icon")
let day2Icon = document.querySelector(".day2Icon")
let day3Icon = document.querySelector(".day3Icon")
let day4Icon = document.querySelector(".day4Icon")
let day5Icon = document.querySelector(".day5Icon")


const getforecast5Days = (city) => {
    //get city & country name
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAPIKey}`)
    .then(response => response.json())
    .then(response => {
        console.log(response)
        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${response[0].lat}&lon=${response[0].lon}&units=metric&appid=${weatherAPIKey}`)
        .then(response => response.json())
        .then(response => {
            console.log("check if this is the good city")
            console.log(response)
            let midnightValues = []
            for (let i=0; i<39; i++) {
                if (response.list[i].dt % 86400 == 0){
                    midnightValues.push(i)
                }
            }
            console.log("midnight values" + midnightValues) // this array gives me the indexes of when the next 5 days start.
            console.log("this data have to be checked: ")
            console.log(response.list)
            getTempData_dayByDay(response.list, midnightValues)
            getNameOfTheDay(response.list, midnightValues)
            getIcons_dayByDay(response.list, midnightValues)
        })
    })
}

getforecast5Days("brussels")

const getTempData_dayByDay = (array, midnightValues) => { //array is the total array of datas, midnightvalue tells me when do the day start   
    const temperatureData = {};
    midnightValues.push(40) // so it adds the last data, even if it's not a midnight value, but it closes the day
    for (let i = 1; i <= 5; i++) { //with this, we will go one day at the time. we prepare the overall object
        temperatureData[`day${i}`] = [];    
        for (let j = midnightValues[i-1]; j < midnightValues[i] ; j++) { //this, we only focus about day 1 first, then day 2 etc. ex: J = 5 (first index of day 1) and  array[j]= temperature at midnight of day 1          
            temperatureData[`day${i}`].push(array[j].main.temp)
        }
    }
    console.log("temperatureData")
    console.log(temperatureData)
    getMinAndMaxPerDay(temperatureData)
} 

const getMinAndMaxPerDay = (objectTemp) => {
    
    //Day1
    let minDay1 = Math.min(...objectTemp.day1)
    let maxDay1 = Math.max(...objectTemp.day1)
    //Day2
    let minDay2 = Math.min(...objectTemp.day2)
    let maxDay2 = Math.max(...objectTemp.day2)    
    //Day3
    let minDay3 = Math.min(...objectTemp.day3)
    let maxDay3 = Math.max(...objectTemp.day3)
    //Day4
    let minDay4 = Math.min(...objectTemp.day4)
    let maxDay4 = Math.max(...objectTemp.day4)
    //Day5
    let minDay5 = Math.min(...objectTemp.day5)
    let maxDay5 = Math.max(...objectTemp.day5)

    day1MaxTempValue.innerText = Math.round(maxDay1)
    day1MinTempValue.innerText = Math.round(minDay1)

    day2MaxTempValue.innerText = Math.round(maxDay2)
    day2MinTempValue.innerText = Math.round(minDay2)

    day3MaxTempValue.innerText = Math.round(maxDay3)
    day3MinTempValue.innerText = Math.round(minDay3)

    day4MaxTempValue.innerText = Math.round(maxDay4)
    day4MinTempValue.innerText = Math.round(minDay4)

    day5MaxTempValue.innerText = Math.round(maxDay5)
    day5MinTempValue.innerText = Math.round(minDay5)
}

const getNameOfTheDay = (array, midnightValues) => {
    let nameOfTheDay = []
    for (let i = 0 ; i <5 ; i++) {
        let tempDate = new Date(array[(midnightValues[i])+1].dt * 1000)
        nameOfTheDay.push(tempDate.toLocaleString('en-US', { weekday: 'short' }))
    }
    updateDayOfTheWeek(nameOfTheDay)
}

const updateDayOfTheWeek = (array) => {
    nameOfTheWeek1.innerText = array[0]
    nameOfTheWeek2.innerText = array[1]
    nameOfTheWeek3.innerText = array[2]
    nameOfTheWeek4.innerText = array[3]
    nameOfTheWeek5.innerText = array[4]
}
//for the icon, I will get the worst of the day, which is the highest number
const getIconsWeek = (IconArray) => {
    const numbersIcons = IconArray.map(str => parseInt(str.slice(0, -1)));
    let maxNumber = Math.max(...numbersIcons)
    return maxNumber
}

const getIcons_dayByDay = (array, midnightValues) => { //array is the total array of datas, midnightvalue tells me when do the day start   
    let iconsWeek = []
    //midnightValues.push(40) // so it adds the last data, even if it's not a midnight value, but it closes the day
    for (let i = 1; i <= 5; i++) { //with this, we will go one day at the time. we prepare the overall object
        let IconWeekArray = []
        for (let j = midnightValues[i-1]; j < midnightValues[i] ; j++) { //this, we only focus about day 1 first, then day 2 etc
            IconWeekArray.push(array[j].weather[0].icon);
        }
        let maxNumber = getIconsWeek(IconWeekArray); // Assign the return value to a variable
        iconsWeek.push(maxNumber); // Push the variable into the iconsWeek array
    }
    console.log("iconsWeek");
    console.log(iconsWeek);
    updateIconsWeek(get2numberIcons(iconsWeek))
};

const updateIconsWeek = (array) => {
    day1Icon.src = `https://openweathermap.org/img/wn/${array[0]}d@2x.png`
    day2Icon.src = `https://openweathermap.org/img/wn/${array[1]}d@2x.png`
    day3Icon.src = `https://openweathermap.org/img/wn/${array[2]}d@2x.png`
    day4Icon.src = `https://openweathermap.org/img/wn/${array[3]}d@2x.png`
    day5Icon.src = `https://openweathermap.org/img/wn/${array[4]}d@2x.png`
}

//the array removes the 0 before a single number, so I need to put it back before I put it in the link
const get2numberIcons = (array) => { 
    const strings = array.map(array => array.toString())
    for (let i = 0; i < strings.length; i++) {
        if (strings[i].length <2) {
            strings[i] = "0" + strings[i]
        }
    }
    console.log(strings)
    return(strings)
}

submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    getforecast5Days(cityLabel.value.toLowerCase())
})

//fir the picture contrast/saturation thing
//make that i only get lndscapes things