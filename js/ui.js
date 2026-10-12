// js/ui.js

/**
 * Создаёт всю структуру страницы и возвращает ссылки на ключевые элементы.
 */
export function buildUI() {
  // Защита от повторного добавления <link>
  if (!document.querySelector('link[data-app-style]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './css/style.css';
    link.dataset.appStyle = '';
    document.head.append(link);
  }

  const app = document.createElement('main');
  app.className = 'app';

  // === HEADER ===
  const header = document.createElement('header');
  header.className = 'app__header';

  const title = document.createElement('h1');
  title.className = 'app__title';
  title.textContent = 'To-Do List';

  header.append(title);

  // === FORM ===
  const form = document.createElement('form');
  form.className = 'task-form';
  form.setAttribute('novalidate', '');

  const taskInput = document.createElement('input');
  taskInput.type = 'text';
  taskInput.className = 'task-form__input';
  taskInput.placeholder = 'Название задачи...';
  taskInput.setAttribute('aria-label', 'Название задачи');
  taskInput.maxLength = 120;
  taskInput.required = true;

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.className = 'task-form__date';
  dateInput.setAttribute('aria-label', 'Дата задачи');

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'task-form__submit';
  submitBtn.textContent = 'Добавить';

  form.append(taskInput, dateInput, submitBtn);

  // === CONTROLS ===
  const controls = document.createElement('section');
  controls.className = 'controls';

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.className = 'controls__search';
  searchInput.placeholder = 'Поиск по названию...';
  searchInput.setAttribute('aria-label', 'Поиск задач');

  const filterSelect = document.createElement('select');
  filterSelect.className = 'controls__filter';
  filterSelect.setAttribute('aria-label', 'Фильтр по статусу');

  [
    { value: 'all', label: 'Все' },
    { value: 'active', label: 'Активные' },
    { value: 'done', label: 'Выполненные' },
  ].forEach(({ value, label }) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    filterSelect.append(opt);
  });

  const sortSelect = document.createElement('select');
  sortSelect.className = 'controls__sort';
  sortSelect.setAttribute('aria-label', 'Сортировка');

  [
    { value: 'manual', label: 'По порядку' },
    { value: 'date-asc', label: 'Дата ↑' },
    { value: 'date-desc', label: 'Дата ↓' },
    { value: 'title-asc', label: 'Название A→Z' },
    { value: 'title-desc', label: 'Название Z→A' },
  ].forEach(({ value, label }) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    sortSelect.append(opt);
  });

  controls.append(searchInput, filterSelect, sortSelect);

  // === LIST ===
  const list = document.createElement('ul');
  list.className = 'task-list';
  list.setAttribute('aria-live', 'polite');

  // === EMPTY STATE ===
  const empty = document.createElement('p');
  empty.className = 'task-list__empty';
  empty.textContent = 'Задач пока нет';
  empty.hidden = true;

  // === FOOTER ===
  const footer = document.createElement('footer');
  footer.className = 'app__footer';

  const counter = document.createElement('span');
  counter.className = 'app__counter';
  counter.textContent = 'Всего: 0';

  const clearDoneBtn = document.createElement('button');
  clearDoneBtn.type = 'button';
  clearDoneBtn.className = 'app__clear-done';
  clearDoneBtn.textContent = 'Удалить выполненные';

  footer.append(counter, clearDoneBtn);

  // === СБОРКА ===
  app.append(header, form, controls, list, empty, footer);
  document.body.append(app);

  return {
    app,
    form,
    taskInput,
    dateInput,
    submitBtn,
    searchInput,
    filterSelect,
    sortSelect,
    list,
    empty,
    counter,
    clearDoneBtn,
  };
}