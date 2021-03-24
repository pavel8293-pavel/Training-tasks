import EventEmitter from './emitter.js';
import { generateId, transformDateFormat } from './helper.js';
import { ACTIONS } from './constants/actions.js';
import { STATUS } from './constants/status.js';

export default class Model extends EventEmitter {
  constructor(storage) {
    super();
    this.storage = storage;
    this.status = this.storage.getStatus();
    this.todos = this.storage.getTodos();
    this.filtered = [];
  }

  start() {
    this.refreshTodos();
  }

  refreshTodos(todos = this.todos) {
    this.countTodo();
    this.filterByStatus(this.status, todos);
  }

  countTodo() {
    this.emit(ACTIONS.COUNTER_CHANGED, this.todos.filter((todo) => todo.status === false).length);
    if (!this.todos.filter((todo) => todo.status === true).length) {
      this.emit(ACTIONS.NO_COMPLETED_TODOS);
    }
  }

  toggleStatus(status) {
    this.status = status;
    this.filterByStatus(this.status, this.todos);
  }

  filterByStatus(status, todos) {
    switch (status) {
      case STATUS.ALL:
        this.emit(ACTIONS.DATA_MODIFIED, { todos, status });
        break;
      case STATUS.COMPLETED:
        this.filtered = todos.filter((todo) => todo.status === true);
        this.emit(ACTIONS.DATA_MODIFIED, { todos: this.filtered, status });
        break;
      case STATUS.INCOMPLETED:
        this.filtered = todos.filter((todo) => todo.status === false);
        this.emit(ACTIONS.DATA_MODIFIED, { todos: this.filtered, status });
        break;
      default: throw new Error('unexpected status');
    }
  }

  createItem(text) {
    const date = new Date();
    const todo = {
      id: generateId(),
      text,
      status: false,
      dateFormat: `${transformDateFormat(date.getDate())}-${transformDateFormat(1 + date.getMonth())}-${date.getFullYear()}`,
      parseDate: Date.parse(date),
    };
    this.todos.push(todo);
    this.refreshTodos();
  }

  sortByDate() {
    if (JSON.stringify(this.todos)
    !== JSON.stringify(this.todos.sort((a, b) => a.parseDate - b.parseDate))) {
      this.refreshTodos(this.todos.sort((a, b) => a.parseDate - b.parseDate));
    } else {
      this.refreshTodos(this.todos.sort((a, b) => b.parseDate - a.parseDate));
    }
  }

  saveEditedItem(id, updatedText) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        todo.text = updatedText;
      }
      return todo;
    });
    this.refreshTodos();
  }

  deleteCompleted() {
    this.todos = this.todos.filter((todo) => todo.status === false);
    this.refreshTodos();
    this.emit(ACTIONS.COMPLETED_REMOVED);
  }

  deleteItem(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.refreshTodos();
  }

  toggleStateAll(bool) {
    this.todos.forEach((todo) => {
      todo.status = bool;
    });
    this.refreshTodos();
  }

  toggleState(id) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        todo.status = !todo.status;
      }
      return todo;
    });
    this.refreshTodos();
  }

  validateData(data) {
    const pattern = /\d|\w+|[А-Яа-яёЁ]/;
    this.emit(ACTIONS.DATA_VALIDATED, pattern.test(data));
  }

  setState() {
    this.storage.setData(this.status, this.todos);
  }
}
