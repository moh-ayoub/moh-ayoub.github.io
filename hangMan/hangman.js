// global values
let topic;
let number;
let wordLettersList;
let gameLength;
let startButton = document.querySelector("button.start");
let score;
let bestScore;

// set the local storage
if (!localStorage.bestScore || !localStorage.score) {
  localStorage.bestScore = 0;
  localStorage.score = 0;
}

let request = new XMLHttpRequest();
request.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    number = 0;
    topicsObject = JSON.parse(this.responseText);

    // the start screen

    startScreen();

    // start the gtame after clicking on start
    startButton.addEventListener("click", function () {
      document.getElementById("intro").play();

      // set the topic chosen
      for (let x of document.querySelectorAll("fieldset > div input")) {
        if (x.checked) {
          let chosenTopic = x.value;

          document.querySelector(".topic").innerHTML = String(chosenTopic)
            .split("")[0]
            .toUpperCase()
            .concat(String(chosenTopic).slice(1));
          topic = topicsObject[`${chosenTopic}`];
          gameLength = topic.length;
        }
      }

      // hide the start screen and show the game screen
      document.querySelector(".start-screen").remove();
      document.querySelector(".container").style.opacity = "1";

      // create letters alphabet
      createLetters();

      // create the word
      createWord(topic, number);

      // start the timer
      timer();

      // the main logic function
      mainLogic(topic);
    });
  }
};
request.open("GET", "./hangman.json");
request.send();

// the start screen
function startScreen() {
  for (let x in topicsObject) {
    let topics = document.querySelector("fieldset");
    let topicContainer = document.createElement("div");
    let topicInput = document.createElement("input");
    topicInput.type = "radio";
    topicInput.name = "topic";
    topicInput.value = x;
    topicInput.id = x;
    let topicLabel = document.createElement("label");
    topicLabel.innerHTML = String(x)
      .split("")[0]
      .toUpperCase()
      .concat(String(x).slice(1));
    topicLabel.setAttribute("for", x);
    topicContainer.append(topicInput, topicLabel);
    topics.append(topicContainer);
  }
  document.querySelectorAll("fieldset > div input")[0].checked = true;
}

// create the letters
function createLetters() {
  let lettersContainer = document.querySelector(".typing-box .letters");
  let letters = "A-B-C-D-E-F-G-H-I-J-K-L-M-N-O-P-Q-R-S-T-U-V-W-Y-Z";
  letters.split("-").forEach((letter) => {
    let letterContainer = document.createElement("span");
    letterContainer.innerHTML = letter;
    letterContainer.id = letter;
    lettersContainer.append(letterContainer);
  });
}

// create the word
function createWord(topic, number) {
  let chosenWord = topic[number];
  let wordContainer = document.querySelector(".typing-box .word");
  chosenWord.split("").forEach((letter) => {
    let letterContainer = document.createElement("span");
    letterContainer.classList.add("hidden");
    letterContainer.innerHTML = String(letter).toUpperCase();
    letterContainer.classList.add(String(letter).toUpperCase());
    wordContainer.append(letterContainer);
  });
}

// timer function
function timer() {
  let counterContainer = document.querySelector(".counter");
  let seconds = 0;
  let minutes = 0;

  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  counterContainer.innerHTML = `${minutes}:${seconds}`;

  let counter = setInterval(() => {
    seconds++;
    if (seconds == 60) {
      minutes++;
      seconds = 0;
    }

    minutes = minutes < 10 ? `0${parseInt(minutes)}` : minutes;
    seconds = seconds < 10 ? `0${parseInt(seconds)}` : seconds;

    counterContainer.innerHTML = `${minutes}:${seconds}`;
  }, 1000);
}

// show the game over screen
function gameOver() {
  // set the score
  score = document.querySelector(".container .score").innerHTML;
  if (localStorage.bestScore < score) {
    localStorage.bestScore = score;
  }
  bestScore = localStorage.bestScore;

  // set the message
  let message =
    localStorage.bestScore < score
      ? "You Got The Best Score !"
      : "You Can Do Better !";

  // set the end screen
  document.querySelector(
    ".end-screen .current-score"
  ).innerHTML = `Score : ${score}`;
  document.querySelector(
    ".end-screen .best-score"
  ).innerHTML = `Best Score : ${bestScore}`;
  document.querySelector(".end-screen .message").innerHTML = message;

  document.querySelector(".container").remove();
  document.querySelector(".end-screen").style.opacity = 1;

  // restart the game
  document
    .querySelector(".end-screen .restart")
    .addEventListener("click", function () {
      location.reload();
    });
}

// the main logic function
function mainLogic(topic) {
  // add the clicking logic
  let alphabet = document.querySelectorAll(".typing-box .letters span");
  let wordLetters = document.querySelectorAll(".typing-box .word span");
  wordLettersList = Array.from(topic[number].split(""));

  alphabet.forEach((letter) => {
    let hangedMan = document.querySelectorAll(".hanged");
    letter.addEventListener("click", function (e) {
      e.currentTarget.classList.add("clicked");

      // decide if the clicked letter exists
      if (wordLettersList.includes(String(e.currentTarget.id).toLowerCase())) {
        document.getElementById("correct").play();

        Array.from(document.getElementsByClassName(e.currentTarget.id)).forEach(
          (span) => {
            span.classList.remove("hidden");
          }
        );
        document.querySelector(".score").innerHTML =
          parseInt(document.querySelector(".score").innerHTML) + 200;
      } else {
        document.getElementById("wrong").play();

        document.querySelectorAll(".hanged")[0].classList.remove("hanged");
        document.querySelector(".score").innerHTML =
          parseInt(document.querySelector(".score").innerHTML) - 50;
      }

      // move to the next word
      if (document.querySelectorAll(".hidden").length == 0) {
        document
          .querySelectorAll(".clicked")
          .forEach((clicked) => clicked.classList.remove("clicked"));
        document
          .querySelectorAll(".hang-material")
          .forEach((span) => span.classList.add("hanged"));
        number++;

        // end the game if there is no more words
        if (number == gameLength) {
          document.getElementById("over").play();
          setTimeout(() => {
            gameOver();
          }, 1000);
        }

        wordLettersList = Array.from(topic[number].split(""));
        document.querySelector(".typing-box .word").innerHTML = "";
        createWord(topic, number);
      }

      // end the game if the hanged man is fully drawn
      if (document.querySelectorAll(".hanged").length == 0) {
        document.getElementById("over").play();
        setTimeout(() => {
          gameOver();
        }, 1000);
      }
    });
  });
}
