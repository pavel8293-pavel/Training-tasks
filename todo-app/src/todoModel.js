import EventEmitter from './emitter.js';
import Todo from './Todo.js';
import { ACTIONS } from './constants/actions.js';
import { STATUS } from './constants/status.js';

export default class Model extends EventEmitter {
  constructor(storage) {
    super();
    this.storage = storage;
    this.status = this.storage.getStatus();
    this.todos = this.storage.getTodos();
    this.filtered = [];
    this.isSortedDESC = false;
    window.addEventListener('unload', () => this.setData());
  }

  start() {
    this.filterByStatus();
  }

  createTodo(text) {
    if(text){
      const todo = Todo.create(text);
      const todos = this.getTodos();
      todos.push(todo);
      this.setTodos(todos);
      this.emit(ACTIONS.TODO_CREATED);
    }
  }

  filterByStatus(status = this.getStatus(), todos = this.getTodos()) {
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
    if (this.isSortedDESC) {
      sorted.sort((a, b) => a.date - b.date);
      this.setTodos(sorted);
    } else {
      sorted.sort((a, b) => b.date - a.date);
      this.setTodos(sorted);
    }
    this.isSortedDESC = !this.isSortedDESC;
  }

  saveEditedItem(updatedText, id) {
    const todos = this.getTodos();
    todos.forEach((todo) => {
      if (todo.id === id && updatedText) {
        todo.text = updatedText;
      }
      return todo;
    });
    this.setTodos(todos);
  }

  deleteCompletedTodos() {
    const todos = this.getTodos().filter((todo) => todo.checked === false);
    this.setTodos(todos);
  }

  deleteTodo(id) {
    const todos = this.getTodos().filter((todo) => todo.id !== id);
    this.setTodos(todos);
  }

  toggleCheckedAll(bool) {
    const todos = this.getTodos();
    todos.forEach((todo) => {
      todo.checked = bool;
    });
    this.setTodos(todos);
  }

  toggleChecked(id) {
    const todos = this.getTodos();
    todos.forEach((todo) => {
      if (todo.id === id) {
        todo.checked = !todo.checked;
      }
    });
    this.setTodos(todos);
  }

  getTodos() {
    return this.todos;
  }

  getStatus() {
    return this.status;
  }

  setStatus(status) {
    this.status = status;
    this.emit(ACTIONS.STATUS_SET);
  }

  setTodos(todos) {
    this.todos = todos;
    this.emit(ACTIONS.TODO_LIST_CHANGED);
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
