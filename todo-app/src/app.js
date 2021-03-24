import Model from './todoModel.js';
import View from './todoViewer.js';
import Controller from './todoController.js';
import Storage from './storageModel.js';

window.addEventListener('load', () => {
  const storage = new Storage();
  const model = new Model(storage);
  const view = new View({
    inputField: document.getElementById('add-item'),
    addButton: document.getElementById('add-button'),
    todoTable: document.querySelector('.todo-table'),
    deleteBtn: document.getElementById('delete'),
    deleteCopmpletedBtn: document.getElementById('delete-completed'),
    filterStatus: document.getElementById('filterByStatus'),
    body: document.querySelector('body'),
  });
  const controller = new Controller(model, view);
  controller.run();
});
