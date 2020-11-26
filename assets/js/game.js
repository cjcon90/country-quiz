// Define Selectors
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

// fetch full list of countries from REST Countries API && Filter to only countries that have a defined population and capital
fetch("https://restcountries.eu/rest/v2/all")
  .then((res) => res.json())
  .then((data) => (countryList = data.filter((country) => country.population && country.capital)))
  .catch((error) => console.error("Error:", error));

// add a click event listener for each button in SELECT REGION page
regionSelectors.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    // filter the country list down to countries within the region of the button selected
    countryList = countryList.filter((country) => country.region.toLowerCase() === e.target.value);
    //set display:none on the region page to move on to the difficulty page
    e.target.parentNode.parentNode.setAttribute("style", "display: none;");
    //if the region selected is oceanie, then disable "easy" and "medium" modes for the next screen (as there are not enough countries to fit that filter)
    if (e.target.value === "oceania") {
      easyButton.setAttribute("disabled", "true");
      mediumButton.setAttribute("disabled", "true");
    }
  })
);

//Define an object outlining population values for each difficulty
const difficulty = { hard: 150000, medium: 5000000, easy: 20000000 };
// add a click event listener for each button in SELECT DIFFICULTY page
difficultySelectors.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    if (e === "expert") {
      // if difficulty selected is expert:
      // keep country list the same and set display:none on the difficulty page to move on to the game
      e.target.parentNode.parentNode.setAttribute("style", "display: none;");
    } else {
      // otherwise, filter the country list to countries that have equal or greater the population outlined in each difficulty setting
      countryList = countryList.filter((country) => country.population >= difficulty[e.target.value]);
      e.target.parentNode.parentNode.setAttribute("style", "display: none;");
    }
  })
);
