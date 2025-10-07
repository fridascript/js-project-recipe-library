// elements from html 
const buttonGroups = document.querySelectorAll(".filter-and-buttons, .sorting-and-buttons, .random-button");
const recipeCard = document.getElementById('recipe-card');

// API key + url
const apiKey = '0cc881e89fc0422eac77c85260da365d';
const URL = `https://api.spoonacular.com/recipes/random?number=10&apiKey=${apiKey}`;

// recipe data holder
let allMeals = [];

// buttons
buttonGroups.forEach(group => {
  const buttons = group.querySelectorAll("button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");
    });
  });
});

// API, fetch recipe data 
const fetchData = () => {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      allMeals = data.recipes;
      renderMeals(allMeals);
    })
    .catch(error => {
      console.error('Error:', error);
      recipeCard.innerHTML = '<p>No recipe, sorry!</p>';
    });
};

// cards
function renderMeals(meals) {
  recipeCard.innerHTML = '';

  meals.forEach(meal => {
    const ingredients = meal.extendedIngredients
      ? meal.extendedIngredients.slice(0, 4).map(ing => ing.name)
      : [];

    const cardHTML = `
      <div class="card">
        <img src="${meal.image}" alt="${meal.title}">
        <h3>${meal.title}</h3>
        <p><strong>Dish Type:</strong> ${meal.dishTypes?.[0] || 'Unknown'}</p>
        <p><strong>Country (Cuisine):</strong> ${meal.cuisines?.[0] || 'Unknown'}</p>
        <p><strong>Ready in:</strong> ${meal.readyInMinutes} min</p>
        <p><strong>Ingredients:</strong></p>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    `;
    recipeCard.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// filtering on kitchen
const filterButtons = document.querySelectorAll(".filter-and-buttons button");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("selected"));
    button.classList.add("selected");

    const filter = button.textContent.trim();

    if (filter === "All") {
      renderMeals(allMeals);
    } else {
      const filtered = allMeals.filter(meal =>
        meal.cuisines && meal.cuisines.includes(filter)
      );
      renderMeals(filtered);
    }
  });
});

//filtering on sorting 

const sortButtons = document.querySelectorAll(".sorting-and-buttons button");

sortButtons.forEach(button => {
  button.addEventListener("click", () => {
    sortButtons.forEach(b => b.classList.remove("selected"))
    button.classList.add("selected")

    const sortType = button.textContent.trim().toLowerCase()

    if (sortType === "quick meals") {
      const quickMeals = allMeals.filter(meal => meal.readyInMinutes <= 20)
      renderMeals(quickMeals)
    } else if (sortType === "slow cook's") {
      const longMeals = allMeals.filter(meal => meal.readyInMinutes > 20)
      renderMeals(longMeals)
    } else {
      renderMeals(allMeals)
    }
  })
})

// random recipe generator
const randomButton = document.querySelector(".random-button button")

if (randomButton) {
  randomButton.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("selected"))
    sortButtons.forEach(b => b.classList.remove("selected"))
    const allFilterBtn = Array.from(filterButtons).find(b => b.textContent.trim() === "All")
    if (allFilterBtn) allFilterBtn.classList.add("selected")
    const allSortBtn = Array.from(sortButtons).find(b => b.textContent.trim().toLowerCase() === "all")
    if (allSortBtn) allSortBtn.classList.add("selected")

    fetchData()
  })
}


function toggleDropdown() {
  document.getElementById("dropdownMenu").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches('button')) {
    let dropdowns = document.getElementsByClassName("preferences-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


//loading recipes from start 
window.onload = fetchData






