// js/dragdrop.js

export function enableDragAndDrop(listEl, onReorder) {
  let draggedEl = null;

  listEl.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.task');
    if (!item) return;
    draggedEl = item;
    item.classList.add('task--dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.dataset.id);
  });

  listEl.addEventListener('dragend', () => {
    if (draggedEl) draggedEl.classList.remove('task--dragging');
    listEl.querySelectorAll('.task--over').forEach(el => el.classList.remove('task--over'));
    draggedEl = null;
  });

  listEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = e.target.closest('.task');
    if (!target || target === draggedEl) return;

    listEl.querySelectorAll('.task--over').forEach(el => el.classList.remove('task--over'));
    target.classList.add('task--over');

    const rect = target.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    if (after) target.after(draggedEl);
    else target.before(draggedEl);
  });

  listEl.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!draggedEl) return;
    const orderedIds = [...listEl.querySelectorAll('.task')].map(el => el.dataset.id);
    onReorder(orderedIds);
  });
}