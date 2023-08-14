// check locale storage
if (localStorage.score) {
} else {
  localStorage.setItem("score", 0);
}

// the start screen
let startScreen = document.querySelector(".start-screen");
let startButton = document.querySelector(".start-screen button");
let userName = document.querySelector(".greeting .name");
startButton.onclick = function () {
  let user = prompt("Your Name");
  startScreen.style.display = "none";
  if (user == null || user == "") {
    userName.innerHTML = "Unknown";
  } else {
    userName.innerHTML = user;
  }
};

//shufflling cards
let cards = document.querySelectorAll(".card");
let randomNumber;
let numbersArray = [];
for (let i = 1; i <= cards.length; i++) {
  numbersArray.push(i);
}
let shuffledArray = [];
function cardsShuffling() {
  while (numbersArray.length > 0) {
    randomNumber = Math.floor(Math.random() * numbersArray.length);
    shuffledArray.push(numbersArray[randomNumber]);
    numbersArray.splice(randomNumber, 1);
  }
  cards.forEach((card, key) => (card.style.order = shuffledArray[key]));
}
cardsShuffling();

//scoring
let scoreContainer = document.querySelector(".scoring .score");
let score = 0;
scoreContainer.innerHTML = score;

// flipping cards
cards.forEach((card) => card.classList.add("unflipped"));
cards.forEach((card) => {
  card.onclick = function (e) {
    e.currentTarget.classList.add("flipped");
    e.currentTarget.classList.remove("unflipped");
    // get the flipped cards
    let FlippedCards = document.querySelectorAll(".flipped");
    // if two cards are flipped stop clicking on others
    if (FlippedCards.length == 2) {
      let unflippedCards = document.querySelectorAll(".unflipped");
      unflippedCards.forEach((card) => (card.style.pointerEvents = "none"));
      if (FlippedCards[0].dataset.kind == FlippedCards[1].dataset.kind) {
        FlippedCards.forEach((card) => {
          card.classList.remove("flipped");
          card.classList.add("matched");
          unflippedCards.forEach((card) => (card.style.pointerEvents = "all"));
        });
        document.querySelector("#correct").play();
        score += 20;
        scoreContainer.innerHTML = score;
      } else {
        setTimeout(() => {
          FlippedCards.forEach((card) => {
            card.classList.remove("flipped");
            card.classList.add("unflipped");
          });
          unflippedCards.forEach((card) => (card.style.pointerEvents = "all"));
        }, 1000);
        document.querySelector("#fail").play();
        score -= 5;
        scoreContainer.innerHTML = score;
      }
    }

    let finished = Array.from(cards).every((card) =>
      card.classList.contains("matched")
    );
    if (finished === true) {
      document.querySelector("#winning").play();
      // add score to local storage
      if (localStorage.score < score) {
        localStorage.score = score;
        document.querySelector(".congrats").style.display = "block";
      }
      //add score to screen
      document.querySelector(".best-score").innerHTML = localStorage.score;
      document.querySelector(".result-score").innerHTML = score;
      document.querySelector(".replay-screen").style.display = "block";
    }
  };
});
// the replay button
document.querySelector("button.replay").onclick = function () {
  location.reload();
};
