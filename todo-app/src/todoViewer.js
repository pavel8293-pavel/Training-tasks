import EventEmitter from './emitter.js'
import DOMelement from './DOMcreator.js'
import { EMITS, STATUS,KEYS } from './emits.js'
export default class View extends EventEmitter {
    constructor(elements) {
        super();

        this.elements = elements
        this.input = this.elements.inputField

        elements.addButton.addEventListener('click', () => this.emit(EMITS.DATA_ENTERED, this.input.value));
        elements.todoTable.addEventListener('click', (event) => { this.emit(EMITS.TABLE_CLICKED, event.target) });
        elements.todoTable.addEventListener('dblclick', (event) => { this.emit(EMITS.TABLE_DBLCLICKED, event.target) })
        elements.filter.addEventListener('click', (event) => { this.emit(EMITS.NEW_STATUS, event.target.value) })
        elements.todoTable.addEventListener('focusout', (event) => {this.emit(EMITS.DATA_EDITED, event.target)});
        elements.deleteCopmpletedBtn.addEventListener('click', (event) => this.emit(EMITS.DELETE_COMPLETED, event.target));

    }
counter(number){
    document.querySelector('.quantity').innerHTML = `Items left: ${number}`
}
    reset() {
        this.input.value = ''
        return this.input.value
    }

    remove() {
        const tableElements = document.querySelector('.todo-table')
        Array.from(tableElements.children).forEach(child => {
            if (child.classList.contains('table-item')) {
                child.remove()
            }
        })
    }

    render(todos) {
        this.reset()
        this.remove()
        todos.forEach((todo) => {
            const row = new DOMelement('tr', 'table.todo-table', 'table-item', todo.id, todo.status,
                `<td><input type ="checkbox" id="select"></td>
                </input><td><span id="text" class="editable" contenteditable="${todo.contenteditable}">${todo.text}</span></td>
                <td><input type="button" id="delete" value="delete"></td>
                <td>${todo.date}-${todo.month}-${todo.year}</td>`)
        });
        this.onfocus()
        filter.value = localStorage.getItem(KEYS.STATUS)
    }

    onfocus() {
        const editable = document.querySelectorAll('.editable')
        editable.forEach(item => {
            if (item.contentEditable ) {
                return item.focus()
            }
        })
    }

    resetCheckbox() {
        const checkbox = document.getElementById('select-all')
        checkbox.checked = false
    }
}