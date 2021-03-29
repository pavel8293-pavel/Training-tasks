import { STORAGE_KEYS } from './constants/storage-keys.js';
import { STATUS } from './constants/status.js';

export default class Storage {
  
  setData(statusValue, todos) {
    if (typeof statusValue === 'string') {
      localStorage.setItem(STORAGE_KEYS.STATUS, statusValue);
    } else {
      throw new Error('Unexpected status format');
    }
    if (typeof todos === 'object') {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    } else {
      throw new Error('Unexpected todos format');
    }
  }

  getTodos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS)) || [];
  }

  getStatus() {
    return localStorage.getItem(STORAGE_KEYS.STATUS) || STATUS.ALL;
  }


}
