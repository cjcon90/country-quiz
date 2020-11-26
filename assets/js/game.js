const regionSelectors = document.querySelectorAll(".region__options--button");
const difficultySelectors = document.querySelectorAll(".difficulty__options--button");
const easyButton = document.getElementById("difficulty-easy");
const mediumButton = document.getElementById("difficulty-medium");

//variable to store total countries available to play with
let countryList;

// fetch full list of countries from REST Countries API && Filter to only countries that have a defined popualtion and capital
fetch("https://restcountries.eu/rest/v2/all")
  .then((res) => res.json())
  .then((data) => (countryList = data.filter((country) => country.population && country.capital)))
  .catch((error) => console.error("Error:", error));

// add event listener for each button in SELECT REGION page to filter countryList down to countries within the region selected
regionSelectors.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    countryList = countryList.filter((country) => country.region.toLowerCase() === e.target.value);
    e.target.parentNode.parentNode.setAttribute("style", "display: none;");
    if (e.target.value === "oceania") {
      easyButton.setAttribute("disabled", "true");
      mediumButton.setAttribute("disabled", "true");
    }
  })
);

const difficulty = { hard: 150000, medium: 5000000, easy: 20000000 };
difficultySelectors.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    if (e === "expert") {
      e.target.parentNode.parentNode.setAttribute("style", "display: none;");
    } else {
      countryList = countryList.filter((country) => country.population >= difficulty[e.target.value]);
      e.target.parentNode.parentNode.setAttribute("style", "display: none;");
    }
  })
);
