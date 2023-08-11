//create the popUp menu
function showMenu() {
  let container = document.querySelector(".menu-container");
  let menu = container.nextElementSibling;

  let li = document.querySelector(".menu-container");
  li.addEventListener("click", function (e) {
    if (e.currentTarget == li) {
      if (menu.classList.contains("active-menu")) {
        li.classList.remove("active");
        menu.classList.remove("active-menu");
      } else if (!menu.classList.contains("active-menu")) {
        li.classList.add("active");
        menu.classList.add("active-menu");
      }
      if (menu.classList.contains("active-menu")) {
        menu.style.cssText = "opacity : 1; z-index : 1000; top: 72px";
      } else if (!menu.classList.contains("active-menu")) {
        menu.style.cssText = "opacity : 0";
      }
    } else if (e.target != li) {
      menu.classList.remove("active-menu");
    }
    e.preventDefault();
  });
}
//create the return to top button
function goUp() {
  let upButton = document.querySelector(".up-button");
  window.addEventListener("scroll", function (e) {
    if (scrollY >= 800) {
      upButton.style.cssText = "z-index : 1000; opacity : 1; top : 94vh";
    } else {
      upButton.style.cssText = "z-index : -1000; opacity : 0; top : 100vh";
    }
  });
  upButton.onclick = function (e) {
    window.scrollTo(0, 0);
  };
}
//creat a function that show the time souplessly
function showTime() {
  let days = document.querySelector(".event-days");
  let hours = document.querySelector(".event-hours");
  let minutes = document.querySelector(".event-minutes");
  let seconds = document.querySelector(".event-seconds");

  this.setInterval(() => {
    let difference =
      new Date("2023/12/31 23:59:59").getTime() - new Date().getTime();
    days.innerHTML = Math.floor(difference / (1000 * 60 * 60 * 24));
    hours.innerHTML = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    minutes.innerHTML = Math.floor(
      (difference % (1000 * 60 * 60)) / (1000 * 60)
    );
    seconds.innerHTML = Math.floor((difference % (1000 * 60)) / 1000);
  }, 1000);
}
// show skill with souplesness
function showSkills() {
  let skills = document.querySelectorAll(".skills span");
  let section = document.querySelector(".skills").offsetTop + 150;
  console.log(section);
  window.addEventListener("scroll", function (e) {
    if (this.scrollY >= section) {
      skills.forEach((skill) => skill.classList.add("show-skill"));
    } else {
      skills.forEach((skill) => skill.classList.remove("show-skill"));
    }
  });
}
//show statistics smoothly
function showStats() {
  function counter(el) {
    let goal = el.dataset.goal;
    let count = setInterval(() => {
      el.innerHTML++;
      if (el.innerHTML == goal || window.scrollY < section) {
        clearInterval(count);
      }
    }, 3500 / goal);
  }
  let stats = document.querySelectorAll(".stats h1");
  let section = Number(document.querySelector(".stats").offsetTop - 450);
  let started = 0;
  window.addEventListener("scroll", function () {
    if (started == 0) {
      if (window.scrollY >= section) {
        stats.forEach((stat) => {
          counter(stat);
        });
      }
      started = 1;
    }
    if (window.scrollY < section) {
      started = 0;
      stats.forEach((stat) => (stat.innerHTML = 0));
    }
  });
}

showMenu();
goUp();
showTime();
showSkills();
showStats();
