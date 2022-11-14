// ========== DEFINE SELECTORS ==========
const regionPage = document.getElementById("region");
const difficultyPage = document.getElementById("difficulty");
const gamePage = document.getElementById("game");
const regionSelectors = document.querySelectorAll(".region__options--button");
const difficultySelectors = document.querySelectorAll(
  ".difficulty__options--button"
);
const easyButton = document.getElementById("difficulty-easy");
const mediumButton = document.getElementById("difficulty-medium");
const progressCount = document.getElementById("progress-count");
const scoreCount = document.getElementById("score-count");
const flag = document.getElementById("flag");
const question = document.getElementById("question");
const answerInput = document.getElementById("question-input");
const populationButtons = document.querySelectorAll(
  ".question__buttons--button"
);
const correctAnswer = document.getElementById("correct-answer");
const answerResult = document.getElementById("answer-result");
const answerText = document.querySelector(".answer");
const correctAudio = document.getElementById("correct-audio");
const bonusAudio = document.getElementById("bonus-audio");
const wrongAudio = document.getElementById("wrong-audio");
const highScoreAudio = document.getElementById("high-score-audio");
const perfectScoreAudio = document.getElementById("perfect-score-audio");
const submitButton = document.getElementById("submit-button");
const nextButton = document.getElementById("next-button");
const endGameScreen = document.querySelector(".endgame");
const endGameModal = document.querySelector(".endgame__modal");
const endGameFooter = document.querySelector(".footer--endgame");
const endScore = document.getElementById("new-score");
const highScore = document.getElementById("high-score");
const highScoreText = document.querySelector(".endgame__high-score--text");
const facebookShare = document.getElementById("facebook-share");
const twitterShare = document.getElementById("twitter-share");
const playAgain = document.getElementById("play-again");

// ========== DEFINE VARIABLES ==========
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
// store selected region and difficulty settings
let regionSetting, difficultySetting;

// ========== SETTING UP GAME ==========

// fetch full list of countries from REST Countries API && Filter to only countries that have a defined population and capital
fetch("https://restcountries.com/v2/all")
  .then((res) => res.json())
  .then(
    (data) =>
      (countryList = data.filter(
        (country) => country.population && country.capital
      ))
  )
  .catch((error) => console.error("Error:", error));

// ========== SELECTING REGION ==========

// add a click event listener for each button in SELECT REGION page
regionSelectors.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    regionSetting = e.target.value;
    // put it inside a setTimeout so there was some delay on changing to next page. Allows for button animation and is more aesthetically pleasing
    setTimeout(() => {
      if (regionSetting === "world") {
        //keep country list the same, hide region page and move on to difficulty page
        regionPage.setAttribute("style", "display: none;");
        difficultyPage.setAttribute("style", "display: block;");
      } else {
        // filter the country list down to countries within the region of the button selected
        countryList = countryList.filter(
          (country) => country.region.toLowerCase() === regionSetting
        );
        //hide region page and move on to difficulty page
        regionPage.setAttribute("style", "display: none;");
        difficultyPage.setAttribute("style", "display: block;");
        //if the region selected is oceanie, then disable "easy" and "medium" modes for the next screen (as there are not enough countries to fit that filter)
        if (regionSetting === "oceania") {
          easyButton.setAttribute("disabled", "true");
          mediumButton.setAttribute("disabled", "true");
        }
      }
    }, 200);
  })
);

// ========== SELECTING DIFFICULTY ==========

//Define an object outlining population values for each difficulty
const difficulty = { hard: 150000, medium: 5000000, easy: 20000000 };

// add a click event listener for each button in SELECT DIFFICULTY page
difficultySelectors.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    difficultySetting = e.target.value;
    // put it inside a setTimeout so there was some delay on changing to next page. Allows for button animation and is more aesthetically pleasing
    setTimeout(() => {
      if (difficultySetting === "expert") {
        // if difficulty selected is expert:
        //keep country list the same, hide difficulty page and move on to game
        difficultyPage.setAttribute("style", "display: none;");
        gamePage.setAttribute("style", "display: flex;");
      } else {
        // otherwise, filter the country list to countries that have equal or greater the population outlined in each difficulty setting
        countryList = countryList.filter(
          (country) => country.population >= difficulty[difficultySetting]
        );
        difficultyPage.setAttribute("style", "display: none;");
        gamePage.setAttribute("style", "display: flex;");
      }
      selectedCountries = selectCountries(countryList);
      // Create array of correct answers
      correctAnswers = getAnswers(selectedCountries);

      //Initiatite Quiz Game Functions
      playQuiz();
    }, 200);
  })
);

// ========== GAME FUNCTIONS ==========

// function to select 5 random countries from the final list of countries
function selectCountries(list) {
  let newList = [];
  while (newList.length < 5) {
    // code from https://www.geeksforgeeks.org/how-to-select-a-random-element-from-array-in-javascript/
    const newCountry = list[Math.floor(Math.random() * list.length)];
    if (!newList.some((country) => country.name === newCountry.name)) {
      newList.push(newCountry);
    }
  }
  return newList;
}

// Define function to get list of correct answers from the 5 selected countries for each game
function getAnswers(list) {
  let answers = [];
  for (let country of list) {
    // create array of country flags for each question
    questionFlags.push(country.flag);
    // Create a names array of the official country name, the native country name, and alternative spellings
    let names = [country.name.toLowerCase(), country.nativeName.toLowerCase()];
    for (let altName of country.altSpellings) {
      if (!names.includes(altName.toLowerCase()))
        names.push(altName.toLowerCase());
    }
    for (let translation of Object.values(country.translations)) {
      if (translation && !names.includes(translation.toLowerCase()))
        names.push(translation.toLowerCase());
    }
    //return an answer array of 5 subarrays in format:
    // [names answers, capital answer, population answer]
    answers.push([names, country.capital.toLowerCase(), country.population]);
  }
  return answers;
}

// Function to start quiz & end quiz if all questions have been asked
function playQuiz() {
  //Function to check answers array for next country and slice name, capital and population from next country
  if (!correctAnswers.length) {
    endGame();
  } else {
    let currentCountry = correctAnswers.pop();
    // in each new round, remove buttons from population question and reinstate text input
    for (let button of populationButtons) {
      button.setAttribute("style", "display: none");
    }
    answerInput.setAttribute("style", "display: block");
    playCountry(currentCountry);
  }
}

// Function to take the 3 answers array for each country and start the round
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
  //auto-focus code credit: https://www.w3schools.com/jsref/met_html_focus.asp
  answerInput.focus();
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
  //auto-focus code credit: https://www.w3schools.com/jsref/met_html_focus.asp
  answerInput.focus();
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
  let popOptions = [
    Math.round(answers[2] * 0.5),
    Math.round(answers[2] * 0.75),
    answers[2],
    Math.round(answers[2] * 1.25),
    Math.round(answers[2] * 1.5),
  ];
  // slice 3 random entries in order from the array (modifed from code at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
  let n = Math.floor(Math.random() * (3 - 0));
  popOptions = popOptions.slice(n, n + 3);
  // add text content and value of 3 population options to the three buttons
  populationButtons.forEach((button, i) => {
    button.textContent = popOptions[i].toLocaleString();
    button.setAttribute("value", popOptions[i]);
    button.setAttribute("style", "display: block");
    button.addEventListener("click", (e) => (currentAnswer = e.target.value));
  });
  submitAnswer(answers[2], answers[2].toLocaleString());

  // ========== SUBMIT ANSWER & PROGRESS GAME BUTTONS ==========

  // move to next question and reset streak to 0 fornext country
  nextButton.addEventListener(
    "click",
    () => {
      streak = 0;
      playQuiz();
    },
    { once: true }
  );
}

//  Submitting button Functionality
function submitAnswer(answer, displayAnswer) {
  if (typeof answer === "number") {
    // For population questions
    submitButton.addEventListener(
      "click",
      () => {
        // Check if answer is correct
        isCorrect(answer);
      },
      { once: true }
    );
  } else if (typeof answer === "string" || typeof answer === "object") {
    // For name and capital questions
    // ===== Enter Key functionality =====

    // Add an eventListener to detect keypresses on answer Input
    answerInput.addEventListener("keydown", inputFunc);

    // Store functionality in separate function to avoid stacking answer checks
    // Source for this solution: Eloquent JavaScript, Chapter 14
    function inputFunc() {
      // Scroll window to bottom so that 'Submit' button is not hidden by mobile soft keyboard
      // credit for code: https://stackoverflow.com/a/54575955 & https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
      answerInput.addEventListener(
        "keyup",
        (e) => {
          // if key pressed = Enter, check code and remove eventListener to avoid stacking
          if (e.code === "Enter") {
            submitFunc();
          }
        },
        { once: true }
      );
    }

    // Submit button functionality
    submitButton.addEventListener("click", submitFunc);

    // Store another separate submitAnswer function that can be removed from *both* text input and submit button eventListeners, as only one of them will be used
    function submitFunc() {
      currentAnswer = answerInput.value.trim();
      isCorrect(answer);
      // remove all event Listeners
      answerInput.removeEventListener("keydown", inputFunc);
      submitButton.removeEventListener("click", submitFunc);
    }
  }

  // Set correct answer text
  correctAnswer.innerHTML = `The correct answer is <span class="answer__answer--country">${displayAnswer}</span>`;
}

// Function to check if current answer is correct
function isCorrect(answer) {
  let isCorrect;
  if (typeof answer === "string") {
    // add edge case fix for Washington DC
    //credit for switch statement code: https://stackoverflow.com/a/9055603
    switch (true) {
      case "washington, d.c." &&
        ["washington dc", "washington d.c.", "washington"].includes(
          currentAnswer.toLowerCase()
        ):
      case "city of victoria" &&
        ["victoria", "victoria city"].includes(currentAnswer.toLowerCase()):
      case "ulan bator" && currentAnswer.toLowerCase() === "ulaanbaatar":
      case (isCorrect =
        removeAccent(currentAnswer.toLowerCase()) === removeAccent(answer)):
        isCorrect = true;
        break;
    }
  } else if (typeof answer === "object") {
    // Add edge case fixes for North Korea and South Korea, the input of which were showing as incorrect
    switch (true) {
      case answer[0] === "korea (democratic people's republic of)" &&
        currentAnswer.toLowerCase() === "north korea":
      case answer[0] === "korea (republic of)" &&
        currentAnswer.toLowerCase() === "south korea":
      case answer[0] === "syrian arab republic" &&
        currentAnswer.toLowerCase() === "syria":
      case answer.includes(currentAnswer.toLowerCase()):
        isCorrect = true;
        break;
    }
  } else if (typeof answer === "number") {
    isCorrect = currentAnswer === answer.toString();
  }
  if (isCorrect) {
    //if answer is correct
    // style and change result text appropriately
    answerResult.textContent = "Correct!!!";
    answerResult.setAttribute("style", "color: #98bf00; opacity: 1;");
    // increment score
    score += 5;
    streak++;

    // if user reaches a streak of 3 correct answers within a country, add +5 bonus points
    if (streak === 3) {
      score += 5;
      // Play bonus points sound
      bonusAudio.play();
      // show bonus points in place of answer text
      correctAnswer.textContent = "+5 Bonus Points!!";
      correctAnswer.setAttribute("style", "color: #98bf00; display: block;");
    } else {
      // else play regular correct answer sound
      correctAudio.currentTime = 0;
      correctAudio.play();
    }
    scoreCount.textContent = score;
  } else {
    // if answer is incorrect
    // change and style result text
    answerResult.textContent = "Wrong";
    answerResult.setAttribute(
      "style",
      "color: #ff0000; opacity: 1; transform: translateY(0%)"
    );
    // display correct answer
    correctAnswer.setAttribute("style", "color: #ff0000; display: block");
    //play incorrect sound
    wrongAudio.currentTime = 0;
    wrongAudio.play();
  }

  // disable submit button and enable next button to move to next question
  // credit for code = https://stackoverflow.com/a/11719987
  submitButton.disabled = true;
  nextButton.disabled = false;
  // set tab focus on nextButton to reduce needing tab or mouse to advance page
  nextButton.focus();
}

// Function to remove any accents for comparing capital city names
// CREDIT: https://gist.github.com/marcelo-ribeiro/abd651b889e4a20e0bab558a05d38d77
function removeAccent(str) {
  var map = {
    " ": "-",
    "": "'",
    a: "á|à|ã|â|å|À|Á|Ã|Â|Å",
    e: "é|è|ê|ē|É|È|Ê|Ē",
    i: "í|ì|î|Í|Ì|Î",
    o: "ó|ò|ô|õ|Ó|Ò|Ô|Õ",
    u: "ú|ù|û|ü|Ú|Ù|Û|Ü",
    c: "ç|Ç",
    n: "ñ|Ñ",
  };

  for (var pattern in map) {
    str = str.replace(new RegExp(map[pattern], "g"), pattern);
  }

  return str;
}

//function to set up new Question on click of NEXT button
function newQuestion() {
  // clear result text
  answerResult.setAttribute("style", "opacity: 0");
  correctAnswer.setAttribute("style", "display: none");
  // clear inputted answer
  answerInput.value = "";
  //clear saved current user answer
  currentAnswer = "";
  //reset submit and next buttons
  submitButton.disabled = false;
  nextButton.disabled = true;
  // increment progress
  progress++;
  progressCount.textContent = Math.ceil(progress / 3).toString();
}

// ========== FLAG IMAGE FUNCTIONALITY ==========

// function to retrieve and set the flag image
function getFlag(answers) {
  // get current country flag
  let flagImg = questionFlags.pop();
  // if the country is Nepal then set the flag object-fit to contain, to compensate for unique aspect ratio
  if (answers[0][0] === "nepal") {
    flag.setAttribute(
      "style",
      "object-fit: contain; border: none; box-shadow: none; height: 100%"
    );
  } else {
    // else set the object-fit to cover
    flag.setAttribute(
      "style",
      "object-fit: cover; border: solid 0.2rem $color-white; box-shadow: 0 0 .8rem rgba(0,0,0,.5);"
    );
    // Set a separate remove attribute instruction, as setting height: auto on flag element was causing issues on small desktop view
    flag.removeAttribute("style", "height: 100%");
  }
  // set current country flag as main image
  flag.setAttribute("src", flagImg);
}

// ========== ENDGAME / MODAL FUNCTIONALITY ==========

function endGame() {
  //run check score function
  scoreCheck();
  // set social links share quotes based on score
  setSocialLinks();
  // Set current game rules for "play again" functionality
  playGameAgain();
  // Make endgame screen visible
  endGameScreen.setAttribute(
    "style",
    "display: block; animation: endgame-screen-blur 2.5s ease both"
  );
  endGameModal.setAttribute(
    "style",
    "display: flex; animation: endgame-modal-appear 2.5s ease both"
  );
  endGameFooter.setAttribute(
    "style",
    "display: block; animation: display-delay 1.5s 1s ease both"
  );
}

// Function to check score against high score, and result text appropraitely
// code modified from https://stackoverflow.com/questions/29370017/adding-a-high-score-to-local-storage
function scoreCheck() {
  // Display final score
  endScore.textContent = score;
  // CHeck previously saved high score
  let savedHighScore = localStorage.getItem("savedHighScore");
  // if there is none stored / new score is higher / current score is perfect
  if (savedHighScore === "null" || score > savedHighScore || score === 100) {
    // then save new score
    localStorage.setItem("savedHighScore", score);
    highScore.textContent = score;
    // change text to High Score or Perfect Score if 100 points
    highScoreText.textContent =
      score === 100 ? "Perfect Score!!!" : "New High Score!!";
    highScoreText.setAttribute("style", "display: block");
    // play high score or perfect score sound
    let sound = score === 100 ? perfectScoreAudio : highScoreAudio;
    sound.play();
  } else {
    //otherwise, display previously saved high score
    highScore.textContent = savedHighScore;
  }
}
// Fucntion to set current score in share quote for social sharing
function setSocialLinks() {
  let shareText = `I just scored ${score} points in the Country Quiz Challenge! Can you do better?`;
  facebookShare.setAttribute(
    "href",
    `https://www.facebook.com/sharer/sharer.php?u=https://cjcon90.github.io/country-quiz/&quote=${shareText}`
  );
  twitterShare.setAttribute(
    "href",
    `https://twitter.com/intent/tweet?text=${shareText}&url=https://cjcon90.github.io/country-quiz/
  `
  );
}

// Function to play the game again under the current Region / Difficulty settings
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
      playQuiz();
      endGameScreen.setAttribute("style", "display: none");
    },
    { once: true }
  );
}
