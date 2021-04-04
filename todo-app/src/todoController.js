import { ACTIONS } from './constants/actions.js';

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    model.on(ACTIONS.TODO_CREATED, () => this.view.resetInput());
    model.on(ACTIONS.TODO_LIST_CHANGED, () => this.model.filterByStatus());
    model.on(ACTIONS.TODOS_MODIFIED, (tableData) => {
      this.view.removeTodos();
      this.view.renderTodos(tableData.todos);
      this.view.renderStatus(tableData.status);
      this.view.renderQuantity(this.model.todosNumber());
    });
    model.on(ACTIONS.STATUS_SET, () => {
      this.model.filterByStatus();
    });
    model.on(ACTIONS.RESET_SELECT_ALL, () => this.view.resetCheckbox());

    view.on(ACTIONS.TEXT_ENTERED, (text) => this.model.createTodo(text));
    view.on(ACTIONS.NEW_STATUS, (status) => this.model.setStatus(status));
    view.on(ACTIONS.DELETE_CLICKED, (id) => this.model.deleteTodo(id));
    view.on(ACTIONS.DELETE_COMPLETED, () => this.model.deleteCompletedTodos());
    view.on(ACTIONS.SELECT_CLICKED, (id) => this.model.toggleChecked(id));
    view.on(ACTIONS.SELECT_ALL_CHANGED, (isChecked) => this.model.toggleCheckedAll(isChecked));
    view.on(ACTIONS.DATE_CLICKED, () => this.model.sortByDate());
    view.on(ACTIONS.TODO_EDITED, (data) => this.model.saveEditedItem(data.text, data.id));
  }

  run() {
    this.model.start();
  }
}
