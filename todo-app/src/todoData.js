import { transformDateFormat, generateId } from './helper.js';
import { STATUS } from './constants/status.js';
import {replaceReEscapedChar} from './inputEscaper.js'

export default class todoData {
    constructor(storage) {
        super()
        this.storage = storage
        this.status = this.storage.getStatus();
        this.todos = this.storage.getTodos();
    }

    getStatus() {
        return this.status
    };

    getTodos() {
        return this.todos
    }

    createTodo(text) {
        const date = new Date();
        return {
            id: generateId(),
            text: text.trim(),
            checked: '',
            dateFormat: `${transformDateFormat(date.getDate())}-${transformDateFormat(1 + date.getMonth())}-${date.getFullYear()}`,
            parseDate: Date.parse(date),
        }
    }

    addTodo(todo) {
        this.todos.push(todo)
    }

    setStatus(status) {
        this.status = status
    }

    setData() {
        this.storage.setData(this.status, this.todos)
    }

    sortTodos(num) {
        if (num) {
            this.todos.sort((a, b) => a.parseDate - b.parseDate)
        } else {
            this.todos.sort((a, b) => b.parseDate - a.parseDate)
        }
    }

    filterByStatus(status) {
        const filtered = this.todos.filter((todo) => todo.checked === status).length
        return filtered
    }

    saveEditedItem(id, updatedText) {
        this.todos = this.todos.map((todo) => {
            if (todo.id === id) {
                todo.text = replaceReEscapedChar(updatedText);
            }
            return todo;
        });
    }

    toggleChecked(id) {
        this.todos = this.todos.map((todo) => {
            if (todo.id === id) {
                if (todo.checked === STATUS.CHECKED) {
                    todo.checked = STATUS.EMPTY
                } else {
                    todo.checked = STATUS.CHECKED
                }
            }
            return todo;
        });
    }

    toggleCheckedAll(bool) {
        this.todos.forEach((todo) => {
            if (bool) {
                todo.checked = STATUS.CHECKED
            } else {
                todo.checked = STATUS.EMPTY;
            }
        });
        return this.todos
    }

    deleteItem(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
    }

    deleteCompleted() {
        this.todos = this.todos.filter((todo) => todo.checked === STATUS.EMPTY);
    }
}