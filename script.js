const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResult = document.getElementById('search-results');
const fav =  document.getElementById('fav');

// creating favoriteList with data from localStorage if available
const favoriteList = JSON.parse(localStorage.getItem('favoriteList')) || [];

//taking value from user and fetch in api
searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value;

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals === null) {
        alert('No meals found for this search query.');
      } else {
        showResult(data.meals);
      }
    })
    .catch(error => {
      console.error(error);
    });
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
  if (!favoriteList.some(favMeal => favMeal.idMeal === meal.idMeal)) {
    favoriteList.push(meal);
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList));
    alert(`${meal.strMeal} has been added to your favorites.`);
  } else {
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
  const mealIndex = favoriteList.findIndex(favMeal => favMeal.idMeal === meal.idMeal);
  if (mealIndex !== -1) {
    favoriteList.splice(mealIndex, 1);
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList));
    showFav();
    alert(`${meal.strMeal} has been removed from your favorites.`);
  }
}
