export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    //model.on(ACTIONS.DATA_MODIFIED, (data) => this.view.renderTodos(data));
  }
}
