import { transformDateFormat, generateId } from './helper.js';

export default class Todo {
    constructor(text) {
        const date = new Date();
        this.id = generateId()
        this.text = text
        this.checked = false
        this.dateFormat = `${transformDateFormat(date.getDate())}-${transformDateFormat(1 + date.getMonth())}-${date.getFullYear()}`
        this.parseDate = Date.parse(date)
    }

    static create(text) {
        return new Todo(text)
    }

    static compareASC(TodoA, TodoB) {
        return TodoA.parseDate - TodoB.parseDate;
    }

    static compareDESC(TodoA, TodoB) {
        return TodoB.parseDate - TodoA.parseDate;
    }

    static filtered(todo) {
        switch(typeof this){
            case'boolean':
            if (todo.checked === this) {
                return todo
            }
            break;
            case'number':
            if (todo.id !== this) {
                return todo
            }
            break;
        }
    }

    static toggleAll(todo) {
        return todo.checked = this
    }

    static toggle(todo) {
        if (todo.id === this) {
            todo.checked = !todo.checked
        }
        return todo;
    }
}