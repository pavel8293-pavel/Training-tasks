import { STORAGE_KEYS } from './constants/storage-keys.js';
import { SORT_TYPE } from './constants/sort-orders.js';

import { STATUS } from './constants/status.js';
import Todo from './Todo.js';

export default class Storage {
  setData(statusValue, todos, sortOrder) {
    localStorage.setItem(STORAGE_KEYS.STATUS, statusValue);
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    localStorage.setItem(STORAGE_KEYS.SORT_ORDER, sortOrder);
  }

  setTodos(todos) {
    if (typeof todos === 'object') {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    } else {
      throw new Error('Unexpected todos format');
    }
  }

  setStatus(status) {
    if (typeof status === 'string') {
      localStorage.setItem(STORAGE_KEYS.STATUS, status);
    } else {
      throw new Error('Unexpected status format');
    }
  }

  setSortOrder(sortOrder) {
    if (typeof status === 'string') {
      localStorage.setItem(STORAGE_KEYS.SORT_ORDER, sortOrder);
    } else {
      throw new Error('Unexpected sort order format');
    }
  }

  getTodos() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS)) || [];
    return todos.map((todo) => Todo.restore(todo.text, todo.id, todo.checked, todo.date));
  }

  getStatus() {
    return localStorage.getItem(STORAGE_KEYS.STATUS) || STATUS.ALL;
  }

  getSortOrder() {
    return localStorage.getItem(STORAGE_KEYS.SORT_ORDER) || SORT_TYPE.ASC;
  }
}
