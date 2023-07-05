//COLOR
//Create a random array for the colors
const arrayRandomColorFunction = () => {
    let randcolorsArray = []
    randcolorsArray.push(Math.floor(Math.random()*360))
    randcolorsArray.push(Math.floor(Math.random()*60))
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

export {changeColor}