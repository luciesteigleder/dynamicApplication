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


const generateChart = (array, midnightValues) => {

    const ctx = document.querySelector('#canvas');

    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: getTodayTempTime(array, midnightValues),
        datasets: [{
        label: 'temperature',
        data: getTodayTemp(array, midnightValues),
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
}

export {generateChart}