import { STORAGE_KEYS } from './constants/storage-keys.js';
import { STATUS } from './constants/status.js';
import Todo from './Todo.js';

export default class Storage {
  setData(statusValue, todos) {
    localStorage.setItem(STORAGE_KEYS.STATUS, statusValue);
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  }

  getTodos() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS));
    return todos.map((todo) => Todo.restore(todo.text, todo.id, todo.checked, todo.date)) || [];
  }

  getStatus() {
    return localStorage.getItem(STORAGE_KEYS.STATUS) || STATUS.ALL;
  }
}
