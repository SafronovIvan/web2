// js/tasks.js

export function createTask(title, date) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    title: title.trim(),
    date: date || '',
    done: false,
    createdAt: Date.now(),
    order: Date.now(), // для ручной сортировки
  };
}