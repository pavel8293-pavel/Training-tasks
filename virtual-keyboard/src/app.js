import Model from './todoModel.js';
import View from './todoViewer.js';
import Controller from './todoController.js';
window.addEventListener('load', () => {
  const model = new Model();
  const view = new View({
    //inputField: document.getElementById('add-item'),
  });
  const controller = new Controller(model, view);
  view.render()
});
