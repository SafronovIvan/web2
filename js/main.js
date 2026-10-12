// js/main.js
import { buildUI } from './ui.js';
import { loadTasks, saveTasks } from './storage.js';
import { createTask } from './tasks.js';
import { applyFilters } from './filters.js';
import { enableDragAndDrop } from './dragdrop.js';

// === Инициализация ===
const ui = buildUI();

/** @type {Array<{id:string,title:string,date:string,done:boolean,createdAt:number,order:number}>} */
let tasks = loadTasks();

// Текущее состояние UI
const state = {
  query: '',
  status: 'all',
  sort: 'manual',
  editingId: null,
};

// === Обновление интерфейса ===
function render() {
  const visible = applyFilters(tasks, state);

  ui.list.innerHTML = '';
  visible.forEach(task => ui.list.append(renderTask(task)));

  // Пустое состояние
  ui.empty.hidden = visible.length > 0;

  // Счётчик
  const done = tasks.filter(t => t.done).length;
  ui.counter.textContent = `Всего: ${tasks.length} · Выполнено: ${done}`;
}

function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task';
  li.dataset.id = task.id;
  li.draggable = true;
  if (task.done) li.classList.add('task--done');
  if (state.editingId === task.id) li.classList.add('task--editing');

  // Чекбокс
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task__checkbox';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', 'Отметить как выполненную');
  checkbox.addEventListener('change', () => toggleDone(task.id));

  // Тело задачи
  const body = document.createElement('div');
  body.className = 'task__body';

  if (state.editingId === task.id) {
    // --- Режим редактирования ---
    const row = document.createElement('div');
    row.className = 'task__edit-row';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'task__edit-input';
    titleInput.value = task.title;

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'task__edit-date';
    dateInput.value = task.date || '';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'task__save';
    saveBtn.textContent = 'OK';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'task__cancel';
    cancelBtn.textContent = '×';

    row.append(titleInput, dateInput, saveBtn, cancelBtn);
    body.append(row);

    // Фокус на поле
    queueMicrotask(() => titleInput.focus());

    saveBtn.addEventListener('click', () => {
      updateTask(task.id, { title: titleInput.value, date: dateInput.value });
    });
    cancelBtn.addEventListener('click', () => {
      state.editingId = null;
      render();
    });
    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveBtn.click();
      if (e.key === 'Escape') cancelBtn.click();
    });
  } else {
    // --- Обычный режим ---
    const title = document.createElement('span');
    title.className = 'task__title';
    title.textContent = task.title;

    const date = document.createElement('time');
    date.className = 'task__date';
    if (task.date) {
      date.dateTime = task.date;
      date.textContent = formatDate(task.date);
    } else {
      date.textContent = '—';
    }

    body.append(title, date);
  }

  // Кнопки действий
  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'task__edit';
  editBtn.textContent = '✎';
  editBtn.setAttribute('aria-label', 'Редактировать');
  editBtn.addEventListener('click', () => {
    state.editingId = task.id;
    render();
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'task__delete';
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', 'Удалить');
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.append(checkbox, body, editBtn, deleteBtn);
  return li;
}

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// === CRUD ===
function addTask(title, date) {
  if (!title.trim()) return;
  const task = createTask(title, date);
  // Новые — в конец (максимальный order + 1)
  const maxOrder = tasks.reduce((m, t) => Math.max(m, t.order), 0);
  task.order = maxOrder + 1;
  tasks.push(task);
  persist();
  render();
}

function updateTask(id, patch) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  if (patch.title !== undefined) {
    const t = patch.title.trim();
    if (!t) return; // не разрешаем пустое название
    task.title = t;
  }
  if (patch.date !== undefined) task.date = patch.date;
  state.editingId = null;
  persist();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  persist();
  render();
}

function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  persist();
  render();
}

function clearDone() {
  tasks = tasks.filter(t => !t.done);
  persist();
  render();
}

function persist() {
  saveTasks(tasks);
}

// === События формы ===
ui.form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(ui.taskInput.value, ui.dateInput.value);
  ui.form.reset();
  ui.taskInput.focus();
});

// === Поиск / фильтр / сортировка ===
ui.searchInput.addEventListener('input', (e) => {
  state.query = e.target.value;
  render();
});
ui.filterSelect.addEventListener('change', (e) => {
  state.status = e.target.value;
  render();
});
ui.sortSelect.addEventListener('change', (e) => {
  state.sort = e.target.value;
  render();
});

// === Кнопка "удалить выполненные" ===
ui.clearDoneBtn.addEventListener('click', clearDone);

// === Drag-and-drop ===
enableDragAndDrop(ui.list, (orderedIds) => {
  // Пересчитываем order согласно новому порядку
  orderedIds.forEach((id, index) => {
    const t = tasks.find(x => x.id === id);
    if (t) t.order = index;
  });
  persist();
  // Перерисовываем только если сортировка ручная
  if (state.sort === 'manual') render();
});

// === Первый рендер ===
render();