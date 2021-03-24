export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  emit(eventName, ...args) {
    if (eventName && args) {
      const event = this.events[eventName];
      event.forEach((callback) => callback(...args));
    } else if (eventName && !args) {
      const event = this.events[eventName];
      return event;
    } else {
      throw new Error('Define listener for current emit event');
    }
    return eventName;
  }
}
