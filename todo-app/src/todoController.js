import { ACTIONS } from './constants/actions.js';

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    model.on(ACTIONS.DATA_MODIFIED, (data) => this.view.renderTodos(data));
    model.on(ACTIONS.COMPLETED_REMOVED, () => this.view.resetCheckbox());
    model.on(ACTIONS.COUNTER_CHANGED, (number) => this.view.renderQuantity(number));
    model.on(ACTIONS.DATA_VALIDATED, (bool) => this.view.hideAddButton(bool));
    model.on(ACTIONS.NO_COMPLETED_TODOS, () => this.view.resetCheckbox());
    view.on(ACTIONS.DATA_ENTERED, (data) => this.model.createItem(data));
    view.on(ACTIONS.TABLE_CLICKED, (event) => { this.process(event); });
    view.on(ACTIONS.NEW_STATUS, (state) => { this.model.toggleStatus(state); });
    view.on(ACTIONS.DELETE_COMPLETED, () => this.model.deleteCompleted());
    view.on(ACTIONS.TABLE_DBLCLICKED, (event) => { this.editTodo(event); });
    view.on(ACTIONS.DATA_EDITED, (event) => this.saveEditedItem(event));
    view.on(ACTIONS.DATE_CLICKED, (event) => this.model.sortByDate(event));
    view.on(ACTIONS.INPUT_MODIFIED, (data) => this.trimData(data));
    view.on(ACTIONS.LEAVE_PAGE, () => this.model.setState());
  }

  run() {
    this.model.start();
  }

  process(event) {
    const id = Number(event.parentElement.parentElement.id);
    switch (event.id) {
      case ('select-all'):
        this.model.toggleStateAll(event.checked);
        break;
      case ('select'):
        this.model.toggleState(id);
        break;
      case ('delete'):
        this.model.deleteItem(id);
        break;
      case ('date'):
        this.model.sortByDate();
        break;
      default:
    }
  }

  editTodo(event) {
    if (event.id === 'text') {
      this.view.editTodo(event);
    }
  }

  saveEditedItem(event) {
    const id = Number(event.parentElement.parentElement.id);
    if (event.type === 'text') {
      this.model.saveEditedItem(id, event.value);
    }
  }

  trimData(data) {
    const trimmedData = data.trim();
    this.model.validateData(trimmedData);
  }
}
