# country-quiz

The purpose of this website is to create a quiz game based around knowledge of world nations

A link to the live website is [HERE](https://cjcon90.github.io/country-quiz/)

---

## Table of Contents

- [Overview](#Overview)
- [User Experience (UX)](#UX)
  - [User Stories](#Stories)
  - [Design](#Design)
- [Features](#Features)
- [Technologies Used](#Technologies)
- [Testing](#Testing)
- [Bugs & Fixes](#Bugs)
  - [Known Bugs](#Known)
- [Deployment](#Deployment)
- [Credits & Resources](#Credits)

---

<a name="Overview"></a>

## Overview

CountryQuiz is a web app, built using the REST Countries API, that tests users knowledge on country flags, capital city names and country populations; it is focused on being both fun and educational.

It provides varying levels of difficulty depending on which region of the world a user selects and this provides continued enjoyment and learning and encourages repeated playthroughs.

---

<a name="UX"></a>

## User Experience (UX)

<a name="Stories"></a>

### User Stories

- **As a first-time visitor / player**

  - I want to quickly be able to find out how the game works
  - I want to be enticed to play the game by fun visuals and colours
  - I want the layout to be clear and uncluttered so that:
    - I can clearly see where I need to click to input my answers and progress through the game
    - I can clearly track my score is and see how far through the game I am at all times
  - I want to be able to save my score so I can try and beat it on my next play
  - I want to feel rewarded when I get a correct answer or get a new high score

- **As a returning visitor / player**

  - I want to be able to skip any tutorial and go straight into the game
  - I want my previous high score to be saved
  - I was there to be a large pool of questions so that my playing experience is different on each playthrough
  - I want to be able to increase the difficulty and take on new challenges as I get better at the game

- **As the site owner**
  - I want to encourage new users to play the game for the first time
  - I do not want first time players to be confused by the game in any way
  - I want there to be an option for users to share the app through their social media networks
    - I want this option/button be visible after every playthrough so that both first-time players and returning players alike are encouraged to share the app
  - I want the website to be both fun and educational, increasing the likelihood that:
    - users will enjoy the app
    - users will share the app
  - I want the app to work without any errors in terms of the questions asked or the scoring system

<a name="Design"></a>

### Design

#### Imagery

- The main game element of the app is based around the images of country flags on which the user is tested. These images are generated through the REST Countries API, and can represent any country in the world - based on which region or difficulty the user has selected.

- For the landing page of the app, I wanted a single image that would symbolise the subject matter of the game whilst providing a fun visual effect that would excite users to play the game.

- For this I chose an illustration of the earth by [Alfonso de Tomas, sourced on Shutterstock](https://www.shutterstock.com/image-vector/europe-map-africa-russia-asia-north-229383577)
- This image is animated on loading the main menu of the page, growing in size which again brings life into the design of the app.

![img](assets/images/globe-blue-sm.jpg)

#### Colour Scheme

- The main colour scheme for the app was structured around the selected main central image of the earth in space.

  - **Primary Colour** | _Space Cadet_ | #20503C | a dark, soft blue that works very well as a 'night mode' style background colour.

  - **Secondary Colour** | _Android Green_ | #9DBE39 | a bright green that contrasts nicely with the primary dark blue. It's brightness and vibrancy adds a touch of fun to the styling, a requirement as outlined in the user stories.

  - **White Colour** | _Baby Powder_ | #FFFFF6 | a soft white that does not appear sharp or overly bright against the two main app colours.

  - **Black Colour** | _Rich Black FOGRA 29_ | #0E1F2F | a soft black that again does not appear too sharp or overly dark against any of the app colours.

- As the country flags appearing within the app will feature many bright colours throughout, I kept the amount of colours used in the app to a minimum, as too many additional colours would easily risk clashing against the flags or make the game page overwhelming in terms of colour content.

![image](docs/color-palette.png)

#### Typography

- I chose two fonts to use within the document.

  - The default font for areas where legibility was the key factor, such as paragraphs and questions, I chose the popular [Roboto font](https://fonts.google.com/specimen/Roboto#standard-styles) that allows for a natural reading rhythm.

  - For the headings, I wanted a font that was clearly legible but fit with the need of fun visuals, as outlined in the user stories. For this I chose [Racing Sans One](https://fonts.google.com/specimen/Racing+Sans+One), a unique font due to its high contrast sans that creates a fun visual effect.

#### Sound

- There are five sounds implemented within the app which were all sourced from [ZapSplat](https://www.zapsplat.com/)

  1.  [Correct answer](https://www.zapsplat.com/music/bell-chime-notification-high-pitched-metallic-good-for-apps-games-and-other-ui-3/)

  1.  [Wrong Answer](https://www.zapsplat.com/music/game-error-tone-1/)

  1.  [Bonus Points Awarded](https://www.zapsplat.com/music/notification-alert-bell-chime-good-for-alerting-user-of-event-or-message-etc-4/)

  1.  [High Score](https://www.zapsplat.com/music/game-tone-bright-and-warm-synth-win-award-1/)

  1.  [Perfect Score](https://www.zapsplat.com/music/game-tone-bright-warm-and-magical-win-award-or-level-up/)

- The correct and wrong answer sounds were selected to be subtle and short in length as they would be heard multiple times in the app. They were also selected to be easily recognisable in terms of simulating achievement and error.
  - The addition of a unique sound for getting bonus points provides an extra reward to the user, and also makes the in-game sounds less repetitive
- The High Score and Perfect Score sounds were selected to sound somewhat related to each other (both rising melodic tones), with the sound for a perfect score being more complex and higher in tone to also give users an additional feeling of reward, in line with the user stories.

#### Wireframes

- Wireframes were created using Balsamiq:

  1.  [Mobile Wireframes](https://github.com/cjcon90/country-quiz/blob/main/docs/wireframes/wireframe-mobile.pdf)

---

<a name="Features"></a>

## Features

#### Navigation

- Clear navigation to go straight into playing the game on first loading the app
  - Important for returning users who do not need any explanation on the rules.
- Clear navigation to the 'About' section on first loading the app
  - Important for first-time players
- All link text throughout the app is styled in a way that differentiates it from all non-interactive text
- All link and interactive buttons have additional styles when the user hover over or interact with them
- Any disabled buttons are clearly styled so users are not drawn to click on them
- Page auto-focuses to the text input on each question, to create less clicks for the user to progress through the game
- At the end of game user is presented with a list of navigation options
  - Repeat the game under the current region / difficulty settings
  - Play again but choose different region / difficulty settings
  - Exit the game and return to the main menu
    - This is useful for players who need to revisit the About section for any extra clarity

#### About Section

- The About section explains the game to new players:
  - The subject of the game
  - What questions are asked
  - How the region / difficulty selectors work
  - How points & bonus points are scored
  - Where the data comes from
  - How to report any inaccurate data
- Following the explanation there is a link to continue into the game without having to go back to the main menu

#### Game Mode Selection

- Any countries that do not have a population or a capital city name are automatically filtered out before any selection
- Users are given 6 filters for what region they want to play with:
  1.  Africa
  2.  Asia
  3.  Americas
  4.  Europe
  5.  Oceania
  6.  The World
- Users are then given a choice of 4 difficulties, that will filter the remaining countries based on population
  1.  Easy (20,000,000+ population)
  2.  Medium (5,000,000+ population)
  3.  Hard (150,000+ population)
  4.  Expert ()
      - The specific population numbers that determine the difficulty are not given in the app's About section, as this could reveal some of the in-game answers for the user.
      - 'Easy' and 'Medium' mode are disabled for Oceania, as there is not enough countries with a population of 5,000,000+

#### Game Functionality

- A random 5 countries are selected based on the user's chosen filters
- 3 questions are asked for each country
  - What is the country's name (based on the shown flag)
  - What is the countries capital city
  - What is the country's population
    - To generate the population options, an array of 5 populations is generated in the format: `[0.5x, 0.75x, 1x, 1.25x, 1.5x]`
    - Three options are then sliced from this array, so the options always contain the actual population, and appear in ascending order
- Each correct answer is worth 5 points, and players earn a bonus 5 points for answering all questions correctly on an individual country
- If a user gets an answer incorrect, the correct answer is displayed on screen.
- The user's progress in the game is displayed showing how many countries they have answered out of 5
- The user's score is always visible and updated as they progress through the game

#### End Game Screen

- The user's final score and high score are displayed
  - `localStorage()` is used to keep track of a user's high score
- If a user gets a new high score, they are notified with text and sound
- If a user scores 100/100, the text will display "Perfect Score", and a different tone will play
- There are navigation buttons as outlined above
- There is an option for the user to share their score with a link to the game in both Twitter and Facebook
  - The shared link will display: "_I just scored ${score} points in the Country Quiz Challenge! Can you do better? [https://cjcon90.github.io/country-quiz/](https://cjcon90.github.io/country-quiz/)_"
