// ==========================
// Initialize task data and select DOM elements
// ==========================
let taskData = {};

const todo = document.querySelector("#to-do");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const grp = [todo, progress, done];
let droptask = "none";

// ==========================
// Helper function: create a task div
// Returns the created task element
// ==========================
function createTask(title, desc) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button class="btn-del">Delete</button>
  `;

  // Add dragstart listener
  div.addEventListener("dragstart", () => droptask = div);
   const delbutton=div.querySelector(".btn-del");// it can be also button if it have not class 
   delbutton.addEventListener("click",()=>{
    div.remove();
    updateTaskData();
   })
  return div;
}

// ==========================
// Helper function: update taskData and visual count for all columns
// ==========================
function updateTaskData() {
  grp.forEach((col) => {
    // here its count the elemnt div conten
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");
    count.innerText = tasks.length;
    //  here when we use in localstorage save  can be done (More like loading)
    taskData[col.id] = Array.from(tasks).map((t) => ({
      title: t.querySelector("h2").innerText,
      desc: t.querySelector("p").innerText
    }));
  });

  localStorage.setItem("TASK", JSON.stringify(taskData));
}

// ==========================
// Load saved tasks from localStorage
// ==========================
function loadTasks() {
  const saved = localStorage.getItem("TASK");
  if (!saved) return;

  const data = JSON.parse(saved);
  for (const colId in data) {
    const column = document.querySelector(`#${colId}`);
    data[colId].forEach(task => {
      const taskDiv = createTask(task.title, task.desc);
      column.appendChild(taskDiv);
    });
  }

  updateTaskData(); // update counts and storage after loading
}

// ==========================
// Enable drag & drop for a column
// ==========================
function enableDragDrop(column) {
  column.addEventListener("dragenter", e => { e.preventDefault(); column.classList.add("trans"); });
  column.addEventListener("dragover", e => { e.preventDefault(); column.classList.add("trans"); });
  column.addEventListener("dragleave", e => { column.classList.remove("trans"); });

  column.addEventListener("drop", () => {
    if (droptask) column.appendChild(droptask);
    column.classList.remove("trans");
    updateTaskData();
  });
}

// ==========================
// Initialize modal for adding new task
// ==========================
const modal = document.querySelector(".modal");
const Add = document.querySelector("#nav-add");
const Modalbg = document.querySelector(".bg");
const AddTaskBtn = document.querySelector("#AddTask");

Add.addEventListener("click", () => modal.classList.toggle("active"));
Modalbg.addEventListener("click", () => modal.classList.remove("active"));

// ==========================
// Add new task from modal
// ==========================
AddTaskBtn.addEventListener("click", () => {
  const title = document.querySelector("#TaskTitle").value;
  const desc = document.querySelector("#TitleDescription").value;

  const taskDiv = createTask(title, desc);
  todo.appendChild(taskDiv);

  updateTaskData();
  modal.classList.remove("active");
});

// ==========================
// Initialize
// ==========================
loadTasks();
grp.forEach(enableDragDrop);



