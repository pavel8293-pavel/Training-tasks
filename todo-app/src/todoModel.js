import EventEmitter from './emitter.js';
import Todo from './todoFactory.js'
import { ACTIONS } from './constants/actions.js';
import { STATUS } from './constants/status.js';

export default class Model extends EventEmitter {
  constructor(storage) {
    super();
    this.storage = storage;
    this.status = this.storage.getStatus();
    this.todos = this.storage.getTodos();
    this.filtered = [];
    this.sorted = 0
  }

  start() {
    this.refreshTodos();
  }

  newTodo(text) {
    if (text) {
      this.emit(ACTIONS.TODO_CREATED, Todo.create(text));
    }
  }

  addTodo(todo) {
    this.getTodos().push(todo)
    this.emit(ACTIONS.TODO_LIST_CHANGED, this.getTodos());
  }

  refreshTodos(todos = this.getTodos()) {
    this.filterByStatus(this.getStatus(), todos);
  }

  filterByStatus(status, todos) {
    switch (status) {
      case STATUS.ALL:
        this.emit(ACTIONS.TODOS_MODIFIED, { todos: this.getTodos(), status });
        break;
      case STATUS.COMPLETED:
        this.filtered = todos.filter(Todo.filtered,true);
        this.emit(ACTIONS.TODOS_MODIFIED, { todos: this.filtered, status });
        break;
      case STATUS.INCOMPLETED:
        this.filtered = todos.filter(Todo.filtered,false);
        this.emit(ACTIONS.TODOS_MODIFIED, { todos: this.filtered, status });
        break;
      default: throw new Error('unexpected status');
    }
  }

  sortByDate() {
    if (this.sorted) {
      const sorted = this.getTodos().sort(Todo.compareASC)
      this.emit(ACTIONS.TODO_LIST_CHANGED, sorted);
    } else {
      const sorted = this.getTodos().sort(Todo.compareDESC)
      this.emit(ACTIONS.TODO_LIST_CHANGED, sorted);
    }
    this.sorted = !this.sorted
  }

  saveEditedItem(id, updatedText) {
    this.getTodos().map((todo) => {
      if (todo.id === id) {
        todo.text = updatedText;
      }
      return todo;
    });
    this.emit(ACTIONS.TODO_LIST_CHANGED, this.getTodos());
  }

  deleteCompletedTodos() {
    const todos = this.getTodos().filter(Todo.filtered,false)
    this.setTodos(todos)
    this.emit(ACTIONS.COMPLETED_DELETED);
  }

  deleteTodo(id) {
    const todos = this.getTodos().filter(Todo.filtered,id)
    this.setTodos(todos)
    this.emit(ACTIONS.TODO_DELETED, id);
  }

  toggleCheckedAll(bool) {
    this.getTodos().map(Todo.toggleAll,bool)
    this.emit(ACTIONS.TODO_LIST_CHANGED, this.getTodos());
  }

  toggleChecked(id) {
    this.getTodos().map(Todo.toggle,id)
    this.emit(ACTIONS.TODO_LIST_CHANGED, this.getTodos());
  }

  toggleStatus(status) {
    this.setStatus(status)
    this.emit(ACTIONS.STATUS_SET);
  }

  getTodos() {
    return this.todos
  }

  getStatus() {
    return this.status
  }

  setStatus(status) {
    this.status = status
  }

  setTodos(todos) {
    this.todos = todos
  }

  setData() {
    this.storage.setData(this.getStatus(), this.getTodos())
  }

  todosNumber() {
    const filtered = this.getTodos().filter(Todo.filtered,false).length
    if(filtered){
      this.emit(ACTIONS.RESET_SELECT_ALL);
    }
    return filtered
  }
}
