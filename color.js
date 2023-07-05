//COLOR
//Create a random array for the colors
const arrayRandomColorFunction = () => {
    let randcolorsArray = []
    randcolorsArray.push(Math.floor(Math.random()*360))
    randcolorsArray.push(Math.floor(Math.random()*60))
    randcolorsArray.push(Math.floor((Math.random()*40)+50)) // to have a rando number between a range, we have to multiply rand by the difference between min and max and add min
    return randcolorsArray
}

const changeColor = () => {
    let randcolorsArray = arrayRandomColorFunction()
    let myColor = `hsla(${randcolorsArray[0]},${randcolorsArray[1]}%,${randcolorsArray[2]}%,0.8)`
    let myColorStrong = `hsl(${randcolorsArray[0]},${randcolorsArray[1]}%,${randcolorsArray[2]}%)`
    document.documentElement.style.setProperty('--my-color', myColor);
    document.documentElement.style.setProperty('--my-color-strong', myColorStrong)
}

export {changeColor}