import Model from './todoModel.js';
import View from './todoViewer.js';
import Controller from './todoController.js';
import Storage from './storageModel.js';

window.addEventListener('load', () => {
  const storage = new Storage();
  const model = new Model(storage);
  const view = new View({
    inputField: document.getElementById('add-item'),
    todoTable: document.querySelector('.todo-table'),
    selectAll: document.getElementById('select-all'),
    deleteCopmpletedBtn: document.getElementById('delete-completed'),
    filterStatus: document.getElementById('filterByStatus'),
    date: document.getElementById('date'),
  });

  const controller = new Controller(model, view);
  controller.run();
});
