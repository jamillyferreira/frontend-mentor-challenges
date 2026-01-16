const themeToggle = document.getElementById("themeToggle");
const newTaskForm = document.getElementById("newTaskForm");
const newTaskInput = document.getElementById("newTaskInput");
const todoItems = document.getElementById("todoItems");
const itemsLeftSpan = document.getElementById("itemsLeftNumber");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterBtns = document.querySelectorAll(".todo-filter button");
const body = document.body;

let tasks = [];
let currentFilter = "all";

// operações da task
function addTask(text) {
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

// remove uma task pelo id
function remove(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
}

// Alterna o estado de completado de uma task
function toggleTaskComplete(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// Retorna as tasks filtradas baseada no filtro atual
function getFilteredTasks() {
  switch (currentFilter) {
    case "active":
      return tasks.filter((task) => !task.completed);
    case "completed":
      return tasks.filter((task) => task.completed);
    default:
      return tasks;
  }
}

// Criar lista de task
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "todo-item";

  if (task.completed) {
    li.classList.add("todo-item--completed");
  }
  li.dataset.id = task.id;
  li.innerHTML = `
    <label class="todo-item__label">
      <input
        type="checkbox"
        class="todo-item__checkbox"
        ${task.completed ? "checked" : ""}
        aria-label="Mark task as completed"
        />
        <span class="todo-item__checkmark"></span>
        <p class="todo-item__text">${task.text}</p>
    </label>
    <button class="todo-item__remove-btn" aria-label="Remove task">
      <img src="images/icon-cross.svg" alt="Remove task" />
    </button>
  `;
  return li;
}

function renderTasks() {
  todoItems.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  filteredTasks.forEach((task) => {
    const li = createTaskElement(task);
    todoItems.appendChild(li);
  });

  updateItemsLeft();
  updateEmptyState();

  setupDragAndDrop();
}

function updateActiveFilter() {
  filterBtns.forEach((btn) => {
    btn.classList.remove("active");

    if (
      (currentFilter === "all" &&
        btn.classList.contains("todo-filter__btn-all")) ||
      (currentFilter === "active" &&
        btn.classList.contains("todo-filter__btn-active")) ||
      (currentFilter === "completed" &&
        btn.classList.contains("todo-filter__btn-completed"))
    ) {
      btn.classList.add("active");
    }
  });
}

function setFilter(filter) {
  currentFilter = filter;
  updateActiveFilter();
  renderTasks();
}

// Handles
function handleNewTaskSubmit(e) {
  e.preventDefault();
  const taskText = newTaskInput.value.trim();
  if (taskText === "") return;
  addTask(taskText);
  newTaskInput.value = "";
}

function handleTaskListClick(e) {
  const taskItem = e.target.closest(".todo-item");
  if (!taskItem) return;

  const taskId = Number(taskItem.dataset.id);
  if (e.target.classList.contains("todo-item__checkbox")) {
    toggleTaskComplete(taskId);
  }
  if (e.target.closest(".todo-item__remove-btn")) remove(taskId);
}

function handleFilterClick(e) {
  const btn = e.target;
  if (btn.classList.contains("todo-filter__btn-all")) {
    setFilter("all");
  } else if (btn.classList.contains("todo-filter__btn-active")) {
    setFilter("active");
  } else if (btn.classList.contains("todo-filter__btn-completed")) {
    setFilter("completed");
  }
}

function updateItemsLeft() {
  const activeTasks = tasks.filter((task) => !task.completed).length;
  itemsLeftSpan.textContent = activeTasks;
}

function updateEmptyState() {
  const emptyState = document.getElementById("emptyState");
  const todoContent = document.querySelector(".todo-content");
  const todoFilter = document.querySelector(".todo-filter");
  const dragHint = document.querySelector(".drag-hint");

  if (tasks.length === 0) {
    emptyState.style.display = "block";
    todoContent.style.display = "none";
    todoFilter.style.display = "none";
    dragHint.style.display = "none";
  } else {
    emptyState.style.display = "none";
    todoContent.style.display = "block";
    todoFilter.style.display = "flex";
    dragHint.style.display = "block";
  }
}

// Funcao Toggle Theme
function toggleTheme() {
  const currentTheme = body.dataset.theme;
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.dataset.theme = newTheme;
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("img");
  icon.src = theme === "dark" ? "images/icon-sun.svg" : "images/icon-moon.svg";
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  body.dataset.theme = savedTheme;
  updateThemeIcon(savedTheme);
}

function setupDragAndDrop() {
  new Sortable(todoItems, {
    animation: 150,
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",

    onEnd: function (evt) {
      const newOrder = Array.from(todoItems.children).map((li) =>
        Number(li.dataset.id)
      );
      tasks = newOrder.map((id) => tasks.find((task) => task.id === id));
      saveTasks();
    },
  });
}

// Event Listeners
themeToggle.addEventListener("click", toggleTheme);
newTaskForm.addEventListener("submit", handleNewTaskSubmit);
todoItems.addEventListener("click", handleTaskListClick);
clearCompletedBtn.addEventListener("click", clearCompleted);
filterBtns.forEach((btn) => btn.addEventListener("click", handleFilterClick));

function init() {
  loadSavedTheme();
  tasks = loadTasks();
  renderTasks();
  setupDragAndDrop();
}
init();
