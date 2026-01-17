const themeToggle = document.getElementById("themeToggle");
const newTaskForm = document.getElementById("newTaskForm");
const newTaskInput = document.getElementById("newTaskInput");
const todoItems = document.getElementById("todoItems");
const itemsLeftSpan = document.getElementById("itemsLeftNumber");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterBtns = document.querySelectorAll(".todo-filter button");
const body = document.body;

// === ESTADO ===
let tasks = [];
let currentFilter = "all";
let sortableInstance = null;

function generateId() {
  return Date.now();
}

// === GESTAO DE ORDEM ===
function getNextOrder() {
  // cria uma nova posicao
  if (tasks.length === 0) return 0;
  const maxOrder = Math.max(...tasks.map((task) => task.order));
  return maxOrder + 1;
}

function normalizeOrder() {
  // limpa e reorgniza tudo
  tasks.sort((a, b) => a.order - b.order);
  tasks.forEach((task, index) => {
    task.order = index;
  });
}

function reorderAfterRemoval(removedOrder) {
  // ajusta a ordem após remover
  tasks.forEach((task) => {
    if (task.order > removedOrder) {
      task.order--;
    }
  });
}

// === OPERAÇÕES DA TASK ===
function createTask(text) {
  return {
    id: generateId(),
    text: text.trim(),
    completed: false,
    order: getNextOrder(),
  };
}

function addTask(text) {
  if (!text.trim()) return;

  const newTask = createTask(text);
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function findTaskById(taskId) {
  return tasks.find((task) => task.id === taskId);
}

function removeTask(taskId) {
  const task = findTaskById(taskId);

  if (!task) return;

  const removedOrder = task.order;
  tasks = tasks.filter((task) => task.id !== taskId);
  reorderAfterRemoval(removedOrder);

  saveTasks();
  renderTasks();
}

function toggleTaskComplete(taskId) {
  const task = findTaskById(taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  normalizeOrder();
  saveTasks();
  renderTasks();
}

// === FILTRAGEM ===
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

function setFilter(filter) {
  currentFilter = filter;
  updateActiveFilter();
  renderTasks();
}

// === RENDERIZAÇÃO ===
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
      <img src="assets/images/icon-cross.svg" alt="Remove task" />
    </button>
  `;
  return li;
}

function renderTasks() {
  todoItems.innerHTML = "";

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
  const tasksToRender = getFilteredTasks();

  const orderedTasksToRender = sortedTasks.filter((task) =>
    tasksToRender.some((t) => t.id === task.id)
  );

  orderedTasksToRender.forEach((task) => {
    const li = createTaskElement(task);
    todoItems.appendChild(li);
  });

  updateItemsLeft();
  updateEmptyState();
}

// === HANDLERS DE EVENTOS ===
function handleNewTaskSubmit(e) {
  e.preventDefault();
  const taskText = newTaskInput.value.trim();
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
  if (e.target.closest(".todo-item__remove-btn")) {
    removeTask(taskId);
  }
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

// === ATUALIZAÇÃO DE UI ===
function updateItemsLeft() {
  const activeTasks = tasks.filter((task) => !task.completed).length;
  itemsLeftSpan.textContent = activeTasks;
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

function updateEmptyState() {
  const emptyState = document.getElementById("emptyState");
  const todoContent = document.querySelector(".todo-content");
  const todoFilter = document.querySelector(".todo-filter");
  const dragHint = document.querySelector(".drag-hint");

  const hasTasks = tasks.length > 0;

  emptyState.style.display = hasTasks ? "none" : "block";
  todoContent.style.display = hasTasks ? "block" : "none";
  todoFilter.style.display = hasTasks ? "flex" : "none";
  dragHint.style.display = hasTasks ? "block" : "none";
}

// === TEMA ===
function toggleTheme() {
  const currentTheme = body.dataset.theme;
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.dataset.theme = newTheme;
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("img");
  icon.src =
    theme === "dark"
      ? "assets/images/icon-sun.svg"
      : "assets/images/icon-moon.svg";
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  body.dataset.theme = savedTheme;
  updateThemeIcon(savedTheme);
}

// === DRAG AND DROP ===
function setupDragAndDrop() {
  if (sortableInstance) {
    sortableInstance.destroy();
  }
  sortableInstance = new Sortable(todoItems, {
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
      console.log("nova ordem:", tasks);
    },
  });
}

// === LOCAL STORAGE === 
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
}

// === INICIALIZAÇÃO ===
function setupEventListener() {
  themeToggle.addEventListener("click", toggleTheme);
  newTaskForm.addEventListener("submit", handleNewTaskSubmit);
  todoItems.addEventListener("click", handleTaskListClick);
  clearCompletedBtn.addEventListener("click", clearCompletedTasks);
  filterBtns.forEach((btn) => btn.addEventListener("click", handleFilterClick));
}

function initializeTasks() {
  tasks = loadTasks();
  normalizeOrder();
}

function init() {
  loadSavedTheme();
  initializeTasks();
  setupEventListener();
  renderTasks();
  setupDragAndDrop();
}

init();
