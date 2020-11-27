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
const answerResult = document.getElementById("answer-result");
const answerText = document.querySelector(".answer");
const submitButton = document.getElementById("submit-button");
const nextButton = document.getElementById("next-button");

// create variable to store total countries available to play with
let countryList;
//variable to store correct answers and flags for each question
let correctAnswers = [];
let questionFlags = [];
//variable to store user answer for current question
let currentAnswer;
//counter variables for progress and score
let progress = 0,
  score = 0;

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
// Define function to get list of correct answers from final 5 countries
function getAnswers(list) {
  let answers = [];
  for (country of list) {
    // create array of country flags for each question
    questionFlags.push(country.flag);
    // Create a names array of the official country name, the native country name, and alternative spellings
    let names = [country.name.toLowerCase(), country.nativeName.toLowerCase()];
    for (let altName of country.altSpellings) {
      if (!names.includes(altName.toLowerCase())) names.push(altName.toLowerCase());
    }
    for (let translation of Object.values(country.translations)) {
      if (!names.includes(translation.toLowerCase())) names.push(translation.toLowerCase());
    }
    //return an answer array of 5 subarrays in format:
    // [names, capital, population]
    answers.push([names, country.capital.toLowerCase(), country.population]);
  }
  return answers;
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
      gamePage.setAttribute("style", "display: flex;");
    } else {
      // otherwise, filter the country list to countries that have equal or greater the population outlined in each difficulty setting
      countryList = countryList.filter((country) => country.population >= difficulty[e.target.value]);
      difficultyPage.setAttribute("style", "display: none;");
      gamePage.setAttribute("style", "display: flex;");
    }
    // TESTING LOG
    console.log("Countries After Difficulty Select: " + countryList.length);
    countryList = selectCountries(countryList);
    console.log("\nRandom 5 countries selected for game:");
    for (country of countryList) {
      console.log(`name: ${country.name}, population: ${country.population.toLocaleString()}`);
    }
    // Create array of correct answers
    correctAnswers = getAnswers(countryList);

    //Initiatite Quiz Game Functions
    playQuiz(correctAnswers);
  })
);

function playQuiz(answers) {
  //Function to check answers array for next country and slice name, capital and population from next country
  if (!correctAnswers.length) {
    question.innerText = "ENDGAME";
  } else {
    let currentCountry = correctAnswers.pop();
    playCountry(currentCountry);
  }
}

function playCountry(answers) {
  // set current country flag as main image
  flag.setAttribute("src", questionFlags.pop());
  // Function to take the country array from playQuiz and ask the three questions based on that country
  let currentCountryName = answers[0][0]
    // Title case function code used from: https://www.freecodecamp.org/news/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27/
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");
  console.log(currentCountryName);
  nameQuestion(answers, currentCountryName);
}

function nameQuestion(answers, name) {
  newQuestion();
  incrementProgress();
  // Function to ask question on country name
  question.innerText = "What is the name of this country?";
  inputSubmit(answers[0], name);
  nextButton.addEventListener("click", () => {
    capitalQuestion(answers, name);
  });
}

function capitalQuestion(answers, name) {
  newQuestion();
  incrementProgress();
  // Function to ask question on country capital
  question.innerText = `What is the capital of ${name}?`;
  inputSubmit(answers[1], name);
  nextButton.addEventListener("click", () => {
    populationQuestion(answers, name);
  });
}

function populationQuestion(answers) {
  newQuestion();
  incrementProgress();
  // Function to ask question on country population
}

function inputSubmit(answer, name) {
  // Function to add functionality for submit button on text input questions
  submitButton.addEventListener("click", () => {
    currentAnswer = answerInput.value;
    console.log(name);
    correctAnswer.textContent = `The correct answer is ${name}`;
    isCorrect(answer);
    // disable submit button and enable next button to move to next question
    // credit for code = https://stackoverflow.com/a/11719987
    submitButton.disabled = true;
    nextButton.disabled = false;
  });
}

function isCorrect(answer) {
  // Function to check if current answer is correct
  let isCorrect;
  if (typeof answer === "string") {
    isCorrect = currentAnswer.toLowerCase() === answer;
  } else if (typeof answer === "object") {
    isCorrect = answer.includes(currentAnswer.toLowerCase());
  }
  if (isCorrect) {
    //if answer is correct
    answerResult.textContent = "Correct!!!";
    answerResult.setAttribute("style", "color: green; opacity: 1");
    correctAnswer.setAttribute("style", "opacity: 0");
  } else {
    answerResult.textContent = "Wrong...";
    answerResult.setAttribute("style", "color: red; opacity: 1");
    correctAnswer.setAttribute("style", "color: red; opacity: 1");
  }
}

function incrementProgress() {
  progress++;
  progressCount.textContent = Math.ceil(progress / 3).toString();
}

function newQuestion() {
  //function to clear results of previous question when asking each new question and reset submit/next buttong
  answerResult.setAttribute("style", "opacity: 0");
  correctAnswer.setAttribute("style", "opacity: 0");
  answerInput.value = "";
  submitButton.disabled = false;
  nextButton.disabled = true;
}
