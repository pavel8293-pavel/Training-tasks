import EventEmitter from './emitter.js';
import { generateId, transformDateFormat } from './helper.js'
import { EMITS, STATUS,KEYS } from './emits.js'
export default class Model extends EventEmitter {
    constructor() {
        super();
        this.todos = JSON.parse(localStorage.getItem(KEYS.TODOS)) || []
        this.editedElement = ''
    }

    setTodo(list = this.todos) {
        localStorage.setItem(KEYS.TODOS, JSON.stringify(list))
        this.restart()
    }

    setState(state) {
        localStorage.setItem(KEYS.STATUS, state)
        this.filter(state)
    }

    getState() {
        if (!localStorage.getItem(KEYS.STATUS)) {
            localStorage.setItem(KEYS.STATUS, STATUS.ALL)
        }
        this.restart()
    }

    restart() {
        this.countTodo()
        this.filter(localStorage.getItem(KEYS.STATUS))
    }

    countTodo() {
        if (!JSON.parse(localStorage.getItem(KEYS.TODOS))) {
            localStorage.setItem(KEYS.TODOS, JSON.stringify(this.todos))
        }
        this.emit(EMITS.COUNTER_CHANGED, this.todos.filter(todo => todo.status === false).length)
    }

    filter(status) {
        switch (status) {
            case STATUS.ALL:
                this.emit(EMITS.DATA_MODIFIED, this.todos)
                break;
            case STATUS.COMPLETED:
                const completed = this.todos.filter(todo => todo.status === true)
                this.emit(EMITS.DATA_MODIFIED, completed)
                break;
            case STATUS.INCOMPLETED:
                const incompleted = this.todos.filter(todo => todo.status === false)
                this.emit(EMITS.DATA_MODIFIED, incompleted)
                break;
            default: throw new Error('unexpected status')
        }
    }

    add(text) {
        const date = new Date()
        const todo = {
            id: generateId(),
            text: text,
            status: false,
            contenteditable: false,
            year: date.getFullYear(),
            month: transformDateFormat(1 + date.getMonth()),
            date: transformDateFormat(date.getDate()),
            parseDate: Date.parse(date)
        }
        if (text) {
            this.todos.push(todo)
            this.setTodo(this.todos)
        }
    }

    sortByDate() {
        const todos = (localStorage.getItem(KEYS.TODOS))
        if (todos !== JSON.stringify(this.todos.sort((a, b) => b.parseDate - a.parseDate))) {
            this.setTodo(this.todos.sort((a, b) => b.parseDate - a.parseDate))
        } else {
            this.setTodo(this.todos.sort((a, b) => a.parseDate - b.parseDate))
        }
    }

    edit(id) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                todo.contenteditable = true
            }
            return todo
        })
        this.setTodo(this.todos)
    }

    saveStorage(id, updatedText) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                todo.text = updatedText
                todo.contenteditable = false
            }
            return todo
        })
        this.setTodo(this.todos)
    }

    deleteCompleted() {
        this.todos = this.todos.filter(todo => todo.status === false)
        this.setTodo(this.todos)
        this.emit(EMITS.COMPLETED_REMOVED)
    }

    delete(id) {
        this.todos = this.todos.filter(todo => todo.id !== id)
        this.setTodo(this.todos)
    }

    toggleAll(boolean) {
        this.todos.forEach(todo => todo.status = boolean)
        this.setTodo(this.todos)
    }

    toggle(id) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                todo.status = !todo.status
            }
            return todo
        })
        this.setTodo(this.todos)
    }
}