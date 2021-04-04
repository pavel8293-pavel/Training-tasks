import EventEmitter from './emitter.js';
import { rowTemplate } from './rowTemplate.js';
import { inputTemplate } from './inputTemplate.js';
import { ACTIONS } from './constants/actions.js';

export default class View extends EventEmitter {
  constructor(elements) {
    super();

    this.elements = elements;
    this.input = this.elements.inputField;

    elements.todoTable.addEventListener('click', (event) => {
      switch (event.target.name) {
        case ('select'):
          this.emit(ACTIONS.SELECT_CLICKED, this.getId(event));
          break;
        case ('delete'):
          this.emit(ACTIONS.DELETE_CLICKED, this.getId(event));
          break;
        default: return;
      }
    });
    elements.todoTable.addEventListener('dblclick', (event) => {
      if (event.target.tagName === 'SPAN') {
        this.editTodo(event.target);
      }
    });
    this.input.addEventListener('focus', () => this.resetInput());
    this.input.addEventListener('blur', (event) => this.emit(ACTIONS.TEXT_ENTERED, this.validateEnteredText(event.target.value)));
    elements.selectAll.addEventListener('change', (event) => this.emit(ACTIONS.SELECT_ALL_CHANGED, event.target.checked));
    elements.filterStatus.addEventListener('change', (event) => this.emit(ACTIONS.NEW_STATUS, event.target.value));
    elements.deleteCopmpletedBtn.addEventListener('click', (event) => this.emit(ACTIONS.DELETE_COMPLETED, event.target));
    elements.date.addEventListener('click', () => this.emit(ACTIONS.DATE_CLICKED));
  }

  removeTodos() {
    const tableElements = document.querySelector('tbody');
    return Array.from(tableElements.children).forEach((child) => {
      if (child.classList.contains('table-item')) {
        child.remove();
      }
    });
  }

  renderTodos(todos) {
    todos.forEach((todo) => document.querySelector('tbody').insertAdjacentHTML('beforeend', rowTemplate(todo)));
  }

  renderStatus(status) {
    this.elements.filterStatus.value = status;
  }

  resetInput() {
    this.input.value = '';
  }

  resetCheckbox() {
    const checkbox = document.getElementById('select-all');
    checkbox.checked = false;
  }

  editTodo(node) {
    this.createInput(node).addEventListener('focusout', (event) => {
      if (event.target.type === 'text') {
        this.emit(ACTIONS.TODO_EDITED, {
          text: this.validateEnteredText(event.target.value),
          id: this.getId(event),
        });
      }
    });
    node.remove();
  }

  createInput(node) {
    node.parentElement.insertAdjacentHTML('afterbegin', inputTemplate());
    const edit = document.querySelector('.editable');
    edit.value = node.textContent;
    edit.focus();
    return edit;
  }

  renderQuantity(number) {
    document.querySelector('.quantity').innerHTML = `Items left: ${number}`;
  }

  getId(event) {
    return Number(event.target.parentElement.parentElement.id);
  }

  validateEnteredText(text) {
    const RegExpPattern = /\S/g;
    if (RegExpPattern.test(text)) {
      this.passValidation();
      return text.trim();
    }else{
      this.failValidation();
    }
  }

  failValidation(){
    document.getElementById('nameError').classList.add("visible");
  }

  passValidation(){
    if(document.getElementById('nameError').classList.contains("visible"))
    document.getElementById('nameError').classList.remove("visible");
  }
}
