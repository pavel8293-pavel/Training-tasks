import EventEmitter from './emitter.js';
import { ACTIONS } from './constants/actions.js';
import { STATUS } from './constants/status.js';
import { replaceEscapedChar } from './inputEscaper.js';

export default class Model extends EventEmitter {
  constructor(data) {
    super();
    this.data = data;
    this.filtered = [];
    this.sorted = 0
  }

  start() {
    this.refreshTodos();
  }

  refreshTodos(todos = this.data.getTodos()) {
    this.filterByStatus(this.data.getStatus(), todos);
    this.emit(ACTIONS.COUNTER_CHANGED, this.data.filterByStatus(STATUS.EMPTY));
  }

  newTodo(todo) {
    if (todo.pattern)
      this.emit(ACTIONS.TODO_CREATED, this.data.createTodo(todo.todo));
  }

  addTodo(todo) {
    this.data.addTodo(todo)
    this.emit(ACTIONS.TODOLIST_CHANGED, this.data.getTodos());
  }

  sortByDate() {
    this.emit(ACTIONS.TODOLIST_CHANGED, this.data.sortTodos(this.sorted));
    this.sorted = !this.sorted
  }

  toggleStatus(status) {
    this.data.setStatus(status)
    this.emit(ACTIONS.STATUS_SET);
  }

  filterByStatus(status, todos) {
    switch (status) {
      case STATUS.ALL:
        this.emit(ACTIONS.DATA_MODIFIED, { todos, status });
        break;
      case STATUS.COMPLETED:
        this.filtered = todos.filter((todo) => todo.checked === STATUS.CHECKED);
        this.emit(ACTIONS.DATA_MODIFIED, { todos: this.filtered, status });
        break;
      case STATUS.INCOMPLETED:
        this.filtered = todos.filter((todo) => todo.checked === '');
        this.emit(ACTIONS.DATA_MODIFIED, { todos: this.filtered, status });
        break;
      default: throw new Error('unexpected status');
    }
  }

  saveEditedItem(id, updatedText) {
    this.emit(ACTIONS.TODOLIST_CHANGED, this.data.saveEditedItem(id, replaceEscapedChar(updatedText)));
  }

  deleteCompleted() {
    this.data.deleteCompleted()
    this.emit(ACTIONS.COMPLETED_REMOVED);
    this.emit(ACTIONS.COUNTER_CHANGED, this.data.filterByStatus(STATUS.EMPTY));
  }

  deleteItem(id) {
    this.data.deleteItem(id)
    this.emit(ACTIONS.ITEM_REMOVED, id);
    this.emit(ACTIONS.COUNTER_CHANGED, this.data.filterByStatus(STATUS.EMPTY));
  }

  toggleCheckedAll(bool) {
    this.data.toggleCheckedAll(bool)
    this.emit(ACTIONS.TODO_STATE_CHANGED, { 
      todos: this.data.getTodos(),
      checked: this.data.filterByStatus(STATUS.CHECKED) })
  }

  toggleChecked(id) {
    this.data.toggleChecked(id)
    this.emit(ACTIONS.TODO_STATE_CHANGED, { 
      todos: this.data.getTodos(),
      checked: this.data.filterByStatus(STATUS.CHECKED) })
  }

  setState() {
    this.data.setData();
  }
}
