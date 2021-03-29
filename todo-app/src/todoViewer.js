import EventEmitter from './emitter.js';
import { rowTemplate } from './rowTemplate.js';
import { ACTIONS } from './constants/actions.js';
import { replaceEscapedChar } from './inputEscaper.js';
import { createInput } from './helper.js'

export default class View extends EventEmitter {
  constructor(elements) {
    super();

    this.elements = elements;
    this.input = this.elements.inputField;

    elements.todoTable.addEventListener('click', (event) => { this.emit(ACTIONS.TABLE_CLICKED, event.target); });
    elements.todoTable.addEventListener('dblclick', (event) => { this.emit(ACTIONS.TABLE_DBLCLICKED, event.target); });
    elements.filterStatus.addEventListener('change', (event) => { this.emit(ACTIONS.NEW_STATUS, event.target.value); });
    elements.deleteCopmpletedBtn.addEventListener('click', (event) => this.emit(ACTIONS.DELETE_COMPLETED, event.target));
    window.addEventListener('unload', () => { this.emit(ACTIONS.LEAVE_PAGE); });
    this.input.addEventListener('blur', (event) => { this.emit(ACTIONS.DATA_ENTERED, this.validateEnteredData(event.target.value)) });
  }

  renderQuantity(number) {
    document.querySelector('.quantity').innerHTML = `Items left: ${number}`;
  }


  resetInput() {
    this.input.value = '';
    return this.input.value;
  }

  removeOldTodos() {
    const tableElements = document.querySelector('tbody');
    return Array.from(tableElements.children).forEach((child) => {
      if (child.classList.contains('table-item')) {
        child.remove();
      }
    });
  }

  removeItem(id) {
    const tableElements = document.querySelectorAll('.table-item');
    tableElements.forEach(todo => {
      if (todo.id === id.toString()) {
        todo.remove()
      }
    })
  }

  removeCompletedItems() {
    const tableElements = document.querySelectorAll('.table-item');
    tableElements.forEach(todo => {
      if (todo.children[0].children[0].checked === true) {
        todo.remove()
      }
    })
  }

  removeNode(node) {
    node.remove()
  }

  resetCheckbox() {
    const checkbox = document.getElementById('select-all');
    checkbox.checked = false;
  }

  renderTodos(data) {
    data.todos.forEach((todo) => {
      const node = document.createElement('tr')
      node.className = "table-item"
      node.id = todo.id
      document.querySelector('tbody').append(node)
      node.innerHTML = rowTemplate(todo)
    });
    this.elements.filterStatus.value = data.status;
  }

  editTodo(node) {
    createInput(node).addEventListener('focusout', (event) => {
      this.emit(ACTIONS.DATA_EDITED, { text: this.validateEnteredData(event.target.value), node: event.target });
    })
    this.emit(ACTIONS.EDITION_FIELD_ADDED, node);
  }

  validateEnteredData(todo) {
    const pattern = /\d|\w+|[А-Яа-яёЁ]/;
    return { todo: replaceEscapedChar(todo), pattern: pattern.test(todo) };
  }

}
