const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResult = document.getElementById('search-results');
const fav =  document.getElementById('fav');

// creating favoriteList with data from localStorage if available
const favoriteList = JSON.parse(localStorage.getItem('favoriteList')) || [];

//taking value from user and fetch in api
searchInput.addEventListener('keyup', () => {
  const searchQuery = searchInput.value;

  setTimeout(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals === null) {
          searchResult.innerHTML = '';
          const noFavMessage = document.createElement('p');
          noFavMessage.innerText = 'No meals found of your Search.';
          searchResult.appendChild(noFavMessage);
          return; 
      } else {
        showResult(data.meals);
      }
    })
    .catch(error => {
      console.error(error);
    });
  }, 1000);
});

// Function to display meal items on screen
function showResult(meals) {

  searchResult.innerHTML = '';
 
  
  meals.forEach(meal => {
    const mealElement = document.createElement('div');
    mealElement.classList.add('meal');

    const mealImage = document.createElement('img');
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;
    mealElement.appendChild(mealImage);

    const mealName = document.createElement('h2');
    mealName.innerText = meal.strMeal;
    mealElement.appendChild(mealName);

    const mealDescription = document.createElement('p');
    mealDescription.classList.add('description');
    mealDescription.innerText = meal.strInstructions;
    mealElement.appendChild(mealDescription);

    const readMoreButton = document.createElement('button');
    readMoreButton.innerHTML = 'Read More';
    readMoreButton.addEventListener('click', () => {
      mealDescription.classList.toggle('show');
    });
    mealElement.appendChild(readMoreButton);

    const favoriteButton = document.createElement('button');
    favoriteButton.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';
    favoriteButton.addEventListener('click', () => {
      addToFavorites(meal);
    });
    mealElement.appendChild(favoriteButton);
    
    searchResult.appendChild(mealElement);
  });
}

// Function to add meals in favorites
function addToFavorites(meal) {
  // Check if the meal is not already in the favoriteList
  if (!favoriteList.some(favMeal => favMeal.idMeal === meal.idMeal)) {
     // If the meal is not already in favorites, add it
    favoriteList.push(meal);
    // Update the favoriteList in local storage
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList));
    // Display an alert indicating the meal has been added to favorites
    alert(`${meal.strMeal} has been added to your favorites.`);
  } else {
     // If the meal is already in favorites, display an alert
    alert(`${meal.strMeal} is already in your favorites.`);
  }
}

fav.addEventListener('click', showFav);

// Function to show all favorites meal 
function showFav() {
  searchResult.innerHTML = '';
  
  if (favoriteList.length === 0) {
    const noFavMessage = document.createElement('p');
    noFavMessage.innerText = '404 No meals found.';
    searchResult.appendChild(noFavMessage);
  } else {
    favoriteList.forEach(meal => {
    const mealElement = document.createElement('div');
      mealElement.classList.add('meal');

      const mealImage = document.createElement('img');
      mealImage.src = meal.strMealThumb;
      mealImage.alt = meal.strMeal;
      mealElement.appendChild(mealImage);

      const mealName = document.createElement('h2');
      mealName.innerText = meal.strMeal;
      mealElement.appendChild(mealName);

      const removeButton = document.createElement('button');
      removeButton.innerHTML = '<i class="fas fa-trash"></i> Remove from Favorites';
      removeButton.addEventListener('click', () => {
        removeFromFavorites(meal);
      });
      mealElement.appendChild(removeButton);

      searchResult.appendChild(mealElement);
    });
  }
}

// Define a function to remove meal from fav
function removeFromFavorites(meal) {
  // Finding the index of the meal in the favoriteList array
  const mealIndex = favoriteList.findIndex(favMeal => favMeal.idMeal === meal.idMeal);
   // Removing the meal from the favoriteList array
  if (mealIndex !== -1) {
    // Removing the meal from the favoriteList array
    favoriteList.splice(mealIndex, 1);
     // Updating the favoriteList in the local storage
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList));
    // Updating the UI to reflect the changes
    showFav();
     // Displaying an alert to notify the user about the removal
    alert(`${meal.strMeal} has been removed from your favorites.`);
  }
}
