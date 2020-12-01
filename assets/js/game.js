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
const populationButtons = document.querySelectorAll(".question__buttons--button");
const correctAnswer = document.getElementById("correct-answer");
const answerResult = document.getElementById("answer-result");
const answerText = document.querySelector(".answer");
const submitButton = document.getElementById("submit-button");
const nextButton = document.getElementById("next-button");
const endGameScreen = document.querySelector(".endgame");
const endScore = document.getElementById("new-score");
const highScore = document.getElementById("high-score");
const highScoreText = document.querySelector(".endgame__high-score--text");
const facebookShare = document.getElementById("facebook-share");
const twitterShare = document.getElementById("twitter-share");
const playAgain = document.getElementById("play-again");

// create variable to store total countries available to play with
let countryList;
//variable to store correct answers and flags for each question
let correctAnswers = [];
let questionFlags = [];
//variable to store user answer for current question
let currentAnswer;
//counter variables for progress, overall score, high score and streak of correct answers within a country
let progress = 0,
  score = 0,
  streak = 0;
// store selected region and difficulty for use in playing game again with same settings
let regionSetting, difficultySetting;

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
      if (translation && !names.includes(translation.toLowerCase())) names.push(translation.toLowerCase());
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
    regionSetting = e.target.value;
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
    difficultySetting = e.target.value;
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
    selectedCountries = selectCountries(countryList);
    console.log("\nRandom 5 countries selected for game:");
    for (country of selectedCountries) {
      console.log(`name: ${country.name}, population: ${country.population.toLocaleString()}`);
    }
    // Create array of correct answers
    correctAnswers = getAnswers(selectedCountries);

    //Initiatite Quiz Game Functions
    playQuiz(correctAnswers);
  })
);

function playQuiz(answers) {
  //Function to check answers array for next country and slice name, capital and population from next country
  if (!correctAnswers.length) {
    endGame();
  } else {
    let currentCountry = correctAnswers.pop();
    // remove population buttons and reinstate text input for each new country
    for (let button of populationButtons) {
      button.setAttribute("style", "display: none");
    }
    answerInput.setAttribute("style", "display: block");
    playCountry(currentCountry);
  }
}

// Function to take the country array from playQuiz and initiate questions on each new country
function playCountry(answers) {
  getFlag(answers);
  // Store proper country name in title case for use during questions
  let currentCountryName = answers[0][0]
    // Title case function code used from: https://www.freecodecamp.org/news/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27/
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");
  nameQuestion(answers, currentCountryName);
}

// Function to ask question on country name
function nameQuestion(answers, name) {
  newQuestion();
  question.innerText = "What is the name of this country?";
  submitAnswer(answers[0], name);
  nextButton.addEventListener(
    "click",
    () => {
      capitalQuestion(answers, name);
    },
    { once: true }
  );
}

// Function to ask question on country capital
function capitalQuestion(answers, name) {
  newQuestion();
  let capital = answers[1]
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");
  question.innerText = `What is the capital of ${name}?`;
  submitAnswer(answers[1], capital);
  nextButton.addEventListener(
    "click",
    () => {
      populationQuestion(answers, name);
    },
    { once: true }
  );
}

// Function to ask question on country population
function populationQuestion(answers, name) {
  newQuestion();
  answerInput.setAttribute("style", "display: none");
  question.innerText = `What is the population of ${name}?`;
  // create an array of possible population answers from the original correct population
  let popOptions = [Math.round(answers[2] * 0.5), Math.round(answers[2] * 0.75), answers[2], Math.round(answers[2] * 1.25), Math.round(answers[2] * 1.5)];
  // slice 3 random entries in order from the array (modifed from code at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
  let n = Math.floor(Math.random() * (3 - 0));
  popOptions = popOptions.slice(n, n + 3);
  // add text content and value of 3 population options to the three buttons
  for (let i = 0; i < populationButtons.length; i++) {
    populationButtons[i].textContent = popOptions[i].toLocaleString();
    populationButtons[i].setAttribute("value", popOptions[i]);
    populationButtons[i].setAttribute("style", "display: block");
    populationButtons[i].addEventListener("click", (e) => (currentAnswer = e.target.value));
  }
  submitAnswer(answers[2], answers[2].toLocaleString());
  console.log(`\nPopulation options: ${popOptions}`);
  console.log(`Actual population: ${answers[2]}`);
  console.log(`Actual Population is in options? ${popOptions.includes(answers[2]) ? "Yes" : "No"}`);
  console.log(`Index of actual population ${popOptions.indexOf(answers[2])}`);

  nextButton.addEventListener(
    "click",
    () => {
      streak = 0;
      playQuiz(correctAnswers);
    },
    { once: true }
  );
}

function submitAnswer(answer, displayAnswer) {
  if (typeof answer === "string" || typeof answer === "object") {
    submitButton.addEventListener(
      "click",
      () => {
        currentAnswer = answerInput.value;
      },
      { once: true }
    );
  }
  submitButton.addEventListener(
    "click",
    () => {
      correctAnswer.textContent = `The correct answer is ${displayAnswer}`;
      isCorrect(answer);

      // disable submit button and enable next button to move to next question
      // credit for code = https://stackoverflow.com/a/11719987
      submitButton.disabled = true;
      nextButton.disabled = false;
    },
    { once: true }
  );
}

function isCorrect(answer) {
  // Function to check if current answer is correct
  let isCorrect;
  if (typeof answer === "string") {
    isCorrect = currentAnswer.toLowerCase() === answer;
  } else if (typeof answer === "object") {
    isCorrect = answer.includes(currentAnswer.toLowerCase());
  } else if (typeof answer === "number") {
    isCorrect = currentAnswer === answer.toString();
  }
  console.log({ currentAnswer }, answer.toString());
  if (isCorrect) {
    //if answer is correct
    // style and change result text
    answerResult.textContent = "Correct!!!";
    answerResult.setAttribute("style", "color: #98bf00; opacity: 1; transform: translateY(40%)");
    correctAnswer.setAttribute("style", "opacity: 0");
    // increment score
    score += 5;
    streak++;
    // if user reaches a streak of 3 correct answers within a country, add +5 bonus points
    if (streak === 3) {
      score += 5;
    }
    scoreCount.textContent = score;
  } else {
    // if answer is incorrect
    // change and style result text
    answerResult.textContent = "Wrong...";
    answerResult.setAttribute("style", "color: #ff0d0d; opacity: 1; transform: translateY(0%)");
    // display correct answer
    correctAnswer.setAttribute("style", "color: #ff0d0d; opacity: 1");
  }
}

//function to set up new Question on click of NEXT button
function newQuestion() {
  // clear result text
  answerResult.setAttribute("style", "opacity: 0");
  correctAnswer.setAttribute("style", "opacity: 0");
  // clear inputted answer
  answerInput.value = "";
  //reset submit and next buttons
  submitButton.disabled = false;
  nextButton.disabled = true;
  // increment progress
  progress++;
  progressCount.textContent = Math.ceil(progress / 3).toString();
}

// fucntion to retrieve and set the flag image
function getFlag(answers) {
  // get next country flag
  let flagImg = questionFlags.pop();
  // if the country is Nepal then set the flag to contain, to complensate for different aspect ratio
  if (answers[0][0] === "nepal") {
    flag.setAttribute("style", "object-fit: contain; border: none; box-shadow: none");
  } else {
    // else set the flag to cover
    flag.setAttribute("style", "object-fit: cover; border: solid 0.2rem $color-white; box-shadow: 0 0 .8rem rgba(0,0,0,.5");
  }
  // set current country flag as main image
  flag.setAttribute("src", flagImg);
}

function endGame() {
  //run check score function
  scoreCheck();
  // set social links based on score
  setSocialLinks();
  // Set Play Game Again functionality
  playGameAgain();
  // Make endgame screen visible
  endGameScreen.setAttribute("style", "display: block;");
}

// Function to check score against high score, and result text appropraitely
// code modified from https://stackoverflow.com/questions/29370017/adding-a-high-score-to-local-storage
function scoreCheck() {
  // Display final score
  endScore.textContent = score;
  if (score === 100) {
    // if it's a perfect score, set highScore in locla storage and display PERFECT SCORE
    localStorage.setItem("savedHighScore", score);
    highScore.textContent = score;
    highScoreText.textContent = "Perfect Score!!";
    highScoreText.setAttribute("style", "display: block");
  } else {
    // Otherwise, get previously stored high score
    let savedHighScore = localStorage.getItem("savedHighScore");
    // if there is none stored or new score is higher...
    if (savedHighScore === "null" || score > savedHighScore) {
      // then save new score and display NEW HIGH SCORE text
      localStorage.setItem("savedHighScore", score);
      highScore.textContent = score;
      highScoreText.textContent = "New High Score!!";
      highScoreText.setAttribute("style", "display: block");
    } else {
      //otherwise, display previously saved high score
      highScore.textContent = savedHighScore;
    }
  }
}

function setSocialLinks() {
  let shareText = `I just scored ${score} points in the Country Quiz Challenge! Can you do better?`;
  facebookShare.setAttribute("href", `https://www.facebook.com/sharer/sharer.php?u=https://cjcon90.github.io/country-quiz/&quote=${shareText}`);
  twitterShare.setAttribute(
    "href",
    `https://twitter.com/intent/tweet?text=${shareText}&url=https://cjcon90.github.io/country-quiz/
  `
  );
}

function playGameAgain() {
  //set playAgain button to correct region
  playAgain.textContent = `Play ${regionSetting} (${difficultySetting}) again`;
  playAgain.addEventListener(
    "click",
    () => {
      progress = 0;
      score = 0;
      scoreCount.textContent = score;
      selectedCountries = selectCountries(countryList);
      // Create array of correct answers
      correctAnswers = getAnswers(selectedCountries);
      //Initiatite Quiz Game Functions
      playQuiz(correctAnswers);
      endGameScreen.setAttribute("style", "display: none");
    },
    { once: true }
  );
}
