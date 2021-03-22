import Model from './todoModel.js'
import View from './todoViewer.js'
import Controller from './todoController.js'

window.addEventListener('load', () => {
  const model = new Model();
  const view = new View({
    inputField : document.getElementById('add-item'),
    addButton : document.getElementById('add-button'),
    todoTable : document.querySelector('.todo-table'),
    deleteBtn : document.getElementById('delete'),
    deleteCopmpletedBtn : document.getElementById('delete-completed'),
    filter:document.getElementById('filter')
  });
  const controller = new Controller(model, view);
  controller.run();
});