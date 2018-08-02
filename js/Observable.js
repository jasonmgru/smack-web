/**
 * Class which holds data and also notifies any observing functions
 * of a data change.
 */
class Observable {

    /**
     * Adds a function to the observers list. Whenever the data in this object is 
     * updated, all observers are called with the new value passed in as a
     * parameter.
     * 
     * @param {(*) => void} observer The observer to be added.
     */
    subscribe(observer) {
        this.observers.push(observer);
    }

    /**
     * Removes a function from the observers list.
     * 
     * @param {(*) => void} observer The observer to be removed.
     */
    unsubscribe(observer) {
        var index = this.observers.indexOf(observer);
        if (index > -1) this.observers.splice(index, 1);
    }

    /**
     * Sets the value of the data and notifies observers.
     * 
     * @param {*} newValue The new value for the data.
     */
    set(newValue) {
        if (newValue !== this.value) {
            this.value = newValue;
            this.observers.forEach((subscriber) => subscriber(this.value));
        }
    }

    constructor(value) {
        this.value = value;
        this.observers = [];
    }
}

/**
 * Class which holds lists of data and also notifies any observing functions
 * of a data change.
 */
class ObservableList {

    /**
     * Adds a function to the observers list. Whenever the data in this object is 
     * updated, all observers are called with the new value passed in as a
     * parameter.
     * 
     * @param {(*, number) => void} observer The observer to be added.
     */
    subscribe(observer) {
        this.observers.push(observer);
    }

    /**
     * Removes a function from the observers list.
     * 
     * @param {(*, number) => void} observer The observer to be removed.
     */
    unsubscribe(observer) {
        var index = this.observers.indexOf(observer);
        if (index > -1) this.observers.splice(index, 1);
    }

    /**
     * Pushes a new value to the list and notifies observers of the index of the change.
     * 
     * @param {*} newValue The new value for the data.
     */
    push(newValue) {
        this.value.push(newValue);
        this.observers.forEach((subscriber) => subscriber(newValue, this.value.length-1));
    }

    constructor() {
        this.value = [];
        this.observers = [];
    }
}