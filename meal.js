//1- Link to get a random meal
//https://www.themealdb.com/api/json/v1/1/random.php

//2- Link to lookup a specific meal with an id
//https://www.themealdb.com/api/json/v1/1/lookup.php?i=

//3- Link to search for meals using a keyword
//https://www.themealdb.com/api/json/v1/1/search.php?s=


const mealsElement = document.getElementById("meals");
const favoritesElement = document.querySelector('.favorites');
const searchBtn = document.querySelector('#search');
const searchTerm = document.querySelector('#search-term');

function initMain()
{

    getRandomMeal();
    updateFavoriteMeals();

    searchBtn.addEventListener('click', async ()=> {
        const searchWord = searchTerm.value;
        const meals = await  getMealsBySearch(searchWord);

        mealsElement.innerHTML = "";

        if(meals)
        {
            for(let i = 0; i < meals.length; i++)
            {
                addMeal(meals[i]);
            }
        }

    });
}

async function getRandomMeal()
{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    //console.log(resp);
    const randomData = await resp.json();
    //console.log(randomData);
    const randomMeal = randomData.meals[0];
    //console.log(randomMeal);

    mealsElement.innerHTML = "";
    addMeal(randomMeal);
}

function addMeal(mealData, random = false)
{
    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = ` <div class="meal-header">
                            ${
                            random? `<span class="random">Meal of the Day</span>` : ""
                            }
                            <img crossorigin='anonymous' src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                        </div>
                        <div class="meal-body">
                            <h3>${mealData.strMeal}</h3>
                            <button class="fav-btn">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>`;

    let favoriteButton = meal.querySelector(".fav-btn");
    favoriteButton.addEventListener("click", ()=>{
         if(favoriteButton.classList.contains('active'))
         {
            favoriteButton.classList.remove('active');
            removeMealFromLocalStorage(mealData.idMeal);
         }  
         else 
         {
            favoriteButton.classList.add('active');
            addMealToLocalStorage(mealData.idMeal);
         } 

         updateFavoriteMeals();
        })

    mealsElement.appendChild(meal);


    const mealHeader = meal.querySelector(".meal-header");
    mealHeader.addEventListener("click", () => {
    OpenMealDetailPage(mealData);
    });

}

function addMealToLocalStorage(mealId)
{
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem('mealIds', JSON.stringify([...mealIds,mealId]));
}

function removeMealFromLocalStorage(mealId)
{
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem('mealIds', JSON.stringify(
        mealIds.filter(id => id!= mealId)
    ));
}

function getMealsFromLocalStorage()
{
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null? [] : mealIds;

}



async function updateFavoriteMeals()
{
    favoritesElement.innerHTML = "";
    const mealIds = getMealsFromLocalStorage();
    for (let i = 0; i < mealIds.length; i++)
    {
        let tmpMeal = await getMealByID(mealIds[i]);
        addMealToFavorites(tmpMeal);
    }
}

async function getMealByID(id)
{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
    
    const respData = await resp.json();
    
    const meal = respData.meals[0];
    //console.log(meal);

    return meal;
}

    //var2

    /*
    const resp = fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
    resp.then( (resp) => {
        const data = resp.json();
        return data;
    })
    .then(data => {
        const meal = data.meals[0];
        return meal;
    })

    */


function addMealToFavorites(mealData)
{
    const favoriteMeal = document.createElement('li');
    favoriteMeal.innerHTML = `
                    <img crossorigin='anonymous' id="fav-img" 
                        src="${mealData.strMealThumb}" 
                        alt="${mealData.strMeal}">
                    <span>${mealData.strMeal}</span>
                    <button class="clear"><i class="fas fa-window-close"></i></button>`;

    const clearBtn = favoriteMeal.querySelector('.clear');
    clearBtn.addEventListener("click", ()=> {
        removeMealFromLocalStorage(mealData.idMeal);
        updateFavoriteMeals();
    });
    favoritesElement.appendChild(favoriteMeal);

    const favId = favoriteMeal.querySelector("#fav-img");
    favId.addEventListener("click", () => {
        OpenMealDetailPage(mealData);
    })
}



async function getMealsBySearch(term)
{
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

    const respData = await resp.json();

    const meals = respData.meals;

    console.log(meals);
    return meals;

}

function OpenMealDetailPage(mealData)
{
    window.open("details.html?mealId=" + mealData.idMeal, "_self");
}

function initDetailsPage()
{
    const urlParams = new URLSearchParams(window.location.search);
    //console.log(urlParams);
    const mealId = urlParams.get('mealId');
    //console.log(mealId);

    showMealDetails(mealId);

}

async function showMealDetails(mealId)
{
    let tmpMeal = await getMealByID(mealId);
    console.log(tmpMeal);

    const mealDetailsContainer = document.querySelector('.meal-container');

    mealDetailsContainer.innerHTML = 
    `<a href="meal.html">Home</a>
            <div class="meal-info">
                <div>
                    <h1>${tmpMeal.strMeal}</h1>
                    <img crossorigin='anonymous' src="${tmpMeal.strMealThumb}" alt="${tmpMeal.strMeal}">
                </div>
                <div>
                    <p>${tmpMeal.strInstructions}</p>
                        <ul>
                            <li>Ingredient /measure</li>
                            <li>Ingredient /measure</li>
                            <li>Ingredient /measure</li>
                        </ul>
                </div>
            </div>`;
}

