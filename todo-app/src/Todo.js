import { generateId } from './helpers.js';

export default class Todo {
  constructor(text, id = generateId(), checked = false, date = new Date()) {
    this.text = text;
    this.id = id;
    this.checked = checked;
    this.date = date;
  }

  static create(text) {
    return new Todo(text);
  }

  static restore(text, id, checked, date) {
    return new Todo(text, id, checked, new Date(date));
  }
}
