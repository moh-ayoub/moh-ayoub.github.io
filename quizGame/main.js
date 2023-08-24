// global values
let mainContainer = document.querySelector(".container");
let randomizedQuestions = [];
let questionContainer = document.querySelector(".question");
let answerContainer = document.querySelector(".answers");
let initialAnswers = [];
let randomizedAnswers = [];
let answers;
let filledBullets = Array.from(document.querySelectorAll(".process span"));
let time = document.querySelector(".time");
let mainInterval;
let timer;
let playerScore = 0;

let k = 0;

// create the score local storage if there isn't
if (!localStorage.score || !localStorage.bestScore) {
  localStorage.setItem("score", "0");
  localStorage.setItem("bestScore", "0");
}

// the main function
let request = new XMLHttpRequest();
request.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    let questions = JSON.parse(this.responseText);
    let chosenTopic;

    // creating the topic's list
    createTopics(questions);

    // getting user's infos
    UserData(questions);
  }
};
request.open("GET", "./questions.json");
request.send();

// the functions
// creating the topic's list
function createTopics(questions) {
  let topics = document.querySelector("fieldset");
  let z = 0;
  for (let i = 0; i < questions.length; i++) {
    let topicContainer = document.createElement("div");
    let topicInput = document.createElement("input");
    topicInput.type = "radio";
    topicInput.id = `topic-${i + 1}`;
    topicInput.name = "category";
    topicInput.value = questions[i].category;
    while (z == 0) {
      topicInput.checked = true;
      z++;
    }
    let topicLabel = document.createElement("label");
    topicLabel.classList.add("category");
    topicLabel.setAttribute("for", `topic-${i + 1}`);
    topicLabel.innerHTML = questions[i].category[0]
      .toUpperCase()
      .concat(questions[i].category.slice(1));
    topicContainer.append(topicInput, topicLabel);
    topics.append(topicContainer);
  }
}

// getting user's infos and set questions
function UserData(questions) {
  let startButton = document.querySelector("button.start");
  let userNameField = document.querySelector(".user-name");
  let userName;
  let startScreen = document.querySelector(".start-screen");

  startButton.addEventListener("click", function (e) {
    document.getElementById("welcome-sound").play();

    // user name
    if (userNameField.value == "" || userNameField.value == null) {
      userName = "Unknown";
    } else {
      userName = userNameField.value.trim();
    }

    // chosen topic
    let topicsValues = document.getElementsByName("category");
    for (let i = 0; i < topicsValues.length; i++) {
      if (topicsValues[i].checked) {
        chosenTopic = topicsValues[i].value;
      }
    }
    startScreen.remove();
    mainContainer.style.display = "block";
    mainContainer.style.opacity = "1";

    let heading = document.querySelector(".header .category");
    heading.innerHTML = `${chosenTopic[0]
      .toUpperCase()
      .concat(chosenTopic.slice(1))} Quiz`;

    //randomize qustions
    setQuestions(questions, chosenTopic);

    // display questions
    // set timer
    timer = setInterval(() => {
      let started = true;
      if (time.innerHTML < 5) {
        time.style.color = "red";
        do {
          document.getElementById("ticking-sound").play();
        } while (started == false);
      } else {
        time.style.color = "black";
      }
      time.innerHTML -= 1;
      if (time.innerHTML == 0) {
        time.style.color = "black";
        document.getElementById("wrong").play();
        filledBullets[k - 1].style.backgroundColor = "red";
        filledBullets[k - 1].style.border = "none";
        time.innerHTML = 10;
      }
    }, 1000);

    displayQuestions(randomizedQuestions);
    mainInterval = setInterval(() => {
      displayQuestions(randomizedQuestions);
    }, 10000);
  });
}

// randomize questions
function setQuestions(questions, topic) {
  switch (topic) {
    case "sport":
      questions = questions[0];
      break;
    case "science":
      questions = questions[1];
      break;
  }
  let initialQuestions = questions.questions;
  while (initialQuestions.length > 0) {
    let randomNumber = Math.floor(Math.random() * initialQuestions.length);
    randomizedQuestions.push(initialQuestions[randomNumber]);
    initialQuestions.splice(randomNumber, 1);
    randomizedQuestions.slice(0, 12);
  }
}

// display questions
function displayQuestions(questions) {
  if (k == 12) {
    document.getElementById("end-sound").play();

    // adding score to locale storage
    localStorage.score = playerScore;
    if (playerScore > localStorage.bestScore) {
      localStorage.bestScore = playerScore;
    }

    //displaying the end screen
    mainContainer.style.opacity = "0";
    clearInterval(timer);
    clearInterval(mainInterval);
    setTimeout(() => {
      mainContainer.remove();
    }, 1000);

    let endScreen = document.querySelector(".end-screen");
    let scoreContainer = document.querySelector(".your-score");
    let bestScoreContainer = document.querySelector(".best-score");
    let messageContainer = document.querySelector(".message");
    let restartButton = document.querySelector(".restart");

    scoreContainer.innerHTML = `You Got : ${playerScore}/12`;
    bestScoreContainer.innerHTML = `Best Score : ${localStorage.bestScore}/12`;
    if (playerScore == localStorage.bestScore) {
      messageContainer.innerHTML = "You Got The Best Score !";
    } else {
      messageContainer.innerHTML = "You Can Do Better .";
    }
    endScreen.style.display = "flex";
    setTimeout(() => {
      endScreen.style.opacity = "1";
    }, 200);

    restartButton.addEventListener("click", function () {
      location.reload();
    });
  }

  answerContainer.innerHTML = "";

  questionContainer.innerHTML = questions[k].question.title;

  //randomize answers
  initialAnswers.push(questions[k].question["correct-answer"]);
  initialAnswers.push(...questions[k].question["other-answers"].split("-"));
  while (initialAnswers.length > 0) {
    let randomNumber = Math.floor(Math.random() * initialAnswers.length);
    randomizedAnswers.push(initialAnswers[randomNumber]);
    initialAnswers.splice(randomNumber, 1);
  }

  // display answers
  randomizedAnswers.forEach((answer) => {
    let answerDiv = document.createElement("div");
    answerDiv.classList.add("answer");
    answerDiv.innerHTML = answer;
    answerContainer.append(answerDiv);
  });

  // create the logic response and decision
  let displayedAnswers = document.querySelectorAll(".answer");

  displayedAnswers.forEach((answer) => {
    answer.addEventListener("click", function (e) {
      time.style.color = "black";
      document.getElementById("ticking-sound").pause();
      document.getElementById("ticking-sound").currentTime = 0;
      if (
        e.currentTarget.innerHTML == questions[k - 1].question["correct-answer"]
      ) {
        document.getElementById("correct").play();
        filledBullets[k - 1].style.backgroundColor = "green";
        filledBullets[k - 1].style.border = "none";
        playerScore += 1;
      } else {
        document.getElementById("wrong").play();
        filledBullets[k - 1].style.backgroundColor = "red";
        filledBullets[k - 1].style.border = "none";
      }

      // restart the timer
      clearInterval(timer);
      time.innerHTML = "10";
      timer = setInterval(() => {
        let started = true;
        if (time.innerHTML < 5) {
          time.style.color = "red";
          do {
            document.getElementById("ticking-sound").play();
          } while (started == false);
        } else {
          time.style.color = "black";
        }
        time.innerHTML -= 1;
        if (time.innerHTML == 0) {
          time.style.color = "black";
          document.getElementById("wrong").play();
          filledBullets[k - 1].style.backgroundColor = "red";
          filledBullets[k - 1].style.border = "none";
          time.innerHTML = 10;
        }
      }, 1000);

      //restart the main interval
      questionContainer.innerHTML = "";
      answerContainer.innerHTML = "";
      clearInterval(mainInterval);
      displayQuestions(randomizedQuestions);
      mainInterval = setInterval(() => {
        displayQuestions(randomizedQuestions);
      }, 10000);
    });
    // displaying the restart screen
  });
  randomizedAnswers = [];
  k++;
}
