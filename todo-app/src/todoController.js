import { ACTIONS } from './constants/actions.js';

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    model.on(ACTIONS.DATA_MODIFIED, (data) => {
      this.view.removeOldTodos()
      this.view.renderTodos(data)
    });

    model.on(ACTIONS.TODO_CREATED, (todo) => {
      this.model.addTodo(todo),
      this.view.resetInput()
    });

    model.on(ACTIONS.TODO_STATE_CHANGED, (data) => {
      if (data.checked === 0) {
       this.view.resetCheckbox() }
      this.model.refreshTodos(data.todos)
    });

    model.on(ACTIONS.TODOLIST_CHANGED, (data) => this.model.refreshTodos(data));
    model.on(ACTIONS.COMPLETED_REMOVED, () => this.view.removeCompletedItems());
    model.on(ACTIONS.COUNTER_CHANGED, (number) => this.view.renderQuantity(number))
    model.on(ACTIONS.STATUS_SET, () => this.model.refreshTodos());
    model.on(ACTIONS.ITEM_REMOVED, (id) => this.view.removeItem(id));

    view.on(ACTIONS.DATA_ENTERED, (data) => {this.model.newTodo(data) });
    view.on(ACTIONS.TABLE_CLICKED, (event) => { this.process(event); });
    view.on(ACTIONS.NEW_STATUS, (state) => { this.model.toggleStatus(state); });
    view.on(ACTIONS.DELETE_COMPLETED, () => this.model.deleteCompleted());
    view.on(ACTIONS.TABLE_DBLCLICKED, (event) => { this.editTodo(event); });
    view.on(ACTIONS.DATA_EDITED, (event) => this.saveEditedItem(event));
    view.on(ACTIONS.EDITION_FIELD_ADDED, (node) => this.view.removeNode(node));
    view.on(ACTIONS.LEAVE_PAGE, () => this.model.setState());

  }

  run() {
    this.model.start();
  }

  process(event) {
    const id = Number(event.parentElement.parentElement.id);
    switch (event.id) {
      case ('select-all'):
        this.model.toggleCheckedAll(event.checked);
        break;
      case ('select'):
        this.model.toggleChecked(id);
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

  saveEditedItem(data) {
    const id = Number(data.node.parentElement.parentElement.id);
    if (data.node.type === 'text' && data.text.pattern !== false) {
      this.model.saveEditedItem(id, data.text.todo);
    }
  }
}

