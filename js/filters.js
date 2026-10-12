// js/filters.js

/**
 * @param {Array} tasks
 * @param {{ query: string, status: 'all'|'active'|'done', sort: string }} opts
 */
export function applyFilters(tasks, { query, status, sort }) {
  let result = tasks.slice();

  // Поиск по названию (регистронезависимо)
  if (query) {
    const q = query.toLowerCase().trim();
    result = result.filter(t => t.title.toLowerCase().includes(q));
  }

  // Фильтр по статусу
  if (status === 'active') result = result.filter(t => !t.done);
  else if (status === 'done') result = result.filter(t => t.done);

  // Сортировка
  switch (sort) {
    case 'date-asc':
      result.sort(compareByDate(1));
      break;
    case 'date-desc':
      result.sort(compareByDate(-1));
      break;
    case 'title-asc':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'title-desc':
      result.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'manual':
    default:
      result.sort((a, b) => a.order - b.order);
      break;
  }

  return result;
}

function compareByDate(dir) {
  return (a, b) => {
    // Задачи без даты — в конец
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? -dir : a.date > b.date ? dir : 0;
  };
}