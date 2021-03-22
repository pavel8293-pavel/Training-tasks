import { EMITS } from './emits.js'
export default class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        model.on(EMITS.DATA_MODIFIED, (data) => this.view.render(data))
        model.on(EMITS.COMPLETED_REMOVED, () => this.view.resetCheckbox())
        model.on(EMITS.COUNTER_CHANGED, (number) => this.view.counter(number))
        view.on(EMITS.DATA_ENTERED, (data) => this.model.add(data))
        view.on(EMITS.TABLE_CLICKED, (event) => { this.process(event) })
        view.on(EMITS.TABLE_DBLCLICKED, (event) => { this.edit(event) })
        view.on(EMITS.NEW_STATUS, (state) => { model.setState(state) })
        view.on(EMITS.DELETE_COMPLETED, () => this.model.deleteCompleted())
        view.on(EMITS.DATA_EDITED, (event) => this.saveStorage(event))
        view.on(EMITS.DATE_CLICKED, (event) => this.model.sortByDate(event))
    }

    run() {
        this.model.getState()
    }

    process(event) {
        const id = Number(event.parentElement.parentElement.id)
        switch (event.id) {
            case ("select-all"):
                this.model.toggleAll(event.checked)
                break;
            case ("select"):
                this.model.toggle(id)
                break;
            case ("delete"):
                this.model.delete(id)
                break;
            case ("date"):
                this.model.sortByDate()
                break;
            default: return;
        }
    }

    edit(event) {
        const id = Number(event.parentElement.parentElement.id)
        if (event.id === "text") {
            this.model.edit(id)
        }
    }

    saveStorage(event) {
        const id = Number(event.parentElement.parentElement.id)
        if (event.id === "text") {
            this.model.saveStorage(id, event.innerHTML)
        }
    }
}