// Define Selectors
const regionPage = document.getElementById("region");
const difficultyPage = document.getElementById("difficulty");
const gamePage = document.getElementById("game");
const regionSelectors = document.querySelectorAll(".region__options--button");
const difficultySelectors = document.querySelectorAll(".difficulty__options--button");
const easyButton = document.getElementById("difficulty-easy");
const mediumButton = document.getElementById("difficulty-medium");
const progressCount = document.getElementById("progress-count");
const scoreCount = document.getElementById("score-count");
const flag = document.getElementById("flag");
const question = document.getElementById("question");
const answerInput = document.getElementById("question-input");
const correctAnswer = document.getElementById("correct-answer");
const submitButton = document.getElementById("submit-button");
const nextButton = document.getElementById("next-button");

// create variable to store total countries available to play with
let countryList;
//variable to store correct answers for whole quiz
let correctAnswers = [];
//variable to store user answer for current question
let currentAnswer;

//define function to select 5 random countries from full list of countries
function selectCountries(list) {
  let newList = [];
  while (newList.length < 5) {
    // code from https://www.geeksforgeeks.org/how-to-select-a-random-element-from-array-in-javascript/
    let newCountry = list[Math.floor(Math.random() * list.length)];
    if (newList.some((country) => country.name === newCountry.name)) {
      continue;
    } else {
      newList.push(newCountry);
    }
  }
  return newList;
}

// fetch full list of countries from REST Countries API && Filter to only countries that have a defined population and capital
fetch("https://restcountries.eu/rest/v2/all")
  .then((res) => res.json())
  .then((data) => (countryList = data.filter((country) => country.population && country.capital)))
  .catch((error) => console.error("Error:", error));

// add a click event listener for each button in SELECT REGION page
regionSelectors.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    console.log(`\nRegion selected: ${e.target.value}`);
    if (e.target.value === "world") {
      //keep country list the same, hide region page and move on to difficulty page
      regionPage.setAttribute("style", "display: none;");
      difficultyPage.setAttribute("style", "display: block;");
    } else {
      // filter the country list down to countries within the region of the button selected
      countryList = countryList.filter((country) => country.region.toLowerCase() === e.target.value);
      //hide region page and move on to difficulty page
      regionPage.setAttribute("style", "display: none;");
      difficultyPage.setAttribute("style", "display: block;");
      //if the region selected is oceanie, then disable "easy" and "medium" modes for the next screen (as there are not enough countries to fit that filter)
      if (e.target.value === "oceania") {
        easyButton.setAttribute("disabled", "true");
        mediumButton.setAttribute("disabled", "true");
      }
    }
    console.log(`Countries After Region Select: ${countryList.length}`);
  })
);

//Define an object outlining population values for each difficulty
const difficulty = { hard: 150000, medium: 5000000, easy: 20000000 };

// add a click event listener for each button in SELECT DIFFICULTY page
difficultySelectors.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    console.log(`\nDifficulty selected: ${e.target.value}`);
    e.target.value === "expert" ? console.log(`Minimum population: none`) : console.log(`Minimum population: ${difficulty[e.target.value].toLocaleString()}`);
    if (e.target.value === "expert") {
      // if difficulty selected is expert:
      //keep country list the same, hide difficulty page and move on to game
      difficultyPage.setAttribute("style", "display: none;");
      gamePage.setAttribute("style", "display: block;");
    } else {
      // otherwise, filter the country list to countries that have equal or greater the population outlined in each difficulty setting
      countryList = countryList.filter((country) => country.population >= difficulty[e.target.value]);
      difficultyPage.setAttribute("style", "display: none;");
      gamePage.setAttribute("style", "display: block;");
    }
    console.log("Countries After Difficulty Select: " + countryList.length);
    countryList = selectCountries(countryList);
    console.log("\nRandom 5 countries selected for game:");
    for (country of countryList) {
      console.log(`name: ${country.name}, population: ${country.population.toLocaleString()}`);
    }
  })
);
