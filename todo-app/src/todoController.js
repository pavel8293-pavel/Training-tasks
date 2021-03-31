import { ACTIONS } from './constants/actions.js';
export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    model.on(ACTIONS.TODO_CREATED, (todo) => {
      this.model.addTodo(todo)
      this.view.resetInput()
    });
    model.on(ACTIONS.TODOS_MODIFIED, (todos) => {
      this.view.removeTodos()
      this.view.renderTodos(todos)
      this.view.renderQuantity(this.model.todosNumber())
    });
    model.on(ACTIONS.TODO_CHECKED_CHANGED, (data) => {
      if (data.checked === false) {
        this.view.resetCheckbox()
      }
      this.model.refreshTodos(data.todos)
    });
    model.on(ACTIONS.TODO_DELETED, (id) => {
      this.view.removeItem(id)
      this.view.renderQuantity(this.model.todosNumber())
    });
    model.on(ACTIONS.COMPLETED_DELETED, () => {
      this.view.deleteCompletedTodos()
      this.view.renderQuantity(this.model.todosNumber())
    });
    model.on(ACTIONS.TODO_LIST_CHANGED, (data) => this.model.refreshTodos(data));
    model.on(ACTIONS.STATUS_SET, () => this.model.refreshTodos());
    model.on(ACTIONS.RESET_SELECT_ALL, () => this.view.resetCheckbox());

    view.on(ACTIONS.TEXT_ENTERED, (text) => { this.model.newTodo(text) })
    view.on(ACTIONS.LEAVE_PAGE, () => this.model.setData());
    view.on(ACTIONS.NEW_STATUS, (status) => { this.model.toggleStatus(status); });
    view.on(ACTIONS.TABLE_CLICKED, (event) => { this.checkId(event) });
    view.on(ACTIONS.SELECT_ALL_CHANGED, (event) => { this.model.toggleCheckedAll(event.target.checked) });
    view.on(ACTIONS.DELETE_COMPLETED, () => this.model.deleteCompletedTodos());
    view.on(ACTIONS.DATE_CLICKED, () => this.model.sortByDate());
    view.on(ACTIONS.TABLE_DBLCLICKED, (event) => { this.editTodo(event); });
    view.on(ACTIONS.TODO_EDITED, (event) => this.saveEditedTodo(event));
    view.on(ACTIONS.EDITION_FIELD_ADDED, (node) => this.view.removeNode(node));
  }

  run() {
    this.model.start();
  }

  deleteTodo(event) {
    const id = Number(event.parentElement.parentElement.id);
    this.model.deleteTodo(id)
  }

  checkId(event) {
    const id = Number(event.parentElement.parentElement.id);
    switch (event.id) {
      case ('select'):
        this.model.toggleChecked(id);
        break;
      case ('delete'):
        this.model.deleteTodo(id)
        break;
      default:
        return;
    }
  }

  editTodo(event) {
    if (event.id === 'text') {
      this.view.editTodo(event);
    }
  }

  saveEditedTodo(data) {
    const id = Number(data.node.target.parentElement.parentElement.id);
    if (data.node.target.type === 'text') {
      this.model.saveEditedItem(id, data.text);
    }
  }
}

