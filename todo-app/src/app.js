import Model from './todoModel.js';
import View from './todoViewer.js';
import Controller from './todoController.js';
import Storage from './storageModel.js';
import todoData from './todoData.js'

window.addEventListener('load', () => {
  const storage = new Storage();
  const data = new todoData(storage);
  const model = new Model(data);
  const view = new View({
    inputField: document.getElementById('add-item'),
    todoTable: document.querySelector('.todo-table'),
    deleteBtn: document.getElementById('delete'),
    deleteCopmpletedBtn: document.getElementById('delete-completed'),
    filterStatus: document.getElementById('filterByStatus'),
    body: document.querySelector('body'),
  });
  const controller = new Controller(model, view);
  controller.run();
});
