// js/tasks.js

export function createTask(title, date) {
  return {
    id: makeId(),
    title: title.trim(),
    date: date || '',
    done: false,
    createdAt: Date.now(),
    order: Date.now(),
  };
}

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 't-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}