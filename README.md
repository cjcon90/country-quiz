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

CountryQuiz is a web app, built using the REST Countries API, that is focused on being both fun and educational.

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

	- **Primary Colour** | *Space Cadet* | #20503C | a dark, soft blue that works very well as a 'night mode' style background colour.

	- **Secondary Colour** | *Android Green* | #9DBE39 | a bright green that contrasts nicely with the primary dark blue. It's brightness and vibrancy adds a touch of fun to the styling, a requirement as outlined in the user stories.

	- **White Colour** | *Baby Powder* | #FFFFF6 | a soft white that does not appear sharp or overly bright against the two main app colours.

	- **Black Colour** | *Rich Black FOGRA 29* | #0E1F2F | a soft black that again does not appear too sharp or overly dark against any of the app colours.

- As the country flags appearing within the app will feature many bright colours throughout, I kept the amount of colours used in the app to a minimum, as too many additional colours would easily risk clashing against the flags or make the game page overwhelming in terms of colour content. 


![image](docs/color-palette.png)

#### Typography

- I chose two fonts to use within the document.

	- The default font for areas where legibility was the key factor, such as paragraphs and questions, I chose the popular [Roboto font](https://fonts.google.com/specimen/Roboto#standard-styles) that allows for a natural reading rhythm.

	- For the headings, I wanted a font that was clearly legible but fit with the need of fun visuals, as outlined in the user stories. For this I chose [Racing Sans One](https://fonts.google.com/specimen/Racing+Sans+One), a unique font due to its high contrast sans that creates a fun visual effect.

#### Sound

- There are sounds implemented within the app which were all sourced from [ZapSplat](https://www.zapsplat.com/)
	1. [Correct answer](https://www.zapsplat.com/music/bell-chime-notification-high-pitched-metallic-good-for-apps-games-and-other-ui-3/) 
	1. [Wrong Answer](https://www.zapsplat.com/music/game-error-tone-1/)
	1. [High Score](https://www.zapsplat.com/music/game-tone-bright-and-warm-synth-win-award-1/)
	1. [Perfect Score](https://www.zapsplat.com/music/game-tone-bright-warm-and-magical-win-award-or-level-up/)
- The correct and wrong answer sounds were selected to be subtle and short in length as they would be heard multiple times in the app. They were also selected to be easily recognisable in terms of simulating achievement and error.
- The High Score and Perfect Score sounds were selected to sound somewhat related to each other (both rising melodic tones), with the sound for a perfect score being more complex and higher in tone to give users an additional feeling of reward, in line with the user stories.

#### Wireframes

- Wireframes were created using Balsamiq:

	1. [Mobile Wireframes](https://github.com/cjcon90/country-quiz/blob/main/docs/wireframes/wireframe-mobile.pdf)

---

<a name="Features"></a>

## Features

#### Home Menu
- Clear navigation to go straight into playing the game.
	- Important for returning users who do not need any explanation on the rules.
- Clear navigation to  