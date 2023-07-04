//How to import the API key from the other file /!\ MAKE SURE THAT YOU HAVE TYPE=MODULE IN THE SCRIPT TAG IN HTML
import {weatherAPIKey} from './apikey.js';
import {unsplashAccessKey} from './unsplashKey.js';

//____________________________________________________________FIRST PART, CURRENT WEATHER___________________________________________________
let cityLabel = document.querySelector("#cityLabel")
cityLabel.value = ""
let submitForm = document.querySelector("#submitForm")




//get image from unsplash
const getImage = (name) => {
    let backgroundImage = document.querySelector(".backgroundImage")
    let pictureName = document.querySelector(".pictureName")
    let pictureUrl = document.querySelector(".pictureUrl")

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
    randcolorsArray.push(Math.floor((Math.random()*40)+50)) // to have a rando number between a range, we have to multiply rand by the difference between min and max and add min
    return randcolorsArray
}

//change the random array into a rgb
const hsla = (array) => {
    return ["hsla(",array[0],",",array[1],"%,",array[2],"%,0.8)"].join("");
  }

// generates a random rgb
const randomColor = () => {
    return hsla(arrayRandomColorFunction())
}

const changeColor = () => {
let currentRandomColor = randomColor();
document.documentElement.style.setProperty('--my-color', currentRandomColor);
console.log(currentRandomColor)
}
changeColor()

//get the date of today
function getFormattedDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return date.toLocaleDateString('en-US', options);
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


const getLocalization = (city) => {

    //get countryname and cityname
let cityName = document.querySelector(".cityName")
let countryName = document.querySelector(".countryName")


    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAPIKey}`)
    .then(response => response.json())
    .then(json => {
        cityName.innerText = json[0].name
        getImage(json[0].name)
        let currentCountryCode = json[0].country 
        fetch(`https://restcountries.com/v3.1/alpha/${currentCountryCode}`)
        .then(response => response.json())
        .then(response => {
            countryName.innerText = response[0].name.common
        })

        //get weather information

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${json[0].lat}&lon=${json[0].lon}&units=metric&appid=${weatherAPIKey}`)
        .then(response => response.json())
        .then(json => {
            updatePage(json)
            console.log(json)
        })
    })
}

submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    changeColor()
    getLocalization(cityLabel.value.toLowerCase())
})

getLocalization("brussels")



//____________________________________________________________SECOND PART, FORECAST___________________________________________________

//there's 40 samples in the 5-day forecast. (every 3h)
//we have to determine the current time, so we can start counting from tomorrow.
//the midnight timestamps are the ones that are divisible by 86400 

const getforecast5Days = (city) => {
    //get city & country name
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAPIKey}`)
    .then(response => response.json())
    .then(response => {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${response[0].lat}&lon=${response[0].lon}&units=metric&appid=${weatherAPIKey}`)
        .then(response => response.json())
        .then(response => {
            let midnightValues = []
            for (let i=0; i<39; i++) {
                if (response.list[i].dt % 86400 == 0){
                    midnightValues.push(i)
                }
            }
            getTempData_dayByDay(response.list, midnightValues)
            getNameOfTheDay(response.list, midnightValues)
            getIcons_dayByDay(response.list, midnightValues)

            const ctx = document.querySelector('#canvas');

            new Chart(ctx, {
            type: 'bar',
            data: {
                labels: getTodayTempTime(response.list, midnightValues),
                datasets: [{
                label: 'temperature',
                data: getTodayTemp(response.list, midnightValues),
                borderWidth: 1,
                borderColor: 'black',
                backgroundColor: 'black',
                barThickness: 10,
                pointRadius: 1,
                pointBackgroundColor: 'black'
                }]
            },
            options: {
                scales: {
                x: {
                    ticks: {
                    color: 'black'
                    }
                },
                y: {
                    position: 'left',
                    ticks: {
                    color: 'black',
                    stepSize: 10,
                    callback: function(value) {
                        return value + '°C';
                    }
                    },
                    grid: {
                    display: false
                    }
                }
                },
                plugins: {
                legend: {
                    labels: {
                    color: 'black',
                    font: {
                        family: 'Quicksand'
                    },
                    boxWidth: 0
                    }
                },
                tooltip: {
                    enabled: false
                },
                datalabels: { // Custom plugin to display y-values on each bar
                    anchor: 'end',
                    align: 'top',
                    color: 'black',
                    font: {
                    family: 'Quicksand'
                    },
                    formatter: function(value, context) {
                    return value + '°C';
                    }
                }
                },
                hover: {
                mode: null
                },
                elements: {
                point: {
                    backgroundColor: 'red',
                    borderColor: 'red'
                },
                bar: {
                    backgroundColor: 'black',
                    borderColor: 'black'
                }
                }
            },
            });
        });
    });
};

getforecast5Days("brussels")

//this function splits the total array of data into 5 days
const getTempData_dayByDay = (array, midnightValues) => { //array is the total array of datas, midnightvalue tells me when do the day start   
    const temperatureData = {};
    midnightValues.push(40) // so it adds the last data, even if it's not a midnight value, but it closes the day
    for (let i = 1; i <= 5; i++) { //with this, we will go one day at the time. we prepare the overall object
        temperatureData[`day${i}`] = [];    
        for (let j = midnightValues[i-1]; j < midnightValues[i] ; j++) { //this, we only focus about day 1 first, then day 2 etc. ex: J = 5 (first index of day 1) and  array[j]= temperature at midnight of day 1          
            temperatureData[`day${i}`].push(array[j].main.temp)
        }
    }
    getMinAndMaxPerDay(temperatureData)
} 

//this function gives us the max an min per day
const getMinAndMaxPerDay = (objectTemp) => {
    let maxDayValue = []
    let minDayValue = []
    const days = Object.keys(objectTemp);
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const minValue = Math.round(Math.min(...objectTemp[day]))
        const maxValue = Math.round(Math.max(...objectTemp[day]))
        minDayValue.push(minValue);
        maxDayValue.push(maxValue);
    }
    updateMaxAndMinTemp(minDayValue, maxDayValue)
}

//this function updates the data on the page with the max and min
const updateMaxAndMinTemp = (minDayValue, maxDayValue) => {
    let maxTempSpan = []
    let minTempSpan = []
    for  (let i = 1 ; i < 6 ; i++) {
        const maxTempElement = document.querySelector(`.day${i}MaxTempValue`);
        maxTempElement.innerText = maxDayValue[i-1]
        const minTempElement = document.querySelector(`.day${i}MinTempValue`);
        minTempElement.innerText = minDayValue[i-1]
    }
}

//this function gets the corresponding days of the week
const getNameOfTheDay = (array, midnightValues) => {
    let nameOfTheDay = []
    for (let i = 0 ; i <5 ; i++) {
        let tempDate = new Date(array[(midnightValues[i])+1].dt * 1000)
        nameOfTheDay.push(tempDate.toLocaleString('en-US', { weekday: 'short' }))
    }
    updateDayOfTheWeek(nameOfTheDay)
}

//this functions updates the days of the week
const updateDayOfTheWeek = (array) => {
    for (let i=1 ; i<array.length+1; i++) {
        const nameOfTheWeek = document.querySelector(`.nameOfTheWeek${i}`)
        nameOfTheWeek.innerText = array[i-1]
    }
}
//this function gets the number corresponding to the icons for each day
//for the icon, I will get the worst of the day, which is the highest number
const getIconsWeek = (IconArray) => {
    const numbersIcons = IconArray.map(str => parseInt(str.slice(0, -1)));
    let maxNumber = Math.max(...numbersIcons)
    return maxNumber
}

//this function get the array with the values of the icon for each day
const getIcons_dayByDay = (array, midnightValues) => { //array is the total array of datas, midnightvalue tells me when do the day start   
    let iconsWeek = []
    for (let i = 1; i <= 5; i++) { //with this, we will go one day at the time. we prepare the overall object
        let IconWeekArray = []
        for (let j = midnightValues[i-1]; j < midnightValues[i] ; j++) { //this, we only focus about day 1 first, then day 2 etc
            IconWeekArray.push(array[j].weather[0].icon);
        }
        let maxNumber = getIconsWeek(IconWeekArray); // Assign the return value to a variable
        iconsWeek.push(maxNumber); // Push the variable into the iconsWeek array
    }
    updateIconsWeek(get2numberIcons(iconsWeek))
};

//this one updates the source of the image for each icon
const updateIconsWeek = (array) => {
    for (let i = 0 ; i<array.length ; i++) {
        const dayIcon = document.querySelector(`.day${i+1}Icon`)
        dayIcon.src = `https://openweathermap.org/img/wn/${array[i]}d@2x.png`
    }
}

//the array removes the 0 before a single number, so I need to put it back before I put it in the link
const get2numberIcons = (array) => { 
    const strings = array.map(array => array.toString())
    for (let i = 0; i < strings.length; i++) {
        if (strings[i].length <2) {
            strings[i] = "0" + strings[i]
        }
    }
    return(strings)
}

//event listener
submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    getforecast5Days(cityLabel.value.toLowerCase())
})

//fir the picture contrast/saturation thing
//make that i only get lndscapes things


//__________________________linechart__________________________________

//function to get data for the day temperature

const getTodayTemp = (array, midnightValues) => {
    let todayTemp = []
    for (let i=0 ; i<midnightValues[0]; i++) {
        let tempTemperature = Math.round(array[i].main.temp) // I get the temperature data for today
        todayTemp.push(tempTemperature)
    }
    return(todayTemp)
}

const getTodayTempTime = (array, midnightValues) => {
    let todayTempTime = []
    for (let i=0 ; i<midnightValues[0]; i++) {
        
        let tempTemperatureTime = array[i].dt_txt //I get the corresponding hours
        let tempTemperatureTime2 = tempTemperatureTime.split(" ")
        let tempTemperatureTime3 = tempTemperatureTime2[1].split(":")
        todayTempTime.push(tempTemperatureTime3[0])
    }
    return(todayTempTime)
}



