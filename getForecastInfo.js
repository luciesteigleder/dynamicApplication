

//this function updates the data on the page with the max and min
const updateMaxAndMinTemp = (minDayValue, maxDayValue) => {
    // let maxTempSpan = []
    // let minTempSpan = []
    for  (let i = 1 ; i < 6 ; i++) {
        const maxTempElement = document.querySelector(`.day${i}MaxTempValue`);
        maxTempElement.innerText = maxDayValue[i-1]
        const minTempElement = document.querySelector(`.day${i}MinTempValue`);
        minTempElement.innerText = minDayValue[i-1]
    }
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

//this functions updates the days of the week
const updateDayOfTheWeek = (array) => {
    for (let i=1 ; i<array.length+1; i++) {
        const nameOfTheWeek = document.querySelector(`.nameOfTheWeek${i}`)
        nameOfTheWeek.innerText = array[i-1]
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


//this function gets the number corresponding to the icons for each day
//for the icon, I will get the worst of the day, which is the highest number
const getIconsWeek = (IconArray) => {
    const numbersIcons = IconArray.map(str => parseInt(str.slice(0, -1)));
    let maxNumber = Math.max(...numbersIcons)
    return maxNumber
}

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

const getForecastInfo = (array, midnightValues) => {
    getTempData_dayByDay(array, midnightValues)
    getNameOfTheDay(array, midnightValues)
    getIcons_dayByDay(array, midnightValues)
}

export {getForecastInfo}