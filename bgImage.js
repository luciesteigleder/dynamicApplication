import {unsplashAccessKey} from './unsplashKey.js';

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

export {getImage}