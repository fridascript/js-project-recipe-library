// Elements
const buttonGroups = document.querySelectorAll(".filter-and-buttons, .sorting-and-buttons, .random-button")
const recipeCard = document.getElementById('recipe-card')
const filterButtons = document.querySelectorAll(".filter-and-buttons button")
const sortButtons = document.querySelectorAll(".sorting-and-buttons button")
const randomButton = document.querySelector(".random-button button")
const preferenceOptions = document.querySelectorAll("#dropdownMenu option")

// API key & URL
const apiKey = '0cc881e89fc0422eac77c85260da365d'
const URL = `https://api.spoonacular.com/recipes/random?number=12&apiKey=${apiKey}`

// Global data holders
let allMeals = []
let currentPreference = ""


// Button visual selection
buttonGroups.forEach(group => {
  group.addEventListener("click", e => {
    if (e.target.tagName !== "BUTTON") return
    group.querySelectorAll("button").forEach(b => b.classList.remove("selected"))
    e.target.classList.add("selected")
  })
})


// Data from localStorage
function loadFromLocalStorage() {
  const storedRecipes = localStorage.getItem("recipes")
  if (storedRecipes) {
    console.log("Recipes loaded from localStorage")
    allMeals = JSON.parse(storedRecipes)

    const filtered = filterByPreference(allMeals)
    renderMeals(filtered)
    return true
  }
  return false
}


// Fetch data from Spoonacular API
const fetchData = () => {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      allMeals = data.recipes
      console.log("Fetched recipes:", allMeals)

      // Save recipes to localStorage
      localStorage.setItem("recipes", JSON.stringify(allMeals))

      // Filter and display
      const filtered = filterByPreference(allMeals)
      renderMeals(filtered)
    })
    .catch(error => {
      console.error('Error fetching recipes:', error)
      recipeCard.innerHTML = '<p class="error">No recipes found. Please try again.</p>'
    })
}


// Filter recipes on diet/ preference
function filterByPreference(meals) {
  if (!currentPreference || currentPreference === "all") return meals

  return meals.filter(meal =>
    meal.diets && meal.diets.includes(currentPreference)
  )
}


// Recipe cards
function renderMeals(meals) {
  recipeCard.innerHTML = ""

  if (meals.length === 0) {
    recipeCard.innerHTML = '<p class="error">No recipes match your filters.</p>'
    return
  }

  meals.forEach(meal => {
    const ingredients = meal.extendedIngredients
      ? meal.extendedIngredients.slice(0, 4).map(ing => ing.name)
      : []

    const cardHTML = `
      <div class="card">
        <img src="${meal.image}" alt="${meal.title}">
        <h3>${meal.title}</h3>
        <p><strong>Cuisine:</strong> ${meal.cuisines?.[0] || 'Unknown'}</p>
        <p><strong>Ready in:</strong> ${meal.readyInMinutes} min</p>
        <p><strong>Ingredients:</strong></p>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    `
    recipeCard.insertAdjacentHTML('beforeend', cardHTML)
  })
}


// Filter by kitchen/cuisine
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("selected"))
    button.classList.add("selected")

    const filter = button.textContent.trim()

    if (filter === "All") {
      const filtered = filterByPreference(allMeals)
      renderMeals(filtered)
    } else {
      const filteredByCuisine = allMeals.filter(meal =>
        meal.cuisines && meal.cuisines.includes(filter)
      )
      const finalFiltered = filterByPreference(filteredByCuisine)
      renderMeals(finalFiltered)
    }
  })
})


// Filter by cooking time
sortButtons.forEach(button => {
  button.addEventListener("click", () => {
    sortButtons.forEach(b => b.classList.remove("selected"))
    button.classList.add("selected")

    const sortType = button.textContent.trim().toLowerCase()

    if (sortType === "quick meals") {
      const quickMeals = allMeals.filter(meal => meal.readyInMinutes <= 20)
      const filtered = filterByPreference(quickMeals)
      renderMeals(filtered)
    } else if (sortType === "slow cook's") {
      const slowMeals = allMeals.filter(meal => meal.readyInMinutes > 20)
      const filtered = filterByPreference(slowMeals)
      renderMeals(filtered)
    } else {
      const filtered = filterByPreference(allMeals)
      renderMeals(filtered)
    }
  })
})


// Get random recipes
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


// Preference dropdown toggle
function toggleDropdown() {
  document.getElementById("dropdownMenu").classList.toggle("show")
}


// Preference selection
preferenceOptions.forEach(option => {
  option.addEventListener("click", () => {
    currentPreference = option.value.toLowerCase()
    const filtered = filterByPreference(allMeals)
    renderMeals(filtered)
    toggleDropdown()
  })
})


// Close dropdown if clicked outside
window.onclick = function (event) {
  if (!event.target.matches('button')) {
    let dropdowns = document.getElementsByClassName("preferences-content")
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i]
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show')
      }
    }
  }
}


// Initial page load
window.onload = () => {
  const hasCache = loadFromLocalStorage()
  if (!hasCache) {
    fetchData()
  }
}
