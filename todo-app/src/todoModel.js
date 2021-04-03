import EventEmitter from './emitter.js';
import Todo from './Todo.js';
import { ACTIONS } from './constants/actions.js';
import { STATUS } from './constants/status.js';
import { replaceEscapedChar } from './inputEscaper.js';

export default class Model extends EventEmitter {
  constructor(storage) {
    super();
    this.storage = storage;
    this.status = this.storage.getStatus();
    this.todos = this.storage.getTodos();
    this.filtered = [];
    this.isSorted = false;
  }

  start() {
    this.refreshTodos();
  }

  newTodo(text) {
    if (text) {
      const todo = Todo.create(replaceEscapedChar(text));
      this.addTodo(todo);
      this.emit(ACTIONS.TODO_CREATED);
    }
  }

  addTodo(todo) {
    const todos = this.getTodos();
    todos.push(todo);
    this.emit(ACTIONS.TODO_LIST_CHANGED, todos);
  }

  refreshTodos() {
    this.filterByStatus(this.getStatus(), this.getTodos());
  }

  filterByStatus(status, todos) {
    switch (status) {
      case STATUS.ALL:
        this.emit(ACTIONS.TODOS_MODIFIED, { todos, status });
        break;
      case STATUS.COMPLETED:
        this.filtered = todos.filter((todo) => todo.checked === true);
        this.emit(ACTIONS.TODOS_MODIFIED, { todos: this.filtered, status });
        break;
      case STATUS.INCOMPLETED:
        this.filtered = todos.filter((todo) => todo.checked === false);
        this.emit(ACTIONS.TODOS_MODIFIED, { todos: this.filtered, status });
        break;
      default: throw new Error('unexpected status');
    }
  }

  sortByDate() {
    const sorted = [...this.getTodos()];
    if (this.isSorted) {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      this.emit(ACTIONS.TODO_LIST_CHANGED, sorted);
    } else {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.emit(ACTIONS.TODO_LIST_CHANGED, sorted);
    }
    this.isSorted = !this.isSorted;
  }

  saveEditedItem(updatedText, id) {
    const todos = this.getTodos();
    todos.forEach((todo) => {
      if (todo.id === id) {
        todo.text = replaceEscapedChar(updatedText);
      }
      return todo;
    });
    this.emit(ACTIONS.TODO_LIST_CHANGED, todos);
  }

  deleteCompletedTodos() {
    const todos = this.getTodos().filter((todo) => todo.checked === false);
    this.emit(ACTIONS.TODO_LIST_CHANGED, todos);
  }

  deleteTodo(id) {
    const todos = this.getTodos().filter((todo) => todo.id !== id);
    this.emit(ACTIONS.TODO_LIST_CHANGED, todos);
  }

  toggleCheckedAll(bool) {
    const todos = this.getTodos();
    todos.forEach((todo) => {
      todo.checked = bool;
    });
    this.emit(ACTIONS.TODO_LIST_CHANGED, todos);
  }

  toggleChecked(id) {
    const todos = this.getTodos();
    todos.forEach((todo) => {
      if (todo.id === id) {
        todo.checked = !todo.checked;
      }
    });
    this.emit(ACTIONS.TODO_LIST_CHANGED, todos);
  }

  toggleStatus(status) {
    this.setStatus(status);
    this.emit(ACTIONS.STATUS_SET);
  }

  getTodos() {
    return this.todos;
  }

  getStatus() {
    return this.status;
  }

  setStatus(status) {
    this.status = status;
  }

  setTodos(todos) {
    this.todos = todos;
  }

  setData() {
    this.storage.setData(this.getStatus(), this.getTodos());
  }

  todosNumber() {
    const filtered = this.getTodos().filter((todo) => todo.checked === false).length;
    if (filtered || !this.getTodos().length) {
      this.emit(ACTIONS.RESET_SELECT_ALL);
    }
    return filtered;
  }
}
