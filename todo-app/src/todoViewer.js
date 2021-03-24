import EventEmitter from './emitter.js';
import DOMelement from './DOMcreator.js';
import { ACTIONS } from './constants/actions.js';

export default class View extends EventEmitter {
  constructor(elements) {
    super();

    this.elements = elements;
    this.input = this.elements.inputField;

    elements.addButton.addEventListener('click', () => this.emit(ACTIONS.DATA_ENTERED, this.input.value));
    elements.todoTable.addEventListener('click', (event) => { this.emit(ACTIONS.TABLE_CLICKED, event.target); });
    elements.todoTable.addEventListener('dblclick', (event) => { this.emit(ACTIONS.TABLE_DBLCLICKED, event.target); });
    elements.filterStatus.addEventListener('click', (event) => { this.emit(ACTIONS.NEW_STATUS, event.target.value); });
    elements.deleteCopmpletedBtn.addEventListener('click', (event) => this.emit(ACTIONS.DELETE_COMPLETED, event.target));
    window.addEventListener('beforeunload', () => { this.emit(ACTIONS.LEAVE_PAGE); });
    this.input.addEventListener('input', (event) => this.emit(ACTIONS.INPUT_MODIFIED, event.target.value));
  }

  renderQuantity(number) {
    document.querySelector('.quantity').innerHTML = `Items left: ${number}`;
  }

  resetInput() {
    this.input.value = '';
    document.getElementById('add-button').disabled = true;
    return this.input.value;
  }

  removeTodos() {
    const tableElements = document.querySelector('.todo-table');
    return Array.from(tableElements.children).forEach((child) => {
      if (child.classList.contains('table-item')) {
        child.remove();
      }
    });
  }

  renderTodos(data) {
    this.resetInput();
    this.removeTodos();
    data.todos.forEach((todo) => {
      const row = new DOMelement('tr', 'table.todo-table', 'table-item',
        `<td><input type ="checkbox" id="select"></td>
                </input><td><span id="text">${todo.text}</span></td>
                <td><input type="button" id="delete" value="delete"></td>
                <td>${todo.dateFormat}</td>`, todo.id, todo.status);
      return row;
    });
    this.elements.filterStatus.value = data.status;
  }

  editTodo(data) {
    const editable = new DOMelement('input', data.parentElement, 'editable', data.innerHTML);
    data.remove();
    document.querySelector('.editable').addEventListener('focusout', (event) => { this.emit(ACTIONS.DATA_EDITED, event.target); });
    return editable;
  }

  resetCheckbox() {
    const checkbox = document.getElementById('select-all');
    checkbox.checked = false;
  }

  hideAddButton(bool) {
    const AddButton = document.getElementById('add-button');
    AddButton.disabled = !bool;
  }
}
