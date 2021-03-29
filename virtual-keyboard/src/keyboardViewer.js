import EventEmitter from './emitter.js';

export default class View extends EventEmitter {
  constructor(elements) {
    super();

    this.elements = elements;
    //elements.deleteCopmpletedBtn.addEventListener('click', (event) => this.emit(ACTIONS.DELETE_COMPLETED, event.target));
  }
}
