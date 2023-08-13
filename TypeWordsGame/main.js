// add a local storage for best score if it doesn't exist
if (
  !localStorage.bestScoreEasy ||
  !localStorage.bestScoreMedium ||
  !localStorage.bestScoreHard
) {
  localStorage.setItem("bestScoreEasy", "0");
  localStorage.setItem("bestScoreMedium", "0");
  localStorage.setItem("bestScoreHard", "0");
}

// set the level and the speed
let level = "medium";
let speed;
let words = [];
let theForm = document.querySelector(".difficulty");
let levels = document.querySelectorAll(".level");
let levelStatus = document.querySelector(".level-status");
let speedStatus = document.querySelector(".speed-status");
let gameStats = document.querySelector(".game-stats");
let bestScoreValue = document.querySelector(".best");

// set the best score value from the local storage
bestScoreValue.innerHTML = localStorage.bestScoreMedium;

levels.forEach((lev) => {
  lev.onchange = function () {
    level = lev.dataset.difficulty;
    levelStatus.innerHTML = level;
    speed = lev.dataset.speed;
    speedStatus.innerHTML = lev.dataset.speed;

    //set the best score value
    if (level == "Easy") {
      bestScoreValue.innerHTML = localStorage.bestScoreEasy;
    } else if (level == "Medium") {
      bestScoreValue.innerHTML = localStorage.bestScoreMedium;
    } else if (level == "Hard") {
      bestScoreValue.innerHTML = localStorage.bestScoreHard;
    }
  };
});

// start playing
let startButton = document.querySelector("button.start");
let nextWord = document.querySelector(".next-word");
let writtenWord = document.querySelector(".written-word");
let wordsList = document.querySelector(".words-list");
let bestScore = document.querySelector(".best-score");

writtenWord.onpaste = function () {
  return false;
};

startButton.onclick = function (e) {
  theForm.style.cssText = "opacity : 0; z-index : -1000";
  e.currentTarget.style.display = "none";
  nextWord.style.display = "block";
  writtenWord.focus();
  bestScore.style.cssText = "opacity : 0";

  // set up the words
  if (level.toLowerCase() == "easy") {
    words = [
      "Hi",
      "Hello",
      "Bye",
      "Eye",
      "Ear",
      "Era",
      "Foot",
      "Pie",
      "Feet",
      "John",
      "Tooth",
      "Teeth",
      "Sun",
      "Moon",
      "Ball",
    ];
  } else if (level.toLowerCase() == "medium") {
    words = [
      "Coding",
      "Language",
      "Morning",
      "Medium",
      "Winter",
      "Salade",
      "Heart",
      "August",
      "January",
      "Watch",
      "Bottle",
      "Guitar",
      "Minute",
    ];
  } else if (level.toLowerCase() == "hard") {
    words = [
      "Programming",
      "Afternoon",
      "Paradise",
      "Parasite",
      "Animals",
      "February",
      "Building",
      "Handling",
      "Australia",
      "Basketball",
      "Baseball",
      "Handball",
    ];
  }

  wordsList.innerHTML = "";
  words.forEach((word) => {
    let wordDiv = document.createElement("div");
    wordDiv.innerHTML = word;
    wordsList.append(wordDiv);
  });

  // Generate random words from the list
  genFirstWord();
  genWords();
};

// a function that generates random words
function genFirstWord() {
  nextWord.innerHTML = words[Math.floor(Math.random() * words.length)];
  let nextWordIndex = words.indexOf(nextWord.innerHTML);
  words.splice(nextWordIndex, 1);
  wordsList.innerHTML = "";
  words.forEach((word) => {
    let wordDiv = document.createElement("div");
    wordDiv.innerHTML = word;
    wordsList.append(wordDiv);
  });
  totalScore.innerHTML = words.length + 1;
  timeLeft.innerHTML = +speedStatus.innerHTML + 3;
}

let timeLeft = document.querySelector(".time-left");
let currentScore = document.querySelector(".current-score");
let totalScore = document.querySelector(".total-score");

// generate other random words
function genWords() {
  let counter = setInterval(() => {
    timeLeft.innerHTML--;
    writtenWord.oninput = function () {
      if (
        writtenWord.value == nextWord.innerHTML.toLowerCase() ||
        writtenWord.value == nextWord.innerHTML
      ) {
        timeLeft.innerHTML = speedStatus.innerHTML;
        writtenWord.value = "";

        nextWord.innerHTML = words[Math.floor(Math.random() * words.length)];
        nextWordIndex = words.indexOf(nextWord.innerHTML);
        words.splice(nextWordIndex, 1);
        wordsList.innerHTML = "";
        words.forEach((word) => {
          let wordDiv = document.createElement("div");
          wordDiv.innerHTML = word;
          wordsList.append(wordDiv);
        });

        currentScore.innerHTML++;

        if (currentScore.innerHTML == totalScore.innerHTML) {
          clearInterval(counter);
          nextWord.innerHTML = "You're Fast !";
          writtenWord.value = "Congrat'z";
          writtenWord.disabled = true;
          writtenWord.style.cssText = "color : #0fa9ef; font-weight : bold";
          // Add score to locale storage
          if (level == "Easy") {
            localStorage.bestScoreEasy = totalScore.innerHTML;
          } else if ("Medium") {
            localStorage.bestScoreMedium = totalScore.innerHTML;
          } else if ("Hard") {
            localStorage.bestScoreHard = totalScore.innerHTML;
          }
          // show the best score
          bestScore.style.opacity = "1";
        }
      }
    };

    if (timeLeft.innerHTML == 0 && words.length > 0) {
      writtenWord.disabled = true;
      writtenWord.value = "Game Over";
      clearInterval(counter);
      nextWord.innerHTML = `Score ${currentScore.innerHTML}/${totalScore.innerHTML}`;
      writtenWord.style.cssText = "color : red; font-weight : bold";

      // add to local storage
      if (
        level == "Easy" &&
        +localStorage.bestScoreEasy < +currentScore.innerHTML
      ) {
        localStorage.bestScoreEasy = currentScore.innerHTML;
        bestScoreValue.innerHTML = currentScore.innerHTML;
        nextWord.innerHTML = `Got The Best Score!`;
      } else if (
        "Medium" &&
        +localStorage.bestScoreMedium < +currentScore.innerHTML
      ) {
        localStorage.bestScoreMedium = currentScore.innerHTML;
        bestScoreValue.innerHTML = currentScore.innerHTML;
        nextWord.innerHTML = `Got The Best Score!`;
      } else if (
        "Hard" &&
        +localStorage.bestScoreHard < +currentScore.innerHTML
      ) {
        localStorage.bestScoreHard = currentScore.innerHTML;
        bestScoreValue.innerHTML = currentScore.innerHTML;
        nextWord.innerHTML = `Got The Best Score!`;
      }
      // show the best score
      bestScore.style.cssText = "opacity : 1; left : 10px";
    }
  }, 1000);
}
