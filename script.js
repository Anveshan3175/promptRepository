const categories = [
  "Marketing",
  "Coding",
  "Writing",
  "Research",
  "Productivity"
];

const storageKey = "promptRepository.prompts";

const homeView = document.querySelector("#homeView");
const addView = document.querySelector("#addView");
const filterForm = document.querySelector("#filterForm");
const addPromptForm = document.querySelector("#addPromptForm");
const categoryFilter = document.querySelector("#categoryFilter");
const categoryInput = document.querySelector("#categoryInput");
const promptText = document.querySelector("#promptText");
const promptList = document.querySelector("#promptList");
const promptCount = document.querySelector("#promptCount");
const resultsTitle = document.querySelector("#resultsTitle");
const addPromptBtn = document.querySelector("#addPromptBtn");
const cancelBtn = document.querySelector("#cancelBtn");

function loadPrompts() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}
/*
  The prompts are stored in the browser’s localStorage, under this key: promptRepository.prompts
  That means they are saved locally in the browser on your machine, not in a database or file. 
*/
function savePrompts(prompts) {
  localStorage.setItem(storageKey, JSON.stringify(prompts));
}

function populateCategories() {
  const options = categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");

  categoryFilter.insertAdjacentHTML("beforeend", options);
  categoryInput.insertAdjacentHTML("beforeend", options);
}

function showHome() {
  addView.classList.add("hidden");
  homeView.classList.remove("hidden");
}

function showAddForm() {
  homeView.classList.add("hidden");
  addView.classList.remove("hidden");
  addPromptForm.reset();
  categoryInput.focus();
}

function renderPrompts(category) {
  const prompts = loadPrompts().filter((prompt) => prompt.category === category);

  resultsTitle.textContent = category ? `${category} prompts` : "Prompts";
  promptCount.textContent = `${prompts.length} saved`;
  promptList.innerHTML = "";

  if (!category) {
    promptList.className = "prompt-list empty-state";
    promptList.textContent = "Select a category and click Show to view saved prompts.";
    return;
  }

  if (prompts.length === 0) {
    promptList.className = "prompt-list empty-state";
    promptList.textContent = `No prompts saved in ${category} yet.`;
    return;
  }

  promptList.className = "prompt-list";

  prompts.forEach((prompt) => {
    const card = document.createElement("article");
    card.className = "prompt-card";
    card.textContent = prompt.text;
    promptList.appendChild(card);
  });
}

filterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderPrompts(categoryFilter.value);
});

addPromptForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const category = categoryInput.value;
  const text = promptText.value.trim();

  if (!category || !text) {
    return;
  }

  const prompts = loadPrompts();
  prompts.push({
    id: Date.now(),
    category,
    text,
    createdAt: new Date().toISOString()
  });

  savePrompts(prompts);
  categoryFilter.value = category;
  showHome();
  renderPrompts(category);
});

addPromptBtn.addEventListener("click", showAddForm);
cancelBtn.addEventListener("click", showHome);

populateCategories();
renderPrompts("");
