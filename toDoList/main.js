let input = document.querySelector("input");
let container = document.querySelector(".tasks");
let submit = document.querySelector(".addTask");
let arrayOfTasks = [];
let del;
let complete;
let div;
if (localStorage.tasks) {
  arrayOfTasks = JSON.parse(localStorage.tasks);
  arrayOfTasks.forEach((e) => {
    div = document.createElement("div");
    let taskName = document.createElement("p");
    taskName.innerHTML = e.name;
    del = document.createElement("button");
    del.className = "del";
    del.innerHTML = "delete";
    complete = document.createElement("button");
    if (e.status == "notCompleted") {
      complete.style.backgroundColor = "green";
      complete.style.color = "white";
    }
    let buttons = document.createElement("div");
    buttons.className = "buttons";
    buttons.append(complete, del);
    if (e.status == "completed") {
      complete.innerHTML = "UnCheck";
    } else {
      complete.innerHTML = "Check";
    }
    complete.className = "complete";
    let mask = document.createElement("div");
    mask.className = "mask";
    if (e.status == "completed") {
      mask.style.width = "100%";
    }
    div.append(taskName, buttons, mask);
    div.classList.add("task", `${e.status}`);
    div.setAttribute("id", e.id);

    container.append(div);
  });
}

submit.onclick = () => {
  if (input.value) {
    const task = {
      id: Date.now(),
      name: input.value,
      status: "notCompleted",
    };
    arrayOfTasks.push(task);
    input.value = "";
  }
  container.innerHTML = "";
  arrayOfTasks.forEach((e) => {
    div = document.createElement("div");
    let taskName = document.createElement("p");
    taskName.innerHTML = e.name;
    del = document.createElement("button");
    del.className = "del";
    del.innerHTML = "delete";
    complete = document.createElement("button");
    if (e.status == "notCompleted") {
      complete.style.backgroundColor = "green";
      complete.style.color = "white";
    }
    let buttons = document.createElement("div");
    buttons.className = "buttons";
    buttons.append(complete, del);
    if (e.status == "completed") {
      complete.innerHTML = "UnCheck";
    } else {
      complete.innerHTML = "Check";
    }
    complete.className = "complete";
    let mask = document.createElement("div");
    mask.className = "mask";
    if (e.status == "completed") {
      mask.style.width = "100%";
    }
    div.append(taskName, buttons, mask);
    div.classList.add("task", `${e.status}`);
    div.setAttribute("id", e.id);
    container.append(div);
  });
  addToStorage();
};

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    e.target.parentElement.parentElement.remove();
    arrayOfTasks = arrayOfTasks.filter(
      (x) => x.id != e.target.parentElement.parentElement.id
    );
    addToStorage();
  } else if (e.target.classList.contains("complete")) {
    for (let z of arrayOfTasks) {
      if (z.id == e.target.parentElement.parentElement.id) {
        if (z.status === "notCompleted") {
          z.status = "completed";
          e.target.innerHTML = "UnCheck";
          let r = e.target.parentElement.parentElement.classList.item(1);
          e.target.parentElement.parentElement.classList.remove(r);
          e.target.parentElement.parentElement.classList.add(`${z.status}`);
          e.target.style.backgroundColor = "#f0f0f0";
          e.target.style.color = "black";
          window.setTimeout(() => {
            e.target.parentElement.parentElement.lastChild.style.width = "100%";
          }, 100);
        } else {
          z.status = "notCompleted";
          e.target.innerHTML = "Check";
          let r = e.target.parentElement.parentElement.classList.item(1);
          e.target.parentElement.parentElement.classList.remove(r);
          e.target.parentElement.parentElement.classList.add(`${z.status}`);
          e.target.style.backgroundColor = "green";
          e.target.style.color = "white";
          window.setTimeout(() => {
            e.target.parentElement.parentElement.lastChild.style.width = "0%";
          }, 100);
        }
      }
    }
    addToStorage();
  }
});

function addToStorage() {
  localStorage.tasks = JSON.stringify(arrayOfTasks);
}
