import { generateId } from './helper.js';

export default class Todo {
  constructor(text) {
    this.id = generateId();
    this.text = text;
    this.checked = false;
    this.date = new Date();
  }

  static create(text) {
    return new Todo(text);
  }
}
